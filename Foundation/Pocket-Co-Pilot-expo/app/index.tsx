import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';
import { useState, useRef } from 'react';
import { Audio } from 'expo-av';
import { recordSpeech } from '@/functions/recordSpeech';
import { transcribeSpeech } from '@/functions/transcribeSpeech';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Speech from 'expo-speech';
import { Platform } from "react-native";
import * as Device from "expo-device";
// import axios from 'axios';

export default function HomeScreen() {
  const [transcribedSpeech, setTranscribedSpeech] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [airportInfo, setAirportInfo] = useState("");
  const audioRecordingRef = useRef(new Audio.Recording());

  const startRecording = async () => {
    setIsRecording(true);
    await recordSpeech(audioRecordingRef);
  };

  const stopRecording = async () => {
    setIsRecording(false);
    setIsTranscribing(true);
    try {
      const speechTranscript = await transcribeSpeech(audioRecordingRef);
      setTranscribedSpeech(speechTranscript || "");
      await speakText(speechTranscript || "");
      await sendTranscribedSpeechToServer(speechTranscript || "");
    } catch (e) {
      console.error(e);
    } finally {
      setIsTranscribing(false);
    }
  };

  const sendTranscribedSpeechToServer = async (transcribedSpeech: string) => {
    try {
      const rootOrigin =
          Platform.OS === "android"
            ? Device.isDevice
              ? process.env.EXPO_PUBLIC_LOCAL_DEV_IP
              : "10.0.2.2"
            : Device.isDevice
            ? process.env.EXPO_PUBLIC_LOCAL_DEV_IP || "localhost"
            : "localhost";
      const response = await fetch(`${rootOrigin}/airportInfo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: transcribedSpeech }),
      });
  
      const data = await response.json();
      console.log(data);
      setAirportInfo(data.result);
      await speakText(data.result);
    } catch (error) {
      console.error('Error sending transcribed speech to server:', error);
    }
  };


  const speakText = async (text : string) => {
    try {
      await Speech.speak(text, {
        language: 'en-US',
        pitch: 1,
        rate: 1,
      });
    } catch (error) {
      console.error('Error speaking text:', error);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <SafeAreaView>
        <ScrollView style={styles.mainScrollContainer}>
          <View style={styles.mainInnerContainer}>
            <Text style={styles.title}>Pilot Co-Pilot</Text>
            <View style={styles.transcriptionContainer}>
              {isTranscribing ? (
                <ActivityIndicator size="small" color="#333333" />
              ) : (
                <Text
                  style={{
                    ...styles.transcribedSpeech,
                    color: transcribedSpeech ? "#333333" : "#999999",
                  }}
                >
                  {transcribedSpeech || "Your transcribed text will be shown here"}
                </Text>
              )}
            </View>
            <TouchableOpacity
              style={{
                ...styles.microphoneButton,
                opacity: isRecording || isTranscribing ? 0.5 : 1,
              }}
              onPressIn={startRecording}
              onPressOut={stopRecording}
              disabled={isRecording || isTranscribing}
            >
              {isRecording ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <FontAwesome name="microphone" size={40} color="#ffffff" />
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  mainScrollContainer: {
    height: '100%',
    width: '100%',
    padding: 20,
    backgroundColor: '#ffffff',
  },
  mainInnerContainer: {
    height: '100%',
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 35,
    padding: 5,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: '#333333',
  },
  transcriptionContainer: {
    backgroundColor: '#f5f5f5',
    width: "100%",
    height: 300,
    padding: 20,
    marginBottom: 20,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  microphoneButton: {
    backgroundColor: "#ff4444",
    width: 75,
    height: 75,
    justifyContent: "center", 
    borderRadius: 50,
    alignItems: "center",
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  transcribedSpeech: {
    fontSize: 20,
    padding: 5,
    color: "#333333",
    textAlign: "left",
    width: "100%",
  }
});


// const callPythonFunction = async (text: string) => {
  //   try {
  //     const response = await axios.post('/api/python-function', { text });
  //     setPythonResponse(response.data);
  //     await speakText(response.data);
  //   } catch (error) {
  //     console.error('Error calling Python function:', error);
  //   }
  // };
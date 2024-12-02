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
import HelpModal from './helpModal';
// import axios from 'axios';

export default function HomeScreen() {
  const [transcribedSpeech, setTranscribedSpeech] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [airportInfo, setAirportInfo] = useState("");
  const audioRecordingRef = useRef(new Audio.Recording());
  const [isHelpModalVisible, setIsHelpModalVisible] = useState(false);

  const toggleHelpModal = () => {
    setIsHelpModalVisible(!isHelpModalVisible);
  };

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
      console.log(transcribedSpeech);
      const response = await fetch(`${rootOrigin}/airportInfo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input: transcribedSpeech }),
      });
      console.log(response);
  
      const data = await response.json();
      console.log(`Return from server asking for airport info ${data}`);
      setAirportInfo(data);
      await speakText(data);
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
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#1a2a3a' }}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.mainScrollContainer}>
          <View style={styles.mainInnerContainer}>
            <View style={styles.headerContainer}>
              <FontAwesome name="plane" size={30} color="#7bb5e3" style={styles.headerIcon} />
              <Text style={styles.title}>Pilot Co-Pilot</Text>
              <TouchableOpacity 
                style={styles.helpButton} 
                onPress={toggleHelpModal}
              >
                <FontAwesome name="question-circle" size={24} color="#7bb5e3" />
              </TouchableOpacity>
            </View>
            
            {/* Main Panel */}
            <View style={styles.mainPanel}>
              <Text style={styles.panelLabel}>Voice Input</Text>
              <View style={styles.transcriptionContainer}>
                {isTranscribing ? (
                  <ActivityIndicator size="large" color="#7bb5e3" />
                ) : (
                  <Text style={styles.transcribedSpeech}>
                    {transcribedSpeech || "Speak to input your query..."}
                  </Text>
                )}
              </View>

              {/* Airport Info Panel */}
              <Text style={styles.panelLabel}>Airport Information</Text>
              <View style={styles.airportInfoContainer}>
                <Text style={styles.airportInfoText}>
                  {airportInfo || "Airport details will appear here..."}
                </Text>
              </View>

              {/* Record Button */}
              <TouchableOpacity
                style={[
                  styles.microphoneButton,
                  isRecording && styles.microphoneButtonActive
                ]}
                onPressIn={startRecording}
                onPressOut={stopRecording}
                disabled={isRecording || isTranscribing}
              >
                <View style={styles.microphoneInner}>
                  {isRecording ? (
                    <ActivityIndicator size="small" color="#ffffff" />
                  ) : (
                    <FontAwesome name="microphone" size={70} color="#ffffff" />
                  )}
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
      <HelpModal 
        isVisible={isHelpModalVisible} 
        onClose={toggleHelpModal} 
      />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1a2a3a',
  },
  mainScrollContainer: {
    flex: 1,
  },
  mainInnerContainer: {
    padding: 20,
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', 
    marginBottom: 30,
    paddingHorizontal: 10, 
  },
  helpButton: {
    padding: 10,
  },
  headerIcon: {
    marginRight: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: '#ffffff',
    textAlign: "center",
  },
  mainPanel: {
    backgroundColor: '#233446',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  panelLabel: {
    fontSize: 16,
    color: '#7bb5e3',
    marginBottom: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  transcriptionContainer: {
    backgroundColor: '#1a2a3a',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    minHeight: 150,
    borderWidth: 1,
    borderColor: '#7bb5e3',
  },
  airportInfoContainer: {
    backgroundColor: '#1a2a3a',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    minHeight: 120,
    borderWidth: 1,
    borderColor: '#7bb5e3',
  },
  transcribedSpeech: {
    fontSize: 18,
    color: '#ffffff',
    lineHeight: 24,
  },
  airportInfoText: {
    fontSize: 18,
    color: '#ffffff',
    lineHeight: 24,
  },
  microphoneButton: {
    alignSelf: 'center',
    backgroundColor: '#2c5282',
    width: 150,  // Increased from 70
    height: 150, // Increased from 70
    borderRadius: 75, // Half of width/height
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30, // Increased margin to give more space
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  microphoneButtonActive: {
    backgroundColor: '#e53e3e',
  },
  microphoneInner: {
    width: 130, // Proportionally larger inner circle
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(123, 181, 227, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  }
});
import { Image, StyleSheet, Platform, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';
import { useState, useRef } from 'react';
import { Audio } from 'expo-av';
import { recordSpeech } from '@/functions/recordSpeech';
import { transcribeSpeech } from '@/functions/transcribeSpeech';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { loadAudioFile, transcribeSpeechHard } from '@/functions/hardCodeAudio';

export default function HomeScreen() {
  const [transcribedSpeech, setTranscribedSpeech] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const audioRecordingRef = useRef(new Audio.Recording());
  
  const startRecording = async () => {
    setIsRecording(true);
    //record speech
    // await recordSpeech(audioRecordingRef);
    loadAudioFile();
  };
  const stopRecording = async () => {
    setIsRecording(false);
    setIsTranscribing(true);
    //transcribe speech
    try{
      // const speechTranscipt = await transcribeSpeech(audioRecordingRef);
      const speechTranscipt = await transcribeSpeechHard();
      setTranscribedSpeech(speechTranscipt || "");
    }
    catch(e){
      console.error(e);
    }
    finally{
      setIsTranscribing(false);
    }
  };
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      
    <SafeAreaView>
      <ScrollView style={styles.mainScrollContainer}>
      <View style={styles.mainInnerContainer}>
      <Text style={styles.title}>Pilot Co-Pilot</Text>
      <View style={styles.trancriptionContainer}>
      {isTranscribing ? (
              <ActivityIndicator size="small" color="#000" />
            ) : (
              <Text
                style={{
                  ...styles.transcribedSpeech,
                  color: transcribedSpeech ? "#000" : "rgb(150,150,150)",
                }}
              >
                {transcribedSpeech ||
                  "Your transcribed text will be shown here"}
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
              <ActivityIndicator size="small" color="white" />
            ) : (
              <FontAwesome name="microphone" size={40} color="white" />
            )}
          </TouchableOpacity>
      </View>
      </ScrollView>
    </SafeAreaView>

    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  mainScrollContainer:{
    height: '100%',
    width: '100%',
    padding: 20,
  },
  mainInnerContainer: {
    height: '100%',
    alignItems: "center",
    justifyContent: "center"
  },
  title: {
    fontSize: 35,
    padding: 5,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  trancriptionContainer:{
    backgroundColor: 'rgb(220, 220, 220)',
    width: "100%",
    height: 300,
    padding: 20,
    marginBottom: 20,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  microphoneButton:{
    backgroundColor: "red",
    width: 75,
    height: 75,
    marginTop: 100,
    borderRadius: 50,
    alignItems: "center",

  },
  transcribedSpeech:{
    fontSize: 20,
    padding: 5,
    color: "#000",
    textAlign: "left",
    width:"100%"
  }

});

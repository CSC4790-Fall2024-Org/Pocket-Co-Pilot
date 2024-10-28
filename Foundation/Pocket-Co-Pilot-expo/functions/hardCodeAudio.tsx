import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import { Platform } from "react-native";
import * as Device from "expo-device";
import { Asset } from "expo-asset";

// This function now loads the prerecorded .wav file instead of recording
export const loadAudioFile = async () => {
    try {
        // Load the .wav file from the assets folder
        const asset = Asset.fromModule(require('../assets/record_out.wav'));
        await asset.downloadAsync(); // Ensure the asset is downloaded if needed
    
        const audioFilePath = asset.localUri;
    
        if (!audioFilePath) {
          throw new Error("Failed to load audio file from assets.");
        }
    
        // Load the audio file
        const { sound, status } = await Audio.Sound.createAsync(
          { uri: audioFilePath },
          { shouldPlay: false }
        );

    console.log("Audio file loaded successfully");
    return { sound, status, uri: audioFilePath };
  } catch (error) {
    console.error("Error loading audio file:", error);
    throw error;
  }
};

export const transcribeSpeechHard = async () => {
  try {
    // Load the prerecorded audio file
    const { uri } = await loadAudioFile();

    // Read the file content as base64
    const base64Uri = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    if (base64Uri) {
      const audioConfig = {
        encoding: "LINEAR16",
        sampleRateHertz: 48000, // Adjust this if your .wav file has a different sample rate
        languageCode: "en-US",
      };

      // Configure server access
      const rootOrigin =
        Platform.OS === "android"
          ? Device.isDevice
            ? process.env.EXPO_PUBLIC_LOCAL_DEV_IP
            : "10.0.2.2"
          : Device.isDevice
          ? process.env.EXPO_PUBLIC_LOCAL_DEV_IP || "localhost"
          : "localhost";

      console.log("Root Origin:", rootOrigin);

      const serverUrl = `http://${rootOrigin}:4000`;
      console.log("Server URL:", serverUrl);

      console.log("Sending request to server...");
      const response = await fetch(`${serverUrl}/Pocket-Co-Pilot`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ audioUrl: base64Uri, config: audioConfig }),
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, body: ${errorText}`
        );
      }

      const serverResponse = await response.json();
      console.log("Server Response:", JSON.stringify(serverResponse));

      const results = serverResponse?.results || [];
      console.log("Results:", JSON.stringify(results));

      if (results.length === 0) {
        throw new Error("No results found in server response");
      }

      const transcript = results[0]?.alternatives?.[0]?.transcript;
      if (!transcript) {
        throw new Error("No transcript found in results");
      }

      return transcript;
    }
  } catch (error) {
    console.error("Error in transcribeSpeech:", error);
    return undefined;
  }
};
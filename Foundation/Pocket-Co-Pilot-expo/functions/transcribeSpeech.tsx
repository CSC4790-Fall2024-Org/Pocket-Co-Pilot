import { Audio } from "expo-av";
import { MutableRefObject } from "react";
import * as FileSystem from "expo-file-system";
import { Platform } from "react-native";
import * as Device from "expo-device";

export const transcribeSpeech = async (
  audioRecordingRef: MutableRefObject<Audio.Recording>
) => {
  try {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: false,
    });

    // Check if recording is prepared
    const isPrepared = audioRecordingRef?.current?._canRecord;

    // If prepared
    if (isPrepared) {
      // Stop recording and unload from memory
      await audioRecordingRef?.current?.stopAndUnloadAsync();
      
      // Get the URI to read the data
      const recordingUri = audioRecordingRef?.current?.getURI() || "";
      const base64Uri = await FileSystem.readAsStringAsync(recordingUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      if (recordingUri && base64Uri) {
        const audioConfig = {
          encoding: Platform.OS === "ios" ? "LINEAR16" : "AMR_WB",
          sampleRateHertz: Platform.OS === "ios" ? 44100 : 16000,
          languageCode: "en-US",
        };

        // Need to configure so that app can access the server
        const rootOrigin =
          Platform.OS === "android"
            ? Device.isDevice
              ? process.env.EXPO_PUBLIC_LOCAL_DEV_IP
              : "10.0.2.2"
            : Device.isDevice
            ? process.env.EXPO_PUBLIC_LOCAL_DEV_IP || "localhost"
            : "localhost";

        console.log("Root Origin:", rootOrigin);


        console.log("Sending request to server...");
        const response = await fetch(`${rootOrigin}/Pocket-Co-Pilot`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ audioUrl: base64Uri, config: audioConfig }),
        });

        console.log("Response status:", response.status);
        console.log("Response:", JSON.stringify(response));

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
    }
  } catch (error) {
    console.error("Error in transcribeSpeech:", error);
    return undefined;
  }
};

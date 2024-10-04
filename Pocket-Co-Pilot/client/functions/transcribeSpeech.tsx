import { Audio } from "expo-av";
import { MutableRefObject } from "react";
import * as FileSystem from "expo-file-system";
import { Platform } from "react-native";
import * as Device from "expo-device";
import e from "express";

export const transcribeSpeech = async (
  audioRecordingRef: MutableRefObject<Audio.Recording>
) => {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: false,
    });
    
    //check if recording is prepared
    const isPrepared = audioRecordingRef?.current?._canRecord;
    //if prepared
    if (isPrepared) {
        //stops recording and unallocates recording from memory
      await audioRecordingRef?.current?.stopAndUnloadAsync();
        //get the URI to read the data
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
        //need to configure so that app can access server
        const rootOrigin = 
        Platform.OS === 'android' 
        ? "10.0.2.2" : Device.isDevice 
        ? process.env.LOCAL_DEV_IP || "localhost" 
        : "localhost";
        const serverUrl = `http://${rootOrigin}:4000`;

        const serverResponse = await fetch(`${serverUrl}/speech-to-text`, {
          method: "POST", 
          headers: {"Content-Type": "application/json"}, 
          body: JSON.stringify({audioUrl: base64Uri, config: audioConfig}),
        })
        .then((res) => res.json())
        .catch((e) => console.error(e));
        const results = serverResponse?.results || [];
        console.log(results);
        if (results){
          const transcript = results?.alternatives?.[0].transcript;
          if (!transcript){
            console.error("No transcript found");
            return undefined;
          }
          return transcript;
        }
        else{
          console.error("No transcript found");
          return undefined;
        }
      }
        else{
          console.error("Something went wrong while unloading the recording");
          return undefined;
        }
    }
    else{
      console.error("Recording must be prepared prior to unloading");
      return undefined;
    }
};

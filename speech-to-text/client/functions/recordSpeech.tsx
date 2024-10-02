import React, { MutableRefObject } from "react";
import { Audio } from "expo-av";
import { Platform } from "react-native";

export const recordSpeech = async (audioRecordingRef: MutableRefObject<Audio.Recording | null>) => {
  try {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    if (!audioRecordingRef.current || audioRecordingRef.current._isDoneRecording) {
      audioRecordingRef.current = new Audio.Recording();
    }

    const permissionResponse = await Audio.requestPermissionsAsync();
    if (permissionResponse.status !== "granted") {
      throw new Error("Permission to record audio is required!");
    }

    const recordingStatus = await audioRecordingRef.current.getStatusAsync();
    if (!recordingStatus.canRecord) {
      const recordingOptions: Audio.RecordingOptions = {
        ...Audio.RecordingOptionsPresets.HIGH_QUALITY,
        android: {
          extension: ".amr",
          outputFormat: Audio.AndroidOutputFormat.AMR_WB,
          audioEncoder: Audio.AndroidAudioEncoder.AMR_WB,
          sampleRate: 16000,
          numberOfChannels: 1,
          bitRate: 128000,
        },
        ios: {
          extension: ".wav",
          audioQuality: Audio.IOSAudioQuality.HIGH,
          sampleRate: 44100,
          numberOfChannels: 1,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
        },
      };

      await audioRecordingRef.current.prepareToRecordAsync(recordingOptions);
      console.log("Prepared recording instance");
    }

    await audioRecordingRef.current.startAsync();
  } catch (e) {
    console.error("Failed to start recording", e);
    throw e; // Re-throw the error to allow the caller to handle it
  }
};
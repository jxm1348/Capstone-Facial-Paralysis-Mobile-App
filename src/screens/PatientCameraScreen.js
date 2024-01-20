import { StatusBar } from 'expo-status-bar';
import {Image, Button, StyleSheet, Text, View, ScrollView } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { useState } from 'react';
//https://www.freecodecamp.org/news/how-to-create-a-camera-app-with-expo-and-react-native/

const PatientUploadScreen = ({ navigation }) => {
  const [type, setType] = useState(CameraType.front);
  const [permission, requestPermission] = Camera.useCameraPermissions();

  return (
    <View style={styles.container}>
      <Camera
        type={type}
        useCameraPermissions
        style={styles.camera}
        ref={(r) => {
          cam = r
        }}
      ></Camera>
      <StatusBar style="auto" />
    </View>
  );  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
    width:"100%",
    height:"90%",
    // height: 320,
  }
});

export default PatientUploadScreen;
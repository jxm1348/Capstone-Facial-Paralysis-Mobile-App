import {Image, StyleSheet, Text, View } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { useState, useEffect } from 'react';
//https://www.freecodecamp.org/news/how-to-create-a-camera-app-with-expo-and-react-native/

const PatientUploadScreen = ({ navigation }) => {
  const [permissionsRequest, setPermissionsRequest] = useState(null);
  useEffect(() => {
      Camera.requestCameraPermissionsAsync()
      .then(permissionsRequest => setPermissionsRequest(permissionsRequest));
  }, []);

  let camera;
  if (permissionsRequest === null) {
    camera = <Text>Awaiting camera permissions.</Text>;
  } else if (permissionsRequest.status === "granted") {
    camera = (<Camera
      type={CameraType.front}
      style={styles.camera}
      ref={(r) => {
        const cam = r // Comment this line out
      }}
    ></Camera>);
  } else if (permissionsRequest.status === "denied") {
    camera = <Text>This app cannot take your picture without camera permissions.</Text>;
  } else {
    camera = <Text>Camera permissions request status is unexpected value {permissionsRequest.status}</Text>;
  }

  return (
    <View style={styles.container}>
      {camera}
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
  }
});

export default PatientUploadScreen;
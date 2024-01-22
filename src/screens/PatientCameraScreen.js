import {Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { useState, useEffect, useRef } from 'react';

function CameraYes() {
  const cameraRef = useRef(null);

  function takePicture() {
    // Do something here
    
    console.log(cameraRef.current);
  }

  return (<Camera
    type={CameraType.front}
    style={styles.camera}
    ref={cameraRef}
  >
    <Pressable style={{
      width: 100, height:100, borderRadius: 50, backgroundColor: 'magenta',
      marginBottom: 30
    }} onPress={() => takePicture()}></Pressable>
  </Camera>);
}

function CameraMaybe() {
  const [permissionsRequest, setPermissionsRequest] = useState(null);
  useEffect(() => {
      Camera.requestCameraPermissionsAsync()
      .then(permissionsRequest => setPermissionsRequest(permissionsRequest));
  }, []);

  if (permissionsRequest === null) {
    return <Text>Awaiting camera permissions.</Text>;
  } else if (permissionsRequest.status === "granted") {
    return <CameraYes />;
  } else if (permissionsRequest.status === "denied") {
    return <Text>This app cannot take your picture without camera permissions.</Text>;
  } else {
    return <Text>Camera permissions request status is unexpected value {permissionsRequest.status}</Text>;
  }
}

const PatientUploadScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <CameraMaybe />
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
    alignItems: 'center',
    justifyContent: 'end',
  }
});

export default PatientUploadScreen;
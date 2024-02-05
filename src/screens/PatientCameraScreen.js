import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { useState, useEffect, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import state from '../state.mjs';

function CameraYes({imageKey}) {
  const navigation = useNavigation();
  const cameraRef = useRef(null);

  async function takePicture() {
    if(cameraRef.current){
      let photo = await cameraRef.current.takePictureAsync();
      state.workingMessage.images[imageKey] = photo.uri;
      navigation.navigate("PatientUpload");
    }
  }

  return (<Camera
    type={CameraType.front}
    style={styles.camera}
    ref={cameraRef}
  >
    <View style={{
      width: "55vh", height:"70vh", borderRadius: "50%", border: "5px solid white",
      marginBottom: 30
    }}></View>
    <Pressable style={{
      width: 100, height:100, borderRadius: 50, backgroundColor: '#041E42', border:"5px solid white",
      marginBottom: 30
    }} onPress={() => takePicture()}></Pressable>
  </Camera>);
}

function CameraMaybe({imageKey}) {
  const [permissionsRequest, setPermissionsRequest] = useState(null);
  useEffect(() => {
      Camera.requestCameraPermissionsAsync()
      .then(permissionsRequest => setPermissionsRequest(permissionsRequest));
  }, []);

  if (permissionsRequest === null) {
    return <Text>Awaiting camera permissions.</Text>;
  } else if (permissionsRequest.status === "granted") {
    return <CameraYes imageKey={imageKey} />;
  } else if (permissionsRequest.status === "denied") {
    return <Text>This app cannot take your picture without camera permissions.</Text>;
  } else {
    return <Text>Camera permissions request status is unexpected value {permissionsRequest.status}</Text>;
  }
}

const PatientUploadScreen = ({ route }) => {
  const { imageKey } = route.params;
  return (
    <View style={styles.container}>
      <CameraMaybe imageKey={imageKey} />
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
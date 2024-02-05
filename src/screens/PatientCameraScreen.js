import {Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { useState, useEffect, useRef } from 'react';
import state from '../state';

function CameraYes() {
  const cameraRef = useRef(null);

  const [ imageUri, setImageUri ] = useState(undefined);
  console.log("Image uri is ", imageUri);

  async function takePicture() {
    // console.log(cameraRef.current);
    if(cameraRef.current){
      let photo = await cameraRef.current.takePictureAsync();
      console.log(photo.uri);
      state.patient.workingPhotoSet[0] = photo.uri;  
      setImageUri(photo.uri);
      //TODO receive state data from PatientUploadScreen to determine index of overwrite, and have PatientUploadScreen take image from state if not null
      //TODO overlay outline on camera using same index, maybe make versions of the face images that are just outlines? need to see it in action firstgit
    }
  }

  return (<Camera
    type={CameraType.front}
    style={styles.camera}
    ref={cameraRef}
  >
    <View style={{
      position: 'absolute',
      top: 40,
      left: 120,
      backgroundColor: 'red',
      padding: 30,
    }}><Image source={{uri: imageUri}} style={{width:200, height:200}}></Image></View>
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
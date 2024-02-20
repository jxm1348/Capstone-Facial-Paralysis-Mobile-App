import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { useState, useEffect, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import state from '../state.js';

function CameraYes({imageKey}) {
  const navigation = useNavigation();
  const cameraRef = useRef(null);

  async function takePicture() {
    if(cameraRef.current){
      let photo = await cameraRef.current.takePictureAsync();
      state.workingMessage.images[imageKey] = {uri: photo.uri};
      navigation.navigate("PatientUpload");
    }
  }

  const { height, width } = Dimensions.get('window');
  const windowHeight = height;
  const windowWidth = width;

  const maskMarginTop = windowHeight * (2 / (2 + 8 + 2));
  const maskHeight = windowHeight * 0.55;
  const maskWidth = windowWidth * 0.55;

  return (<Camera
    type={CameraType.front}
    style={styles.camera}
    ref={cameraRef}
  >
    <View style={{flexGrow: 1}}></View>{/* Top margin */}
    <View style={{
      width: maskWidth, flexGrow: 25, borderRadius: maskWidth / 2, borderWidth: 5, borderColor: '#fff',
    }}></View>
    <View style={{flexGrow: 1}}></View>{/* Gap between mask and button */}
    <Pressable style={{
      width: 100, flexBasis: 100, flexGrow: 0, flexShrink: 0,
      borderRadius: 50, backgroundColor: '#041E42', borderWidth: 5, borderColor: '#fff',
    }} onPress={() => takePicture()}></Pressable>
    <View style={{flexGrow: 1}}></View>{/* Bottom margin */}
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
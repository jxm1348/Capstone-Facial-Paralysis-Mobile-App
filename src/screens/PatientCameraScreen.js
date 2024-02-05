import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { useState, useEffect, useRef } from 'react';
import state from '../state';
import { useNavigation } from '@react-navigation/native';

function CameraYes({imageKey}) {
  const navigation = useNavigation();
  const cameraRef = useRef(null);

  // Credit to "Matěj Pokorný" of https://stackoverflow.com/users/2438165/mat%c4%9bj-pokorn%c3%bd
  // Via https://stackoverflow.com/a/18197341/6286797
  function download(filename, blob) {
    const element = document.createElement('a');
    element.setAttribute('href', window.URL.createObjectURL(blob));
    element.setAttribute('download', filename);
  
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
  
    document.body.removeChild(element);
  }

  // Credit to "devnull69" of https://stackoverflow.com/users/1030974/devnull69
  // Via https://stackoverflow.com/a/12300351/6286797
  function dataURItoBlob(dataURI) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',', 1)[0].split(':')[1].split(';')[0];
  
    // write the bytes of the string to an ArrayBuffer
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
  
    return new Blob([ab], {type: mimeString});
  }

  async function takePicture() {
    if(cameraRef.current){
      let photo = await cameraRef.current.takePictureAsync();
      download("image_i_hope.png", dataURItoBlob(photo.uri));
      return;
      // state.workingMessage.images[imageKey] = photo.uri;
      // navigation.navigate("PatientUpload");
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
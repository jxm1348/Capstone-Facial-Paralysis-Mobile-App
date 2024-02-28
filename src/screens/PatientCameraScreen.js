import { Pressable, Text, View } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { useState, useEffect, useRef } from 'react';
import state from '../state.js';

const ratio = [4, 3];

function CameraYes({cameraRef, previewWidth}) {
  return (<Camera
    type={CameraType.front}
    style={{
      flex: 1,
      width:"100%",
      height:"100%",
      alignItems: 'center',
    }}
    ref={cameraRef}
  >
    <View style={{flexGrow: 1}}></View>{/* Top margin */}
    <View style={{
      flexGrow: 25, width: previewWidth * 0.70,
      borderRadius: previewWidth * 0.35, borderWidth: 5, borderColor: '#fff',
    }}></View>
    <View style={{flexGrow: 1}}></View>{/* Gap between mask and button */}
  </Camera>);
}

function CameraMaybe(props) {
  const [permissionsRequest, setPermissionsRequest] = useState(null);
  useEffect(() => {
      Camera.requestCameraPermissionsAsync()
      .then(permissionsRequest => setPermissionsRequest(permissionsRequest));
  }, []);

  if (permissionsRequest === null) {
    return <Text>Awaiting camera permissions.</Text>;
  } else if (permissionsRequest.status === "granted") {
    return <CameraYes {...props} />;
  } else if (permissionsRequest.status === "denied") {
    return <Text>This app cannot take your picture without camera permissions.</Text>;
  } else {
    return <Text>Camera permissions request status is unexpected value {permissionsRequest.status}</Text>;
  }
}

const PatientUploadScreen = ({ route, navigation }) => {
  const [ ah, aw ] = ratio;

  const { imageKey } = route.params;
  const [ layout, setLayout ] = useState({width: aw, height: ah});
  const cameraRef = useRef(undefined);

  const vh = layout.height, vw = layout.width;
  const tall = vh / ah >= vw / aw;

  const previewHeight = tall ? vw / aw * ah : vh;
  const previewWidth = tall ? vw : vh / ah * aw;
  
  const containerStyle = {
    flex: 1,
    flexDirection: tall ? 'column' : 'row',
    backgroundColor: '#222',
    alignItems: 'center',
    justifyContent: 'start',
  };

  async function takePicture() {
    if(cameraRef.current) {
      let photo = await cameraRef.current.takePictureAsync();
      state.workingMessage.images[imageKey] = {uri: photo.uri};
      navigation.navigate("PatientUpload");
    }
  }
  
  return (
    <View style={containerStyle} onLayout={event => {
      setLayout(event.nativeEvent.layout);
    }}>
      <View style={{
        flexGrow: 0,
        flexShrink: 0,
        width: previewWidth,
        height: previewHeight,
      }}>
        <CameraMaybe cameraRef={cameraRef} previewWidth={previewWidth} />
      </View>
      <Pressable style={{
        width: 100, height: 100, borderRadius: 50,
        backgroundColor: '#041E42', borderWidth: 5, borderColor: '#fff',
        position: 'absolute', right: tall ? undefined : 10, bottom: tall ? 10 : undefined,
      }} onPress={() => takePicture()}></Pressable>

    </View>
  );  
};

export default PatientUploadScreen;
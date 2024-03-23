// import MainNavigator from './src/navigation/navigation'
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { useCameraDevice, NoCameraErrorView, Camera } from "react-native-vision-camera";


// const App = () => {
//     return (
//         <MainNavigator />
//     );
// }

import { useState } from 'react';
import { Text, View, Pressable } from 'react-native';
import { Camera, useCameraDevice } from 'react-native-vision-camera'

const tag = '8eab ';

function CameraMaybe({permission}) {
    if (permission !== 'granted') return (<Text>Camera permission must be granted to take selfies</Text>);

    console.log(tag + Camera.getAvailableCameraDevices());
    const device = useCameraDevice('front');
    return (
        <Camera
            style={{flex: 1, width: '100%', height: '100%'}}
            device={device}
            isActive={true}
        />
    );
}

export function App() {
    const [ cameraPermission, setCameraPermission ] = useState(Camera.getCameraPermissionStatus);

    const handleGetCameraPermission = async () => {
        const permission = await Camera.requestCameraPermission()
        console.log(`Camera permission status: ${permission}`)
    
        if (permission === 'denied') await Linking.openSettings()
        setCameraPermission(permission)
    };
    
    console.log(tag + `Re-rendering Navigator. Camera: ${cameraPermission}`);
  
    return (
        <View style={{justifyContent:'center', alignItems: 'center', flexGrow: 1}}>
            <Text>Hello!</Text>
            <Pressable style={{backgroundColor: 'blue', borderRadius: 10, padding: 10}} onPress={handleGetCameraPermission}>
                <Text style={{color: 'white', fontSize: 24}}>Get Camera Permissions</Text>
            </Pressable>
            <CameraMaybe permission={cameraPermission} />
        </View>
    );
  }

  export default App;

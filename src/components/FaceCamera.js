import { useState } from 'react';
import { Text, View, Pressable } from 'react-native';

import { Camera, runAtTargetFps, useCameraDevice, useFrameProcessor } from 'react-native-vision-camera';
import { detectFaces } from 'react-native-vision-camera-face-detector'
import { Worklets } from 'react-native-worklets-core'

import globalStyles from '../globalStyles';
const logTag = '7d3879ca ';

export function CameraYes({handleFaces, cameraRef}) {
    console.log('Rendering cameraYes');

    const handleFacesDetection = Worklets.createRunInJsFn(result => { 
        handleFaces(result);
    });
    
    const frameProcessor = useFrameProcessor((frame) => {
        'worklet'
        runAtTargetFps(10, () => {
            'worklet'
            detectFaces(frame, handleFacesDetection, {/* detection settings*/});
        })
    }, [handleFacesDetection]);
  
    console.log(logTag + Camera.getAvailableCameraDevices());
    const device = useCameraDevice('front');
    return (
        <Camera
            style={{flex: 1, width: '100%', height: '100%'}}
            device={device}
            isActive={true}
            frameProcessor={frameProcessor}
            ref={cameraRef}
            photo={true}
        />
    );
}

export function PermissionsWrapper(props) {
    const [ cameraPermission, setCameraPermission ] = useState(Camera.getCameraPermissionStatus);

    const handleGetCameraPermission = async () => {
        const permission = await Camera.requestCameraPermission()
        console.log(`Camera permission status: ${permission}`)
        setCameraPermission(permission)
    };
    
    console.log(`${logTag}Re-rendering Navigator. Camera: ${cameraPermission}`);
  
    return (
        <View {...props}>
            {cameraPermission !== 'granted'
                ? <View style={{flex: 1, width: '100%', backgroundColor: 'white', justifyContent: 'center'}}>
                    <Pressable style={globalStyles.button} onPress={handleGetCameraPermission}>
                        <Text style={globalStyles.buttonText}>Grant Camera Permissions</Text>
                    </Pressable>
                    <Text style={{textAlign: 'center'}}>Camera permission must be granted to take pictures.</Text>
                </View>
                : props.children
            }
        </View>
    );
}

export default function FaceCamera(props) {
    return <PermissionsWrapper><CameraYes {...props} /></PermissionsWrapper>;
}

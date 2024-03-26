import { PermissionsWrapper, CameraYes } from '../components/FaceCamera';

import { Pressable, Text, View } from 'react-native';
import { useState, useRef } from 'react';
import Ionicon from '@expo/vector-icons/Ionicons.js';
import state from '../state.js';

const logTag = '7d3879ca ';
const ratio = [4, 3];

function AbsoluteOverlay({previewWidth}) {
    return (
        <View style={{position: 'absolute', width: '100%', height: '100%', alignItems: 'center'}}>
            <View style={{flexGrow: 1}} />{/* Top margin */}
            <View style={{
                flexGrow: 25, width: previewWidth * 0.70,
                borderRadius: previewWidth * 0.35, borderWidth: 5, borderColor: '#fff',
            }} />
            <View style={{flexGrow: 1}} />{/* Gap between mask and button */}
        </View>
    );
}

export default function PatientFaceCameraScreen({ route, navigation }) {
    const [ ah, aw ] = ratio;

    const { imageKey } = route.params;
    const [ layout, setLayout ] = useState({width: aw, height: ah});
    const cameraRef = useRef(undefined);

    const vh = layout.height, vw = layout.width;
    const tall = vh / ah >= vw / aw;

    const previewHeight = tall ? vw / aw * ah : vh;
    const previewWidth = tall ? vw : vh / ah * aw;

    const [ face, setFace ] = useState(undefined);
    const [ frame, setFrame ] = useState(undefined);
    const [ isOk, setIsOk ] = useState(false);

    const handleFaces = (result) => {
        const { faces, frame } = result;
        // frame : {height, width}
        // faces : {0: {bounds, pitchAngle, yawAngle, rollAngle}, }

        if (faces['0']) {
            let f = faces['0'];
            let largestFaceArea = f.bounds.height * f.bounds.width;
            for (const faceIndex in faces) {
                const face = faces[faceIndex];
                const faceArea = face.bounds.width * face.bounds.height;
                if (faceArea > largestFaceArea) {
                    f = face;
                    largestFaceArea = faceArea;
                }
            }
            
            setFrame(frame);
            setFace(f);

            // const fractionLeft = f.bounds.right / frame.width;
            // const fractionRight = f.bounds.left / frame.width;
            // const fractionTop = f.bounds.top / frame.height;
            // const fractionBottom = f.bounds.bottom / frame.height;

            setIsOk(
                f.pitchAngle >= -20 &&
                f.pitchAngle <= 15 &&
                f.yawAngle >= -15 &&
                f.yawAngle <= 15 &&
                f.rollAngle >= -7 &&
                f.rollAngle <= 7 && true
                // 0.02 <= fractionLeft && fractionLeft <= 0.15 &&
                // 0.85 <= fractionRight && fractionRight <= 0.98 &&
                // 0.02 <= fractionTop && fractionTop <= 0.15 &&
                // 0.85 <= fractionBottom && fractionBottom <= 0.98
            );
        } else {
            setFace(undefined);
            setIsOk(false);
        }
    };

    const containerStyle = {
        flex: 1,
        flexDirection: tall ? 'column' : 'row',
        backgroundColor: '#222',
        alignItems: 'center',
        justifyContent: 'start',
    };

    // let maskStyle = undefined;
    // if (face) {
    //     const maskWidth = previewWidth * face.bounds.width / frame.width;
    //     const maskHeight = previewHeight * face.bounds.height / frame.height;
    
    //     maskStyle = face && {
    //         position: 'absolute',
    //         width: maskWidth,
    //         height: maskHeight,
    //         right: previewWidth * face.bounds.centerX / frame.width - maskWidth / 2,
    //         top: previewHeight * face.bounds.centerY / frame.height - maskHeight / 2,
    //         backgroundColor: 'magenta',
    //     };
    // }
    
    // fractionLeft and fractionRight are the patient's left and right.
    // const fractionRight = face && Math.round(face.bounds.left / frame.width * 100) / 100;
    // const fractionLeft = face && Math.round(face.bounds.right / frame.width * 100) / 100;
    // const fractionTop = face && Math.round(face.bounds.top / frame.height * 100) / 100;
    // const fractionBottom = face && Math.round(face.bounds.bottom / frame.height * 100) / 100;

    async function takePicture() {
        if(cameraRef.current) {
            let photo;
            if (cameraRef.current.takePictureAsync !== undefined) {
                photo = await cameraRef.current.takePictureAsync();
                state.workingMessage.images[imageKey] = {uri: photo.uri};
            } else if (cameraRef.current.takePhoto !== undefined) {
                photo = await cameraRef.current.takePhoto();
                state.workingMessage.images[imageKey] = {uri: 'file://' + photo.path};
            }
            navigation.navigate("PatientUpload");
        }
    }

    const takePictureStyle = {
        width: 100, height: 100, borderRadius: 50,
        backgroundColor: '#041E42', borderWidth: 5, borderColor: '#fff',
        position: 'absolute', right: tall ? undefined : 10, bottom: tall ? 10 : undefined,
    };
    
    return (
        <PermissionsWrapper style={containerStyle} onLayout={event => {
            // console.log('Setting layout');
            setLayout(event.nativeEvent.layout);
        }}>
            <View style={{
                flexGrow: 0,
                flexShrink: 0,
                width: previewWidth,
                height: previewHeight,
            }}>
                <CameraYes handleFaces={handleFaces} cameraRef={cameraRef} />
                <AbsoluteOverlay previewWidth={previewWidth} />
            </View>
            {
                isOk ?
                <Pressable style={takePictureStyle} onPress={() => takePicture()} /> :
                <Ionicon style={[takePictureStyle, {backgroundColor: '#df3324'}]} size={100} name="close-outline" />
            }
            <View style={{position:'absolute', left: 10, top: 10}}>
                <Text>Pitch: {face?.pitchAngle}</Text>
                <Text>Yaw: {face?.yawAngle}</Text>
                <Text>Roll: {face?.rollAngle}</Text>
            </View>
            {/* <View style={{position:'absolute', left: 10, top: 10}}>
                <Text>Horizontal: {fractionLeft} - {fractionRight}</Text>
                <Text>Vertical: {fractionBottom} - {fractionTop}</Text>
            </View> */}

            {/* {face && <View style={maskStyle}/>} */}
        </PermissionsWrapper>
    );    
};

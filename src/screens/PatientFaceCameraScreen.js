import { PermissionsWrapper, CameraYes } from '../components/FaceCamera';

import { Pressable, View } from 'react-native';
import { useState, useRef } from 'react';
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
            let largestFace = faces['0'];
            let largestFaceArea = largestFace.bounds.height * largestFace.bounds.width;
            for (const faceIndex in faces) {
                const face = faces[faceIndex];
                const faceArea = face.bounds.width * face.bounds.height;
                if (faceArea > largestFaceArea) {
                    largestFace = face;
                    largestFaceArea = faceArea;
                }
            }
            
            setFrame(frame);
            setFace(largestFace);
        } else {
            setFace(undefined);
        }
    };

    const containerStyle = {
        flex: 1,
        flexDirection: tall ? 'column' : 'row',
        backgroundColor: '#222',
        alignItems: 'center',
        justifyContent: 'start',
    };

    let maskStyle = undefined;
    if (face) {
        const maskWidth = previewWidth * face.bounds.width / frame.width;
        const maskHeight = previewHeight * face.bounds.height / frame.height;
    
        maskStyle = face && {
            position: 'absolute',
            width: maskWidth,
            height: maskHeight,
            right: previewWidth * face.bounds.centerX / frame.width - maskWidth / 2,
            top: previewHeight * face.bounds.centerY / frame.height - maskHeight / 2,
            backgroundColor: 'magenta',
        };
    }
    
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
                <AbsoluteOverlay previewWidth={previewWidth}/>
            </View>
            <Pressable style={{
                width: 100, height: 100, borderRadius: 50,
                backgroundColor: '#041E42', borderWidth: 5, borderColor: '#fff',
                position: 'absolute', right: tall ? undefined : 10, bottom: tall ? 10 : undefined,
            }} onPress={() => takePicture()}></Pressable>

            {face && <View style={maskStyle}/>}
        </PermissionsWrapper>
    );    
};

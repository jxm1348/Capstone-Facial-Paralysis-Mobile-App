import { View, ScrollView, Pressable, Text, StyleSheet, Image, } from 'react-native';

import { ref, uploadBytes } from 'firebase/storage';
import { addDoc, collection } from 'firebase/firestore';

import { Bar as ProgressBar } from 'react-native-progress';


import { imageKeyOrder } from '../constants';
import state, { URIToBlob, auth, db, fetchUniqueInt, storage } from '../state.js';
import globalStyles from '../globalStyles';
import { useIsFocused } from '@react-navigation/native';
import { useEffect, useState } from 'react';

function URIToExtension(uri) {
  if (uri.startsWith('data:image/png;') || uri.endsWith('.png')) {
    return 'png';
  } else if (uri.startsWith('data:image/jpg;') || uri.endsWith('.jpg')) {
    return 'jpg';
  } else {
    return uri.split('.').pop();
  }
}

let awfulHackyResolutionCount = 0;
const aspectRatio = [4, 3]; // height x width
const tileHeight = 200;
const tileWidth = tileHeight / aspectRatio[0] * aspectRatio[1];

const saveImages = async (updateUploadProgress) => {
  console.log("Getting unique id...");
  const reportId = await fetchUniqueInt();
  const keyUriPairs = Object.entries(state.workingMessage.images);
  const uploadPromises = keyUriPairs.map(async ([key, uriWrapper]) => {
    const imageExtension = URIToExtension(uriWrapper.uri);
    const imageName = `${key}-${reportId}.${imageExtension}`;
    const uriBlob = await URIToBlob(uriWrapper.uri);
    await uploadBytes(
      ref(storage, `images/${auth.currentUser.uid}/${imageName}`),
      uriBlob
    );
    awfulHackyResolutionCount += 1;
    updateUploadProgress();
    return [key, imageName];
  });
  const results = await Promise.all(uploadPromises);
  return results;
}

const PatientUploadScreen = ({navigation}) => {
  useIsFocused();
  useEffect(() => {
    awfulHackyResolutionCount = 0;
  }, []);

  const [ uploadProgress, setUploadProgress ] = useState(undefined);
  const [ buttonGridLayout, setButtonGridLayout ] = useState(undefined);
  
  const images = {
    'at-rest': require('../resources/face-f-at-rest.png'),
    'eyebrows-up': require('../resources/face-f-eyebrows-up.png'),
    'eyes-closed': require('../resources/face-f-eyes-closed.png'),
    'nose-wrinkle': require('../resources/face-f-nose-wrinkle.png'),
    'big-smile': require('../resources/face-f-big-smile.png'),
    'lips-puckered': require('../resources/face-f-lips-puckered.png'),
    'lower-teeth-bared': require('../resources/face-f-lower-teeth-bared.png'),
  };

  Object.assign(images, state.workingMessage.images);
  function updateUploadProgress() {
    const uploadCount = Object.entries(state.workingMessage.images).length + 1;
    setUploadProgress(awfulHackyResolutionCount / uploadCount);
  }

  const upload = async () => {
    console.log("Uploading images...");
    setUploadProgress(0); // Show progress bar
    const saveURLs = await saveImages(updateUploadProgress);
    const images = Object.fromEntries(saveURLs);
    console.log(saveURLs);
    console.log("Making message...");
    await addDoc(collection(db, 'messages'), {
      date: Date.now(),
      from: auth.currentUser.uid, to: state.clinicianUid,
      read: false,
      message: '',
      messageVersion: 3,
      images,
    });
    console.log("Upload complete");
    setUploadProgress(1);
    await new Promise(resolve => setTimeout(resolve, 700)); // Wait a moment so people can see the progress bar fill up.
    navigation.navigate('PatientMessages', {withUid: state.clinicianUid});
  }

  const thumbnails = imageKeyOrder.map(key => (
    <Pressable
        key={key}
        style={styles.touchableItem}
        underlayColor="#ddd"
        onPress={() => navigation.navigate('PatientCamera', {imageKey: key})}
      >
        <Image source={images[key]} style={styles.itemImage} />
        <Text style={styles.itemText}>{key}</Text>
      </Pressable>
  ));

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{
          alignItems: 'center',
          justifyContent: 'center',
          flexGrow: 1,
          padding: 6,
          gap: 6,
        }}
        horizontal={false}
      >
        <View style={{
          flexWrap: 'wrap',
          flexDirection: 'row',
          gap: 6,
          justifyContent: 'center',
        }}
        onLayout={event => setButtonGridLayout(event.nativeEvent.layout)}
        >
          {thumbnails}
          <Pressable style={[
            globalStyles.button,
            {width:tileWidth, height:tileWidth, padding:0, margin:0, alignSelf: 'center'}
          ]} onPress={upload}>
            <Text style={globalStyles.buttonText}>Upload</Text>
          </Pressable>

        </View>
        <View style={{
          height: 20,
          width: '100%',
          alignItems: 'center',
        }}>
          { uploadProgress !== undefined ?
            <ProgressBar progress={uploadProgress} height={20} width={
              buttonGridLayout && buttonGridLayout.width
            } /> :
            undefined
          }
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  touchableItem: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    overflow: 'hidden',
  },
  itemImage: {
    width: tileWidth,
    height: tileHeight,
    resizeMode: 'cover',
  },
  itemText: {
    fontSize: 18,
    marginTop: 5,
  },
});

export default PatientUploadScreen;
import { View, ScrollView, Pressable, Text, StyleSheet, Image, } from 'react-native';

import { ref, uploadBytes } from 'firebase/storage';
import { addDoc, collection } from 'firebase/firestore';

import { Bar as ProgressBar } from 'react-native-progress';


import { imageKeyOrder } from '../constants';
import state, { URIToBlob, URIToExtension, auth, db, fetchUniqueInt, storage } from '../state.js';
import globalStyles from '../globalStyles';
import { useIsFocused } from '@react-navigation/native';
import { useEffect, useState } from 'react';

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
    'at-rest': require('../resources/face-mp-at-rest.jpg'),
    'eyebrows-up': require('../resources/face-mp-eyebrows-up.jpg'),
    'eyes-closed': require('../resources/face-mp-eyes-closed-tightly.jpg'),
    'nose-wrinkle': require('../resources/face-mp-nose-wrinkle.jpg'),
    'big-smile': require('../resources/face-mp-big-smile-teeth-closed.jpg'),
    'lips-puckered': require('../resources/face-mp-lips-puckered.jpg'),
    'lower-teeth-bared': require('../resources/face-mp-lower-teeth-bared.jpg'),
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

  const thumbnails = imageKeyOrder.map(key => {
    const imageText = key.split('-').join(' ');
    return (<Pressable
      key={key}
      style={styles.touchableItem}
      underlayColor="#ddd"
      onPress={() => navigation.navigate('PatientCamera', {imageKey: key})}
    >
      <Image source={images[key]} style={styles.itemImage} />
      <Text style={[styles.itemText, {textTransform: 'capitalize'}]}>{imageText}</Text>
    </Pressable>);
  });

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
        <View>
            <Text style={[globalStyles.h2, {textAlign: 'left'}]}>For good pictures:</Text>
            <Text>Tuck your hair back so your bangs don't cover your face.</Text>
            <Text>Take your glasses off.</Text>
            <Text>Make sure your neck is visible.</Text>
            <Text>Be in a well-lit space, facing the light. Natural light is best.</Text>
            <Text>Sit up straight. Don't lean forwards or back.</Text>
        </View>
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
    fontSize: 16,
    marginTop: 5,
  },
});

export default PatientUploadScreen;
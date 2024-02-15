import { View, ScrollView, Pressable, Text, StyleSheet, Image, } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { addDoc, collection } from 'firebase/firestore';

import ActionButton from '../components/ActionButton';
import NavigationBar from '../components/NavigationBar';

import { imageKeyOrder } from '../constants';
import state, { auth, dataURItoBlob, db, fetchUniqueInt, storage } from '../state.js';
import globalStyles from '../globalStyles';
import { useIsFocused } from '@react-navigation/native';


const saveImages = async () => {
  console.log("Getting unique id...");
  const reportId = await fetchUniqueInt();
  const keyUriPairs = Object.entries(state.workingMessage.images);
  const uploadPromises = keyUriPairs.map(([key, uri]) =>
    uploadBytes(
      ref(storage, `images/${auth.currentUser.displayName}/${key}-${reportId}.png`),
      dataURItoBlob(uri)
    ).then(result => getDownloadURL(result.ref))
    .then(URL => [key, URL])
  );
  const results = await Promise.all(uploadPromises);
  return results;
}

const PatientUploadScreen = () => {
  useIsFocused();
  const navigation = useNavigation();

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

  const upload = async () => {
    console.log("Uploading images...");
    const saveURLs = await saveImages();
    const images = Object.fromEntries(saveURLs);
    const message = '';
    console.log(saveURLs);
    console.log("Making message...");
    await addDoc(collection(db, 'messages'), {
      date: Date.now(), from: auth.currentUser.uid, to: state.clinicianUid, read: false, message, images,
    });
    console.log("Upload complete");
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
        contentContainerStyle={styles.scrollViewContainer}
        horizontal={false}
      >
        {thumbnails}
        <Pressable style={globalStyles.button} onPress={upload}><Text>Upload</Text></Pressable>
      </ScrollView>
      <ActionButton title="Go Back" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  },
  touchableItem: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    marginVertical: 10,
    borderRadius: 5,
    overflow: 'hidden',
  },
  itemImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  itemText: {
    fontSize: 18,
    marginTop: 5,
  },
});

export default PatientUploadScreen;
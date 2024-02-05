import { useState } from 'react';
import { View, ScrollView, Pressable, Text, StyleSheet, Image, } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import ActionButton from '../components/ActionButton';
import NavigationBar from '../components/NavigationBar';
import globalStyles from '../globalStyles';

const PatientUploadScreen = () => {
  const navigation = useNavigation();

  // Enforces an order on the images.
  const [ imageKeys, setImageKeys ] = useState(() => (
    ['at-rest', 'eyebrows-up', 'eyes-closed', 'nose-wrinkle', 'big-smile', 'lips-puckered', 'lower-teeth-bared']
  ));
  // setImageKeys will be called when I add the button for adding more images to the report at the end.

  const [ images, setImages ] = useState(() => ({
    'at-rest': require('../resources/face-f-at-rest.png'),
    'eyebrows-up': require('../resources/face-f-eyebrows-up.png'),
    'eyes-closed': require('../resources/face-f-eyes-closed.png'),
    'nose-wrinkle': require('../resources/face-f-nose-wrinkle.png'),
    'big-smile': require('../resources/face-f-big-smile.png'),
    'lips-puckered': require('../resources/face-f-lips-puckered.png'),
    'lower-teeth-bared': require('../resources/face-f-lower-teeth-bared.png'),
  }));

  const currySetImage = (key) => {
    return (value) => {
      const change = {}; change[key] = value;
      setImages(Object.assign({}, images, change));
    }
  }

  const thumbnails = imageKeys.map(key => (
    <Pressable
      key={key}
      style={styles.touchableItem}
      underlayColor="#ddd"
      onPress={() => navigation.navigate('PatientCamera', key)}
    >
      <>
        <Image source={images[key]} style={styles.itemImage} />
        <Text style={styles.itemText}>{key}</Text>
      </>
    </Pressable>
  ));

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContainer}
        pagingEnabled
        horizontal={false}
        showsVerticalScrollIndicator={false}
        decelerationRate="fast"
      >
        {thumbnails}
        <Pressable style={globalStyles.button}><Text>Upload</Text></Pressable>
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
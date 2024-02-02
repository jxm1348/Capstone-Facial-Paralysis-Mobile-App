import React from 'react';
import { View, ScrollView, TouchableHighlight, Text, StyleSheet, Image, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ActionButton from '../components/ActionButton';
import NavigationBar from '../components/NavigationBar';

const PatientUploadScreen = () => {
  const navigation = useNavigation();

  const items = Array.from({ length: 8 }, (_, index) => index + 1);


  const images = [
    require('../resources/face-f-at-rest.png'),
    require('../resources/face-f-big-smile.png'),
    require('../resources/face-f-eyebrows-up.png'),
    require('../resources/face-f-eyes-closed.png'),
    require('../resources/face-f-lips-puckered.png'),
    require('../resources/face-f-lower-teeth-bared.png'),
    require('../resources/face-f-nose-wrinkle.png'),
    require('../resources/face-f-root.png')
  ];

  const navigateToPatientUploadPicture = (item) => {
    navigation.navigate('PatientUploadPicture', { item });
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContainer}
        pagingEnabled
        horizontal={false}
        showsVerticalScrollIndicator={false}
        decelerationRate="fast"
      >
        {items.map((item, index) => (
          <TouchableHighlight
            key={item}
            style={styles.touchableItem}
            underlayColor="#ddd"
            onPress={() => navigation.navigate('PatientCamera', {item})}
          >
            <>
              <Image source={images[index % images.length]} style={styles.itemImage} />
              <Text style={styles.itemText}>{`Item ${item}`}</Text>
            </>
          </TouchableHighlight>
        ))}
        <Button 
        title="Upload"
        style={
          {
            marginTop: 3,
          }
        }>Upload</Button>
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
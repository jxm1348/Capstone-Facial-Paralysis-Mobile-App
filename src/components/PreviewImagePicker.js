import { useState } from 'react';
import { Image, Modal, View, Text, Pressable, } from 'react-native';

import * as ImagePicker from 'expo-image-picker';
import Ionicons from '@expo/vector-icons/Ionicons';

import globalStyles from '../globalStyles';

export default function PreviewImagePicker({image, onImagePickerResult, size}) {
  size = size ?? 90;
  const editIconSize = size / 3;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const imagePickerOptions = {
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1,
  };

  const onCameraChoose = () => {
    ImagePicker.launchCameraAsync(imagePickerOptions)
    .then(imagePickerResult => {
      if (!imagePickerResult.canceled) {
        onImagePickerResult(imagePickerResult);
      }
    })
    .finally(() => setIsModalVisible(false));
  };
  
  const onGalleryChoose = () => {
    ImagePicker.launchImageLibraryAsync(imagePickerOptions)
    .then(imagePickerResult => {
      if (!imagePickerResult.canceled) {
        onImagePickerResult(imagePickerResult);
      }
    })
    .finally(() => setIsModalVisible(false));
  };
  
  const onCancelChoose = () => {
    setIsModalVisible(false);
  };
  
  return (<>
    <Pressable style={{backgroundColor: '#ddd'}} onPress={() => setIsModalVisible(true)}>
      {image
        ? <Image source={{uri: image.uri}} style={{width:size, height:size, alignSelf: 'center'}} />
        : <Ionicons size={size} name="image-outline" color="#000" />
      }
      <Ionicons
        style={{
          position: 'absolute',
          left: (size - editIconSize) / 2,
          top: (size - editIconSize) / 2,
        }}
        name="pencil-outline"
        size={editIconSize}
        color="#ff0"
      />
    </Pressable>
    <Modal animationType="none" transparent={true} visible={isModalVisible}>
      <Pressable style={{flexGrow: 1, backgroundColor: '#4444', alignItems: 'center', justifyContent: 'center'}} onPress={onCancelChoose}>
        <View style={{width: '80%', backgroundColor: '#fff', borderRadius: 10}}>
          <Pressable onPress={onCameraChoose} style={globalStyles.button}>
            <Text style={globalStyles.buttonText}>Take Picture </Text>
            <Ionicons name="camera-outline" color="#fff" size={32} />
          </Pressable>
          <Pressable onPress={onGalleryChoose} style={globalStyles.button}>
            <Text style={globalStyles.buttonText}>Gallery </Text>
            <Ionicons name="images-outline" color="#fff" size={32} />
          </Pressable>
          <Pressable onPress={onCancelChoose} style={globalStyles.button}>
            <Text style={globalStyles.buttonText}>Cancel </Text>
            <Ionicons name="arrow-back-circle-outline" color="#fff" size={32} />
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  </>);
}
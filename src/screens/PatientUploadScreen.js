import React from 'react';
import { View, Button } from 'react-native';

const PatientUploadScreen = ({ navigation }) => {
  return (
    <View>
      <Button title="Back" onPress={() => navigation.navigate('PatientHome')} />
      <Button title="Upload Image" onPress={() => navigation.navigate('PatientUploadPicture')}
    </View>
  );
};

function Upload ({navigation, cont Page }) {
    return(

    )
}

export default PatientUploadScreen;
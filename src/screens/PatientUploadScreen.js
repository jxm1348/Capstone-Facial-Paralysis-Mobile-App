import React from 'react';
import { View, Button } from 'react-native';
import MainNavigator from '../navigation/navigation';

const PatientUploadScreen = ({ navigation }) => {
  return (
    <View>

      <Button title="Upload Image" onPress={() => navigation.navigate('PatientUploadPicture')}
    </View>
  );
};

function Upload ({navigation, cont Page }) {
    return(

    );
};

export default PatientUploadScreen;
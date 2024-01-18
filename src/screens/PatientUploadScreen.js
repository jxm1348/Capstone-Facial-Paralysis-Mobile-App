import React from 'react';
import { View, Button } from 'react-native';

const PatientUploadScreen = ({ navigation }) => {
  return (
    <View>
      <Button title="Back" onPress={() => navigation.navigate('PatientHome')} />
    </View>
  );
};

export default PatientUploadScreen;
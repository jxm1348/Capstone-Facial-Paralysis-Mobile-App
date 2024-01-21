import React from 'react';
import { View, Button } from 'react-native';

const PatientMessagesScreen = ({ navigation }) => {
  return (
    <View>
      <Button title="Back" onPress={() => navigation.navigate('Patient Home')} />
    </View>
  );
};

export default PatientMessagesScreen;

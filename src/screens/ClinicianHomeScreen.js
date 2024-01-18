import React from 'react';
import { View, Button, Text } from 'react-native';
import ClinicianTabStack from '../navigation/navigation';

const ClinicianHomeScreen = ({ navigation }) => {
  return (
    <View>
      <Text>Welcome Clinician!</Text>
      <Button title="Sign Out" onPress={() => navigation.navigate('Login')} />
    </View>
  );
};

export default ClinicianHomeScreen;
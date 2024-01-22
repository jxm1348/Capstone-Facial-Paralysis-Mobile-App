import React from 'react';
import { View, Button, Text } from 'react-native';
import PatientTabStack from '../navigation/navigation';

const PatientHomeScreen = ({ navigation }) => {
  return (
    <View>
      <Text>Welcome Patient!</Text>
      <Button title="Sign Out" onPress={() => navigation.navigate('Login')} />
      <PTab.Screen name="Login" component={LoginScreen} />
    </View>
  );
};

export default PatientHomeScreen;
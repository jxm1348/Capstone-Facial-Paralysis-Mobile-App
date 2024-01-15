import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import LoginScreen from './LoginScreen';
import PatientMessagesScreen from './PatientMessagesScreen';
import PatientUploadScreen from './PatientUploadScreen';

const PatientHomeScreen = ({navigation}) => {
  return (
    <View>


      <Button
        title="Sign Out"
        onPress={() => navigation.navigate('Login')}
      />
    </View>
  );
};
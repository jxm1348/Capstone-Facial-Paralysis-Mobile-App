import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import Login from './LoginScreen';
import PatientMessages from './PatientMessagesScreen';
import PatientUpload from './PatientUploadScreen';

const PatientHome = ({navigation}) => {
  return (
    <View>


      <Button
        title="Sign Out"
        onPress={() => navigation.navigate('Login')}
      />
    </View>
  );
};

export default PatientHome;
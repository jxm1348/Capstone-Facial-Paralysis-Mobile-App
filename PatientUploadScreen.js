import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import PatientHome from './PatientHomeScreen';

const PatientUpload = ({navigation}) => {
  return (
    <View>
      <Button
        title="Back"
        onPress={() => navigation.navigate('PatientHome')}
      />
    </View>
  );
};

export default PatientUpload;

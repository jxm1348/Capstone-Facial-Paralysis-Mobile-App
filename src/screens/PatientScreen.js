import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

const PatientScreen = ({navigation}) => {
  
  return (
    <View>
      <Button
        title="Back"
        onPress={() => navigation.navigate('Patients')}
      />
    </View>
  );
};


export default PatientScreen;
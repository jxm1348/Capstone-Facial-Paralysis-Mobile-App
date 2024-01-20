import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import ClinicianViewScreen from './PatientsScreen';
import MainNavigator from'../navigation/navigation';

const ClinicianViewInfoScreen = ({navigation}) => {
  return (
    <View>
      <Button
        title="Back"
        onPress={() => navigation.navigate('Patients')}
      />
    </View>
  );
};


export default ClinicianViewInfoScreen;
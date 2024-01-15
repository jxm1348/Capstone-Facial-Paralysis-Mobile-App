import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import ClinicianHome from './ClinicianHomeScreen';


const ClinicianView = ({navigation}) => {
  return (
    <View>
      <Button
        title="Back"
        onPress={() => navigation.navigate('ClinicianHome')}
      />
    </View>
  );
};

export default ClinicianView;
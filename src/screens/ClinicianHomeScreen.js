import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import Login from './LoginScreen';
import ClinicianView from './ClinicianViewScreen';
import ClinicianViewInfo from './ClinicianViewInfoScreen';

const ClinicianHome = ({ navigation }) => {
  return (
    <View>
      <Button
        title="Sign Out"
        onPress={() => navigation.navigate('Login')}
      />
    </View>
  );
};

export default ClinicianHome;

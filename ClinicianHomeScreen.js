import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import LoginScreen from './LoginScreen';
import ClinicianViewScreen from './ClinicianViewScreen';
import ClinicianViewInfoScreen from './ClinicianViewInfoScreen';

const ClinicianHomeScreen = ({ navigation }) => {
  return (
    <View>
      <Button
        title="Sign Out"
        onPress={() => navigation.navigate('Login')}
      />
    </View>
  );
};


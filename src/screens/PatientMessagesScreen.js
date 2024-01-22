import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import ActionButton from '../components/ActionButton';
import NavigationBar from '../components/NavigationBar';

const PatientMessagesScreen = ({ navigation }) => {
  const buttons = [
    { title: 'Sign Out', onPress: () => navigation.navigate('Login') },
    { title: 'Home', onPress: () => navigation.navigate('PatientHome') },
    { title: 'Upload Images', onPress: () => navigation.navigate('PatientUpload') },
    { title: 'Messages', onPress: () => navigation.navigate('PatientMessages') }
  ];

  return (
    <View>

        <NavigationBar buttons={buttons} />
    </View>
  );
};

export default PatientMessagesScreen;

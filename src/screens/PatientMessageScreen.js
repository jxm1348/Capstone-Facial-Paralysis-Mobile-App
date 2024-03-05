import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import NavigationBar from '../components/NavigationBar';
import state from '../state.mjs';

const PatientMessageScreen = ({ route, navigation }) => {
  const buttons = [
    { title: 'Home', onPress: () => navigation.navigate('PatientHome') },
    { title: 'Go Back', onPress: () => navigation.navigate('PatientMessages', {withUid: state.clinicianUid}) },
  ];

  const { message } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.messageContainer}>
        <Text style={styles.senderText}>{message.sender}</Text>
        <Text style={styles.messageText}>{message.message}</Text>
      </View>
      <View style={styles.navigationBar}>
        <NavigationBar buttons={buttons} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messageContainer: {
    flex: 3,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  senderText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  messageText: {
    fontSize: 16,
  },
  navigationBar: {
    flex: 1,
  },
});

export default PatientMessageScreen;
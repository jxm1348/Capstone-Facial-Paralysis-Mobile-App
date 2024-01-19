import React from 'react';
import { View, Button, Text, StyleSheet, TextInput } from 'react-native';
import ClinicianTabStack from '../navigation/navigation';
import ClinicianNavBar from '../components/ClinicianNavBar';
import { Button1 } from '../components/buttons';

const ClinicianHomeScreen = ({ navigation, colors }) => {
  return (
    <View style={styles.container}>
        <View style={{
          flexGrow: 1,
        }}>
          <Text style={styles.h1}>Welcome, Jane Doe!</Text>
          <View style={styles.spacerFull}></View>
          <View style={{
            alignItems: 'center',
            
          }}>
          <Button1 title="Sign Out" onPress={() => navigation.navigate('Login')}></Button1>
          </View>
        </View>
        <ClinicianNavBar {...{navigation, colors}}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#ffffff",
  }, h1: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  }, btnSignout: {
    margin: 10,
    padding: 10,
    backgroundColor: 'magenta',
    color: 'magenta',
  }, spacerFull: {
    flexGrow: 1,
  }
});

export default ClinicianHomeScreen;
import React from 'react';
import { View, Button, Text } from 'react-native';
import ClinicianTabStack from '../navigation/navigation';
import NavBar from '../components/NavBar';

const ClinicianHomeScreen = ({ navigation, colors }) => {
  return (
    <View style={{
      display: 'flex',
      flexGrow: 1,
      backgroundColor: "#ffffff",
    }}>
        <View style={{
          flexGrow: 1,
        }}>
          <Text>Welcome Clinician!</Text>
          <Button title="Sign Out" onPress={() => navigation.navigate('Login')} />
        </View>
        <NavBar {...{navigation, colors}}/>
    </View>
  );
};

export default ClinicianHomeScreen;
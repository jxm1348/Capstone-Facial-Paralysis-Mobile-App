import { View, Text, StyleSheet } from 'react-native';
import NavigationBar from '../components/NavigationBar';

import state from '../state.js';

const PatientHomeScreen = ({ navigation }) => {

  const buttons = [
    { title: 'Sign Out', onPress: () => navigation.navigate('Login') },
    { title: 'Upload Images', onPress: () => navigation.navigate('PatientUpload'), id: 'pressable-navbar-upload' },
    { title: 'Messages', onPress: () => navigation.navigate('PatientMessages', {withUid: state.clinicianUid}), id: 'pressable-navbar-messages' }
  ];

  return (
    <View style={{ flex: 1 }}>
      <Text>Welcome Patient!</Text>
      <NavigationBar buttons={buttons} />
    </View>
  );
};

export default PatientHomeScreen;
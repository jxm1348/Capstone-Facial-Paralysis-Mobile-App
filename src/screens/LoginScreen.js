import { useState, useRef } from 'react';
import {
  Image,
  StyleSheet, 
  TextInput, 
  View, 
  Alert,
  Pressable,
  Text 
} from 'react-native';

import globalStyles from '../globalStyles';
import state, { login } from '../state.mjs';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const emailInput = useRef();
  const passwordInput = useRef();

  const handleLogin = async () => {
    await login(email, password);
    if (email === 'mgrey@gmail.com' && password === 'password') {
      navigation.navigate('ClinicianHome');
    } else if ((email === 'jdoe@gmail.com' || email === 'mpeschel@gmail.com') && password === 'password') {
      navigation.navigate('PatientHome');
    } else {
      console.log('Refusing to navigate to clinician or patient home since I don\'t know who', email, 'is, or password wrong.');
      Alert.alert('Invalid credentials');
    }
  };

  const debugClinicianLogin = async () => {
    await login('mgrey@gmail.com', 'password');
    navigation.navigate('ClinicianHome');
  };

  const debugPatientLogin = async () => {
    await login('mpeschel@gmail.com', 'password');
    navigation.navigate('PatientHome');
  }

  const debugButtons = [];
  if (state.demoIsDebug) {
    debugButtons.push(<Pressable key={0} style={globalStyles.button} onPress={async () => {
      await login('mpeschel@gmail.com', 'password');
      navigation.navigate('PatientCamera', {imageKey: 'eyebrows-up'});
    }}>
      <Text style={{color: 'white'}}>Debug Camera</Text>
    </Pressable>);
    debugButtons.push(<Pressable key={1} style={globalStyles.button} onPress={debugClinicianLogin} nativeID="pressable-debug-clinician">
      <Text style={{color: 'white'}}>Debug log in as clinician</Text>
    </Pressable>);
    debugButtons.push(<Pressable key={2} style={globalStyles.button} onPress={debugPatientLogin}>
      <Text style={{color: 'white'}}>Debug log in as patient</Text>
    </Pressable>);
  }

  return (
    <View style={styles.container}>
      <Image
        source={require('../resources/face-f-root.png')}
      />
      <TextInput
        nativeID='text-input-email'
        ref={emailInput}
        autoComplete='email'
        autoFocus={true}
        returnKeyType='next'
        style={styles.input}
        placeholder="email"
        onSubmitEditing={() => passwordInput.current?.focus()}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        nativeID='text-input-password'
        ref={passwordInput}
        autoComplete='current-password'
        returnKeyType='go'
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
        onSubmitEditing={handleLogin}
        onChangeText={(text) => setPassword(text)}
      />
      <Pressable onPress={handleLogin} nativeID='pressable-login' style={globalStyles.button}>
        <Text style={globalStyles.buttonText}>Login</Text>
      </Pressable>
      {debugButtons}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    width: 200,
    padding: 10,
  },
});

export default LoginScreen;
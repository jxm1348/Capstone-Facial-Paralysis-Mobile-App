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
    const role = {
      'mgrey@gmail.com':'clinician',
      'taltman@gmail.com':'clinician',
      'cyang@gmail.com':'clinician',

      'mpeschel@gmail.com':'patient',
      'jdoe@gmail.com':'patient',
      'jxm@gmail.com':'patient',
      'jcarson@gmail.com':'patient',
    }[email];
    
    if (role === undefined || password !== 'password') {
      console.log('Refusing to navigate to clinician or patient home since I don\'t know who', email, 'is, or password wrong.');
      Alert.alert('Invalid credentials');
      return;
    }
    
    await login(email, password);
    navigation.navigate(role === 'clinician' ? 'ClinicianHome' : 'PatientHome');
  };

  const debugClinicianLogin = async (email) => {
    await login(email, 'password');
    navigation.navigate('ClinicianHome');
  };

  const debugPatientLogin = async (email) => {
    await login(email, 'password');
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
    debugButtons.push(<Pressable key={1} style={globalStyles.button} onPress={() => debugClinicianLogin('mgrey@gmail.com')} nativeID="pressable-debug-clinician">
      <Text style={{color: 'white'}}>Debug log in as Meredith Grey</Text>
    </Pressable>);
    debugButtons.push(<Pressable key={2} style={globalStyles.button} onPress={() => debugClinicianLogin('taltman@gmail.com')} nativeID="pressable-debug-taltman">
      <Text style={{color: 'white'}}>Debug log in as Teddy Altman</Text>
    </Pressable>);
    debugButtons.push(<Pressable key={3} style={globalStyles.button} onPress={() => debugClinicianLogin('cyang@gmail.com')} nativeID="pressable-debug-cyang">
      <Text style={{color: 'white'}}>Debug log in as Cristina Yang</Text>
    </Pressable>);
    debugButtons.push(<Pressable key={4} style={globalStyles.button} onPress={() => debugPatientLogin('mpeschel@gmail.com')}>
      <Text style={{color: 'white'}}>Debug log in as Mark Peschel</Text>
    </Pressable>);
    debugButtons.push(<Pressable key={5} style={globalStyles.button} onPress={() => debugPatientLogin('jcarson@gmail.com')}>
      <Text style={{color: 'white'}}>Debug log in as Josh Carson</Text>
    </Pressable>);
    debugButtons.push(<Pressable key={6} style={globalStyles.button} onPress={() => debugPatientLogin('jxm@gmail.com')}>
      <Text style={{color: 'white'}}>Debug log in as jxm</Text>
    </Pressable>);
  }

  return (
    <View style={styles.container}>
      <TextInput
        nativeID="text-input-email"
        ref={emailInput}
        autoComplete="email"
        autoFocus={true}
        returnKeyType="next"
        style={styles.input}
        placeholder="Email"
        onSubmitEditing={() => passwordInput.current?.focus()}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        nativeID="text-input-password"
        ref={passwordInput}
        autoComplete="current-password"
        returnKeyType="go"
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
        onSubmitEditing={handleLogin}
        onChangeText={(text) => setPassword(text)}
      />
      <Pressable onPress={handleLogin} nativeID="pressable-login" style={globalStyles.button}>
        <Text style={globalStyles.buttonText}>Login</Text>
      </Pressable>
      {debugButtons}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'safe center',
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
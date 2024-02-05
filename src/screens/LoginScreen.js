import React, { useState, createRef, useRef } from 'react';
import {
  Image,
  StyleSheet, 
  TextInput, 
  View, 
  Button, 
  Alert,
  Platform,
  Pressable,
  Text 
} from 'react-native';

import state from '../state';
import globalStyles from '../globalStyles';
import ActionButton from '../components/ActionButton';

const LoginScreen = ({ navigation }) => {
  const [ cloudImageSource, setCloudImageSource ] = useState(undefined);

  const debugClinicianLogin = async () => {
    await state.login('Jane doe', 'password');
    navigation.navigate('Clinician Home');
  };

  const debugPatientLogin = async () => {
    await state.login('Mark Peschel', 'password');
    navigation.navigate('PatientHome');
  }

  const testCloudStorage = () => {
    console.log("Setting source.");
    setCloudImageSource({ 'uri': 'https://mpeschel10.github.io/fa/test/face-f-at-rest.png'});
  }
  
  if (state.demoIsDebug && Platform.OS === 'web') {
    React.useEffect(() => {
      state.demoChord = false;
    })

    React.useEffect(() => {
      window.addEventListener("keydown", (event) => {
        if (event.key === 'k' && event.ctrlKey) {
          state.demoChord = true;
          event.preventDefault();
        } else if (state.demoChord) {
          if (event.key === 'Control') return;
          
          console.log("Chord", event.key);
          if (event.key === 'w') {
            navigation.navigate('Report', {name: "Mark Peschel", index: 0});
            event.preventDefault();
          }
          
          state.demoChord = false;
        } else {
          state.demoChord = false;
        }
      });
    }, []);
  }

  const debugButtons = [];
  if (state.demoIsDebug) {
    debugButtons.push(<Pressable key={0} style={globalStyles.button} onPress={()=>navigation.navigate('PatientCamera', {imageKey: 'eyebrows-up'})}>
      <Text style={{color: 'white'}}>Debug Camera</Text>
    </Pressable>);
    debugButtons.push(<Pressable key={1} style={globalStyles.button} onPress={debugClinicianLogin}>
      <Text style={{color: 'white'}}>Debug log in as clinician</Text>
    </Pressable>);
    debugButtons.push(<Pressable key={2} style={globalStyles.button} onPress={debugPatientLogin}>
      <Text style={{color: 'white'}}>Debug log in as patient</Text>
    </Pressable>);
    debugButtons.push(<Pressable key={3} style={globalStyles.button} onPress={testCloudStorage}>
      <Text style={{color: 'white'}}>Debug do cloud storage</Text>
    </Pressable>);
  }


  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const usernameInput = createRef();
  const passwordInput = createRef();

  const handleLogin = () => {
    if (username === 'Jane doe' && password === 'password') {
      navigation.navigate('Clinician Home');
    } else if (username === 'John doe' && password === 'password') {
      navigation.navigate('PatientHome');
    } else {
      Alert.alert('Invalid credentials');
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../resources/face-f-root.png')}
      />
      <Image style={{width: 50, height:50}} source={cloudImageSource}/>
      <TextInput
        ref={usernameInput}
        autoComplete='username'
        autoFocus={true}
        returnKeyType='next'
        style={styles.input}
        placeholder="Username"
        onSubmitEditing={() => passwordInput.current?.focus()}
        onChangeText={(text) => setUsername(text)}
      />
      <TextInput
        ref={passwordInput}
        autoComplete='current-password'
        returnKeyType='go'
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
        onSubmitEditing={handleLogin}
        onChangeText={(text) => setPassword(text)}
      />
      <Button 
        title="Login"
        onPress={handleLogin} />
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
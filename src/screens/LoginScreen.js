import React, { useState } from 'react';
import { StyleSheet, TextInput, View, Button, Alert, Platform } from 'react-native';

import state from "../state";

const LoginScreen = ({ navigation }) => {
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



  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (true || (username === 'Jane doe' && password === 'password')) {
      navigation.navigate('Clinician Home');
    } else if (username === 'John doe' && password === 'password') {
      navigation.navigate('Patient Home');
    } else {
      Alert.alert('Invalid credentials');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Username"
        onChangeText={(text) => setUsername(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
        onChangeText={(text) => setPassword(text)}
      />
      <Button title="Login" onPress={handleLogin} />
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
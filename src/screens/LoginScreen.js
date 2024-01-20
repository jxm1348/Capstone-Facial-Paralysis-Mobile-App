import React, { useState, createRef } from 'react';
import { StyleSheet, TextInput, View, Button, Alert } from 'react-native';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const usernameInput = createRef();
  const passwordInput = createRef();

  const handleLogin = () => {
    if (username === 'Jane doe' && password === 'password') {
      navigation.navigate('ClinicianHome');
    } else if (username === 'John doe' && password === 'password') {
      navigation.navigate('PatientHome');
    } else {
      Alert.alert('Invalid credentials');
    }
  };

  return (
    <View style={styles.container}>
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
import React, { useState } from 'react';
import { StyleSheet, TextInput, View, Button, Alert } from 'react-native';

const Login = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        const userType = data.userType;

        if (userType === 'Clinician') {
          navigation.navigate('ClinicianHome');
        } else if (userType === 'Patient') {
          navigation.navigate('PatientHome');
        } else {
          Alert.alert('Login Failed', 'User type not assigned. Please contact Administrator');
        }
      } else {
        Alert.alert('Login Failed', 'Invalid username or password');
      }
    } catch (error) {
      console.error('Login Error:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Username"
      />
      <TextInput
        placeholder="Password"
      />
      <Button title="Login" onPress={handleLogin} />
      <Button title="next clinician" onPress={navigation.navigate('ClinicianHome')} />
      <Button title="next patient" onPress={navigation.navigate('PatientHome')} />
    </View>
  );
};

export default Login;
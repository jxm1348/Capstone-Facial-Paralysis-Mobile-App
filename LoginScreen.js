import { StyleSheet, Text, View } from 'react-native';
import * as React from 'react';

const LoginScreen = ({navigation}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

      //Login navigation based on User account type
      const handleLogin = async () => {
        try {
          const response = await axios.post('http://your_server_ip:3000/login', {
            username,
            password,
          });

          if (response.data.success) {
            const userType = response.data.userType;

            // Navigation based on user type
            if (userType === 'Clinician') {
              navigation.navigate('ClinicianHome');

            } else if (userType === 'Patient') {
              navigation.navigate('PatientHome');
            } else {
              Alert.alert('Login Failed', 'User Type not assigned. Please contact Administrator');
            }
          } else {
            Alert.alert('Login Failed', 'Invalid username or password');
          }
        } catch (error) {
          console.error('Login Error:', error);
          Alert.alert('Error', 'An unexpected error occurred');
        }
      };
};
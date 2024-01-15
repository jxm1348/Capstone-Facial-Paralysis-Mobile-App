import { StyleSheet, Text, View } from 'react-native';
import * as React from 'react';
import LoginScreen from './LoginScreen';
import PatientMessagesScreen from './PatientMessagesScreen';
import PatientUploadScreen from './PatientUploadScreen';

const PatientHomeScreen = ({navigation}) => {
    return (
        <Button
            title="Sign Out"
            onPress={() =>
                navigation.navigate('Login')
            }
        />
    );
};

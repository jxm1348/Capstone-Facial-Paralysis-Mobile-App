import { StyleSheet, Text, View } from 'react-native';
import * as React from 'react';
import LoginScreen from './LoginScreen';

const PatientHomeScreen = ({navigation}) => {
    return (
        <Button
            title=""
            onPress={() =>
                navigation.navigate('', {name: ''})
            }
        />
    );
};
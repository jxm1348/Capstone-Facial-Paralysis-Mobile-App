import { StyleSheet, Text, View } from 'react-native';
import * as React from 'react';
import LoginScreen from './LoginScreen';



const ClinicianHomeScreen = ({navigation}) => {
    return (
        <Button
            title="Back"
            onPress={(navigation.navigate{Login}) =>
                navigation.navigate('', {name: ''})
            }
        />
    );
};
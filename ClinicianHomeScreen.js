import { StyleSheet, Text, View } from 'react-native';
import * as React from 'react';
import LoginScreen from './LoginScreen';
import ClinicianViewScreen from './ClinicianViewScreen';
import ClinicianViewInfoScreen from './ClinicianViewInfoScreen';

const ClinicianHomeScreen = ({navigation}) => {
    return (
        <Button
            title="Sign Out"
            onPress={() =>
                navigation.navigate('Login')
            }
        />
    );
};
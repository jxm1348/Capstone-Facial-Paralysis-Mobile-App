import { StyleSheet, Text, View } from 'react-native';
import * as React from 'react';

const LoginScreen = ({navigation}) => {
    return (
        <Button
            title="Login"
            onPress={() =>
                navigation.navigate('', {name: ''})
            }
        />
    );
};
import { StyleSheet, Text, View } from 'react-native';
import * as React from 'react';

const PatientMessagesScreen = ({navigation}) => {
    return (
        <Button
            title=""
            onPress={() =>
                navigation.navigate('', {name: ''})
            }
        />
    );
};
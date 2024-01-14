import { StyleSheet, Text, View } from 'react-native';
import * as React from 'react';


const ClinicianViewScreen = ({navigation}) => {
    return (
        <Button
            title=""
            onPress={() =>
                navigation.navigate('', {name: ''})
            }
        />
    );
};
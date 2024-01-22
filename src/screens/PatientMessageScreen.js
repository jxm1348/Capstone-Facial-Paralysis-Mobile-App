import React, { useState } from 'react';
import ActionButton from '../components/ActionButton';
import MainNavigator from '../navigation/navigation';

const PatientMessageScreen = ({navigation}) => {
  const buttons = [
    { title: 'Sign Out', onPress: () => navigation.navigate('Login') },
    { title: 'Home', onPress: () => navigation.navigate('PatientHome') },
    { title: 'Upload Images', onPress: () => navigation.navigate('PatientUpload') },
    { title: 'Messages', onPress: () => navigation.navigate('PatientMessages') }
  ];
    return(
        <View>
            <Text>Hello</Text>
            <NavigationBar buttons={buttons} />
        </View>
    );
};

export default PatientMessageScreen;
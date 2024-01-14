import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import LoginScreen from './src/screens/LoginScreen';
import ClinicianHomeScreen from './src/screens/ClinicianHomeScreen';
import ClinicianViewScreen from './src/screens/ClinicianViewScreen';
import ClinicianViewInfoScreen from './src/screens/ClinicianViewInfoScreen';
import PatientHomeScreen from './src/screens/PatientHomeScreen';
import PatientMessagesScreen from './src/screens/PatientMessagesScreen';
import PatientUploadScreen from './src/screens/PatientUploadScreen';

const App = () => {
    return (
        navigation.navigate('Login');
    );
};


const Stack = createNativeStackNavigator();

const MyStack = () => {
    return (
        <NavigationContainer>
              <Stack.Navigator>
                <Stack.Screen
                    name="Login"
                    component={LoginScreen}
                    options={{title: 'Welcome'}}
                />
                <Stack.Screen
                    name="ClinicianHome"
                    component={ClinicianHomeScreen}
                />
                <Stack.Screen
                    name="ClinicianView"
                    component={ClinicianViewScreen}
                />
                <Stack.Screen
                    name="ClinicianViewInfo"
                    component={ClinicianViewInfoScreen}
                />
                <Stack.Screen
                    name="PatientHome"
                    component={PatientHomeScreen}
                />
                <Stack.Screen
                    name="PatientUpload"
                    component={PatientUploadScreen}
                />
                <Stack.Screen
                    name="PatientMessages"
                    component={PatientMessagesScreen}
                />
              </Stack.Navigator>
        </NavigationContainer>
    );
};


export default App;


import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import ClinicianHomeScreen from '../screens/ClinicianHomeScreen';
import PatientHomeScreen from '../screens/PatientHomeScreen';
import ClinicianViewScreen from '../screens/ClinicianViewScreen';
import ClinicianViewInfoScreen from '../screens/ClinicianViewInfoScreen';
import PatientMessagesScreen from '../screens/PatientMessagesScreen';
import PatientUploadScreen from '../screens/PatientUploadScreen';

const Stack = createNativeStackNavigator();

export default function MainNavigator() {
  return (
    <NavigationContainer initialRouteName='Login'>
        <Stack.Navigator>
            <Stack.Screen name="Login" component={LoginScreen}  />
            <Stack.Screen name="Clinician Home" component={ClinicianHomeScreen} />
            <Stack.Screen name="Patients" component={ClinicianViewScreen} />
            <Stack.Screen name="Patient" component={ClinicianViewInfoScreen} />
            <Stack.Screen name="PatientHome" component={PatientHomeScreen} />
            <Stack.Screen name="PatientUpload" component={PatientUploadScreen} />
            <Stack.Screen name="PatientMessages" component={PatientMessagesScreen} />
        </Stack.Navigator>
    </NavigationContainer>
  );
}





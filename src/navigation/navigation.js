import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';

import ClinicianHomeScreen from '../screens/ClinicianHomeScreen';
import PatientsScreen from '../screens/PatientsScreen';
import ClinicianPatientScreen from '../screens/ClinicianPatientScreen';
import ReportScreen from '../screens/ReportScreen';

import PatientHomeScreen from '../screens/PatientHomeScreen';
import PatientMessagesScreen from '../screens/PatientMessagesScreen';
import PatientUploadScreen from '../screens/PatientUploadScreen';
import PatientCameraScreen from '../screens/PatientCameraScreen';
import PatientMessageScreen from '../screens/PatientMessageScreen';


const Stack = createNativeStackNavigator();

export default function MainNavigator() {
  return (
    <NavigationContainer initialRouteName='Login'>
        <Stack.Navigator>
            <Stack.Screen name="Login" component={LoginScreen}  />
            
            <Stack.Screen name="Clinician Home" component={ClinicianHomeScreen} />
            <Stack.Screen name="Patients" component={PatientsScreen} />
            <Stack.Screen name="ClinicianPatient" component={ClinicianPatientScreen} />
            <Stack.Screen name="Report" component={ReportScreen} />
            
            <Stack.Screen name="PatientHome" component={PatientHomeScreen} />
            <Stack.Screen name="PatientUpload" component={PatientUploadScreen} />
            <Stack.Screen name="PatientMessages" component={PatientMessagesScreen} />
            <Stack.Screen name="PatientCamera" component={PatientCameraScreen} />
            <Stack.Screen name="PatientMessage" component={PatientMessageScreen} />
        </Stack.Navigator>
    </NavigationContainer>
  );
}





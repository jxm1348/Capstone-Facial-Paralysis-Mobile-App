import { StyleSheet, Text, View } from 'react-native';
import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';


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


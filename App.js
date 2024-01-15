import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './LoginScreen';
import ClinicianHomeScreen from './ClinicianHomeScreen';
import PatientHomeScreen from './PatientHomeScreen';
import ClinicianViewScreen from './ClinicianViewScreen';
import ClinicianViewInfoScreen from './ClinicianViewInfoScreen';
import PatientMessagesScreen from './PatientMessagesScreen';
import PatientUploadScreen from './PatientUploadScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>
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
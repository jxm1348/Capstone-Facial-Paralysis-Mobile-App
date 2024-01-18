import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './LoginScreen';
import ClinicianHome from './ClinicianHomeScreen';
import PatientHome from './PatientHomeScreen';
import ClinicianView from './ClinicianViewScreen';
import ClinicianViewInfo from './ClinicianViewInfoScreen';
import PatientMessages from './PatientMessagesScreen';
import PatientUpload from './PatientUploadScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer initialRouteName='Login'>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login}  />
        <Stack.Screen name="ClinicianHome" component={ClinicianHome} />
        <Stack.Screen name="ClinicianView" component={ClinicianView} />
        <Stack.Screen name="ClinicianViewInfo" component={ClinicianViewInfo} />
        <Stack.Screen name="PatientHome" component={PatientHome} />
        <Stack.Screen name="PatientUpload" component={PatientUpload} />
        <Stack.Screen name="PatientMessages" component={PatientMessages} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
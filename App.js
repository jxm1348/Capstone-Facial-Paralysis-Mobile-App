import { StyleSheet, Text, View } from 'react-native';
import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';



const App = () => {



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

const LoginScreen = ({navigation}) => {
    return (
        <Button
            title=""
            onPress={() =>
                navigation.navigate('', {name: ''})
            }
        />
    );
};

const ClinicianHomeScreen = ({navigation}) => {
    return (
        <Button
            title=""
            onPress={() =>
                navigation.navigate('', {name: ''})
            }
        />
    );
};

const PatientHomeScreen = ({navigation}) => {
    return (
        <Button
            title=""
            onPress={() =>
                navigation.navigate('', {name: ''})
            }
        />
    );
};

const PatientUploadScreen = ({navigation}) => {
    return (
        <Button
            title=""
            onPress={() =>
                navigation.navigate('', {name: ''})
            }
        />
    );
};

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

const  = ({navigation}) => {
    return (
        <Button
            title=""
            onPress={() =>
                navigation.navigate('', {name: ''})
            }
        />
    );
};

export default App;


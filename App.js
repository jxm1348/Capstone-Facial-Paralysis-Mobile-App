import * as React from 'react';
import MainNavigator from './src/navigation/navigation'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';



const App = () => {
    return (
        <MainNavigator />
    );
}

export default App;
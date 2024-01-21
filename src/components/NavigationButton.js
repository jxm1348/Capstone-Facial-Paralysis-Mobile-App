import React from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';
import MainNavigator from '../navigation/navigation';


export default function NavigationButton ({navigation, title, route, onPress}) => {
    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
          <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
      );
    };

const styles = StyleSheet.create({
  button: {
    borderWidth: 2,
    borderColor: '#041E42',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  buttonText: {
    color: 'black',
  },
});
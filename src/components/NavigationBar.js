import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const NavigationBar = ({ buttons }) => {
  return (
    <View style={styles.navigationBar}>
      {buttons.map((button, index) => (
        <TouchableOpacity key={index} style={styles.button} onPress={button.onPress}>
          <Text style={styles.buttonText}>{button.title}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  navigationBar: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#041E42',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
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

export default NavigationBar;
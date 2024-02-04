import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

// Designed for use in a flexbox layout that grows to push the bar to the bottom.
// Fixes a bug where ScrollView can't show entire content because position:absolute content
//  is covering it up.
export const FlexNavigationBar = ({ buttons, containerStyle }) => {
  containerStyle = Object.assign({
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#041E42',
  }, containerStyle);

  return (
    <View style={containerStyle}>
      {buttons.map((button, index) => (
        <TouchableOpacity key={index} style={styles.button} onPress={button.onPress}>
          <Text style={styles.buttonText}>{button.title}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const NavigationBar = ({ buttons }) => {
  const containerStyle = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  };
  
  return <FlexNavigationBar {...{buttons, containerStyle}} />;
}

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

export default NavigationBar;
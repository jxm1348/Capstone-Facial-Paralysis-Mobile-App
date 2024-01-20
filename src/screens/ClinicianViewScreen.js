import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';

import state from '../state';
import UnreadBadge from '../components/UnreadBadge';

const ClinicianViewScreen = ({ navigation }) => {

  const patientItems = state.demoPatientMessages.map(({name, unread}) => {
    return (
      <Pressable
        key={name}
        style={styles.patientContainer} onPress={() => navigation.navigate('ClinicianViewInfo')}
      >
        <Text style={styles.patientName}>{name}</Text>
        <View>
          <Image
            style={styles.patientThumbnail}
            // source={require('/assets/face-f-at-rest.png')}
            source={{
              uri: 'https://reactnative.dev/img/tiny_logo.png',
            }}
              />
          <UnreadBadge value={unread} />
        </View>
      </Pressable>
    );
  })

  return (
    <View>
      <Text style={styles.h1}>Patients</Text>
      <View>{patientItems}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  h1: {
    fontSize: 40,
    textAlign: 'center',
    margin: 10,
  }, patientContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 10,
      marginHorizontal: 40,
      padding: 5,
      borderColor: '#2060dd',
      borderWidth: 2,
      borderRadius: 5,
  }, patientThumbnail: {
    width: 90,
    height: 90,
  }, patientName: {
    flexGrow: 1,
    textAlign: 'center',
    fontSize: 35,
  }
});

export default ClinicianViewScreen;

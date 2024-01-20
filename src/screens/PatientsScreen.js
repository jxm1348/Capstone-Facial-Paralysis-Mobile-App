import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';

import state from '../state';
import UnreadBadge from '../components/UnreadBadge';
import globalStyles from '../globalStyles';

const PatientsScreen = ({ navigation }) => {
  const patientItems = state
    .demoPatients
    .slice()
    .sort((p1, p2) => (state.demoGetUnreadPatient(p2) - state.demoGetUnreadPatient(p1))) // ascending
    .map(patient => {
    const { name } = patient;
    const unread = state.demoGetUnreadPatient(patient);
    return (
      <Pressable
        key={name}
        style={styles.patientContainer} onPress={() => navigation.navigate('Patient', {name})}
      >
        <Text style={styles.patientName}>{name}</Text>
        <View>
          <Image
            style={styles.patientThumbnail}
            source={{
              uri: 'https://mpeschel10.github.io/fa/test/face-f-at-rest.svg',
            }}
              />
          <UnreadBadge value={unread} />
        </View>
      </Pressable>
    );
  })

  return (
    <View>
      <Text style={globalStyles.h1}>Patients</Text>
      <View>{patientItems}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  patientContainer: {
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

export default PatientsScreen;

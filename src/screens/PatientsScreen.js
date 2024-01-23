import React from 'react';
import { View, Text, StyleSheet, Pressable, Image, ScrollView } from 'react-native';

import state from '../state';
import UnreadBadge from '../components/UnreadBadge';
import globalStyles from '../globalStyles';
import { useIsFocused } from '@react-navigation/native';

function PatientMessagesPressable({patient, navigation}) {
  const { name } = patient;
  return (
    <Pressable
      style={styles.patientContainer} onPress={() => navigation.navigate('Patient', {name})}
    >
    <View style={{flexGrow: 1, marginHorizontal: 25, flexShrink: 1}}>
      <Text style={{fontSize: 35}}>{name}</Text>
      { patient.latestMessage !== null ?
        <Text style={{}}>Last message {patient.latestMessage}</Text> :
        undefined
      }
    </View>
    <View>
      <Image
        style={styles.patientThumbnail}
        source={{
          uri: patient.thumbnail,
        }}
      />
      <UnreadBadge value={state.demoGetUnreadPatient(patient)} />
    </View>
    </Pressable>
  );
}

function compareMostRecent(p1, p2) {
  if (p1.latestMessage === null) return 1;
  if (p2.latestMessage === null) return -1;
  return -p1.latestMessage.localeCompare(p2.latestMessage);
}

const PatientsScreen = ({ navigation }) => {
  useIsFocused() // Force refresh

  const patientItems = state
    .demoPatients
    .slice()
    .sort(compareMostRecent)
    .map(patient =>
      <PatientMessagesPressable key={patient.name} patient={patient} navigation={navigation}/>
    );

  return (
    <ScrollView style={{flexGrow: 1}}>
      <Text style={globalStyles.h1}>Patients</Text>
      <View>{patientItems}</View>
    </ScrollView>
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
  }
});

export default PatientsScreen;

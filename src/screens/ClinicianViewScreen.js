import React from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';

import state from '../state';

const ClinicianViewScreen = ({ navigation }) => {

  const patientItems = state.demoPatientMessages.map(({name, unread}) => {
    return (<View key={name} style={styles.patientRow}>
      <Button title={name} onPress={() => navigation.navigate('ClinicianViewInfo')}></Button>
      <Text style={{
        display: unread > 0 ? 'flex' : 'none'
      }}>{unread} Unread</Text>
    </View>)

  })

  return (
    <View>
      <Text style={{
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
      }}>Patients</Text>
      <View>{patientItems}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  patientRow: {
      flexDirection: 'row',
      alignItems: 'center',
  }
});

export default ClinicianViewScreen;

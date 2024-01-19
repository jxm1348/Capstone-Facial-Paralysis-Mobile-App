import React from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';

import state from '../state';
import UnreadBadge from '../components/UnreadBadge';

const ClinicianViewScreen = ({ navigation }) => {

  const patientItems = state.demoPatientMessages.map(({name, unread}) => {
    return (<View key={name} style={styles.patientRow}>
      <View>
        <Button title={name} onPress={() => navigation.navigate('ClinicianViewInfo')} />
        <UnreadBadge value={unread} />
      </View>
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

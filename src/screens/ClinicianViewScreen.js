import React from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';

const ClinicianViewScreen = ({ navigation }) => {
  const patientData = [
    {name:'John Doe', unread: 2},
    {name:'Mark Peschel', unread: 1},
    {name:'Gabriel Marx', unread: 0},
    {name:'Quinn Wilson', unread: 0},
  ];

  const patientItems = patientData.map(({name, unread}) => {
    return (<View key={name} style={styles.patientRow}>
      <Button title={name} onPress={() => navigation.navigate('ClinicianViewInfo')}></Button>
      <Text style={{
        display: unread > 0 ? 'flex' : 'none'
      }}>{unread} Unread</Text>
    </View>)

  })
  console.log(patientData);
  console.log(patientItems);

  return (
    <View>
      <Text style={{
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
      }}>Patients</Text>
      <View>{patientItems}</View>
      {/* <Button title="Back" onPress={() => navigation.navigate('ClinicianHome')} /> */}
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

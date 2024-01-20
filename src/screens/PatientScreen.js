import React from 'react';
import { Text, View, Button } from 'react-native';

import globalStyles from '../globalStyles';
import state from '../state';

const PatientScreen = ({navigation, route}) => {
  const { name } = route.params;
  const patient = state.demoGetPatientByName(name);
  for (const message of patient.messages) {
    message.read = true;
  }
  
  return (
    <View>
      <Text style={globalStyles.h1}>{name}</Text>
      <Button
        title="Back"
        onPress={() => navigation.navigate('Patients')}
      />
    </View>
  );
};

export default PatientScreen;
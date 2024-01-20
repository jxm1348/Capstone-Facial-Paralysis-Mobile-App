import React from 'react';
import { Text, View, Button } from 'react-native';
import ReportRow from '../components/ReportRow';

import globalStyles from '../globalStyles';
import state from '../state';

const PatientScreen = ({navigation, route}) => {
  const { name } = route.params;
  const patient = state.demoGetPatientByName(name);
  
  const messageComponents = patient.messages.map((message, index) =>
    (<ReportRow key={index} {...{message}} />)
  );
  
  for (const message of patient.messages) {
    message.read = true;
  }

  return (
    <View>
      <Text style={globalStyles.h1}>{name}</Text>
      <View style={{gap: 6, paddingHorizontal: 40}}>
        {messageComponents}
      </View>
    </View>
  );
};

export default PatientScreen;
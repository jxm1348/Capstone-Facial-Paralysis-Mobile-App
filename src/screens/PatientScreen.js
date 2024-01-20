import React from 'react';
import { Text, View, Pressable } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import ReportRow from '../components/ReportRow';

import globalStyles from '../globalStyles';
import state from '../state';

const PatientScreen = ({navigation, route}) => {
  useIsFocused();

  const { name } = route.params;
  const patient = state.demoGetPatientByName(name);
  
  const messageComponents = patient.messages.map((message, index) =>
    (<Pressable key={index} onPress={() => navigation.navigate('Report', {name: patient.name, index})}>
      <ReportRow {...{message}} />
    </Pressable>)
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
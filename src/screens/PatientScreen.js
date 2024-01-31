import React from 'react';
import { Text, View, Pressable, ScrollView } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { getDoc, doc } from 'firebase/firestore';

import globalStyles from '../globalStyles';
import state from '../state';

import ReportRow from '../components/ReportRow';
import PatientSkeleton from '../skeletons/PatientSkeleton.mjs';

const PatientScreen = ({navigation, route}) => {
  useIsFocused();

  const { id, name } = route.params;

  const [ patient, setPatient ] = React.useState(null);
  React.useEffect(() => {
    getDoc(doc(state.db, "users", id))
      .then(document => setPatient(document.data()));
  }, []);

  let messageComponents;
  if (patient === null) {
    messageComponents = <PatientSkeleton />;
  } else {
    messageComponents = patient.messages.map((message, index) =>
      (<Pressable key={index} onPress={() => navigation.navigate('Report', {name, index, id})}>
        <ReportRow {...{message}} />
      </Pressable>)
    );
    for (const message of patient.messages) {
      message.read = true;
    }
  }
  
  return (
    <View style={{flexGrow: 1}}>
      <Text style={globalStyles.h1}>{name}</Text>
      <ScrollView style={{flexGrow: 1}}>
        <ScrollView style={{flexGrow: 1, marginBottom: 100}} vertical={true} horizontal={true}>
          <View style={{gap: 6, paddingHorizontal: 40, paddingVertical: 10}}>
            {messageComponents}
          </View>
        </ScrollView>
      </ScrollView>
    </View>
  );
};

export default PatientScreen;
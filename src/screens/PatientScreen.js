import { useEffect, useState } from 'react';
import { Text, View, Pressable, ScrollView } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { getDoc, doc, updateDoc } from 'firebase/firestore';

import globalStyles from '../globalStyles';
import state from '../state';

import ReportRow from '../components/ReportRow';
import { setPatientRead } from '../state.mjs';

function PatientSkeleton() {
    return (<Text>Loading...</Text>);
}

const PatientScreen = ({navigation, route}) => {
  useIsFocused();

  const { id, name } = route.params;

  const [ patient, setPatient ] = useState(null);
  useEffect(() => {
    getDoc(doc(state.db, "users", id))
      .then(document => {
        const result = document.data();
        result.id = id;
        setPatient(result);
      });
  }, []);

  let messageComponents;
  if (patient === null) {
    messageComponents = <PatientSkeleton />;
  } else {
    const messagesEntries = Object.entries(patient.messages);
    messageComponents = messagesEntries.map(([index, message]) =>
      (<Pressable key={index} onPress={() => navigation.navigate('Report', {name, index, id})}>
        <ReportRow {...{message}} />
      </Pressable>)
    );

    setPatientRead(patient);
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
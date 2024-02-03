import { useEffect, useState } from 'react';
import { Text, View, Pressable, ScrollView } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import {
  getDoc, getDocs,
  doc, collection, query,
  where, and, or,
} from 'firebase/firestore';

import globalStyles from '../globalStyles';
import state from '../state';

import ReportRow from '../components/ReportRow';
import { setPatientRead } from '../state.mjs';

function PatientSkeleton() {
    return (<Text>Loading...</Text>);
}

const ClinicianPatientScreen = ({navigation, route}) => {
  useIsFocused();

  const { id, name } = route.params;

  const [ patient, setPatient ] = useState(null);
  const [ messages, setMessages ] = useState(undefined);
  console.log("messages is", messages);
  
  useEffect(() => {
    getDoc(doc(state.db, 'users', id))
    .then(document => {
      const result = document.data();
      result.id = id;
      setPatient(result);
    });
    
    getDocs(query(
      collection(state.db, 'messages'),
      or(
        and(where('from', '==', name), where('to', '==', state.username),),
        and(where('from', '==', state.username), where('to', '==', name),),
      )
    )).then(
      querySnapshot => {setMessages(
        querySnapshot.docs.map(document => {
          const result = document.data();
          result.id = document.id;
          return result;
        })
      )}
    )
  }, []);

  let messageComponents;
  if (patient === null || messages === undefined) {
    messageComponents = <PatientSkeleton />;
  } else {
    messageComponents = messages.map((message, index) =>
      (<Pressable key={message.id} onPress={() => navigation.navigate('Report', {name, id: message.id})}>
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

export default ClinicianPatientScreen;
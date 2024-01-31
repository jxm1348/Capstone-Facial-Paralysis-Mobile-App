import React from 'react';
import { Text, View, Pressable, ScrollView } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { getDoc, doc, updateDoc } from 'firebase/firestore';

import globalStyles from '../globalStyles';
import state from '../state';

import ReportRow from '../components/ReportRow';

function PatientSkeleton() {
    return (<Text>Loading...</Text>);
}

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

    patient.messages.forEach(message => message.read = true);

    updateDoc(
      doc(state.db, 'users', id),
      {messages:patient.messages}
    );
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
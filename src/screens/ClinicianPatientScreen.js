import { useEffect, useState } from 'react';
import { Text, View, Pressable, ScrollView } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import {
  doc, collection, query,
  where, and, or, onSnapshot
} from 'firebase/firestore';

import globalStyles from '../globalStyles';
import { db, auth, setPatientRead } from '../state.js';

import NewMessageBar from '../components/NewMessageBar';
import ReportRow from '../components/ReportRow';

function PatientSkeleton() {
  return (<Text>Loading...</Text>);
}

function compareDateDescending(m1, m2) {
  return m2.date - m1.date;
}


const ClinicianPatientScreen = ({navigation, route}) => {
  const { id, name } = route.params;
  const patientUid = id;

  const [ patientSnapshot, setPatientSnapshot ] = useState(undefined);
  const [ messages, setMessages ] = useState(undefined);
  
  // The purpose of newMessages is to highlight recent messages.
  // We cannot use messages[n].read going forward, since that is changed
  //  as soon as this screen is displayed, and when I implement live data
  //  the badge would disappear immediately.
  // Therefore, newMessages has a manually-enforced lifetime
  //  that ends when the screen "loses focus" (someone navigates away).
  const [ newMessages, setNewMessages ] = useState({});
  
  useEffect(() => onSnapshot(doc(db, 'users', patientUid), setPatientSnapshot), []);
  
  const isFocused = useIsFocused();
  useEffect(() => { if (!isFocused) {
    // console.log("IsFocused event");
    messages.forEach(message => message.new = false);
    setNewMessages({});
  }}, [isFocused]);

  useEffect(() => onSnapshot(
    query(
      collection(db, 'messages'),
      or(
        and(where('from', '==', patientUid), where('to', '==', auth.currentUser.uid),),
        and(where('from', '==', auth.currentUser.uid), where('to', '==', patientUid),),
      )
    ),
    messagesSnapshot => {
      // console.log("Snapshot event");
      setMessages(
        messagesSnapshot.docs.map(document => {
          const result = document.data();
          result.id = document.id;
          
          if (!result.read) {newMessages[document.id] = true;}
          result.new = newMessages[document.id];
          
          return result;
        })
      );
    }
  ), []);
  
  let messageComponents;
  if (messages === undefined) {
    messageComponents = <PatientSkeleton />;
  } else {
    messageComponents = messages
      .sort(compareDateDescending)
      .map((message, index) =>
        (<Pressable key={message.id} onPress={() => navigation.navigate('Report', {name, id: message.id})} nativeID={`pressable-message-${message.id}`}>
          <ReportRow {...{message}} />
        </Pressable>)
      );

    setPatientRead(patientUid);
  }
  
  return (
    <View style={{flexGrow: 1}}>
      <Text style={globalStyles.h1}>{patientSnapshot?.data().name ?? name}</Text>
      <ScrollView style={{flexGrow: 1}}>
        <NewMessageBar toUid={patientUid} />
        <ScrollView style={{flexGrow: 1, marginBottom: 100}} vertical={true} horizontal={true}>
          <View style={{gap: 6, paddingHorizontal: 40, paddingVertical: 10}} nativeID="view-messages">
            {messageComponents}
          </View>
        </ScrollView>
      </ScrollView>
    </View>
  );
};

export default ClinicianPatientScreen;
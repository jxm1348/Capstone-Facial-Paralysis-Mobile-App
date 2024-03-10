import { useState, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import { getDocs, collection, query, where, or, and } from 'firebase/firestore';

import { FlexNavigationBar } from '../components/NavigationBar';
import NewMessageBar from '../components/NewMessageBar';
import ReportRow from '../components/ReportRow';
import state, { db, auth } from '../state';

function PatientMessagesSkeleton() {
  return <View style={{flexGrow: 1}}><Text>Loading...</Text></View>;
}

function compareDateDescending(m1, m2) {
  return m2.date - m1.date;
}

function PatientMessages({messages}) {
  if (!messages) return <PatientMessagesSkeleton />;
  
  return (<FlatList
      data={messages}
      keyExtractor={(item) => item.id}
      renderItem={({item}) => <ReportRow message={item} />}
      style={{flexGrow: 1, flexBasis: 0}}
    />);
}

function curryFetchMessages({withUid, setMessages}) {
  return () => {
    getDocs(query(
      collection(db, 'messages'),
      or(
        and(where('from', '==', auth.currentUser.uid), where('to', '==', withUid)),
        and(where('from', '==', withUid), where('to', '==', auth.currentUser.uid)),
      )
    )).then(querySnapshot => {
      setMessages(querySnapshot.docs.map(document => {
        const result = document.data();
        result.id = document.id;
        return result;
      }).sort(compareDateDescending))
    })
  };
}

const PatientMessagesScreen = ({ navigation, route }) => {
  const { withUid } = route.params;
  const buttons = [
    { title: 'Home', onPress: () => navigation.navigate('PatientHome') },
  ];

  const [ messages, setMessages ] = useState(null);
  useEffect(curryFetchMessages({withUid, setMessages}), []);

  return (
    <View style={{flexGrow: 1}}>
      <NewMessageBar toUid={state.clinicianUid} />
      <PatientMessages {...{navigation, messages}} />
      <FlexNavigationBar buttons={buttons} />
    </View>
  );
};

export default PatientMessagesScreen;
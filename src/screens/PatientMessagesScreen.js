import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { getDocs, collection, query, where, or, and } from 'firebase/firestore';

import ReportRow from '../components/ReportRow';
import NavigationBar from '../components/NavigationBar';
import state, { db } from '../state';

function PatientMessagesSkeleton() {
  return <View style={{flexGrow: 1}}><Text>Loading...</Text></View>;
}

function compareDateDescending(m1, m2) {
  return m2.date - m1.date;
}

function PatientMessages({navigation, messages}) {
  if (!messages) return <PatientMessagesSkeleton />;

  const navigateToMessage = (message) => {
    navigation.navigate('PatientMessage', { id: message.id });
  };
  
  return (<View style={{flexGrow: 1, flexBasis: 0}}>
  <FlatList
    data={messages}
    keyExtractor={(item) => item.id.toString()}
    renderItem={({item}) => <ReportRow message={item} />}
  />
  </View>);
}

function curryFetchMessages({withName, setMessages}) {
  return () => {
    getDocs(query(
      collection(db, 'messages'),
      or(
        and(where('from', '==', state.username), where('to', '==', withName)),
        and(where('from', '==', withName), where('to', '==', state.username)),
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
  const { withName } = route.params;
  const buttons = [
    { title: 'Home', onPress: () => navigation.navigate('PatientHome') },
  ];

  const [ messages, setMessages ] = useState(null);
  useEffect(curryFetchMessages({withName, setMessages}), []);

  return (
    <View style={{flexGrow: 1}}>
      <PatientMessages {...{navigation, messages}}/>
      <NavigationBar style={{backgroundColor: 'magenta'}} buttons={buttons} />
    </View>
  );
};

const styles = StyleSheet.create({
});

export default PatientMessagesScreen;
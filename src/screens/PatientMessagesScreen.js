import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { getDocs, collection, query, where, or, and } from 'firebase/firestore';

import ReportRow from '../components/ReportRow';
import NavigationBar from '../components/NavigationBar';
import state, { db } from '../state';

function PatientMessagesSkeleton() {
  return <Text>Loading...</Text>;
}

function PatientMessages({navigation, messages}) {
  if (!messages) return <PatientMessagesSkeleton />;

  const navigateToMessage = (message) => {
    navigation.navigate('PatientMessage', { id: message.id });
  };
  
  return (<View style={styles.listView}>
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
      }))
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
    <View style={styles.container}>
      <PatientMessages {...{navigation, messages}}/>
      <View style={styles.navigationBar}>
        <NavigationBar buttons={buttons} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listView: {
    flex: 3,
  },
  touchableItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  itemText: {
    fontSize: 18,
  },
  navigationBar: {
    flex: 1,
  },
});

export default PatientMessagesScreen;
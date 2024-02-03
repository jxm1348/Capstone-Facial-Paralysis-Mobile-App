import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { getDocs, collection, query, where, or } from 'firebase/firestore';

import NavigationBar from '../components/NavigationBar';
import state, { db } from '../state';

const PatientMessagesScreen = ({ navigation }) => {
  const buttons = [
    { title: 'Home', onPress: () => navigation.navigate('PatientHome') },
  ];

  // Sample array of messages
  const oldMessages = [
    { id: 1, sender: 'Sender 1', message: 'Message 1 content.' },
    { id: 2, sender: 'Sender 2', message: 'Message 2 content.' },
  ];

  const [ messages, setMessages ] = useState(null);
  useEffect(() => {
    getDocs(query(
      collection(db, 'messages'),
      or(where('from', '==', state.username), where('to', '==', state.username))
    )).then(querySnapshot => {
      setMessages(querySnapshot.docs.map(document => {
        const result = document.data();
        result.id = document.id;
        return result;
      }))
    })
  }, []);

  console.log("Messages are", messages);

  const navigateToMessage = (message) => {
    navigation.navigate('PatientMessage', { message });
  };

  return (
    <View style={styles.container}>
      <View style={styles.listView}>
        <FlatList
          data={oldMessages}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.touchableItem}
              onPress={() => navigateToMessage(item)}
            >
              <Text style={styles.itemText}>{item.sender}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
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
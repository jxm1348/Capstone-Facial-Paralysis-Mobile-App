import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { getDocs, collection, query, where, or } from 'firebase/firestore';

import NavigationBar from '../components/NavigationBar';
import { db, auth } from '../state';

function ConversationsSkeleton() {
  return <Text>Loading...</Text>;
}

// As of 2024-02-12, this Component is not used anywhere or tested or anything.
// You may be able to delete it for the sake of cleanliness,
//  or just ignore it. --Mark
function Conversations({navigation, contacts}) {
  if (!contacts) return <ConversationsSkeleton />;
  
  const navigateToConversation = (contact) => {
    navigation.navigate('PatientMessage', { name: contact });
  };

  return (
  <View style={styles.listView}>
    <FlatList
      data={contacts}
      keyExtractor={contact => contact}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.touchableItem}
          onPress={() => navigateToConversation(item)}
        >
          <Text style={styles.itemText}>{item}</Text>
        </TouchableOpacity>
      )}
    />
  </View>
  );
}

const PatientConversationsScreen = ({ navigation }) => {
  const buttons = [
    { title: 'Home', onPress: () => navigation.navigate('PatientHome') },
  ];

  const [ contacts, setContacts ] = useState(null);
  useEffect(() => {
    getDocs(query(
      collection(db, 'messages'),
      or(where('from', '==', auth.currentUser.uid), where('to', '==', auth.currentUser.uid))
    )).then(querySnapshot => {
      setContacts(Array.from(new Set(
        querySnapshot.docs.map(document => {
          const message = document.data();
          return message.from !== auth.currentUser.uid ? message.from : message.to;
        }
      ))))
    })
  }, []);

  return (
    <View style={styles.container}>
      <Conversations {...{contacts, navigation}}/>      
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

export default PatientConversationsScreen;
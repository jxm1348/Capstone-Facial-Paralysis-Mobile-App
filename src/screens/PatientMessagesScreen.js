import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import NavigationBar from '../components/NavigationBar';

const PatientMessagesScreen = ({ navigation }) => {
  const buttons = [
    { title: 'Home', onPress: () => navigation.navigate('PatientHome') },
  ];

  // Sample array of messages
  const messages = [
    { id: 1, sender: 'Sender 1', message: 'Message 1 content.' },
    { id: 2, sender: 'Sender 2', message: 'Message 2 content.' },
  ];

  const navigateToMessage = (message) => {
    navigation.navigate('PatientMessage', { message });
  };

  return (
    <View style={styles.container}>
      <View style={styles.listView}>
        <FlatList
          data={messages}
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
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const NotificationTable = ({ notifications }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Notification</Text>
        <Text style={styles.headerText}>Date</Text>
      </View>
      {notifications.map((notification, index) => (
        <View key={index} style={styles.row}>
          <Text style={styles.notificationText}>{notification.message}</Text>
          <Text style={styles.dateText}>{notification.date}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    margin: 10,
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  headerText: {
    fontWeight: 'bold',
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  notificationText: {
    flex: 1,
  },
  dateText: {
    color: '#888',
  },
});

export default NotificationTable;
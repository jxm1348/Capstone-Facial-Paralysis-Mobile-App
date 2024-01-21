import React from 'react';
import { View, Button, Text, StyleSheet, Image, Pressable, ScrollView } from 'react-native';
import ReportRow from '../components/ReportRow';

import state from '../state';
import globalStyles from '../globalStyles';

const PatientHomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <Text>Welcome, John Doe</Text>
        <Image style={{width: 30, height:30}} source={{uri: "https://mpeschel10.github.io/fa/test/hamburger-icon.png"}}></Image>
      </View>
      <Pressable style={globalStyles.button} onPress={() => navigation.navigate("Create Report")}>
        <Text style={{color: 'white'}}>Create new report</Text>
      </Pressable>
      <View>
        <Text>Your history</Text>
        <ScrollView horizontal={true}><View style={styles.messagesContainer}>
          <ReportRow message={state.demoPatients[3].messages[0]} showBadge={false}></ReportRow>
          <ReportRow message={state.demoPatients[3].messages[1]} showBadge={false}></ReportRow>
        </View></ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 40,
    marginVertical: 10,
  }, headerBar: {
    flexDirection: "row",
    justifyContent: "space-between",
  }, messagesContainer: {
    marginVertical: 20,
    gap: 10,
  },
})

export default PatientHomeScreen;
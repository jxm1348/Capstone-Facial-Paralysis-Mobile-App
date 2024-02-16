import { useState, useEffect, } from 'react';
import {
  View, ScrollView,
  Text, Image, Pressable, TextInput,
  StyleSheet,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker';
import { useIsFocused, useNavigation } from '@react-navigation/native';

import { getDocs, query, collection, where } from 'firebase/firestore';

import UnreadBadge from '../components/UnreadBadge';
import globalStyles from '../globalStyles';
import { auth, db } from '../state.js';

function PatientsSkeleton() {
  return (<Text>Loading...</Text>);
}

function PatientMessagesPressable({patient}) {
  const navigation = useNavigation();
  const { name } = patient;
  return (
    <Pressable
      style={styles.patientContainer}
      onPress={() => navigation.navigate('ClinicianPatient', {id: patient.id, name})}
      nativeID={`pressable-patient-${patient.id}`}
    >
    <View style={{flexGrow: 1, marginHorizontal: 25, flexShrink: 1}}>
      <Text style={{fontSize: 35}}>{name}</Text>
      { patient.latestMessage !== null ?
        <Text style={{}}>Last message {patient.latestMessage}</Text> :
        undefined
      }
    </View>
    <View>
      <Image
        style={styles.patientThumbnail}
        source={{ uri: patient.thumbnail }}
      />
      <UnreadBadge value={patient.unread} />
    </View>
    </Pressable>
  );
}

function compareDateAscending(p1, p2) {
  if (p1.latestMessage === null) return 1;
  if (p2.latestMessage === null) return -1;
  return -p1.latestMessage.localeCompare(p2.latestMessage);
}
function compareDateDescending(p1, p2) { return -compareDateAscending(p1, p2); }

function compareNameAscending(p1, p2) { return p1.name.localeCompare(p2.name); }
function compareNameDescending(p1, p2) { return -compareNameAscending(p1, p2); }
function getSort(sortBy, sortAscending) {
  if (sortBy === 'date') {
    return sortAscending ? compareDateAscending : compareDateDescending;
  } else if (sortBy === 'name') {
    return sortAscending ? compareNameAscending : compareNameDescending;
  } else {
    throw new Error("getSort: Unknown sortBy " + sortBy);
  }
}

function SearchSortBar({onChangeText, searchAscending, setSearchAscending, sortBy, setSortBy}) {
  return (<View style={{flexDirection: 'row'}}>
    <TextInput
      style={styles.inputSearch}
      placeholder="Search"
      onChangeText={(text) => onChangeText(text.toLowerCase())}
    />
    <View style={{height: 40, justifyContent: 'center'}}><Text>Sort by </Text></View>
    <Picker
      style={{height: 40}}
      selectedValue={sortBy}
      onValueChange={(itemValue, itemIndex) =>
        setSortBy(itemValue)
      }
    >
      <Picker.Item label="Last Message" value="date" />
      <Picker.Item label="Name" value="name" />
    </Picker>
    <Pressable style={{justifyContent: 'center', marginLeft: 20, height: 40}} onPress={() => {setSearchAscending(!searchAscending)}}>
      <Ionicons
        name={searchAscending ? 'arrow-up-outline' : 'arrow-down-outline'}
        size={32}
        color="green"
      />
    </Pressable>
  </View>)
}

function PatientsView({patients, search, searchAscending, sortBy}) {
  if (patients === null) return <PatientsSkeleton />;
  const patientItems = patients
    .slice()
    .filter(patient => patient.name.toLowerCase().indexOf(search) >= 0)
    .sort(getSort(sortBy, searchAscending))
    .map(patient =>
      <PatientMessagesPressable key={patient.name} patient={patient} />
    );
  return <View id="view-patients">{patientItems}</View>;
}

// This function returns a list of patients for the current user as well as the counts of their unread messages.
const getPatientsIdsUnread = async () => {
  const usersSnapshot = await getDocs(query(
    collection(db, 'users'),
    where('clinicianUid', '==', auth.currentUser.uid)
  ));
  
  const q = query(collection(db, 'messages'), where('to', '==', auth.currentUser.uid));
  const messagesSnapshot = await getDocs(q);
  const userCounts = {};
  for (const message of messagesSnapshot.docs.map(d => d.data())) {
      if (message.read) continue;
      if (userCounts[message.from] === undefined)
          userCounts[message.from] = 0;
      userCounts[message.from]++;
  }
  

  return usersSnapshot.docs.map(userDocument => {
      const user = userDocument.data();
      user.id = userDocument.id;
      user.unread = userCounts[userDocument.id] ?? 0;
      return user;
  });
};

const ClinicianPatientsScreen = () => {
  // useIsFocused(); // Force refresh no longer works for some reason.

  const [ patients, setPatients ] = useState(null);
  const [ search, setSearch ] = useState("");

  const [ searchAscending, setSearchAscending ] = useState(true);
  const [ sortBy, setSortBy ] = useState("date");
  const patientsViewProps = { patients, search, searchAscending, sortBy };


  useEffect(() => {
    getPatientsIdsUnread().then(setPatients);
  }, [])

  return (
    <ScrollView style={{flexGrow: 1, }}>
      <View style={{marginHorizontal: 40, }}>
        
      <Text style={globalStyles.h1} nativeID='text-patients-header'>Patients</Text>
      <SearchSortBar onChangeText={setSearch} {...{searchAscending, setSearchAscending, sortBy, setSortBy}} />
      <PatientsView {...patientsViewProps} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  patientContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 10,
      padding: 5,
      borderColor: '#2060dd',
      borderWidth: 2,
      borderRadius: 5,
  }, patientThumbnail: {
    width: 90,
    height: 90,
  }, inputSearch: {
    flexGrow: 1,
    minWidth: 0,

    borderColor: 'gray',
    borderWidth: 1,
    
    height: 40,
    padding: 10,
    marginBottom: 20,
    marginRight: 20,
  },
});

export default ClinicianPatientsScreen;

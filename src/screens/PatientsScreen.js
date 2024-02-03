import { useState, useEffect, } from 'react';
import {
  View, ScrollView,
  Text, Image, Pressable, TextInput,
  StyleSheet,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import {Picker} from '@react-native-picker/picker';
import { useIsFocused } from '@react-navigation/native';

import { getPatientsIdsUnread } from '../state';
import UnreadBadge from '../components/UnreadBadge';
import globalStyles from '../globalStyles';
import PatientsSkeleton from '../skeletons/PatientsSkeleton';

function PatientMessagesPressable({patient, navigation}) {
  const { name } = patient;
  return (
    <Pressable
      style={styles.patientContainer}
      onPress={() => navigation.navigate('Patient', {id: patient.id, name})}
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

const PatientsScreen = ({ navigation }) => {
  // useIsFocused(); // Force refresh no longer works for some reason.

  const [ patients, setPatients ] = useState(null);
  const [ search, setSearch ] = useState("");

  const [ searchAscending, setSearchAscending ] = useState(true);
  const [ sortBy, setSortBy ] = useState("date");

  let patientItems;
  if (patients === null) {
    patientItems = (<PatientsSkeleton />);
  } else {
    patientItems = patients
    .slice()
    .filter(patient => patient.name.toLowerCase().indexOf(search) >= 0)
    .sort(getSort(sortBy, searchAscending))
    .map(patient =>
      <PatientMessagesPressable key={patient.name} patient={patient} navigation={navigation}/>
    );
  }

  useEffect(() => {
    getPatientsIdsUnread().then(setPatients);
  }, [])

  return (
    <ScrollView style={{flexGrow: 1, }}>
      <View style={{marginHorizontal: 40, }}>
        
      <Text style={globalStyles.h1}>Patients</Text>
      <SearchSortBar onChangeText={setSearch} {...{searchAscending, setSearchAscending, sortBy, setSortBy}} />
      <View>{patientItems}</View>
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

export default PatientsScreen;

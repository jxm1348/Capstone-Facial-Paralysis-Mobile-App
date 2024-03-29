import { useState, useEffect, } from 'react';
import {
  View, ScrollView,
  Text, Image, Pressable, TextInput,
  StyleSheet,
  Platform,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { CircleSnail as ProgressCircleSnail } from 'react-native-progress';

import { query, collection, where, deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore';

import ClinicianNavBar from '../components/ClinicianNavBar';
import UnreadBadge from '../components/UnreadBadge';
import globalStyles from '../globalStyles';
import { auth, db, profilesStorage, saveProfilePicture } from '../state.js';
import { getDownloadURL, ref } from 'firebase/storage';
import PreviewImagePicker from '../components/PreviewImagePicker.js';

function PatientsSkeleton() {
  return (<Text>Loading...</Text>);
}

function PatientMessagesEdit({patient, handleCancelEdit}) {
  const [ profileSource, setProfileSource ] = useState(undefined);
  useEffect(() => {
    if (patient.thumbnail === undefined || patient.thumbnail === null) {
      return;
    } else if (typeof patient.thumbnail === 'string') {
      setProfileSource({uri: patient.thumbnail});
    } else if (patient.thumbnail.thumbnailVersion === 1) {
      const thumbnailRef = ref(profilesStorage, `profiles/${patient.id}/${patient.thumbnail.name}`);
      getDownloadURL(thumbnailRef).then(uri => {
        if (profileSource === undefined) setProfileSource({uri})
      }).catch(error => {});
    }
  }, []);

  const [ shouldUpdateProfile, setShouldUpdateProfile ] = useState(false);

  const [ displayName, setDisplayName ] = useState(patient.name);
  const [ email, setEmail ] = useState(patient.email);
  const [ password, setPassword ] = useState(undefined);
  
  const [ clinicianEmail, setClinicianEmail ] = useState(undefined);
  const [ shouldUpdateClinician, setShouldUpdateClinician ] = useState(false);

  useEffect(() => onSnapshot(
    doc(db, 'users', patient.clinicianUid),
    snapshot => setClinicianEmail(snapshot.data().email)
  ), []);

  const [ isDeleting, setIsDeleting ] = useState(false);
  const [ isSaving, setIsSaving ] = useState(false);

  const handleSaveEdits = async () => {
    setIsSaving(true);
    try {
      console.log('Begin save');
      
      // await new Promise(resolve => setTimeout(resolve, 3000));
      const serverParameters = {
          token: await auth.currentUser.getIdToken(),
          uid: patient.id,
      };
      
      const serverUpdate = {displayName, email};
      if (password !== undefined) serverUpdate.password = password;
      const serverBody = JSON.stringify(serverUpdate);
      // console.log('Server body is ', serverBody);
      
      const docUpdate = {name: displayName, email};
      if (shouldUpdateProfile) {
        docUpdate.thumbnail = {thumbnailVersion: 1, name: await saveProfilePicture(patient.id, profileSource.uri)}
      }
      
      if (shouldUpdateClinician) {
        const clinicianParameters = new URLSearchParams({
          token: await auth.currentUser.getIdToken(),
          email: clinicianEmail,
        });
        
        const clinicianResponse = await fetch('https://fa.mpeschel10.com/users.json?' + clinicianParameters);
        if (clinicianResponse.status !== 200) {
          console.log("Update failed due to can't find clinician uid");
          return;
        }
        docUpdate.clinicianUid = (await clinicianResponse.json()).uid;
      }

      const result = await fetch(
          'https://fa.mpeschel10.com/users.json?' + new URLSearchParams(serverParameters), {
          method: 'PUT',
          body: serverBody
      });
      // console.log('Got result', result.status, result.statusText);
      // console.log(await result.text());
      await updateDoc(doc(db, 'users', patient.id), docUpdate);

      console.log('End save');
      handleCancelEdit();
    } finally {
      setIsSaving(false);
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true);
    console.log("Deleting patient", patient);

    // await new Promise(resolve => setTimeout(resolve, 3000));
    const token = await auth.currentUser.getIdToken();
    const body = JSON.stringify({
      token,
      "user": {uid: patient.id}
    });

    const userResult = await fetch('https://fa.mpeschel10.com/users.json', {
      method: 'DELETE',
      body,
    });
    // const bodyText = await userResult.text();
    // console.log(userResult.status, userResult.statusText);
    // console.log(Object.fromEntries(userResult.headers));
    // console.log('Body: ', bodyText);
    
    await deleteDoc(doc(db, 'users', patient.id));
    setIsDeleting(false);
  };

  const onImagePickerResult = imagePickerResult => {
    setProfileSource(imagePickerResult.assets[0]);
    setShouldUpdateProfile(true);
  };

  return (<View
    style={[
      styles.patientContainer,
      { backgroundColor: '#ddd', flexDirection: 'column'}
    ]}
    id={`view-edit-${patient.id}`}
  >
    <View style={{flexDirection: 'row', alignItems: 'center',}}>
      <View style={{flexGrow: 1, flexShrink: 1}}>
        <TextInput style={styles.textInput} defaultValue={displayName} onChangeText={text => setDisplayName(text)} placeholder='Username'></TextInput>
        <TextInput style={styles.textInput} defaultValue={email} onChangeText={text => setEmail(text)} placeholder='Email'></TextInput>
      </View>
      <PreviewImagePicker onImagePickerResult={onImagePickerResult} image={profileSource} />
    </View>
    <TextInput  style={styles.textInput}
        placeholder="New Password"
        secureTextEntry
        defaultValue={password}
        onChangeText={setPassword}
    />
    <View style={{flexDirection: 'row', alignItems: 'center',}}>
      <Text>Clinician: </Text>
      <TextInput style={styles.textInput}
          placeholder="Clinician Email"
          value={clinicianEmail ?? ''}
          onChangeText={text => {setShouldUpdateClinician(true); setClinicianEmail(text);}}
      />
    </View>
    <View style={{flexDirection: 'row'}}>
      <Pressable style={globalStyles.button} onPress={handleSaveEdits}>
        {isSaving
            ? <ProgressCircleSnail color={'#fff'} size={20} indeterminate={true} />
            : <Text style={globalStyles.buttonText}>Save</Text>
        }
      </Pressable>
      <Pressable style={globalStyles.button} onPress={handleCancelEdit}>
        <Text style={globalStyles.buttonText}>Cancel</Text>
      </Pressable>
      <Pressable style={[globalStyles.button, {backgroundColor: '#f00'}]} onPress={handleDelete}>
        <View>
          {isDeleting
            ? <ProgressCircleSnail color={'#fff'} size={20} indeterminate={true} />
            : <Ionicons name="trash" size={20} color="#fff" />
          }
        </View>
      </Pressable>
    </View>
  </View>);
}

function PatientMessagesPressable({patient, handleLongPress}) {
  const navigation = useNavigation();
  const [ profileSource, setProfileSource ] = useState(undefined);
  useEffect(() => {
    if (patient.thumbnail === undefined || patient.thumbnail === null) {
      return;
    } else if (typeof patient.thumbnail === 'string') {
      setProfileSource({uri: patient.thumbnail});
    } else if (patient.thumbnail?.thumbnailVersion === 1) {
      const thumbnailRef = ref(profilesStorage, `profiles/${patient.id}/${patient.thumbnail.name}`);
      getDownloadURL(thumbnailRef).then(uri => setProfileSource({uri})).catch(error => {});
    }
  }, []);

  return (<Pressable
    style={styles.patientContainer}
    onPress={() => navigation.navigate('ClinicianPatient', {id: patient.id, name: patient.name})}
    onLongPress={handleLongPress}
    id={`pressable-patient-${patient.id}`}
  >
    <View style={{flexGrow: 1, marginHorizontal: 25, flexShrink: 1}}>
      <Text style={{fontSize: 35}}>{patient.name}</Text>
      { patient.latestMessage !== null ?
        <Text style={{}}>Last message {patient.latestMessage}</Text> :
        undefined
      }
    </View>
    <View>
      {
        profileSource
        ? <Image
          style={styles.patientThumbnail}
          source={profileSource}
        />
        : <View style={styles.patientThumbnail} />
      }
      <UnreadBadge value={patient.unread} />
    </View>
  </Pressable>);
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

function SearchSortBar({scrollViewLayout, onChangeText, searchAscending, setSearchAscending, sortBy, setSortBy}) {
  if (scrollViewLayout === undefined) return <></>;

  return (<View style={{
    flexDirection: scrollViewLayout.width > 500 ? 'row' : 'column',
    gap: 20,
    alignItems:  scrollViewLayout.width > 500 ? 'center' : 'start'
  }}>

    <TextInput
      style={{
        flexGrow: 1,
        minWidth: 0,
    
        borderColor: 'gray',
        borderWidth: 1,
        
        height: 40,
        width: '100%',
        padding: 10,
        zIndex: 1,
      }}
      placeholder="Search"
      onChangeText={(text) => onChangeText(text.toLowerCase())}
    />

    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      height: 80,
    }}>
      <Text style={{flexShrink: 0,}}>Sort by </Text>
      <Picker
        style={{
          flexShrink: 0,
          flexGrow: 1,
          flexBasis: 158,
          backgroundColor: Platform.OS === 'android' ? '#dddddd' : undefined,
          zIndex: -1,
        }}
        selectedValue={sortBy}
        onValueChange={(itemValue, itemIndex) =>
          setSortBy(itemValue)
        }
      >
        <Picker.Item label="Last Message" value="date" />
        <Picker.Item label="Name" value="name" />
      </Picker>
      <Pressable style={{justifyContent: 'center', paddingLeft: 20, paddingRight: 20, height: 40}} onPress={() => {setSearchAscending(!searchAscending)}}>
        <Ionicons
          name={searchAscending ? 'arrow-up-outline' : 'arrow-down-outline'}
          size={32}
          color="#2288f0"
        />
      </Pressable>
    </View>
  </View>)
}

function PatientsView({patients, search, searchAscending, sortBy}) {
  if (!patients) return <PatientsSkeleton />;

  const [ editingPatientId, setEditingPatient ] = useState(undefined);

  const patientItems = patients
    .slice()
    .filter(patient => patient.name.toLowerCase().indexOf(search) >= 0)
    .sort(getSort(sortBy, searchAscending))
    .map(patient => {
      if (patient.id === editingPatientId)
        return (<PatientMessagesEdit
          key={patient.id}
          patient={patient}
          handleCancelEdit={() => setEditingPatient(undefined)}
        />);
      else
        return (<PatientMessagesPressable
          key={patient.id}
          patient={patient}
          handleLongPress={() => setEditingPatient(patient.id)}
        />);
    });
  return <View id="view-patients">{patientItems}</View>;
}

function ClinicianPatientsScreen() {
  const [ patients, setPatients ] = useState(undefined);
  const [ usersSnapshot, setUsersSnapshot ] = useState(undefined);
  const [ messagesSnapshot, setMessagesSnapshot ] = useState(undefined);

  const [ search, setSearch ] = useState("");
  const [ showAllAccounts, setShowAllAccounts ] = useState(false);

  const [ scrollViewLayout, setScrollViewLayout ] = useState(undefined);
  const [ searchAscending, setSearchAscending ] = useState(true);
  const [ sortBy, setSortBy ] = useState("date");

  useEffect(() => onSnapshot(
    showAllAccounts
    ? collection(db, 'users')
    : query(
      collection(db, 'users'),
      where('clinicianUid', '==', auth.currentUser.uid)
    ), setUsersSnapshot)
  , [showAllAccounts]);
  
  useEffect(() => onSnapshot(
    query(
      collection(db, 'messages'),
      where('to', '==', auth.currentUser.uid)
    ), setMessagesSnapshot
  ), []);

  useEffect(() => {
    if (usersSnapshot && messagesSnapshot) {
      const userCounts = {};
      for (const message of messagesSnapshot.docs.map(d => d.data())) {
        if (message.read) continue;
        if (userCounts[message.from] === undefined)
            userCounts[message.from] = 0;
        userCounts[message.from]++;
      }
    
      const result = usersSnapshot.docs.map(userDocument => {
        const user = userDocument.data();
        user.id = userDocument.id;
        user.unread = userCounts[userDocument.id] ?? 0;
        return user;
      });
      setPatients(result);
    }
  }, [usersSnapshot, messagesSnapshot]);
  
  return (<View style={{flexGrow: 1, }}>
    <ScrollView style={{flexGrow: 1, flexBasis: 0, }} onLayout={event => setScrollViewLayout(event.nativeEvent.layout)}>
      <View style={{marginHorizontal: 40, }}>
        <Text style={globalStyles.h1} id='text-patients-header'>Patients</Text>
        <SearchSortBar onChangeText={setSearch} {...{scrollViewLayout, searchAscending, setSearchAscending, sortBy, setSortBy}} />
        <Pressable style={[globalStyles.button, {justifyContent: 'space-between'}]} onPress={() => setShowAllAccounts(!showAllAccounts)}>
          <Text style={globalStyles.buttonText}>{showAllAccounts ? 'Show Only My Patients' : 'Show All Accounts'}</Text>
          <Ionicons name={showAllAccounts ? "eye-off-outline" : "eye-outline"} size={32} color="#fff" />
        </Pressable>
        <PatientsView {...{patients, search, searchAscending, sortBy}} />
      </View>
    </ScrollView>
    <ClinicianNavBar />
  </View>);
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
  }, textInput: {
    flexGrow: 1,
    minWidth: 0,
    flexBasis: 0,

    borderColor: 'gray',
    borderWidth: 1,
    
    height: 40,
    width: '100%',
    padding: 10,
    zIndex: 1,
  }
});

export default ClinicianPatientsScreen;

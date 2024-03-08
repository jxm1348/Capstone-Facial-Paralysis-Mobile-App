import { useEffect, useState } from 'react';
import { Pressable, View, Text, Image, StyleSheet } from 'react-native';
import { collection, onSnapshot, } from 'firebase/firestore';
import { db } from '../state';
import Ionicons from '@expo/vector-icons/Ionicons';

function PatientEditPressable({patient, handleEdit}) {
  return (<Pressable
    style={styles.patientContainer}
    onPress={() => handleEdit(patient.uid)}
    nativeID={`pressable-patient-${patient.uid}`}
  >
  <View
    key={patient.uid}
    style={{
      flexDirection: 'row',
      gap: 6,
      margin: 6,
    }}
  >
    <Image
      style={styles.patientThumbnail}
      source={{ uri: patient.thumbnail }}
    />
    <View style={{flexGrow: 1, marginHorizontal: 25, flexShrink: 1}}>
      <View style={{
        justifyContent: 'center',
      }}>
        <Text style={{fontSize: 24}}>{patient.name}</Text>
        <Text style={{fontSize: 18}}>{patient.email}</Text>
      </View>
    </View>
    <View style={{flexGrow: 1}} />
  </View>
  </Pressable>);
}

const AccountListScreen = ({ navigation }) => {
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
      const unsubscribe = onSnapshot(collection(db, 'users'), querySnapshot => {
        const users = querySnapshot
          .docs
          .map(document => {
            const d = document.data()
            d.uid = document.id;
            return d;
          });
        setAccounts(users);
      });
      return () => unsubscribe();
  }, []);


  const handleEdit = (uid) => {
    navigation.navigate('AccountEdit', { uid });
  };

  return (<View style={{marginHorizontal: 40}}>
    <Pressable style={{
      justifyContent: 'center',
      alignSelf: 'flex-end',
    }} onPress={() => {navigation.navigate('PatientCreation')}}>
      <Ionicons
        name={"add-circle-outline"}
        size={128}
        color="#2060dd"
      />
    </Pressable>
    {accounts.map(patient => (
      <PatientEditPressable patient={patient} handleEdit={handleEdit} key={patient.uid} />
    ))}
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
  },
});


export default AccountListScreen;
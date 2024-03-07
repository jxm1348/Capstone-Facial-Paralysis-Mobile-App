import { useEffect, useState } from 'react';
import { Pressable, View, Text, Image, StyleSheet } from 'react-native';
import { collection, getDocs, } from 'firebase/firestore';
import { db } from '../state';

function PatientEditPressable({patient, handleEdit}) {
  return (<Pressable
    style={styles.patientContainer}
    onPress={() => handleEdit(patient.uid)}
    nativeID={`pressable-patient-${patient.uid}`}
    key={patient.uid}
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
      async function f() {
        const userDocuments = await getDocs(collection(db, 'users'));
        const users = userDocuments
          .docs
          .map(document => {
            const d = document.data()
            d.uid = document.id;
            return d;
          });
        setAccounts(users);
      }
      f();
  }, []);

    // const unsubscribe = firestore().collection('users').onSnapshot(querySnapshot => {
    //   const data = querySnapshot.docs.map(doc => doc.data());
    //   setAccounts(data);
    // });

    // return () => unsubscribe();
  // }, []);

  const handleEdit = (uid) => {
    navigation.navigate('AccountEdit', { uid });
  };

  return (<View style={{marginHorizontal: 40}}>
    {accounts.map(patient => (
      <PatientEditPressable patient={patient} handleEdit={handleEdit} />
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
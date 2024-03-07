import React, { useState, useEffect } from 'react';
import { View, TextInput, Button } from 'react-native';
// import firestore from '@react-native-firebase/firestore';
import { doc, } from 'firebase/firestore';
import { db, } from '../state';

const EditAccountScreen = ({ route }) => {
  const { userId } = route.params;
  const [name, setName] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const userDoc = await getDoc(doc(db, 'users', userId));
      const userData = userDoc.data();
      setName(userData.name);
    };

    fetchUserData();
  }, [userId]);

  const handleSave = async () => {
    await firestore().collection('users').doc(userId).update({ name });
    console.log('Account updated successfully!');
  };

  return (
    <View>
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <Button
        title="Save"
        onPress={handleSave}
      />
    </View>
  );
};

export default EditAccountScreen;
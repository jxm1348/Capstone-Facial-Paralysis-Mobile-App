import React, { useState, useEffect } from 'react';
import { View, TextInput, Button } from 'react-native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, } from '../state';

const EditAccountScreen = ({ route }) => {
  const { uid } = route.params;
  const [name, setName] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const userDoc = await getDoc(doc(db, 'users', uid));
      const userData = userDoc.data();
      setName(userData.name);
    };

    fetchUserData();
  }, [uid]);

  const handleSave = async () => {
    await updateDoc(doc(db, 'users', uid), { name });
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
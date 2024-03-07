import { doc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { View, TextInput, Button, Picker } from 'react-native';
// import firestore from '@react-native-firebase/firestore';
// import auth from '@react-native-firebase/auth';
import { Picker as ImagePicker } from '@react-native-picker/picker';

import { auth, db } from '../state';

const PatientCreationScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('Patient');
  const [profilePicture, setProfilePicture] = useState(null);

  const handleCreation = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      const userData = {
        userId: userCredential.user.uid,
        email,
        name: null,
        latestMessage: null,
        thumbnail: null,
        profilePicture: profilePicture ? profilePicture.uri : null, // Pass profile picture URI if available
      };

      
      await setDoc(doc(db, 'users', userCredential.user.uid), userData);

      console.log('Account created successfully!');
    } catch (error) {
      console.error('Error creating account: ', error);
    }
  };

  const handleChooseImage = () => {
    ImagePicker.showImagePicker({ title: 'Select Profile Picture' }, response => {
      if (response.uri) {
        setProfilePicture(response);
      }
    });
  };

  return (
    <View>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Picker
        selectedValue={userType}
        onValueChange={(itemValue) => setUserType(itemValue)}>
        <Picker.Item label="Patient" value="Patient" />
        <Picker.Item label="Clinician" value="Clinician" />
      </Picker>
      <Button
        title="Choose Profile Picture"
        onPress={handleChooseImage}
      />
      <Button
        title="Create Account"
        onPress={handleCreation}
      />
    </View>
  );
};

export default PatientCreationScreen;
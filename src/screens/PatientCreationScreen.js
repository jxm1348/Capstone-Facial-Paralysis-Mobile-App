import { doc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { useState } from 'react';
import { Image, View, TextInput, Pressable, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';

import { auth, db, accountCreationHackAuth } from '../state';
import globalStyles from '../globalStyles';

const PatientCreationScreen = ({navigation}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('Patient');
  const [profilePicture, setProfilePicture] = useState(null);

  const handleCreation = async () => {
    const userCredential = await createUserWithEmailAndPassword(accountCreationHackAuth, email, password);
    signOut(accountCreationHackAuth);

    const userData = {
      email,
      name,
      clinicianUid: userType === 'Patient' ? auth.currentUser.uid : null,
      latestMessage: null,
      thumbnail: profilePicture ? profilePicture.uri : null, // Pass profile picture URI if available
    };

    await setDoc(doc(db, 'users', userCredential.user.uid), userData);
    navigation.navigate('ClinicianEdit');
  };

  const handleChooseImage = async () => {
    const response = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })
    console.log(response);
    if (!response.canceled) {
      setProfilePicture(response.assets[0]);
    }
  };

  return (
    <View
      style={{
        gap: 6,
        margin: 6,
      }}
    >
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        autoFocus={true}
      />
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
      <Pressable style={globalStyles.button} onPress={handleChooseImage}>
        <Text style={globalStyles.buttonText}>Choose Profile Picture</Text>
      </Pressable>
      {profilePicture && <Image 
          source={{uri: profilePicture.uri}}
          style={{width:90, height:90, alignSelf: 'center'}}
      />}
      <Pressable style={globalStyles.button} onPress={handleCreation}>
        <Text style={globalStyles.buttonText}>Create Account</Text>
      </Pressable>
    </View>
  );
};

export default PatientCreationScreen;
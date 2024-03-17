import { doc, setDoc } from 'firebase/firestore';
import { useState } from 'react';
import { Image, View, TextInput, Pressable, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';

import { auth, db } from '../state';
import globalStyles from '../globalStyles';
import ClinicianNavBar from '../components/ClinicianNavBar';

const PatientCreationScreen = ({navigation}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('Patient');
  const [profilePicture, setProfilePicture] = useState(null);

  const [ warning, setWarning ] = useState(undefined);

  const handleCreation = async () => {
    const token = await auth.currentUser.getIdToken();
    // console.log("My token is ", token);
    const body = JSON.stringify({
      token,
      "user": {
          email,
          password,
          displayName: name,
          "roles": [userType === 'Clinician' ? 'c' : 'p'],
      }
    });
    // console.log("My body is ", body);

    const userResult = await fetch('https://fa.mpeschel10.com/users.json', {
      method: 'POST',
      body,
    });

    const bodyText = await userResult.text();
    if (userResult.status !== 200) {
      console.log(userResult.status, userResult.statusText);
      console.log(Object.fromEntries(userResult.headers));
      console.log('Body: ', bodyText);
      setWarning(bodyText);
      return;
    }
    
    const userData = {
      email,
      name,
      clinicianUid: userType === 'Patient' ? auth.currentUser.uid : null,
      latestMessage: null,
      thumbnail: profilePicture ? profilePicture.uri : null, // Pass profile picture URI if available
    };

    await setDoc(doc(db, 'users', JSON.parse(bodyText)), userData);
    navigation.navigate('ClinicianPatients');
  };

  const handleChooseImage = async () => {
    const response = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })
    // console.log(response);
    if (!response.canceled) {
      setProfilePicture(response.assets[0]);
    }
  };

  return (<View style={{flexGrow: 1, gap: 6, margin: 6,}}>
    <View style={{flexGrow: 1}}>
      {warning && <Text style={{backgroundColor: '#d00', color: '#fff'}}>{warning}</Text>}
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={text => {setWarning(undefined); setName(text);}}
        autoFocus={true}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={text => {setWarning(undefined); setEmail(text);}}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={text => {setWarning(undefined); setPassword(text);}}
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
    <ClinicianNavBar />
  </View>);
};

export default PatientCreationScreen;
import { doc, setDoc } from 'firebase/firestore';
import { useState } from 'react';
import { View, TextInput, Pressable, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';

import { auth, db, saveProfilePicture } from '../state';
import globalStyles from '../globalStyles';
import ClinicianNavBar from '../components/ClinicianNavBar';
import PreviewImagePicker from '../components/PreviewImagePicker';

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
    const newUid = JSON.parse(bodyText);

    let thumbnail = null;
    if (profilePicture) {
      thumbnail = {thumbnailVersion: 1, name: await saveProfilePicture(newUid, profilePicture.uri)}
    }
    
    const userData = {
      email,
      name,
      clinicianUid: userType === 'Patient' ? auth.currentUser.uid : null,
      latestMessage: null,
      thumbnail,
    };

    await setDoc(doc(db, 'users', newUid), userData);
    navigation.navigate('ClinicianPatients');
  };

  // response is of type https://docs.expo.dev/versions/latest/sdk/imagepicker/#imagepickerresult
  //  which has member assets : ImagePickerAsset[] https://docs.expo.dev/versions/latest/sdk/imagepicker/#imagepickerasset
  const onImagePickerResult = imagePickerResult => {
    setProfilePicture(imagePickerResult.assets[0]);
  };

  return (<View style={{flexGrow: 1, gap: 6, margin: 6,}}>
    <View style={{flexGrow: 1}}>
      {warning && <Text style={{backgroundColor: '#d00', color: '#fff', padding: 12, borderRadius: 3, marginBottom: 6}}>{warning}</Text>}  
      <View style={{flexDirection: 'row'}}>
        <View style={{flexGrow: 1}}>
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
        </View>
        <PreviewImagePicker image={profilePicture} onImagePickerResult={onImagePickerResult} />
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Text>User Type: </Text>
        <Picker
          style={{flexGrow: 1}}
          selectedValue={userType}
          onValueChange={(itemValue) => setUserType(itemValue)}>
          <Picker.Item label="Patient" value="Patient" />
          <Picker.Item label="Clinician" value="Clinician" />
        </Picker>
      </View>
      <Pressable style={globalStyles.button} onPress={handleCreation}>
        <Text style={globalStyles.buttonText}>Create Account</Text>
      </Pressable>
    </View>
    <ClinicianNavBar />
  </View>);
};

export default PatientCreationScreen;
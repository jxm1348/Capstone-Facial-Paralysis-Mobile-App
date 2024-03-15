import { useState, useRef } from 'react';
import {
  StyleSheet, 
  TextInput, 
  View, 
  Alert,
  Pressable,
  Text 
} from 'react-native';

import globalStyles from '../globalStyles';
import state, { login, auth } from '../state.js';
import { sendPasswordResetEmail } from 'firebase/auth';

function getEmailErrorText(email) {
  try {
    if (!email.includes('@')) return 'Email must have an @ sign.';
    const atParts = email.split('@');
    if (atParts.length > 2) return 'Email must have exactly one @ sign.';
    if (atParts.length < 2) return '@ sign must be in middle of email.';
    const [ prefix, suffix ] = atParts;
    if (!suffix.includes('.')) return 'Email must have a period.';
    if (suffix.startsWith('.')) return 'Email domain can\'t start with a period.';
    if (suffix.endsWith('.')) return 'Email can\'t end with a period.';
  } catch(error) {

  }
  return 'Invalid email';
}

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const emailInput = useRef();
  const passwordInput = useRef();

  const [emailErrorText, setEmailErrorText] = useState(undefined);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  const handleLogin = async () => {
    if (password !== 'password') {
      console.log('Refusing to navigate to clinician or patient home since password wrong.');
      Alert.alert('Invalid credentials');
      return;
    }
    
    await login(email, password);
    const role = state.idTokenResult.claims.roles.includes('c') ? 'clinician' : 'patient';
    navigation.navigate(role === 'clinician' ? 'ClinicianHome' : 'PatientHome');
  };

  const handleResetPassword = () => sendPasswordResetEmail(auth, email?.trim())
    .then(() => {
      console.log('success');
      setResetEmailSent(true);
    })
    .catch((error) => {
      console.log('Password reset error code:', error.code);
      if (error.code === 'auth/missing-email') {
        setEmailErrorText('Please type your email here first.');
      } else if (error.code === 'auth/invalid-email') {
        setEmailErrorText(getEmailErrorText(email));
      } else {
        setEmailErrorText(error.message);
      }
      emailInput.current?.focus()
    });

  const debugClinicianLogin = async (email) => {
    await login(email, 'password');
    navigation.navigate('ClinicianHome');
  };

  const debugPatientLogin = async (email) => {
    await login(email, 'password');
    navigation.navigate('PatientHome');
  }

  const debugButtons = [];
  if (state.demoIsDebug) {
    debugButtons.push(<Pressable key={0} style={[globalStyles.button, styles.button]} onPress={async () => {
      await login('mpeschel10@gmail.com', 'password');
      navigation.navigate('PatientCamera', {imageKey: 'eyebrows-up'});
    }}>
      <Text style={globalStyles.buttonText}>Debug Camera</Text>
    </Pressable>);
    debugButtons.push(<Pressable key={1} style={[globalStyles.button, styles.button]} onPress={() => debugClinicianLogin('mgrey@gmail.com')} id="pressable-debug-clinician">
      <Text style={globalStyles.buttonText}>Debug log in as Meredith Grey</Text>
    </Pressable>);
    debugButtons.push(<Pressable key={2} style={[globalStyles.button, styles.button]} onPress={() => debugClinicianLogin('taltman@gmail.com')} id="pressable-debug-taltman">
      <Text style={globalStyles.buttonText}>Debug log in as Teddy Altman</Text>
    </Pressable>);
    debugButtons.push(<Pressable key={3} style={[globalStyles.button, styles.button]} onPress={() => debugClinicianLogin('cyang@gmail.com')} id="pressable-debug-cyang">
      <Text style={globalStyles.buttonText}>Debug log in as Cristina Yang</Text>
    </Pressable>);
    debugButtons.push(<Pressable key={4} style={[globalStyles.button, styles.button]} onPress={() => debugPatientLogin('mpeschel10@gmail.com')}>
      <Text style={globalStyles.buttonText}>Debug log in as Mark Peschel</Text>
    </Pressable>);
    debugButtons.push(<Pressable key={5} style={[globalStyles.button, styles.button]} onPress={() => debugPatientLogin('jcarson@gmail.com')}>
      <Text style={globalStyles.buttonText}>Debug log in as Josh Carson</Text>
    </Pressable>);
    debugButtons.push(<Pressable key={6} style={[globalStyles.button, styles.button]} onPress={() => debugPatientLogin('jxm@gmail.com')}>
      <Text style={globalStyles.buttonText}>Debug log in as jxm</Text>
    </Pressable>);
  }

  return (
    <View style={styles.container}>
      <View style={{alignItems: 'center', borderRadius: 5, backgroundColor: emailErrorText && '#d00', padding: 5}}>
        <View style={{height: 19, justifyContent: 'center'}}>
          {emailErrorText && <Text style={{fontSize: 12, color: '#fff'}}>{emailErrorText}</Text>}
        </View>
        <TextInput
          id="text-input-email"
          ref={emailInput}
          autoComplete="email"
          autoFocus={true}
          returnKeyType="next"
          style={styles.input}
          placeholder="Email"
          onSubmitEditing={() => passwordInput.current?.focus()}
          onChangeText={(text) => {setEmail(text); setEmailErrorText(undefined)}}
        />
      </View>
      
      <TextInput
        id="text-input-password"
        ref={passwordInput}
        autoComplete="current-password"
        returnKeyType="go"
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
        onSubmitEditing={handleLogin}
        onChangeText={(text) => setPassword(text)}
      />
      <Pressable onPress={handleLogin} id="pressable-login" style={[globalStyles.button, styles.button]}>
        <Text style={globalStyles.buttonText}>Login</Text>
      </Pressable>
      <View style={{gap:12}}>
        {debugButtons}
      </View>
      <View style={{height: 17}}>
        {resetEmailSent && <Text>Success: If the account {email} exists, a password reset email was sent to it.</Text>}
      </View>
      <Pressable onPress={handleResetPassword} id="pressable-reset-password" style={{
        textDecoration: 'underline',
        color: '#00f',
      }}>
        <Text style={{color: '#00f'}}>Send password reset email</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'safe center',
    alignItems: 'center',
    gap: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    backgroundColor: '#f2f2f2',
    borderWidth: 1,
    width: 200,
    padding: 10,
    margin: 2,
  },
  button: {
    margin: 0,
  }
});

export default LoginScreen;
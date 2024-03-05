import { View, Text, StyleSheet } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import ClinicianNavBar from '../components/ClinicianNavBar';
import { Button1 } from '../components/buttons';

import globalStyles from '../globalStyles';
import { auth } from '../state.js';

const ClinicianHomeScreen = ({ navigation, colors }) => {
  const isFocused = useIsFocused() // Force refresh
  
  return (
    <View style={styles.container}>
        <View style={{
          flexGrow: 1,
        }}>
          <Text style={globalStyles.h2} id="text-header-welcome">Welcome, {auth.currentUser.displayName}!</Text>
          <View style={styles.spacerFull}></View>
          <View style={{alignItems: 'center',}}>
            <Button1 title="Sign Out" onPress={() => navigation.navigate('Login')}></Button1>
          </View>
        </View>
        <ClinicianNavBar {...{navigation, colors}}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#ffffff",
  }, btnSignout: {
    margin: 10,
    padding: 10,
    backgroundColor: 'magenta',
    color: 'magenta',
  }, spacerFull: {
    flexGrow: 1,
  }
});

export default ClinicianHomeScreen;
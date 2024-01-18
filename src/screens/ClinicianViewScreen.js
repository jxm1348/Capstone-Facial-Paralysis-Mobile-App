import React from 'react';
import { View, Button } from 'react-native';

const ClinicianViewScreen = ({ navigation }) => {
  return (
    <View>
      <Button title="Back" onPress={() => navigation.navigate('ClinicianHome')} />
    </View>
  );
};

export default ClinicianViewScreen;

import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import ClinicianView from './ClinicianViewScreen';

const ClinicianViewInfo = ({navigation}) => {
  return (
    <View>
      <Button
        title="Back"
        onPress={() => navigation.navigate('ClinicianView')}
      />
    </View>
  );
};

export default ClinicianViewInfo;
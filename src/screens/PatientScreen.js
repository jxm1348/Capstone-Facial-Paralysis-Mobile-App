import React from 'react';
import { Text, View, Button } from 'react-native';

import globalStyles from '../globalStyles';

const PatientScreen = ({navigation, route}) => {
  const { name } = route.params;
  
  return (
    <View>
      <Text style={globalStyles.h1}>{name}</Text>
      <Button
        title="Back"
        onPress={() => navigation.navigate('Patients')}
      />
    </View>
  );
};

export default PatientScreen;
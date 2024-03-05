import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const AccountListScreen = ({ navigation }) => {
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    const unsubscribe = firestore().collection('users').onSnapshot(querySnapshot => {
      const data = querySnapshot.docs.map(doc => doc.data());
      setAccounts(data);
    });

    return () => unsubscribe();
  }, []);

  const handleEdit = (userId) => {
    navigation.navigate('EditAccount', { userId });
  };

  return (
    <View>
      {accounts.map(account => (
        <View key={account.userId}>
          <Text>{account.email}</Text>
          <Button
            title="Edit"
            onPress={() => handleEdit(account.userId)}
          />
        </View>
      ))}
    </View>
  );
};

export default AccountListScreen;
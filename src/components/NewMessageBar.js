import { useRef } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { View, Text, Pressable, TextInput } from 'react-native';

import state, { db } from '../state.mjs';
import globalStyles from '../globalStyles';

export default function NewMessagebar({toName}) {
    const newMessageRef = useRef();
  
    const sendMessage = () => {
      const newMessage = {
        message: newMessageRef.current.value,
        images: [],
        read: false,
        deepRead: false,
        from: state.username,
        to: toName,
        date: Date.now(),
      };
  
      addDoc(collection(db, 'messages'), newMessage);
    };
  
    return (<View style={{flexDirection: 'row', marginHorizontal: 40, alignItems: 'center' }}>
    <TextInput 
      style={{
        flexGrow: 1,
        minWidth: 0,
    
        borderColor: 'gray',
        borderWidth: 1,
        
        height: 40,
        padding: 10,
      }}
      ref={newMessageRef}
      placeholder="New message..."
    />
    <Pressable style={globalStyles.button} onPress={sendMessage}><Text>Send message</Text></Pressable>
    </View>);
  }
  
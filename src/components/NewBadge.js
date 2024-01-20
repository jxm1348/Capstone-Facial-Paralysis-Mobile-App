import { Text, View } from 'react-native';

function NewBadge({value}) {
    return (<Text style={{
        position: 'absolute',
        left: 20,
        top: -10,
        paddingHorizontal: 5,
        borderRadius: 10,
        backgroundColor: '#ff0000',
        color: '#ffffff',
        display: value ? 'flex' : 'none'
    }}>Unread</Text>);
}

export default NewBadge;
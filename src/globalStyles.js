import { StyleSheet } from 'react-native';

const globalStyles = StyleSheet.create({
    h1: {
        fontSize: 40,
        textAlign: 'center',
        margin: 10,
    }, h2: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    }, button: {
        minHeight: 30,
        minWidth: 80,
        backgroundColor: '#2288f0',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 12,
        borderRadius: 4,
        margin: 8,
        flexDirection: 'row',
    }, buttonText: {
        color: '#ffffff',
        fontSize: 20,
    }
});

export default globalStyles;
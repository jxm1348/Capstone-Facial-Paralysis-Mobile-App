import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";

function FetchUnreadBadge({fetchValue}) {
    const [value, setValue] = useState(null);
    
    fetchValue().then(value => setValue(value));
    
    return ((value && value > 0) ?
        <View style={styles.badge}><Text style={styles.badgeText}>{value}</Text></View> :
        undefined
    );
}

const styles = StyleSheet.create({
    badge: {
        backgroundColor: '#ff0000',
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: -10,
        right: -10,
    }, badgeText: {
        color: '#ffffff',
    },
});

export default FetchUnreadBadge;
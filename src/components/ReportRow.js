import { StyleSheet, Text, View } from 'react-native';

function ReportRow({message}) {
    return (<View style={styles.container}>
        <View style={{flexDirection: 'row', gap: 20}}>
            <View style={styles.tile} /><View style={styles.tile} /><View style={styles.tile} /><View style={styles.tile} /><View style={styles.tile} /><View style={styles.tile} /><View style={styles.tile} />
        </View>
        <Text style={{}}>
            {message.message}, read: {message.deepRead.toString()}
        </Text>
    </View>);
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        gap: 10,
        borderColor: '#2060dd',
        borderWidth: 2,
        borderRadius: 5,
        width: 100 * 7 + 20 * 6 + 25, // Hardcoded badness.
      }, tile: {
        width: 100,
        height: 100,
        backgroundColor: 'magenta',
    }
});

export default ReportRow;
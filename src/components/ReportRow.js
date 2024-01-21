import { StyleSheet, Text, View, Image } from 'react-native';

import NewBadge from '../components/NewBadge';

function ReportTile({source}) {
    return <Image style={styles.tile} source={{uri: source}}/>;
}

function ReportRow({message, showBadge}) {
    return (<View style={styles.container}>
        { showBadge ? <NewBadge value={!message.deepRead} /> : undefined }
        <View style={{flexDirection: 'row', gap: 20}}>
            {message.images.map(source =>
                <ReportTile key={source} source={source} />
            )}
        </View>
        <Text>{message.date}</Text>
        <Text style={{display: message.message === null ? 'none' : 'flex'}}>
            {message.message}
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
    }
});

export default ReportRow;
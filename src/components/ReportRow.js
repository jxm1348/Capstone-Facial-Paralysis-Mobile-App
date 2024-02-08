import { StyleSheet, Text, View, Image } from 'react-native';

import NewBadge from '../components/NewBadge';
import { imageKeyOrder } from '../constants';

function ReportTile({source}) {
    return <Image style={styles.tile} source={{uri: source}}/>;
}

function ReportRow({message}) {
    const urlIterator = message.images.map ? message.images :
        imageKeyOrder.map(key => message.images[key]).filter(result => result);

    const imageTiles = urlIterator.map(source =>
        <ReportTile key={source} source={source} />
    );

    return (<View style={styles.container}>
        <NewBadge value={message.new} />
        <View style={{flexDirection: 'row', gap: 20}}>
            {imageTiles}
        </View>
        <Text>{new Date(message.date).toString()}</Text>
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
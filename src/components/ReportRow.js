import { StyleSheet, Text, View, Image } from 'react-native';

import NewBadge from '../components/NewBadge';
import { imageKeyOrder } from '../constants';

function ReportTile({source}) {
    return <Image style={styles.tile} source={{uri: source}}/>;
}

function getReportTiles(message) {
    if (message.messageVersion === undefined) {
        const urlIterator = message.images.map ? message.images :
        imageKeyOrder.map(key => message.images[key]).filter(result => result);

        return urlIterator.map(source =>
            <ReportTile key={source} source={source} />
        );
    } else {
        return <Text>New style message tiles</Text>;
    }
}

function ReportRow({message}) {
    const reportTiles = getReportTiles(message);

    return (<View style={styles.container}>
        <NewBadge value={message.new} />
        <View style={{flexDirection: 'row', gap: 20}}>
            {reportTiles}
        </View>
        <Text>{new Date(message.date).toString()}</Text>
        {message.message !== null &&
            <Text dataSet={{'class-text-report-message': '1'}}>
                {message.message}
            </Text>
        }
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
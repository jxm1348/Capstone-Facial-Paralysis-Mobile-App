import { StyleSheet, Text, View, Image } from 'react-native';

import NewBadge from '../components/NewBadge';
import { imageKeyOrder } from '../constants';
import { useEffect, useState } from 'react';

import { getDoc, doc } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../state';

function ReportTile({source}) {
    return <Image style={styles.tile} source={{uri: source}}/>;
}

function ReportTile3({uid, imageName}) {
    const [ uri, setUri ] = useState(undefined);

    useEffect(() => {(async () => {
        const imageExtension = imageName.split('.').pop();
        const imagePrefix = imageName.slice(0, imageName.length - imageExtension.length - 1);
        const thumbnailRef = ref(storage, `images/${uid}/thumbnails/${imagePrefix}_90x120.${imageExtension}`);
        setUri(await getDownloadURL(thumbnailRef));
    })();}, []);
    
    if (uri === undefined) {
        return <Text>Loading image...</Text>;
    } else {
        return <Image style={styles.tile} source={{uri}}/>;
    }
}

function getReportTiles(message) {
    if (message.messageVersion === undefined) {
        const urlIterator = message.images.map ? message.images :
        imageKeyOrder.map(key => message.images[key]).filter(result => result);

        return urlIterator.map(source =>
            <ReportTile key={source} source={source} />
        );
    } else {
        return imageKeyOrder
            .map(key => message.images[key])
            .filter(result => result)
            .map(imageName => <ReportTile3 uid={message.from} imageName={imageName}/>);
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
        width: 90 * 7 + 20 * 6 + 25, // Hardcoded badness.
      }, tile: {
        width: 90,
        height: 120,
    }
});

export default ReportRow;
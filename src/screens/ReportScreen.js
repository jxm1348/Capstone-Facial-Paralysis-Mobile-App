import { useState, useEffect } from 'react';
import { Text, View, Image, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';

import globalStyles from '../globalStyles';
import { storage, db } from '../state.js';
import { imageKeyOrder } from '../constants';

function ReportSkeleton() {
    return <Text>Loading...</Text>;
}

function Tile3({style, uid, imageName}) {
    const [ uri, setUri ] = useState(undefined);
    useEffect(() => {(async () => {
        const imageRef = ref(storage, `images/${uid}/${imageName}`);
        setUri(await getDownloadURL(imageRef));
    })();}, []);
    
    if (uri === undefined) {
        return <Text>Loading image...</Text>;
    } else {
        return <Image style={style} source={{uri}} key={imageName} />;
    }
}

function getImageComponents(message) {
    const {width, height} = Dimensions.get('window');
    if (message.messageVersion === undefined) {
        const sourceIterator = message.images.map ? message.images :
            imageKeyOrder.map(key => message.images[key]).filter(value => value);
        
        return sourceIterator.map(source => 
            <Image style={{width, height: width}} source={{uri: source}} key={source}/>
        );
    } else if (message.messageVersion === 3) {
        return imageKeyOrder
            .map(key => message.images[key])
            .filter(value => value)
            .map(imageName => {
                return <Tile3 style={{width: width, height: width / 3 * 4}} uid={message.from} imageName={imageName} key={imageName}/>;
            });
    } else {
        return [ <Text key={1}>Unknown message version</Text> ];
    }
}

function Report(message) {
    if (!message) return <ReportSkeleton />;

    if (!message.read) {
        updateDoc(doc(db, 'messages', message.id), {read:true}).then(result => {
            console.log("Set read on message", message.id);
        });
    }
    
    return (<>
        <Text style={{textAlign: 'center'}}>{message.date}</Text>
        <View style={styles.images}>
            {getImageComponents(message)}
        </View>
        {message.message !== null && 
            <Text style={globalStyles.h2}>{message.message}</Text>
        }
    </>);
}

export default function ReportScreen({navigation, route}) {
    const { params } = route;
    const { name, id } = params;

    const [ message, setMessage ] = useState(undefined);
    
    useEffect(() => {
        getDoc(doc(db, 'messages', id))
            .then(snapshot => {
                const result = snapshot.data();
                result.id = snapshot.id;
                setMessage(result);
            })
    }, []);

    const report = Report(message);
    
    return (<ScrollView style={{flexGrow: 1}}>
        <Text style={globalStyles.h2}>Report from {name}</Text>
        {report}
    </ScrollView>);
}

const styles = StyleSheet.create({
    images: {
        gap: 6,
    }, message: {

    }
})

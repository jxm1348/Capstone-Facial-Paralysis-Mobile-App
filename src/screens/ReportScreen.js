import { useState, useEffect } from 'react';
import { Text, View, Image, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { getDoc, doc, updateDoc } from 'firebase/firestore';

import globalStyles from '../globalStyles';
import state from '../state';

function ReportSkeleton() {
    return <Text>Loading...</Text>;
}

function Report(message) {
    if (!message) return <ReportSkeleton />;

    if (!message.deepRead) {
        updateDoc(doc(state.db, 'messages', message.id), {deepRead:true}).then(result => {
            console.log("Set deepRead on message", message.id);
        });
    }
    
    const {width, height} = Dimensions.get('window');
    
    const imageComponents = message.images.map(source => 
        <Image style={{width, height: width}} source={{uri: source}} key={source}/>
    );

    return (<>
        <Text style={{textAlign: 'center'}}>{message.date}</Text>
        <View style={styles.images}>
            {imageComponents}
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
        getDoc(doc(state.db, 'messages', id))
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

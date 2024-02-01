import { useState, useEffect } from 'react';
import { Text, View, Image, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { getDoc, doc, updateDoc } from 'firebase/firestore';

import globalStyles from '../globalStyles';
import state from '../state';

function ReportSkeleton() {
    return <Text>Loading...</Text>;
}

function Report(patient, index) {
    if (!patient) return <ReportSkeleton />;
    const message = patient.messages[index];

    if (!message.deepRead) {
        const key = `messages.${index}.deepRead`;
        const query = {};
        query[key] = true;
        
        updateDoc(doc(state.db, 'users', patient.id), query).then(result => {
            console.log("Performed updateDoc with messages", patient.messages);
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
        <View style={{display: message.message !== null ? 'flex' : 'none'}}>
            <Text style={globalStyles.h2}>{message.message}</Text>
        </View>
    </>);
}

export default function ReportScreen({navigation, route}) {
    const { params } = route;
    const { name, id, index } = params;

    const [ patient, setPatient ] = useState(undefined);
    useEffect(() => {
        getDoc(doc(state.db, 'users', id))
            .then(snapshot => {
                const result = snapshot.data();
                result.id = snapshot.id;
                setPatient(result);
            });
    }, []);

    const report = Report(patient, index);
    
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

import { Text, View, Image, StyleSheet, Dimensions } from 'react-native';

import globalStyles from '../globalStyles';
import state from '../state';

export default function ReportScreen({navigation, route}) {
    const { params } = route;
    const { name, index } = params;
    const patient = state.demoGetPatientByName(name);
    const message = patient.messages[index];
    message.deepRead = true;

    const {width, height} = Dimensions.get('window');
    
    const imageComponents = message.images.map(source => 
        <Image style={{width, height: width}} source={{uri: source}} key={source}/>
    );
    
    return (<>
        <Text style={globalStyles.h2}>Report from {name}</Text>
        <Text style={{textAlign: 'center'}}>{message.date}</Text>
        <View style={styles.images}>
            {imageComponents}
        </View>
        <View style={{display: message.message !== null ? 'flex' : 'none'}}>
            <Text style={globalStyles.h2}>{message.message}</Text>
        </View>
    </>);
}

const styles = StyleSheet.create({
    images: {
        gap: 6,
    }, message: {

    }
})

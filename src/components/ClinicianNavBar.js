import { View, StyleSheet, Pressable, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { fetchUnreadCount } from "../state";
import FetchUnreadBadge from "./FetchUnreadBadge";
import Ionicons from '@expo/vector-icons/Ionicons';
import globalStyles from '../globalStyles';

function ClinicianNavBar({navigation}) {
    if (!navigation) navigation = useNavigation();
    return (
        <View style={styles.container}>
            <Pressable style={globalStyles.button} onPress={() => navigation.navigate("ClinicianHome")}>
                <Ionicons 
                    name={'home-outline'}
                    size={32}
                    color="#fff"
                />
            </Pressable>
            <Pressable style={globalStyles.button} onPress={() => navigation.navigate("ClinicianPatients")} id="pressable-navbar-patients">
                <Ionicons 
                    name={'person-outline'}
                    size={32}
                    color="#fff"
                />
                <FetchUnreadBadge fetchValue={fetchUnreadCount} />
            </Pressable>
            <Pressable style={globalStyles.button} onPress={() => navigation.navigate("PatientCreation")} id="pressable-navbar-add-patient">
                <Ionicons 
                    name={'person-add-outline'}
                    size={32}
                    color="#fff"
                />
            </Pressable>
            <Pressable style={globalStyles.button} onPress={() => navigation.navigate("ClinicianEdit")}>
                <Ionicons 
                    name={'pencil-outline'}
                    size={32}
                    color="#fff"
                />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        justifyContent: "space-evenly",
        flexDirection: "row",
        padding: 12,
        backgroundColor: "#efefee",
        borderTopColor: '#dddddd',
        borderTopWidth: 2,
    },
});

export default ClinicianNavBar;
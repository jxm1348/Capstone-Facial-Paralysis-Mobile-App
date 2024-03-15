import { View, StyleSheet, Pressable, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { fetchUnreadCount } from "../state";
import FetchUnreadBadge from "./FetchUnreadBadge";

import globalStyles from '../globalStyles';

function ClinicianNavBar({navigation}) {
    if (!navigation) navigation = useNavigation();
    return (
        <View style={styles.container}>
            <Pressable style={globalStyles.button} onPress={() => navigation.navigate("ClinicianHome")}>
                <Text style={globalStyles.buttonText}>Home</Text>
            </Pressable>
            <Pressable style={globalStyles.button} onPress={() => navigation.navigate("ClinicianPatients")} id="pressable-navbar-patients">
                <Text style={globalStyles.buttonText}>Patients</Text>
                <FetchUnreadBadge fetchValue={fetchUnreadCount} />
            </Pressable>
            <Pressable style={globalStyles.button} onPress={() => navigation.navigate("ClinicianEdit")}>
                <Text style={globalStyles.buttonText}>Edit Accounts</Text>
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
import { View, Button, StyleSheet, Pressable, Text } from "react-native";

import { fetchUnreadCount } from "../state";
import FetchUnreadBadge from "./FetchUnreadBadge";

import globalStyles from '../globalStyles';

function ClinicianNavBar({navigation}) {
    return (
        <View style={styles.container}>
            <Button title="Home" onPress={() => navigation.navigate("ClinicianHome")}/>
            <Pressable style={globalStyles.button} onPress={() => navigation.navigate("ClinicianPatients")} id="pressable-navbar-patients">
                <Text style={globalStyles.buttonText}>Patients</Text>
                <FetchUnreadBadge fetchValue={fetchUnreadCount} />
            </Pressable>
            <Button title="Options" onPress={() => navigation.navigate("ClinicianHome")}/>
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
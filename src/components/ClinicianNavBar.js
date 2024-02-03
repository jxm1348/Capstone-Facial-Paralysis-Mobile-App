import { View, Button, StyleSheet } from "react-native";

import { fetchUnreadCount } from "../state";
import FetchUnreadBadge from "./FetchUnreadBadge";

function ClinicianNavBar({navigation}) {
    return (
        <View style={styles.container}>
            <Button title="Home" onPress={() => navigation.navigate("Clinician Home")}/>
            <View>
                <Button title="Patients" onPress={() => navigation.navigate("Patients")} />
                <FetchUnreadBadge fetchValue={fetchUnreadCount} />
            </View>
            <Button title="Options" onPress={() => navigation.navigate("Clinician Home")}/>
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
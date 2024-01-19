import { View, Text, Button, StyleSheet } from "react-native";

import state from "../state";
import UnreadBadge from "./UnreadBadge";

function ClinicianNavBar({navigation}) {
    return (
        <View style={styles.container}>
            <Button title="Home" onPress={() => navigation.navigate("ClinicianHome")}/>
            <View>
                <Button title="Patients" onPress={() => navigation.navigate("ClinicianView")} />
                <UnreadBadge value={state.demoGetUnread()}></UnreadBadge>
            </View>
            <Button title="Options" onPress={() => navigation.navigate("ClinicianHome")}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        justifyContent: "space-evenly",
        flexDirection: "row",
        // backgroundColor: "#dddddd",
        padding: 12,
        borderTopColor: '#dddddd',
        borderTopWidth: 2,
    },
});

export default ClinicianNavBar;
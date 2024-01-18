import { View, Text, Button } from "react-native";

export default function NavBar({navigation}) {
    return (
        <View style={{
            display: "flex",
            justifyContent: "space-evenly",
            flexDirection: "row",
            backgroundColor: "#dddddd",
            padding: 12,
        }}>
            <Button title="Home" />
            <Button title="Patients" />
            <Button title="Options" />
        </View>
    );
}
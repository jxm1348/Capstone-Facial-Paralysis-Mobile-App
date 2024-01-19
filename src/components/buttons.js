// Knockoff button class.
// According to the react native docs https://reactnative.dev/docs/button.html
//  we should create our own button using Pressable.
// That will take some time, so until we have a pressing need, I've hacked a component together that has adjustable size etc.
// In particular, Button does not respond to setting text color or size. Maybe I'm just doing something wrong.

import { Button, View } from "react-native";

export function Button1({onPress, title}) {
    return (
        <View style={{width: 100, padding: 5 }}>
             <Button {...{onPress, title}} />
         </View>
    )
}


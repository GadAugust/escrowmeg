import React from "react";
import { View, Text, StyleSheet } from "react-native";

const TextLogo = () =>{ 
    return(
        <View style={styles.main}>
            <Text style={styles.eskro}>Eskro</Text>
            <Text style={styles.bytes}>bytes</Text>
        </View>
    )
}
const styles = StyleSheet.create({
    main: {
        flexDirection: "row",
        justifyContent: "center"
    },  
    eskro: {
        color: "#FFFFFF",
        fontSize: 24,
        fontWeight: 600
    },
    bytes: {
        color: "#6280E8",
        fontSize: 24,
        fontWeight: 600
    },
})
export default TextLogo;
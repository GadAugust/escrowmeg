import React, { Component } from "react";
import { Text, View, StyleSheet, Image } from "react-native";
import TextLogo from "../components/TextLogo";
import routes from "../navigation/routes";
import { StatusBar } from "expo-status-bar";

export default class PasswordSuccessScreen extends Component {
  constructor(props) {
    super(props), (this.state = {});
  }

  nextScreen = () => {
    this.props.navigation.navigate(routes.LOGIN);
  };

  render() {
    return (
      <View style={styles.container}>
        <StatusBar style="light" animated={true} backgroundColor="#141414" />
        <TextLogo />
        <Text style={styles.mailsent}>New Password created successfully </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 20,
          }}
        >
          <Image source={require("../assets/mailicon.jpg")} />
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            paddingTop: 400,
          }}
        >
          <Text style={{ color: "#FFFFFF", fontSize: 12, fontWeight: 400 }}>
            Terms and Condition
          </Text>
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 12,
              fontWeight: 400,
              marginLeft: 25,
            }}
          >
            Privacy Policy
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#141414",
    paddingHorizontal: 10,
    paddingTop: 60,
    paddingBottom: 30,
  },
  mailsent: {
    fontSize: 16,
    fontFamily: "ClarityCity-Bold",
    color: "#F5F5F5",
    paddingTop: 150,
    textAlign: "center",
    lineHeight: 24,
  },
});

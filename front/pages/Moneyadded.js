import React, { Component } from "react";
import { View, Image, Text, StyleSheet } from "react-native";
import routes from "../navigation/routes";
import { StatusBar } from "expo-status-bar";

export default class MoneyAddedScreen extends Component {
  constructor(props) {
    super(props), (this.state = {});
  }

  dashboard = () => {
    this.props.navigation.navigate(routes.MAINPAGE);
  };

  render() {
    return (
      <View style={styles.container}>
        <StatusBar style="light" animated={true} backgroundColor="#141414" />
        <Text style={styles.text0}>Transaction complete</Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 40,
          }}
        >
          <Image source={require("../assets/cardbig.png")} />
        </View>

        <Text onPress={this.listing} style={styles.text1}>
          <Image source={require("../assets/backbutton.png")} />
          Back to wallet listing
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#141414",
    paddingHorizontal: 40,
    paddingVertical: 70,
  },
  text0: {
    fontSize: 16,
    fontWeight: 400,
    textAlign: "center",
    color: "#FFFFFF",
    marginTop: 250,
  },
  text1: {
    fontSize: 16,
    fontWeight: 400,
    color: "#FFFFFF",
    marginTop: 20,
    textAlign: "center",
  },
});

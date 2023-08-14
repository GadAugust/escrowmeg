import React, { Component } from "react";
import { Image, View, Text, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";

export default class PaymentFeedback extends Component {
  constructor(props) {
    super(props),
      (this.state = {
        success: false,
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar style="light" animated={true} backgroundColor="#141414" />
        {this.state.success ? (
          <View style={{ flexDirection: "column", alignItems: "center" }}>
            <Text style={styles.success}>Payment Successful</Text>
            <Image
              style={{ marginTop: 20 }}
              source={require("../../assets/success.png")}
            />
          </View>
        ) : (
          <View style={{ flexDirection: "column", alignItems: "center" }}>
            <Text style={styles.insufficient}>
              Insufficient Fund. Add money to your wallet to complete
              transaction.
            </Text>
            <Image
              style={{ marginTop: 20 }}
              source={require("../../assets/failed.png")}
            />
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#141414",
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  success: {
    color: "#F5F5F5",
    fontSize: 16,
    fontWeight: "400",
  },
  insufficient: {
    color: "#FD3464",
    fontSize: 16,
    fontWeight: "400",
    textAlign: "center",
  },
});

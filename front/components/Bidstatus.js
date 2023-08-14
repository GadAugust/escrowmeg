import React, { Component } from "react";
import { View, Image, Text, StyleSheet } from "react-native";
import lightTheme from "../config/lightmodecolors";
import darkTheme from "../config/darkmodecolors";
import frontStorage from "../utilities/storage";

export default class Bidstatus extends Component {
  constructor(props) {
    super(props), (this.state = { theme: "dark" });
  }
  async componentDidMount() {
    const getTheme = await frontStorage.asyncGet("mode");
    let currentTheme = getTheme ? JSON.parse(getTheme) : this.state.theme;
    this.setState({ ...this.state, theme: currentTheme });
  }

  render() {
    const { status, product, amount, firstName, lastName } = this.props;
    const { theme } = this.state;
    return (
      <View style={{ marginTop: 5 }}>
        <View style={{ paddingLeft: 5 }}>
          {status == "accepted" ? (
            <Text
              style={[
                styles.listtext1,
                {
                  color: "#141414",
                },
              ]}
            >
              {firstName} {lastName} accepted your bid ({product} for ${amount}
              ).
            </Text>
          ) : status == "pending" ? (
            <Text
              style={[
                styles.listtext1,
                {
                  color: "#141414",
                },
              ]}
            >
              Your bid ({product} for ${amount}) is still pending.
            </Text>
          ) : (
            <Text
              style={[
                styles.listtext1,
                {
                  color: "#141414",
                },
              ]}
            >
              Your bid ({product} for ${amount}) has been declined.
            </Text>
          )}
        </View>
        <Image
          style={{ marginTop: 10 }}
          source={require("../assets/line.jpg")}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  listtext1: {
    fontSize: 16,
    fontFamily: "ClarityCity-Regular",
  },
  listtext: {
    fontSize: 14,
    color: "#AFAFAF",
    fontFamily: "ClarityCity-RegularItalic",
  },
});

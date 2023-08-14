import React, { Component } from "react";
import { Text, View, StyleSheet } from "react-native";
import frontStorage from "../utilities/storage";
import lightTheme from "../config/lightmodecolors";
import darkTheme from "../config/darkmodecolors";

export default class RequestHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: "",
      theme: "dark",
    };
  }

  async componentDidMount() {
    const getTheme = await frontStorage.asyncGet("mode");
    let currentTheme = getTheme ? JSON.parse(getTheme) : this.state.theme;

    let myDate = this.props.date;
    const date = myDate.split("T");
    this.setState({ ...this.state, date: date[0], theme: currentTheme });
  }

  render() {
    const { theme } = this.state;

    const { amount, status, released } = this.props;
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginHorizontal: 20,
          marginTop: 3,
        }}
      >
        {status == "released" ? (
          <Text
            style={[
              styles.text2,
              {
                color: theme == "dark" ? darkTheme.primary : lightTheme.primary,
              },
            ]}
          >
            ${released}
          </Text>
        ) : (
          <Text
            style={[
              styles.text2,
              {
                color: theme == "dark" ? darkTheme.primary : lightTheme.primary,
              },
            ]}
          >
            ${amount}
          </Text>
        )}
        <Text
          style={[
            styles.text2,
            { color: theme == "dark" ? darkTheme.primary : lightTheme.primary },
          ]}
        >
          {this.state.date}
        </Text>
        <Text
          style={[
            styles.text2,
            transformText,
            { color: theme == "dark" ? darkTheme.primary : lightTheme.primary },
          ]}
        >
          {status}
        </Text>
      </View>
    );
  }
}

const transformText = { textTransform: "capitalize" };
const styles = StyleSheet.create({
  text2: {
    fontSize: 16,
    fontFamily: "ClarityCity-Regular",
  },
});

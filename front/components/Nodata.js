import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import lightTheme from "../config/lightmodecolors";
import darkTheme from "../config/darkmodecolors";
import frontStorage from "../utilities/storage";

export default class Nodata extends Component {
  constructor(props) {
    super(props);
    this.state = {
      theme: "dark",
    };
  }
  async componentDidMount() {
    const getTheme = await frontStorage.asyncGet("mode");
    let currentTheme = getTheme ? JSON.parse(getTheme) : this.state.theme;
    this.setState({
      ...this.state,
      theme: currentTheme,
    });
  }

  render() {
    const { theme } = this.state;
    return (
      <View style={styles.viewStyle}>
        <Text
          style={[
            styles.textStyle,
            { color: theme == "dark" ? darkTheme.primary : lightTheme.primary },
          ]}
        >
          {this.props.text}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewStyle: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  textStyle: {
    fontSize: 15,
    fontFamily: "ClarityCity-Bold",
    textAlign: "center",
  },
});

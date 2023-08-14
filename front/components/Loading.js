import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import { Circle } from "react-native-animated-spinkit";
import darkTheme from "../config/darkmodecolors";
import lightTheme from "../config/lightmodecolors";
import frontStorage from "../utilities/storage";

export default class Loading extends Component {
  constructor(props) {
    super(props),
      (this.state = {
        theme: "dark",
      });
  }

  async componentDidMount() {
    const getTheme = await frontStorage.asyncGet("mode");
    let currentTheme = getTheme ? JSON.parse(getTheme) : this.state.theme;
    console.log("theme", currentTheme);
    this.setState({ ...this.state, theme: currentTheme });
  }

  render() {
    const { theme } = this.state;
    return (
      <View
        style={[
          styles.spin,
          {
            backgroundColor: lightTheme.dark,
          },
        ]}
      >
        <Circle size={40} color="#3A4D8F" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  spin: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

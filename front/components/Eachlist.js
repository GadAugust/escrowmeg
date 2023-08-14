import React, { Component } from "react";
import { Text, StyleSheet, TouchableOpacity, View } from "react-native";
import myFonts from "../config/fontfamily";
import * as Font from "expo-font";
import frontStorage from "../utilities/storage";
import lightTheme from "../config/lightmodecolors";
import darkTheme from "../config/darkmodecolors";

export default class EachList extends Component {
  constructor(props) {
    super(props),
      (this.state = {
        date: "",
        time: "",
        fontsLoaded: false,
        theme: "dark",
      });
  }
  async componentDidMount() {
    const getTheme = await frontStorage.asyncGet("mode");
    let currentTheme = getTheme ? JSON.parse(getTheme) : this.state.theme;
    let myDate = this.props.date;
    const date = myDate.split("T");
    let splitDate = date[1].split(".");
    let newTime = splitDate[0].split(":");
    let time = "";
    parseInt(newTime[0]) > 12
      ? (time = parseInt(newTime[0]) - 12 + ":" + newTime[1] + "PM")
      : (time = newTime[0] + ":" + newTime[1] + "AM");
    await Font.loadAsync(myFonts);
    this.setState({
      ...this.state,
      date: date[0],
      time,
      fontsLoaded: true,
      theme: currentTheme,
    });
  }

  render() {
    const { theme, fontsLoaded } = this.state;
    if (!fontsLoaded) {
      return null;
    }

    return (
      <TouchableOpacity
        style={[
          styles.mainView,
          {
            backgroundColor: lightTheme.dark,
            ...this.props.style,
            paddingTop: 10,
          },
        ]}
        onPress={this.props.onPress}
      >
        <View style={styles.eachList}>
          <Text numberOfLines={1} style={styles.listtext}>
            {this.props.product}
          </Text>
          <Text style={styles.listtext}>${this.props.amount}</Text>
          <Text numberOfLines={1} style={styles.listtext}>
            {this.props.listing_id}
          </Text>
          <Text style={styles.date}>
            {this.state.date} {this.state.time}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    justifyContent: "center",
  },
  eachList: {
    backgroundColor: "#BC990A",
    borderRadius: 10,
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingVertical: 30,
    // width: "100%",
  },
  listtext: {
    fontSize: 14,
    color: "#F5F5F5",
    marginVertical: 2,
    fontFamily: "ClarityCity-Regular",
  },
  date: {
    fontSize: 10,
    color: "#f5f5f5",
    fontFamily: "ClarityCity-Light",
  },
});

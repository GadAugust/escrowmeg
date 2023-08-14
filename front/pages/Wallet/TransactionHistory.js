import React, { Component } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import frontStorage from "../../utilities/storage";
import lightTheme from "../../config/lightmodecolors";
import darkTheme from "../../config/darkmodecolors";
import { StatusBar } from "expo-status-bar";

export default class TransactionHistory extends Component {
  constructor(props) {
    super(props),
      (this.state = {
        date: "",
        time: "",
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
    this.setState({
      ...this.state,
      date: date[0],
      time,
      theme: currentTheme,
    });
  }

  render() {
    const { theme } = this.state;
    return (
      <TouchableOpacity onPress={this.props.onPress}>
        <StatusBar style="light" animated={true} backgroundColor="#141414" />
        <View style={{ marginHorizontal: 10 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 15,
            }}
          >
            <View>
              <Text
                style={[
                  styles.text2,
                  {
                    color: "#141414",
                  },
                ]}
              >
                Amount
              </Text>
              <Text
                style={[
                  styles.text3,
                  {
                    color: "#141414",
                  },
                ]}
              >
                ${this.props.amount}
              </Text>
            </View>
            <View>
              <Text
                style={[
                  styles.text2,
                  {
                    color: "#141414",
                  },
                ]}
              >
                Type
              </Text>
              <Text
                style={[
                  styles.text3,
                  {
                    color: "#141414",
                  },
                ]}
              >
                {this.props.type}
              </Text>
            </View>
            <View>
              <Text
                style={[
                  styles.text2,
                  {
                    color: "#141414",
                  },
                ]}
              >
                Date | Time
              </Text>
              <Text
                style={[
                  styles.text3,
                  {
                    color: "#141414",
                  },
                ]}
              >
                {this.state.date}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  text2: {
    fontSize: 9,
    fontFamily: "ClarityCity-Regular",
  },
  text3: {
    fontSize: 12,
    fontFamily: "ClarityCity-Regular",
  },
});

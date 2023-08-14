import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../config/colors";

export default class ChatScreen extends Component {
  constructor(props) {
    super(props),
      (this.state = {
        seen: false,
        time: "",
      });
  }

  componentDidMount() {
    let myDate = this.props.date;
    const date = myDate.split("T");
    let splitDate = date[1].split(".");
    let newTime = splitDate[0].split(":");
    let time = "";
    parseInt(newTime[0]) > 12
      ? (time = parseInt(newTime[0]) - 12 + ":" + newTime[1] + "PM")
      : (time = newTime[0] + ":" + newTime[1] + "AM");
    this.setState({ ...this.state, seen: true, time });
  }

  render() {
    const { sender, user_id } = this.props;
    return (
      <View>
        {sender == user_id ? (
          <View
            style={{ marginBottom: 10, alignItems: "flex-end", marginLeft: 30 }}
          >
            <View style={styles.user1MessageBox}>
              <Text style={styles.messageStyle}>{this.props.message}</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text style={[styles.counter, timeSpace]}>{this.state.time}</Text>
              {this.state.seen ? (
                <Ionicons
                  name="ios-checkmark-done"
                  size={12}
                  color={Colors.primary}
                />
              ) : (
                <Ionicons
                  name="ios-checkmark"
                  size={12}
                  color={Colors.primary}
                />
              )}
            </View>
          </View>
        ) : (
          <View style={{ marginBottom: 10, alignItems: "flex-start" }}>
            <View style={styles.user2MessageBox}>
              <Text style={styles.messageStyle}>{this.props.message}</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text style={styles.counter}>{this.state.time}</Text>
              {this.state.seen ? (
                <Ionicons
                  name="ios-checkmark-done"
                  size={12}
                  color={Colors.primary}
                />
              ) : (
                <Ionicons
                  name="ios-checkmark"
                  size={12}
                  color={Colors.primary}
                />
              )}
            </View>
          </View>
        )}
      </View>
    );
  }
}
const timeSpace = { marginLeft: 13 };

const styles = StyleSheet.create({
  counter: {
    color: Colors.chatcolor,
    fontSize: 10,
    fontFamily: "ClarityCity-Regular",
    textAlign: "right",
    marginRight: 3,
  },
  user1MessageBox: {
    backgroundColor: Colors.secondary,
    borderRadius: 50,
    borderBottomRightRadius: 0,
    borderTopRightRadius: 100,
    paddingRight: 25,
    paddingLeft: 10,
    paddingVertical: 5,
  },
  user2MessageBox: {
    backgroundColor: Colors.greycolor,
    borderRadius: 50,
    borderBottomLeftRadius: 0,
    borderTopLeftRadius: 100,
    paddingLeft: 25,
    paddingRight: 10,
    paddingVertical: 5,
  },
  messageStyle: {
    color: Colors.primary,
    fontSize: 12,
    fontFamily: "ClarityCity-Regular",
  },
});

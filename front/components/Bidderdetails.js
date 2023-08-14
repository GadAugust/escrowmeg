import React, { Component } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { Entypo } from "@expo/vector-icons";
import lightTheme from "../config/lightmodecolors";
import darkTheme from "../config/darkmodecolors";
import frontStorage from "../utilities/storage";

export default class BidderDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: "",
      time: "",
      theme: "dark",
    };
  }

  async componentDidMount() {
    const getTheme = await frontStorage.asyncGet("mode");
    let currentTheme = getTheme ? JSON.parse(getTheme) : this.state.theme;

    let myDate = this.props.date;
    const date = myDate.split("T");
    let time = date[1].split(".");
    this.setState({
      ...this.state,
      date: date[0],
      time: time[0],
      theme: currentTheme,
    });
  }

  render() {
    const { theme } = this.state;
    return (
      <>
        {this.props.showPitch ? (
          <View style={styles.floatView}>
            <TouchableOpacity
              style={{ alignItems: "flex-end" }}
              onPress={() => this.props.onPress("noshow-" + this.props.itemId)}
            >
              <Entypo name="cross" size={24} color="#F5F5F5" />
            </TouchableOpacity>
            <Text
              style={[
                styles.text3,
                {
                  color: theme == "dark" ? darkTheme.primary : lightTheme.dark,
                },
              ]}
            >
              {this.props.pitch}
            </Text>
          </View>
        ) : null}
        <View
          style={{
            marginTop: 20,
            borderRadius: 20,
            borderStyle: "solid",
            borderColor: "#4A4A4A",
            borderWidth: 1,
            paddingHorizontal: 10,
            paddingVertical: 10,
          }}
        >
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View>
              <Text style={styles.head}>User</Text>
              <Text
                numberOfLines={1}
                style={[
                  styles.text3,
                  {
                    color:
                      theme == "dark" ? darkTheme.primary : lightTheme.primary,
                  },
                ]}
              >
                {this.props.firstName} {""}
                {this.props.lastName}
              </Text>
            </View>

            <View style={{ marginHorizontal: 15, width: "60%" }}>
              <Text style={styles.head}>Product</Text>
              <Text
                numberOfLines={1}
                style={[
                  styles.text3,
                  {
                    color:
                      theme == "dark" ? darkTheme.primary : lightTheme.primary,
                  },
                ]}
              >
                {this.props.product}
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View style={{ marginTop: 5 }}>
              <Text style={styles.head}>Date</Text>
              <Text
                style={[
                  styles.text3,
                  {
                    color:
                      theme == "dark" ? darkTheme.primary : lightTheme.primary,
                  },
                ]}
              >
                {this.state.date}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => this.props.onPress("display-" + this.props.itemId)}
              style={{ justifyContent: "flex-end" }}
            >
              <Text style={[styles.text3, textColor]}>View Pitch</Text>
            </TouchableOpacity>
          </View>
        </View>
      </>
    );
  }
}

const textColor = {
  color: "#3A4D8F",
  fontFamily: "ClarityCity-Bold",
};
const styles = StyleSheet.create({
  text3: {
    fontSize: 16,
    fontFamily: "ClarityCity-Regular",
  },
  head: {
    color: "#4A4A4A",
    fontFamily: "ClarityCity-Bold",
  },
  floatView: {
    position: "absolute",
    borderRadius: 10,
    backgroundColor: "#4A4A4A",
    borderStyle: "solid",
    padding: 10,
    zIndex: 100,
    width: "100%",
  },
});

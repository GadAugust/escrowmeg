import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import frontStorage from "../utilities/storage";
import lightTheme from "../config/lightmodecolors";
import darkTheme from "../config/darkmodecolors";

export default class ListingOption extends Component {
  constructor(props) {
    super(props);
    this.state = { theme: "dark" };
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
      <View
        style={[
          styles.mainView,
          {
            backgroundColor: lightTheme.dark,
            ...this.props.style,
            paddingTop: 10,
          },
        ]}
      >
        <View style={styles.eachList}>
          <TouchableOpacity
            style={{ alignSelf: "flex-end" }}
            onPress={this.props.cancelOption}
          >
            <MaterialIcons name="cancel" size={20} color="#F5F5F5" />
          </TouchableOpacity>
          <TouchableOpacity onPress={this.props.onPress}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                // marginTop: 10,
              }}
            >
              <Feather
                name="list"
                size={20}
                color="#F5F5F5"
                style={{ marginRight: 10 }}
              />
              <Text style={styles.listtext}> Open List</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={this.props.copyListID}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 10,
              }}
            >
              <Feather
                name="copy"
                size={20}
                color="#F5F5F5"
                style={{ marginRight: 10 }}
              />
              <Text style={styles.listtext}>Copy List ID</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    justifyContent: "center",
  },
  eachList: {
    backgroundColor: "#4A4A4A",
    borderRadius: 10,
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingVertical: 30,
  },
  listtext: {
    fontSize: 14,
    color: "#F5F5F5",
    fontFamily: "ClarityCity-Regular",
    marginVertical: 2,
  },
});

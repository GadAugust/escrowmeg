import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import colors from "../config/colors";
import lightTheme from "../config/lightmodecolors";
import darkTheme from "../config/darkmodecolors";
import frontStorage from "../utilities/storage";

export default class ProjectStatus extends Component {
  constructor(props) {
    super(props), (this.state = { theme: "dark" });
  }
  async componentDidMount() {
    const getTheme = await frontStorage.asyncGet("mode");
    let currentTheme = getTheme ? JSON.parse(getTheme) : this.state.theme;
    this.setState({ ...this.state, theme: currentTheme });
  }

  render() {
    const {
      sellerId,
      buyerId,
      userId,
      product,
      amount,
      firstName,
      lastName,
      status,
      onPress,
    } = this.props;
    const { theme } = this.state;

    return (
      <TouchableOpacity style={{ marginTop: 5 }} onPress={onPress}>
        <View style={{ paddingHorizontal: 5, paddingVertical: 10 }}>
          {buyerId == userId && status == "ongoing" ? (
            <View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={styles.listtext}>You are buying</Text>
                <AntDesign
                  name="arrowright"
                  size={24}
                  color={colors.secondary}
                />
              </View>
              <Text
                style={[
                  styles.listtext1,
                  {
                    color: theme == "#141414",
                  },
                ]}
              >
                {product} from {firstName} {lastName} for ${amount}
              </Text>
            </View>
          ) : sellerId == userId && status == "ongoing" ? (
            <View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.listtext}>You are selling</Text>
                <AntDesign
                  name="arrowright"
                  size={24}
                  color={colors.secondary}
                />
              </View>
              <Text
                style={[
                  styles.listtext1,
                  {
                    color: "#141414",
                  },
                ]}
              >
                {product} to {firstName} {lastName} for ${amount}
              </Text>
            </View>
          ) : (
            <View>
              <Text style={styles.listtext}>Project Completed</Text>
              <Text
                style={[
                  styles.listtext1,
                  {
                    color: "#141414",
                  },
                ]}
              >
                {product} for ${amount}
              </Text>
            </View>
          )}
        </View>
        <Image
          style={{ marginTop: 10 }}
          source={require("../assets/line.jpg")}
        />
      </TouchableOpacity>
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
    color: "#141414",
    fontFamily: "ClarityCity-RegularItalic",
  },
});

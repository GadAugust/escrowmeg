import React, { Component } from "react";
import { View, Text, TouchableWithoutFeedback } from "react-native";
import {
  DrawerItemList,
  DrawerContentScrollView,
} from "@react-navigation/drawer";
import darkTheme from "../config/darkmodecolors";
import frontStorage from "../utilities/storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default class CustomDrawer extends Component {
  constructor(props) {
    super(props),
      (this.state = {
        switchStatus: false,
        theme: "dark",
      });
  }
  async componentDidMount() {
    const getTheme = await frontStorage.asyncGet("mode");
    let currentTheme = getTheme ? JSON.parse(getTheme) : this.state.theme;
    currentTheme == "dark"
      ? this.setState({ ...this.state, switchStatus: false })
      : currentTheme == "light"
      ? this.setState({ ...this.state, switchStatus: true })
      : this.setState({ ...this.state, switchStatus: false });
  }

  switchToDarkTheme = () => {
    mode = "dark";
    frontStorage.asyncStore("mode", JSON.stringify(mode));
    this.setState({ ...this.state, switchStatus: false });
  };
  switchToLightTheme = () => {
    mode = "light";
    this.setState({ ...this.state, switchStatus: true });
    frontStorage.asyncStore("mode", JSON.stringify(mode));
  };
  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <DrawerContentScrollView {...this.props}>
            <DrawerItemList {...this.props} />

            {/* <View style={{ alignItems: "center" }}>
              {this.state.switchStatus ? (
                <TouchableWithoutFeedback onPress={this.switchToDarkTheme}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <MaterialCommunityIcons
                      name="toggle-switch"
                      size={80}
                      color={darkTheme.primary}
                    />
                    <Text
                      style={{
                        color: darkTheme.primary,
                        fontFamily: "ClarityCity-Bold",
                      }}
                    >
                      Light
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              ) : (
                <TouchableWithoutFeedback onPress={this.switchToLightTheme}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text
                      style={{
                        color: darkTheme.dark,
                        fontFamily: "ClarityCity-Bold",
                        fontSize: 18,
                      }}
                    >
                      Dark
                    </Text>
                    <MaterialCommunityIcons
                      name="toggle-switch-off"
                      size={80}
                      color={darkTheme.primary}
                    />
                  </View>
                </TouchableWithoutFeedback>
              )}
            </View> */}
          </DrawerContentScrollView>
        </View>
      </View>
    );
  }
}

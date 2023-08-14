import React, { Component } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import {
  MaterialIcons,
  MaterialCommunityIcons,
  Octicons,
  FontAwesome,
} from "@expo/vector-icons";
import routes from "../../navigation/routes";
import lightTheme from "../../config/lightmodecolors";
import darkTheme from "../../config/darkmodecolors";
import frontStorage from "../../utilities/storage";
import TopBar from "../../components/TopBar";

export default class SettingScreen extends Component {
  constructor(props) {
    super(props),
      (this.state = {
        theme: "dark",
      });
  }
  async componentDidMount() {
    const getTheme = await frontStorage.asyncGet("mode");
    let currentTheme = getTheme ? JSON.parse(getTheme) : this.state.theme;
    this.setState({ ...this.state, theme: currentTheme });
  }
  changePassword = () => {
    this.props.navigation.navigate(routes.CHANGEPASSWORD);
  };
  changePin = () => {
    this.props.navigation.navigate(routes.CHANGEPIN);
  };
  resetPin = () => {
    this.props.navigation.navigate(routes.FORGOTPASSWORD, { lead: "pin" });
  };

  policyPage = () => {
    this.props.navigation.navigate(routes.POLICYPAGE);
  };

  render() {
    const { theme } = this.state;

    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme == "dark" ? darkTheme.dark : lightTheme.dark,
          },
        ]}
      >
        <TopBar
          openNavigation={() => this.props.navigation.toggleDrawer()}
          colorTheme={{
            grey:
              this.state.theme == "dark"
                ? darkTheme.greycolor
                : lightTheme.greycolor,
            primary:
              this.state.theme == "dark"
                ? darkTheme.primary
                : lightTheme.primary,
          }}
          headerText="Settings"
        />

        <View>
          <TouchableOpacity
            style={styles.optionsView}
            onPress={this.changePassword}
          >
            <MaterialIcons
              name="lock-outline"
              size={20}
              color={theme == "dark" ? darkTheme.primary : lightTheme.primary}
            />
            <Text
              style={[
                styles.options,
                {
                  color:
                    theme == "dark" ? darkTheme.primary : lightTheme.primary,
                },
              ]}
            >
              Change Password
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionsView} onPress={this.changePin}>
            <MaterialIcons
              name="fiber-pin"
              size={20}
              color={theme == "dark" ? darkTheme.primary : lightTheme.primary}
            />
            <Text
              style={[
                styles.options,
                {
                  color:
                    theme == "dark" ? darkTheme.primary : lightTheme.primary,
                },
              ]}
            >
              Change Pin
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionsView} onPress={this.resetPin}>
            <MaterialIcons
              name="fiber-pin"
              size={20}
              color={theme == "dark" ? darkTheme.primary : lightTheme.primary}
            />
            <Text
              style={[
                styles.options,
                {
                  color:
                    theme == "dark" ? darkTheme.primary : lightTheme.primary,
                },
              ]}
            >
              Reset Pin
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.optionsView}
            onPress={this.policyPage}
          >
            <Octicons
              name="shield-lock"
              size={20}
              color={theme == "dark" ? darkTheme.primary : lightTheme.primary}
            />
            <Text
              style={[
                styles.options,
                {
                  color:
                    theme == "dark" ? darkTheme.primary : lightTheme.primary,
                },
              ]}
            >
              Privacy Policy
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionsView}>
            <MaterialCommunityIcons
              name="chat-question-outline"
              size={20}
              color={theme == "dark" ? darkTheme.primary : lightTheme.primary}
            />
            <Text
              style={[
                styles.options,
                {
                  color:
                    theme == "dark" ? darkTheme.primary : lightTheme.primary,
                },
              ]}
            >
              FAQ
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 60,
    paddingBottom: 30,
  },
  setting: {
    fontSize: 16,
    textAlign: "center",
    fontFamily: "ClarityCity-Bold",
  },
  navicon: {
    marginBottom: 30,
  },
  options: {
    fontSize: 16,
    marginLeft: 5,
    fontFamily: "ClarityCity-Regular",
  },
  optionsView: {
    flexDirection: "row",
    marginTop: 40,
  },
});

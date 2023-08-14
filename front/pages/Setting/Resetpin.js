import React, { Component } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Circle } from "react-native-animated-spinkit";
import AuthApi from "../../api/settings";
import Toast from "react-native-root-toast";
import frontStorage from "../../utilities/storage";
import colors from "../../config/colors";
import routes from "../../navigation/routes";
import lightTheme from "../../config/lightmodecolors";
import darkTheme from "../../config/darkmodecolors";
import { StatusBar } from "expo-status-bar";
import TopBar from "../../components/TopBar";
import FourDigitsPin from "../../components/FourDigitsPin";

export default class Resetpin extends Component {
  constructor(props) {
    super(props),
      (this.state = {
        loading: false,
        newPin: "",
        confirmPin: "",
        loading: false,
        theme: "dark",
      });
  }

  async componentDidMount() {
    const getTheme = await frontStorage.asyncGet("mode");
    let currentTheme = getTheme ? JSON.parse(getTheme) : this.state.theme;
    this.setState({ ...this.state, theme: currentTheme });
  }

  onChangePin = async () => {
    this.setState({ ...this.state, loading: true });
    const getData = await frontStorage.asyncGet("userData");
    let data = JSON.parse(getData);
    let new_pin = "";
    let confirmpin = "";
    let user_id = data.id;

    if (this.state.newPin.length == 4) {
      // console.log("newpin", newPin);
      if (this.state.confirmPin.length == 4) {
        new_pin = parseInt(this.state.newPin);
        confirmpin = parseInt(this.state.confirmPin);

        if (new_pin != confirmpin) {
          Toast.show("Pin does not match", {
            duration: Toast.durations.LONG,
          });
          this.setState({ ...this.state, loading: false });
        } else if (new_pin == confirmpin) {
          //   console.log(user_id, pin, new_pin);
          const response = await AuthApi.updatePin({
            user_id,
            pin: new_pin,
          });
          // console.log(response);
          if (response.status == 406) {
            this.setState({ ...this.state, loading: false });
            Toast.show(response.data.message, {
              duration: Toast.durations.LONG,
            });
          } else if (response.status == 201 || response.status == 200) {
            this.setState({ ...this.state, loading: false });
            Toast.show("Pin changed successfully", {
              duration: Toast.durations.LONG,
            });
            this.props.navigation.navigate(routes.MAINPAGE);
          } else {
            this.setState({ ...this.state, loading: false });
            Toast.show(response.data.message, {
              duration: Toast.durations.LONG,
            });
            console.log("Other status", response.data);
          }
        }
      } else {
        this.setState({ ...this.state, loading: false });
        Toast.show("Pin does not match", {
          duration: Toast.durations.LONG,
        });
      }
    } else {
      this.setState({ ...this.state, loading: false });
      Toast.show("New pin is invalid", { duration: Toast.durations.LONG });
    }
  };

  render() {
    const { theme } = this.state;

    return (
      <ScrollView
        style={[
          styles.container,
          {
            backgroundColor: theme == "dark" ? darkTheme.dark : lightTheme.dark,
          },
        ]}
      >
        <StatusBar style="light" animated={true} backgroundColor="#141414" />
        <TopBar
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
          useBack={true}
          backFunc={() => this.props.navigation.navigate(routes.MAINPAGE)}
          headerText="Change Pin"
        />

        <FourDigitsPin
          text={"Insert New Pin"}
          setPinValue={(pin) => this.setState({ ...this.state, newPin: pin })}
        />

        <FourDigitsPin
          text={"Repeat New Pin"}
          setPinValue={(pin) =>
            this.setState({ ...this.state, confirmPin: pin })
          }
        />

        <View>
          {this.state.loading ? (
            <View style={styles.spin}>
              <Circle size={18} color="#6280E8" />
            </View>
          ) : (
            <TouchableOpacity onPress={this.onChangePin}>
              <Text style={[styles.pin, addStyle]}>Save</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    );
  }
}

const addStyle = { marginTop: 30 };
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 60,
    paddingBottom: 30,
  },
  containerBox: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 5,
  },
  boxfield: {
    backgroundColor: "#4A4A4A",
    height: 62,
    width: 62,
    marginRight: 6,
    justifyContent: "center",
    alignItems: "center",
  },

  inputfield: {
    color: "#F5F5F5",
    fontSize: 25,
    fontFamily: "ClarityCity-Bold",
  },
  spin: {
    backgroundColor: "#3A4D8F",
    borderRadius: 10,
    paddingTop: 9,
    height: 45,
    alignItems: "center",
    marginTop: 6,
  },
  pin: {
    color: colors.tertiary,
    fontSize: 16,
    fontFamily: "ClarityCity-Bold",
    textAlign: "center",
    marginTop: 80,
  },
  stylePin: {
    color: colors.tertiary,
    fontSize: 16,
    fontFamily: "ClarityCity-Bold",
  },
  spin: {
    paddingTop: 30,
    alignItems: "center",
  },
});

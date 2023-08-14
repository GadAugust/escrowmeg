import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  TextInput,
  Image,
  View,
  ScrollView,
} from "react-native";
import routes from "../navigation/routes";
import PrimaryButton from "../components/PrimaryButton";
import AuthApi from "../api/auth";
import darkTheme from "../config/darkmodecolors";
import lightTheme from "../config/lightmodecolors";
import frontStorage from "../utilities/storage";
import { Formik } from "formik";
import { Circle } from "react-native-animated-spinkit";
import Toast from "react-native-root-toast";
import { StatusBar } from "expo-status-bar";

export default class ForgotPasswordScreen extends Component {
  constructor(props) {
    super(props),
      (this.state = {
        loading: false,
        theme: "dark",
        lead: "password",
      });
  }

  async componentDidMount() {
    const getTheme = await frontStorage.asyncGet("mode");
    let currentTheme = getTheme ? JSON.parse(getTheme) : this.state.theme;
    let lead = this.props.route.params.lead;
    this.setState({ ...this.state, theme: currentTheme, lead });
  }

  handleReset = async (value) => {
    this.setState({ ...this.state, loading: true });
    if (value.email != "") {
      let email = value.email.toLowerCase().trim();
      console.log(value, email);
      const response = await AuthApi.forgotPassword({ email });
      let newResponse = response.data;
      console.log(newResponse);
      if (newResponse.status == 200) {
        frontStorage.asyncStore("userEmail", JSON.stringify(value));
        Toast.show("Verification code sent to email", {
          duration: Toast.durations.LONG,
        });
        this.nextScreen();
        this.setState({ ...this.state, loading: false });
      } else {
        Toast.show(newResponse.message, { duration: Toast.durations.LONG });
        this.setState({ ...this.state, loading: false });
      }
    } else {
      Toast.show("Email cannot be empty", { duration: Toast.durations.LONG });
      this.setState({ ...this.state, loading: false });
    }
  };

  nextScreen = () => {
    this.props.navigation.navigate(routes.SIXDIGITSPASSWORD, {
      lead: this.state.lead,
    });
  };

  back = () => {
    this.state.lead == "password"
      ? this.props.navigation.navigate(routes.LOGIN)
      : this.props.navigation.navigate(routes.MAINPAGE);
  };

  render() {
    const { theme } = this.state;
    return (
      <Formik
        initialValues={{ email: "" }}
        onSubmit={(values) => this.handleReset(values)}
      >
        {({ handleChange, handleBlur, handleSubmit, values }) => (
          <ScrollView
            style={{
              backgroundColor: lightTheme.dark,
            }}
            contentContainerStyle={{
              flex: 1,
              justifyContent: "center",
            }}
          >
            <View
              style={[
                styles.container,
                {
                  backgroundColor: lightTheme.dark,
                },
              ]}
            >
              <StatusBar
                style="light"
                animated={true}
                backgroundColor="#141414"
              />
              <Image
                style={{ alignSelf: "center" }}
                source={require("../assets/escrobyteslogo.png")}
              />
              <Text
                style={[
                  styles.retrieve,
                  {
                    color: "#141414",
                  },
                ]}
              >
                Enter your email address to reset {this.state.lead}.
              </Text>
              <View style={styles.boxfield}>
                <Text style={styles.labelfield}>Email</Text>
                <TextInput
                  style={styles.inputfield}
                  onChangeText={handleChange("email")}
                  value={values.email}
                  keyboardType="email-address"
                />
              </View>

              {this.state.loading ? (
                <View style={styles.spin}>
                  <Circle size={24} color="#FFFFFF" />
                </View>
              ) : (
                <PrimaryButton text="Retrieve" onPress={handleSubmit} />
              )}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  paddingTop: 50,
                }}
              >
                <Text
                  onPress={this.back}
                  style={{
                    color: "#BC990A",
                    fontSize: 16,
                    fontFamily: "ClarityCity-Regular",
                  }}
                >
                  Back to {this.state.lead == "password" ? "Login" : "settings"}
                </Text>
              </View>
            </View>
          </ScrollView>
        )}
      </Formik>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
  },
  retrieve: {
    fontSize: 16,
    fontFamily: "ClarityCity-Bold",
    paddingTop: 60,
    textAlign: "center",
  },
  boxfield: {
    backgroundColor: "#4A4A4A",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingTop: 6,
    marginVertical: 50,
    height: 45,
  },
  labelfield: {
    color: "#F5F5F5",
    fontFamily: "ClarityCity-Regular",
    fontSize: 10,
  },
  inputfield: {
    color: "#F5F5F5",
    paddingVertical: -20,
    fontSize: 13,
    height: 20,
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
});

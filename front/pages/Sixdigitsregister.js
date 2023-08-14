import React, { Component } from "react";
import routes from "../navigation/routes";
import frontStorage from "../utilities/storage";
import AuthApi from "../api/auth";
import Toast from "react-native-root-toast";
import SixDigitsCode from "../components/Sixdigitscode";
import { StyleSheet, Text, View, Image } from "react-native";
import { StatusBar } from "expo-status-bar";

export default class SixDigitsRegisterScreen extends Component {
  constructor(props) {
    super(props),
      (this.state = {
        loading: false,
      });
  }
  nextScreen = () => {
    this.props.navigation.navigate(routes.LOGIN);
  };

  resendCode = async () => {
    const getData = await frontStorage.asyncGet("newData");
    let data = JSON.parse(getData);
    // console.log(data);
    let email = data.email.toLowerCase().trim();
    const response = await AuthApi.forgotPassword({ email });
    let newResponse = response.data;
    console.log(newResponse);
    if (newResponse.status == 200) {
      Toast.show("Verification code sent to email", {
        duration: Toast.durations.LONG,
      });
    } else {
      Toast.show(newResponse.message, { duration: Toast.durations.LONG });
    }
  };

  verifyCode = async (code) => {
    console.log("code", code);
    if (code.length == 6) {
      this.setState({ ...this.state, loading: true });
      const getData = await frontStorage.asyncGet("newData");
      const {
        email,
        firstname: first_name,
        lastname: last_name,
        occupation,
        phonenum: phone_number,
        password,
      } = JSON.parse(getData);

      let v_code = code;

      const response = await AuthApi.verifyCode({ email, v_code });
      // console.log(response.data);
      const { status } = response.data;
      if (status == 200) {
        const data = await AuthApi.registerUser({
          first_name,
          last_name,
          phone_number,
          occupation,
          email,
          password,
        });
        const { status } = data.data;
        console.log(data.data);
        if (status == 202) {
          this.setState({ ...this.state, loading: false });
          Toast.show("Registration successful", {
            duration: Toast.durations.LONG,
          });
          frontStorage.asyncRemove("newData");
          this.nextScreen();
        } else {
          this.setState({ ...this.state, loading: false });
          Toast.show("Registration not successful", {
            duration: Toast.durations.LONG,
          });
        }
      } else {
        this.setState({ ...this.state, loading: false });
        Toast.show("Verification code does not match", {
          duration: Toast.durations.LONG,
        });
      }
    } else {
      Toast.show("Invalid Verification code", {
        duration: Toast.durations.LONG,
      });
    }
  };

  nextScreen = () => this.props.navigation.navigate(routes.LOGIN);

  render() {
    return (
      <View style={styles.container}>
        <StatusBar style="light" animated={true} backgroundColor="#141414" />
        <Image
          style={{ alignSelf: "center" }}
          source={require("../assets/escrobyteslogo.png")}
        />
        <SixDigitsCode
          text="Enter the 6 digits sent to your email to continue your registration."
          verifyCode={this.verifyCode}
          loading={this.state.loading}
        />
        <View style={{ flexDirection: "row", paddingTop: 11 }}>
          <Text
            style={{
              color: "#F5F5F5",
              fontSize: 14,
              fontFamily: "ClarityCity-Regular",
            }}
          >
            Code not received?
          </Text>
          <Text
            onPress={this.resendCode}
            style={{
              color: "#6280E8",
              fontSize: 14,
              fontFamily: "ClarityCity-Regular",
            }}
          >
            {" "}
            Resend Code.
          </Text>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#141414",
    paddingHorizontal: 10,
    paddingTop: 60,
    paddingBottom: 30,
  },
});

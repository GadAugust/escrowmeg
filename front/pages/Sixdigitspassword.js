import React, { Component } from "react";
import routes from "../navigation/routes";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
} from "react-native";
import frontStorage from "../utilities/storage";
import AuthApi from "../api/auth";
import Toast from "react-native-root-toast";
import SixDigitsCode from "../components/Sixdigitscode";
import { StatusBar } from "expo-status-bar";

export default class SixDigitsPasswordScreen extends Component {
  constructor(props) {
    super(props), (this.state = { loading: false, lead: "password" });
  }

  async componentDidMount() {
    let lead = this.props.route.params.lead;
    this.setState({ ...this.state, lead });
  }

  verifyCode = async (code) => {
    console.log(code);
    if (code.length == 6) {
      this.setState({ ...this.state, loading: true });
      const getData = await frontStorage.asyncGet("userEmail");
      let data = JSON.parse(getData);
      //   console.log(data);
      let email = data.email.toLowerCase().trim();
      let v_code = parseInt(code);
      // console.log(email, v_code);
      const response = await AuthApi.verifyCode({ email, v_code });
      let newResponse = response.data;
      // console.log(newResponse);
      if (newResponse.status == 200) {
        this.setState({ ...this.state, loading: false });
        Toast.show(newResponse.message, { duration: Toast.durations.LONG });
        this.changePassword();
      } else {
        this.setState({ ...this.state, loading: false });
        Toast.show(newResponse.message, { duration: Toast.durations.LONG });
      }
    } else {
      Toast.show("Invalid verification code", {
        duration: Toast.durations.LONG,
      });
    }
  };

  resendCode = async () => {
    const getData = await frontStorage.asyncGet("userEmail");
    let data = JSON.parse(getData);
    // console.log(data);
    let email = data.email.toLowerCase().trim();
    const response = await AuthApi.forgotPassword({ email });
    let newResponse = response.data;
    // console.log(newResponse);
    if (newResponse.status == 200) {
      Toast.show("Verification code sent to email", {
        duration: Toast.durations.LONG,
      });
    } else {
      Toast.show(newResponse.message, { duration: Toast.durations.LONG });
    }
  };

  changePassword = () => {
    this.state.lead == "password"
      ? this.props.navigation.navigate(routes.CHANGEFORGOTPASSWORD)
      : this.props.navigation.navigate(routes.RESETPIN);
  };

  back = () => {
    this.state.lead == "password"
      ? this.props.navigation.navigate(routes.LOGIN)
      : this.props.navigation.navigate(routes.MAINPAGE);
  };

  render() {
    return (
      <ScrollView
        style={{
          backgroundColor: "#f5f5f5",
        }}
        contentContainerStyle={{
          flex: 1,
          justifyContent: "center",
        }}
      >
        <View style={styles.container}>
          <StatusBar style="light" animated={true} backgroundColor="#141414" />
          <Image
            style={{ alignSelf: "center" }}
            source={require("../assets/escrobyteslogo.png")}
          />
          <SixDigitsCode
            text="Enter code sent to your email"
            verifyCode={this.verifyCode}
            loading={this.state.loading}
          />
          <TouchableOpacity onPress={this.resendCode}>
            <View style={{ flexDirection: "row", paddingTop: 11 }}>
              <Text
                style={{
                  color: "#141414",
                  fontSize: 14,
                  fontWeight: "400",
                  fontFamily: "ClarityCity-Regular",
                }}
              >
                Code not received?
              </Text>
              <Text
                style={{
                  color: "#BC990A",
                  fontSize: 14,
                  fontFamily: "ClarityCity-Regular",
                }}
              >
                {" "}
                Resend Code.
              </Text>
            </View>
          </TouchableOpacity>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              paddingTop: 50,
            }}
            onPress={this.back}
          >
            <Text
              style={{
                color: "#F5F5F5",
                fontSize: 16,
                fontFamily: "ClarityCity-Regular",
              }}
            >
              Back to {this.state.lead == "password" ? "Login" : "Settings"}
            </Text>
          </View>
        </View>
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 15,
  },
});

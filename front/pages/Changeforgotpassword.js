import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import routes from "../navigation/routes";
import { Formik } from "formik";
import Toast from "react-native-root-toast";
import { Circle } from "react-native-animated-spinkit";
import frontStorage from "../utilities/storage";
import AuthApi from "../api/auth";
import PrimaryButton from "../components/PrimaryButton";
import { Ionicons } from "@expo/vector-icons";
import * as yup from "yup";
import darkTheme from "../config/darkmodecolors";
import lightTheme from "../config/lightmodecolors";
import { StatusBar } from "expo-status-bar";

const passwordValidationSchema = yup.object().shape({
  password: yup.string().required().min(8).label("Password"),
  confirmpassword: yup
    .string()
    .required()
    .label("Confirm password")
    .oneOf([yup.ref("password"), null], "Password does not match"),
});

export default class ChangeForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      theme: "dark",
    };
  }

  async componentDidMount() {
    const getTheme = await frontStorage.asyncGet("mode");
    let currentTheme = getTheme ? JSON.parse(getTheme) : this.state.theme;
    this.setState({ ...this.state, theme: currentTheme });
  }

  handlePasswordReset = async (values) => {
    if (values.password != "" && values.confirmpassword != "") {
      if (values.password == values.confirmpassword) {
        this.setState({ ...this.state, loading: true });
        const getData = await frontStorage.asyncGet("userEmail");
        let data = JSON.parse(getData);
        // console.log(data);

        let email = data.email.toLowerCase().trim();
        let password = values.password.trim();
        const response = await AuthApi.updatePassword({ email, password });
        // console.log("checkkkkkk", response, email);
        let newResponse = response.data;
        // console.log("check", newResponse);
        if (newResponse.status == 201) {
          this.textPassword.clear();
          this.textnewPassword.clear();
          Toast.show(newResponse.message, { duration: Toast.durations.LONG });
          // frontStorage.asyncRemove("userEmail");
          this.setState({ ...this.state, loading: false });
          this.loginScreen();
        } else {
          Toast.show(newResponse.message, {
            duration: Toast.durations.LONG,
          });
          this.setState({ ...this.state, loading: false });
        }
      } else {
        Toast.show("Password does not match", {
          duration: Toast.durations.LONG,
        });
      }
    } else {
      Toast.show("Password can not be empty", {
        duration: Toast.durations.LONG,
      });
    }
  };

  loginScreen = () => {
    this.props.navigation.navigate(routes.LOGIN);
  };

  render() {
    const { theme } = this.state;
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: lightTheme.dark,
          },
        ]}
      >
        <StatusBar style="light" animated={true} backgroundColor="#141414" />
        <TouchableOpacity onPress={this.loginScreen}>
          <Ionicons name="chevron-back-outline" size={30} color="#3A4D8F" />
        </TouchableOpacity>

        <Formik
          initialValues={{ password: "", confirmpassword: "" }}
          onSubmit={(values) => this.handlePasswordReset(values)}
          validationSchema={passwordValidationSchema}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <ScrollView
              style={{
                backgroundColor: lightTheme.dark,
              }}
              contentContainerStyle={{
                flex: 1,
                justifyContent: "center",
              }}
            >
              <View>
                <Image
                  style={{ alignSelf: "center" }}
                  source={require("../assets/escrobyteslogo.png")}
                />
                <View style={styles.mainbox}>
                  <View style={{ marginBottom: 25 }}>
                    <View style={styles.boxfield}>
                      <Text style={styles.labelfield}>New Password</Text>
                      <TextInput
                        style={styles.inputfield}
                        onChangeText={handleChange("password")}
                        onBlur={handleBlur("password")}
                        value={values.password}
                        ref={(input) => {
                          this.textPassword = input;
                        }}
                        keyboardType="visible-password"
                      />
                    </View>
                    {errors.password && touched.password ? (
                      <Text
                        style={{
                          fontSize: 10,
                          color: "#FD3464",
                          fontWeight: "400",
                          marginLeft: 5,
                        }}
                      >
                        {errors.password}
                      </Text>
                    ) : null}
                  </View>

                  <View style={{ marginBottom: 25 }}>
                    <View style={styles.boxfield}>
                      <Text style={styles.labelfield}>Retype Password</Text>
                      <TextInput
                        style={styles.inputfield}
                        onChangeText={handleChange("confirmpassword")}
                        onBlur={handleBlur("confirmpassword")}
                        value={values.confirmpassword}
                        ref={(input) => {
                          this.textnewPassword = input;
                        }}
                        keyboardType="visible-password"
                      />
                    </View>
                    {errors.confirmpassword && touched.confirmpassword ? (
                      <Text
                        style={{
                          fontSize: 10,
                          color: "#FD3464",
                          fontWeight: "400",
                          marginLeft: 5,
                        }}
                      >
                        {errors.confirmpassword}
                      </Text>
                    ) : null}
                  </View>
                  {this.state.loading ? (
                    <View style={styles.spin}>
                      <Circle size={24} color="#FFFFFF" />
                    </View>
                  ) : (
                    <PrimaryButton text="Submit" onPress={handleSubmit} />
                  )}
                </View>
              </View>
            </ScrollView>
          )}
        </Formik>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 60,
  },
  mainbox: {
    paddingTop: 70,
  },

  boxfield: {
    backgroundColor: "#4A4A4A",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingTop: 6,
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

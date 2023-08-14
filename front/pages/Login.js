import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import PrimaryButton from "../components/PrimaryButton";
import { Circle } from "react-native-animated-spinkit";
import AuthApi from "../api/auth";
import { Formik } from "formik";
import Toast from "react-native-root-toast";
import darkTheme from "../config/darkmodecolors";
import lightTheme from "../config/lightmodecolors";
import frontStorage from "../utilities/storage";
import routes from "../navigation/routes";
import myFonts from "../config/fontfamily";
import * as Font from "expo-font";
import static_variable from "../constants/static_variable";
import * as yup from "yup";
import { StatusBar } from "expo-status-bar";

const loginValidationSchema = yup.object().shape({
  email: yup
    .string()
    .required("Email is a required field")
    .matches(/@[^.]*\./, "Invalid email address")
    .email("Email must be valid"),
  password: yup.string().required().min(8).label("Password"),
});

export default class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      secureTextEntry: true,
      fontsLoaded: false,
      theme: "dark",
    };
  }

  async componentDidMount() {
    await Font.loadAsync(myFonts);
    const getTheme = await frontStorage.asyncGet("mode");
    let currentTheme = getTheme ? JSON.parse(getTheme) : this.state.theme;
    console.log(currentTheme);
    this.setState({
      ...this.state,
      fontsLoaded: true,
      theme: currentTheme,
    });
  }

  handlePasswwordVisibility = (status) => {
    status == "hide"
      ? this.setState({ ...this.state, secureTextEntry: false })
      : this.setState({ ...this.state, secureTextEntry: true });
  };

  handleLogin = async (values) => {
    this.setState({ ...this.state, loading: true });
    if (values.email != "" && values.password != "") {
      let email = values.email.toLowerCase().trim();
      let password = values.password.trim();
      const response = await AuthApi.logIn({ email, password });
      // console.log(response);
      let newResponse = response.data;
      // console.log(newResponse)

      if (response.data == null) {
        this.setState({ ...this.state, loading: false });
        values.email = "";
        values.password = "";
        Toast.show("An error occured. Try again", {
          duration: Toast.durations.LONG,
        });
      } else if (newResponse.status == 202) {
        Toast.show(newResponse.message, { duration: Toast.durations.LONG });
        // console.log("New Response", newResponse.data);
        frontStorage.asyncStore("userData", JSON.stringify(newResponse.data));
        let userData = newResponse.data;
        static_variable.user_id = userData.id;
        if (userData.onboarded == true) {
          this.homePage();
          this.setState({ ...this.state, loading: false });
          values.email = "";
          values.password = "";
        } else if (userData.onboarded == false) {
          this.profilePicture();
          this.setState({ ...this.state, loading: false });
          values.email = "";
          values.password = "";
        }
      } else {
        this.setState({ ...this.state, loading: false });
        Toast.show(newResponse.message, { duration: Toast.durations.LONG });
      }
    } else {
      Toast.show("One or two inputs missing", {
        duration: Toast.durations.LONG,
      });
    }
  };

  profilePicture = () => {
    this.props.navigation.navigate(routes.PROFILEPICTURE);
  };

  homePage = () => {
    this.props.navigation.navigate(routes.MAINPAGE);
  };

  forgotPassword = () => {
    this.props.navigation.navigate(routes.FORGOTPASSWORD, { lead: "password" });
  };

  register = () => {
    this.props.navigation.navigate(routes.REGISTER);
  };

  render() {
    const { loading, secureTextEntry, fontsLoaded, theme } = this.state;

    if (!fontsLoaded) {
      return (
        <View
          style={[
            styles.container,
            {
              backgroundColor:
                theme == "dark" ? darkTheme.dark : lightTheme.dark,
            },
          ]}
        ></View>
      );
    }

    return (
      <Formik
        initialValues={{ email: "", password: "" }}
        onSubmit={(values) => this.handleLogin(values)}
        validationSchema={loginValidationSchema}
      >
        {({ handleChange, handleSubmit, values, errors, touched }) => (
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
                  styles.login,
                  {
                    color:
                      theme == "dark" ? darkTheme.primary : lightTheme.primary,
                  },
                ]}
              >
                Log in
              </Text>
              <View style={styles.mainbox}>
                <View style={{ marginBottom: 30 }}>
                  <View style={styles.boxfield}>
                    <Text style={styles.labelfield}>Email</Text>
                    <TextInput
                      keyboardType="email-address"
                      style={styles.inputfield}
                      onChangeText={handleChange("email")}
                      value={values.email}
                    />
                  </View>
                  {errors.email && touched.email ? (
                    <Text
                      style={{
                        fontSize: 10,
                        color: "#FD3464",
                        fontWeight: "400",
                      }}
                    >
                      {errors.email}
                    </Text>
                  ) : null}
                </View>
                <View style={{ marginBottom: 30 }}>
                  <View style={styles.passwordfield}>
                    <View style={{ width: "90%" }}>
                      <Text style={styles.labelfield}>Password</Text>
                      <TextInput
                        style={styles.passwordInput}
                        onChangeText={handleChange("password")}
                        value={values.password}
                        secureTextEntry={secureTextEntry}
                      />
                    </View>
                    <View>
                      {secureTextEntry ? (
                        <TouchableOpacity
                          onPress={() => this.handlePasswwordVisibility("hide")}
                        >
                          <Ionicons name="ios-eye" size={20} color="#F5F5F5" />
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          onPress={() => this.handlePasswwordVisibility("show")}
                        >
                          <Ionicons
                            name="ios-eye-off"
                            size={20}
                            color="#F5F5F5"
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                  {errors.password && touched.password ? (
                    <Text
                      style={{
                        fontSize: 10,
                        color: "#FD3464",
                        fontWeight: "400",
                      }}
                    >
                      {errors.password}
                    </Text>
                  ) : null}
                </View>
              </View>
              {loading ? (
                <View style={styles.spin}>
                  <Circle size={24} color="#BC990A" />
                </View>
              ) : (
                <PrimaryButton text="Log in" onPress={handleSubmit} />
              )}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  paddingTop: 48,
                }}
              >
                <Text
                  style={{
                    color: "#141414",
                    fontSize: 16,
                    fontFamily: "ClarityCity-Regular",
                  }}
                >
                  Want to join?
                </Text>
                <Text
                  onPress={this.register}
                  style={{
                    color: "#BC990A",
                    fontSize: 16,
                    fontFamily: "ClarityCity-Regular",
                  }}
                >
                  {" "}
                  Register here.
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  paddingTop: 11,
                }}
              >
                <Text
                  onPress={this.forgotPassword}
                  style={{
                    color: "#BC990A",
                    fontSize: 16,
                    fontFamily: "ClarityCity-Regular",
                  }}
                >
                  Forgot password
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "flex-end",
                  justifyContent: "space-between",
                  marginBottom: 15,
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    color: theme == "dark" ? darkTheme.dark : lightTheme.dark,
                    fontFamily: "ClarityCity-Regular",
                  }}
                >
                  Terms and Condition
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: theme == "dark" ? darkTheme.dark : lightTheme.dark,
                    fontFamily: "ClarityCity-Regular",
                  }}
                >
                  Privacy Policy
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
  login: {
    fontSize: 16,
    paddingTop: 34,
    fontFamily: "ClarityCity-Bold",
  },
  mainbox: {
    paddingTop: 30,
  },
  boxfield: {
    backgroundColor: "#4A4A4A",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingTop: 6,
    height: 45,
  },
  passwordfield: {
    backgroundColor: "#4A4A4A",
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 45,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  labelfield: {
    color: "#F5F5F5",
    fontSize: 10,
    fontFamily: "ClarityCity-Regular",
  },
  inputfield: {
    color: "#F5F5F5",
    paddingVertical: -20,
    fontSize: 13,
    height: 20,
    fontFamily: "ClarityCity-Bold",
  },
  passwordInput: {
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

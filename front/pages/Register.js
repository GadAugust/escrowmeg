import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import PrimaryButton from "../components/PrimaryButton";
import Checkbox from "../components/Checkbox";
import Toast from "react-native-root-toast";
import { Formik } from "formik";
import { Circle } from "react-native-animated-spinkit";
import darkTheme from "../config/darkmodecolors";
import lightTheme from "../config/lightmodecolors";
import frontStorage from "../utilities/storage";
import myFonts from "../config/fontfamily";
import * as Font from "expo-font";
import AuthApi from "../api/auth";
import routes from "../navigation/routes";
import * as yup from "yup";
import { StatusBar } from "expo-status-bar";

const registerValidationSchema = yup.object().shape({
  firstname: yup
    .string()
    .required()
    .matches(/^\S+$/, "First name can not include space(s)")
    .label("First name"),
  lastname: yup
    .string()
    .required()
    .matches(/^\S+$/, "Last name can not include space(s)")
    .label("Last name"),
  email: yup
    .string()
    .required("Email is a required field")
    .matches(/@[^.]*\./, "Invalid email address")
    .email("Email must be valid"),
  phonenum: yup.string().required().label("Mobile number"),
  occupation: yup.string().required().min(5).label("Occupation"),
  password: yup.string().required().min(8).label("Password"),
  confirmpass: yup
    .string()
    .required()
    .label("Confirm password")
    .oneOf([yup.ref("password"), null], "Password does not match"),
});

export default class RegisterScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      fontsLoaded: false,
      secureTextEntry: true,
      secureTextEntry1: true,
      theme: "dark",
      buttonActive: false,
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

  handlePasswword2Visibility = (status) => {
    status == "hide"
      ? this.setState({ ...this.state, secureTextEntry1: false })
      : this.setState({ ...this.state, secureTextEntry1: true });
  };

  nextScreen = () => {
    this.props.navigation.navigate(routes.SIXDIGITSREGISTER);
  };

  logIn = () => {
    this.props.navigation.navigate(routes.LOGIN);
  };

  handleRegistration = async (values) => {
    if (
      values.firstname != "" &&
      values.lastname != "" &&
      values.email != "" &&
      values.phonenum != "" &&
      values.occupation != "" &&
      values.password != ""
    ) {
      this.setState({ ...this.state, loading: true });
      console.log({
        ...values,
        email: values.email.toLowerCase().trim(),
        password: values.password.trim(),
      });
      frontStorage.asyncStore(
        "newData",
        JSON.stringify({
          ...values,
          email: values.email.toLowerCase().trim(),
          password: values.password.trim(),
        })
      );
      let email = values.email.toLowerCase().trim();
      // console.log(email);
      const response = await AuthApi.verifyEmail({ email });
      console.log("Big resonse", response);
      console.log("Response Data", response.data);

      if (response.status == 406) {
        Toast.show(response.data.message, { duration: Toast.durations.LONG });
        this.setState({ ...this.state, loading: false });
      } else if (response.status == 200) {
        this.nextScreen();
        this.setState({ ...this.state, loading: false });
      } else {
        Toast.show("An error occured", { duration: Toast.durations.LONG });
        this.setState({ ...this.state, loading: false });
      }
    } else {
      Toast.show("Input can not be empty", { duration: Toast.durations.LONG });
    }
  };

  render() {
    const { loading, fontsLoaded, secureTextEntry, secureTextEntry1, theme } =
      this.state;

    if (!fontsLoaded) {
      return null;
    }

    return (
      <ScrollView>
        <View
          style={[
            styles.container,
            {
              backgroundColor: lightTheme.dark,
            },
          ]}
        >
          <StatusBar style="light" animated={true} backgroundColor="#141414" />
          <View>
            <Image
              style={{ alignSelf: "center" }}
              source={require("../assets/escrobyteslogo.png")}
            />
            <Text
              style={[
                styles.register,
                {
                  color: "#141414",
                },
              ]}
            >
              Register
            </Text>
          </View>
          <Formik
            initialValues={{
              firstname: "",
              lastname: "",
              email: "",
              phonenum: "",
              occupation: "",
              password: "",
              confirmpass: "",
            }}
            onSubmit={(values) => this.handleRegistration(values)}
            validationSchema={registerValidationSchema}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <View>
                <View style={styles.mainbox}>
                  <View style={{ marginBottom: 25 }}>
                    <View style={styles.boxfield}>
                      <Text style={styles.labelfield}>First Name</Text>
                      <TextInput
                        style={styles.inputfield}
                        onChangeText={handleChange("firstname")}
                        onBlur={handleBlur("firstname")}
                        value={values.firstname}
                      />
                    </View>
                    {errors.firstname && touched.firstname ? (
                      <Text
                        style={{
                          fontSize: 10,
                          color: "#FD3464",
                          fontFamily: "ClarityCity-Regular",
                          marginLeft: 5,
                        }}
                      >
                        {errors.firstname}
                      </Text>
                    ) : null}
                  </View>
                  <View style={{ marginBottom: 25 }}>
                    <View style={styles.boxfield}>
                      <Text style={styles.labelfield}>Last Name</Text>
                      <TextInput
                        style={styles.inputfield}
                        onChangeText={handleChange("lastname")}
                        onBlur={handleBlur("lastname")}
                        value={values.lastname}
                      />
                    </View>
                    {errors.lastname && touched.lastname ? (
                      <Text
                        style={{
                          fontSize: 10,
                          color: "#FD3464",
                          fontFamily: "ClarityCity-Regular",
                          marginLeft: 5,
                        }}
                      >
                        {errors.lastname}
                      </Text>
                    ) : null}
                  </View>
                  <View style={{ marginBottom: 25 }}>
                    <View style={styles.boxfield}>
                      <Text style={styles.labelfield}>Mobile Number</Text>
                      <TextInput
                        style={styles.inputfield}
                        onChangeText={handleChange("phonenum")}
                        onBlur={handleBlur("phonenum")}
                        value={values.phonenum}
                        keyboardType="numeric"
                      />
                    </View>
                    {errors.phonenum && touched.phonenum ? (
                      <Text
                        style={{
                          fontSize: 10,
                          color: "#FD3464",
                          fontFamily: "ClarityCity-Regular",
                          marginLeft: 5,
                        }}
                      >
                        {errors.phonenum}
                      </Text>
                    ) : null}
                  </View>
                  <View style={{ marginBottom: 25 }}>
                    <View style={styles.boxfield}>
                      <Text style={styles.labelfield}>Occupation</Text>
                      <TextInput
                        style={styles.inputfield}
                        onChangeText={handleChange("occupation")}
                        onBlur={handleBlur("occupation")}
                        value={values.occupation}
                      />
                    </View>
                    {errors.occupation && touched.occupation ? (
                      <Text
                        style={{
                          fontSize: 10,
                          color: "#FD3464",
                          fontFamily: "ClarityCity-Regular",
                          marginLeft: 5,
                        }}
                      >
                        {errors.occupation}
                      </Text>
                    ) : null}
                  </View>

                  <View style={{ marginBottom: 25 }}>
                    <View style={styles.boxfield}>
                      <Text style={styles.labelfield}>Email</Text>
                      <TextInput
                        style={styles.inputfield}
                        focusable={true}
                        onChangeText={handleChange("email")}
                        onBlur={handleBlur("email")}
                        value={values.email}
                        keyboardType="email-address"
                      />
                    </View>
                    {errors.email && touched.email ? (
                      <Text
                        style={{
                          fontSize: 10,
                          color: "#FD3464",
                          fontFamily: "ClarityCity-Regular",
                          marginLeft: 5,
                        }}
                      >
                        {errors.email}
                      </Text>
                    ) : null}
                  </View>

                  <View style={{ marginBottom: 25 }}>
                    <View style={styles.passwordfield}>
                      <View style={{ width: "90%" }}>
                        <Text style={styles.labelfield}>Password</Text>
                        <TextInput
                          style={styles.inputfield}
                          onChangeText={handleChange("password")}
                          onBlur={handleBlur("password")}
                          value={values.password}
                          secureTextEntry={secureTextEntry1}
                        />
                      </View>
                      <View>
                        {secureTextEntry1 ? (
                          <TouchableOpacity
                            onPress={() =>
                              this.handlePasswword2Visibility("hide")
                            }
                          >
                            <Ionicons
                              name="ios-eye"
                              size={20}
                              color="#F5F5F5"
                            />
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity
                            onPress={() =>
                              this.handlePasswword2Visibility("show")
                            }
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
                          fontFamily: "ClarityCity-Regular",
                          marginLeft: 5,
                        }}
                      >
                        {errors.password}
                      </Text>
                    ) : null}
                  </View>
                  <View style={{ marginBottom: 25 }}>
                    <View style={styles.passwordfield}>
                      <View style={{ width: "90%" }}>
                        <Text style={styles.labelfield}>Confirm Password</Text>
                        <TextInput
                          style={styles.inputfield}
                          onChangeText={handleChange("confirmpass")}
                          onBlur={handleBlur("confirmpass")}
                          value={values.confirmpass}
                          secureTextEntry={secureTextEntry}
                        />
                      </View>
                      <View>
                        {secureTextEntry ? (
                          <TouchableOpacity
                            onPress={() =>
                              this.handlePasswwordVisibility("hide")
                            }
                          >
                            <Ionicons
                              name="ios-eye"
                              size={20}
                              color="#F5F5F5"
                            />
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity
                            onPress={() =>
                              this.handlePasswwordVisibility("show")
                            }
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
                    {errors.confirmpass && touched.confirmpass ? (
                      <Text
                        style={{
                          fontSize: 10,
                          color: "#FD3464",
                          fontFamily: "ClarityCity-Regular",
                          marginLeft: 5,
                        }}
                      >
                        {errors.confirmpass}
                      </Text>
                    ) : null}
                  </View>
                </View>
                <Checkbox
                  label="By signing up, you agree to our Privacy Policy and Terms and Conditions. "
                  borderColor="#BC990A"
                  backgroundColor="#BC990A"
                  boxAction={() =>
                    this.setState({
                      ...this.state,
                      buttonActive: !this.state.buttonActive,
                    })
                  }
                />
                {loading ? (
                  <View style={styles.spin}>
                    <Circle size={24} color="#FFFFFF" />
                  </View>
                ) : (
                  <View style={{ marginBottom: 38 }}>
                    <PrimaryButton
                      text="Sign Up"
                      onPress={handleSubmit}
                      buttonActive={this.state.buttonActive}
                    />
                  </View>
                )}
              </View>
            )}
          </Formik>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                color: "#141414",
                fontSize: 16,
                fontFamily: "ClarityCity-Regular",
              }}
            >
              {" "}
              Already a member?
            </Text>
            <Text
              onPress={this.logIn}
              style={{
                color: "#BC990A",
                fontSize: 16,
                fontFamily: "ClarityCity-Regular",
              }}
            >
              {" "}
              Log in here.
            </Text>
          </View>
        </View>
      </ScrollView>
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
  register: {
    fontSize: 16,
    fontFamily: "ClarityCity-Bold",
    paddingTop: 19,
  },
  mainbox: {
    marginTop: 25,
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
});

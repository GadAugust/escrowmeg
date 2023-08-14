import React, { Component } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import PrimaryButton from "../../components/PrimaryButton";
import { Circle } from "react-native-animated-spinkit";
import AuthApi from "../../api/settings";
import { Formik } from "formik";
import Toast from "react-native-root-toast";
import frontStorage from "../../utilities/storage";
import routes from "../../navigation/routes";
import { Ionicons } from "@expo/vector-icons";
import * as yup from "yup";
import lightTheme from "../../config/lightmodecolors";
import darkTheme from "../../config/darkmodecolors";
import { StatusBar } from "expo-status-bar";
import TopBar from "../../components/TopBar";

const passwordChangeValidationSchema = yup.object().shape({
  currPassword: yup.string().required().min(8).label("Current Password"),
  password: yup.string().required().min(8).label("Password"),
  confirmPassword: yup
    .string()
    .required()
    .label("Confirm password")
    .oneOf([yup.ref("password"), null], "Password does not match"),
});

export default class ChangePassword extends Component {
  constructor(props) {
    super(props),
      (this.state = {
        loading: false,
        theme: "dark",
        currentPasswordSecure: true,
        newPasswordSecure: true,
        confirmPasswordSecure: true,
      });
  }
  async componentDidMount() {
    const getTheme = await frontStorage.asyncGet("mode");
    let currentTheme = getTheme ? JSON.parse(getTheme) : this.state.theme;
    this.setState({ ...this.state, theme: currentTheme });
  }
  passwordVisibility = (status) => {
    status == "show"
      ? this.setState({ ...this.state, currentPasswordSecure: false })
      : this.setState({ ...this.state, currentPasswordSecure: true });
  };
  newPasswordVisibility = (status) => {
    status == "show"
      ? this.setState({ ...this.state, newPasswordSecure: false })
      : this.setState({ ...this.state, newPasswordSecure: true });
  };
  confirmPasswordVisibility = (status) => {
    status == "show"
      ? this.setState({ ...this.state, confirmPasswordSecure: false })
      : this.setState({ ...this.state, confirmPasswordSecure: true });
  };
  onChangePassword = async (values) => {
    this.setState({ ...this.state, loading: true });
    const getData = await frontStorage.asyncGet("userData");
    let data = JSON.parse(getData);
    if (values.password.trim() == values.confirmPassword.trim()) {
      if (values.password != "" && values.currPassword != "") {
        let user_id = data.id;
        let old_password = values.currPassword.trim();
        let new_password = values.password.trim();

        const response = await AuthApi.changePassword({
          user_id,
          old_password,
          new_password,
        });
        // console.log(response);
        if (response.status == 406) {
          this.setState({ ...this.state, loading: false });
          Toast.show(response.data.message, {
            duration: Toast.durations.LONG,
          });
        } else if (response.status == 201) {
          this.textPassword.clear();
          this.textnewPassword.clear();
          this.textconfirmPassword.clear();
          this.setState({ ...this.state, loading: false });
          Toast.show("Successful", {
            duration: Toast.durations.LONG,
          });
        } else {
          this.setState({ ...this.state, loading: false });
          Toast.show(response.data.message, {
            duration: Toast.durations.LONG,
          });
        }
      } else {
        this.setState({ ...this.state, loading: false });
        Toast.show("All inputs are required", {
          duration: Toast.durations.LONG,
        });
      }
    } else {
      this.setState({ ...this.state, loading: false });
      Toast.show("Password does not match", { duration: Toast.durations.LONG });
    }
  };

  render() {
    const {
      theme,
      confirmPasswordSecure,
      newPasswordSecure,
      currentPasswordSecure,
    } = this.state;
    return (
      <View
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
          headerText="Change Password"
        />

        <Formik
          initialValues={{
            currPassword: "",
            password: "",
            confirmPassword: "",
          }}
          onSubmit={(values) => this.onChangePassword(values)}
          validationSchema={passwordChangeValidationSchema}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <View style={{ marginTop: 40 }}>
              <View style={styles.mainbox}>
                <View style={{ marginBottom: 25 }}>
                  <View style={styles.boxfield}>
                    <View style={{ width: "90%" }}>
                      <Text style={styles.labelfield}>Current Password</Text>
                      <TextInput
                        style={styles.inputfield}
                        onChangeText={handleChange("currPassword")}
                        onBlur={handleBlur("currPassword")}
                        value={values.currPassword}
                        ref={(input) => {
                          this.textPassword = input;
                        }}
                        secureTextEntry={currentPasswordSecure}
                      />
                    </View>
                    {currentPasswordSecure ? (
                      <TouchableOpacity
                        onPress={() => this.passwordVisibility("show")}
                      >
                        <Ionicons name="ios-eye" size={20} color="#F5F5F5" />
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        onPress={() => this.passwordVisibility("hide")}
                      >
                        <Ionicons
                          name="ios-eye-off"
                          size={20}
                          color="#F5F5F5"
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                  {errors.currPassword && touched.currPassword ? (
                    <Text
                      style={{
                        fontSize: 10,
                        color: "#FD3464",
                        fontWeight: "400",
                        marginLeft: 5,
                      }}
                    >
                      {errors.currPassword}
                    </Text>
                  ) : null}
                </View>
                <View style={{ marginBottom: 25 }}>
                  <View style={styles.boxfield}>
                    <View style={{ width: "90%" }}>
                      <Text style={styles.labelfield}>New Password</Text>
                      <TextInput
                        style={styles.inputfield}
                        onChangeText={handleChange("password")}
                        onBlur={handleBlur("password")}
                        value={values.password}
                        ref={(input) => {
                          this.textnewPassword = input;
                        }}
                        secureTextEntry={newPasswordSecure}
                      />
                    </View>
                    {newPasswordSecure ? (
                      <TouchableOpacity
                        onPress={() => this.newPasswordVisibility("show")}
                      >
                        <Ionicons name="ios-eye" size={20} color="#F5F5F5" />
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        onPress={() => this.newPasswordVisibility("hide")}
                      >
                        <Ionicons
                          name="ios-eye-off"
                          size={20}
                          color="#F5F5F5"
                        />
                      </TouchableOpacity>
                    )}
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
                    <View style={{ width: "90%" }}>
                      <Text style={styles.labelfield}>
                        Confirm New Password
                      </Text>
                      <TextInput
                        style={styles.inputfield}
                        onChangeText={handleChange("confirmPassword")}
                        onBlur={handleBlur("confirmPassword")}
                        value={values.confirmPassword}
                        ref={(input) => {
                          this.textconfirmPassword = input;
                        }}
                        secureTextEntry={confirmPasswordSecure}
                      />
                    </View>
                    {confirmPasswordSecure ? (
                      <TouchableOpacity
                        onPress={() => this.confirmPasswordVisibility("show")}
                      >
                        <Ionicons name="ios-eye" size={20} color="#F5F5F5" />
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        onPress={() => this.confirmPasswordVisibility("hide")}
                      >
                        <Ionicons
                          name="ios-eye-off"
                          size={20}
                          color="#F5F5F5"
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                  {errors.confirmPassword && touched.confirmPassword ? (
                    <Text
                      style={{
                        fontSize: 10,
                        color: "#FD3464",
                        fontWeight: "400",
                        marginLeft: 5,
                      }}
                    >
                      {errors.confirmPassword}
                    </Text>
                  ) : null}
                </View>
              </View>
              {this.state.loading ? (
                <View style={styles.spin}>
                  <Circle size={24} color="#F5F5F5" />
                </View>
              ) : (
                <PrimaryButton text="Save" onPress={handleSubmit} />
              )}
            </View>
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
    paddingVertical: 60,
  },

  boxfield: {
    backgroundColor: "#4A4A4A",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingTop: 6,
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
  spin: {
    backgroundColor: "#3A4D8F",
    borderRadius: 10,
    paddingTop: 9,
    height: 45,
    alignItems: "center",
    marginTop: 6,
  },
  password: {
    fontSize: 16,
    fontFamily: "ClarityCity-Bold",
    textAlign: "center",
    marginBottom: 20,
  },
});

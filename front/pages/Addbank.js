import React, { Component } from "react";
import { View, StyleSheet, TextInput, Text, Image } from "react-native";
import routes from "../navigation/routes";
import { Circle } from "react-native-animated-spinkit";
import { Formik } from "formik";
import AuthApi from "../api/auth";
import Toast from "react-native-root-toast";
import darkTheme from "../config/darkmodecolors";
import lightTheme from "../config/lightmodecolors";
import frontStorage from "../utilities/storage";
import { StatusBar } from "expo-status-bar";

export default class AddBankScreen extends Component {
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

  transactionpinScreen = () => {
    this.props.navigation.navigate(routes.TRANSACTIONPIN);
  };

  handleAccountDetails = async (values) => {
    if (values.account_name != "" && values.bank_name != "") {
      if (values.account_number > 0) {
        this.setState({ ...this.state, loading: true });
        const getData = await frontStorage.asyncGet("userData");
        let data = JSON.parse(getData);
        let account_name = values.account_name.trim();
        let account_number = values.account_number.trim();
        let bank_name = values.bank_name.trim();
        let userId = data.id;
        const response = await AuthApi.addAccountDetails({
          account_name,
          bank_name,
          account_number,
          userId,
        });
        let newResponse = response.data;
        // console.log(response)
        if (
          newResponse.message == "User with this account number already exists"
        ) {
          Toast.show(newResponse.message, { duration: Toast.durations.LONG });
        } else if (response.status == 202) {
          Toast.show(newResponse.message, { duration: Toast.durations.LONG });
          this.transactionpinScreen();
          this.setState({ ...this.state, loading: false });
        } else {
          this.setState({ ...this.state, loading: false });
        }
      } else {
        Toast.show("Invalid account number", {
          duration: Toast.durations.LONG,
        });
      }
    } else {
      Toast.show("One or more input(s) missing", {
        duration: Toast.durations.LONG,
      });
    }
  };

  render() {
    const { theme } = this.state;
    return (
      <Formik
        initialValues={{ account_name: "", bank_name: "", account_number: "" }}
        onSubmit={(values) => this.handleAccountDetails(values)}
      >
        {({ handleChange, handleBlur, handleSubmit, values }) => (
          <View
            style={[
              styles.container,
              {
                backgroundColor:
                  theme == "dark" ? darkTheme.dark : lightTheme.dark,
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
            <Text style={styles.text}>Add bank account</Text>
            <View style={styles.mainbox}>
              <View style={styles.boxfield}>
                <Text style={styles.labelfield}>Account Name</Text>
                <TextInput
                  style={styles.inputfield}
                  onChangeText={handleChange("account_name")}
                  onBlur={handleBlur("account_name")}
                  value={values.account_name}
                />
              </View>
              <View style={styles.boxfield}>
                <Text style={styles.labelfield}>Bank Name</Text>
                <TextInput
                  style={styles.inputfield}
                  onChangeText={handleChange("bank_name")}
                  onBlur={handleBlur("bank_name")}
                  value={values.bank_name}
                />
              </View>
              <View style={styles.boxfield}>
                <Text style={styles.labelfield}>Account Number</Text>
                <TextInput
                  style={styles.inputfield}
                  keyboardType="numeric"
                  onChangeText={handleChange("account_number")}
                  onBlur={handleBlur("account_number")}
                  value={values.account_number}
                />
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingTop: 150,
                marginHorizontal: 30,
              }}
            >
              <Text onPress={this.transactionpinScreen} style={styles.text3}>
                SKIP
              </Text>
              {this.state.loading ? (
                <Circle size={18} color="#6280E8" />
              ) : (
                <Text onPress={handleSubmit} style={styles.text3}>
                  NEXT
                </Text>
              )}
            </View>
          </View>
        )}
      </Formik>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 60,
    paddingBottom: 30,
  },
  text: {
    color: "#6280E8",
    fontSize: 16,
    fontFamily: "ClarityCity-Bold",
    paddingTop: 40,
    textAlign: "center",
  },
  mainbox: {
    marginTop: 30,
  },

  boxfield: {
    backgroundColor: "#4A4A4A",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingTop: 6,
    height: 45,
    marginBottom: 30,
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
    fontWeight: "700",
  },
  text3: {
    color: "#6280E8",
    fontSize: 16,
    fontFamily: "ClarityCity-Bold",
  },
});

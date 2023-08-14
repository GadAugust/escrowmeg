import React, { Component } from "react";
import { StyleSheet, View, Image } from "react-native";
import FourDigitsCode from "../components/Fourdigitscode";
import routes from "../navigation/routes";
import AuthApi from "../api/auth";
import frontStorage from "../utilities/storage";
import Toast from "react-native-root-toast";
import darkTheme from "../config/darkmodecolors";
import lightTheme from "../config/lightmodecolors";
import { StatusBar } from "expo-status-bar";

export default class TransactionpinScreen extends Component {
  constructor(props) {
    super(props),
      (this.state = {
        loading: false,
        theme: "dark",
      });
  }

  async componentDidMount() {
    const getTheme = await frontStorage.asyncGet("mode");
    let currentTheme = getTheme ? JSON.parse(getTheme) : this.state.theme;
    this.setState({ ...this.state, theme: currentTheme });
  }

  verifyPin = async (pins) => {
    this.setState({ ...this.state, loading: true });
    console.log(pins);
    if (pins.length == 4) {
      const getData = await frontStorage.asyncGet("userData");
      let data = JSON.parse(getData);
      let user_id = data.id;
      let email = data.email;
      let pin = pins;

      const response = AuthApi.transactionPin({ user_id, email, pin });
      let newResponse = (await response).data;
      console.log(newResponse);
      if (newResponse.status == 201) {
        Toast.show(newResponse.message, { duration: Toast.durations.LONG });
        this.nextScreen();
      } else {
        Toast.show("An error occured", { duration: Toast.durations.LONG });
        this.setState({ ...this.state, loading: false });
      }
    } else {
      Toast.show("Invalid Pin", { duration: Toast.durations.LONG });
      this.setState({ ...this.state, loading: false });
    }
  };

  nextScreen = () => {
    this.props.navigation.navigate(routes.MAINPAGE);
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
        <StatusBar style="light" animated={true} backgroundColor="#141414" />
        <Image
          style={{ alignSelf: "center" }}
          source={require("../assets/escrobyteslogo.png")}
        />
        <FourDigitsCode
          text="Set Transaction Pin"
          text2="DONE"
          verifyPin={this.verifyPin}
          loading={this.state.loading}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 60,
  },
});

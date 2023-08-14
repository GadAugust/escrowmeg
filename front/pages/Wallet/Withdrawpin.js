import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity, Image } from "react-native";
import FourDigitsCode from "../../components/Fourdigitscode";
import routes from "../../navigation/routes";
import AuthApi from "../../api/wallet";
import frontStorage from "../../utilities/storage";
import Toast from "react-native-root-toast";
import { Ionicons } from "@expo/vector-icons";
import lightTheme from "../../config/lightmodecolors";
import darkTheme from "../../config/darkmodecolors";
import { StatusBar } from "expo-status-bar";

export default class WithdrawPinScreen extends Component {
  constructor(props) {
    super(props),
      (this.state = {
        loading: false,
      });
  }

  backScreen = () => {
    this.props.navigation.navigate(routes.WALLETWITHDRAW);
  };

  verifyPin = async (pins) => {
    this.setState({ ...this.state, loading: true });
    console.log(pins);
    if (pins.length == 4) {
      const getData = await frontStorage.asyncGet("userData");
      let data = JSON.parse(getData);
      let user_id = data.id;
      let amount = this.props.route.params.amount;
      let bank_id = this.props.route.params.bank_id;
      let payment_ref = this.props.route.params.payment_ref;
      let transaction_type = this.props.route.params.transaction_type;
      let pin = pins;

      const response = await AuthApi.withdrawMoney({
        user_id,
        amount,
        bank_id,
        transaction_type,
        payment_ref,
        pin,
      });
      let newResponse = response.data;
      console.log(newResponse);
      if (response.status == 202) {
        // console.log(newResponse.data)
        let newAmount = newResponse.data;
        const getData = await frontStorage.asyncGet("userData");
        let userData = JSON.parse(getData);
        frontStorage.asyncStore(
          "userData",
          JSON.stringify({ ...userData, wallet: newAmount })
        );
        this.props.navigation.navigate(routes.MAINPAGE);
        Toast.show(newResponse.message, { duration: Toast.durations.LONG });
        pins = " ";
        this.setState({ ...this.state, loading: false });
      } else {
        Toast.show(newResponse.message, { duration: Toast.durations.LONG });
        pins = " ";
        this.setState({ ...this.state, loading: false });
      }
    } else {
      Toast.show("Invalid Pin", { duration: Toast.durations.LONG });
      this.setState({ ...this.state, loading: false });
    }
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
        <TouchableOpacity onPress={this.backScreen}>
          <Ionicons name="chevron-back-outline" size={30} color="#3A4D8F" />
        </TouchableOpacity>
        <FourDigitsCode
          text="Insert your pin"
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
    paddingTop: 60,
    paddingBottom: 30,
  },
});

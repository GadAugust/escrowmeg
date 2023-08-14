import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Circle } from "react-native-animated-spinkit";
import routes from "../../navigation/routes";
import PrimaryButton from "../../components/PrimaryButton";
import Toast from "react-native-root-toast";
import { Ionicons } from "@expo/vector-icons";
import lightTheme from "../../config/lightmodecolors";
import darkTheme from "../../config/darkmodecolors";
import frontStorage from "../../utilities/storage";
import static_variable from "../../constants/static_variable";
import { StatusBar } from "expo-status-bar";
import TopBar from "../../components/TopBar";

export default class WalletWithdrawScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      amount: 0,
      paymentData: {},
      theme: "dark",
    };
  }
  async componentDidMount() {
    console.log(static_variable.selectedAccount);
    const getTheme = await frontStorage.asyncGet("mode");
    let currentTheme = getTheme ? JSON.parse(getTheme) : this.state.theme;

    this.setState({
      ...this.state,
      theme: currentTheme,
    });
  }

  backScreen = () => {
    this.props.navigation.navigate(routes.ALLACCOUNTS);
  };

  setAmount = (amount) => {
    this.setState({ ...this.state, amount });
  };

  withdrawMoney = async () => {
    let amount = this.state.amount;
    if (amount > 0) {
      this.setState({ ...this.state, loading: true });
      const getData = await frontStorage.asyncGet("userData");
      let userData = JSON.parse(getData);
      let bank_id = static_variable.selectedAccount.account_number;
      let user_id = userData.id;
      let transaction_type = "Debit";
      let payment_ref = "eskrobytes" + user_id + amount + "2023";
      this.setState({
        ...this.state,
        paymentData: {
          amount,
          transaction_type,
          bank_id,
          payment_ref,
        },
      });

      // console.log(amount, bank_id, user_id, payment_ref, transaction_type);

      let walletBalance = userData.wallet;
      if (amount <= walletBalance) {
        this.props.navigation.navigate(
          routes.WITHDRAWPIN,
          this.state.paymentData
        );
        this.setState({ ...this.state, loading: false });
      } else if (amount > walletBalance) {
        Toast.show("Insufficient Balance", { duration: Toast.durations.LONG });
        this.setState({ ...this.state, loading: false });
      }
    } else {
      Toast.show("Invalid amount", { duration: Toast.durations.LONG });
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
          headerText="Withdrawal"
          useBack={true}
          backFunc={this.backScreen}
        />
        <View style={styles.mainbox}>
          <View style={styles.boxfield}>
            <Text style={styles.labelfield}>
              {static_variable.selectedAccount.account_name}
            </Text>
            <Image source={require("../../assets/padlock.png")} />
          </View>
          <View style={styles.boxfield}>
            <Text style={styles.labelfield}>
              {static_variable.selectedAccount.bank_name}
            </Text>
            <Image source={require("../../assets/padlock.png")} />
          </View>
          <View style={styles.boxfield}>
            <Text style={styles.labelfield}>
              {static_variable.selectedAccount.account_number}
            </Text>
            <Image source={require("../../assets/padlock.png")} />
          </View>
        </View>

        <View>
          <Text
            style={[
              styles.text0,
              {
                color: theme == "dark" ? darkTheme.primary : lightTheme.primary,
              },
            ]}
          >
            Amount
          </Text>
          <View
            style={{
              marginTop: 40,
              marginBottom: 60,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={[
                styles.dollar,
                {
                  color:
                    theme == "dark" ? darkTheme.primary : lightTheme.primary,
                },
              ]}
            >
              $
            </Text>
            <TextInput
              style={[
                styles.inputfield,
                {
                  color:
                    theme == "dark" ? darkTheme.primary : lightTheme.primary,
                },
              ]}
              autoFocus
              onChangeText={(amount) => this.setAmount(amount)}
              keyboardType="numeric"
            />
          </View>
          {this.state.loading ? (
            <View style={styles.spin}>
              <Circle size={24} color="#F5F5F5" />
            </View>
          ) : (
            <PrimaryButton text="Withdraw" onPress={this.withdrawMoney} />
          )}
        </View>
      </View>
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
  mainbox: {
    marginTop: 30,
  },

  boxfield: {
    backgroundColor: "#4A4A4A",
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 45,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  labelfield: {
    color: "#F5F5F5",
    fontSize: 14,
    fontFamily: "ClarityCity-Bold",
  },
  inputfield: {
    fontSize: 30,
    height: 40,
    fontFamily: "ClarityCity-Bold",
  },
  text0: {
    fontSize: 16,
    fontFamily: "ClarityCity-Bold",
    textAlign: "center",
    marginTop: 30,
  },
  dollar: {
    fontSize: 30,
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

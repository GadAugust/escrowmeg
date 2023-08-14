import React, { Component } from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Image,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { Circle } from "react-native-animated-spinkit";
import { FlatList } from "react-native";
import TransactionHistory from "./TransactionHistory";
import frontStorage from "../../utilities/storage";
import Nodata from "../../components/Nodata";
import myFonts from "../../config/fontfamily";
import * as Font from "expo-font";
import lightTheme from "../../config/lightmodecolors";
import darkTheme from "../../config/darkmodecolors";
import routes from "../../navigation/routes";
import AuthApi from "../../api/wallet";
import { FontAwesome } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import TopBar from "../../components/TopBar";

export default class WalletScreen extends Component {
  constructor(props) {
    super(props),
      (this.state = {
        loading: true,
        wallet: 0,
        hideBalance: false,
        showBalance: true,
        transactionDetails: [],
        refreshing: false,
        fontsLoaded: false,
        theme: "dark",
      });
  }

  async componentDidMount() {
    const getTheme = await frontStorage.asyncGet("mode");
    let currentTheme = getTheme ? JSON.parse(getTheme) : this.state.theme;

    this.getData();
    await Font.loadAsync(myFonts);
    this.setState({
      ...this.state,
      fontsLoaded: true,
      theme: currentTheme,
    });
  }

  getData = async (type = null) => {
    const getData = await frontStorage.asyncGet("userData");
    let userData = JSON.parse(getData);
    // console.log("Response Here >>", userData);
    let walletBalance = userData.wallet;
    let user_id = userData.id;
    const response = await AuthApi.transactionHistory({ user_id });
    console.log("Response Here >>>>>", response.data);
    response.data == null
      ? this.setState({
          ...this.state,
          wallet: response.data.data.balance.wallet,
          transactionDetails: [],
          loading: false,
          refreshing: false,
        })
      : this.setState({
          ...this.state,
          wallet: response.data.data.balance.wallet,
          transactionDetails: response.data.data.result,
          loading: false,
          refreshing: false,
        });
    // console.log(this.state.transactionDetails)
  };

  showDetails = (id) => {
    let allDetails = this.state.transactionDetails;
    let eachDetails = allDetails.find((detail) => detail.id == id);
    // console.log(eachDetails);
    this.props.navigation.navigate(routes.TRANSACTIONDETAILS, eachDetails);
  };

  addMoney = () => {
    this.props.navigation.navigate(routes.ADDMONEY);
  };

  withdrawMoney = () => {
    this.props.navigation.navigate(routes.ALLACCOUNTS);
  };

  onRefresh = () => {
    this.setState({
      ...this.state,
      refreshing: true,
      loading: true,
      transactionDetails: [],
      wallet: 0,
      hideBalance: false,
      showBalance: true,
    });
    this.getData("refresh");
  };

  render() {
    const { theme } = this.state;
    if (!this.state.fontsLoaded) {
      return null;
    }

    const renderItem = ({ item }) => (
      <TransactionHistory
        amount={item.amount}
        type={item.transaction_type}
        date={item.updatedAt}
        onPress={() => this.showDetails(item.id)}
      />
    );
    const getHeader = () => {
      return (
        <>
          <View style={{ borderRadius: 20, overflow: "hidden", marginTop: 30 }}>
            <View style={{ marginTop: 45, marginHorizontal: 15 }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text
                  style={[
                    styles.text1,
                    {
                      color: "#141414",
                    },
                  ]}
                >
                  Balance
                </Text>
                {this.state.showBalance ? (
                  <TouchableOpacity
                    onPress={() =>
                      this.setState({
                        ...this.state,
                        hideBalance: true,
                        showBalance: false,
                      })
                    }
                  >
                    <Image
                      style={{ marginLeft: 15, height: 20, width: 20 }}
                      source={require("../../assets/Blind.png")}
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() =>
                      this.setState({
                        ...this.state,
                        hideBalance: false,
                        showBalance: true,
                      })
                    }
                  >
                    <Image
                      style={{ marginLeft: 15, height: 14, width: 22 }}
                      source={require("../../assets/Open.png")}
                    />
                  </TouchableOpacity>
                )}
              </View>
              {this.state.showBalance ? (
                <Text
                  style={{
                    fontSize: 32,
                    color: "#141414",
                    fontFamily: "ClarityCity-Bold",
                  }}
                >
                  ${this.state.wallet}
                </Text>
              ) : (
                <Text
                  style={{
                    fontSize: 32,
                    color: "#141414",
                    fontFamily: "ClarityCity-Bold",
                  }}
                >
                  *****
                </Text>
              )}
              <View
                style={{
                  flexDirection: "row",
                  marginTop: 20,
                  justifyContent: "space-between",
                }}
              >
                <Text
                  onPress={this.addMoney}
                  style={[
                    styles.text1,
                    {
                      color: "#141414",
                    },
                  ]}
                >
                  Add Money
                </Text>
                <Text
                  onPress={this.withdrawMoney}
                  style={[
                    styles.text1,
                    {
                      color: "#141414",
                    },
                  ]}
                >
                  Withdraw
                </Text>
              </View>
            </View>
          </View>
          <Text
            style={{
              fontWeight: 400,
              fontSize: 16,
              textAlign: "center",
              marginVertical: 20,
              color: "#141414",

              fontFamily: "ClarityCity-Regular",
            }}
          >
            Transaction History
          </Text>
        </>
      );
    };

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
        {this.state.loading ? (
          <View style={styles.spin}>
            <Circle size={30} color="#BC990A" />
          </View>
        ) : (
          <View style={{ marginVertical: 60 }}>
            <TopBar
              openNavigation={() => this.props.navigation.toggleDrawer()}
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
              headerText="Your Wallet"
            />
            <FlatList
              data={this.state.transactionDetails}
              keyExtractor={(details) => details.id.toString()}
              renderItem={renderItem}
              ListHeaderComponent={getHeader}
              ListEmptyComponent={
                <View style={{ flex: 1, marginTop: "50%" }}>
                  <Nodata text="No Transaction History" />
                </View>
              }
              refreshControl={
                <RefreshControl
                  //refresh control used for pull to refresh
                  refreshing={this.state.refreshing}
                  onRefresh={this.onRefresh.bind(this)}
                />
              }
            />
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
  },
  image: {
    width: "100%",
    height: 164,
  },
  text1: {
    fontSize: 16,
    fontFamily: "ClarityCity-Regular",
    fontWeight: "700",
  },
  navicon: {
    marginBottom: 30,
  },

  spin: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

import React, { Component } from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import AuthApi from "../../api/listing";
import frontStorage from "../../utilities/storage";
import BidNavigator from "../../navigation/BidNavigator";
import myFonts from "../../config/fontfamily";
import * as Font from "expo-font";
import { FontAwesome } from "@expo/vector-icons";
import Loading from "../../components/Loading";
import lightTheme from "../../config/lightmodecolors";
import darkTheme from "../../config/darkmodecolors";
import { StatusBar } from "expo-status-bar";
import TopBar from "../../components/TopBar";

export default class OutgoingBids extends Component {
  constructor(props) {
    super(props),
      (this.state = {
        firstname: "",
        lastname: "",
        acceptedBids: null,
        declinedBids: null,
        pendingBids: null,
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

  onRefresh = () => {
    this.setState({
      ...this.state,
      firstname: "",
      lastname: "",
      acceptedBids: null,
      pendingBids: null,
      declinedBids: null,
      refreshing: true,
    });
    this.getData();
  };

  getData = async () => {
    const getData = await frontStorage.asyncGet("userData");
    let userData = JSON.parse(getData);
    let firstname = userData.first_name;
    let lastname = userData.last_name;
    let user_id = userData.id;
    const response = await AuthApi.fetchMyBids({ user_id });
    // console.log(response.data);
    if (response.data == null || response.data.data == undefined) {
      this.setState({
        ...this.state,
        firstname,
        lastname,
        acceptedBids: [],
        pendingBids: [],
        declinedBids: [],
        refreshing: false,
      });
    } else {
      let allBiddedFor = response.data.data;
      // console.log("all bids", allBiddedFor);
      let acceptedBids = allBiddedFor.filter(
        (accepted) => accepted.status == "accepted"
      );
      // console.log("accepted", acceptedBids);
      let declinedBids = allBiddedFor.filter(
        (awarded) => awarded.status == "awarded"
      );
      // console.log("awarded", declinedBids);
      let pendingBids = allBiddedFor.filter(
        (pending) => pending.status == "pending"
      );
      // console.log("pending", pendingBids);
      this.setState({
        ...this.state,
        firstname,
        lastname,
        acceptedBids,
        pendingBids,
        declinedBids,
        refreshing: false,
      });
    }
  };

  render() {
    const { theme } = this.state;
    if (this.state.fontsLoaded == false) {
      return <Loading />;
    }

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
          headerText="Outgoing Bids"
        />

        {this.state.acceptedBids != null ||
        this.state.declinedBids != null ||
        this.state.pendingBids != null ? (
          <BidNavigator
            acceptedBids={this.state.acceptedBids}
            declinedBids={this.state.declinedBids}
            pendingBids={this.state.pendingBids}
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh.bind(this)}
          />
        ) : (
          <Loading />
        )}
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
  profileimg: {
    height: 73,
    width: 73,
    borderRadius: 50,
    marginRight: 9,
  },
  text1: {
    fontSize: 14,
    fontFamily: "ClarityCity-Regular",
  },
  text2: {
    textTransform: "uppercase",
    fontSize: 16,
    lineHeight: 16,
    fontFamily: "ClarityCity-Bold",
  },
  line: {
    marginTop: 20,
    width: "100%",
  },
});

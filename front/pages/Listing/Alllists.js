import React, { Component } from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import ToptabsNavigator from "../../navigation/ToptabsNavigator";
import frontStorage from "../../utilities/storage";
import AuthApi from "../../api/listing";
import lightTheme from "../../config/lightmodecolors";
import darkTheme from "../../config/darkmodecolors";
import myFonts from "../../config/fontfamily";
import * as Font from "expo-font";
import routes from "../../navigation/routes";
import { FontAwesome } from "@expo/vector-icons";
import Loading from "../../components/Loading";
import { StatusBar } from "expo-status-bar";
import TopBar from "../../components/TopBar";

export default class AllListsScreen extends Component {
  constructor(props) {
    super(props),
      (this.state = {
        firstname: "",
        lastname: "",
        fontsLoaded: false,
        refreshing: false,
        sellerlisting: null,
        buyerlisting: null,
        theme: "dark",
      });
  }

  async componentDidMount() {
    const getTheme = await frontStorage.asyncGet("mode");
    let currentTheme = getTheme ? JSON.parse(getTheme) : this.state.theme;
    await Font.loadAsync(myFonts);
    this.setState({ ...this.state, fontsLoaded: true, theme: currentTheme });
    this.getData();
  }

  onRefresh = () => {
    this.setState({
      ...this.state,
      firstname: "",
      lastname: "",
      sellerlisting: null,
      buyerlisting: null,
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

    const response = await AuthApi.fetchListings({ user_id });
    if (response.data == null || response.data.data == undefined) {
      this.setState({
        ...this.state,
        firstname,
        lastname,
        refreshing: false,
        sellerlisting: [],
        buyerlisting: [],
      });
    } else {
      let allListings = response.data.data;
      let buyerlisting = allListings.filter((list) => list.role == "buyer");
      // console.log("buer", buyerlisting);
      let sellerlisting = allListings.filter((lists) => lists.role == "seller");
      // console.log("seller", sellerlisting);
      this.setState({
        ...this.state,
        firstname,
        lastname,
        refreshing: false,
        sellerlisting,
        buyerlisting,
      });
    }
  };

  listingdeScreen = () => {
    this.props.navigation.navigate(routes.LISTINGDETAILS);
  };

  render() {
    const { theme } = this.state;
    if (!this.state.fontsLoaded) {
      return <Loading />;
    }

    return (
      <View
        refreshing={this.state.refreshing}
        onRefresh={this.handleRefresh}
        style={[
          styles.container,
          {
            backgroundColor: lightTheme.dark,
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
          headerText="Listings"
        />
        {this.state.buyerlisting != null || this.state.sellerlisting != null ? (
          <ToptabsNavigator
            buyerlisting={this.state.buyerlisting}
            sellerlisting={this.state.sellerlisting}
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
    fontFamily: "ClarityCity-Regular",
  },
  text2: {
    textTransform: "uppercase",
    lineHeight: 16,
    fontSize: 16,
    fontFamily: "ClarityCity-Bold",
  },
  line: {
    marginTop: 25,
  },
});

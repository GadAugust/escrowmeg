import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import myFonts from "../../config/fontfamily";
import routes from "../../navigation/routes";
import { Feather, Ionicons } from "@expo/vector-icons";
import AuthApi from "../../api/listing";
import AllBids from "../../components/Allbids";
import lightTheme from "../../config/lightmodecolors";
import darkTheme from "../../config/darkmodecolors";
import Loading from "../../components/Loading";
import Toast from "react-native-root-toast";
import * as Font from "expo-font";
import frontStorage from "../../utilities/storage";
import { StatusBar } from "expo-status-bar";
import TopBar from "../../components/TopBar";

export default class ListDetailsScreen extends Component {
  constructor(props) {
    super(props),
      (this.state = {
        loading: true,
        listType: "",
        listID: "",
        date: "",
        time: "",
        status: null,
        listIdBids: null,
        wait: false,
        fontsLoaded: false,
        theme: "dark",
      });
  }
  async componentDidMount() {
    this.getData();
    const getTheme = await frontStorage.asyncGet("mode");
    let currentTheme = getTheme ? JSON.parse(getTheme) : this.state.theme;

    await Font.loadAsync(myFonts);
    this.setState({
      ...this.state,
      fontsLoaded: true,
      theme: currentTheme,
    });
  }

  acceptBid = async (item) => {
    this.setState({ ...this.state, wait: true });
    let seller_id = item.seller_id;
    let bid_id = item.id;
    let buyer_id = item.buyer_id;
    let bidder_id = item.bidder_id;
    let listing_id = item.listing_id;
    let role = this.props.route.params.role;
    // console.log(item, role);

    const response = await AuthApi.acceptBid({
      seller_id,
      bid_id,
      buyer_id,
      bidder_id,
      role,
      listing_id,
    });
    console.log(response);
    let newResponse = response.data;
    if (response.status == 200) {
      Toast.show(newResponse.message, { duration: Toast.durations.LONG });
      this.props.navigation.navigate(routes.MAINPAGE);
      this.setState({ ...this.state, wait: false, status: newResponse.status });
    } else {
      Toast.show(newResponse.message, { duration: Toast.durations.LONG });
      this.setState({ ...this.state, wait: false, status: newResponse.status });
    }
  };

  copyToClipboard = async () => {
    let listID = this.props.route.params.listing_id;
    console.log(listID);
    await Clipboard.setStringAsync(listID);
    Toast.show("List ID Copied", { duration: Toast.durations.LONG });
  };

  declineBid = async (item) => {
    // console.log(item);
    let seller_id = item.seller_id;
    let bid_id = item.id;
    let buyer_id = item.buyer_id;
    let listing_id = item.listing_id;
    let bidder_id = item.bidder_id;
    let role = this.props.route.params.role;
    const response = await AuthApi.declineBid({
      seller_id,
      bid_id,
      buyer_id,
      role,
      listing_id,
      bidder_id,
    });
    // console.log(response.data);
    let newResponse = response.data;
    if (response.status == 200) {
      this.setState({ ...this.state, wait: false, status: newResponse.status });
      Toast.show(newResponse.message, { duration: Toast.durations.LONG });
    } else {
      this.setState({ ...this.state, wait: false, status: newResponse.status });
      Toast.show(newResponse.message, { duration: Toast.durations.LONG });
    }
  };

  getData = async () => {
    let listing_id = this.props.route.params.listing_id;
    let listID = listing_id.substr(0, 12) + ".....";
    let myDate = this.props.route.params.createdAt;
    const date = myDate.split("T");
    let time = date[1].split(".");

    const response = await AuthApi.fetchListingBids({ listing_id });
    console.log("List bids", response.data);

    if (response.data == null) {
      this.setState({ ...this.state, listIdBids: [] });
    } else {
      let listIdBids = response.data.data;
      listIdBids.map((bid) =>
        this.setState({ ...this.state, status: bid.status })
      );
      this.setState({ ...this.state, listIdBids });
    }

    this.props.route.params.role == "seller"
      ? this.setState({
          ...this.state,
          listType: "Selling",
          listID,
          date: date[0],
          time: time[0],
          loading: false,
        })
      : this.setState({
          ...this.state,
          listType: "Buying",
          listID,
          date: date[0],
          time: time[0],
          loading: false,
        });
  };

  onShowDetails = (value) => {
    // console.log(value)
    let newValue = value.split("-");
    let toggle = newValue[0];
    let id = newValue[1];
    // console.log(id, toggle);
    let allBids = this.state.listIdBids;
    let oneBid = allBids.find((list) => list.id == id);
    // console.log(oneBid)
    let theBidIndex = allBids.findIndex((list) => list.id == id);
    // console.log(theBidIndex)
    toggle == "down"
      ? (oneBid.showDetails = true)
      : (oneBid.showDetails = false);
    allBids[theBidIndex] = oneBid;
    this.setState({ ...this.state, listIdBids: allBids });
  };

  render() {
    const { theme, fontsLoaded } = this.state;
    if (!fontsLoaded) {
      return null;
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
          headerText={this.state.listType}
          useBack={true}
          backFunc={() => this.props.navigation.navigate(routes.MAINPAGE)}
        />

        <View style={styles.eachList}>
          <Text
            style={[
              styles.listtext,
              {
                color: theme == "dark" ? darkTheme.primary : lightTheme.primary,
              },
            ]}
          >
            Product Name: {this.props.route.params.product}{" "}
          </Text>
          <Text
            style={[
              styles.listtext,
              {
                color: theme == "dark" ? darkTheme.primary : lightTheme.primary,
              },
            ]}
          >
            Price: ${this.props.route.params.amount}
          </Text>
          <View style={{ flexDirection: "row" }}>
            <Text
              style={[
                styles.listtext,
                {
                  color:
                    theme == "dark" ? darkTheme.primary : lightTheme.primary,
                },
              ]}
            >
              ListingID: {this.state.listID}
            </Text>
            {this.state.listID ? (
              <TouchableOpacity onPress={this.copyToClipboard}>
                <Feather
                  name="copy"
                  size={20}
                  color={
                    theme == "dark" ? darkTheme.primary : lightTheme.primary
                  }
                  style={{ marginLeft: 30 }}
                />
              </TouchableOpacity>
            ) : null}
          </View>
          <Text
            style={[
              styles.listtext,
              {
                color: theme == "dark" ? darkTheme.primary : lightTheme.primary,
              },
            ]}
          >
            Date: {this.state.date}
          </Text>
          <Text
            style={[
              styles.listtext,
              {
                color: theme == "dark" ? darkTheme.primary : lightTheme.primary,
              },
            ]}
          >
            Time: {this.state.time}
          </Text>
        </View>
        <Image style={styles.line} source={require("../../assets/line.jpg")} />
        {this.state.loading ? (
          <Loading />
        ) : (
          <>
            {this.state.listIdBids.length == 0 ? (
              <View
                style={{
                  flex: 1,
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 50,
                }}
              >
                <Image source={require("../../assets/nobid.png")} />
                <Text style={styles.bid}>No bid yet</Text>
              </View>
            ) : (
              <View style={styles.allBids}>
                <FlatList
                  data={this.state.listIdBids}
                  keyExtractor={(bid) => bid.id.toString()}
                  renderItem={({ item }) => (
                    <AllBids
                      name={item.user.first_name}
                      pitch={item.pitch}
                      date={item.createdAt}
                      itemId={item.id}
                      itemDetails={item.showDetails}
                      status={this.state.status}
                      onShow={this.onShowDetails}
                      acceptBid={() => this.acceptBid(item)}
                      declineBid={() => this.declineBid(item)}
                      wait={this.state.wait}
                    />
                  )}
                />
              </View>
            )}
          </>
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
  line: {
    marginTop: 30,
    width: "100%",
  },
  bid: {
    color: "#4A4A4A",
    fontSize: 16,
    fontWeight: "700",
  },
  eachList: {
    marginTop: 30,
  },
  listtext: {
    fontSize: 16,

    fontFamily: "ClarityCity-Regular",
    lineHeight: 24,
  },
  allBids: {
    flex: 1,
    marginTop: 7,
  },
});

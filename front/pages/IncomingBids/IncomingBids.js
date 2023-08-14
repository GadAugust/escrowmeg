import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
  RefreshControl,
} from "react-native";
import frontStorage from "../../utilities/storage";
import AuthApi from "../../api/listing";
import Loading from "../../components/Loading";
import lightTheme from "../../config/lightmodecolors";
import darkTheme from "../../config/darkmodecolors";
import { StatusBar } from "expo-status-bar";
import TopBar from "../../components/TopBar";
import { fetchListingsWithBids } from "../../api/api_calls/listing";
import AllBids from "../../components/Allbids";
import Toast from "react-native-root-toast";
import Nodata from "../../components/Nodata";

export default class IncomingBids extends Component {
  constructor(props) {
    super(props),
      (this.state = {
        loading: true,
        listType: "",
        listID: "",
        date: "",
        time: "",
        listIdBids: [],
        wait: false,
        fontsLoaded: false,
        theme: "dark",
      });
  }

  async componentDidMount() {
    this.getData();
    const getTheme = await frontStorage.asyncGet("mode");
    let currentTheme = getTheme ? JSON.parse(getTheme) : this.state.theme;
    this.setState({
      ...this.state,
      theme: currentTheme,
      loading: true,
    });
  }

  acceptBid = async (item) => {
    this.setState({ ...this.state, wait: true });
    let seller_id = item.seller_id;
    let bid_id = item.id;
    let buyer_id = item.buyer_id;
    let bidder_id = item.bidder_id;
    let listing_id = item.listing_id;
    let role = item.role;
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
      this.getData();
    } else {
      Toast.show(newResponse.message, { duration: Toast.durations.LONG });
      this.getData();
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
    let role = item.role;
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
      Toast.show(newResponse.message, { duration: Toast.durations.LONG });
      this.getData();
    } else {
      Toast.show(newResponse.message, { duration: Toast.durations.LONG });
      this.getData();
    }
  };

  getData = async () => {
    const getData = await frontStorage.asyncGet("userData");
    const userData = JSON.parse(getData);
    const user_id = userData.id;
    const listIdBids = await fetchListingsWithBids({ user_id });
    console.log("Complete listing", listIdBids);
    if (listIdBids.length > 0) {
      listIdBids.map((list, index) => {
        if (list.buyer_id == user_id) {
          list.role = "buyer";
        }

        if (list.seller_id == user_id) {
          list.role = "seller";
        }

        if (listIdBids.length - 1 == index) {
          this.setState({ ...this.state, listIdBids, loading: false });
        }
      });
    } else {
      this.setState({ ...this.state, listIdBids: [], loading: false });
    }
  };

  onShowDetails = (value) => {
    // console.log(value);
    let newValue = value.split("-");
    let toggle = newValue[0];
    let id = newValue[1];
    // console.log(id, toggle);
    let allBids = this.state.listIdBids;
    let oneBid = allBids.find((list) => list.id == id);
    console.log(oneBid);
    let theBidIndex = allBids.findIndex((list) => list.id == id);
    // console.log(theBidIndex)
    toggle == "down"
      ? (oneBid.showDetails = true)
      : (oneBid.showDetails = false);
    allBids[theBidIndex] = oneBid;
    this.setState({ ...this.state, listIdBids: allBids });
  };

  onRefresh = () => {
    this.setState({
      ...this.state,
      loading: true,
      listType: "",
      listID: "",
      date: "",
      time: "",
      listIdBids: [],
      wait: false,
    });
    this.getData();
  };

  render() {
    const { theme, editable } = this.state;
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
          headerText="Incoming Bids"
        />

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
                  ListEmptyComponent={
                    <View style={{ flex: 1, marginTop: "70%" }}>
                      <Nodata text="Ni bids yet" />
                    </View>
                  }
                  renderItem={({ item }) => (
                    <AllBids
                      name={item.user.first_name}
                      pitch={item.pitch}
                      date={item.createdAt}
                      itemId={item.id}
                      itemDetails={item.showDetails}
                      status={item.status}
                      onShow={this.onShowDetails}
                      acceptBid={() => this.acceptBid(item)}
                      declineBid={() => this.declineBid(item)}
                      wait={this.state.wait}
                    />
                  )}
                  refreshControl={
                    <RefreshControl
                      refreshing={this.state.refreshing}
                      onRefresh={this.onRefresh.bind(this)}
                    />
                  }
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
    paddingBottom: 40,
  },
  line: {
    marginTop: 30,
    width: "100%",
  },

  eachList: {
    marginTop: 30,
  },
  listtext: {
    fontSize: 16,
    fontFamily: "ClarityCity-Regular",

    marginVertical: 5,
  },
  pitchView: {
    width: "100%",
    height: 135,
    borderRadius: 10,
    borderStyle: "solid",
    borderColor: "#4A4A4A",
    borderWidth: 1,
    marginVertical: 20,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  spin: {
    backgroundColor: "#3A4D8F",
    borderRadius: 10,
    paddingTop: 9,
    height: 45,
    alignItems: "center",
    marginTop: 6,
  },

  bid: {
    color: "#4A4A4A",
    fontSize: 16,
    fontWeight: "700",
  },
  listtext: {
    fontSize: 16,

    fontFamily: "ClarityCity-Regular",
    lineHeight: 24,
  },
  allBids: {
    flex: 1,
    marginTop: 20,
  },
});

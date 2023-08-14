import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  FlatList,
} from "react-native";
import routes from "../../navigation/routes";
import AuthApi from "../../api/listing";
import Nodata from "../../components/Nodata";
import Loading from "../../components/Loading";
import ListResult from "../../components/Listresult";
import { EvilIcons, Ionicons } from "@expo/vector-icons";
import lightTheme from "../../config/lightmodecolors";
import darkTheme from "../../config/darkmodecolors";
import frontStorage from "../../utilities/storage";
import { StatusBar } from "expo-status-bar";

export default class SearchResultScreen extends Component {
  constructor(props) {
    super(props),
      (this.state = {
        loader: false,
        loading: false,
        listDetails: [],
        date: "",
        listID: "",
        startSearch: true,
        theme: "dark",
        userId: "",
        buttonActive: false,
      });
  }

  async componentDidMount() {
    if (this.props.route.params != undefined) {
      this.searhAuto();
    }
    const getData = await frontStorage.asyncGet("userData");
    let userData = JSON.parse(getData);
    let bidder_id = userData.id;
    const getTheme = await frontStorage.asyncGet("mode");
    let currentTheme = getTheme ? JSON.parse(getTheme) : this.state.theme;
    this.setState({
      ...this.state,
      theme: currentTheme,
      userId: bidder_id,
    });
  }

  searhAuto = async () => {
    this.setState({
      ...this.state,
      loader: true,
      startSearch: false,
      listID: this.props.route.params.listID,
    });
    let listing_id = this.props.route.params.listID;
    // console.log(listing_id);

    const response = await AuthApi.searchListings({ listing_id });
    if (response.status == 200) {
      this.setState({
        ...this.state,
        listDetails: response.data.data,
        loader: false,
      });
      // console.log(response.data);
    } else if (response.status == 204) {
      this.setState({
        ...this.state,
        listDetails: response.data,
        loader: false,
      });
    }
  };

  backToMainPage = () => {
    this.props.navigation.navigate(routes.MAINPAGE);
  };

  bidDetails = (id) => {
    let listDetails = this.state.listDetails;
    let theList = listDetails.find((list) => list.id == id);
    // console.log(theList);
    this.props.navigation.navigate(routes.BIDSCREEN, theList);
  };

  onKeyUp = async (listing_id) => {
    this.setState({ ...this.state, loader: true, startSearch: false });
    // console.log(listing_id);
    let textLength = listing_id.length;
    // console.log(textLength);

    if (textLength % 4 == 0 && textLength > 0) {
      //   console.log("I am divisible by 4", listing_id);
      const response = await AuthApi.searchListings({ listing_id });
      // console.log(response.data);
      if (response.status == 200) {
        this.setState({
          ...this.state,
          listDetails: response.data.data,
          loader: false,
        });
      } else if (response.status == 204) {
        this.setState({
          ...this.state,
          listDetails: response.data,
          loader: false,
        });
      }
    } else if (textLength == 0) {
      this.setState({ ...this.state, loader: false });
    }
  };

  render() {
    const { theme, userId, buttonActive } = this.state;
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
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <TouchableOpacity onPress={this.backToMainPage}>
            <Ionicons name="chevron-back-outline" size={30} color="#3A4D8F" />
          </TouchableOpacity>
          {this.props.route.params != undefined ? (
            <View style={styles.searchView}>
              <TextInput
                style={{
                  fontSize: 10,
                  color:
                    theme == "dark" ? darkTheme.primary : lightTheme.primary,
                  width: "90%",
                  fontFamily: "ClarityCity-LightItalic",
                }}
                value={this.state.listID}
              />
              <EvilIcons name="search" size={20} color="#4A4A4A" />
            </View>
          ) : (
            <View style={styles.searchView}>
              <TextInput
                style={{
                  fontSize: 14,
                  fontFamily: "ClarityCity-RegularItalic",
                  color:
                    theme == "dark" ? darkTheme.primary : lightTheme.primary,

                  width: "90%",
                }}
                placeholder="Search with listing ID"
                placeholderTextColor={"#4A4A4A"}
                onChangeText={(listingId) => this.onKeyUp(listingId)}
              />
              <EvilIcons name="search" size={20} color="#4A4A4A" />
            </View>
          )}
        </View>
        {this.state.startSearch ? null : (
          <View style={{ flex: 1 }}>
            {this.state.loader ? (
              <Loading />
            ) : (
              <>
                {this.state.listDetails == null ||
                this.state.listDetails.length == 0 ? (
                  <Nodata text={"No Search Found"} />
                ) : (
                  <View style={{ marginTop: 50 }}>
                    <Text
                      style={[
                        styles.text2,
                        {
                          color:
                            theme == "dark"
                              ? darkTheme.primary
                              : lightTheme.primary,
                        },
                      ]}
                    >
                      Listing Details
                    </Text>
                    <FlatList
                      data={this.state.listDetails}
                      keyExtractor={(list) => list.id.toString()}
                      renderItem={({ item }) => (
                        <ListResult
                          amount={item.amount}
                          product={item.product}
                          date={item.updatedAt}
                          bidders={item.bidders}
                          onPress={() => this.bidDetails(item.id)}
                          buttonActive={
                            item.user_id == userId
                              ? buttonActive
                              : !buttonActive
                          }
                        />
                      )}
                    />
                  </View>
                )}
              </>
            )}
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 60,
    paddingBottom: 40,
  },

  text2: {
    fontSize: 16,
    textAlign: "center",
    fontFamily: "ClarityCity-Bold",
  },
  spin1: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  spin: {
    backgroundColor: "#3A4D8F",
    borderRadius: 10,
    paddingTop: 9,
    height: 45,
    alignItems: "center",
    marginTop: 6,
  },
  searchView: {
    width: "90%",
    borderRadius: 50,
    borderStyle: "solid",
    borderColor: "#4A4A4A",
    borderWidth: 1,
    paddingHorizontal: 5,
    paddingVertical: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginLeft: 7,
  },
});

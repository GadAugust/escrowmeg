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
import { Circle } from "react-native-animated-spinkit";
import AuthApi from "../../api/listing";
import frontStorage from "../../utilities/storage";
import PrimaryButton from "../../components/PrimaryButton";
import AllListings from "../../components/AllListings";
import routes from "../../navigation/routes";
import Dropdown from "../../components/Dropdown";
import Loading from "../../components/Loading";
import Toast from "react-native-root-toast";
import Nodata from "../../components/Nodata";
import darkTheme from "../../config/darkmodecolors";
import lightTheme from "../../config/lightmodecolors";
import myFonts from "../../config/fontfamily";
import * as Clipboard from "expo-clipboard";
import * as Font from "expo-font";
import { EvilIcons, AntDesign } from "@expo/vector-icons";
import Modal from "react-native-modal";
import { StatusBar } from "expo-status-bar";
import TopBar from "../../components/TopBar";
import InfoBar from "../../components/InfoBar";
import appColor from "../../config/colors";
import {
  fetchMyListings,
  createNewListing,
  fetchMySummary,
} from "../../api/api_calls/listing";
import Helper from "../../utilities/helper";

export default class HomeScreen extends Component {
  constructor(props) {
    super(props),
      (this.state = {
        loading: false,
        fontsLoaded: false,
        userData: { user_id: 0, firstname: "", lastname: "", image: "" },
        listingData: {
          user_id: 0,
          role: "buyer",
          amount: "",
          payment_type: "full",
          product: "",
        },
        loader: true,
        refreshing: false,
        showModal: false,
        listingArray: null,
        theme: "dark",
        editable: true,
        mySummary: {},
      });
  }

  async componentDidMount() {
    const getTheme = await frontStorage.asyncGet("mode");
    let currentTheme = getTheme ? JSON.parse(getTheme) : this.state.theme;
    await Font.loadAsync(myFonts);
    this.setState({ ...this.state, fontsLoaded: true, theme: currentTheme });

    this.getData();
    this.getSummary();
  }

  getData = async () => {
    const userData = await frontStorage.getUserData("confined");
    const { user_id } = userData;
    console.log("User_data", userData);
    const myListings = await fetchMyListings({ user_id });
    console.log("My Listings", myListings);
    if (myListings) {
      this.setState({
        ...this.state,
        userData,
        listingArray: myListings,
        loader: false,
        refreshing: false,
      });
    } else {
      this.setState({
        ...this.state,
        userData,
        listingArray: [],
        loader: false,
        refreshing: false,
      });
    }
  };

  getSummary = async () => {
    const userData = await frontStorage.getUserData("confined");
    const { user_id } = userData;
    const mySummary = await fetchMySummary({ user_id });
    console.log("My Summary", mySummary);
    if (mySummary) {
      this.setState({
        ...this.state,
        mySummary,
      });
    } else {
      this.setState({
        ...this.state,
        mySummary: {},
      });
    }
  };

  toggleModal = (status) => {
    status == "open"
      ? this.setState({
          ...this.state,
          showModal: true,
          listingData: {
            user_id: 0,
            role: "buyer",
            amount: "",
            payment_type: "full",
            product: "",
          },
        })
      : this.setState({
          ...this.state,
          showModal: false,
          listingData: {
            user_id: 0,
            role: "buyer",
            amount: "",
            payment_type: "full",
            product: "",
          },
        });
  };

  onRefresh = () => {
    this.setState({
      ...this.state,
      userData: { user_id: 0, firstname: "", lastname: "", image: "" },
      refreshing: true,
      loader: true,
      listingArray: null,
    });
    this.getData();
    this.getSummary();
  };

  copyToClipboard = async (value) => {
    await Clipboard.setStringAsync(value);
    Toast.show("Copied to clipboard", { duration: Toast.durations.LONG });
  };

  setProduct = (value) => {
    // console.log(value.length);
    if (value.length > 40) {
      let product = value.substring(0, 40);
      this.setState({
        ...this.state,
        listingData: { ...this.state.listingData, product },
        editable: false,
      });
      Toast.show("Can not exceed 40 characters", {
        duration: Toast.durations.LONG,
        position: 100,
        shadow: true,
        backgroundColor: "#fff",
        textColor: "#333",
      });
    } else {
      this.setState({
        ...this.state,
        listingData: { ...this.state.listingData, product: value },
        editable: true,
      });
    }
  };

  createListing = async () => {
    const { user_id } = this.state.userData;
    const { amount, role, payment_type, product } = this.state.listingData;
    console.log({ amount, role, payment_type, product });

    // Check if the data is error free
    const error = await Helper.validateListingData({
      user_id,
      role,
      amount,
      payment_type,
      product,
    });

    if (error > 0) {
      return;
    }

    this.setState({ ...this.state, loading: true });

    const createListingResult = await createNewListing({
      user_id,
      role,
      amount,
      payment_type,
      product,
    });

    this.setState({
      ...this.state,
      loading: false,
      showModal: false,
    });

    console.log("Create listing result", createListingResult);

    createListingResult == "success" && this.getData(); //refresh after success
  };

  gotoSearch = (listID) => {
    this.props.navigation.navigate(routes.LISTSEARCHRESULT, { listID });
  };

  searchId = () => {
    this.props.navigation.navigate(routes.LISTSEARCHRESULT);
  };

  selectedValue = (value) => {
    // console.log(value)
    value == "buyer" || value == "seller"
      ? this.setState({
          ...this.state,
          listingData: { ...this.state.listingData, role: value },
        })
      : this.setState({
          ...this.state,
          listingData: { ...this.state.listingData, payment_type: value },
        });
  };

  render() {
    if (this.state.fontsLoaded == false) {
      return <Loading />;
    }

    const renderItem = ({ item }) => (
      <AllListings
        product={item.product}
        amount={item.amount}
        listId={item.listing_id}
        noOfBids={item.number_of_bidders}
        role={item.role}
        date={item.updatedAt}
        copyToClipboard={() => this.copyToClipboard(item.listing_id)}
        onPress={() => this.gotoSearch(item.listing_id)}
      />
    );

    const getHeader = () => {
      return (
        <>
          <TopBar
            openNavigation={() => this.props.navigation.toggleDrawer()}
            searchFunc={this.searchId}
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
            useSearch={true}
          />

          <View
            style={{
              marginTop: 15,
              marginBottom: 35,
            }}
          >
            <Text
              style={{
                marginBottom: 15,
                fontSize: 16,
                color: "#BC990A",
                fontFamily: "ClarityCity-Bold",
              }}
            >
              Account Summary
            </Text>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-around",
              }}
            >
              <View style={styles.summaryBox}>
                <Text style={styles.summaryHeader}>Walet Balance</Text>
                <Text style={styles.summaryValue}>
                  $
                  {this.state.mySummary == {}
                    ? "0"
                    : this.state.mySummary.userWalletBalance}
                </Text>
              </View>
              <View style={styles.summaryBox}>
                <Text style={styles.summaryHeader}>Payment Released</Text>
                <Text style={styles.summaryValue}>
                  $
                  {this.state.mySummary == {}
                    ? "0"
                    : this.state.mySummary.totalPaymentReleased}
                </Text>
              </View>
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-around",
              }}
            >
              <View style={styles.summaryBox}>
                <Text style={styles.summaryHeader}>Total Listings</Text>
                <Text style={styles.summaryValue}>
                  {this.state.mySummary == {}
                    ? "0"
                    : this.state.mySummary.userListingCount}
                </Text>
              </View>
              <View style={styles.summaryBox}>
                <Text style={styles.summaryHeader}>Total Projects</Text>
                <Text style={styles.summaryValue}>
                  {this.state.mySummary == {}
                    ? "0"
                    : this.state.mySummary.userProjectCount}
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              marginVertical: 15,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: "#BC990A",
                fontFamily: "ClarityCity-Bold",
              }}
            >
              Latest Listings
            </Text>
          </View>
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
        {this.state.loader ? (
          <Loading />
        ) : (
          <View style={{ flex: 1 }}>
            <FlatList
              data={this.state.listingArray}
              keyExtractor={(listing) => listing.id.toString()}
              renderItem={renderItem}
              ListHeaderComponent={getHeader}
              ListEmptyComponent={
                <View style={{ flex: 1, marginTop: "70%" }}>
                  <Nodata text="No Listing Created Yet" />
                </View>
              }
              refreshControl={
                <RefreshControl
                  //refresh control used for pull to refresh
                  refreshing={this.state.refreshing}
                  onRefresh={this.onRefresh.bind(this)}
                />
              }
              // onScroll={() => console.log("scrolling")}
              // onScrollToTop={console.log("On top now")}
              // onMomentumScrollEnd={console.log("Stopped scrolling")}
            />
          </View>
        )}

        <Modal
          style={{ padding: 0, margin: 0, width: "100%" }}
          isVisible={this.state.showModal}
          hasBackdrop={false}
          animationIn="slideInUp"
          animationOut="slideOutDown"
        >
          <View
            style={{
              flex: 1,
              justifyContent: "flex-end",
              backgroundColor: "rgba(0,0,0,0.4)",
            }}
          >
            <View
              style={{
                backgroundColor:
                  this.state.theme == "dark"
                    ? darkTheme.greycolor
                    : lightTheme.greycolor,

                borderTopWidth: 4,
                borderTopColor:
                  this.state.theme == "dark" ? darkTheme.dark : lightTheme.dark,
                borderRadius: 15,
              }}
            >
              <TouchableOpacity
                onPress={() => this.toggleModal("close")}
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  marginVertical: 10,
                  paddingHorizontal: 10,
                }}
              >
                <AntDesign
                  name="close"
                  color={
                    this.state.theme == "dark"
                      ? darkTheme.primary
                      : lightTheme.primary
                  }
                  size={25}
                />
              </TouchableOpacity>
              <View
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 20,
                }}
              >
                <View style={styles.listingDetails}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Dropdown
                      myStyle={{
                        backgroundColor:
                          this.state.theme == "dark"
                            ? darkTheme.greycolor
                            : lightTheme.greycolor,
                        borderColor:
                          this.state.theme == "dark"
                            ? darkTheme.primary
                            : lightTheme.primary,
                        borderRadius: 8,
                      }}
                      value={"buyer"}
                      items={[
                        { label: "I'm buying", value: "buyer" },
                        { label: "I'm selling", value: "seller" },
                      ]}
                      onChange={this.selectedValue}
                    />
                    <TextInput
                      style={{
                        fontSize: 14,
                        color:
                          this.state.theme == "dark"
                            ? darkTheme.primary
                            : lightTheme.primary,

                        marginHorizontal: 5,
                        paddingLeft: 10,
                        height: "92%",
                        borderWidth: 1,
                        borderColor:
                          this.state.theme == "dark"
                            ? darkTheme.primary
                            : lightTheme.primary,
                        borderRadius: 8,
                        paddingHorizontal: 10,
                        width: "48%",
                        paddingVertical: 13,
                        fontFamily: "ClarityCity-Regular",
                      }}
                      multiline={true}
                      editable={this.state.editable}
                      placeholder="Service/Product"
                      placeholderTextColor={"#cccccc"}
                      onChangeText={(text) => {
                        this.setProduct(text);
                      }}
                    />
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      marginVertical: 15,
                      alignItems: "center",
                      borderWidth: 1,
                      borderColor:
                        this.state.theme == "dark"
                          ? darkTheme.primary
                          : lightTheme.primary,
                      borderRadius: 8,
                      height: 47,
                      paddingVertical: 13,
                    }}
                  >
                    <View
                      style={{
                        width: "25%",
                        justifyContent: "center",
                        backgroundColor:
                          this.state.theme == "dark"
                            ? darkTheme.primary
                            : lightTheme.primary,
                        height: 47,
                        borderTopLeftRadius: 8,
                        borderBottomLeftRadius: 8,
                      }}
                    >
                      <Text style={styles.text3}>for $</Text>
                    </View>
                    <TextInput
                      style={{
                        fontSize: 14,
                        fontWeight: "400",
                        color:
                          this.state.theme == "dark"
                            ? darkTheme.primary
                            : lightTheme.primary,
                        marginHorizontal: 10,
                        width: "75%",
                        paddingHorizontal: 20,
                        fontFamily: "ClarityCity-Regular",
                      }}
                      keyboardType="numeric"
                      placeholder="Amount"
                      placeholderTextColor={"#cccccc"}
                      onChangeText={(amount) => {
                        this.setState({
                          ...this.state,
                          listingData: {
                            ...this.state.listingData,
                            amount: amount.trim(),
                          },
                        });
                      }}
                    />
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",

                      borderRadius: 10,
                      backgroundColor:
                        this.state.theme == "dark"
                          ? darkTheme.primary
                          : lightTheme.primary,
                    }}
                  >
                    <View
                      style={{
                        width: "25%",
                        paddingHorizontal: 10,
                      }}
                    >
                      <Text style={styles.text3}>Payment Type</Text>
                    </View>
                    <View style={{ width: "150%" }}>
                      <Dropdown
                        myStyle={{
                          backgroundColor:
                            this.state.theme == "dark"
                              ? darkTheme.greycolor
                              : lightTheme.greycolor,
                          borderColor:
                            this.state.theme == "dark"
                              ? darkTheme.primary
                              : lightTheme.primary,
                          borderBottomLeftRadius: 0,
                          borderTopLeftRadius: 0,
                        }}
                        value={"full"}
                        items={[
                          { label: "Full", value: "full" },
                          { label: "Installment", value: "installmental" },
                        ]}
                        onChange={this.selectedValue}
                      />
                    </View>
                  </View>
                </View>
              </View>
              <View
                style={[
                  styles.blueBottom,
                  {
                    backgroundColor:
                      this.state.theme == "dark"
                        ? darkTheme.secondary
                        : lightTheme.secondary,
                  },
                ]}
              >
                {this.state.loading ? (
                  <View
                    style={[
                      styles.spin,
                      {
                        backgroundColor:
                          this.state.theme == "dark"
                            ? darkTheme.secondary
                            : lightTheme.secondary,
                      },
                    ]}
                  >
                    <Circle
                      size={24}
                      color={
                        this.state.theme == "dark"
                          ? darkTheme.primary
                          : lightTheme.primary
                      }
                    />
                  </View>
                ) : (
                  <PrimaryButton
                    text="Create Listing"
                    onPress={this.createListing}
                  />
                )}
              </View>
            </View>
          </View>
        </Modal>
        <TouchableOpacity
          style={[
            styles.floatView,
            {
              backgroundColor:
                this.state.theme == "dark"
                  ? darkTheme.primary
                  : lightTheme.dark,
            },
          ]}
          onPress={() => this.toggleModal("open")}
        >
          <View style={styles.innerFloatView}>
            <AntDesign
              name="plus"
              size={20}
              style={{ fontFamily: "ClarityCity-ExtraBold" }}
              color={
                this.state.theme == "dark"
                  ? darkTheme.secondary
                  : lightTheme.secondary
              }
            />
            <Text
              style={{
                fontFamily: "ClarityCity-ExtraBold",
                color: appColor.secondary,
              }}
            >
              Create Listing
            </Text>
          </View>
        </TouchableOpacity>
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
    width: 337,
    marginTop: 30,
  },

  text3: {
    fontSize: 13,
    textAlign: "center",
    fontFamily: "ClarityCity-Regular",
  },

  spin: {
    borderRadius: 10,
    paddingTop: 9,
    height: 45,
    alignItems: "center",
    marginTop: 6,
  },
  floatView: {
    position: "absolute",
    bottom: 40,
    flexDirection: "row",
    right: 20,
    padding: 2,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    elevation: 3,
  },

  innerFloatView: {
    padding: 10,
    flexDirection: "row",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    borderWidth: 2,
    borderColor: appColor.secondary,
  },

  blueBottom: {
    paddingVertical: 15,
    borderBottomEndRadius: 15,
  },

  summaryBox: {
    backgroundColor: "#BC990A",
    borderRadius: 10,
    padding: 20,
    width: "45%",
    justifyContent: "center",
    alignItems: "flex-start",
    marginVertical: 5,
  },

  summaryHeader: {
    color: "#f5f5f5",
    fontFamily: "ClarityCity-Light",
  },

  summaryValue: {
    color: "#f5f5f5",
    fontFamily: "ClarityCity-ExtraBold",
    textAlign: "center",
    fontSize: 20,
    marginTop: 15,
  },
});

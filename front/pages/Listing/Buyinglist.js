import React, { Component } from "react";
import { View, FlatList, RefreshControl } from "react-native";
import EachList from "../../components/Eachlist";
import ListingOption from "../../components/Listingoption";
import lightTheme from "../../config/lightmodecolors";
import darkTheme from "../../config/darkmodecolors";
import * as Clipboard from "expo-clipboard";
import frontStorage from "../../utilities/storage";
import routes from "../../navigation/routes";
import Nodata from "../../components/Nodata";
import Toast from "react-native-root-toast";
import { StatusBar } from "expo-status-bar";

export default class BuyingLists extends Component {
  constructor(props) {
    super(props),
      (this.state = {
        loading: true,
        refreshing: false,
        listing: [],
        theme: "dark",
      });
  }

  async componentDidMount() {
    let buyerlisting = this.props.buyerlisting;
    buyerlisting.map((list) => (list.showOption = false));

    const getTheme = await frontStorage.asyncGet("mode");
    let currentTheme = getTheme ? JSON.parse(getTheme) : this.state.theme;
    this.setState({
      ...this.state,
      listing: buyerlisting,
      loading: false,
      theme: currentTheme,
    });
  }

  cancelOption = (id) => {
    let allLists = this.state.listing;
    let oneList = allLists.find((list) => list.id == id);
    let theListIndex = allLists.findIndex((list) => list.id == id);
    // console.log(theListIndex)
    oneList.showOption = false;
    allLists[theListIndex] = oneList;
    // console.log(allLists)
    this.setState({ ...this.state, listing: allLists });
  };

  copyToClipboard = async (id) => {
    let allLists = this.state.listing;
    let oneList = allLists.find((list) => list.id == id);
    let listID = oneList.listing_id;
    // console.log(listID);
    await Clipboard.setStringAsync(listID);
    Toast.show("Copied to clipboard", { duration: Toast.durations.LONG });
  };

  showOption = (id) => {
    // console.log(id)
    let allLists = this.state.listing;
    let oneList = allLists.find((list) => list.id == id);
    let theListIndex = allLists.findIndex((list) => list.id == id);
    // console.log(theListIndex)
    oneList.showOption = true;
    allLists[theListIndex] = oneList;
    // console.log(allLists)
    this.setState({ ...this.state, listing: allLists });
  };

  openList = (id) => {
    let allDetails = this.state.listing;
    let eachDetails = allDetails.find((detail) => detail.id == id);
    this.props.props.navigation.navigate(routes.LISTDETAILS, eachDetails);
  };

  render() {
    const { theme } = this.state;
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: lightTheme.dark,
        }}
      >
        <StatusBar style="light" animated={true} backgroundColor="#141414" />
        <FlatList
          data={this.state.listing || this.props.buyerlisting}
          keyExtractor={(list) => list.id.toString()}
          renderItem={({ item }) =>
            item.showOption ? (
              <ListingOption
                onPress={() => this.openList(item.id)}
                cancelOption={() => this.cancelOption(item.id)}
                copyListID={() => this.copyToClipboard(item.id)}
              />
            ) : (
              <EachList
                product={item.product}
                amount={item.amount}
                date={item.updatedAt}
                listing_id={item.listing_id}
                onPress={() => this.showOption(item.id)}
              />
            )
          }
          ListEmptyComponent={
            <View style={{ flex: 1, marginTop: "60%" }}>
              <Nodata text="No Buying List Created Yet" />
            </View>
          }
          refreshControl={
            <RefreshControl
              refreshing={this.props.refreshing}
              onRefresh={this.props.onRefresh}
            />
          }
        />
      </View>
    );
  }
}

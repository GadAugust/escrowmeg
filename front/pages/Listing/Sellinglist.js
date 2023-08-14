import React, { Component } from "react";
import { View, FlatList, RefreshControl } from "react-native";
import routes from "../../navigation/routes";
import * as Clipboard from "expo-clipboard";
import ListingOption from "../../components/Listingoption";
import frontStorage from "../../utilities/storage";
import EachList from "../../components/Eachlist";
import Nodata from "../../components/Nodata";
import Toast from "react-native-root-toast";
import lightTheme from "../../config/lightmodecolors";
import darkTheme from "../../config/darkmodecolors";

export default class SellingLists extends Component {
  constructor(props) {
    super(props),
      (this.state = {
        isDataLoaded: false,
        loading: true,
        refreshing: false,
        listing: [],
        theme: "dark",
      });
  }
  async componentDidMount() {
    this.setListing();
    const getTheme = await frontStorage.asyncGet("mode");
    let currentTheme = getTheme ? JSON.parse(getTheme) : this.state.theme;
    this.setState({
      ...this.state,
      theme: currentTheme,
    });
  }

  setListing = () => {
    let sellerlisting = this.props.sellerlisting;
    sellerlisting.map((list) => (list.showOption = false));
    // console.log("seller", sellerlisting);
    this.setState({ ...this.state, listing: sellerlisting });
  };

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
    // console.log(eachDetails);
    this.props.props.navigation.navigate(routes.LISTDETAILS, eachDetails);
  };

  render() {
    const { theme } = this.state;
    return (
      <>
        <View
          style={{
            flex: 1,
            backgroundColor: lightTheme.dark,
          }}
        >
          <FlatList
            data={this.state.listing || this.props.sellerlisting}
            keyExtractor={(list) => list.id.toString()}
            numColumns={2}
            // ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            renderItem={({ item, index }) =>
              item.showOption ? (
                <ListingOption
                  onPress={() => this.openList(item.id)}
                  cancelOption={() => this.cancelOption(item.id)}
                  copyListID={() => this.copyToClipboard(item.id)}
                  style={
                    index % 2 == 0 ? { paddingRight: 5 } : { paddingLeft: 5 }
                  }
                />
              ) : (
                <EachList
                  product={item.product}
                  amount={item.amount}
                  date={item.updatedAt}
                  listing_id={item.listing_id}
                  onPress={() => this.showOption(item.id)}
                  style={
                    index % 2 == 0 ? { paddingRight: 5 } : { paddingLeft: 5 }
                  }
                />
              )
            }
            ListEmptyComponent={
              <View style={{ flex: 1, marginTop: "60%" }}>
                <Nodata text="No Selling List Created Yet" />
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
      </>
    );
  }
}

import React, { Component } from "react";
import { View, Image, FlatList, RefreshControl } from "react-native";
import Bidstatus from "../../components/Bidstatus";
import Nodata from "../../components/Nodata";
import lightTheme from "../../config/lightmodecolors";
import darkTheme from "../../config/darkmodecolors";
import frontStorage from "../../utilities/storage";

export default class DeclinedBids extends Component {
  constructor(props) {
    super(props),
      (this.state = {
        allDeclinedBids: [],
        theme: "dark",
      });
  }

  async componentDidMount() {
    const getTheme = await frontStorage.asyncGet("mode");
    let currentTheme = getTheme ? JSON.parse(getTheme) : this.state.theme;
    let allDeclinedBids = this.props.declinedBids;
    this.setState({ ...this.state, allDeclinedBids, theme: currentTheme });
  }

  render() {
    const { theme } = this.state;

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: lightTheme.dark,
        }}
      >
        <FlatList
          data={this.state.allDeclinedBids}
          keyExtractor={(list) => list.id.toString()}
          renderItem={({ item }) => (
            <Bidstatus
              product={item.listing.product}
              amount={item.listing.amount}
              status={item.status}
              firstName={item.user.first_name}
              lastName={item.user.last_name}
            />
          )}
          ListEmptyComponent={
            <View style={{ flex: 1, marginTop: "60%" }}>
              <Nodata text="No Bid Declined" />
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

import React, { Component } from "react";
import { View, Image, FlatList, RefreshControl } from "react-native";
import Bidstatus from "../../components/Bidstatus";
import Nodata from "../../components/Nodata";
import lightTheme from "../../config/lightmodecolors";
import darkTheme from "../../config/darkmodecolors";
import frontStorage from "../../utilities/storage";

export default class AcceptedBids extends Component {
  constructor(props) {
    super(props),
      (this.state = {
        allAcceptedBids: [],
        theme: "dark",
      });
  }

  async componentDidMount() {
    // console.log(this.props.refreshing);
    const getTheme = await frontStorage.asyncGet("mode");
    let currentTheme = getTheme ? JSON.parse(getTheme) : this.state.theme;
    let allAcceptedBids = this.props.acceptedBids;
    this.setState({ ...this.state, allAcceptedBids, theme: currentTheme });
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
          data={this.state.allAcceptedBids}
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
              <Nodata text="No Accepted Bid" />
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

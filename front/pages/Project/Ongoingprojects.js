import React, { Component } from "react";
import { View, Text, Image, FlatList, RefreshControl } from "react-native";
import ProjectStatus from "../../components/Projectstatus";
import frontStorage from "../../utilities/storage";
import Nodata from "../../components/Nodata";
import routes from "../../navigation/routes";
import lightTheme from "../../config/lightmodecolors";
import darkTheme from "../../config/darkmodecolors";

export default class OngoingProjects extends Component {
  constructor(props) {
    super(props),
      (this.state = {
        ongoingProjects: [],
        user_id: "",
        first_name: "",
        theme: "dark",
      });
  }
  async componentDidMount() {
    let ongoingProjects = this.props.ongoingProjects;
    const getTheme = await frontStorage.asyncGet("mode");
    let currentTheme = getTheme ? JSON.parse(getTheme) : this.state.theme;

    this.setState({ ...this.state, ongoingProjects, theme: currentTheme });
    this.getData();
  }

  getData = async () => {
    const getData = await frontStorage.asyncGet("userData");
    let userData = JSON.parse(getData);
    let first_name = userData.first_name;
    let user_id = userData.id;
    this.setState({ ...this.state, first_name, user_id });
  };

  projectDetails = async (item) => {
    // console.log(item);

    let firstname = this.state.first_name;
    this.props.props.navigation.navigate(routes.PROJECTDETAILS, {
      ...item,
      firstname,
    });
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
        <View style={{ flex: 1, marginTop: 5 }}>
          <FlatList
            data={this.state.ongoingProjects}
            keyExtractor={(list) => list.id.toString()}
            renderItem={({ item }) => (
              <ProjectStatus
                sellerId={item.seller_id}
                buyerId={item.buyer_id}
                userId={this.state.user_id}
                amount={item.listing.amount}
                status={item.status}
                product={item.listing.product}
                firstName={item.user.first_name}
                lastName={item.user.last_name}
                onPress={() =>
                  this.projectDetails({
                    ...item,
                    user_id: this.state.user_id,
                  })
                }
              />
            )}
            ListEmptyComponent={
              <View style={{ flex: 1, marginTop: "50%" }}>
                <Nodata text="No Ongoing Project(s)" />
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
      </View>
    );
  }
}

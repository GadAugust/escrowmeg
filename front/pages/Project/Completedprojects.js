import React, { Component } from "react";
import { View, Text, Image, FlatList, RefreshControl } from "react-native";
import ProjectStatus from "../../components/Projectstatus";
import Nodata from "../../components/Nodata";
import lightTheme from "../../config/lightmodecolors";
import darkTheme from "../../config/darkmodecolors";
import frontStorage from "../../utilities/storage";

export default class CompletedProjects extends Component {
  constructor(props) {
    super(props),
      (this.state = {
        completedProjects: [],
        theme: "dark",
      });
  }
  async componentDidMount() {
    let completedProjects = this.props.completedProjects;
    const getTheme = await frontStorage.asyncGet("mode");
    let currentTheme = getTheme ? JSON.parse(getTheme) : this.state.theme;
    this.setState({ ...this.state, completedProjects, theme: currentTheme });
  }

  render() {
    const { theme } = this.state;

    const renderItem = ({ item }) => (
      <ProjectStatus
        role={item.listing.role}
        amount={item.listing.amount}
        status={item.status}
        product={item.listing.product}
        firstName={item.user.first_name}
        lastName={item.user.last_name}
      />
    );

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: lightTheme.dark,
        }}
      >
        <View style={{ flex: 1, marginTop: 5 }}>
          <FlatList
            data={this.state.completedProjects}
            keyExtractor={(list) => list.id.toString()}
            renderItem={renderItem}
            ListEmptyComponent={
              <View style={{ flex: 1, marginTop: "50%" }}>
                <Nodata text="No Completed Project(s)" />
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

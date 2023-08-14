import React, { Component } from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import frontStorage from "../../utilities/storage";
import AuthApi from "../../api/project";
import Loading from "../../components/Loading";
import { FontAwesome } from "@expo/vector-icons";
import ProjectNavigator from "../../navigation/ProjectNavigator";
import lightTheme from "../../config/lightmodecolors";
import darkTheme from "../../config/darkmodecolors";
import { StatusBar } from "expo-status-bar";
import TopBar from "../../components/TopBar";

export default class ProjectList extends Component {
  constructor(props) {
    super(props),
      (this.state = {
        firstname: "",
        lastname: "",
        refreshing: false,
        ongoingProjects: null,
        completedProjects: null,
        theme: "dark",
      });
  }
  async componentDidMount() {
    this.getData();
    const getTheme = await frontStorage.asyncGet("mode");
    let currentTheme = getTheme ? JSON.parse(getTheme) : this.state.theme;
    this.setState({ ...this.state, theme: currentTheme });
  }

  onRefresh = () => {
    this.setState({
      ...this.state,
      firstname: "",
      lastname: "",
      ongoingProjects: null,
      completedProjects: null,
      refreshing: true,
    });
    this.getData();
  };

  getData = async () => {
    const getData = await frontStorage.asyncGet("userData");
    let userData = JSON.parse(getData);
    let firstname = userData.first_name;
    let lastname = userData.last_name;
    let user_id = userData.id;
    let status = "ongoing";
    const response = await AuthApi.ongoingProjects({ user_id, status });
    // console.log("ongoing", response.data);
    if (response.data == null) {
      this.setState({
        ...this.state,
        firstname,
        lastname,
        ongoingProjects: [],
        refreshing: false,
      });
    } else {
      let ongoingProjects = response.data.data;
      console.log("ongoing", ongoingProjects);
      this.setState({
        ...this.state,
        firstname,
        lastname,
        ongoingProjects,
        refreshing: false,
      });
    }
    const result = await AuthApi.completedProjects({
      user_id,
      status: "completed",
    });
    // console.log("completed", result);
    if (result.data == null) {
      this.setState({
        ...this.state,
        firstname,
        lastname,
        completedProjects: [],
        refreshing: false,
      });
    } else {
      let completedProjects = result.data.data;
      // console.log("completed", completedProjects);
      this.setState({
        ...this.state,
        firstname,
        lastname,
        completedProjects,
        refreshing: false,
      });
    }
  };

  render() {
    const { theme } = this.state;

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
          headerText="My Projects"
        />
        {this.state.ongoingProjects != null &&
        this.state.completedProjects != null ? (
          <ProjectNavigator
            ongoingProjects={this.state.ongoingProjects}
            completedProjects={this.state.completedProjects}
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh.bind(this)}
          />
        ) : (
          <Loading />
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
  profileimg: {
    height: 73,
    width: 73,
    borderRadius: 50,
    marginRight: 9,
  },
  text1: {
    fontSize: 14,
    fontFamily: "ClarityCity-Regular",
  },
  text2: {
    textTransform: "uppercase",
    fontSize: 16,
    fontFamily: "ClarityCity-Bold",
    lineHeight: 16,
  },
  line: {
    marginTop: 20,
    width: "100%",
  },
});

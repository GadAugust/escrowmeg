import React, { Component } from "react";
import { StyleSheet, View, Text, TextInput } from "react-native";
import frontStorage from "../../utilities/storage";
import PrimaryButton from "../../components/PrimaryButton";
import AuthApi from "../../api/listing";
import { Circle } from "react-native-animated-spinkit";
import routes from "../../navigation/routes";
import Toast from "react-native-root-toast";
import lightTheme from "../../config/lightmodecolors";
import darkTheme from "../../config/darkmodecolors";
import { StatusBar } from "expo-status-bar";
import TopBar from "../../components/TopBar";

export default class BidScreen extends Component {
  pitch = "";

  constructor(props) {
    super(props),
      (this.state = {
        loading: false,
        editable: true,
        listType: "",
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
    });
  }

  backPage = () => {
    this.props.navigation.navigate(routes.LISTSEARCHRESULT);
  };

  getData = async () => {
    // console.log(this.props.route.params)
    this.props.route.params.role == "seller"
      ? this.setState({ ...this.state, listType: "Buying" })
      : this.setState({ ...this.state, listType: "Selling" });
  };

  bidForList = async () => {
    const getData = await frontStorage.asyncGet("userData");
    let userData = JSON.parse(getData);
    let role = this.props.route.params.role;
    let listing_id = this.props.route.params.listing_id;
    let bidder_id = userData.id;
    let user_id = this.props.route.params.user_id;
    // console.log(pitch);
    if (bidder_id != user_id) {
      if (this.pitch != "") {
        this.setState({ ...this.state, loading: true });
        const response = await AuthApi.bidListing({
          role,
          user_id,
          bidder_id,
          pitch: this.pitch,
          listing_id,
        });
        this.textInput.clear();
        console.log(response);
        let newResponse = response.data;
        if (response.status == 200) {
          Toast.show(newResponse.message, { duration: Toast.durations.LONG });
          this.backPage();
          this.setState({ ...this.state, loading: false });
        } else if (response.status == 406) {
          Toast.show("Already bidded for product", {
            duration: Toast.durations.LONG,
          });
          this.backPage();
          this.setState({ ...this.state, loading: false });
        } else {
          Toast.show(newResponse.message, { duration: Toast.durations.LONG });
          this.backPage();
          this.setState({ ...this.state, loading: false });
        }
      } else {
        Toast.show("Pitch for bid", { duration: Toast.durations.LONG });
      }
    } else {
      Toast.show("Can not bid for your listing", {
        duration: Toast.durations.LONG,
      });
    }
  };

  setPitch = (text) => {
    console.log(text.length);
    if (text.length > 200) {
      this.pitch = text.substring(0, 200);
      this.setState({ ...this.state, editable: false });
      Toast.show("Pitch can not be more than 200 characters", {
        duration: Toast.durations.LONG,
      });
    } else {
      this.pitch = text;
    }
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
          headerText={this.state.listType}
          useBack={true}
          backFunc={() => this.props.navigation.navigate(routes.MAINPAGE)}
        />

        <View style={styles.eachList}>
          <Text
            numberOfLines={1}
            style={[
              styles.listtext,
              {
                color: theme == "dark" ? darkTheme.primary : lightTheme.primary,
              },
            ]}
          >
            Product Name: {this.props.route.params.product}{" "}
          </Text>
          <Text
            style={[
              styles.listtext,
              {
                color: theme == "dark" ? darkTheme.primary : lightTheme.primary,
              },
            ]}
          >
            Price: ${this.props.route.params.amount}
          </Text>
          <Text
            numberOfLines={1}
            style={[
              styles.listtext,
              {
                color: theme == "dark" ? darkTheme.primary : lightTheme.primary,
              },
            ]}
          >
            ListingID: {this.props.route.params.listing_id}
          </Text>
        </View>
        <View style={styles.pitchView}>
          <TextInput
            style={{
              fontSize: 14,
              fontFamily: "ClarityCity-Regular",
              color: theme == "dark" ? darkTheme.primary : lightTheme.primary,
              width: "100%",
              paddingHorizontal: 5,
            }}
            placeholder="Pitch here. Not more than 200 characters"
            multiline={true}
            editable={editable}
            placeholderTextColor={"#4A4A4A"}
            onChangeText={(text) => {
              this.setPitch(text);
            }}
            ref={(input) => {
              this.textInput = input;
            }}
          />
        </View>
        {this.state.loading ? (
          <View style={styles.spin}>
            <Circle size={24} color="#F5F5F5" />
          </View>
        ) : (
          <PrimaryButton text={"Bid now"} onPress={this.bidForList} />
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
});

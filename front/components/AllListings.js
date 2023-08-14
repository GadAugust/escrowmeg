import React, { Component } from "react";
import { Text, StyleSheet, TouchableOpacity, View } from "react-native";
import myFonts from "../config/fontfamily";
import * as Font from "expo-font";
import { Feather } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { Share } from "react-native";

export default class AllListings extends Component {
  constructor(props) {
    super(props),
      (this.state = {
        date: "",
        time: "",
        fontsLoaded: false,
        listId: "",
      });
  }

  async componentDidMount() {
    let myDate = this.props.date;
    const date = myDate.split("T");
    let splitDate = date[1].split(".");
    let newTime = splitDate[0].split(":");
    let time = "";
    parseInt(newTime[0]) > 12
      ? (time = parseInt(newTime[0]) - 12 + ":" + newTime[1] + "PM")
      : (time = newTime[0] + ":" + newTime[1] + "AM");

    await Font.loadAsync(myFonts);

    this.setState({
      ...this.state,
      date: date[0],
      time,
      fontsLoaded: true,
    });
  }

  shareListing = async () => {
    // const redirectUrl = Linking.createURL("searchresult", {
    //   queryParams: { listID: this.props.listId },
    // });

    const redirectUrl =
      "https://eskrobytes.com/searchresult?listID=" + this.props.listId;
    console.log(redirectUrl);
    try {
      const result = await Share.share({
        message: redirectUrl,
        // url: redirectUrl,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  render() {
    const { onPress, product, amount, role, copyToClipboard, listId } =
      this.props;
    const { date, time, fontsLoaded } = this.state;
    if (!fontsLoaded) {
      return null;
    }

    return (
      <TouchableOpacity style={styles.eachList} onPress={onPress}>
        <View style={{ width: "80%" }}>
          {role == "buyer" ? (
            <Text numberOfLines={1} style={styles.listtext}>
              I am buying {product}
            </Text>
          ) : (
            <Text numberOfLines={1} style={styles.listtext}>
              I am selling {product}
            </Text>
          )}

          <Text style={styles.listtext}>${amount}</Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              width: "50%",
            }}
          >
            <Text numberOfLines={1} style={styles.listId}>
              {listId}
            </Text>
            <TouchableOpacity onPress={copyToClipboard}>
              <Feather
                name="copy"
                size={20}
                color="#819CFC"
                style={{ marginRight: 10 }}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.date}>
            {date} {time}
          </Text>
        </View>
        <TouchableOpacity
          style={{ marginHorizontal: 5 }}
          onPress={this.shareListing}
        >
          <Feather
            name="share"
            size={24}
            color="#819CFC"
            style={{ marginRight: 10 }}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  eachList: {
    backgroundColor: "#BC990A",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  listtext: {
    fontSize: 14,
    fontFamily: "ClarityCity-Bold",
    color: "#F5F5F5",
    paddingVertical: 5,
  },
  listId: {
    fontSize: 14,
    fontFamily: "ClarityCity-Light",
    color: "#F5F5F5",
    paddingVertical: 5,
  },
  date: {
    fontFamily: "ClarityCity-Medium",
    color: "#f5f5f5",
    paddingVertical: 5,
  },
  bid: {
    width: 20,
    height: 30,
    alignSelf: "center",
  },
});

import React, { Component } from "react";
import { View, Image, Text, StyleSheet, TouchableOpacity } from "react-native";
import PrimaryButton from "../../components/PrimaryButton";
import myFonts from "../../config/fontfamily";
import * as Font from "expo-font";
import routes from "../../navigation/routes";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

export default class TransactionDetailsScreen extends Component {
  constructor(props) {
    super(props),
      (this.state = {
        transactionType: "",
        listID: "",
        date: "",
        time: "",
        fontsLoaded: false,
      });
  }

  async componentDidMount() {
    this.setAmountType();
    await Font.loadAsync(myFonts);
    this.setState({
      ...this.state,
      fontsLoaded: true,
    });
  }

  backScreen = () => {
    this.props.navigation.navigate(routes.MAINPAGE);
  };

  downloadPDF = () => {
    console.log("Download");
  };
  setAmountType = () => {
    // let changelistID =  this.props.route.params.listing_id;
    // let listID = changelistID.substr(0, 12) + ".....";
    let myDate = this.props.route.params.createdAt;
    const date = myDate.split("T");
    let splitDate = date[1].split(".");
    let newTime = splitDate[0].split(":");
    let time = "";
    parseInt(newTime[0]) > 12
      ? (time = parseInt(newTime[0]) - 12 + ":" + newTime[1] + "PM")
      : (time = newTime[0] + ":" + newTime[1] + "AM");
    this.props.route.params.transaction_type == "Credit"
      ? this.setState({
          ...this.state,
          transactionType: "Received",
          date: date[0],
          time,
        })
      : this.setState({
          ...this.state,
          transactionType: "Sent",
          date: date[0],
          time,
        });
  };

  render() {
    if (!this.state.fontsLoaded) {
      return null;
    }
    return (
      <View style={styles.container}>
        <StatusBar style="light" animated={true} backgroundColor="#141414" />
        <TouchableOpacity onPress={this.backScreen}>
          <Ionicons name="chevron-back-outline" size={30} color="#3A4D8F" />
        </TouchableOpacity>
        <Text style={styles.text0}>Amount {this.state.transactionType}</Text>
        <Text style={styles.text}>${this.props.route.params.amount}</Text>
        <View style={{ marginBottom: 54, marginTop: 48 }}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={styles.text1}>Type</Text>
            <Text style={styles.text2}>
              {this.props.route.params.transaction_type}
            </Text>
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={styles.text1}>Date</Text>
            <Text style={styles.text2}>{this.state.date}</Text>
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={styles.text1}>Time</Text>
            <Text style={styles.text2}>{this.state.time}</Text>
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={styles.text1}>Payment ID</Text>
            <Text style={styles.text2}>
              {this.props.route.params.payment_reference}
            </Text>
          </View>
        </View>
        <PrimaryButton text="Download" onPress={this.downloadPDF} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#141414",
    paddingHorizontal: 10,
    paddingVertical: 60,
  },
  text: {
    fontSize: 32,
    textAlign: "center",
    color: "#F5F5F5",
    fontFamily: "ClarityCity-Bold",
  },
  text0: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 100,
    color: "#F5F5F5",
    fontFamily: "ClarityCity-Regular",
  },
  text1: {
    fontSize: 16,
    color: "#F5F5F5",
    fontFamily: "ClarityCity-Regular",
  },
  text2: {
    fontSize: 16,
    color: "#F5F5F5",
    fontFamily: "ClarityCity-Bold",
  },
});

import React, { Component } from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { Flow } from "react-native-animated-spinkit";
import { AntDesign } from "@expo/vector-icons";

export default class AllBids extends Component {
  constructor(props) {
    super(props),
      (this.state = {
        date: "",
      });
  }

  componentDidMount() {
    let myDate = this.props.date;
    const date = myDate.split("T");
    this.setState({ ...this.state, date: date[0] });
  }

  render() {
    return (
      <View style={styles.mainView}>
        {this.props.itemDetails ? (
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
            onPress={() => this.props.onShow("up-" + this.props.itemId)}
          >
            <View>
              <Text style={styles.text1}>
                {this.props.name} bid for this offer
              </Text>
              <Text style={styles.text1}>{this.state.date}</Text>
            </View>
            <AntDesign name="up" size={16} color={"#F5F5F5"} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
            onPress={() => this.props.onShow("down-" + this.props.itemId)}
          >
            <View>
              <Text style={styles.text1}>
                {this.props.name} bid for this offer
              </Text>
              <Text style={styles.text1}>{this.state.date}</Text>
            </View>
            <AntDesign name="down" size={16} color={"#F5F5F5"} />
          </TouchableOpacity>
        )}
        {this.props.itemDetails ? (
          <View style={{ marginTop: 15 }}>
            <Text style={styles.text2}>
              {this.props.pitch} Kindly accept my bid.
            </Text>
            {this.props.status == "pending" ? (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 25,
                }}
              >
                <TouchableOpacity
                  style={styles.accept}
                  onPress={this.props.acceptBid}
                >
                  <Text style={styles.text2}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.decline}
                  onPress={this.props.declineBid}
                >
                  <Text style={styles.text2}>Decline</Text>
                </TouchableOpacity>
                {this.props.wait ? (
                  <Text style={{ color: "#F5F5F5", fontWeight: "700" }}>
                    Please wait <Flow size={15} color="#F5F5F5" />
                  </Text>
                ) : null}
              </View>
            ) : (
              <Text
                style={{
                  color: "#F5F5F5",
                  marginVertical: 8,
                  fontFamily: "ClarityCity-ThinItalic",
                }}
              >
                This project has been awarded
              </Text>
            )}
          </View>
        ) : (
          <></>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainView: {
    backgroundColor: "#4A4A4A",
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginTop: 3,
  },
  text1: {
    color: "#F5F5F5",
    fontSize: 14,
    fontFamily: "ClarityCity-Bold",
  },
  text2: {
    color: "#F5F5F5",
    fontSize: 14,
    fontFamily: "ClarityCity-Regular",
  },
  accept: {
    borderRadius: 10,
    backgroundColor: "#3A4D8F",
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  decline: {
    borderWidth: 1,
    borderColor: "#F5F5F5",
    borderRadius: 10,
    paddingHorizontal: 3,
    paddingVertical: 5,
    marginHorizontal: 15,
  },
});

import React, { Component } from "react";
import { Text, View, StyleSheet, FlatList, Image } from "react-native";
import BidderDetails from "./Bidderdetails";
import PrimaryButton from "./PrimaryButton";
import lightTheme from "../config/lightmodecolors";
import darkTheme from "../config/darkmodecolors";
import frontStorage from "../utilities/storage";

export default class ListResult extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: "",
      time: "",
      bidders: [],
      theme: "dark",
    };
  }

  async componentDidMount() {
    const getTheme = await frontStorage.asyncGet("mode");
    let currentTheme = getTheme ? JSON.parse(getTheme) : this.state.theme;

    let bidders = this.props.bidders;
    bidders.map((bid) => (bid.showPitch = false));
    let myDate = this.props.date;
    const date = myDate.split("T");
    let splitDate = date[1].split(".");
    let newTime = splitDate[0].split(":");
    let time = "";
    parseInt(newTime[0]) > 12
      ? (time = parseInt(newTime[0]) - 12 + ":" + newTime[1] + "PM")
      : (time = newTime[0] + ":" + newTime[1] + "AM");
    this.setState({
      ...this.state,
      bidders,
      date: date[0],
      time,
      theme: currentTheme,
    });
  }

  showPitch = (value) => {
    let newValue = value.split("-");
    let toggle = newValue[0];
    let id = newValue[1];

    let bidders = this.props.bidders;
    let oneBid = bidders.find((bid) => bid.id == id);
    let theBidIndex = bidders.findIndex((bid) => bid.id == id);

    toggle == "display"
      ? (oneBid.showPitch = true)
      : (oneBid.showPitch = false);

    bidders[theBidIndex] = oneBid;

    this.setState({ ...this.state, bidders });
  };

  render() {
    const { amount, product } = this.props;
    const { bidders, theme } = this.state;

    return (
      <View style={{ flex: 1 }}>
        <View
          style={{
            marginTop: 20,
            borderRadius: 20,
            borderStyle: "solid",
            borderColor: "#4A4A4A",
            borderWidth: 1,
            padding: 20,
          }}
        >
          <View>
            <Text
              style={[
                styles.text1,
                {
                  color:
                    theme == "dark" ? darkTheme.primary : lightTheme.primary,
                },
              ]}
            >
              Product Name
            </Text>
            <Text
              style={[
                styles.text3,
                {
                  color:
                    theme == "dark" ? darkTheme.primary : lightTheme.primary,
                },
              ]}
            >
              {product}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 10,
              marginBottom: 15,
            }}
          >
            <View>
              <Text
                style={[
                  styles.text1,
                  {
                    color:
                      theme == "dark" ? darkTheme.primary : lightTheme.primary,
                  },
                ]}
              >
                Product Price
              </Text>
              <Text
                style={[
                  styles.text3,
                  {
                    color:
                      theme == "dark" ? darkTheme.primary : lightTheme.primary,
                  },
                ]}
              >
                ${amount}
              </Text>
            </View>
            <View>
              <Text
                style={[
                  styles.text1,
                  {
                    color:
                      theme == "dark" ? darkTheme.primary : lightTheme.primary,
                  },
                ]}
              >
                Date | Time
              </Text>
              <Text
                style={[
                  styles.text3,
                  {
                    color:
                      theme == "dark" ? darkTheme.primary : lightTheme.primary,
                  },
                ]}
              >
                {this.state.date} | {this.state.time}
              </Text>
            </View>
          </View>
          <PrimaryButton
            text={"Bid"}
            onPress={this.props.onPress}
            buttonActive={this.props.buttonActive}
          />
        </View>
        <View
          style={{
            marginTop: 40,
            flex: 1,
          }}
        >
          <Text
            style={[
              styles.text2,
              {
                color: theme == "dark" ? darkTheme.primary : lightTheme.primary,
              },
            ]}
          >
            Bids on this listing
          </Text>

          {bidders.length == 0 ? (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginTop: "10%",
                paddingVertical: 20,
              }}
            >
              <Image source={require("../assets/nobid.png")} />
              <Text
                style={{
                  fontSize: 15,
                  color:
                    theme == "dark" ? darkTheme.primary : lightTheme.primary,
                  textAlign: "center",
                  fontFamily: "ClarityCity-Bold",
                }}
              >
                No bid has been made on this listing.
              </Text>
            </View>
          ) : (
            <FlatList
              data={bidders}
              keyExtractor={(list) => list.id.toString()}
              renderItem={({ item }) => (
                <BidderDetails
                  firstName={item.user.first_name}
                  lastName={item.user.last_name}
                  date={item.createdAt}
                  product={product}
                  pitch={item.pitch}
                  itemId={item.id}
                  showPitch={item.showPitch}
                  onPress={this.showPitch}
                />
              )}
            />
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  text1: {
    fontSize: 9,
    fontFamily: "ClarityCity-Regular",
  },
  text3: {
    fontSize: 11,
    fontFamily: "ClarityCity-Bold",
    marginTop: 3,
  },
  text2: {
    fontSize: 16,
    fontFamily: "ClarityCity-Bold",
  },
});

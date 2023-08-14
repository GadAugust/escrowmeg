import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import PrimaryButton from "../../components/PrimaryButton";
import lightTheme from "../../config/lightmodecolors";
import darkTheme from "../../config/darkmodecolors";
import frontStorage from "../../utilities/storage";
import { StatusBar } from "expo-status-bar";

export default class Details extends Component {
  constructor(props) {
    super(props),
      (this.state = {
        datePosted: "",
        bidAccepted: "",
        bidDate: "",
        theme: "dark",
      });
  }

  async componentDidMount() {
    const getTheme = await frontStorage.asyncGet("mode");
    let currentTheme = getTheme ? JSON.parse(getTheme) : this.state.theme;

    let dateP = this.props.datePosted;
    const datePosted = dateP.split("T");
    let dateA = this.props.bidAccepted;
    const bidAccepted = dateA.split("T");
    let dateB = this.props.bidDate;
    const bidDate = dateB.split("T");

    this.setState({
      ...this.state,
      datePosted: datePosted[0],
      bidAccepted: bidAccepted[0],
      bidDate: bidDate[0],
      theme: currentTheme,
    });
  }

  render() {
    const { theme } = this.state;

    const { product, amount, seller, buyer, listingId, buyer_id, user_id } =
      this.props;
    return (
      <View>
        <StatusBar style="light" animated={true} backgroundColor="#141414" />
        <View style={{ marginBottom: 40, marginTop: 20 }}>
          <Text
            style={[
              styles.listtext,
              {
                color: theme == "dark" ? darkTheme.primary : lightTheme.primary,
              },
            ]}
          >
            Product Name: {product}{" "}
          </Text>
          <Text
            style={[
              styles.listtext,
              {
                color: theme == "dark" ? darkTheme.primary : lightTheme.primary,
              },
            ]}
          >
            Price: ${amount}
          </Text>
          {buyer_id == user_id ? (
            <View>
              <Text
                style={[
                  styles.listtext,
                  {
                    color:
                      theme == "dark" ? darkTheme.primary : lightTheme.primary,
                  },
                ]}
              >
                Seller: {seller}
              </Text>
              <Text
                style={[
                  styles.listtext,
                  {
                    color:
                      theme == "dark" ? darkTheme.primary : lightTheme.primary,
                  },
                ]}
              >
                Buyer (You): {buyer}
              </Text>
            </View>
          ) : (
            <View>
              <Text
                style={[
                  styles.listtext,
                  {
                    color:
                      theme == "dark" ? darkTheme.primary : lightTheme.primary,
                  },
                ]}
              >
                Seller (You): {buyer}
              </Text>
              <Text
                style={[
                  styles.listtext,
                  {
                    color:
                      theme == "dark" ? darkTheme.primary : lightTheme.primary,
                  },
                ]}
              >
                Buyer : {seller}
              </Text>
            </View>
          )}
          <Text
            numberOfLines={1}
            style={[
              styles.listtext,
              {
                color: theme == "dark" ? darkTheme.primary : lightTheme.primary,
              },
            ]}
          >
            ListingID: {listingId}
          </Text>
          <Text
            style={[
              styles.listtext,
              {
                color: theme == "dark" ? darkTheme.primary : lightTheme.primary,
              },
            ]}
          >
            Date posted: {this.state.datePosted}
          </Text>
          <Text
            style={[
              styles.listtext,
              {
                color: theme == "dark" ? darkTheme.primary : lightTheme.primary,
              },
            ]}
          >
            Bid date: {this.state.bidDate}
          </Text>
          <Text
            style={[
              styles.listtext,
              {
                color: theme == "dark" ? darkTheme.primary : lightTheme.primary,
              },
            ]}
          >
            Date bid accepted: {this.state.bidAccepted}
          </Text>
        </View>

        <PrimaryButton text={"Project Completed"} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  listtext: {
    fontSize: 16,
    fontFamily: "ClarityCity-Regular",

    lineHeight: 25,
  },

  line: {
    marginTop: 20,
    width: "100%",
  },
});

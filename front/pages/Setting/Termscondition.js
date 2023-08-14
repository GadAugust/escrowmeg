import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import routes from "../../navigation/routes";
import { Ionicons } from "@expo/vector-icons";
import lightTheme from "../../config/lightmodecolors";
import darkTheme from "../../config/darkmodecolors";
import frontStorage from "../../utilities/storage";
import { StatusBar } from "expo-status-bar";

export default class TermsCondition extends Component {
  constructor(props) {
    super(props), (this.state = { theme: "dark" });
  }

  async componentDidMount() {
    const getTheme = await frontStorage.asyncGet("mode");
    let currentTheme = getTheme ? JSON.parse(getTheme) : this.state.theme;
    this.setState({ ...this.state, theme: currentTheme });
  }
  back = () => {
    this.props.navigation.navigate(routes.MAINPAGE);
  };

  render() {
    const { theme } = this.state;

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
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 10,
            paddingVertical: 20,
          }}
        >
          <TouchableOpacity onPress={this.back}>
            <Ionicons name="chevron-back-outline" size={30} color="#3A4D8F" />
          </TouchableOpacity>
          <Text
            style={[
              styles.text,
              {
                color: theme == "dark" ? darkTheme.primary : lightTheme.primary,
              },
            ]}
          >
            Terms and Condition
          </Text>
        </View>
        <ScrollView>
          <Text
            style={[
              styles.text1,
              {
                color: theme == "dark" ? darkTheme.primary : lightTheme.primary,
              },
            ]}
          >
            Herolaworks LLC , doing business as EskroBytes.com, a Georgia
            corporation ("EskroBytes.com" or “ESKROBYTES.COM” or “we” or “us”)
            is a direct provider of escrow services, and is licensed across the
            United States and elsewhere. Details of licenses held are available
            at: https://www.eskroBytes.com/escrow-licenses. It is important You
            read and understand these General EskroBytes.com Terms and
            Conditions (“Terms”). These Terms modify all previous General Terms
            and Conditions and are effective as of June15th, 2023 (“Effective
            Date”) for all Escrow Transactions agreed to and entered by both
            Seller and Buyer on or after the Effective Date. For Escrow
            Transactions entered prior to the Effective Date and still open, the
            Terms in existence at the time the Escrow Transaction was entered
            remain in effect. The Terms are current as of the Effective Date,
            and subject to change. In the event of a change, we will upload a
            new version to the Site. You should check the EskroBytes.com website
            for the latest version of this document before entering a new Escrow
            Transaction. These Terms apply to the Seller, Buyer, and Broker
            (each a” Party” or “Underlying Party,” and collectively ”Parties” or
            “Underlying Parties”) involved in any Escrow Transaction in
            connection with the Escrow Services. References to” You” and ”Your”
            in the terms apply to you or the organization you represent in
            connection with an Underlying Transaction (as defined below) as the
            Seller, the Buyer, and/or the Broker as the context requires. In
            addition to these Terms, You are also subject to certain other
            terms, conditions, and agreements (collectively, the “EskroBytes.com
            Terms of Service”), including: •EskroBytes.com Site Terms of Use,
            available at https://www.eskroBytes.com/escrow- 101/terms-of-use
            •Privacy Policy, available at
            https://www.eskroBytes.com/escrow-101/privacy-policy •General Escrow
            Instructions, available at https://www.eskroBytes.com/escrow-
            101/general-escrow-instructions •The Transaction Escrow Instructions
            and any Supplemental Escrow Instructions •The API Terms of Use,
            available at https://www.eskroBytes.com/escrow-101/api-terms-
            and-conditions Herolaworks LLC , doing business as EskroBytes.com, a
            Georgia corporation ("EskroBytes.com" or “ESKROBYTES.COM” or “we” or
            “us”) is a direct provider of escrow services, and is licensed
            across the United States and elsewhere. Details of licenses held are
            available at: https://www.eskroBytes.com/escrow-licenses. It is
            important You read and understand these General EskroBytes.com Terms
            and Conditions (“Terms”). These Terms modify all previous General
            Terms and Conditions and are effective as of June15th, 2023
            (“Effective Date”) for all Escrow Transactions agreed to and entered
            by both Seller and Buyer on or after the Effective Date. For Escrow
            Transactions entered prior to the Effective Date and still open, the
            Terms in existence at the time the Escrow Transaction was entered
            remain in effect. The Terms are current as of the Effective Date,
            and subject to change. In the event of a change, we will upload a
            new version to the Site. You should check the EskroBytes.com website
            for the latest version of this document before entering a new Escrow
            Transaction. These Terms apply to the Seller, Buyer, and Broker
            (each a” Party” or “Underlying Party,” and collectively ”Parties” or
            “Underlying Parties”) involved in any Escrow Transaction in
            connection with the Escrow Services. References to” You” and ”Your”
            in the terms apply to you or the organization you represent in
            connection with an Underlying Transaction (as defined below) as the
            Seller, the Buyer, and/or the Broker as the context requires. In
            addition to these Terms, You are also subject to certain other
            terms, conditions, and agreements (collectively, the “EskroBytes.com
            Terms of Service”), including: •EskroBytes.com Site Terms of Use,
            available at https://www.eskroBytes.com/escrow- 101/terms-of-use
            •Privacy Policy, available at
            https://www.eskroBytes.com/escrow-101/privacy-policy •General Escrow
            Instructions, available at https://www.eskroBytes.com/escrow-
            101/general-escrow-instructions •The Transaction Escrow Instructions
            and any Supplemental Escrow Instructions •The API Terms of Use,
            available at https://www.eskroBytes.com/escrow-101/api-terms-
            and-conditions
          </Text>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 20,
  },
  text: {
    fontSize: 16,
    fontFamily: "ClarityCity-Bold",
  },
  text1: {
    fontSize: 16,
    textAlign: "justify",
    fontFamily: "ClarityCity-Regular",
  },
});

import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import frontStorage from "../../utilities/storage";
import routes from "../../navigation/routes";
import Details from "./Details";
import DisputeScreen from "./Dispute";
import Chat from "./Chat";
import PaymentFeedback from "./Paymentfeedback";
import PaymentRequestedScreen from "./Paymentrequested";
import RequestPaymentScreen from "./Requestpayment";
import { Ionicons } from "@expo/vector-icons";
import lightTheme from "../../config/lightmodecolors";
import darkTheme from "../../config/darkmodecolors";
import { StatusBar } from "expo-status-bar";
import TopBar from "../../components/TopBar";

let clickedText = {
  fontSize: 14,
  fontFamily: "ClarityCity-Regular",
  color: "#141414",
};
let text = {
  fontSize: 14,
  color: "#F5F5F5",
  fontFamily: "ClarityCity-Regular",
};
let scrollLists = {
  borderColor: "#F5F5F5",
  borderWidth: 1,
  borderRadius: 15,
  justifyContent: "center",
  height: 30,
  marginRight: 15,
  paddingHorizontal: 15,
};
let clickScrollList = {
  backgroundColor: "#F5F5F5",
  borderRadius: 15,
  justifyContent: "center",
  height: 30,
  marginRight: 15,
  paddingHorizontal: 15,
};

export default class ProjectDetails extends Component {
  constructor(props) {
    super(props),
      (this.state = {
        theme: "dark",
        showDetails: {
          show: true,
          scrollList: scrollLists,
          text1: text,
        },
        showPaymentRequest: {
          show: false,
          scrollList: scrollLists,
          text1: text,
        },
        showRequestedPayment: {
          show: false,
          scrollList: scrollLists,
          text1: text,
        },
        showDispute: {
          show: false,
          scrollList: scrollLists,
          text1: text,
        },
        showChat: {
          show: false,
          scrollList: scrollLists,
          text1: text,
        },
      });
  }
  async componentDidMount() {
    const getTheme = await frontStorage.asyncGet("mode");
    let currentTheme = getTheme ? JSON.parse(getTheme) : this.state.theme;
    this.setState({ ...this.state, theme: currentTheme });

    this.setState((prevState) => ({
      showDetails: {
        ...prevState.showDetails,
        show: true,
        scrollList: clickScrollList,
        text1: clickedText,
      },
    }));
  }

  selectComponent = (value) => {
    // console.log(value)

    value == "details"
      ? this.setState((prevState) => ({
          showDetails: {
            ...prevState.showDetails,
            show: true,
            scrollList: clickScrollList,
            text1: clickedText,
          },
          showPaymentRequest: {
            ...prevState.showPaymentRequest,
            show: false,
            scrollList: scrollLists,
            text1: text,
          },
          showRequestedPayment: {
            ...prevState.showRequestedPayment,
            show: false,
            scrollList: scrollLists,
            text1: text,
          },
          showDispute: {
            ...prevState.showDispute,
            show: false,
            scrollList: scrollLists,
            text1: text,
          },
          showChat: {
            ...prevState.showChat,
            show: false,
            scrollList: scrollLists,
            text1: text,
          },
        }))
      : value == "requestpayment"
      ? this.setState((prevState) => ({
          showPaymentRequest: {
            ...prevState.showPaymentRequest,
            show: true,
            scrollList: clickScrollList,
            text1: clickedText,
          },
          showRequestedPayment: {
            ...prevState.showRequestedPayment,
            show: false,
            scrollList: scrollLists,
            text1: text,
          },
          showDetails: {
            ...prevState.showDetails,
            show: false,
            scrollList: scrollLists,
            text1: text,
          },
          showDispute: {
            ...prevState.showDispute,
            show: false,
            scrollList: scrollLists,
            text1: text,
          },
          showChat: {
            ...prevState.showChat,
            show: false,
            scrollList: scrollLists,
            text1: text,
          },
        }))
      : value == "paymentrequested"
      ? this.setState((prevState) => ({
          showRequestedPayment: {
            ...prevState.showRequestedPayment,
            show: true,
            scrollList: clickScrollList,
            text1: clickedText,
          },
          showPaymentRequest: {
            ...prevState.showPaymentRequest,
            show: false,
            scrollList: scrollLists,
            text1: text,
          },
          showDetails: {
            ...prevState.showDetails,
            show: false,
            scrollList: scrollLists,
            text1: text,
          },
          showDispute: {
            ...prevState.showDispute,
            show: false,
            scrollList: scrollLists,
            text1: text,
          },
          showChat: {
            ...prevState.showChat,
            show: false,
            scrollList: scrollLists,
            text1: text,
          },
        }))
      : value == "dispute"
      ? this.setState((prevState) => ({
          showDispute: {
            ...prevState.showDispute,
            show: true,
            scrollList: clickScrollList,
            text1: clickedText,
          },
          showRequestedPayment: {
            ...prevState.showRequestedPayment,
            show: false,
            scrollList: scrollLists,
            text1: text,
          },
          showPaymentRequest: {
            ...prevState.showPaymentRequest,
            show: false,
            scrollList: scrollLists,
            text1: text,
          },
          showDetails: {
            ...prevState.showDetails,
            show: false,
            scrollList: scrollLists,
            text1: text,
          },
          showChat: {
            ...prevState.showChat,
            show: false,
            scrollList: scrollLists,
            text1: text,
          },
        }))
      : this.setState((prevState) => ({
          showChat: {
            ...prevState.showChat,
            show: true,
            scrollList: clickScrollList,
            text1: clickedText,
          },
          showDispute: {
            ...prevState.showDispute,
            show: false,
            scrollList: scrollLists,
            text1: text,
          },
          showDetails: {
            ...prevState.showDetails,
            show: false,
            scrollList: scrollLists,
            text1: text,
          },
          showPaymentRequest: {
            ...prevState.showPaymentRequest,
            show: false,
            scrollList: scrollLists,
            text1: text,
          },
          showRequestedPayment: {
            ...prevState.showRequestedPayment,
            show: false,
            scrollList: scrollLists,
            text1: text,
          },
        }));
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
          useBack={true}
          backFunc={() => this.props.navigation.navigate(routes.MAINPAGE)}
          headerText="Project Details"
        />
        <View style={{ flex: 1, marginTop: 30 }}>
          <View style={{ height: 60 }}>
            <ScrollView
              horizontal={true}
              contentContainerStyle={{ paddingTop: 10, marginBottom: 10 }}
            >
              <TouchableOpacity
                style={[this.state.showDetails.scrollList]}
                onPress={() => this.selectComponent("details")}
              >
                <Text style={[this.state.showDetails.text1]}>
                  Project Details
                </Text>
              </TouchableOpacity>
              {this.props.route.params.user_id ==
              this.props.route.params.seller_id ? (
                <TouchableOpacity
                  style={[this.state.showPaymentRequest.scrollList]}
                  onPress={() => this.selectComponent("requestpayment")}
                >
                  <Text style={[this.state.showPaymentRequest.text1]}>
                    Request Payment
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[this.state.showRequestedPayment.scrollList]}
                  onPress={() => this.selectComponent("paymentrequested")}
                >
                  <Text style={[this.state.showRequestedPayment.text1]}>
                    Payment Request
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[this.state.showDispute.scrollList]}
                onPress={() => this.selectComponent("dispute")}
              >
                <Text style={[this.state.showDispute.text1]}>Dispute</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[this.state.showChat.scrollList]}
                onPress={() => this.selectComponent("chat")}
              >
                <Text style={[this.state.showChat.text1]}>Chat</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
          <View style={{ flex: 1 }}>
            {this.state.showDetails.show ? (
              <Details
                product={this.props.route.params.listing.product}
                amount={this.props.route.params.listing.amount}
                buyer={this.props.route.params.firstname}
                seller={this.props.route.params.user.first_name}
                listingId={this.props.route.params.listing_id}
                datePosted={this.props.route.params.listing.createdAt}
                bidDate={this.props.route.params.bid.createdAt}
                bidAccepted={this.props.route.params.bid.updatedAt}
                buyer_id={this.props.route.params.buyer_id}
                user_id={this.props.route.params.user_id}
              />
            ) : this.state.showPaymentRequest.show ? (
              <RequestPaymentScreen
                paymentType={this.props.route.params.listing.payment_type}
                amount={this.props.route.params.listing.amount}
                project_id={this.props.route.params.id}
                user_id={this.props.route.params.user_id}
              />
            ) : this.state.showRequestedPayment.show ? (
              <PaymentRequestedScreen
                product={this.props.route.params.listing.product}
                amount={this.props.route.params.listing.amount}
                project_id={this.props.route.params.id}
                user_id={this.props.route.params.user_id}
                seller_id={this.props.route.params.seller_id}
              />
            ) : this.state.showDispute.show ? (
              <DisputeScreen
                project_id={this.props.route.params.id}
                seller_id={this.props.route.params.seller_id}
                buyer_id={this.props.route.params.buyer_id}
                role={this.props.route.params.role}
                user_id={this.props.route.params.user_id}
              />
            ) : (
              <Chat
                project_id={this.props.route.params.id}
                seller_id={this.props.route.params.seller_id}
                buyer_id={this.props.route.params.buyer_id}
                user_id={this.props.route.params.user_id}
              />
            )}
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 60,
    paddingBottom: 30,
  },
});

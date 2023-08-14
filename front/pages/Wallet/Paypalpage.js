import React, { Component } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { encode } from "base-64";
import WebView from "react-native-webview";
import AuthApi from "../../api/wallet";
import routes from "../../navigation/routes";
import Toast from "react-native-root-toast";
import frontStorage from "../../utilities/storage";
import { StatusBar } from "expo-status-bar";

const clientId =
  "ATRMDSoODYTRMc4VUTemdpGOJHd1_GhpZPfYWG5EU-Ac_i9shLtKZIviToOHxl-osC7ixAkLGNfoatfG";
const clientSecret =
  "EIwlNHo_L8VEml9emqfZmvPTxYeE9mEqtfl3Ehjho7_J4sUcnLpmbhmoMmMEXrjZyZ5sP76BZZeU3ueo";

export default class Paypal extends Component {
  constructor(props) {
    super(props),
      (this.state = {
        accessToken: null,
        paymentId: null,
        approvalUrl: null,
      });
  }

  componentDidMount() {
    const dataDetails = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      transactions: [
        {
          amount: {
            total: this.props.route.params.amount,
            currency: "USD",
            details: {
              subtotal: this.props.route.params.amount,
              tax: "0.00",
              shipping: "0.00",
            },
          },
        },
      ],
      redirect_urls: {
        return_url: "https://example.com/return",
        cancel_url: "https://example.com/cancel",
      },
    };
    const credentials = `${clientId}:${clientSecret}`;
    const encodedCredentials = encode(credentials);
    const requestBody = "grant_type=client_credentials";

    fetch("https://api-m.sandbox.paypal.com/v1/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${encodedCredentials}`,
      },
      body: requestBody,
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log("first response gan", data);
        this.setState({
          ...this.state,
          accessToken: data.access_token,
        });

        fetch(
          "https://api.sandbox.paypal.com/v1/oauth2/token",

          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization: `Bearer ${data.access_token}`,
            },
            body: "grant_type=client_credentials",
          }
        )
          .then((res) => res.json())
          .then((response) => {
            // console.log("response gan", response);
            this.setState({
              ...this.state,
              accessToken: response.access_token,
            });

            fetch("https://api.sandbox.paypal.com/v1/payments/payment", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${response.access_token}`,
              },
              body: JSON.stringify(dataDetails),
            })
              .then((res) => res.json())
              .then((response) => {
                console.log("response", response);
                const { id, links } = response;
                const approvalUrl = links.find(
                  (data) => data.rel == "approval_url"
                );
                console.log("approvalUrl", approvalUrl);
                this.setState({
                  ...this.state,
                  paymentId: id,
                  approvalUrl: approvalUrl.href,
                });
              })
              .catch((err) => {
                console.log({ ...err });
              });
          })
          .catch((err) => {
            console.log({ ...err });
          });
      })
      .catch((err) => {
        console.log({ ...err });
      });
  }

  navigationStateChange = (webViewState) => {
    console.log("webState", webViewState);
    if (webViewState.url.includes("https://example.com")) {
      this.setState({ ...this.state, approvalUrl: null });

      const { PayerID, paymentId } = webViewState.url;

      fetch(
        `https://api.sandbox.paypal.com/v1/payments/payment/${paymentId}/execute`,
        {
          method: "POST",
          body: { payer_id: PayerID },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.state.accessToken}`,
          },
        }
      )
        .then((res) => res.json())
        .then(async (response) => {
          console.log("res", response);
          if (response.name == "INVALID_RESOURCE_ID") {
            let user_id = this.props.route.params.user_id;
            let transaction_type = this.props.route.params.transaction_type;
            let amount = this.props.route.params.amount;
            let payment_ref = "eskrobytes00" + user_id;
            const response = await AuthApi.addMoney({
              user_id,
              amount,
              transaction_type,
              payment_ref,
            });
            let newResponse = response.data;
            console.log(newResponse);
            if (newResponse.message == "Payment Successful") {
              let newAmount = newResponse.data;
              const getData = await frontStorage.asyncGet("userData");
              let userData = JSON.parse(getData);
              frontStorage.asyncStore(
                "userData",
                JSON.stringify({ ...userData, wallet: newAmount })
              );
              this.props.navigation.navigate(routes.MAINPAGE, { newAmount });
              Toast.show(newResponse.message, {
                duration: Toast.durations.LONG,
              });
            } else {
              Toast.show("Payment Not Successful", {
                duration: Toast.durations.LONG,
              });
              // alert("Payment failed. Please Try Again");
              this.setState({ ...this.state, approvalUrl: null });
              this.props.navigation.pop();
            }
          }
        })
        .catch((err) => {
          console.log({ ...err });
        });
    }
  };

  render() {
    const { approvalUrl } = this.state;
    return (
      <View style={{ flex: 1, backgroundColor: "#141414" }}>
        <StatusBar style="light" animated={true} backgroundColor="#141414" />
        {approvalUrl ? (
          <WebView
            style={{ height: "100%", width: "100%", marginTop: 40 }}
            source={{ uri: approvalUrl }}
            onNavigationStateChange={this.navigationStateChange}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
          />
        ) : (
          <View style={{ flex: 1, justifyContent: "center" }}>
            <Text
              style={{ color: "#3A4D8F", fontSize: 23, alignSelf: "center" }}
            >
              Do not Press Back or Refresh Page
            </Text>
            <ActivityIndicator
              color={"#3A4D8F"}
              size={60}
              style={{ alignSelf: "center" }}
            />
          </View>
        )}
      </View>
    );
  }
}

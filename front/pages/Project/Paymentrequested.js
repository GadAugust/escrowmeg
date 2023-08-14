import React, { Component } from "react";
import { View, FlatList, RefreshControl, Text } from "react-native";
import AuthApi from "../../api/project";
import Loading from "../../components/Loading";
import RequestedList from "../../components/Requestedlist";
import darkTheme from "../../config/darkmodecolors";
import lightTheme from "../../config/lightmodecolors";
import frontStorage from "../../utilities/storage";
import Toast from "react-native-root-toast";
import { StatusBar } from "expo-status-bar";

export default class PaymentRequestedScreen extends Component {
  constructor(props) {
    super(props),
      (this.state = {
        release: false,
        paymentHistory: null,
        loading: true,
        refreshing: false,
        showInputPin: false,
        load: false,
        amount: 0,
        request_payment_id: 0,
        paymentStatus: "",
        theme: "dark",
      });
  }

  async componentDidMount() {
    this.requestHistory();
    // const getTheme = await frontStorage.asyncGet("mode");
    // let currentTheme = JSON.parse(getTheme);
    // this.setState({ ...this.state, theme: currentTheme });
  }

  onRefresh = () => {
    this.setState({
      ...this.state,
      release: false,
      paymentHistory: null,
      loading: true,
      refreshing: true,
      showInputPin: false,
      load: false,
      amount: 0,
      request_payment_id: 0,
      paymentStatus: "",
    });
    this.requestHistory();
  };

  requestHistory = async () => {
    let project_id = this.props.project_id;
    const response = await AuthApi.requestPaymentHistory({
      project_id,
    });
    // console.log("history", response);
    if (response.data == null) {
      this.setState({
        ...this.state,
        paymentHistory: [],
        loading: false,
        refreshing: false,
      });
    } else {
      let paymentHistory = response.data.data;
      paymentHistory.map(
        (request) => (
          (request.showPayOption = false),
          (request.showDeclineOption = false),
          (request.showReleaseOption = false)
        )
      );
      this.setState({
        ...this.state,
        paymentHistory,
        loading: false,
        refreshing: false,
      });
      // console.log(paymentHistory);
    }
  };

  clickStatus = (value) => {
    // console.log(value);
    let paymentHistory = this.state.paymentHistory;
    paymentHistory.map(
      (request) => (
        (request.showPayOption = false),
        (request.showDeclineOption = false),
        (request.showReleaseOption = false)
      )
    );
    this.setState({ ...this.state, paymentHistory });
    let newValue = value.split("-");
    let status = newValue[0];
    let id = newValue[1];
    let oneReq = paymentHistory.find((req) => req.id == id);
    let theReqIndex = paymentHistory.findIndex((req) => req.id == id);
    status == "pay"
      ? ((oneReq.showPayOption = true),
        (oneReq.showDeclineOption = false),
        (oneReq.showReleaseOption = false))
      : status == "decline"
      ? ((oneReq.showPayOption = false),
        (oneReq.showDeclineOption = true),
        (oneReq.showReleaseOption = false))
      : status == "release"
      ? ((oneReq.showReleaseOption = true),
        (oneReq.showPayOption = false),
        (oneReq.showDeclineOption = false))
      : ((oneReq.showReleaseOption = false),
        (oneReq.showPayOption = false),
        (oneReq.showDeclineOption = false));
    // console.log(oneReq);
    paymentHistory[theReqIndex] = oneReq;

    this.setState({
      ...this.state,
      paymentHistory,
      showInputPin: false,
    });
  };

  payPayment = async (item) => {
    let amount = item.amount;
    let request_payment_id = item.id;
    let paymentStatus = "pay";
    this.setState({
      ...this.state,
      showInputPin: true,
      amount,
      request_payment_id,
      paymentStatus,
    });
  };

  verifyPin = async (pins) => {
    if (pins.length == 4) {
      this.setState({ ...this.state, load: true });
      let amount = this.state.amount;
      let project_id = this.props.project_id;
      let user_id = this.props.user_id;
      let request_payment_id = this.state.request_payment_id;
      let agreed_price = this.props.amount;
      let seller_id = this.props.seller_id;
      let pin = pins;
      let status = this.state.paymentStatus;
      if (status == "pay") {
        const response = await AuthApi.acceptPayment({
          amount,
          project_id,
          user_id,
          request_payment_id,
          agreed_price,
          pin,
        });
        console.log(response);
        if (response.status == 201) {
          let paymentHistory = response.data
            ? response.data.data
            : this.state.paymentHistory;
          let newAmount = response.data.balance;
          const getData = await frontStorage.asyncGet("userData");
          let userData = JSON.parse(getData);
          frontStorage.asyncStore(
            "userData",
            JSON.stringify({ ...userData, wallet: newAmount })
          );
          Toast.show(response.data.message, {
            duration: Toast.durations.LONG,
          });
          this.setState({
            ...this.state,
            load: false,
            showInputPin: false,
            paymentHistory,
          });
        } else {
          this.setState({
            ...this.state,
            load: false,
            showInputPin: false,
          });
          Toast.show(response.data.message, {
            duration: Toast.durations.LONG,
          });
        }
        this.clickStatus("no-" + request_payment_id);
      } else if (status == "decline") {
        const result = await AuthApi.declinePayment({
          project_id,
          request_payment_id,
          user_id,
          pin,
        });
        console.log("Decline payment response", result.data);
        if (result.status == 202) {
          let paymentHistory = result.data ? result.data.data : [];
          this.setState({
            ...this.state,
            load: false,
            showInputPin: false,
            paymentHistory,
          });
          Toast.show(result.data.message, {
            duration: Toast.durations.LONG,
          });
        } else {
          this.setState({
            ...this.state,
            load: false,
            showInputPin: false,
          });
          Toast.show(result.data.message, {
            duration: Toast.durations.LONG,
          });
        }
        this.clickStatus("no-" + request_payment_id);
      } else if (status == "release") {
        const response = await AuthApi.releaseFund({
          amount,
          project_id,
          request_payment_id,
          user_id,
          pin,
          seller_id,
        });
        // console.log("release response", response);
        if (response.status == 406) {
          this.setState({
            ...this.state,
            load: false,
            showInputPin: false,
          });
          Toast.show(response.data.message, {
            duration: Toast.durations.LONG,
          });
        } else if (response.status == 200) {
          this.requestHistory();
          this.setState({
            ...this.state,
            load: false,
            showInputPin: false,
          });
          Toast.show(response.data.message, {
            duration: Toast.durations.LONG,
          });
        }
      }
      this.clickStatus("no-" + request_payment_id);
    } else {
      Toast.show("Invalid Pin", { duration: Toast.durations.LONG });
      this.setState({ ...this.state, load: false });
    }
  };

  declinePayment = async (item) => {
    let request_payment_id = item.id;
    let paymentStatus = "decline";
    this.setState({
      ...this.state,
      showInputPin: true,
      request_payment_id,
      paymentStatus,
    });
  };

  releaseMoney = async (item) => {
    let amount = item.amount;
    let request_payment_id = item.id;
    let paymentStatus = "release";
    this.setState({
      ...this.state,
      showInputPin: true,
      request_payment_id,
      amount,
      paymentStatus,
    });
  };

  render() {
    const { theme } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <StatusBar style="light" animated={true} backgroundColor="#141414" />
        {this.state.loading ? (
          <Loading />
        ) : (
          <FlatList
            data={this.state.paymentHistory}
            keyExtractor={(request) => request.id.toString()}
            renderItem={({ item }) => (
              <RequestedList
                amount={item.amount}
                product={this.props.product}
                status={item.status}
                id={item.id}
                clickStatus={this.clickStatus}
                load={this.state.load}
                releasePayment={() => this.releaseMoney(item)}
                declinePayment={() => this.declinePayment(item)}
                payPayment={() => this.payPayment(item)}
                showPayOption={item.showPayOption}
                showDeclineOption={item.showDeclineOption}
                showReleaseOption={item.showReleaseOption}
                showInputPin={this.state.showInputPin}
                verifyPin={this.verifyPin}
              />
            )}
            ListEmptyComponent={
              <View
                style={{
                  flex: 1,
                  marginTop: "80%",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 25,
                    fontFamily: "ClarityCity-Bold",
                    color:
                      theme == "dark" ? darkTheme.primary : lightTheme.primary,
                  }}
                >
                  No Payment Has Been
                </Text>
                <Text
                  style={{
                    fontSize: 25,
                    fontFamily: "ClarityCity-Bold",
                    color:
                      theme == "dark" ? darkTheme.primary : lightTheme.primary,
                  }}
                >
                  Requested For This Product
                </Text>
              </View>
            }
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.onRefresh.bind(this)}
              />
            }
          />
        )}
      </View>
    );
  }
}

import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import AuthApi from "../../api/project";
import { Circle } from "react-native-animated-spinkit";
import Loading from "../../components/Loading";
import Modal from "react-native-modal";
import { AntDesign } from "@expo/vector-icons";
import PrimaryButton from "../../components/PrimaryButton";
import RequestHistory from "../../components/Requesthistory";
import Toast from "react-native-root-toast";
import lightTheme from "../../config/lightmodecolors";
import darkTheme from "../../config/darkmodecolors";
import frontStorage from "../../utilities/storage";
import { StatusBar } from "expo-status-bar";

export default class RequestPaymentScreen extends Component {
  constructor(props) {
    super(props),
      (this.state = {
        loading: false,
        loader: true,
        showModal: false,
        amount: "",
        description: "",
        paymentHistory: [],
        theme: "dark",
      });
  }
  async componentDidMount() {
    const getTheme = await frontStorage.asyncGet("mode");
    let currentTheme = getTheme ? JSON.parse(getTheme) : this.state.theme;
    this.setState({ ...this.state, theme: currentTheme });
    this.getAmount();
  }

  getAmount = (value) => {
    let agreed_price = this.props.amount;
    let paymentType = this.props.paymentType;
    paymentType == "full"
      ? this.setState({ ...this.state, amount: agreed_price })
      : this.setState({ ...this.state, amount: value });
  };
  getDescription = (value) => {
    this.setState({ ...this.state, description: value });
  };

  requestHistory = async () => {
    this.setState({ ...this.state, showModal: true });
    let project_id = this.props.project_id;
    const response = await AuthApi.requestPaymentHistory({
      project_id,
    });
    console.log("responxe", response);
    if (response.data == null) {
      this.setState({ ...this.state, paymentHistory: [], loader: false });
    } else {
      let paymentHistory = response.data.data;
      this.setState({ ...this.state, paymentHistory, loader: false });
    }
  };

  closeModal = () => {
    this.setState({ ...this.state, showModal: false });
  };

  toRequestPayment = async () => {
    let project_id = this.props.project_id;
    let user_id = this.props.user_id;
    let description = this.state.description;
    let status = "pending";
    let amount = this.state.amount;
    let agreed_price = this.props.amount;
    console.log(amount);

    if (amount > 0) {
      if (description != "") {
        this.setState({ ...this.state, loading: true });
        const result = await AuthApi.requestPayment({
          project_id,
          user_id,
          agreed_price,
          amount,
          description,
          status,
        });
        // console.log(result);
        this.props.paymentType !== "full" && this.textInput1.clear();
        this.textInput.clear();

        if (result.status == 201) {
          this.setState({ ...this.state, loading: false });
          Toast.show(result.data.message, {
            duration: Toast.durations.LONG,
          });
        } else {
          this.setState({ ...this.state, loading: false });
          Toast.show(result.data.message, {
            duration: Toast.durations.LONG,
          });
        }
      } else {
        Toast.show("Description can not be empty", {
          duration: Toast.durations.LONG,
        });
      }
    } else {
      Toast.show("Invalid Amount", {
        duration: Toast.durations.LONG,
      });
    }
  };

  render() {
    const { amount, paymentType } = this.props;
    const { theme } = this.state;

    return (
      <View style={{ marginTop: 20 }}>
        <StatusBar style="light" animated={true} backgroundColor="#141414" />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text
            style={[
              styles.text,
              {
                color: theme == "dark" ? darkTheme.primary : lightTheme.primary,
              },
            ]}
          >
            Agreed price ${amount}
          </Text>
          <TouchableOpacity
            style={{ alignSelf: "center" }}
            onPress={this.requestHistory}
          >
            <Text
              style={[
                styles.text2,
                requestStyle,
                {
                  color:
                    theme == "dark" ? darkTheme.primary : lightTheme.primary,
                },
              ]}
            >
              Request History
            </Text>
          </TouchableOpacity>
        </View>

        {paymentType != "full" ? (
          <View
            style={{
              marginTop: 31,
              backgroundColor: "#4A4A4A",
              borderRadius: 10,
              paddingHorizontal: 10,
              paddingVertical: 5,
            }}
          >
            <Text style={styles.text3}>Amount</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={{
                  fontSize: 16,
                  color: "#F5F5F5",
                  marginRight: 5,
                  fontFamily: "ClarityCity-Bold",
                }}
              >
                $
              </Text>
              <TextInput
                style={{
                  fontSize: 16,
                  color: "#F5F5F5",
                  fontFamily: "ClarityCity-Bold",
                }}
                onChangeText={(text) => this.getAmount(text)}
                ref={(input) => {
                  this.textInput1 = input;
                }}
              />
            </View>
          </View>
        ) : null}
        <View
          style={{
            marginTop: 25,
            marginBottom: 50,
            backgroundColor: "#4A4A4A",
            borderRadius: 10,
            paddingHorizontal: 10,
            paddingVertical: 10,
            height: 120,
          }}
        >
          <Text style={styles.text3}>Description*</Text>
          <TextInput
            style={{
              color: "#F5F5F5",
              fontSize: 14,
              fontFamily: "ClarityCity-Bold",
            }}
            onChangeText={(text) => this.getDescription(text)}
            ref={(input) => {
              this.textInput = input;
            }}
            multiline={true}
          />
        </View>
        {this.state.loading ? (
          <View style={styles.spin}>
            <Circle size={24} color="#F5F5F5" />
          </View>
        ) : (
          <PrimaryButton text="Request Now" onPress={this.toRequestPayment} />
        )}

        <Modal
          style={{ padding: 0, margin: 0, width: "100%" }}
          isVisible={this.state.showModal}
          hasBackdrop={false}
          animationIn="slideInUp"
          animationOut="slideOutDown"
        >
          <View
            style={{
              flex: 1,
              justifyContent: "flex-end",
              backgroundColor: "rgba(0,0,0,0.4)",
            }}
          >
            <View
              style={{
                backgroundColor:
                  theme == "dark" ? darkTheme.dark : lightTheme.dark,
                padding: 20,
                borderTopWidth: 4,
                borderRadius: 20,
              }}
            >
              <View>
                <TouchableOpacity
                  onPress={this.closeModal}
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    marginBottom: 5,
                  }}
                >
                  <AntDesign
                    name="close"
                    color={
                      this.state.theme == "dark"
                        ? darkTheme.primary
                        : lightTheme.primary
                    }
                    size={25}
                  />
                </TouchableOpacity>
                {this.state.loader ? (
                  <Loading />
                ) : (
                  <View>
                    {this.state.paymentHistory.length == 0 ? (
                      <Text
                        style={{
                          color:
                            theme == "dark"
                              ? darkTheme.primary
                              : lightTheme.primary,
                          fontSize: 16,
                          textAlign: "center",
                          textTransform: "uppercase",
                          fontFamily: "ClarityCity-Bold",
                        }}
                      >
                        No Payment Request History
                      </Text>
                    ) : (
                      <FlatList
                        data={this.state.paymentHistory}
                        keyExtractor={(list) => list.id.toString()}
                        renderItem={({ item }) => (
                          <RequestHistory
                            amount={item.amount}
                            date={item.updatedAt}
                            status={item.status}
                            released={item.amount_after_charges}
                          />
                        )}
                      />
                    )}
                  </View>
                )}
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const requestStyle = { textDecorationLine: "underline" };
const styles = StyleSheet.create({
  text: {
    color: "#F5F5F5",
    fontSize: 16,
    fontFamily: "ClarityCity-Bold",
  },

  text2: {
    color: "#F5F5F5",
    fontSize: 16,
    fontFamily: "ClarityCity-Regular",
  },
  text3: {
    fontSize: 10,
    fontWeight: "400",
    color: "#F5F5F5",
    fontFamily: "ClarityCity-Regular",
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

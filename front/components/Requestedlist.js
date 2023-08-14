import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import PaymentCode from "./Paymentcode";
import Modal from "react-native-modal";
import { AntDesign } from "@expo/vector-icons";

export default class RequestedList extends Component {
  constructor(props) {
    super(props), (this.state = {});
  }

  componentDidMount() {}

  render() {
    const {
      product,
      amount,
      id,
      status,
      clickStatus,
      declinePayment,
      payPayment,
      releasePayment,
      showReleaseOption,
      showDeclineOption,
      showPayOption,
      load,
      showInputPin,
    } = this.props;
    return (
      <View style={{ flex: 1, marginTop: 35 }}>
        <View>
          <View style={styles.card}>
            <View style={styles.text}>
              <Text style={styles.innerText1}>Payment request for</Text>
              <Text style={styles.innerText}>
                {product} | ${amount}
              </Text>
            </View>
            {status == "paid" && load == false ? (
              <TouchableOpacity
                onPress={() => clickStatus("release-" + id)}
                style={styles.releaseOption}
              >
                <Text style={[styles.innerText2, textStyle]}>Release</Text>
              </TouchableOpacity>
            ) : status == "decline" && load == false ? (
              <Text style={[styles.innerText2, declinedStyle]}>Declined</Text>
            ) : status == "released" && load == false ? (
              <View>
                <Text style={[styles.innerText2, fundStyle]}>
                  Fund has been released
                </Text>
              </View>
            ) : status == "pending" && load == false ? (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <TouchableOpacity onPress={() => clickStatus("pay-" + id)}>
                  <Text style={styles.innerText2}>Pay</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => clickStatus("decline-" + id)}>
                  <Text style={styles.innerText2}>Decline</Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>

          <Modal
            style={{ padding: 0, margin: 0, width: "100%" }}
            isVisible={showPayOption || showDeclineOption || showReleaseOption}
            hasBackdrop={true}
            animationIn="slideInUp"
            animationOut="slideOutDown"
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(0,0,0,0.9)",
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  clickStatus("no-" + id);
                }}
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  marginVertical: 10,
                  paddingHorizontal: 10,
                }}
              >
                <AntDesign name="close" color="#fff" size={35} />
              </TouchableOpacity>

              {showPayOption ? (
                <View style={{ alignItems: "center", marginTop: 20 }}>
                  {showInputPin ? (
                    <PaymentCode
                      text="Insert your pin"
                      text2="DONE"
                      verifyPin={this.props.verifyPin}
                      loading={load}
                    />
                  ) : (
                    <View style={styles.popUp}>
                      <Text style={styles.text1}>Are you sure to pay?</Text>
                      <Text style={styles.subtext1}>
                        By proceeding with payment, you are willing to transfer
                        the payment into the Escrow's account till you authorize
                        it's release into the seller's wallet.
                      </Text>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          marginTop: 20,
                        }}
                      >
                        <TouchableOpacity
                          style={styles.options}
                          onPress={payPayment}
                        >
                          <Text style={styles.text1}>Yes</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.options}
                          onPress={() => clickStatus("no-" + id)}
                        >
                          <Text style={styles.text1}>No</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </View>
              ) : showDeclineOption ? (
                <View style={{ alignItems: "center", marginTop: 20 }}>
                  {showInputPin ? (
                    <PaymentCode
                      text="Insert your pin"
                      text2="DONE"
                      verifyPin={this.props.verifyPin}
                      loading={load}
                    />
                  ) : (
                    <View style={styles.popUp}>
                      <Text style={styles.text1}>Are you sure to decline?</Text>
                      <Text style={styles.subtext1}>
                        Declining this payment means you're not willing to pay
                        for the Product(s)/Service(s) from the seller.
                      </Text>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          marginTop: 20,
                        }}
                      >
                        <TouchableOpacity
                          style={styles.options}
                          onPress={declinePayment}
                        >
                          <Text style={styles.text1}>Yes</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.options}
                          onPress={() => clickStatus("no-" + id)}
                        >
                          <Text style={styles.text1}>No</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </View>
              ) : showReleaseOption ? (
                <View style={{ alignItems: "center", marginTop: 20 }}>
                  {showInputPin ? (
                    <PaymentCode
                      text="Insert your pin"
                      text2="DONE"
                      verifyPin={this.props.verifyPin}
                      loading={load}
                    />
                  ) : (
                    <View style={styles.popUp}>
                      <Text style={styles.text1}>
                        Do you want to release fund?
                      </Text>
                      <Text style={styles.subtext1}>
                        By authorizing release of fund, you are saying that you
                        have received the product(s)/service(s) and it's up to
                        satisfactory. Hence, the fund be released into the
                        seller's wallet.
                      </Text>

                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          marginTop: 20,
                        }}
                      >
                        <TouchableOpacity
                          style={styles.options}
                          onPress={releasePayment}
                        >
                          <Text style={styles.text1}>Yes</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.options}
                          onPress={() => clickStatus("no-" + id)}
                        >
                          <Text style={styles.text1}>No</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </View>
              ) : null}
            </View>
          </Modal>
        </View>
      </View>
    );
  }
}

const declinedStyle = {
  textAlign: "center",
  fontWeight: "700",
  fontStyle: "italic",
};
const fundStyle = { textAlign: "center", fontStyle: "italic" };
const textStyle = { textAlign: "center" };
const styles = StyleSheet.create({
  card: {
    backgroundColor: "#3A4D8F",
    borderRadius: 10,
    paddingHorizontal: 35,
    paddingVertical: 40,
  },
  text: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
  },
  innerText: {
    color: "#F5F5F5",
    fontSize: 16,
    fontWeight: "300",
    marginBottom: 40,
  },
  innerText1: {
    color: "#F5F5F5",
    fontSize: 16,
    fontWeight: "700",
  },
  innerText2: {
    color: "#F5F5F5",
    fontSize: 14,
    fontWeight: "400",
  },
  popUp: {
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    width: "80%",
    padding: 20,
  },
  text1: {
    color: "#141414",
    textAlign: "center",
    fontFamily: "ClarityCity-Bold",
  },
  subtext1: {
    color: "#3A4D8F",
    textAlign: "center",
    fontSize: 12,
    fontFamily: "ClarityCity-Light",
    marginVertical: 10,
  },
  options: {
    width: "40%",
    borderColor: "#141414",
    borderRadius: 5,
    borderWidth: 1,
    paddingVertical: 3,
  },
  releaseOption: {
    width: "40%",
    borderColor: "#F5F5F5",
    borderRadius: 5,
    borderWidth: 1,
    paddingVertical: 3,
    alignSelf: "center",
  },
});

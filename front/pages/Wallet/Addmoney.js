import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { WebView } from "react-native-webview";
import PrimaryButton from "../../components/PrimaryButton";
import routes from "../../navigation/routes";
import { Circle } from "react-native-animated-spinkit";
import frontStorage from "../../utilities/storage";
import Toast from "react-native-root-toast";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import lightTheme from "../../config/lightmodecolors";
import darkTheme from "../../config/darkmodecolors";
import { StatusBar } from "expo-status-bar";
import AuthApi from "../../api/wallet";
import { useStripe } from "@stripe/stripe-react-native";
import Modal from "react-native-modal";

const AddMoney = (props) => {
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState({});
  const [amount, setAmount] = useState(0);
  const [theme, setTheme] = useState("dark");
  const [user, setUser] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showPaypalModal, setShowPaypalModal] = useState(false);
  const [paymentRecorded, setPaymentRecorded] = useState(false);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const initPage = async () => {
    const getData = await frontStorage.asyncGet("userData");
    const userData = getData && JSON.parse(getData);
    console.log("User Data", userData);
    setUser(userData);

    const getTheme = await frontStorage.asyncGet("mode");
    const currentTheme = getTheme ? JSON.parse(getTheme) : theme;
    setTheme(currentTheme);
  };

  useEffect(() => {
    initPage();
  }, []);

  const backScreen = () => {
    props.navigation.navigate(routes.MAINPAGE);
  };

  const getAmount = (amount) => {
    console.log(amount);
    setAmount(amount);
  };

  const addFund = async () => {
    setShowModal(false);
    const payment_ref =
      user.id + "" + Math.floor(100000000 + Math.random() * 900000000);
    const response = await AuthApi.addMoney({
      user_id: user.id,
      amount,
      transaction_type: "Credit",
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
      setLoading(false);
      Toast.show(newResponse.message, {
        duration: Toast.durations.LONG,
      });
      props.navigation.navigate(routes.MAINPAGE, { newAmount });
    } else {
      Toast.show("Payment Not Successful", {
        duration: Toast.durations.LONG,
      });
    }
  };

  const addMoney = async (mode) => {
    setLoading(true);
    if (mode == "stripe") {
      const response = await AuthApi.createPaymentIntent({
        amount: Math.floor(amount * 100),
      });
      if (response.error) {
        Toast.show("An error occured!", { duration: Toast.durations.LONG });
        return;
      }

      const initResponse = await initPaymentSheet({
        merchantDisplayName: "Eskrobytes",
        paymentIntentClientSecret: response.data.paymentIntent,
      });

      if (initResponse.error) {
        console.log(initResponse.error);
        Toast.show("An error occured!", { duration: Toast.durations.LONG });
        return;
      }

      const paymentResponse = await presentPaymentSheet();
      console.log("Payment Response", paymentResponse);
      if (paymentResponse.error) {
        Toast.show("An error occured!", { duration: Toast.durations.LONG });
        return;
      }
      addFund();
    } else if (mode == "paypal") {
      setShowPaypalModal(true);
      setPaymentRecorded(false);
    }
  };

  const handlePaypalResponse = (data) => {
    console.log("Paypal response is >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
    if (data.title == "Success" && !paymentRecorded) {
      console.log(
        "Paypal response is successful>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
      );
      setShowPaypalModal(false);
      setPaymentRecorded(true);
      addFund();
    } else if (data.title == "Cancel") {
      Toast.show("An error occured!", { duration: Toast.durations.LONG });
      setShowPaypalModal(false);
      setLoading(false);
    }
  };

  const choosePaymentMode = async () => {
    console.log(amount);
    if (amount > 0) {
      setShowModal(true);
    } else {
      Toast.show("Type an amount please", { duration: Toast.durations.LONG });
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: lightTheme.dark,
        },
      ]}
    >
      <StatusBar style="light" animated={true} backgroundColor="#141414" />
      <TouchableOpacity onPress={backScreen}>
        <Ionicons name="chevron-back-outline" size={30} color="#3A4D8F" />
      </TouchableOpacity>
      <Text style={[styles.text0, { color: "#141414" }]}>Amount</Text>
      <View
        style={{
          marginTop: 40,
          marginBottom: 60,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={[
            styles.dollar,
            {
              color: "#141414",
              paddingHorizontal: 5,
            },
          ]}
        >
          $
        </Text>
        <TextInput
          style={[
            styles.inputfield,
            {
              // borderWidth: 1,
              // borderColor: "#fff",
              color: "#141414",
              width: 100,
            },
          ]}
          autoFocus
          onChangeText={(amount) => getAmount(amount)}
          keyboardType="numeric"
        />
      </View>
      {loading ? (
        <View style={styles.spin}>
          <Circle size={24} color="#BC990A" />
        </View>
      ) : (
        <PrimaryButton text="Add Money" onPress={choosePaymentMode} />
      )}

      <Modal
        style={{ padding: 0, margin: 0, width: "100%" }}
        isVisible={showModal}
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
              backgroundColor: "#666",
              borderTopWidth: 4,
              borderTopColor: "#BC990A",
              borderRadius: 15,
            }}
          >
            <TouchableOpacity
              onPress={() => setShowModal(false)}
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                marginVertical: 10,
                paddingHorizontal: 10,
              }}
            >
              <AntDesign name="close" color={"#f5f5f5"} size={25} />
            </TouchableOpacity>
            <Text
              style={{
                color: "#f5f5f5",
                fontFamily: "ClarityCity-Bold",
                fontSize: 20,
                paddingVertical: 5,
                paddingHorizontal: 20,
              }}
            >
              Make Payment
            </Text>
            <View
              style={{
                paddingVertical: 30,
                paddingHorizontal: 10,
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                style={{
                  padding: 5,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={() => addMoney("stripe")}
              >
                <Image
                  source={require("../../assets/stripe_logo.png")}
                  style={{ width: 50, height: 50 }}
                />
                <Text
                  style={{ color: "#f5f5f5", fontFamily: "ClarityCity-Bold" }}
                >
                  Stripe
                </Text>
              </TouchableOpacity>

              {/* <TouchableOpacity
                style={{
                  padding: 5,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={() => {
                  addMoney("paypal");
                }}
              >
                <Image
                  source={require("../../assets/paypal_logo.png")}
                  style={{ width: 50, height: 50, borderRadius: 10 }}
                />
                <Text
                  style={{ color: "#f5f5f5", fontFamily: "ClarityCity-Bold" }}
                >
                  Paypal
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  padding: 5,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  source={require("../../assets/bank_transfer_logo.png")}
                  style={{ width: 50, height: 50, borderRadius: 10 }}
                />
                <Text
                  style={{ color: "#f5f5f5", fontFamily: "ClarityCity-Bold" }}
                >
                  Transfer
                </Text>
              </TouchableOpacity> */}
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        style={{ padding: 0, margin: 0, width: "100%" }}
        isVisible={showPaypalModal}
        hasBackdrop={false}
        animationIn="slideInUp"
        animationOut="slideOutDown"
      >
        <WebView
          source={{
            uri: "http://157.230.111.222:8080/api/v1/paypal/payment-page",
          }}
          onNavigationStateChange={(data) => handlePaypalResponse(data)}
          injectedJavaScript={
            "document.getElementById('price').value=" +
            amount +
            ";document.f1.submit()"
          }
        />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 60,
    paddingBottom: 30,
  },
  text0: {
    fontSize: 16,
    fontFamily: "ClarityCity-Bold",
    textAlign: "center",
    marginTop: 100,
  },
  dollar: {
    fontSize: 30,
    fontFamily: "ClarityCity-Bold",
  },
  inputfield: {
    fontSize: 32,
    height: 40,
    fontFamily: "ClarityCity-Bold",
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

export default AddMoney;

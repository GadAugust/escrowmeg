import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  RefreshControl,
} from "react-native";
import Modal from "react-native-modal";
import { Circle } from "react-native-animated-spinkit";
import lightTheme from "../../config/lightmodecolors";
import darkTheme from "../../config/darkmodecolors";
import routes from "../../navigation/routes";
import frontStorage from "../../utilities/storage";
import static_variable from "../../constants/static_variable";
import AuthApi from "../../api/auth";
import Loading from "../../components/Loading";
import PrimaryButton from "../../components/PrimaryButton";
import myFonts from "../../config/fontfamily";
import * as Font from "expo-font";
import { Formik } from "formik";
import Toast from "react-native-root-toast";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import BankAccount from "../../components/Bankaccount";
import { StatusBar } from "expo-status-bar";
import TopBar from "../../components/TopBar";

export default class AllAccountsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      loading: true,
      loader: false,
      bankAccount: [],
      fontsLoaded: false,
      refreshing: false,
      theme: "dark",
    };
  }

  async componentDidMount() {
    const getTheme = await frontStorage.asyncGet("mode");
    let currentTheme = getTheme ? JSON.parse(getTheme) : this.state.theme;
    this.getAllBanks();
    await Font.loadAsync(myFonts);
    this.setState({ ...this.state, fontsLoaded: true, theme: currentTheme });
  }

  onRefresh = () => {
    this.setState({
      ...this.state,
      refreshing: true,
      showModal: false,
      loading: true,
      loader: false,
      bankAccount: [],
    });
    this.getAllBanks();
  };

  getAllBanks = async () => {
    const getData = await frontStorage.asyncGet("userData");
    let userData = JSON.parse(getData);
    let user_id = userData.id;
    // console.log(user_id)
    const response = await AuthApi.fetchAccounts({ user_id });
    response.data == null
      ? this.setState({
          ...this.state,
          bankAccount: [],
          loading: false,
          refreshing: false,
        })
      : this.setState({
          ...this.state,
          bankAccount: response.data.data,
          loading: false,
          refreshing: false,
        });
  };

  backScreen = () => {
    this.props.navigation.navigate(routes.MAINPAGE);
  };

  handleAddAccount = async (values) => {
    this.setState({ ...this.state, loader: true });

    if (
      values.account_name != "" &&
      typeof values.account_name === "string" &&
      values.account_name >= 0 &&
      values.account_name <= 0 &&
      values.bank_name != "" &&
      typeof values.bank_name === "string" &&
      values.bank_name >= 0 &&
      values.bank_name <= 0 &&
      values.account_number > 0 &&
      values.account_number.length == 10
    ) {
      this.setState({ ...this.state, loader: true });
      const getData = await frontStorage.asyncGet("userData");
      let data = JSON.parse(getData);
      let account_name = values.account_name.trim();
      let account_number = values.account_number.trim();
      let bank_name = values.bank_name.trim();
      let userId = data.id;
      const response = await AuthApi.addAccountDetails({
        account_name,
        bank_name,
        account_number,
        userId,
      });
      let newResponse = response.data;
      console.log(response);
      if (response.status == 406) {
        this.setState({ ...this.state, loader: false });
        Toast.show(newResponse.message, { duration: Toast.durations.LONG });
      } else if (response.status == 202) {
        Toast.show(newResponse.message, { duration: Toast.durations.LONG });
        this.getAllBanks();
        this.setState({ ...this.state, showModal: false, loader: false });
      } else {
        this.setState({ ...this.state, loader: false });
      }
    } else {
      this.setState({ ...this.state, loader: false });
      Toast.show("One or more input(s) missing", {
        duration: Toast.durations.LONG,
      });
    }
  };

  openBottomsheet = async () => {
    [this.setState({ ...this.state, showModal: true })];
  };

  withdraw = (id) => {
    // console.log(id)
    let allAccount = this.state.bankAccount;
    let newAccount = allAccount.find((account) => account.id == id);
    // console.log(newAccount);

    static_variable.selectedAccount = newAccount;

    this.props.navigation.navigate(routes.WALLETWITHDRAW);
  };

  render() {
    const { fontsLoaded, theme } = this.state;
    if (!fontsLoaded) {
      return <Loading />;
    }
    const renderItem = ({ item }) => (
      <BankAccount
        account_name={item.account_name}
        account_num={item.account_number}
        bank_name={item.bank_name}
        theme={this.state.theme}
        onPress={() => this.withdraw(item.id)}
      />
    );

    const getHeader = () => {
      return (
        <>
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
            headerText="Bank Account"
            useBack={true}
            backFunc={this.backScreen}
          />
          <View style={{ marginTop: 20 }}></View>
        </>
      );
    };

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
        {this.state.loading ? (
          <Loading />
        ) : (
          <>
            <FlatList
              data={this.state.bankAccount}
              keyExtractor={(userId) => userId.id.toString()}
              renderItem={renderItem}
              ListHeaderComponent={getHeader}
              ListEmptyComponent={
                <View
                  style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      color:
                        theme == "dark"
                          ? darkTheme.primary
                          : lightTheme.primary,

                      fontSize: 15,
                      marginBottom: 10,
                      fontFamily: "ClarityCity-Bold",
                    }}
                  >
                    No account details added yet
                  </Text>
                  <Image source={require("../../assets/nobank.png")} />
                </View>
              }
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this.onRefresh.bind(this)}
                />
              }
            />

            <TouchableOpacity
              style={[
                styles.floatView,
                {
                  backgroundColor:
                    theme == "dark" ? darkTheme.primary : lightTheme.dark,
                },
              ]}
              onPress={this.openBottomsheet}
            >
              <AntDesign
                name="plus"
                size={24}
                color={
                  theme == "dark" ? darkTheme.secondary : lightTheme.secondary
                }
              />
            </TouchableOpacity>
          </>
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
                alignItems: "center",
                backgroundColor:
                  theme == "dark" ? darkTheme.dark : lightTheme.dark,
                padding: 15,
                borderTopColor:
                  theme == "dark" ? darkTheme.dark : lightTheme.dark,

                borderTopWidth: 4,
                borderRadius: 25,
              }}
            >
              <Formik
                initialValues={{
                  account_name: "",
                  bank_name: "",
                  account_number: "",
                }}
                onSubmit={(values) => this.handleAddAccount(values)}
              >
                {({ handleChange, handleBlur, handleSubmit, values }) => (
                  <View>
                    <TouchableOpacity
                      onPress={() =>
                        this.setState({ ...this.state, showModal: false })
                      }
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
                    <View style={styles.mainbox}>
                      <View style={styles.boxfield}>
                        <Text style={styles.labelfield}>Account Name</Text>
                        <TextInput
                          style={styles.inputfield}
                          onChangeText={handleChange("account_name")}
                          onBlur={handleBlur("account_name")}
                          value={values.account_name}
                        />
                      </View>
                      <View style={styles.boxfield}>
                        <Text style={styles.labelfield}>Bank Name</Text>
                        <TextInput
                          style={styles.inputfield}
                          onChangeText={handleChange("bank_name")}
                          onBlur={handleBlur("bank_name")}
                          value={values.bank_name}
                        />
                      </View>
                      <View style={styles.boxfield}>
                        <Text style={styles.labelfield}>Account Number</Text>
                        <TextInput
                          style={styles.inputfield}
                          keyboardType="numeric"
                          onChangeText={handleChange("account_number")}
                          onBlur={handleBlur("account_number")}
                          value={values.account_number}
                        />
                      </View>
                    </View>
                    {this.state.loader ? (
                      <View style={styles.spin}>
                        <Circle size={24} color="#F5F5F5" />
                      </View>
                    ) : (
                      <PrimaryButton text="Add Bank" onPress={handleSubmit} />
                    )}
                  </View>
                )}
              </Formik>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 60,
    paddingBottom: 30,
  },
  mainbox: {
    marginTop: 10,
  },

  boxfield: {
    backgroundColor: "#4A4A4A",
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingTop: 6,
    height: 45,
    width: 300,
    marginBottom: 20,
  },
  labelfield: {
    color: "#F5F5F5",
    fontSize: 10,
    fontFamily: "ClarityCity-Regular",
  },
  inputfield: {
    color: "#F5F5F5",
    paddingVertical: -20,
    fontSize: 13,
    height: 20,
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
  floatView: {
    position: "absolute",
    width: 50,
    height: 50,
    bottom: 40,
    right: 20,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    elevation: 3,
  },
});

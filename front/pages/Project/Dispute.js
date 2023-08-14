import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  RefreshControl,
} from "react-native";
import Modal from "react-native-modal";
import Toast from "react-native-root-toast";
import frontStorage from "../../utilities/storage";
import { Circle } from "react-native-animated-spinkit";
import AuthApi from "../../api/project";
import PrimaryButton from "../../components/PrimaryButton";
import DisputeChat from "../../components/DisputeChat";
import * as DocumentPicker from "expo-document-picker";
import mime from "mime";
import { AntDesign } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { Entypo } from "@expo/vector-icons";
import Colors from "../../config/colors";
import Loading from "../../components/Loading";

export default class DisputeScreen extends Component {
  receiver_id = 0;
  role = "";
  constructor(props) {
    super(props);
    this.state = {
      firstname: "",
      subjectText: "",
      complainText: "",
      counter: 0,
      loading: false,
      editable: true,
      selectedFileName: null,
      messagesArray: [],
      document: {},
      refreshing: false,
      loadingData: false,
    };
  }

  componentDidMount() {
    let sender_id = this.props.user_id;
    let seller_id = this.props.seller_id;
    this.receiver_id =
      sender_id == seller_id ? this.props.buyer_id : this.props.seller_id;
    this.role = seller_id == sender_id ? "seller" : "buyer";

    console.log(this.receiver_id, this.role);
    this.fetchDisputes();
  }

  setTicketStatus = (status) => {
    status == "open"
      ? this.setState({
          ...this.state,
          showModal: true,
          selectedImage0: null,
          selectedImage1: null,
          selectedImage2: null,
          selectedImage3: null,
        })
      : this.setState({ ...this.state, showModal: false });
  };

  complainText = (value) => {
    let mLength = value.length;
    if (mLength > 0) {
      this.setState({
        ...this.state,
        counter: mLength,
        complainText: value,
      });
    } else {
      this.setState({ ...this.state, counter: 0 });
    }
  };

  subjectText = (text) => {
    this.setState({ ...this.state, subjectText: text });
  };

  chooseImage = async () => {
    const files = await DocumentPicker.getDocumentAsync();
    console.log(files);
    const document = {
      uri: files.uri,
      name: files.name,
      type: files.mimeType,
    };
    this.setState({ ...this.state, selectedFileName: files.name, document });
  };

  sendMessage = async () => {
    console.log("Start dispute>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
    const getData = await frontStorage.asyncGet("userData");
    let userData = JSON.parse(getData);
    let user_id = parseInt(userData.id);
    let project_id = parseInt(this.props.project_id);
    let subject = this.state.subjectText;
    let complain = this.state.complainText;

    if (subject != "" && complain != "") {
      this.setState({ ...this.state, loading: true });
      const data = new FormData();
      data.append("name", "Document Upload");
      data.append("file", this.state.document);
      data.append("user_id", user_id);
      data.append("admin_id", 0);
      data.append("role", this.role);
      data.append("subject", subject);
      data.append("complain", complain);
      data.append("project_id", Number(project_id));
      data.append("receiver_id", parseInt(this.receiver_id));

      const response = await AuthApi.raiseDispute(data);
      console.log("Dispute Response", response.data);
      if (response.data) {
        const oldMessages = [...this.state.messagesArray];
        oldMessages.push(response.data.data);
        this.setState({
          ...this.state,
          messagesArray: oldMessages,
          showModal: false,
          loading: false,
        });
      } else {
        this.setState({
          ...this.state,
          showModal: false,
          loading: false,
        });
        this.fetchDisputes();
      }

      Toast.show(response.data.message, {
        duration: Toast.durations.LONG,
      });
    } else {
      Toast.show("Compain or Subject can not be empty!", {
        duration: Toast.durations.LONG,
        position: 100,
        shadow: true,
        backgroundColor: "#fff",
        textColor: "#333",
      });
    }
  };

  fetchDisputes = async () => {
    this.setState({
      ...this.state,
      loadingData: true,
    });
    let project_id = this.props.project_id;
    const response = await AuthApi.fetchDisputes({
      project_id,
    });
    console.log("disputes", response.data);
    this.setState({
      ...this.state,
      messagesArray: response.data ? response.data.data : [],
    });
  };

  onRefresh = () => {
    console.log("Refreshing>>>>>>>>>>>>>>>>>>>>");
    this.setState({
      ...this.state,
      firstname: "",
      subjectText: "",
      complainText: "",
      counter: 0,
      loading: false,
      editable: true,
      selectedFileName: null,
      messagesArray: [],
      document: {},
      loadingData: true,
    });
    this.fetchDisputes();
  };

  render() {
    return (
      <View style={styles.mainView}>
        <StatusBar style="light" animated={true} backgroundColor="#141414" />
        {this.state.messagesArray.length > 0 ? (
          <View>
            <View style={{ marginBottom: 20, alignItems: "flex-start" }}>
              <TouchableOpacity
                onPress={() => this.setTicketStatus("open")}
                style={styles.button}
              >
                <Text style={[styles.text, textStyle]}>Contribute</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={this.state.messagesArray}
              keyExtractor={(message) => message.id.toString()}
              renderItem={({ item }) => (
                <DisputeChat
                  complainText={item.complain}
                  firstname={item.user.first_name}
                  subText={item.subject}
                  image={item.img_url ? item.img_url : null}
                  onRefresh={this.onRefresh.bind(this)}
                />
              )}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this.onRefresh}
                />
              }
            />
          </View>
        ) : this.state.loadingData ? (
          <Loading />
        ) : (
          <View style={styles.disputeView}>
            <TouchableOpacity
              onPress={() => this.setTicketStatus("open")}
              style={styles.button}
            >
              <Text style={[styles.text, textStyle]}>Raise a ticket</Text>
            </TouchableOpacity>
          </View>
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
                backgroundColor: "#141414",
                padding: 20,
                borderTopWidth: 4,
                borderRadius: 20,
              }}
            >
              <View>
                <TouchableOpacity
                  onPress={() => this.setTicketStatus("close")}
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    marginBottom: 5,
                  }}
                >
                  <Image source={require("../../assets/cancel.png")} />
                </TouchableOpacity>
                <View style={{ marginTop: 25 }}>
                  <Text style={styles.text3}>Subject</Text>
                  <View
                    style={{
                      backgroundColor: "#4A4A4A",
                      borderRadius: 10,
                      paddingHorizontal: 10,
                      paddingVertical: 10,
                    }}
                  >
                    <TextInput
                      style={{
                        fontSize: 14,
                        fontFamily: "ClarityCity-Bold",
                        color: "#F5F5F5",
                      }}
                      onChangeText={(text) => this.subjectText(text)}
                    />
                  </View>
                </View>
                <View style={{ marginTop: 20, marginBottom: 20 }}>
                  <Text style={styles.text3}>Complain</Text>
                  <View
                    style={{
                      backgroundColor: "#4A4A4A",
                      borderRadius: 10,
                      paddingHorizontal: 10,
                      height: 120,
                    }}
                  >
                    <TextInput
                      style={styles.ticketText}
                      editable={this.state.editable}
                      multiline={true}
                      onChangeText={(text) => this.complainText(text)}
                    />
                    <View
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        alignItems: "flex-end",
                        justifyContent: "flex-end",
                      }}
                    >
                      <Text style={styles.text}>{this.state.counter}/500</Text>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    marginBottom: 10,
                    flexDirection: "row",
                    justifyContent: "flex-start",
                  }}
                >
                  <TouchableOpacity onPress={() => this.chooseImage()}>
                    <Entypo name="attachment" size={24} color="#F5F5F5" />
                  </TouchableOpacity>

                  {this.state.selectedFileName && (
                    <Text
                      style={{
                        color: "white",
                        marginStart: 5,
                        fontFamily: "ClarityCity-Regular",
                      }}
                    >
                      {this.state.selectedFileName}
                    </Text>
                  )}
                </View>
              </View>
              {this.state.loading ? (
                <View style={styles.spin}>
                  <Circle size={24} color="#F5F5F5" />
                </View>
              ) : (
                <PrimaryButton text="Send" onPress={this.sendMessage} />
              )}
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const textStyle = { color: "#F5F5F5", textAlign: "center" };

const styles = StyleSheet.create({
  box1: {
    backgroundColor: "#141414",
    padding: 20,
    borderTopWidth: 4,
    borderTopColor: "#F5F5F5",
    borderRadius: 5,
  },
  text: {
    color: "#AFAFAF",
    fontSize: 14,
    fontFamily: "ClarityCity-Regular",
  },
  disputeView: {
    flexDirection: "row",
    justifyContent: "center",
  },
  imageborder: {
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    width: 75,
    height: 50,
    overflow: "hidden",
    marginRight: 5,
  },
  button: {
    backgroundColor: "#3A4D8F",
    borderRadius: 10,
    height: 35,
    justifyContent: "center",
    paddingHorizontal: 15,
  },
  dispute: {
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    height: 35,
    justifyContent: "center",
    paddingHorizontal: 15,
  },
  mainView: {
    flex: 1,
    marginTop: 15,
    paddingBottom: 30,
  },

  text3: {
    color: "#F5F5F5",
    fontSize: 10,
    fontFamily: "ClarityCity-Regular",
    marginLeft: 5,
  },
  ticketText: {
    color: "#F5F5F5",
    fontSize: 14,
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

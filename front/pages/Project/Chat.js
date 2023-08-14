import React, { Component } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Circle } from "react-native-animated-spinkit";
import frontStorage from "../../utilities/storage";
import Loading from "../../components/Loading";
import AuthApi from "../../api/project";
import Toast from "react-native-root-toast";
import Colors from "../../config/colors";
import ChatScreen from "../../components/ChatScreen";
import { Flow } from "react-native-animated-spinkit";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { io } from "socket.io-client";
const socket = io.connect("http://192.168.0.137:5000");

export default class Chat extends Component {
  receiver_id = "";

  constructor(props) {
    super(props),
      (this.state = {
        typing: false,
        loading: true,
        loader: false,
        counter: 0,
        firstname: "",
        message: "",
        receiver_id: "",
        chatArray: [],
      });
  }

  componentDidMount() {
    // console.log("Props in chat", this.props);
    let sender_id = this.props.user_id;
    console.log(sender_id);
    sender_id == this.props.seller_id
      ? (this.receiver_id = this.props.buyer_id)
      : (this.receiver_id = this.props.seller_id);
    this.fetchMessages();

    socket.emit("subscribe", `room-${this.props.project_id}`);

    socket.on("message", (message) => {
      let prevMessages = [...this.state.chatArray];
      prevMessages.push(message);
      this.setState({ ...this.state, chatArray: prevMessages });
    });
  }

  sendMessage = async () => {
    let message = this.state.message;
    let sender_id = this.props.user_id;
    let project_id = this.props.project_id;
    let receiver_id = this.state.receiver_id;
    let myDate = new Date().toJSON();
    let messageObj = {
      message: this.state.message,
      sender_id: this.props.user_id,
    };

    if (message.length > 0) {
      this.textInput.clear();
      this.setState({ ...this.state, loader: true });
      const response = await AuthApi.sendMessage({
        project_id,
        receiver_id,
        sender_id,
        message,
      });

      console.log("Mesage resp", response.data);
      if (response.status == 201) {
        Toast.show(response.data.message, {
          duration: Toast.durations.LONG,
        });
        response.data && socket.emit("message", response.data.data);
        this.setState({ ...this.state, loader: false });
      } else {
        Toast.show(response.data.message, {
          duration: Toast.durations.LONG,
        });
        this.setState({ ...this.state, loader: false });
      }
    } else {
      Toast.show("Message is empty", {
        duration: Toast.durations.LONG,
      });
    }
  };

  fetchMessages = async () => {
    let project_id = this.props.project_id;
    // console.log(sender_id, project_id, reciever_id);

    const response = await AuthApi.fetchMesssages({
      project_id,
    });
    // console.log(response);
    if (response.data == null) {
      this.setState({
        ...this.state,
        chatArray: [],
        loading: false,
      });
    } else {
      let chatArray = response.data.data;
      console.log("Chat list", chatArray);
      this.setState({
        ...this.state,
        chatArray,
        loading: false,
      });
    }
  };

  textMessage = async (value) => {
    let mLength = value.length;
    const getData = await frontStorage.asyncGet("userData");
    let userData = JSON.parse(getData);
    let firstname = userData.first_name;
    let sender_id = this.props.user_id;
    sender_id == this.props.seller_id
      ? this.setState({ ...this.state, receiver_id: this.props.buyer_id })
      : this.setState({ ...this.state, receiver_id: this.props.seller_id });

    // console.log(user_id, receiver_id, sender_id);
    if (mLength > 0) {
      this.setState({
        ...this.state,
        typing: true,
        counter: mLength,
        message: value,
        firstname,
      });
    } else {
      this.setState({ ...this.state, typing: false, counter: 0 });
    }
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar style="light" animated={true} backgroundColor="#141414" />
        <View style={{ flex: 1, marginTop: 10, marginBottom: "20%" }}>
          {this.state.loading ? (
            <Loading />
          ) : (
            <>
              {this.state.chatArray.length == 0 ? null : (
                <FlatList
                  data={this.state.chatArray}
                  ref={(ref) => (this.flatList = ref)}
                  keyExtractor={(message) => message.id.toString()}
                  onContentSizeChange={() =>
                    this.flatList.scrollToEnd({ animated: true })
                  }
                  onLayout={() => this.flatList.scrollToEnd({ animated: true })}
                  renderItem={({ item }) => (
                    <ChatScreen
                      message={item.message}
                      date={item.createdAt}
                      sender={item.sender_id}
                      user_id={this.props.user_id}
                    />
                  )}
                />
              )}
            </>
          )}
        </View>

        <View style={styles.floatView}>
          {/* {this.state.typing ? (
            <Text style={[styles.counter, italicText]}>
              {this.state.firstname} is typing{" "}
              <Flow size={15} color={Colors.chatcolor} />
            </Text>
          ) : (
            <></>
          )} */}
          <View style={styles.textBox}>
            <TextInput
              style={styles.textStyle}
              multiline={true}
              placeholder="Enter message"
              placeholderTextColor={Colors.chatcolor}
              ref={(input) => {
                this.textInput = input;
              }}
              onChangeText={(message) => this.textMessage(message)}
            />
            {this.state.loader ? (
              <View style={{ justifyContent: "flex-end" }}>
                <Circle size={18} color={Colors.tertiary} />
              </View>
            ) : (
              <TouchableOpacity
                style={{ justifyContent: "flex-end" }}
                onPress={this.sendMessage}
              >
                <Ionicons
                  name="send-sharp"
                  size={20}
                  color={Colors.secondary}
                />
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.counter}>{this.state.counter}/1000</Text>
        </View>
      </View>
    );
  }
}
const italicText = { fontStyle: "italic", textAlign: "left", marginLeft: 15 };

const styles = StyleSheet.create({
  counter: {
    color: Colors.chatcolor,
    fontSize: 10,
    fontFamily: "ClarityCity-Regular",
    textAlign: "right",
    marginRight: 3,
  },
  textBox: {
    flexDirection: "row",
    borderColor: Colors.chatcolor,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  textStyle: {
    color: Colors.primary,
    fontSize: 14,
    fontFamily: "ClarityCity-Regular",
    width: "95%",
  },
  floatView: {
    position: "absolute",
    backgroundColor: Colors.dark,
    right: 20,
    top: "90%",
    zIndex: 100,
    width: "90%",
  },
});

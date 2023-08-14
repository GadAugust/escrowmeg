import React, { Component } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import frontStorage from "../utilities/storage";
import AuthApi from "../api/auth";
import routes from "../navigation/routes";
import Toast from "react-native-root-toast";
import { StatusBar } from "expo-status-bar";

export default class ProfilePictureScreen extends Component {
  constructor(props) {
    super(props), (this.state = { selectedImage: null });
  }

  nextScreen = () => {
    this.props.navigation.navigate(routes.TRANSACTIONPIN);
  };

  handleUpload = async () => {
    const getData = await frontStorage.asyncGet("userData");
    let userData = JSON.parse(getData);
    let user_id = userData.id;
    console.log(user_id);
    const formData = new FormData();
    formData.append({
      file: this.state.selectedImage,
      userId: user_id,
    });

    // console.log(formData._parts[0][0]);

    try {
      const response = await AuthApi.addProfilePics({
        method: "POST",
        body: formData._parts[0][0],
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("response", response);
    } catch (error) {
      console.log(error);
    }
  };

  handleSelectImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (result.canceled) {
      Toast.show("Cancelled", {
        duration: Toast.durations.LONG,
      });
    } else {
      this.setState({ selectedImage: result.assets[0].uri });
      this.handleUpload();
    }
  };

  render() {
    const { selectedImage } = this.state;
    return (
      <View style={styles.container}>
        <StatusBar style="light" animated={true} backgroundColor="#141414" />
        <Image
          style={{ alignSelf: "center" }}
          source={require("../assets/escrobyteslogo.png")}
        />
        <Text style={styles.text}>Complete your profile</Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            paddingTop: 70,
          }}
        >
          <View style={styles.imageborder}>
            {selectedImage && (
              <>
                <Image
                  source={{ uri: selectedImage }}
                  style={{ width: 150, height: 150 }}
                />
              </>
            )}
          </View>
          <TouchableOpacity
            onPress={() => this.handleSelectImage()}
            style={styles.change}
          >
            <Image source={require("../assets/profilechange.png")} />
          </TouchableOpacity>
        </View>
        <Text style={styles.text2}>
          Your profile should not be more than 2MB
        </Text>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingTop: 150,
            marginHorizontal: 30,
          }}
        >
          <Text onPress={this.nextScreen} style={styles.text3}>
            SKIP
          </Text>
          <Text onPress={this.nextScreen} style={styles.text3}>
            NEXT
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#141414",
    paddingHorizontal: 10,
    paddingTop: 60,
    paddingBottom: 30,
  },
  text: {
    color: "#6280E8",
    fontSize: 16,
    fontFamily: "ClarityCity-Bold",
    paddingTop: 40,
    textAlign: "center",
  },
  text2: {
    color: "#F5F5F5",
    fontSize: 16,
    fontFamily: "ClarityCity-Regular",
    textAlign: "center",
    marginHorizontal: 70,
    paddingTop: 20,
  },
  text3: {
    color: "#6280E8",
    fontSize: 16,
    fontFamily: "ClarityCity-Bold",
  },
  imageborder: {
    borderRadius: 80,
    backgroundColor: "#3A4D8F",
    width: 140,
    height: 140,
    overflow: "hidden",
  },
  change: {
    position: "absolute",
    left: 180,
    top: 170,
  },
});

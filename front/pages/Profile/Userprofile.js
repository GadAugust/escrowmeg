import React, { Component } from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import myFonts from "../../config/fontfamily";
import * as Font from "expo-font";
import Loading from "../../components/Loading";
import lightTheme from "../../config/lightmodecolors";
import darkTheme from "../../config/darkmodecolors";
import PrimaryButton from "../../components/PrimaryButton";
import frontStorage from "../../utilities/storage";
import { FontAwesome } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import TopBar from "../../components/TopBar";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-root-toast";
import mime from "mime";
import AuthApi from "../../api/auth";

export default class UserProfile extends Component {
  constructor(props) {
    super(props),
      (this.state = {
        firstname: "",
        lastname: "",
        occupation: "",
        phone: "",
        theme: "dark",
        selectedImage: null,
      });
  }

  async componentDidMount() {
    const getTheme = await frontStorage.asyncGet("mode");
    let currentTheme = getTheme ? JSON.parse(getTheme) : this.state.theme;
    this.getData();
    await Font.loadAsync(myFonts);
    this.setState({ ...this.state, fontsLoaded: true, theme: currentTheme });
  }

  getData = async () => {
    const getData = await frontStorage.asyncGet("userData");
    let userData = JSON.parse(getData);
    console.log("UserData", userData);
    let firstname = userData.first_name;
    let lastname = userData.last_name;
    let occupation = userData.occupation;
    let phone = userData.phone_number;
    let email = userData.email;
    let selectedImage = userData.image
      ? "https://eskro-bucket.ams3.cdn.digitaloceanspaces.com/profile_pic/" +
        userData.image.img_url
      : null;
    this.setState({
      ...this.state,
      firstname,
      lastname,
      occupation,
      phone,
      email,
      selectedImage,
    });
  };

  saveChanges = () => {
    console.log("Save the changes made");
  };

  options = {
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1,
  };

  chooseImage = async () => {
    const images = await ImagePicker.launchImageLibraryAsync(this.options);
    // console.log(images.assets[0]);
    if (images.canceled) {
      Toast.show("Cancelled!", { duration: Toast.durations.LONG });
    }
    const filename = images.assets[0].uri.substring(
      images.assets[0].uri.lastIndexOf("/") + 1,
      images.assets[0].uri.length
    );
    // console.log("Filename", filename);
    const getData = await frontStorage.asyncGet("userData");
    let userData = JSON.parse(getData);
    console.log("Existing user data", userData);

    const data = new FormData();
    data.append("name", "Image Upload");
    data.append("file", {
      uri: images.assets[0].uri,
      // type: images.assets[0].type,
      type: mime.getType(images.assets[0].uri),
      name: filename,
    });
    data.append("user_id", userData.id);

    this.setState({ selectedImage: images.assets[0].uri });

    const response = await AuthApi.addProfilePics(data);
    console.log("Response", response.data);

    userData.image = response.data.data;
    frontStorage.asyncStore("userData", JSON.stringify(userData));

    // const res = await fetch(
    //   "http://192.168.0.137:8080/api/v1/auth/add-profile-pics",
    //   {
    //     method: "post",
    //     body: data,
    //     headers: {
    //       accept: "application/json",
    //       "Content-Type": "multipart/form-data",
    //     },
    //   }
    // );

    // const respJson = await res.json();
    // console.log("Response", respJson);
  };

  render() {
    const { theme, fontsLoaded } = this.state;
    if (!fontsLoaded) {
      return <Loading />;
    }

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
          openNavigation={() => this.props.navigation.toggleDrawer()}
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
          headerText="Profile"
        />

        <View style={{ alignItems: "center", marginTop: 20 }}>
          <Text
            style={[
              styles.text1,
              {
                color: theme == "dark" ? darkTheme.primary : lightTheme.primary,
              },
            ]}
          >
            Change profile picture.
          </Text>
          <Text
            style={[
              styles.text1,
              {
                color: theme == "dark" ? darkTheme.primary : lightTheme.primary,
              },
            ]}
          >
            (not more than 2MB)
          </Text>
          <View>
            <View
              style={[
                styles.profileimg,
                {
                  backgroundColor:
                    theme == "dark" ? darkTheme.primary : lightTheme.primary,
                },
              ]}
            >
              {this.state.selectedImage && (
                <Image
                  source={{ uri: this.state.selectedImage }}
                  style={styles.profileimg}
                />
              )}
            </View>
            <TouchableOpacity onPress={this.chooseImage} style={styles.change}>
              <Image source={require("../../assets/profilechange.png")} />
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <View style={{ flexDirection: "row" }}>
            <Text
              style={[
                styles.text1,
                heightLine,
                {
                  color:
                    theme == "dark" ? darkTheme.primary : lightTheme.primary,
                },
              ]}
            >
              First Name: {""}
            </Text>
            <Text
              style={[
                styles.text2,
                heightLine,
                {
                  color:
                    theme == "dark" ? darkTheme.primary : lightTheme.primary,
                },
              ]}
            >
              {this.state.firstname}
            </Text>
            <AntDesign name="lock1" size={20} color={darkTheme.greycolor} />
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text
              style={[
                styles.text1,
                heightLine,
                {
                  color:
                    theme == "dark" ? darkTheme.primary : lightTheme.primary,
                },
              ]}
            >
              Last Name: {""}
            </Text>
            <Text
              style={[
                styles.text2,
                heightLine,
                {
                  color:
                    theme == "dark" ? darkTheme.primary : lightTheme.primary,
                },
              ]}
            >
              {this.state.lastname}
            </Text>
            <AntDesign name="lock1" size={20} color={darkTheme.greycolor} />
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text
              style={[
                styles.text1,
                heightLine,
                {
                  color:
                    theme == "dark" ? darkTheme.primary : lightTheme.primary,
                },
              ]}
            >
              Email: {""}
            </Text>
            <Text
              style={[
                styles.text2,
                heightLine,
                {
                  color:
                    theme == "dark" ? darkTheme.primary : lightTheme.primary,
                },
              ]}
            >
              {this.state.email}
            </Text>
            <AntDesign name="lock1" size={20} color={darkTheme.greycolor} />
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text
              style={[
                styles.text1,
                heightLine,
                {
                  color:
                    theme == "dark" ? darkTheme.primary : lightTheme.primary,
                },
              ]}
            >
              Mobile Number: {""}
            </Text>
            <Text
              style={[
                styles.text2,
                heightLine,
                {
                  color:
                    theme == "dark" ? darkTheme.primary : lightTheme.primary,
                },
              ]}
            >
              {this.state.phone}
            </Text>
            <AntDesign name="lock1" size={20} color={darkTheme.greycolor} />
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text
              style={[
                styles.text1,
                heightLine,
                {
                  color:
                    theme == "dark" ? darkTheme.primary : lightTheme.primary,
                },
              ]}
            >
              Occupation: {""}
            </Text>
            <Text
              style={[
                styles.text2,
                heightLine,
                {
                  color:
                    theme == "dark" ? darkTheme.primary : lightTheme.primary,
                },
              ]}
            >
              {this.state.occupation}
            </Text>
            <AntDesign name="lock1" size={20} color={darkTheme.greycolor} />
          </View>
        </View>
        <View style={{ flex: 1, justifyContent: "flex-end" }}>
          <PrimaryButton text="Save" onPress={this.saveChanges} />
        </View>
      </View>
    );
  }
}

const heightLine = { lineHeight: 35 };
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 60,
    paddingBottom: 40,
  },
  profileimg: {
    height: 127,
    width: 127,
    borderRadius: 70,
    marginBottom: 51,
    marginTop: 5,
  },
  text1: {
    fontSize: 16,
    fontFamily: "ClarityCity-Regular",
  },
  text2: {
    fontSize: 16,
    fontFamily: "ClarityCity-Bold",
  },
  line: {
    marginTop: 20,
    width: "100%",
  },

  change: {
    position: "absolute",
    right: 5,
    top: "55%",
  },
});

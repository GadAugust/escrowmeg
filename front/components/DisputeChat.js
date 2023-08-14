import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Entypo, MaterialIcons } from "@expo/vector-icons";

export default class DisputeChat extends Component {
  imageExtensions = [
    "apng",
    "avif",
    "jpeg",
    "gif",
    "jpg",
    "png",
    "svg",
    "webP",
    "tiff",
  ];
  constructor(props) {
    super(props);
    this.state = {
      extension: "",
    };
  }
  componentDidMount() {
    let attachedFile = this.props.image;
    // console.log("file", attachedFile);
    const extension = attachedFile ? attachedFile.split(".").pop() : null;
    this.setState({ ...this.state, extension });
  }

  render() {
    const { image, complainText, subText } = this.props;
    const { extension } = this.state;
    return (
      <View
        style={{
          backgroundColor: "#3A4D8F",
          borderRadius: 10,
          paddingHorizontal: 20,
          paddingVertical: 10,
          marginBottom: 20,
          marginTop: 5,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={[styles.text2, subtext]}>{subText}</Text>
          <View style={{ alignItems: "flex-start" }}>
            <Text style={styles.fromText}>From</Text>
            <Text style={styles.fromText}>{this.props.firstname}</Text>
          </View>
        </View>
        <Text style={styles.ticketText}>{complainText}</Text>

        {image &&
          (this.imageExtensions.includes(extension) ? (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 20,
              }}
            >
              <View style={styles.imageborder}>
                <Image
                  source={{
                    uri:
                      "https://eskro-bucket.ams3.cdn.digitaloceanspaces.com/profile_pic/" +
                      image,
                  }}
                  style={{ width: 100, height: 80 }}
                />
              </View>
              <TouchableOpacity onPress={() => console.log("Download image")}>
                <MaterialIcons size={30} name="file-download" color="#F5F5F5" />
              </TouchableOpacity>
            </View>
          ) : (
            <View
              style={{
                flexDirection: "row",
                marginTop: 20,
                justifyContent: "space-between",
              }}
            >
              <Entypo name="attachment" size={24} color="#F5F5F5" />
              <Text
                style={{
                  color: "white",
                  marginStart: 5,
                  fontFamily: "ClarityCity-Regular",
                }}
              >
                {image.length > 30 ? image.substring(0, 30) + "..." : image}
              </Text>
              <TouchableOpacity onPress={() => console.log("Download File")}>
                <MaterialIcons size={24} name="file-download" color="#F5F5F5" />
              </TouchableOpacity>
            </View>
          ))}
      </View>
    );
  }
}

const subtext = { fontFamily: "ClarityCity-Bold" };

const styles = StyleSheet.create({
  text: {
    color: "#AFAFAF",
    fontSize: 14,
    fontFamily: "ClarityCity-Regular",
  },
  fromText: {
    color: "#A3A3A3",
    fontSize: 12,
    fontFamily: "ClarityCity-Bold",
  },

  imageborder: {
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    width: 100,
    height: 80,
    overflow: "hidden",
    marginRight: 20,
  },
  button: {
    backgroundColor: "#3A4D8F",
    borderRadius: 10,
    height: 35,
    justifyContent: "center",
    paddingHorizontal: 15,
  },

  text2: {
    color: "#F5F5F5",
    fontSize: 16,
    fontFamily: "ClarityCity-Regular",
  },

  ticketText: {
    color: "#F5F5F5",
    fontSize: 12,
    fontFamily: "ClarityCity-Regular",
    marginTop: 10,
  },
});

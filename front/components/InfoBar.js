import React from "react";
import { View, Image, StyleSheet, Text } from "react-native";

const InfoBar = ({ colorTheme, firstname, lastname, image }) => {
  // console.log("Info Image", image);
  return (
    <>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: 30,
        }}
      >
        <View
          style={[
            styles.profileimg,
            {
              backgroundColor: colorTheme.primary,
            },
          ]}
        >
          {image && <Image source={{ uri: image }} style={styles.profileimg} />}
        </View>
        <View>
          <Text
            style={[
              styles.text1,
              {
                color: colorTheme.primary,
              },
            ]}
          >
            Hi
          </Text>
          <Text
            style={[
              styles.text2,
              {
                color: colorTheme.primary,
              },
            ]}
          >
            {firstname} {lastname}
          </Text>
        </View>
      </View>
      <View
        style={{
          borderWidth: 0.25,
          borderColor: colorTheme.grey,
          marginVertical: 15,
        }}
      ></View>
    </>
  );
};

const styles = StyleSheet.create({
  profileimg: {
    height: 73,
    width: 73,
    borderRadius: 50,
    marginRight: 9,
  },
  text1: {
    fontSize: 14,
    fontFamily: "ClarityCity-Regular",
  },
  text2: {
    textTransform: "uppercase",
    fontSize: 16,
    lineHeight: 16,
    fontFamily: "ClarityCity-Bold",
  },
});

export default InfoBar;

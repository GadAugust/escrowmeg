import React, { useState } from "react";
import { StyleSheet, View, Image, Text } from "react-native";
import AppIntroSlider from "react-native-app-intro-slider";

const slides = [
  {
    key: "s1",
    image: require("../assets/slide_one.png"),
  },
  {
    key: "s2",
    image: require("../assets/slide_two.png"),
  },
  {
    key: "s3",
    image: require("../assets/slide_three.png"),
  },
];

const Slider = () => {
  const RenderItem = ({ item }) => {
    return (
      <View
        style={{
          flex: 1,
          width: "100%",
          backgroundColor: "white",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image source={item.image} />
      </View>
    );
  };

  return (
    <>
      <AppIntroSlider
        data={slides}
        renderItem={RenderItem}
        renderPagination={() => null}
        showSkipButton={false}
      />
    </>
  );
};

const styles = StyleSheet.create({});

export default Slider;

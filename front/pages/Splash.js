import React, { useState, useEffect } from "react";
import { StyleSheet, View, Image, Text, Animated } from "react-native";
import routes from "../navigation/routes";
import frontStorage from "../utilities/storage";

const SplashScreen = ({ navigation }) => {
  const [showFirst, setShowFirst] = useState(true);
  const [fadeAnim, setFadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    fadeIn();

    setTimeout(() => {
      fadeOut();
    }, 4000);

    setTimeout(() => {
      setShowFirst(false);
      fadeIn();
    }, 7000);

    setTimeout(() => {
      nextScreen();
    }, 12000);
  }, []);

  const fadeIn = () => {
    // Will change fadeAnim value to 1 in 5 seconds
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: true,
    }).start();
  };

  const fadeOut = () => {
    // Will change fadeAnim value to 0 in 3 seconds
    Animated.timing(fadeAnim, {
      toValue: 0.3,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  };

  const nextScreen = async () => {
    (await getData())
      ? navigation.navigate(routes.MAINPAGE)
      : navigation.navigate(routes.LOGIN);
  };

  const getData = async () => {
    const getData = await frontStorage.asyncGet("userData");
    let userData = getData && JSON.parse(getData);
    if (userData) {
      return true;
    }

    return false;
  };

  return showFirst ? (
    <Animated.View style={[styles.container1, { opacity: fadeAnim }]}>
      <Text style={{ fontSize: 22, fontColor: "#f5f5f5" }}>EscrowMeg</Text>
    </Animated.View>
  ) : (
    <Animated.View style={[styles.container2, { opacity: fadeAnim }]}>
      <Text style={{ fontSize: 22, fontColor: "#f5f5f5" }}>EscrowMeg</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container1: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#141414",
  },
  container2: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#3A4D8F",
  },
});

export default SplashScreen;

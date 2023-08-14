import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Image,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import routes from "../navigation/routes";
import Slider from "../components/Slider";
import PrimaryButton from "../components/PrimaryButton";
import { StatusBar } from "expo-status-bar";

function Onboarding({ navigation }) {
  const logScreen = () => {
    navigation.navigate(routes.LOGIN);
  };

  const regScreen = () => {
    navigation.navigate(routes.REGISTER);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" animated={true} backgroundColor="#3A4D8F" />
      <Slider />

      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          position: "absolute",
          flexDirection: "row",
          width: "100%",
          bottom: 0,
          padding: 10,
          borderRadius: 20,
          backgroundColor: "#3A4D8F",
        }}
      >
        <TouchableOpacity
          onPress={regScreen}
          style={{
            width: "50%",
            paddingVertical: 5,
            justifyContent: "center",
            alignItems: "center",
            borderEndWidth: 1,
            borderEndColor: "#f5f5f5",
          }}
        >
          <Text
            style={{
              color: "#F5F5F5",
              fontSize: 12,
              fontFamily: "ClarityCity-Bold",
            }}
          >
            Get started
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={logScreen}
          style={{
            width: "50%",
            paddingVertical: 5,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "#F5F5F5",
              fontSize: 12,
              fontFamily: "ClarityCity-Bold",
            }}
          >
            Already have an account
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#141414",
    flex: 1,
  },
});

export default Onboarding;

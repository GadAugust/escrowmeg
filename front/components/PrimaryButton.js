import React from "react";
import { Text, StyleSheet, TouchableOpacity } from "react-native";

const PrimaryButton = ({ text, onPress, buttonActive = true }) => {
  return buttonActive ? (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Text
        style={{
          color: "#F5F5F5",
          fontSize: 16,
          fontFamily: "ClarityCity-Bold",
        }}
      >
        {text}
      </Text>
    </TouchableOpacity>
  ) : (
    <TouchableOpacity style={styles.button}>
      <Text
        style={{
          color: "#999",
          fontSize: 16,
          fontFamily: "ClarityCity-Bold",
        }}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#BC990A",
    borderRadius: 10,
    paddingTop: 9,
    height: 45,
    alignItems: "center",
    marginTop: 6,
  },
});

export default PrimaryButton;

import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

function MyCheckbox({ borderColor, backgroundColor, boxAction }) {
  const [checked, onChange] = useState(false);

  function onCheckmarkPress() {
    onChange(!checked);
    boxAction();
  }

  return (
    <Pressable
      style={[
        { ...styles.checkboxBase, borderColor },
        checked && { backgroundColor },
      ]}
      onPress={onCheckmarkPress}
    >
      {checked && <Ionicons name="checkmark" size={14} color="white" />}
    </Pressable>
  );
}

export default function Checkbox({
  label,
  borderColor,
  backgroundColor,
  boxAction,
}) {
  return (
    <View style={styles.checkboxContainer}>
      <MyCheckbox
        borderColor={borderColor}
        backgroundColor={backgroundColor}
        boxAction={boxAction}
      />
      <Text style={styles.checkboxLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  checkboxBase: {
    width: 23,
    height: 23,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderWidth: 2,
    backgroundColor: "transparent",
  },

  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  checkboxLabel: {
    marginLeft: 8,
    fontWeight: "600",
    fontSize: 14,
    color: "#8895A7",
  },
});

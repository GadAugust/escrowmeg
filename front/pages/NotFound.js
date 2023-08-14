import React from "react";
import { View, Text } from "react-native";
const NotFound = () => {
  return (
    <View
      style={{ backgroundColor: "#000", flex: 1, justifyContent: "center" }}
    >
      <Text style={{ color: "#f5f5f5", fontSize: 20 }}>Not found</Text>
    </View>
  );
};

export default NotFound;

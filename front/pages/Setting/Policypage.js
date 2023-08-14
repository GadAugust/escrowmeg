import React, { useState, useEffect } from "react";
import { View } from "react-native";
import PrivacyNavigator from "../../navigation/PrivacyNavigator";
import lightTheme from "../../config/lightmodecolors";
import darkTheme from "../../config/darkmodecolors";
import frontStorage from "../../utilities/storage";
import { StatusBar } from "expo-status-bar";

export default function PolicyPage() {
  const [theme, onChange] = useState("dark");
  const getTheme = async () => {
    const getTheme = await frontStorage.asyncGet("mode");
    let currentTheme = getTheme ? JSON.parse(getTheme) : theme;
    onChange(currentTheme);
  };

  useEffect(() => {
    getTheme();
  });

  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: theme == "dark" ? darkTheme.dark : lightTheme.dark,
      }}
    >
      <StatusBar style="light" animated={true} backgroundColor="#141414" />
      <PrivacyNavigator />
    </View>
  );
}

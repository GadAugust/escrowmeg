import React, { useState, useEffect } from "react";
import PrivacyPolicy from "../pages/Setting/Privacypolicy";
import TermsCondition from "../pages/Setting/Termscondition";
import darkTheme from "../config/darkmodecolors";
import lightTheme from "../config/lightmodecolors";
import frontStorage from "../utilities/storage";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

const Tab = createMaterialTopTabNavigator();

export default function PrivacyNavigator({}) {
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
    <Tab.Navigator
      initialRouteName="Privacy Policy"
      screenOptions={{
        tabBarLabelStyle: {
          fontSize: 16,
          fontFamily: "ClarityCity-Bold",
          textTransform: "capitalize",
        },
        tabBarItemStyle: { marginTop: "20%" },
        tabBarStyle: {
          backgroundColor: theme == "dark" ? darkTheme.dark : lightTheme.dark,
        },
      }}
    >
      <Tab.Screen
        name="Privacy Policy"
        component={PrivacyPolicy}
        options={{
          title: "Privacy Policy",
          tabBarActiveTintColor: "#6280E8",
          tabBarInactiveTintColor:
            theme == "dark" ? darkTheme.primary : lightTheme.primary,
        }}
      />
      <Tab.Screen
        name="Terms and Condition"
        component={TermsCondition}
        options={{
          title: "Terms & Condition",
          tabBarActiveTintColor: "#6280E8",
          tabBarInactiveTintColor:
            theme == "dark" ? darkTheme.primary : lightTheme.primary,
        }}
      />
    </Tab.Navigator>
  );
}

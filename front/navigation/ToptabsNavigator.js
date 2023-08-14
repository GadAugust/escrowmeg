import React, { useState, useEffect } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import BuyingLists from "../pages/Listing/Buyinglist";
import SellingLists from "../pages/Listing/Sellinglist";
import darkTheme from "../config/darkmodecolors";
import lightTheme from "../config/lightmodecolors";
import frontStorage from "../utilities/storage";

const Tab = createMaterialTopTabNavigator();

export default function ToptabsNavigator({
  buyerlisting,
  sellerlisting,
  refreshing,
  onRefresh,
}) {
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
      initialRouteName="Selling"
      screenOptions={{
        tabBarLabelStyle: {
          fontSize: 16,
          textTransform: "capitalize",
          fontFamily: "ClarityCity-Bold",
        },
        tabBarItemStyle: { marginBottom: 6 },
        tabBarStyle: {
          backgroundColor: lightTheme.dark,
        },
      }}
    >
      <Tab.Screen
        name="Selling"
        children={(props) => (
          <SellingLists
            sellerlisting={sellerlisting}
            refreshing={refreshing}
            onRefresh={onRefresh}
            props={props}
          />
        )}
        options={{
          title: "Selling",
          tabBarActiveTintColor: "#BC990A",
          tabBarInactiveTintColor: theme == "#141414",
        }}
      />
      <Tab.Screen
        name="Buying"
        children={(props) => (
          <BuyingLists
            buyerlisting={buyerlisting}
            refreshing={refreshing}
            onRefresh={onRefresh}
            props={props}
          />
        )}
        options={{
          title: "Buying",
          tabBarActiveTintColor: "#BC990A",
          tabBarInactiveTintColor: theme == "#141414",
        }}
      />
    </Tab.Navigator>
  );
}

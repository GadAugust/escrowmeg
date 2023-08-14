import React, { useState, useEffect } from "react";
import AcceptedBids from "../pages/OutgoingBids/Acceptedbids";
import DeclinedBids from "../pages/OutgoingBids/Declinedbids";
import PendingBids from "../pages/OutgoingBids/Pendingbids";
import darkTheme from "../config/darkmodecolors";
import lightTheme from "../config/lightmodecolors";
import frontStorage from "../utilities/storage";

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
const Tab = createMaterialTopTabNavigator();

export default function BidNavigator({
  acceptedBids,
  declinedBids,
  pendingBids,
  refreshing,
  onRefresh,
}) {
  // console.log(acceptedBids, pendingBids, declinedBids);
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
      initialRouteName="Accepted"
      screenOptions={{
        tabBarLabelStyle: {
          fontSize: 16,
          textTransform: "capitalize",
          fontFamily: "ClarityCity-Bold",
        },
        tabBarItemStyle: {},
        tabBarStyle: {
          backgroundColor: theme == "dark" ? darkTheme.dark : lightTheme.dark,
        },
      }}
    >
      <Tab.Screen
        name="Accepted"
        children={(props) => (
          <AcceptedBids
            acceptedBids={acceptedBids}
            refreshing={refreshing}
            onRefresh={onRefresh}
            props={props}
          />
        )}
        options={{
          title: "Accepted",
          tabBarActiveTintColor: "#6280E8",
          tabBarInactiveTintColor:
            theme == "dark" ? darkTheme.primary : lightTheme.primary,
        }}
      />

      <Tab.Screen
        name="Pending"
        children={(props) => (
          <PendingBids
            pendingBids={pendingBids}
            refreshing={refreshing}
            onRefresh={onRefresh}
            props={props}
          />
        )}
        options={{
          title: "Pending",
          tabBarActiveTintColor: "#6280E8",
          tabBarInactiveTintColor:
            theme == "dark" ? darkTheme.primary : lightTheme.primary,
        }}
      />
      <Tab.Screen
        name="Declined"
        children={(props) => (
          <DeclinedBids
            declinedBids={declinedBids}
            refreshing={refreshing}
            onRefresh={onRefresh}
            props={props}
          />
        )}
        options={{
          title: "Declined",
          tabBarActiveTintColor: "#6280E8",
          tabBarInactiveTintColor:
            theme == "dark" ? darkTheme.primary : lightTheme.primary,
        }}
      />
    </Tab.Navigator>
  );
}

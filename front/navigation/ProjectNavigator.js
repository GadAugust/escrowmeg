import React, { useState, useEffect } from "react";
import OngoingProjects from "../pages/Project/Ongoingprojects";
import CompletedProjects from "../pages/Project/Completedprojects";
import darkTheme from "../config/darkmodecolors";
import lightTheme from "../config/lightmodecolors";
import frontStorage from "../utilities/storage";

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
const Tab = createMaterialTopTabNavigator();

export default function ProjectNavigator({
  ongoingProjects,
  completedProjects,
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
      initialRouteName="Active"
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
        name="InActive"
        children={(props) => (
          <OngoingProjects
            ongoingProjects={ongoingProjects}
            refreshing={refreshing}
            onRefresh={onRefresh}
            props={props}
          />
        )}
        options={{
          title: "Ongoing",
          tabBarActiveTintColor: "#BC990A",
          tabBarInactiveTintColor: "#141414",
        }}
      />
      <Tab.Screen
        name="Completed"
        children={(props) => (
          <CompletedProjects
            completedProjects={completedProjects}
            refreshing={refreshing}
            onRefresh={onRefresh}
            props={props}
          />
        )}
        options={{
          title: "Completed",
          tabBarActiveTintColor: "#BC990A",
          tabBarInactiveTintColor: "#141414",
        }}
      />
    </Tab.Navigator>
  );
}

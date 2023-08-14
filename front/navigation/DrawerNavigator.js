import * as React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import CustomDrawer from "./CustomDrawer";
import AllListsScreen from "../pages/Listing/Alllists";
import IncomingBids from "../pages/IncomingBids/IncomingBids";
import OutgoingBids from "../pages/OutgoingBids/OutgoingBids";
import routes from "./routes";
import frontStorage from "../utilities/storage";

import HomeScreen from "../pages/Home/Home";
import UserProfile from "../pages/Profile/Userprofile";
import ProjectList from "../pages/Project/Projectlist";
import WalletScreen from "../pages/Wallet/Wallet";
import SettingScreen from "../pages/Setting/Settingscreen";
import {
  MaterialIcons,
  Ionicons,
  Entypo,
  AntDesign,
  FontAwesome,
} from "@expo/vector-icons";

const Drawer = createDrawerNavigator();

export default function DrawerNavigator(props) {
  const logOut = (props) => {
    frontStorage.asyncRemove("userData");
    setTimeout(() => props.navigation.navigate(routes.LOGIN));
    return <></>;
  };
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      initialRouteName="home"
      screenOptions={{
        drawerStyle: {
          backgroundColor: "#BC990A",
          width: 240,
          paddingTop: 25,
        },
        drawerLabelStyle: {
          fontSize: 18,
          fontFamily: "ClarityCity-Regular",
        },
      }}
    >
      <Drawer.Screen
        name="home"
        component={HomeScreen}
        options={{
          title: "Home",
          headerShown: false,
          drawerIcon: ({ focused, color, size }) => (
            <MaterialIcons
              name="dashboard-customize"
              size={size}
              color={color}
            />
          ),
          drawerActiveTintColor: "#3A4D8F",
          drawerInactiveTintColor: "#F5F5F5",
          drawerActiveBackgroundColor: "#F5F5F5",
        }}
      />
      <Drawer.Screen
        name="wallet"
        component={WalletScreen}
        options={{
          title: "Wallet",
          headerShown: false,
          drawerIcon: ({ focused, color, size }) => (
            <Ionicons name="wallet-outline" size={size} color={color} />
          ),
          drawerActiveTintColor: "#3A4D8F",
          drawerInactiveTintColor: "#F5F5F5",
          drawerActiveBackgroundColor: "#F5F5F5",
        }}
      />
      <Drawer.Screen
        name="listing"
        component={AllListsScreen}
        options={{
          title: "Listing",
          headerShown: false,
          drawerIcon: ({ focused, color, size }) => (
            <Entypo name="add-to-list" size={size} color={color} />
          ),
          drawerActiveTintColor: "#3A4D8F",
          drawerInactiveTintColor: "#F5F5F5",
          drawerActiveBackgroundColor: "#F5F5F5",
        }}
      />
      <Drawer.Screen
        name="project"
        component={ProjectList}
        options={{
          title: "Project",
          headerShown: false,
          drawerIcon: ({ focused, color, size }) => (
            <MaterialIcons
              name="dashboard-customize"
              size={size}
              color={color}
            />
          ),
          drawerActiveTintColor: "#3A4D8F",
          drawerInactiveTintColor: "#F5F5F5",
          drawerActiveBackgroundColor: "#F5F5F5",
        }}
      />
      <Drawer.Screen
        name="outgoingbids"
        component={OutgoingBids}
        options={{
          title: "Bids",
          headerShown: false,
          drawerIcon: ({ focused, color, size }) => (
            <FontAwesome name="handshake-o" size={18} color={color} />
          ),
          drawerActiveTintColor: "#3A4D8F",
          drawerInactiveTintColor: "#F5F5F5",
          drawerActiveBackgroundColor: "#F5F5F5",
        }}
      />
      {/* <Drawer.Screen
        name="seting"
        component={SettingScreen}
        options={{
          title: "Settings",
          headerShown: false,
          drawerIcon: ({ focused, color, size }) => (
            <AntDesign name="setting" size={size} color={color} />
          ),
          drawerActiveTintColor: "#3A4D8F",
          drawerInactiveTintColor: "#F5F5F5",
          drawerActiveBackgroundColor: "#F5F5F5",
        }}
      /> */}
      <Drawer.Screen
        name="logout"
        children={(props) => logOut(props)}
        options={{
          title: "Log out",
          headerShown: false,
          drawerIcon: ({ focused, color, size }) => (
            <MaterialIcons name="logout" size={size} color={color} />
          ),
          drawerActiveTintColor: "#3A4D8F",
          drawerInactiveTintColor: "#F5F5F5",
          drawerActiveBackgroundColor: "#F5F5F5",
        }}
      />
    </Drawer.Navigator>
  );
}

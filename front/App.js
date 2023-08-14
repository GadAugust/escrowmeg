import React, { useState, useEffect } from "react";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { RootSiblingParent } from "react-native-root-siblings";
import AuthNavigator from "./navigation/AuthNavigator";
import { StripeProvider } from "@stripe/stripe-react-native";
import * as Linking from "expo-linking";
import { Text, View } from "react-native";

const STRIPE_KEY =
  "pk_test_51NSrdYEujEihIXWg8ZAjhAALNsngaJ74V5pYR8mba6Axt9jMJB5dO85joDUOkLvsFNXyzznXkafGtJTVf3a00KDr0059w1vAE0";

const prefix = Linking.createURL("/");
const escrowmegPrefix = Linking.createURL("https://192.168.42.6");

export default function App() {
  const config = {
    screens: {
      searchresult: ":listID",
      notfound: "*",
    },
  };

  const linking = {
    prefixes: [prefix, escrowmegPrefix],
    config,
  };

  return (
    <RootSiblingParent>
      <StripeProvider publishableKey={STRIPE_KEY}>
        <NavigationContainer linking={linking}>
          <AuthNavigator />
        </NavigationContainer>
      </StripeProvider>
    </RootSiblingParent>
  );
}

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import lightTheme from "../config/lightmodecolors";
import darkTheme from "../config/darkmodecolors";
import { AntDesign } from "@expo/vector-icons";

const BankAccount = ({
  account_name,
  account_num,
  bank_name,
  onPress,
  theme,
}) => {
  return (
    <>
      <TouchableOpacity onPress={onPress}>
        <View
          style={[
            styles.viewcolor,
            {
              borderRightColor:
                theme == "dark" ? darkTheme.dark : lightTheme.dark,
              borderLeftColor:
                theme == "dark" ? darkTheme.dark : lightTheme.dark,
            },
          ]}
        >
          <View>
            <Text
              style={{
                color: theme == "dark" ? darkTheme.primary : lightTheme.primary,

                fontSize: 16,
                fontFamily: "ClarityCity-Bold",
              }}
            >
              {account_name}
            </Text>
            <Text
              style={{
                color: theme == "dark" ? darkTheme.primary : lightTheme.primary,

                fontSize: 16,
                fontFamily: "ClarityCity-Regular",
              }}
            >
              {bank_name}
            </Text>
          </View>
          <Text
            style={{
              color: "#4A4A4A",
              fontSize: 20,
              marginLeft: 30,
              fontFamily: "ClarityCity-Bold",
            }}
          >
            {account_num}
          </Text>
        </View>
      </TouchableOpacity>
    </>
  );
};

export default BankAccount;

const styles = StyleSheet.create({
  viewcolor: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopColor: "#6280E8",
    borderBottomColor: "#6280E8",

    borderWidth: 1,
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
});

import React from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { FontAwesome, EvilIcons, Ionicons } from "@expo/vector-icons";

const TopBar = ({
  openNavigation,
  colorTheme,
  searchFunc,
  useSearch = false,
  headerText,
  useBack = false,
  backFunc,
}) => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {useBack ? (
        <TouchableOpacity onPress={backFunc}>
          <Ionicons name="chevron-back-outline" size={30} color="#BC990A" />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={openNavigation}>
          <FontAwesome name="navicon" size={24} color={"#BC990A"} />
        </TouchableOpacity>
      )}

      {useSearch ? (
        <TouchableOpacity
          style={[
            styles.searchView,
            {
              borderColor: colorTheme.grey,
            },
          ]}
          onPress={searchFunc}
        >
          <Text
            style={{
              color: colorTheme.grey,
              width: "90%",
              fontSize: 14,
              fontFamily: "ClarityCity-RegularItalic",
            }}
          >
            Search with listing ID
          </Text>
          <EvilIcons name="search" size={20} color={colorTheme.grey} />
        </TouchableOpacity>
      ) : (
        <View
          style={{
            flex: 1,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 18,
              color: "#BC990A",
              fontFamily: "ClarityCity-Bold",
            }}
          >
            {headerText}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  searchView: {
    width: "60%",
    borderRadius: 50,
    borderStyle: "solid",

    borderWidth: 1,
    paddingHorizontal: 5,
    paddingVertical: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});

export default TopBar;

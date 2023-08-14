import React, { useState } from "react";

import { View } from "react-native";

import DropDownPicker from "react-native-dropdown-picker";

export default function Dropdown(props) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(props.value);
  const [items, setItems] = useState(props.items);

  return (
    <View style={{ width: "50%" }}>
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        labelStyle={{
          color: "#F5F5F5",
          fontFamily: "ClarityCity-Regular",
        }}
        containerStyle={{
          backgroundColor: "#4A4A4A",
          borderColor: "#F5F5F5",
        }}
        textStyle={{
          color: "#4A4A4A",
          fontFamily: "ClarityCity-Regular",
        }}
        style={props.myStyle}
        setOpen={setOpen}
        setItems={setItems}
        dropDownDirection="TOP"
        setValue={setValue}
        onSelectItem={(item) => {
          props.onChange(item.value);
        }}
        theme="LIGHT"
        multiple={false}
        mode="BADGE"
      />
    </View>
  );
}

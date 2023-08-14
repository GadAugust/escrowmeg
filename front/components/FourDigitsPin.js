import React, { Component } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import colors from "../config/colors";

export default class FourDigitsPin extends Component {
  pin = [];
  constructor(props) {
    super(props);

    this.state = {
      code: "",
    };

    this.input1 = React.createRef();
    this.input2 = React.createRef();
    this.input3 = React.createRef();
    this.input4 = React.createRef();

    this.changeFocus = this.changeFocus.bind(this);
    this.checkKeyPressed = this.checkKeyPressed.bind(this);
  }

  returnNext(ref, val) {
    if (ref == "1" && val != "") {
      return this.input2;
    } else if (ref == "2" && val != "") {
      return this.input3;
    } else if (ref == "3" && val != "") {
      return this.input4;
    } else if (ref == "4" && val != "") {
      return this.input4;
    } else if (ref == "2" && val == "") {
      return this.input1;
    } else if (ref == "3" && val == "") {
      return this.input2;
    } else if (ref == "4" && val == "") {
      return this.input3;
    } else if (ref == "1" && val == "") {
      return this.input1;
    }
  }

  changeFocus = (value, ref) => {
    // console.log(value, ref);
    this.returnNext(ref, value).current.focus();
    ref == "1"
      ? (this.pin[0] = value)
      : ref == "2"
      ? (this.pin[1] = value)
      : ref == "3"
      ? (this.pin[2] = value)
      : ref == "4"
      ? (this.pin[3] = value)
      : null;

    // console.log(this.pin);
    this.props.setPinValue(this.pin.toString().split(",").join(""));
  };

  checkKeyPressed = (keyPressed, ref, domRef) => {
    // console.log(keyPressed.key);
    if (keyPressed.key == "Backspace") {
      domRef.current.clear();
      this.changeFocus("", ref);
    }
  };

  render() {
    return (
      <View style={{ marginTop: 42, paddingHorizontal: 35 }}>
        <Text style={styles.stylePin}>{this.props.text}</Text>
        <View style={styles.containerBox}>
          <View style={styles.boxfield}>
            <TextInput
              style={styles.inputfield}
              keyboardType="numeric"
              maxLength={1}
              autoFocus={true}
              onChangeText={(pin) => this.changeFocus(pin, "1")}
              onKeyPress={({ nativeEvent }) =>
                this.checkKeyPressed(nativeEvent, "1", this.input1)
              }
              ref={this.input1}
            />
          </View>
          <View style={styles.boxfield}>
            <TextInput
              style={styles.inputfield}
              keyboardType="numeric"
              maxLength={1}
              onChangeText={(pin) => this.changeFocus(pin, "2")}
              onKeyPress={({ nativeEvent }) =>
                this.checkKeyPressed(nativeEvent, "2", this.input2)
              }
              ref={this.input2}
            />
          </View>
          <View style={styles.boxfield}>
            <TextInput
              style={styles.inputfield}
              keyboardType="numeric"
              maxLength={1}
              onChangeText={(pin) => this.changeFocus(pin, "3")}
              onKeyPress={({ nativeEvent }) =>
                this.checkKeyPressed(nativeEvent, "3", this.input3)
              }
              ref={this.input3}
            />
          </View>
          <View style={styles.boxfield}>
            <TextInput
              style={styles.inputfield}
              keyboardType="numeric"
              maxLength={1}
              onChangeText={(pin) => this.changeFocus(pin, "4")}
              onKeyPress={({ nativeEvent }) =>
                this.checkKeyPressed(nativeEvent, "4", this.input4)
              }
              ref={this.input4}
            />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerBox: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 5,
  },
  boxfield: {
    backgroundColor: "#4A4A4A",
    height: 62,
    width: 62,
    marginRight: 6,
    justifyContent: "center",
    alignItems: "center",
  },

  inputfield: {
    color: "#F5F5F5",
    fontSize: 25,
    fontFamily: "ClarityCity-Bold",
  },
  stylePin: {
    color: colors.tertiary,
    fontSize: 16,
    fontFamily: "ClarityCity-Bold",
  },
});

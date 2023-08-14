import React, { Component } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import PrimaryButton from "./PrimaryButton";
import { Circle } from "react-native-animated-spinkit";

export default class SixDigitsCode extends Component {
  constructor(props) {
    super(props);

    this.state = {
      code: "",
      vcode: ["3", "3", "3", "4", "5", "3"],
    };
    this.input1 = React.createRef();
    this.input2 = React.createRef();
    this.input3 = React.createRef();
    this.input4 = React.createRef();
    this.input5 = React.createRef();
    this.input6 = React.createRef();
    this.changeFocus = this.changeFocus.bind(this);
  }

  returnInputDec = (ref) => {
    // console.log("Reurn ref", ref);
    if (ref == "6") {
      return this.input5;
    } else if (ref == "5") {
      return this.input4;
    } else if (ref == "4") {
      return this.input3;
    } else if (ref == "3") {
      return this.input2;
    } else if (ref == "2") {
      return this.input1;
    } else {
      return this.input1;
    }
  };

  returnInputAsc = (ref) => {
    // console.log("Reurn ref", ref);
    if (ref == "1") {
      return this.input2;
    } else if (ref == "2") {
      return this.input3;
    } else if (ref == "3") {
      return this.input4;
    } else if (ref == "4") {
      return this.input5;
    } else if (ref == "5") {
      return this.input6;
    } else {
      return this.input6;
    }
  };

  changeFocus = (ref, text) => {
    this.returnInputAsc(ref).current.focus();
    // console.log("text", text);
    let prevCode = this.state.code;
    if (text != undefined && text != "") {
      let newCode = prevCode + text;
      // console.log("newcode", newCode)
      this.setState({ ...this.state, code: newCode });
    } else if (text == "") {
      this.returnInputDec(ref).current.focus();
      let newCode = prevCode.substring(0, prevCode.length - 1);
      // console.log("newcode", newCode)
      this.setState({ ...this.state, code: newCode });
    }
  };

  render() {
    return (
      <>
        <Text style={styles.digits}>{this.props.text}</Text>
        <View style={styles.container2}>
          <View style={styles.boxfield}>
            <TextInput
              style={styles.inputfield}
              keyboardType="numeric"
              maxLength={1}
              autoFocus={true}
              onChangeText={(code1) => this.changeFocus("1", code1)}
              ref={this.input1}
            />
          </View>
          <View style={styles.boxfield}>
            <TextInput
              style={styles.inputfield}
              keyboardType="numeric"
              maxLength={1}
              onChangeText={(code2) => this.changeFocus("2", code2)}
              ref={this.input2}
            />
          </View>
          <View style={styles.boxfield}>
            <TextInput
              style={styles.inputfield}
              keyboardType="numeric"
              maxLength={1}
              onChangeText={(code3) => this.changeFocus("3", code3)}
              ref={this.input3}
            />
          </View>
          <View style={styles.boxfield}>
            <TextInput
              style={styles.inputfield}
              keyboardType="numeric"
              maxLength={1}
              onChangeText={(code4) => this.changeFocus("4", code4)}
              ref={this.input4}
            />
          </View>
          <View style={styles.boxfield}>
            <TextInput
              style={styles.inputfield}
              keyboardType="numeric"
              maxLength={1}
              onChangeText={(code5) => this.changeFocus("5", code5)}
              ref={this.input5}
            />
          </View>
          <View style={styles.boxfield}>
            <TextInput
              style={styles.inputfield}
              keyboardType="numeric"
              maxLength={1}
              onChangeText={(code6) => this.changeFocus("6", code6)}
              ref={this.input6}
            />
          </View>
        </View>
        {this.props.loading ? (
          <View style={styles.spin}>
            <Circle size={24} color="#F5F5F5" />
          </View>
        ) : (
          <PrimaryButton
            text="Verify"
            onPress={() => this.props.verifyCode(this.state.code)}
          />
        )}
      </>
    );
  }
}

const styles = StyleSheet.create({
  container2: {
    flexDirection: "row",
    paddingVertical: 20,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  digits: {
    fontSize: 16,
    textAlign: "center",
    fontFamily: "ClarityCity-Bold",
    color: "#141414",
    paddingTop: 80,
  },
  boxfield: {
    backgroundColor: "#4A4A4A",
    paddingHorizontal: 15,
    paddingTop: 9,
    height: 45,
    width: 40,
    marginRight: 4,
  },
  inputfield: {
    color: "#F5F5F5",
    fontSize: 13,
    height: 20,
    fontFamily: "ClarityCity-Bold",
  },
  spin: {
    backgroundColor: "#BC990A",
    borderRadius: 10,
    paddingTop: 9,
    height: 45,
    alignItems: "center",
    marginTop: 6,
  },
});

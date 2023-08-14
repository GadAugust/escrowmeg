import React, { Component } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { Circle } from "react-native-animated-spinkit";

export default class PaymentCode extends Component {
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
  }

  returnInputDec = (ref) => {
    console.log("Reurn ref", ref);
    if (ref == "4") {
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
    console.log("Reurn ref", ref);
    if (ref == "1") {
      return this.input2;
    } else if (ref == "2") {
      return this.input3;
    } else if (ref == "3") {
      return this.input4;
    } else {
      return this.input4;
    }
  };

  changeFocus = (ref, text) => {
    this.returnInputAsc(ref).current.focus();
    // console.log("text", text);
    let prevCode = this.state.code;
    if (text != undefined && text != "") {
      let newCode = prevCode + text;
      console.log("newcode", newCode);
      this.setState({ ...this.state, code: newCode });
      console.log("state", this.state.code);
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
        <Text
          style={{
            fontSize: 16,
            fontWeight: "700",
            color: "#6280E8",
            paddingVertical: 15,
            textAlign: "center",
          }}
        >
          {this.props.text}
        </Text>
        <View style={styles.container2}>
          <View style={styles.boxfield}>
            <TextInput
              style={styles.inputfield}
              keyboardType="numeric"
              maxLength={1}
              autoFocus={true}
              onChangeText={(pin1) => this.changeFocus("1", pin1)}
              ref={this.input1}
            />
          </View>
          <View style={styles.boxfield}>
            <TextInput
              style={styles.inputfield}
              keyboardType="numeric"
              maxLength={1}
              onChangeText={(pin2) => this.changeFocus("2", pin2)}
              ref={this.input2}
            />
          </View>
          <View style={styles.boxfield}>
            <TextInput
              style={styles.inputfield}
              keyboardType="numeric"
              maxLength={1}
              onChangeText={(pin3) => this.changeFocus("3", pin3)}
              ref={this.input3}
            />
          </View>
          <View style={styles.boxfield}>
            <TextInput
              style={styles.inputfield}
              keyboardType="numeric"
              maxLength={1}
              onChangeText={(pin4) => this.changeFocus("4", pin4)}
              ref={this.input4}
            />
          </View>
        </View>
        {this.props.loading ? (
          <View style={styles.spin}>
            <Circle size={18} color="#6280E8" />
          </View>
        ) : (
          <Text
            onPress={() => this.props.verifyPin(this.state.code)}
            style={styles.text3}
          >
            {this.props.text2}
          </Text>
        )}
      </>
    );
  }
}

const styles = StyleSheet.create({
  container2: {
    flexDirection: "row",
    justifyContent: "center",
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
    fontWeight: "700",
  },
  text3: {
    color: "#6280E8",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
    paddingTop: 20,
  },
  spin: {
    paddingTop: 20,
    alignItems: "center",
  },
});

import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  StyleSheet,
  Image,
  LayoutAnimation,
  TouchableOpacity,
  TextInput,
} from "react-native";

import Icons from "./Icons";
import CCInput from "./CCInput";
import { InjectedProps } from "./connectToState";

const INFINITE_WIDTH = 1000;

const s = StyleSheet.create({
  container: {
    paddingLeft: 10,
    paddingRight: 10,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
  },
  icon: {
    width: 48,
    height: 40,
    resizeMode: "contain",
  },
  expanded: {
    flex: 1,
  },
  hidden: {
    width: 0,
  },
  leftPart: {
    flexDirection: "row",
    flexWrap: "nowrap",
    // overflow: "hidden",
  },
  rightPart: {
    overflow: "hidden",
    flexDirection: "row",
    flexWrap: "nowrap",
  },
  last4: {
    flex: 1,
    justifyContent: "center",
  },
  numberInput: {
    flex: 1,
    // width: INFINITE_WIDTH,
  },
  expiryInput: {
    width: 140,
  },
  cvcInput: {
    width: 80,
  },
  last4Input: {
    width: 60,
    marginLeft: 20,
  },
  input: {
    height: 40,
    color: "black",
  },
});

/* eslint react/prop-types: 0 */ // https://github.com/yannickcr/eslint-plugin-react/issues/106
export default class LiteCreditCardInput extends Component {
  static propTypes = {
    ...InjectedProps,

    placeholders: PropTypes.object,

    inputStyle: Text.propTypes.style,

    validColor: PropTypes.string,
    invalidColor: PropTypes.string,
    placeholderColor: PropTypes.string,

    additionalInputsProps: PropTypes.objectOf(PropTypes.shape(TextInput.propTypes)),
  };

  static defaultProps = {
    placeholders: {
      number: "1234 5678 1234 5678",
      expiry: "MM/YY",
      cvc: "CVC",
    },
    validColor: "",
    invalidColor: "red",
    placeholderColor: "gray",
    additionalInputsProps: {},
  };

  componentDidMount = () => this._focus(this.props.focused);

  componentWillReceiveProps = (newProps) => {
    if (this.props.focused !== newProps.focused) this._focus(newProps.focused);
  };

  _focusNumber = () => this._focus("number");

  _focusExpiry = () => this._focus("expiry");

  _focus = (field) => {
    if (!field) return;
    this.refs[field].focus();
    LayoutAnimation.easeInEaseOut();
  }

  _inputProps = (field) => {
    const {
      inputStyle, validColor, invalidColor, placeholderColor,
      placeholders, values, status,
      onFocus, onChange, onBecomeEmpty, onBecomeValid,
      additionalInputsProps, focused,
    } = this.props;

    return {
      inputStyle: [s.input, inputStyle],
      validColor,
      invalidColor,
      placeholderColor,
      ref: field,
      field,

      placeholder: placeholders[field],
      value: values[field],
      status: status[field],
      focused: focused === field,
      onFocus,
      onChange,
      onBecomeEmpty,
      onBecomeValid,
      additionalInputProps: additionalInputsProps[field],
    };
  };

  _iconToShowFront = () => {
    const { focused, values: { type } } = this.props;
    if (type) return type;
    return "placeholder";
  }

  _iconToShowBack = () => {
    const { focused, values: { type } } = this.props;
    if (focused === "cvc" && type === "american-express") return "cvc_amex";
    return "cvc";
  }

  render() {
    const {
      focused, values: { number }, inputStyle, status: { number: numberStatus }, style,
      inputContainerStyle, inputFocusedStyle,
    } = this.props;
    const showRightPart = focused && focused !== "number";

    return (
      <View style={[s.container, style]}>
        <View style={[
          s.leftPart,
          s.expanded,

        ]}>
          <View style={[
            // s.leftPart,
            // // showRightPart ? s.hidden : s.expanded,
            s.expanded,
          ]}>
            <CCInput
              {...this._inputProps("number")}
              inputFocusedStyle={focused === "number" && inputFocusedStyle}
              keyboardType="numeric"
              containerStyle={[s.numberInput, inputContainerStyle]} />
          </View>
          <TouchableOpacity onPress={this._focusNumber}>
            <Image style={s.icon} source={Icons[this._iconToShowFront()]} />
          </TouchableOpacity>
        </View>
        <View style={[
          s.rightPart,
          s.expanded,
        ]}>
          <View style={[
            s.expanded,
            s.rightPart,
          // showRightPart ? s.expanded : s.hidden,
          ]}>
            <CCInput
              {...this._inputProps("expiry")}
              inputFocusedStyle={focused === "expiry" && inputFocusedStyle}
              keyboardType="numeric"
              containerStyle={[s.expiryInput, inputContainerStyle]} />
            <CCInput
              {...this._inputProps("cvc")}
              inputFocusedStyle={focused === "cvc" && inputFocusedStyle}
              keyboardType="numeric"
              containerStyle={[s.cvcInput, inputContainerStyle]} />
          </View>
          <TouchableOpacity onPress={this._focusExpiry}>
            <Image style={s.icon} source={Icons[this._iconToShowBack()]} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

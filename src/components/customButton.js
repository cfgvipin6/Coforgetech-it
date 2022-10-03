import React, { Component } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Platform,
} from "react-native";
import { moderateScale } from "./fontScaling.js";
import { globalFontStyle } from "./globalFontStyle.js";
let appConfig = require("../../appconfig");
// import _ from 'lodash'

export default class CustomButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disableButton: false,
    };
    //added to perform the click function once
    // _.throttle(
    //     this.doAction.bind(this),
    //     8000, // no new clicks within 8000ms time window
    // );
  }

  render() {
    let buttonText = this.props.label;
    let color = this.props.positive != undefined ? this.props.positive : true;
    return (
      <TouchableOpacity
        disabled={this.props.isFreezed}
        onPress={() => this.doAction()}
      >
        <View
          style={[
            styles.button,
            globalFontStyle.buttonSize,
            {
              backgroundColor: color
                ? appConfig.VALID_BORDER_COLOR
                : appConfig.INVALID_BUTTON_COLOR,
            },
          ]}
        >
          <Text style={(styles.textStyle, globalFontStyle.buttonTextSize)}>
            {buttonText}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  doAction() {
    if (!this.state.disableButton) {
      this.setState({ disableButton: true });
      this.props.performAction();
      setTimeout(() => {
        this.setState({ disableButton: false });
      }, 2000);
    }
    // setTimeout(() => this.setState({ disableButton: false }), 1000)
  }
}

const styles = StyleSheet.create({
  button: {
    width: "98%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: moderateScale(6),
    alignSelf: "center",
    marginBottom: moderateScale(4),
  },
  textStyle: {
    textAlign: "center",
  },
  //255,44,62
});

import React, { Component } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  BackHandler,
} from "react-native";
import {
  removePassword,
  removeUserName,
  setLoginType,
  removeLoginType,
} from "../auth/AuthUtility";
import style from "./style.js";
import Header from "../../GlobalComponent/Header";
import SplashScreen from "react-native-splash-screen";
import { connect } from "react-redux";
import { loginDataClear } from "./LoginAction";
import { AD_LOGIN } from "./constants";
import RNExitApp from "react-native-exit-app";
import { writeLog } from "../../utilities/logger";
import properties from "../../resource/properties";
import { SafeAreaView } from "react-navigation";
import images from "../../images";
import { DEVICE_VERSION } from "../../components/DeviceInfoFile";
let constant = require("./constants");
let focusSubscription;
class AdLoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  onFocus = () => {
    this.props.clearLogin();
    removeLoginType();
    removeUserName();
    removePassword();
    writeLog("Landed on " + "AdLoginScreen");
  };
  exitApp = () => {
    RNExitApp.exitApp();
  };
  componentDidMount() {
    SplashScreen.hide();
    focusSubscription = this.props.navigation.addListener(
      "willFocus",
      this.onFocus
    );
    BackHandler.addEventListener("hardwareBackPress", this.exitApp);
  }
  componentWillUnmount() {
    if (focusSubscription !== undefined) {
      focusSubscription.remove();
    }
  }
  loginWithAd = () => {
    writeLog("Clicked on " + "loginWithAd" + " of " + "AdLoginScreen");
    setLoginType(AD_LOGIN);
    this.props.navigation.navigate("WebRoute", {
      URL: properties.adLoginUrl,
    });
  };

  loginWithApp = () => {
    writeLog("Clicked on " + "loginWithApp" + " of " + "AdLoginScreen");
    this.props.navigation.replace("Login");
  };

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={style.topView}>
          {<Header isLoginPage={true} />}
          <Text>{this.state.logoutDetails}</Text>
        </View>
        <View
          contentContainerStyle={{ flex: 1 }}
          keyboardShouldPersistTaps="never"
        >
          <ImageBackground source={images.splash} style={style.bgStyle}>
            <View>
              <TouchableOpacity
                style={style.adButton}
                activeOpacity={0.5}
                onPress={() => this.loginWithAd()}
              >
                <Text style={style.btnText}>{constant.LOGIN_WITH_ADD}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={style.adButton}
                activeOpacity={0.5}
                onPress={() => this.loginWithApp()}
              >
                <Text style={style.btnText}>{constant.LOGIN_WITH_APP}</Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
          <Text style={style.versionTextStyle}>
            {"App Ver : " + DEVICE_VERSION}
          </Text>
        </View>
      </SafeAreaView>
    );
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    clearLogin: () => dispatch(loginDataClear()),
  };
};
export default connect(
  null,
  mapDispatchToProps
)(AdLoginScreen);

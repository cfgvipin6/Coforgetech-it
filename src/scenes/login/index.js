import React, { Component } from "react";
import {
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  BackHandler,
  ScrollView,
} from "react-native";
import { connect } from "react-redux";
import { Keyboard } from "react-native";
// import { ScrollView } from "react-native-gesture-handler"
import { DismissKeyboardView } from "../../components/DismissKeyboardView";
import {
  loginActionCreator,
  modalAction,
  checkVersion,
  loginDataClear,
} from "./LoginAction";
import { globalFontStyle } from "../../components/globalFontStyle";
import style from "./style.js";
import DialogModal from "../../components/dialogBox";
import GlobalData from "../../utilities/globalData";
import Header from "../../GlobalComponent/Header";
import ActivityIndicatorView from "../../GlobalComponent/myActivityIndicator";
import SplashScreen from "react-native-splash-screen";
import {
  removePassword,
  removeUserName,
  setLoginType,
} from "../auth/AuthUtility";
import { styles } from "../Dashboard/styles";
import { writeLog } from "../../utilities/logger";
import UserMessage from "../../components/userMessage";
import properties from "../../resource/properties";
import images from "../../images";
import HeaderView from "../../GlobalComponent/Header";
import { AppStyle } from "../commonStyle";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { DEVICE_VERSION } from "../../components/Device-info";
const lockIcon = require("../../assets/locked.png");
const personIcon = require("../../assets/person.png");
const bg_02 = require("../../assets/bg02.jpg");
const bg_01 = require("../../assets/bg01.jpg");
let constant = require("./constants");
let appConfig = require("../../../appconfig");
let globalData = new GlobalData();
let newEmployeeLength = 0;
let newEmployeeId = null;

class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      employeeId: null,
      password: null,
      loginData: [],
      message: "",
      visibility: false,
      heading: "",
      showPass: false,
    };
  }

  onFocus = () => {
    setTimeout(() => {
      this.props.clearLogin();
    }, 1000);
  };
  componentDidMount() {
    writeLog("Landed on " + "LoginScreen");
    this.props &&
      this.props.navigation &&
      this.props.navigation.addListener("willFocus", this.onFocus);
    SplashScreen.hide();
    removeUserName();
    removePassword();
    BackHandler.addEventListener("hardwareBackPress", this.goBack);
  }
  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.goBack);
  }
  componentDidUpdate(previousProps, state) {
    if (
      this.props.loginData &&
      this.props.loginData !== previousProps.loginData &&
      !this.props.loginData?.hasOwnProperty("res") &&
      !this.props.loginData?.hasOwnProperty("Exception")
    ) {
      globalData.setAccessToken(this.props.loginData?.Authkey);
      globalData.setLoggedInEmployeeId(this.props.loginData?.SmCode);
      this.props.navigation.replace("DashBoardNew2");
    } else if (this.props.loginData?.hasOwnProperty("res")) {
      if (previousProps.loginData != this.props.loginData) {
        this.setState({
          heading: "Sorry",
          message: "Invalid credentials , Please enter valid credentials.",
          visibility: true,
        });
      }
    } else if (this.props.loginData?.hasOwnProperty("Exception")) {
      if (previousProps.loginData != this.props.loginData) {
        this.setState({
          heading: "Error",
          message: this.props.loginData.Exception,
          visibility: true,
        });
      }
    }
  }
  setId(value) {
    let valueLength = value.length;
    newEmployeeLength = 8 - valueLength;
    newEmployeeId = value;
    this.setState({
      employeeId: value,
    });
  }

  setPassword(value) {
    this.setState({
      password: value,
    });
  }

  async checkDetails() {
    Keyboard.dismiss();
    writeLog("Clicked on " + "checkDetails" + " of " + "LoginScreen");
    if (
      this.state.password === null ||
      this.state.password === undefined ||
      this.state.password === "" ||
      newEmployeeId === null ||
      newEmployeeId === undefined ||
      newEmployeeId === ""
    ) {
      return alert("Please enter valid credentials !");
    }
    let password = this.state.password;
    setLoginType(constant.APP_LOGIN);
    this.props.login(newEmployeeId, password, this.clearData, undefined);
  }

  showDialogBox() {
    let exception;
    let heading;
    if (this.props.modalLoading) {
      if (this.props.loginData.hasOwnProperty("res")) {
        heading = "Sorry";
        exception = "Invalid credentials , Plese enter valid credentials.";
      } else if (this.props.loginData.hasOwnProperty("Exception")) {
        heading = "Error";
        exception = this.props.loginData.Exception;
      }
      // console.log("Exception to show in login dialog is:", exception)
      writeLog(
        "Dialog is open with exception " + exception + " on " + "LoginScreen"
      );
      return (
        <UserMessage
          modalVisible={true}
          heading={heading}
          message={exception}
          okAction={() => {
            this.handleConfirm(exception);
          }}
        />
      );
    } else {
      return null;
    }
  }

  clearData = () => {
    console.log("Clear data invoked.");
  };
  manageEmployeeId = () => {
    while (newEmployeeLength != 0) {
      newEmployeeId = "0" + newEmployeeId;
      newEmployeeLength--;
    }
    this.setState({ employeeId: newEmployeeId });
  };

  loginWithAd = () => {
    writeLog("Clicked on " + "loginWithAd" + " of " + "AdLoginScreen");
    setLoginType(constant.AD_LOGIN);
    this.props.navigation.navigate("WebRoute", {
      URL: properties.adLoginUrl,
    });
  };

  handleConfirm = (msg) => {
    console.log("Message is : ", msg);
    this.props.modalAction(false);
    this.setState({ visibility: false });
    writeLog("Clicked on " + "handleConfirm" + " of " + "LoginScreen");
    if (
      (this.props.loginData.StatusCode &&
        this.props.loginData.StatusCode === 405) ||
      (this.props.appVersion.Version &&
        this.props.appVersion.Version !== DEVICE_VERSION)
    ) {
      if (msg.includes("install")) {
        this.props.navigation.replace("WebRoute", {
          URL: properties.adLoginUrl,
        });
      }
    }
  };

  goBack = () => {
    writeLog("Clicked on " + "goBack" + " of " + "LoginScreen");
    return false;
  };
  showErrorView = () => {
    return (
      <UserMessage
        modalVisible={this.state.visibility}
        heading={this.state.heading}
        message={this.state.message}
        okAction={() => {
          this.handleConfirm(this.state.message);
        }}
      />
    );
  };
  renderMainView = () => {
    return (
      <ImageBackground source={images.loginBackground} style={{ flex: 1 }}>
        <ScrollView keyboardShouldPersistTaps="handled" style={{ flex: 1 }}>
          {this.state.visibility && this.showErrorView()}
          <HeaderView isLoginScreen={true} props={this.props} />
          <Text style={styles.versionTextStyle}>
            {"App Ver : " + DEVICE_VERSION}
          </Text>
          <ActivityIndicatorView loader={this.props.loginLoading} />
          <View style={style.middleView2}>
            <Text style={[AppStyle.font.fontMediumRegular, style.textStyle]}>
              Login
            </Text>
            <Text style={[AppStyle.font.fontSmallRegular, style.textStyle]}>
              User Name
            </Text>
            <TextInput
              theme={{
                colors: {
                  primary: "black",
                },
              }}
              onChangeText={(text) => this.setId(text)}
              underlineColor="transparent"
              placeholder={"Enter your empoloyee ID"}
              style={[AppStyle.font.fontSmallRegular, style.inputTextStyle]}
              autoCapitalize="none"
              autoCorrect={false}
              autoCompleteType={false}
            />
            <Text style={[AppStyle.font.fontSmallRegular, style.textStyle]}>
              Password
            </Text>
            <View style={styles.rowContainer}>
              <TextInput
                theme={{
                  colors: {
                    primary: "black",
                  },
                }}
                onChangeText={(text) => this.setPassword(text)}
                underlineColor="transparent"
                placeholder={"Enter your password"}
                style={[
                  AppStyle.font.fontSmallRegular,
                  style.inputTextStyle,
                  style.paddingBottom,
                ]}
                onFocus={() => this.manageEmployeeId()}
                secureTextEntry={!this.state.showPass}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <Icon
                name={this.state.showPass ? "eye-outline" : "eye-off-outline"}
                size={35}
                color="grey"
                style={style.eyeStyle}
                onPress={() =>
                  this.setState({ showPass: !this.state.showPass })
                }
              />
            </View>

            <TouchableOpacity
              onPress={() => {
                this.checkDetails();
              }}
            >
              <Image style={[style.textStyle]} source={images.loginButton} />
            </TouchableOpacity>
            <View style={style.seperatorContainer}>
              <View style={style.seperator} />
              <Text> Or Login Via </Text>
              <View style={style.seperator} />
            </View>
            <TouchableOpacity
              onPress={() => {
                this.loginWithAd();
              }}
            >
              <Image
                style={[style.textStyle, style.horizontalMid]}
                source={images.adLoginButton}
              />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>
    );
  };

  render() {
    if (Platform.OS === "ios") {
      return (
        <KeyboardAvoidingView style={style.container} behavior={"padding"}>
          {this.renderMainView()}
        </KeyboardAvoidingView>
      );
    } else {
      return (
        <DismissKeyboardView style={style.container}>
          {this.renderMainView()}
        </DismissKeyboardView>
      );
    }
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    modalAction: (data) => dispatch(modalAction(data)),
    login: (empId, password, callBack, undefined) =>
      dispatch(loginActionCreator(empId, password, callBack, undefined)),
    clearLogin: () => dispatch(loginDataClear()),
  };
};
const mapStateToProps = (state) => {
  return {
    loginData: state && state.loginReducer && state.loginReducer.loginData,
    loginLoading:
      state && state.loginReducer && state.loginReducer.login_loading,
    modalLoading:
      state && state.loginReducer && state.loginReducer.modal_loading,
    appVersion: state && state.authReducer && state.authReducer.version,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginScreen);

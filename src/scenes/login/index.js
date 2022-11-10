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
import { DismissKeyboardView } from "../../components/DismissKeyboardView";
import { loginActionCreator, modalAction, loginDataClear } from "./LoginAction";
import style from "./style.js";
import GlobalData from "../../utilities/globalData";
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
import { DEVICE_VERSION } from "../../components/DeviceInfoFile";
let constant = require("./constants");
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
    const { navigation } = this.props;
    navigation?.addListener("willFocus", this.onFocus);
    SplashScreen.hide();
    removeUserName();
    removePassword();
    BackHandler.addEventListener("hardwareBackPress", this.goBack);
  }
  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.goBack);
  }
  componentDidUpdate(previousProps, state) {
    const { loginData, navigation } = this.props;
    if (
      loginData &&
      loginData !== previousProps.loginData &&
      !loginData?.hasOwnProperty("res") &&
      !loginData?.hasOwnProperty("Exception")
    ) {
      globalData.setAccessToken(loginData?.Authkey);
      globalData.setLoggedInEmployeeId(loginData?.SmCode);
      navigation.replace("DashBoardNew2");
    } else if (loginData?.hasOwnProperty("res")) {
      if (previousProps.loginData != loginData) {
        this.setState({
          heading: "Sorry",
          message: "Invalid credentials , Please enter valid credentials.",
          visibility: true,
        });
      }
    } else if (loginData?.hasOwnProperty("Exception")) {
      if (previousProps.loginData != loginData) {
        this.setState({
          heading: "Error",
          message: loginData?.Exception,
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

  handleCheckDetails() {
    Keyboard.dismiss();
    const { password } = this.state;
    if (password && newEmployeeId) {
      setLoginType(constant.APP_LOGIN);
      this.props.login(newEmployeeId, password, this.clearData, undefined);
    } else return alert("Please enter valid credentials !");
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
    setLoginType(constant.AD_LOGIN);
    this.props.navigation.navigate("WebRoute", {
      URL: properties.adLoginUrl,
    });
  };

  handleConfirm = (msg) => {
    const { modalAction, loginData, appVersion, navigation } = this.props;
    modalAction(false);
    this.setState({ visibility: false });
    if (
      loginData?.StatusCode === 405 ||
      appVersion?.Version !== DEVICE_VERSION
    ) {
      if (msg.includes("install")) {
        navigation.replace("WebRoute", {
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
              placeholder={"Enter your employee ID"}
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

            <TouchableOpacity onPress={() => this.handleCheckDetails()}>
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
    loginData: state?.loginReducer?.loginData,
    loginLoading: state?.loginReducer?.login_loading,
    modalLoading: state?.loginReducer?.modal_loading,
    appVersion: state?.authReducer?.version,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginScreen);

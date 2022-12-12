import React, { useEffect, useState } from "react";
import {
  BackHandler,
  Image,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Text,
  TouchableOpacity,
  View,
  TextInput
} from "react-native";
import { SafeAreaView } from "react-native";
import SplashScreen from "react-native-splash-screen";
import { useDispatch, useSelector } from "react-redux";
import UserMessage from "../../components/userMessage";
import images from "../../images";
import GlobalData from "../../utilities/globalData";
import { writeLog } from "../../utilities/logger";
import { removePassword, removeUserName, setLoginType } from "../auth/AuthUtility";
import { AppStyle } from "../commonStyle";
import { loginActionCreator, loginDataClear, modalAction } from "./LoginAction";
import style from "./style";
import properties from "../../resource/properties";
import ActivityIndicatorView from "../../../src/GlobalComponent/myActivityIndicator";
import { AD_LOGIN, APP_LOGIN, HEADINGS } from "./constants";
import HeaderView from "../../GlobalComponent/Header";
import { DEVICE_VERSION } from "../../components/DeviceInfoFile";
let globalData = new GlobalData();
let newEmployeeLength = 0;
let newEmployeeId = null;
const LoginScreen2: React.FC = (props: any) => {
  const dispatch = useDispatch();

  const loginDataFromStore = useSelector((state) => state.loginReducer.loginData);
  const appVersion = useSelector((state) => state.loginReducer.version);
  const modalLoading = useSelector((state) => state.loginReducer.modalLoading);
  const [employeeId, setEmployeeId] = useState(null);
  const [password, setPassword] = useState(null);
  const [loginData, setLoginData] = useState([]);
  const [visibility, setModalVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [heading, setHeading] = useState("");
  const [loading, setLoading] = useState(false);
  const setId = (value) => {
    let valueLength = value.length;
    newEmployeeLength = 8 - valueLength;
    newEmployeeId = value;
    setEmployeeId(value);
  }

  const manageEmployeeId = () => {
    while (newEmployeeLength != 0) {
      newEmployeeId = '0' + newEmployeeId;
      newEmployeeLength--;
    }
    setEmployeeId(newEmployeeId);
  }

  const goBack = () => {
    writeLog('Clicked on ' + 'goBack' + ' of ' + 'LoginScreen');
    props.navigation.navigate('Login');
    return true;
  }
  const clearData = () => {
    // newEmployeeId = null;
    // setPassword(null);
    // setEmployeeId(null);
  }

  const checkDetails = async () => {
    setLoading(true);
    Keyboard.dismiss();
    writeLog('Clicked on ' + 'checkDetails' + ' of ' + 'LoginScreen');
    if (password) {
      setLoginType(APP_LOGIN);
      dispatch(loginActionCreator(employeeId, password, clearData, undefined));
    } else {
      clearData();
      return alert('Please enter valid credentials !');
    }
  }
  const onFocus = () => {
    setTimeout(() => {
      dispatch(loginDataClear())
    }, 1000);
  }
  useEffect(() => {
    SplashScreen.hide();
    removeUserName();
    removePassword();
    BackHandler.addEventListener('hardwareBackPress', goBack);
    props.navigation.addListener('willFocus', onFocus);
  }, [])

  const handleConfirm = msg => {
    console.log('Message is : ', msg);
    setModalVisible(false);
    writeLog('Clicked on ' + 'handleConfirm' + ' of ' + 'LoginScreen');
    clearData();
    if (
      (loginData.StatusCode && loginData.StatusCode === 405) ||
      (appVersion !== DEVICE_VERSION)
    ) {
      if (msg.includes('install')) {
        props.navigation.replace('WebRoute', {
          URL: properties.adLoginUrl,
        });
      }
    }
  }

  const showErrorView = () => {
    return (
      <UserMessage
        modalVisible={visibility}
        heading={heading}
        message={message}
        okAction={() => {
          handleConfirm(message);
        }}
      />
    );
  }
  const loginWithAd = () => {
    writeLog('Clicked on ' + 'loginWithAd' + ' of ' + 'AdLoginScreen');
    setLoginType(AD_LOGIN);
    props.navigation.navigate('WebRoute', {
      URL: properties.adLoginUrl,
    });
  }
  useEffect(() => {
    setLoading(false);
    if (loginDataFromStore?.hasOwnProperty('res')) {
      setHeading("Sorry");
      setMessage("Invalid credentials , Please enter valid credentials.");
      setModalVisible(true);
    }
    else if (loginDataFromStore?.hasOwnProperty('Exception')) {
      setHeading("Error");
      setMessage(loginDataFromStore.Exception);
      setModalVisible(true);
    }
    else if (loginDataFromStore?.hasOwnProperty('Authkey')) {
      globalData.setAccessToken(loginDataFromStore.Authkey);
      globalData.setLoggedInEmployeeId(loginDataFromStore.SmCode);
      props.navigation.replace('DashBoardNew2', {
        loginApiResponse: loginDataFromStore,
      });
    }
  }, [loginDataFromStore])
  return (
    <SafeAreaView>
      {visibility && showErrorView()}
      <ActivityIndicatorView loader={loading} />
      <KeyboardAvoidingView>
        <ImageBackground
          style={style.backGroundView}
          source={images.loginBackground}
        >
          <HeaderView />
          <View style={style.middleView2}>
            <Text style={[AppStyle.font.fontMediumRegular, style.textStyle]}>
              Login
            </Text>
            <Text style={[AppStyle.font.fontSmallRegular, style.textStyle]}>
              User Name
            </Text>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              autoCompleteType="off"
              theme={{
                colors: {
                  primary: "black",
                },
              }}
              onChangeText={(text) => setId(text)}
              underlineColor="transparent"
              placeholder={"Enter your empoloyee id"}
              style={[AppStyle.font.fontSmallRegular, style.inputTextStyle]}
            />
            <Text style={[AppStyle.font.fontSmallRegular, style.textStyle]}>
              Password
            </Text>
            <TextInput
              theme={{
                colors: {
                  primary: "black",
                },
              }}
              autoCapitalize="none"
              autoCorrect={false}
              autoCompleteType="off"
              onChangeText={(text) => setPassword(text)}
              underlineColor="transparent"
              placeholder={"Enter your password"}
              style={[AppStyle.font.fontSmallRegular, style.inputTextStyle]}
              onFocus={() => manageEmployeeId()}
            />
            <TouchableOpacity onPress={() => { checkDetails() }}>
              <Image style={[style.textStyle]} source={images.loginButton} />
            </TouchableOpacity>
            <View style={style.seperatorContainer}>
              <View style={style.seperator} />
              <Text> Or Login Via </Text>
              <View style={style.seperator} />
            </View>
            <TouchableOpacity onPress={() => { loginWithAd() }}>
              <Image
                style={[style.textStyle, style.horizontalMid]}
                source={images.adLoginButton}
              />
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen2;

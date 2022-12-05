import React, { Component } from 'react';
import { Text, View, Platform, Linking, NativeModules } from 'react-native';
import { connect } from 'react-redux';
import {
  loginActionCreator,
  modalAction,
  loginAction,
} from '../login/LoginAction';
import SplashScreen from 'react-native-splash-screen';
import { getUserName, getLoginType } from './AuthUtility';
import ActivityIndicatorView from '../../GlobalComponent/myActivityIndicator';
import RNExitApp from 'react-native-exit-app';
import { checkVersion } from './AuthActionCreator';
import { writeLog } from '../../utilities/logger';
import env from 'react-native-config';
import { ANDROID_URI, IOS_URI, TEMP_URI, IOS_DEV_URI } from './constants';
import { AD_LOGIN, APP_LOGIN } from '../login/constants';
import { pendingActionCreator } from '../Dashboard/PendingAction';
import properties from '../../resource/properties';
import { styles } from '../Dashboard/styles';
import UserMessage from '../../components/userMessage';
import { isAppInstalled } from 'react-native-send-intent';
import { DEVICE_VERSION } from '../../components/DeviceInfoFile';
let SendIntentAndroid = require('react-native-send-intent');

class AuthScreen extends Component {
  _isFocus = false;
  navigateToDashboard = () => {
    // console.log("Navigating to dashboard....")
    SplashScreen.hide();
    this.props.navigation.replace('DashBoardNew2');
  };
  callLoginService = async (val) => {
    // console.log("Version matched is : ", val)
    getLoginType().then(async (value) => {
      SplashScreen.hide();
      console.log('Login type is :', value);
      if (value === null) {
        this.props.navigation.replace('Login');
      } else if (value === AD_LOGIN) {
        let url = properties.adLoginUrl;
        this.props.navigation.replace('WebRoute', {
          URL: properties.adLoginUrl,
        });
      } else if (value === APP_LOGIN) {
        let user = getUserName();
        user.then((userData) => {
          if (userData !== null && userData !== undefined) {
            this.props.updateLoginData(userData);
            this.props.getPendingCounts(userData, false);
            this.props.navigation.replace('DashBoardNew2');
          } else {
            this.props.navigation.replace('Login');
          }
        });
      }
    });
  };
  async componentDidMount() {
    this.props.checkForVersion(this.callLoginService);
    this.props.navigation.addListener('willFocus', this.onFocus);
  }
  onFocus = () => {
    this._isFocus = true;
  };
  componentWillUnmount() {
    this._isFocus = false;
  }
  handleCancel = () => {
    writeLog('Clicked on ' + 'handleCancel' + ' of ' + 'AuthScreen');
    this.props.modalAction(false);
    RNExitApp.exitApp();
  };
  handleConfirm = (msg) => {
    writeLog('Clicked on ' + 'handleConfirm' + ' of ' + 'AuthScreen');
    this.props.modalAction(false);
    let iOS_URI = properties.isDevEnvironment ? IOS_DEV_URI : IOS_URI;
    let URI = Platform.OS === 'android' ? env.ANDROID_URI : iOS_URI;
    if (
      this.props.appVersion.Version &&
      this.props.appVersion.Version !== DEVICE_VERSION
    ) {
      Linking.canOpenURL(URI).then((supported) => {
        // console.log("Supported ", supported, URI)
        if (supported) {
          Linking.openURL(URI).then(() => {
            setTimeout(() => {
              RNExitApp.exitApp();
            }, 1000);
          });
        } else {
          // console.log("Don't know how to open URI: " + URI)
        }
      });
    } else if (msg && msg.includes('Invalid credentials')) {
      this.props.navigation.replace('Login');
    } else {
      RNExitApp.exitApp();
    }
  };
  showDialogBox() {
    let exception;
    let heading;
    if (this.props.modal_auth_loading) {
      if (
        Platform.OS === 'android' &&
        this.props.appVersion.hasOwnProperty('Version')
      ) {
        SplashScreen.hide();
        exception =
          'Latest version of app is available. Press OK button to update.';
        heading = 'Version Update';
      } else if (this.props.appVersion.hasOwnProperty('Version')) {
        SplashScreen.hide();
        exception =
          'Latest version of iEngage App has been made available on iEngage website. Please uninstall the old version from your phone. Using mobile phone browser, install latest iEngage App from iEngage website main page.';
        heading = 'Version Update';
      } else if (this.props.authError.hasOwnProperty('Exception')) {
        SplashScreen.hide();
        heading = 'Error';
        exception = this.props.authError.Exception;
      } else if (this.props.loginData.hasOwnProperty('res')) {
        SplashScreen.hide();
        heading = 'Error';
        exception = 'Invalid credentials , Plese enter valid credentials.';
      } else if (this.props.loginData.hasOwnProperty('Exception')) {
        SplashScreen.hide();
        heading = 'Error';
        exception = this.props.loginData.Exception;
      }
      // console.log("Exception to show in auth dialog is:", exception)
      writeLog(
        'Dialog is open with exception ' + exception + ' on ' + 'AuthScreen'
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
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicatorView
          loader={this.props.authLoading || this.props.loginLoading}
        />
        {/* <ActivityIndicatorView loader={this.props.loginLoading} /> */}
        {this.showDialogBox()}
      </View>
    );
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    updateLoginData: (user) => dispatch(loginAction(user)),
    getPendingCounts: (user, val) => dispatch(pendingActionCreator(user, val)),
    checkForVersion: (callBack) => dispatch(checkVersion(callBack)),
    modalAction: (data) => dispatch(modalAction(data)),
    login: (empId, password, undefined, callBack) =>
      dispatch(loginActionCreator(empId, password, undefined, callBack)),
  };
};
const mapStateToProps = (state) => {
  return {
    authLoading: state.authReducer.authLoading,
    modal_auth_loading: state.authReducer.modal_auth_loading,
    appVersion: state.authReducer.version,
    authError: state.authReducer.error,
    loginData: state.loginReducer?.loginData,
    loginLoading: state.loginReducer.login_loading,
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthScreen);

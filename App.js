import React, { Component } from 'react';
import {
  SafeAreaView,
  Platform,
  PermissionsAndroid,
  Text,
  Alert,
  Linking,
} from 'react-native';
import Router from './router';
import RNExitApp from 'react-native-exit-app';
import DialogModal from './src/components/dialogBox';
import { Provider } from 'react-redux';
import { AppStore } from './AppStore';
import Geolocation from '@react-native-community/geolocation';
import codePush from 'react-native-code-push';
import Crashes, { ErrorAttachmentLog } from 'appcenter-crashes';
import {
  createLogFile,
  writeLog,
  readIniitianLog,
  deleteLogFile,
} from './src/utilities/logger';
import JailMonkey from 'jail-monkey';
import UserMessage from './src/components/userMessage';
import * as permissions from 'react-native-permissions';
import { request, PERMISSIONS } from 'react-native-permissions';
import { DEVICE_VERSION } from './src/components/DeviceInfoFile';

var RNFS = require('react-native-fs');
let rooted;
var path =
  Platform.OS === 'ios'
    ? RNFS.DocumentDirectoryPath + '/iEngageAppLog.txt'
    : RNFS.ExternalDirectoryPath + '/iEngageAppLog.txt';
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rooted: false,
      logs: '',
      forceUpdate: true,
    };

    if (Platform.OS === 'android') {
      async function requestLocationPermission() {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Access Required',
              message: 'This App needs to Access your location',
            }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            // console.log("Permission granted for android.");
          } else {
            alert('Permission Denied');
          }
        } catch (exception) {
          // console.log("Error found in side try catch ",exception);
        }
      }
      requestLocationPermission();
    } else {
      this.fetchPosition();
    }
    request(
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.CAMERA
        : PERMISSIONS.ANDROID.CAMERA
    ).then((result) => {
      console.log(result);
    });
  }
  fetchPosition = () => {
    Geolocation.getCurrentPosition(
      (position) => console.log(position),
      (error) => console.log(error),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  };

  resigterForCrash = async () => {
    const enabled = await Crashes.isEnabled();
    // console.log("Crash status is :",enabled)
    const crashReport = await Crashes.lastSessionCrashReport();
    // console.log("Last session crash report is : ",crashReport);
    const didCrash = await Crashes.hasCrashedInLastSession();
    // console.log("Did app crashed ? ",didCrash)
    let fileExists = RNFS.exists(path);
    if (!didCrash || !fileExists) {
      createLogFile();
    }
    Crashes.setListener({
      getErrorAttachments(report) {
        return (async () => {
          const textContent = await readIniitianLog();
          // console.log("Text content read from file is :",textContent)
          const textAttachment = ErrorAttachmentLog.attachmentWithText(
            textContent,
            'iEngageLog.txt'
          );
          return [textAttachment];
        })();
      },
      onBeforeSending: function(report) {
        // console.log("Crash report before sending is : ",crashReport);
      },
      onSendingSucceeded: function(report) {
        // console.log("Crash report send successfully is : ",crashReport);
        createLogFile();
      },
      onSendingFailed: function(report) {
        // console.log("Crash report is failed : ",crashReport);
      },
    });
  };
  checkForRootedDevice = async () => {
    let p = new Promise((resolve, reject) => {
      if (Platform.OS === 'ios') {
        // console.log("checking root for ios")
        if (
          JailMonkey.trustFall() === true ||
          JailMonkey.isJailBroken() === true
        ) {
          resolve(true);
        } else {
          resolve(false);
        }
      } else if (Platform.OS === 'android') {
        console.log('JailMonkey.trustFall() ', JailMonkey.trustFall());
        console.log('JailMonkey.isJailBroken() ', JailMonkey.isJailBroken());
        // console.log("checking root for android")
        // if(JailMonkey.trustFall()===true || JailMonkey.isJailBroken()===true || JailMonkey.isOnExternalStorage()===true || JailMonkey.hookDetected()===true){
        if (
          JailMonkey.trustFall() === true ||
          JailMonkey.isJailBroken() === true
        ) {
          //  resolve(true);
        } else {
          resolve(false);
        }
      }
    });
    return p;
  };
  showVersionUpdatePopup = () => {
    if (Platform.OS === 'android') {
      return (
        <UserMessage
          modalVisible={this.state.forceUpdate}
          heading="Version Update"
          message="You need to update your app"
          okAction={() => {
            this.onOkClick();
          }}
        />
      );
    }
  };
  showRootDialog = () => {
    return (
      <UserMessage
        modalVisible={true}
        heading="Rooted Device"
        message="Can not run iEngage on rooted device."
        okAction={() => {
          this.handleConfirm();
        }}
      />
    );
  };
  handleConfirm = () => {
    RNExitApp.exitApp();
  };

  onOkClick = () => {
    console.log('Clicked');
    let androidURI =
      'https://install.appcenter.ms/users/coforge/apps/iengage-1/distribution_groups/coforge%20limited';
    this.setState({ forceUpdate: false }, () => {
      Linking.canOpenURL(androidURI).then((supported) => {
        // console.log("Supported ", supported, URI)
        if (supported) {
          Linking.openURL(androidURI).then(() => {
            setTimeout(() => {
              RNExitApp.exitApp();
            }, 1000);
          });
        } else {
          // console.log("Don't know how to open URI: " + URI)
        }
      });
    });
  };
  async componentDidMount() {
    let val = await this.checkForRootedDevice();
    this.setState({ rooted: val });
    this.resigterForCrash();
    codePush.sync(
      { updateDialog: false, installMode: codePush.InstallMode.IMMEDIATE },
      (syncStatus) => {
        switch (syncStatus) {
          case codePush.SyncStatus.UP_TO_DATE:
            console.log('UP_TO_DATE');
            break;
          case codePush.SyncStatus.UPDATE_INSTALLED:
            console.log('UPDATE_INSTALLED');
            break;
          case codePush.SyncStatus.UPDATE_IGNORED:
            console.log('UPDATE_IGNORED');
            break;
          case codePush.SyncStatus.UNKNOWN_ERROR:
            console.log('UNKNOWN_ERROR');
            break;
          case codePush.SyncStatus.SYNC_IN_PROGRESS:
            console.log('SYNC_IN_PROGRESS');
            break;
          case codePush.SyncStatus.CHECKING_FOR_UPDATE:
            console.log('CHECKING_FOR_UPDATE');
            break;
          case codePush.SyncStatus.AWAITING_USER_ACTION:
            console.log('AWAITING_USER_ACTION');
            break;
          case codePush.SyncStatus.DOWNLOADING_PACKAGE:
            console.log('DOWNLOADING_PACKAGE');
            break;
          case codePush.SyncStatus.INSTALLING_UPDATE:
            console.log('INSTALLING_UPDATE');
            break;
        }
      }
    );
  }
  render() {
    if (
      Platform.OS === 'android' &&
      this.state.forceUpdate == true &&
      ((DEVICE_VERSION == '20.6.1' &&
        DEVICE_VERSION == '20.7.1') ||
        DEVICE_VERSION == '20.8.1')
    ) {
      return this.showVersionUpdatePopup();
    }
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        {this.state.rooted === true ? (
          this.showRootDialog()
        ) : (
          <Provider store={AppStore}>
            <Router />
          </Provider>
        )}
      </SafeAreaView>
    );
  }
}
const codePushOptions = {
  checkFrequency: codePush.CheckFrequency.ON_APP_START,
  installMode: codePush.InstallMode.IMMEDIATE,
};
export default codePush(codePushOptions)(App);

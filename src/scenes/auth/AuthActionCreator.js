import {
  MODAL_AUTH_LOADING,
  APP_VERSION,
  STORE_VERSION_ERROR,
  AUTH_LOADING,
} from './constants';
import { fetchPOSTMethod } from '../../utilities/fetchService';
import { netInfo } from '../../utilities/NetworkInfo';
import { NO_INTERNET, UNDEFINED_ERROR } from '../../GlobalConstants';
import properties from '../../resource/properties';
import SplashScreen from 'react-native-splash-screen';
import { setEncryptionKey } from './AuthUtility';
import { DEVICE_VERSION } from '../../components/DeviceInfoFile';
const loading = (data) => {
  return {
    type: AUTH_LOADING,
    payload: data,
  };
};
export const modalAction = (data) => {
  return {
    type: MODAL_AUTH_LOADING,
    payload: data,
  };
};
const storeVersionException = (data) => {
  return {
    type: STORE_VERSION_ERROR,
    payload: data,
  };
};
const version = (data) => {
  return {
    type: APP_VERSION,
    payload: data,
  };
};
export const checkVersion = (callBack) => {
  return async (dispatch) => {
    let isNetwork = await netInfo();
    SplashScreen.hide();
    if (isNetwork) {
      try {
        dispatch(loading(true));
        let versionCheckUrl = properties.getAppVersion;
        // console.log("Version URL: ",versionCheckUrl);
        // console.log("Device current version is : ",DeviceInfo.getVersion());
        let response = await fetchPOSTMethod(versionCheckUrl);
        console.log(
          'response of version check: === ',
          response,
          'DEVICE_VERSION',
          DEVICE_VERSION
        );
        if (response.length !== undefined) {
          if (
            response.length === 1 &&
            response[0].hasOwnProperty('Exception')
          ) {
            // console.log("check version api exception : ",response);
            dispatch(loading(false));
            dispatch(modalAction(false));
            dispatch(storeVersionException(response[0]));
            setTimeout(() => {
              dispatch(modalAction(true));
            }, 1000);
          } else {
            // console.log("check version response from server is : ", response);
            dispatch(loading(false));
            dispatch(modalAction(false));
            let versionMatched = false;
            let versionMatchedName = '';
            response.forEach((element) => {
              if (element.Version === DEVICE_VERSION) {
                versionMatched = true;
                versionMatchedName = element.Version;
                setEncryptionKey(response[response.length - 1].Version); // in last version key there is encryption key
              }
            });

            if (!versionMatched) {
              dispatch(version(response[0]));
              setTimeout(() => {
                dispatch(modalAction(true));
              }, 1000);
            } else {
              callBack(versionMatchedName);
            }
          }
        } else if (
          response.length === undefined ||
          response.length === 0 ||
          response === null ||
          response === undefined
        ) {
          // console.log("In side undefined response of check version.", error);
          dispatch(loading(false));
          dispatch(storeVersionException(UNDEFINED_ERROR));
          dispatch(modalAction(true));
        }
      } catch (error) {
        // console.log("In side catch block of login action", error);
        dispatch(loading(false));
        dispatch(storeVersionException(UNDEFINED_ERROR));
        dispatch(modalAction(true));
      }
    } else {
      setTimeout(() => {
        alert(NO_INTERNET);
      }, 1000);
    }
  };
};

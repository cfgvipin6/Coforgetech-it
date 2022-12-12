import {
  LOGIN_ACTION,
  LOGIN_LOADING,
  MODAL_LOADING,
  LOGIN_DATA_CLEAR,
} from './constants';
import { fetchPOSTMethod } from '../../utilities/fetchService';
import { netInfo } from '../../utilities/NetworkInfo';
import { NO_INTERNET, UNDEFINED_ERROR } from '../../GlobalConstants';
import { pendingActionCreator } from '../Dashboard/PendingAction';
import { setUserName, setPassword } from '../auth/AuthUtility';
import properties from '../../resource/properties';
import {
  DEVICE_VERSION,
  DEVICE_NAME,
  DEVICE_OS,
  DEVICE_OS_VERSION,
  DEVICE_MODEL,
} from '../../components/DeviceInfoFile';
export const loginAction = (data) => {
  return {
    type: LOGIN_ACTION,
    payload: data,
  };
};
const loading = (data) => {
  return {
    type: LOGIN_LOADING,
    payload: data,
  };
};

export const modalAction = (data) => {
  return {
    type: MODAL_LOADING,
    payload: data,
  };
};
export const loginDataClear = () => {
  return {
    type: LOGIN_DATA_CLEAR,
  };
};
export const loginActionCreator = (
  newEmployeeId,
  passWord,
  cb = () => {},
  dashBoardCallBack
) => {
  return async (dispatch) => {
    let isNetwork = await netInfo();
    if (isNetwork) {
      try {
        dispatch(loading(true));
        let loginUrl = properties.loginNewUrl2;
        let deviceName = await DEVICE_NAME;
        let deviceModel = await DEVICE_MODEL;
        let deviceOs = await DEVICE_OS;
        let osVersion = await DEVICE_OS_VERSION;
        let form = new FormData();
        form.append('EmpCode', newEmployeeId);
        form.append('Password', passWord);
        form.append('SMCode', newEmployeeId);
        form.append('Version', DEVICE_VERSION);
        form.append('DeviceName', deviceName);
        form.append('DeviceModel', deviceModel);
        form.append('DeviceOS', deviceOs + ',' + osVersion);
        console.log('Hitting login api  : ', form);
        let response = await fetchPOSTMethod(loginUrl, form);
        console.log('login response  : ', response);
        if (
          response.length == 1 &&
          (response[0].hasOwnProperty('res') ||
            response[0].hasOwnProperty('Exception'))
        ) {
          cb(response[0]);
          dispatch(loading(false));
          dispatch(modalAction(false));
          dispatch(loginAction(response[0]));
          setTimeout(() => {
            dispatch(modalAction(true));
          }, 1000);
        } else {
          cb(response[0]);
          dispatch(pendingActionCreator(response[0], false));
          dispatch(loading(false));
          dispatch(modalAction(false));
          dispatch(loginAction(response[0]));
          setUserName(response[0]);
          setPassword(passWord);
          if (dashBoardCallBack !== undefined) {
            dashBoardCallBack(response[0]);
          }
        }
      } catch (error) {
        console.log('Error : ', error);
        // cb(); // cb does not handle in case comes error
        // console.log("In side catch block of login action", error);
        dispatch(loading(false));
        dispatch(modalAction(false));
        dispatch(loginAction(UNDEFINED_ERROR));
        setTimeout(() => {
          dispatch(modalAction(true));
        }, 1000);
      }
    } else {
      // cb();
      dispatch(loading(false));
      dispatch(modalAction(false));
      setTimeout(() => {
        alert(NO_INTERNET);
      }, 1000);
    }
  };
};

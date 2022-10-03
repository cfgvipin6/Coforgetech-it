import { LOGIN_ACTION, LOGIN_LOADING, MODAL_LOADING, APP_VERSION, LOGIN_DATA_CLEAR } from './constants';
import {fetchPOSTMethod } from '../../utilities/fetchService';
import { netInfo } from '../../utilities/NetworkInfo';
import { NO_INTERNET, UNDEFINED_ERROR } from '../../GlobalConstants';
import { pendingActionCreator } from '../Dashboard/PendingAction';
import { setUserName, setPassword } from '../auth/AuthUtility';
import properties from '../../resource/properties';
import DeviceInfo from 'react-native-device-info';
import { Platform } from 'react-native';
export const loginAction = data => {
  return {
    type: LOGIN_ACTION,
    payload: data,
  };
};
const loading = data => {
  return {
    type: LOGIN_LOADING,
    payload: data,
  };
};

export const modalAction = data => {
  return {
    type: MODAL_LOADING,
    payload: data,
  };
};
export const loginDataClear = ()=>{
return {
  type:LOGIN_DATA_CLEAR,
};
};
export const loginActionCreator = (newEmployeeId, passWord,clearDataCallBack,dashBoardCallBack) => {
  return async dispatch => {
    let isNetwork = await netInfo();
    if (isNetwork) {
      try {
      dispatch(loading(true));
      let loginUrl = properties.loginNewUrl2;
      let deviceName = await DeviceInfo.getDeviceName();
      let deviceModel =  await DeviceInfo.getBrand();
      let deviceOs = await DeviceInfo.getSystemName();
      let osVersion = await DeviceInfo.getSystemVersion();
      let form = new FormData();
      form.append('EmpCode', newEmployeeId);
      form.append('Password', passWord);
      form.append('SMCode', newEmployeeId);
      form.append('Version', DeviceInfo.getVersion());
      form.append('DeviceName', deviceName);
      form.append('DeviceModel',deviceModel);
      form.append('DeviceOS', deviceOs + ',' + osVersion);
      console.log('Hitting login api  : ', form);
      let response = await fetchPOSTMethod(loginUrl, form);
      console.log('login response  : ', response);
        if (
          response.length == 1 &&
          (response[0].hasOwnProperty('res') ||
            response[0].hasOwnProperty('Exception'))
        ) {
          if (clearDataCallBack !== undefined){
            clearDataCallBack();
          }
          dispatch(loading(false));
          dispatch(modalAction(false));
          dispatch(loginAction(response[0]));
          setTimeout(() => {
            dispatch(modalAction(true));
          }, 1000);
        } else {
          dispatch(pendingActionCreator(response[0], false));
          dispatch(loading(false));
          dispatch(modalAction(false));
          dispatch(loginAction(response[0]));
          setUserName(response[0]);
          setPassword(passWord);
          if (dashBoardCallBack !== undefined){
            dashBoardCallBack(response[0]);
          }
        }
      } catch (error) {
        console.log('Error : ', error);
        if (clearDataCallBack !== undefined){
          clearDataCallBack();
        }
        // console.log("In side catch block of login action", error);
        dispatch(loading(false));
        dispatch(modalAction(false));
        dispatch(loginAction(UNDEFINED_ERROR));
        setTimeout(() => {
          dispatch(modalAction(true));
        }, 1000);
      }
    } else {
      clearDataCallBack();
      dispatch(loading(false));
      dispatch(modalAction(false));
      setTimeout(() => {
        alert(NO_INTERNET);
      }, 1000);
    }
  };
};

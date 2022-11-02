import { netInfo } from '../../utilities/NetworkInfo';
import { NO_INTERNET, UNDEFINED_MESSAGE } from '../../GlobalConstants';
import properties from '../../resource/properties';
import { fetchPOSTMethod, fetchGETMethod } from '../../utilities/fetchService';
import { AD_ERROR, AD_RESPONSE, AD_LOADING, CLEAR_USER_DATA, REMOVE_LOADER } from './constants';
import { DEVICE_MODEL, DEVICE_NAME,DEVICE_OS,DEVICE_OS_VERSION } from '../../components/DeviceInfoFile';
const storeAdError = errorData => {
  return {
    type: AD_ERROR,
    payload: errorData,
  };
};
const storeAdResponse = adResponse => {
  return {
    type: AD_RESPONSE,
    payload: adResponse,
  };
};
const loading = data => {
  return {
    type: AD_LOADING,
    payload: data,
  };
};
export const clearData = () => {
  return {
    type: CLEAR_USER_DATA,
  };
};
export const removeLoader = () => {
  return {
    type: REMOVE_LOADER,
  };
};
export const loginWithAdAction = (adToken, skn, version, forwardCallBack) => {
  return async dispatch => {
    let isNetwork = await netInfo();
    if (isNetwork) {
      try {
        let deviceName = await DEVICE_NAME;
        let deviceModel =  await DEVICE_MODEL;
        let deviceOs = await DEVICE_OS;
        let osVersion = await DEVICE_OS_VERSION;
        let formData = new FormData();
        formData.append('AuthToken', adToken);
        formData.append('SknToken', skn);
        formData.append('Version', version);
        formData.append('DeviceName', deviceName);
        formData.append('DeviceModel',deviceModel);
        formData.append('DeviceOS', deviceOs + ',' + osVersion);
        let url = properties.loginWithAdToken;
        dispatch(loading(true));
        let response = await fetchPOSTMethod(url, formData);
        if (response !== undefined) {
          if (response.length === 1 && response[0].hasOwnProperty('Exception')) {
            // console.log("AD token exception from server is :  ", response)
            dispatch(storeAdError(response[0].Exception));
          } else {
            // console.log("AD token response from server is : ", response)
            dispatch(storeAdResponse(response));
            setTimeout(() => {
              forwardCallBack();
            }, 1000);
          }
        } else {
          dispatch(storeAdError(UNDEFINED_MESSAGE));
        }
      } catch (error) {
        dispatch(loading(false));
        dispatch(storeAdError(UNDEFINED_MESSAGE));
      }
    } else {
      alert(NO_INTERNET);
    }
  };
};

export const againLoginWithAdAction = (adToken, skn, user, version, forwardCallBack) => {
  return async dispatch => {
    let isNetwork = await netInfo();
    if (isNetwork) {
      try {
       let deviceName = await DEVICE_NAME;
        let deviceModel =  await DEVICE_MODEL;
        let deviceOs = await DEVICE_OS;
        let osVersion = await DEVICE_OS_VERSION;

        let formData = new FormData();
        formData.append('AuthToken', adToken);
        formData.append('SknToken', skn);
        formData.append('AuthKey', user.AuthKey);
        formData.append('GUIDKey', user.GuID);
        formData.append('SMCode', user.SmCode);
        formData.append('Version', version);
        formData.append('DeviceName', deviceName);
        formData.append('DeviceModel',deviceModel);
        formData.append('DeviceOS', deviceOs + ',' + osVersion);
        let url = properties.loginWithAdToken;
        dispatch(loading(true));
        let response = await fetchPOSTMethod(url, formData);
        if (response !== undefined) {
          if (response.length === 1 && response[0].hasOwnProperty('Exception')) {
            // console.log("Again login AD token exception from server is :  ", response)
            dispatch(storeAdError(response[0].Exception));
          } else {
            // console.log("Again login AD token response from server is : ", response)
            dispatch(storeAdResponse(response));
            setTimeout(() => {
              forwardCallBack();
            }, 1000);
          }
        } else {
          dispatch(storeAdError(UNDEFINED_MESSAGE));
        }
      } catch (error) {
        // console.log("Error is:", error)
        dispatch(loading(false));
        dispatch(storeAdError(UNDEFINED_MESSAGE));
      }
    } else {
      alert(NO_INTERNET);
    }
  };
};

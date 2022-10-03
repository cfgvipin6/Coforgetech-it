import { NO_INTERNET, UNDEFINED_MESSAGE } from '../../GlobalConstants';
import properties from '../../resource/properties';
import { netInfo } from '../../utilities/NetworkInfo';
import { fetchPOSTMethod } from '../../utilities/fetchService';
import {
  STORE_YEAR_LOCATION,
  HOLIDAY_LOADING,
  HOLIDAY_ERROR,
  STORE_HOLIDAY_DATA,
  RESET_HOLIDAY,
  RESET_HOLIDAY_FETCHED,
  NO_LEAVE_DATA,
} from './constants';
import { showToast } from '../../GlobalComponent/Toast';
let UserId;
let AuthKey;
const loading = data => {
  return {
    type: HOLIDAY_LOADING,
    payload: data,
  };
};
const leaveError = data => {
  return {
    type: HOLIDAY_ERROR,
    payload: data,
  };
};
const storeYearLocation = data => {
  return {
    type: STORE_YEAR_LOCATION,
    payload: data,
  };
};
const storeLeaveData = data => {
  return {
    type: STORE_HOLIDAY_DATA,
    payload: data,
  };
};
export const resetNoLeaves = () => {
  return {
    type: RESET_HOLIDAY_FETCHED,
  };
};
const noLeaveData = () => {
  return {
    type: NO_LEAVE_DATA,
  };
};
export const resetLeave = () => {
  return {
    type: RESET_HOLIDAY,
  };
};

export const leaveYearLocation = (userId, authKey, successCallBack, errorCallBack) => {
  return async dispatch => {
    let isNetwork = await netInfo();
    UserId = userId;
    AuthKey = authKey;
    if (isNetwork) {
      try {
        let url = properties.getYearLocation;
        // console.log("Leave url is : ", url);
        let form = new FormData();
        form.append('ECSerp', UserId);
        form.append('AuthKey', AuthKey);
        console.log('Attached form data for leave : ' + JSON.stringify(form));
        let response = await fetchPOSTMethod(url, form);
        console.log('Location n year response is :', response);
        if (response != null) {
          if (
            response[0]?.hasOwnProperty('Exception')
          ) {
            errorCallBack(response[0].Exception);
          } else {
            successCallBack(response);
          }
        } else {
          dispatch(leaveError(UNDEFINED_MESSAGE));
          errorCallBack(UNDEFINED_MESSAGE);
        }
      } catch (error) {
        errorCallBack(UNDEFINED_MESSAGE);
      }
    } else {
      return alert(NO_INTERNET);
    }
  };
};

export const holidayActionCreator = (year, countryCode,holidaySuccessCallBack, errorCallBack) => {
  return async dispatch => {
    let isNetwork = await netInfo();
    if (isNetwork) {
      try {
        dispatch(loading(true));
        let url = properties.getHolidays;
        // console.log("Leave url is : ", url);
        let form = new FormData();
        form.append('ECSerp', UserId);
        form.append('AuthKey', AuthKey);
        form.append('Year', year);
        form.append('Country', countryCode);
        console.log('Attached form data for Holiday : ' + JSON.stringify(form));
        let response = await fetchPOSTMethod(url, form);
        console.log('Holiday temp response from server is : ', response);
        if (response.length != undefined) {
          if (
            response.length === 1 &&
            response[0].hasOwnProperty('Exception')
          ) {
            errorCallBack(response[0].Exception);
          } else {
              holidaySuccessCallBack(response);
            }
        } else {
          dispatch(leaveError(UNDEFINED_MESSAGE));
        }
      } catch (error) {
        dispatch(leaveError(UNDEFINED_MESSAGE));
      }
    } else {
      return alert(NO_INTERNET);
    }
  };
};

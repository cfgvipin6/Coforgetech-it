import {
  LOADING_PENDING,
  STORE_PENDING_ACTION,
  STORE_PENDING_ERROR,
  RESET_DASHBOARD,
  STORE_ATTENDANCE,
  STORE_ATTENDANCE_ERROR,
  STORE_ELIGIBILITY,
  RESET_ELIGIBILITY,
  STORE_VIEW_ATTENDANCE_ERROR,
  CLEAR_ATTENDANCE,
  RESET_ERRORS,
  STORE_DASHBOARD_ERROR,
} from './Constants';
import { fetchPOSTMethod } from '../../utilities/fetchService';
import properties from '../../resource/properties';
import { netInfo } from '../../utilities/NetworkInfo';
import {
  NO_INTERNET,
  UNDEFINED_ERROR,
  UNDEFINED_MESSAGE,
} from '../../GlobalConstants';
export const loading = data => {
  return {
    type: LOADING_PENDING,
    payload: data,
  };
};
const storePendingList = data => {
  return {
    type: STORE_PENDING_ACTION,
    payload: data,
  };
};
const resetState = () => {
  return {
    type: RESET_DASHBOARD,
  };
};
export const resetEligibility = () => {
  return {
    type: RESET_ELIGIBILITY,
  };
};
const storeException = data => {
  return {
    type: STORE_DASHBOARD_ERROR,
    payload: data,
  };
};
const storeAttendanceException = data => {
  return {
    type: STORE_DASHBOARD_ERROR,
    payload: data,
  };
};
const storeViewAttendanceException = data => {
  return {
    type: STORE_DASHBOARD_ERROR,
    payload: data,
  };
};
const storeAttendanceData = data => {
  return {
    type: STORE_ATTENDANCE,
    payload: data,
  };
};
export const clearAttendance = () => {
  return {
    type: CLEAR_ATTENDANCE,
  };
};
export const resetDashboardCreator = () => {
  return async dispatch => {
    dispatch(resetState());
  };
};
export const resetErrors = () => {
  return {
    type: RESET_ERRORS,
  };
};
const storeEligibilityData = data => {
  return {
    type: STORE_ELIGIBILITY,
    payload: data,
  };
};

export const checkingForEligibility = (
  time,
  empCode,
  authKey,
  attendanceCallBack
) => {
  return async dispatch => {
    let isNetwork = await netInfo();
    if (isNetwork) {
      try {
        let form = new FormData();
        form.append('ECSerp', empCode);
        form.append('AuthKey', authKey);
        form.append('vc_clienttime', time);
        let url = properties.checkEligibility;
        let eligibilityResponse = await fetchPOSTMethod(url, form);
        console.log('Eligibility Response : ', eligibilityResponse);
        if (eligibilityResponse.length != undefined) {
          if (
            eligibilityResponse.length === 1 &&
            eligibilityResponse[0].hasOwnProperty('Exception')
          ) {
            dispatch(
              storeViewAttendanceException(eligibilityResponse[0].Exception)
            );
          } else {
            dispatch(storeEligibilityData(eligibilityResponse));
            if (attendanceCallBack !== null) {
              attendanceCallBack();
            }
          }
        } else {
          dispatch(storeViewAttendanceException(UNDEFINED_MESSAGE));
        }
      } catch (error) {
        dispatch(storeViewAttendanceException(UNDEFINED_MESSAGE));
      }
    } else {
      return alert(NO_INTERNET);
    }
  };
};
export const checkingForAttendance = (
  currentTime,
  empCode,
  authKey,
  lat,
  lng,
  successCallBack,
  errorCallBack,
) => {
  return async dispatch => {
    let isNetwork = await netInfo();
    if (isNetwork) {
      try {
        dispatch(loading(true));
        let form = new FormData();
        form.append('ECSerp', empCode);
        form.append('AuthKey', authKey);
        form.append('vc_clienttime', currentTime);
        form.append('vc_lat', lat);
        form.append('vc_long', lng);
        let url = properties.checkAttendance;
        let attendanceResponse = await fetchPOSTMethod(url, form);
        console.log('Attendance response from server : ', attendanceResponse);
        if (attendanceResponse.length != undefined) {
          if (
            attendanceResponse.length === 1 &&
            attendanceResponse[0].hasOwnProperty('Exception')
          ) {
            errorCallBack(attendanceResponse[0].Exception);
          } else {
            dispatch(storeAttendanceData(attendanceResponse));
            successCallBack(attendanceResponse);
          }
        } else {
          dispatch(storeAttendanceException(UNDEFINED_MESSAGE));
        }
      } catch (error) {
        dispatch(storeAttendanceException(UNDEFINED_MESSAGE));
      }
    } else {
      return alert(NO_INTERNET);
    }
  };
};
export const pendingActionCreator = (loginData, isPullToLoaderActive, errorCallBack) => {
  return async dispatch => {
    let isNetwork = await netInfo();
    if (isNetwork) {
      try {
        if (!isPullToLoaderActive) {
          dispatch(loading(true));
        }
        let form = new FormData();
        form.append('ECSerp', loginData.SmCode);
        form.append('AuthKey', loginData.Authkey);
        let url = properties.getPendingDashboardCountUrl;
        let countResponse = await fetchPOSTMethod(url, form);
        if (countResponse.length != undefined) {
          if (
            countResponse.length === 1 &&
            countResponse[0].hasOwnProperty('Exception')
          ) {
            errorCallBack(countResponse[0].Exception + ':' + countResponse[0].StatusCode);
            dispatch(storeException(countResponse[0].Exception + ':' + countResponse[0].StatusCode));
          } else {
            dispatch(storePendingList(countResponse));
          }
        } else {
          dispatch(storeException(UNDEFINED_MESSAGE));
        }
      } catch (error) {
        dispatch(storeException(UNDEFINED_MESSAGE));
      }
    } else {
      return alert(NO_INTERNET);
    }
  };
};

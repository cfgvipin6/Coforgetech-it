import {
  TRAVEL_LOADING,
  STORE_TRAVEL_ACTION,
  TRAVEL_ERROR_FROM_SERVER,
  STORE_TRAVEL_PENDING,
  RESET,
  ACTION_SUCCESS,
  RESET_TRAVEL_HOME,
  STORE_ERROR,
  STORE_TRAVEL_HISTORY,
} from './constants';
import { fetchPOSTMethod } from '../../utilities/fetchService';
import { netInfo } from '../../utilities/NetworkInfo';
import { NO_INTERNET, UNDEFINED_MESSAGE } from '../../GlobalConstants';
import properties from '../../resource/properties';
let empCode;
let authToken;
let type;
const loading = data => {
  return {
    type: TRAVEL_LOADING,
    payload: data,
  };
};
const resetState = () => {
  return {
    type: RESET,
  };
};
const travelError = message => {
  return {
    type: TRAVEL_ERROR_FROM_SERVER,
    payload: message,
  };
};

const storeTravelError = data => {
  return {
    type: STORE_ERROR,
    payload: data,
  };
};

const storeTravelData = data => {
  return {
    type: STORE_TRAVEL_ACTION,
    payload: data,
  };
};

const travelPending = data => {
  return {
    type: STORE_TRAVEL_PENDING,
    payload: data,
  };
};

const actionSuccess = msg => {
  return {
    type: ACTION_SUCCESS,
    payload: msg,
  };
};

const resetHome = () => {
  return {
    type: RESET_TRAVEL_HOME,
  };
};

const storeTravelHistory = data => {
  return {
    type: STORE_TRAVEL_HISTORY,
    payload: data,
  };
};

export const resetTravelHome = () => {
  return async dispatch => {
    dispatch(resetHome());
  };
};

export const travelActionCreator = (
  empCode,
  authToken,
  serviceType,
  isPullToLoaderActive
) => {
  return async dispatch => {
    let isNetwork = await netInfo();
    if (isNetwork) {
      try {
        this.empCode = empCode;
        this.authToken = authToken;
        // console.log("pull refresh", isPullToLoaderActive);
        if (!isPullToLoaderActive) {
          dispatch(loading(true));
        }
        let form = new FormData();
        form.append('ECSerp', empCode);
        form.append('AuthKey', authToken);
        form.append('DocType', serviceType);
        let url = properties.getTrPendingList;
        let travelResponse = await fetchPOSTMethod(url, form);
        if (travelResponse.length != undefined) {
          // console.log("Travel response for main Screen : ", travelResponse);
          if (
            travelResponse.length === 1 &&
            travelResponse[0].hasOwnProperty('Exception')
          ) {
            dispatch(storeTravelError(travelResponse[0].Exception));
          } else {
            dispatch(storeTravelData(travelResponse));
          }
        } else {
          dispatch(storeTravelError(UNDEFINED_MESSAGE));
        }
      } catch (error) {
        dispatch(loading(false));
        dispatch(storeTravelError(UNDEFINED_MESSAGE));
      }
    } else {
      return alert(NO_INTERNET);
    }
  };
};

export const travelTakeAction = (data, action, remarks, remarks2, submitTo) => {
  // console.log("DATA : ", data);
  return async dispatch => {
    let isNetwork = await netInfo();
    if (isNetwork) {
    try {
      dispatch(loading(true));
      // console.log("Inside json creation : ",data,remarks,action,remarks2,submitTo);
      let takeAction;
      let pendingWithValue;
      let loginEmpCodeValue;
      if (action === 'Approved') {
        takeAction = 'A';
        pendingWithValue = submitTo.EmpCode;
        loginEmpCodeValue = data.DocOwnerCode;
      } else if (action === 'Rejected') {
        takeAction = 'R';
        pendingWithValue = data.DocOwnerCode;
        loginEmpCodeValue = this.empCode;
      } else if (action === 'Forwarded') {
        takeAction = 'F';
      } else {
        takeAction = null;
      }
      let objc = {
        Type: (type = data.DocumentType == 'D' ? '2' : '1'),
        DocumentNo: data.DocumentNo,
        LoginEmpCode: loginEmpCodeValue,
        Remarks: remarks,
        Action: takeAction,
        PendingWith: pendingWithValue,
        SendTo: this.type,
        JustificationRemarks: remarks2,
      };
      let dataToPost = JSON.stringify(objc);
      // console.log("Travel Action to post : " + dataToPost);
      let form = new FormData();
      form.append('ECSerp', this.empCode);
      form.append('AuthKey', this.authToken);
      form.append('Data', dataToPost);
      let url = properties.trActions;
      // console.log("Action URL is :" + url);
      // console.log("Form data is: " + JSON.stringify(form));
      let response = await fetchPOSTMethod(url, form);
      // console.log("Travel taken action response from server is : ", response);
        if (response.length != undefined) {
          if (
            response.length === 1 &&
            response[0].hasOwnProperty('Exception')
          ) {
            dispatch(travelError(response[0].Exception));
          } else if (response[0].msgTxt === 'Success') {
            dispatch(actionSuccess(response[0].msgTxt));
          }
        } else {
            dispatch(travelError(UNDEFINED_MESSAGE));
        }
      } catch (error) {
        dispatch(travelError(UNDEFINED_MESSAGE));
      }
    } else {
      return alert(NO_INTERNET);
    }
  };
};

export const fetchRequestorList = (callback,searchText, item, type) => {
  return async dispatch => {
    let isNetwork = await netInfo();
    if (isNetwork) {
    try {
      this.type = type;
      // dispatch(loading(true));
      let url = properties.getTrApproverList;
      let form = new FormData();
      form.append('ECSerp', this.empCode);
      form.append('AuthKey', this.authToken);
      form.append('DocType', item.DocumentType);
      form.append('DocumentNo', type == 's' ? searchText : item.DocumentNo);
      form.append('ListFor', type);
      let response = await fetchPOSTMethod(url, form);
      // dispatch(loading(false));
      console.log('Response from fetched data  : ',response);
        if (response.length != undefined) {
          if (
            response[0]?.hasOwnProperty('Exception')
          ) {
            // console.log("Travel exception while fetching approver list from server is : ",response);
            dispatch(travelError(response[0].Exception));
          } else {
            // console.log("Travel approver list from server is : ", response);
            // dispatch(travelPending(response));
            callback(response);
          }
        } else {
          // dispatch(travelError(UNDEFINED_MESSAGE));
        }
      } catch (error) {
        dispatch(loading(false));
        dispatch(travelError(UNDEFINED_MESSAGE));
      }
    } else {
      return alert(NO_INTERNET);
    }
  };
};

export const resetActionCreator = () => {
  return async dispatch => {
    dispatch(resetState());
  };
};

export const travelFetchHistory = docNumber => {
  return async dispatch => {
    let isNetwork = await netInfo();
    if (isNetwork) {
      dispatch(loading());
      let form = new FormData();
      form.append('ECSerp', this.empCode);
      form.append('AuthKey', this.authToken);
      form.append('DocumentNo', docNumber);
      let url = properties.voucherHistoryUrl;
      let historyResponse = await fetchPOSTMethod(url, form);
      if (historyResponse.length != undefined) {
        // console.log("Travel history response for main Screen : ",historyResponse);
        if (
          historyResponse.length === 1 &&
          historyResponse[0].hasOwnProperty('Exception')
        ) {
          dispatch(storeTravelError(historyResponse[0].Exception));
        } else {
          dispatch(storeTravelHistory(historyResponse));
        }
      } else if (
        historyResponse.length === undefined ||
        historyResponse.length === 0 ||
        historyResponse === null ||
        historyResponse === undefined
      ) {
        dispatch(storeTravelError(UNDEFINED_MESSAGE));
      }
    } else {
      return alert(NO_INTERNET);
    }
  };
};

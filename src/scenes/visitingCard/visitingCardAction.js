import { netInfo } from '../../utilities/NetworkInfo';
import { NO_INTERNET, UNDEFINED_MESSAGE } from '../../GlobalConstants';
import properties from '../../resource/properties';
import { fetchPOSTMethod } from '../../utilities/fetchService';
let constants = require('./constants');
let empCode;
let authToken;

const resetVisiting = () => {
  return {
    type: constants.VISITING_RESET_STORE,
  };
};

const loading = () => {
  return {
    type: constants.VISITING_LOADING,
  };
};

const storeVisitingHistory = (data) => {
  return {
    type: constants.VISITING_HISTORY,
    payload: data,
  };
};

const storeVisitingData = (data) => {
  return {
    type: constants.VISITING_DATA,
    payload: data,
  };
};

const storeVisitingError = (msg) => {
  return {
    type: constants.VISITING_ERROR,
    payload: msg,
  };
};

const storeSuperVisorData = (data) => {
  return {
    type: constants.VISITING_SUPERVISOR_DATA,
    payload: data,
  };
};

const storeVisitingActionError = (message) => {
  return {
    type: constants.VISITING_ACTION_ERROR,
    payload: message,
  };
};

const storeVisitingActionSuccess = (msg) => {
  return {
    type: constants.VISITING_ACTION_MSG,
    payload: msg,
  };
};

export const resetVisitingStore = () => {
  return async (dispatch) => {
    dispatch(resetVisiting());
  };
};

export const visitingFetchData = (empCode, authToken, isPullToLoaderActive) => {
  return async (dispatch) => {
    let isNetwork = await netInfo();
    if (isNetwork) {
      this.empCode = empCode;
      this.authToken = authToken;
      if (!isPullToLoaderActive) {
        dispatch(loading());
      }
      let formData = new FormData();
      formData.append('ECSerp', empCode);
      formData.append('AuthKey', authToken);
      formData.append('in_status', 2);
      formData.append('empcode', empCode);
      formData.append('Flag', 1);
      formData.append('in_torole', 2);
      formData.append('dt_StartDate', '10-Jan-2020');
      formData.append('dt_EndDate', '10-Jan-2020');
      formData.append('FilterEmpcode', empCode);
      let url = properties.getVisitingUrl;
      let visitingResponse = await fetchPOSTMethod(url, formData);
      if (visitingResponse.length != undefined) {
        // console.log("Visiting Card response for main Screen : ",visitingResponse);
        if (
          visitingResponse.length === 1 &&
          visitingResponse[0].hasOwnProperty('Exception')
        ) {
          dispatch(storeVisitingError(visitingResponse[0].Exception));
        } else {
          dispatch(storeVisitingData(visitingResponse));
        }
      } else if (
        visitingResponse.length === undefined ||
        visitingResponse.length === 0 ||
        visitingResponse === null ||
        visitingResponse === undefined
      ) {
        dispatch(storeVisitingError(UNDEFINED_MESSAGE));
      }
    } else {
      return alert(NO_INTERNET);
    }
  };
};

export const completeRequest = (
  chEmpCode,
  inReqNo,
  type,
  inStatus,
  chPendingWith,
  inPendingRole,
  vcRemarks
) => {
  return async (dispatch) => {
    let isNetwork = await netInfo();
    if (isNetwork) {
      dispatch(loading());
      let dataObj = {
        ch_empcode: chEmpCode,
        in_request_no: inReqNo,
        type: type,
        in_status: inStatus,
        ch_pendingwith: chPendingWith,
        in_pendingrole: inPendingRole,
        vc_remarks: vcRemarks,
      };
      let formData = new FormData();
      formData.append('ECSerp', this.empCode);
      formData.append('AuthKey', this.authToken);
      formData.append('Data', JSON.stringify(dataObj));
      let url = properties.visitingActionUrl;
      let actionResponse = await fetchPOSTMethod(url, formData);
      if (actionResponse.length != undefined) {
        if (
          actionResponse.length === 1 &&
          actionResponse[0].hasOwnProperty('Exception')
        ) {
          // console.log("visiting submit api exception while submitting to server is : ",actionResponse);
          dispatch(storeVisitingActionError(actionResponse[0].Exception));
        } else {
          // console.log("visiting submit response from server is : ", actionResponse);
          dispatch(storeVisitingActionSuccess(actionResponse[0].msgTxt));
        }
      } else if (
        actionResponse.length === undefined ||
        actionResponse.length === 0 ||
        actionResponse === null ||
        actionResponse === undefined
      ) {
        dispatch(storeVisitingActionError(UNDEFINED_MESSAGE));
      }
    } else {
      return alert(NO_INTERNET);
    }
  };
};

export const fetchSupervisorData = (successCallBack, query) => {
  return async (dispatch) => {
    let isNetwork = await netInfo();
    if (isNetwork) {
      let url = properties.getTrApproverList;
      let form = new FormData();
      form.append('ECSerp', this.empCode);
      form.append('AuthKey', this.authToken);
      form.append('DocType', '');
      form.append('DocumentNo', query);
      form.append('ListFor', 'S');
      let response = await fetchPOSTMethod(url, form);
      console.log(
        'Supervisor list response for leave from server is : ',
        response
      );
      if (response.length != undefined) {
        if (response.length === 1 && response[0].hasOwnProperty('Exception')) {
          // console.log("visiting api exception while fetching visiting list from server is : ",response);
          dispatch(storeVisitingError(response[0].Exception));
        } else {
          successCallBack(response);
        }
      } else if (
        response.length === undefined ||
        response.length === 0 ||
        response === null ||
        response === undefined
      ) {
        dispatch(storeVisitingError(UNDEFINED_MESSAGE));
      }
    } else {
      return alert(NO_INTERNET);
    }
  };
};

export const resetSupervisor = () => {
  return {
    type: constants.VISITING_RESET_SUPERVISOR_DATA,
  };
};

export const visitingFetchHistory = (docNumber) => {
  return async (dispatch) => {
    let isNetwork = await netInfo();
    if (isNetwork) {
      dispatch(loading());
      let form = new FormData();
      form.append('ECSerp', this.empCode);
      form.append('AuthKey', this.authToken);
      form.append('in_request_no', docNumber);
      let url = properties.visitingHistoryUrl;
      let historyResponse = await fetchPOSTMethod(url, form);
      if (historyResponse.length != undefined) {
        // console.log("Visiting history response for main Screen : ",historyResponse);
        if (
          historyResponse.length === 1 &&
          historyResponse[0].hasOwnProperty('Exception')
        ) {
          dispatch(storeVisitingError(historyResponse[0].Exception));
        } else {
          dispatch(storeVisitingHistory(historyResponse));
        }
      } else if (
        historyResponse.length === undefined ||
        historyResponse.length === 0 ||
        historyResponse === null ||
        historyResponse === undefined
      ) {
        dispatch(storeVisitingError(UNDEFINED_MESSAGE));
      }
    } else {
      return alert(NO_INTERNET);
    }
  };
};

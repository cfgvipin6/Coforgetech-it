import { netInfo } from '../../utilities/NetworkInfo';
import { NO_INTERNET, UNDEFINED_MESSAGE } from '../../GlobalConstants';
import properties from '../../resource/properties';
import { fetchPOSTMethod } from '../../utilities/fetchService';
import { RESET_DETAILS } from './constants';
let constants = require('./constants');
let empCode;
let authToken;

const resetExit = () => {
  return {
    type: constants.EXIT_RESET_STORE,
  };
};

const loading = () => {
  return {
    type: constants.EXIT_LOADING,
  };
};

const storeExitData = (data) => {
  return {
    type: constants.EXIT_DATA,
    payload: data,
  };
};

const storeExitHistory = (data) => {
  return {
    type: constants.EXIT_HISTORY,
    payload: data,
  };
};

const storeDetailsData = (data) => {
  return {
    type: constants.DETAIL_DATA,
    payload: data,
  };
};
const storeExitError = (msg) => {
  return {
    type: constants.EXIT_ERROR,
    payload: msg,
  };
};
const storeExitDetailError = (msg) => {
  return {
    type: constants.EXIT_DETAIL_ERROR,
    payload: msg,
  };
};
const storeExitActionTakenData = (message) => {
  return {
    type: constants.EXIT_ACTION_TAKEN_SUCCESS,
    payload: message,
  };
};

const storeExitActionTakenError = (msg) => {
  return {
    type: constants.EXIT_ACTION_TAKEN_ERROR,
    payload: msg,
  };
};
const storeNoticePeriod = (data) => {
  return {
    type: constants.STORE_NOTICE_PERIOD,
    payload: data,
  };
};
const storeSuperVisorData = (data) => {
  return {
    type: constants.EXIT_SUPERVISOR_DATA,
    payload: data,
  };
};
export const fetchNoticeDetails = (
  empCode,
  authToken,
  rn_date,
  rp_type,
  skillCode,
  lwd,
  resignationCode,
  requestorId
) => {
  return async (dispatch) => {
    let isNetwork = await netInfo();
    if (rp_type === 0 || rp_type === 1) {
      rp_type === 0 ? (rp_type = 'Y') : (rp_type = 'N');
    }
    if (isNetwork) {
      try {
        let formData = new FormData();
        formData.append('ECSerp', empCode);
        formData.append('AuthKey', authToken);
        formData.append('strSMCode', requestorId);
        formData.append('strResignationDate', rn_date);
        formData.append('strBenchResignation', rp_type);
        formData.append('strSkills', skillCode);
        formData.append('strSLWD', lwd);
        formData.append('restype', resignationCode);
        let url = properties.getNoticePeriod;
        dispatch(loading(true));
        console.log('Notice period Data : ', formData);
        let response = await fetchPOSTMethod(url, formData);
        console.log('Notice period response : ', response);
        if (response !== undefined) {
          if (
            response.length === 1 &&
            response[0].hasOwnProperty('Exception')
          ) {
            // console.log("Notice Period api exception while fetching notice period is:  ", response);
            dispatch(storeExitDetailError(response[0].Exception));
          } else {
            // console.log("Notice period from server is : ", response);
            dispatch(storeNoticePeriod(response));
          }
        } else {
          dispatch(storeExitDetailError(UNDEFINED_MESSAGE));
        }
      } catch (error) {
        // console.log("Error is:", error);
        dispatch(loading(false));
        dispatch(storeExitDetailError(UNDEFINED_MESSAGE));
      }
    } else {
      alert(NO_INTERNET);
    }
  };
};
export const resetDetails = () => {
  return {
    type: RESET_DETAILS,
  };
};
export const fetchExitDetails = (empCode, authToken, eccNo, callBack) => {
  return async (dispatch) => {
    let isNetwork = await netInfo();
    if (isNetwork) {
      try {
        let formData = new FormData();
        formData.append('ECSerp', empCode);
        formData.append('AuthKey', authToken);
        formData.append('in_ecc_no', eccNo);
        let url = properties.getSkillsUrl;
        dispatch(loading(true));
        console.log('Skill Data : ', formData);
        let response = await fetchPOSTMethod(url, formData);
        console.log('Skill Response : ', response);
        if (response.length !== undefined) {
          if (
            response.length === 1 &&
            response[0].hasOwnProperty('Exception')
          ) {
            // console.log("Skills details api exception while fetching data is :  ", response);
            dispatch(storeExitDetailError(response[0].Exception));
          } else {
            dispatch(storeDetailsData(response));
            callBack(response);
          }
        } else {
          dispatch(storeExitDetailError(UNDEFINED_MESSAGE));
        }
      } catch (error) {
        // console.log("Error is:", error);
        dispatch(loading(false));
        dispatch(storeExitDetailError(UNDEFINED_MESSAGE));
      }
    } else {
      alert(NO_INTERNET);
    }
  };
};

export const exitFetchData = (empCode, authToken, isPullToLoaderActive) => {
  return async (dispatch) => {
    let isNetwork = await netInfo();
    if (isNetwork) {
      this.empCode = empCode;
      this.authToken = authToken;
      if (!isPullToLoaderActive) {
        dispatch(loading(true));
      }
      let formData = new FormData();
      formData.append('ECSerp', empCode);
      formData.append('AuthKey', authToken);
      let url = properties.getExitUrl;
      let response = await fetchPOSTMethod(url, formData);
      if (response.length !== undefined) {
        console.log('Exit response main Screen', response);
        if (response.length === 1 && response[0].hasOwnProperty('Exception')) {
          dispatch(storeExitError(response[0].Exception));
        } else {
          dispatch(storeExitData(response));
        }
      } else if (
        response.length === undefined ||
        response.length === 0 ||
        response === null ||
        response === undefined
      ) {
        dispatch(storeExitError(UNDEFINED_MESSAGE));
      }
    } else {
      alert(NO_INTERNET);
    }
  };
};

export const resetExitHome = () => {
  return {
    type: constants.EXIT_RESET_STORE,
  };
};

export const fetchSupervisorData = (supervisorCallBack, query) => {
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
      if (response.length !== undefined) {
        if (response.length === 1 && response[0].hasOwnProperty('Exception')) {
          dispatch(storeExitActionTakenError(response[0].Exception));
        } else {
          supervisorCallBack(response);
        }
      } else if (
        response.length === undefined ||
        response.length === 0 ||
        response === null ||
        response === undefined
      ) {
      }
    } else {
      return alert(NO_INTERNET);
    }
  };
};

export const resetSupervisor = () => {
  return {
    type: constants.EXIT_RESET_SUPERVISOR_DATA,
  };
};

export const exitActionTaken = (
  docData,
  pendingRole,
  pendingWith,
  toRole,
  submitTo,
  docFinalData
) => {
  console.log('docFinalData', docFinalData);
  return async (dispatch) => {
    let isNetwork = await netInfo();
    if (isNetwork) {
      dispatch(loading());
      let dataObj = {
        empcode: docData.EMPNO,
        in_ecc_no: docData.in_ecc_no,
        treatment: docFinalData.treatment,
        LoggedInEmpCode: this.empCode,
        in_PendingRole: pendingRole,
        in_Pendingwith: pendingWith,
        Regdate: docFinalData.RegDate,
        SLWD: docFinalData.SLWD,
        npreq: docFinalData.npReq,
        supcoment: docFinalData.supComment,
        ResFrompool: docFinalData.resFromPool,
        restype: docFinalData.resType,
        Skill: docFinalData.skillCode,
        ch_prevent_email: docFinalData.preventEmail,
        ch_internet_access: docFinalData.internetAccess,
        waiverremark: docFinalData.waiverRemarks,
        torole: toRole,
        submitTo: submitTo,
        resstatus: docFinalData.resStatus,
        ReasonTypeID: docFinalData.ReasonTypeID,
        ReasonId: docFinalData.ReasonId,
      };
      let formData = new FormData();
      formData.append('ECSerp', this.empCode);
      formData.append('AuthKey', this.authToken);
      formData.append('Data', JSON.stringify(dataObj));
      formData.append('Type', 1);
      let url = properties.ExitActionUrl;
      // console.log("formData", formData);
      let response = await fetchPOSTMethod(url, formData);
      if (response.length !== undefined) {
        // console.log("Exit Action Response", response);
        if (response.length === 1 && response[0].hasOwnProperty('Exception')) {
          dispatch(storeExitActionTakenError(response[0].Exception));
        } else {
          dispatch(storeExitActionTakenData(response[0].msgTxt));
        }
      } else if (
        response.length === undefined ||
        response.length === 0 ||
        response === null ||
        response === undefined
      ) {
        dispatch(storeExitActionTakenError(UNDEFINED_MESSAGE));
      }
    } else {
      alert(NO_INTERNET);
    }
  };
};

export const exitFetchHistory = (docNumber) => {
  return async (dispatch) => {
    let isNetwork = await netInfo();
    if (isNetwork) {
      dispatch(loading());
      let form = new FormData();
      form.append('ECSerp', this.empCode);
      form.append('AuthKey', this.authToken);
      form.append('in_ecc_no', docNumber);
      let url = properties.exitHistoryUrl;
      let historyResponse = await fetchPOSTMethod(url, form);
      if (historyResponse.length !== undefined) {
        // console.log("EXIT history response for main Screen : ",historyResponse);
        if (
          historyResponse.length === 1 &&
          historyResponse[0].hasOwnProperty('Exception')
        ) {
          dispatch(storeExitError(historyResponse[0].Exception));
        } else {
          dispatch(storeExitHistory(historyResponse));
        }
      } else if (
        historyResponse.length === undefined ||
        historyResponse.length === 0 ||
        historyResponse === null ||
        historyResponse === undefined
      ) {
        dispatch(storeExitError(UNDEFINED_MESSAGE));
      }
    } else {
      return alert(NO_INTERNET);
    }
  };
};

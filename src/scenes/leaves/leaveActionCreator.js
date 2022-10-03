import { NO_INTERNET, UNDEFINED_MESSAGE } from '../../GlobalConstants';
import properties from '../../resource/properties';
import { netInfo } from '../../utilities/NetworkInfo';
import { fetchPOSTMethod, fetchGETMethod } from '../../utilities/fetchService';
import {
  LEAVE_LOADING,
  LEAVE_ERROR,
  STORE_LEAVE_DATA,
  RESET_LEAVE,
  STORE_SUPERVISOR,
  RESET_SUPERVISOR,
  RESET_LEAVE_ACTION,
  STORE_LEAVE_SUBMIT_DATA,
  STORE_LEAVE_HISTORY,
} from './constants';
let UserId;
let AuthKey;
const loading = (data) => {
  return {
    type: LEAVE_LOADING,
    payload: data,
  };
};
const leaveError = data => {
  return {
    type: LEAVE_ERROR,
    payload: data,
  };
};
const storeLeaveData = data => {
  return {
    type: STORE_LEAVE_DATA,
    payload: data,
  };
};

const storeLeaveHistory = data => {
  return {
    type: STORE_LEAVE_HISTORY,
    payload: data,
  };
};

export const resetLeave = () => {
  return {
    type: RESET_LEAVE,
  };
};
export const resetLeaveAction = () => {
  return {
    type: RESET_LEAVE_ACTION,
  };
};

export const storeLeaveSubmitData = data => {
  return {
    type: STORE_LEAVE_SUBMIT_DATA,
    payload: data,
  };
};

export const leaveActionCreator = (userId, authKey) => {
  return async dispatch => {
    UserId = userId;
    AuthKey = authKey;
    let isNetwork = await netInfo();
    if (isNetwork) {
      try {
      dispatch(loading(true));
      let url = properties.getLeaves;
      // console.log("Leave url is : ", url);
      let form = new FormData();
      form.append('ECSerp', UserId);
      form.append('AuthKey', AuthKey);
      // console.log("Attached form data for Leave : " + JSON.stringify(form));
      let response = await fetchPOSTMethod(url, form);
      console.log('Leave temp response from server is : ', response);
        if (response.length != undefined) {
          if (response.length === 1 && response[0].hasOwnProperty('Exception')) {
            // console.log("Leave api exception while fetching Leave list from server is : ",response);
            dispatch(leaveError(response[0].Exception));
          } else {
            // console.log("Leave respopnse from server is : ", response);
            dispatch(storeLeaveData(response));
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

export const leaveActionCreator2 = async(userId, authKey,successCallBack, errorCallBack) => {
    UserId = userId;
    AuthKey = authKey;
    let isNetwork = await netInfo();
    if (isNetwork) {
      try {
      let url = properties.getLeaves;
      // console.log("Leave url is : ", url);
      let form = new FormData();
      form.append('ECSerp', UserId);
      form.append('AuthKey', AuthKey);
      // console.log("Attached form data for Leave : " + JSON.stringify(form));
      let response = await fetchPOSTMethod(url, form);
      console.log('Leave temp response from server is : ', response);
      if (response[0]?.hasOwnProperty('Exception')){
        errorCallBack(response[0].Exception);
      }
      else {
        successCallBack(response);
      }
      } catch (error) {
        console.log('Error in leaves : ',error);
      }
    } else {
      return alert(NO_INTERNET);
    }
};

 const storeSuperVisorData = data => {
  return {
    type: STORE_SUPERVISOR,
    payload: data,
  };
};
export const resetSupervisor = () => {
  return {
    type: RESET_SUPERVISOR,
  };
};
export const fetchSupervisorForLeaves = (searchText,successCallBack) => {
  return async dispatch => {
    let isNetwork = await netInfo();
    if (isNetwork) {
      try {
        console.log('Search Text : ', searchText);
      let url = properties.getTrApproverList;
      let form = new FormData();
      form.append('ECSerp', UserId);
      form.append('AuthKey', AuthKey);
      form.append('DocType', '');
      form.append('DocumentNo', searchText);
      form.append('ListFor', 'S');
      let response = await fetchPOSTMethod(url, form);
      console.log('Supervisor list response for leave from server is : ',response);
        if (response.length != undefined) {
          if (
            response.length === 1 &&
            response[0].hasOwnProperty('Exception')
          ) {
            // console.log("Leave api exception while fetching Leave list from server is : ",response);
            dispatch(leaveError(response[0].Exception));
          } else {
            // console.log("Supervisor list response from server is : ", response);
            // dispatch(storeSuperVisorData(response));
            successCallBack(response);
          }
        }
      } catch (error) {
        // dispatch(leaveError(UNDEFINED_MESSAGE));
      }
    } else {
      return alert(NO_INTERNET);
    }
  };
};

export const completeRequest = (superVisorEmpId,leaveItem,remarks,action) => {
  return async dispatch => {
    let isNetwork = await netInfo();
    if (isNetwork) {
      try {
      dispatch(loading(true));
      let empNameCode = leaveItem.vc_empname.Value.trim();
      let chPendingWith =
        action === 4
          ? empNameCode.substring(0, empNameCode.indexOf(':')).trim()
          : superVisorEmpId;
      let objc = {
        vc_docNo: leaveItem.vc_docno.Value,
        ch_empCode: empNameCode.substring(0, empNameCode.indexOf(':')).trim(),
        ch_pendingwith: chPendingWith,
        ch_modified: UserId,
        vc_remarks: remarks,
        in_fromrole: 2,
        in_stage: leaveItem.in_stage.Value,
        Action: action,
      };
      let dataToPost = JSON.stringify(objc);
      let url = properties.submitLeaveRequest;
      console.log('Leave submit url is: ', url);
      let form = new FormData();
      form.append('ECSerp', UserId);
      form.append('AuthKey', AuthKey);
      form.append('Data', dataToPost);
      console.log('Attached form data for Leave : ' ,form);
      let response = await fetchPOSTMethod(url, form);
      console.log('Leave submit respnose : ', response);
        if (response.length != undefined) {
          if (response.length === 1 && response[0].hasOwnProperty('Exception')) {
            // console.log("Leave submit api exception while submitting to server is : ",response);
            dispatch(leaveError(response[0].Exception));
          } else {
            // console.log("Leave submit respopnse from server is : ", response);
            dispatch(storeLeaveSubmitData(response[0].msgTxt));
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

export const leaveFetchHistory = docNumber => {
  return async dispatch => {
    let isNetwork = await netInfo();
    if (isNetwork) {
      dispatch(loading());
      let form = new FormData();
      form.append('ECSerp', UserId);
      form.append('AuthKey', AuthKey);
      form.append('vc_docno', docNumber);
      let url = properties.leaveHistoryUrl;
      let historyResponse = await fetchPOSTMethod(url, form);
      if (historyResponse != undefined) {
        if (historyResponse.length === 1 && historyResponse[0].hasOwnProperty('Exception')) {
          dispatch(leaveError(historyResponse[0].Exception));
        } else {
          dispatch(storeLeaveHistory(historyResponse));
        }
      } else if (
        historyResponse.length === undefined ||
        historyResponse.length === 0 ||
        historyResponse === null ||
        historyResponse === undefined
      ) {
        dispatch(leaveError(UNDEFINED_MESSAGE));
      }
    } else {
      return alert(NO_INTERNET);
    }
  };
};


export const fetchLeaveHistory = async(docNumber,successCallBack,errorCallBack) => {
    let isNetwork = await netInfo();
    if (isNetwork) {
    try {
        let form = new FormData();
        form.append('ECSerp', UserId);
        form.append('AuthKey', AuthKey);
        form.append('vc_docno', docNumber);
        let url = properties.leaveHistoryUrl;
        let historyResponse = await fetchPOSTMethod(url, form);
        // historyResponse = [{Exception:'Demo Exception'}];
        console.log('History response : ', historyResponse);
        if (historyResponse != undefined) {
          if (historyResponse.length === 1 && historyResponse[0].hasOwnProperty('Exception')) {
            errorCallBack(historyResponse[0].Exception);
          } else {
            successCallBack(historyResponse);
          }
        } else if (
          historyResponse.length === undefined ||
          historyResponse.length === 0 ||
          historyResponse === null ||
          historyResponse === undefined
        ) {
          errorCallBack({Exception:'No response found.'});
        }
      }
      catch (error){
      errorCallBack({Exception:error});
    }
  }
    else {
      return alert(NO_INTERNET);
    }

  };


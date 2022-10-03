import { fetchPOSTMethod } from '../../utilities/fetchService';
import { netInfo } from '../../utilities/NetworkInfo';
import { NO_INTERNET, UNDEFINED_MESSAGE } from '../../GlobalConstants';
import properties from '../../resource/properties';
import { APPLY_LEAVE_LOADING, TIMEOUT, CREATE_LEAVE_ERROR, STORE_CREATE_LEAVE_DATA, STORE_EMP_DATA, RESET_CREATE_LEAVE, SUBMIT_LEAVE, STORE_TOTAL_LEAVE, RESET_SUBMIT_DATA, RESET_ERROR_DATA } from './constants';
const loading = data => {
  return {
    type: APPLY_LEAVE_LOADING,
    payload: data,
  };
};
const createLeaveError = (data)=>{
  return {
    type:CREATE_LEAVE_ERROR,
    payload:data,
  };
};
const storeLeaveData = (data)=>{
  return {
    type:STORE_CREATE_LEAVE_DATA,
    payload:data,
  };
};
const storeEmployees = (data)=>{
  return {
    type:STORE_EMP_DATA,
    payload:data,
  };
};
const storeTotalLeave = (data)=>{
  return {
    type:STORE_TOTAL_LEAVE,
    payload:data,
  };
};

const storeSubmitLeaveAction = (data)=>{
  return {
    type:SUBMIT_LEAVE,
    payload:data,
  };
};
export const resetForm = ()=>{
  return {
    type: RESET_CREATE_LEAVE,
  };
};
export const resetSubmitData = ()=>{
  return {
    type: RESET_SUBMIT_DATA,
  };
};

export const resetErrorData = ()=>{
  return {
    type: RESET_ERROR_DATA,
  };
};
export const submitLeave = (loginData,leaveObject,callBack,errorCallBack)=>{
  return async dispatch => {
    let isNetwork = await netInfo();
    if (isNetwork) {
    try {
      dispatch(loading(true));
      let url = properties.submitLeaveAction;
      let form = new FormData();
      form.append('ECSerp', loginData.SmCode);
      form.append('AuthKey', loginData.Authkey);
      form.append('Data',JSON.stringify(leaveObject));
      console.log('Attached form data : ' ,form);
      let response = await fetchPOSTMethod(url, form);
      console.log('Leave response : ', response);
        if (response.length != undefined) {
          if (
            response.includes('Error Message :')
          ) {
            console.log('Submit leave exception while submitting leaves, from server is : ',response);
            errorCallBack(response);
          }
          else if (response[0]?.Exception && response[0]?.Exception.length > 0){
            console.log('Submit leave Exception from server is : ', response);
            errorCallBack(response[0].Exception);
          }
          else {
            console.log('Submit leave response from server is : ', response);
            callBack(response);
          }
        } else {
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
export const fetchEmployeeList = (loginData) => {
  return async dispatch => {
    let isNetwork = await netInfo();
    if (isNetwork) {
    try {
      dispatch(loading(true));
      let url = properties.getTrApproverList;
      let form = new FormData();
      form.append('ECSerp', loginData.SmCode);
      form.append('AuthKey', loginData.Authkey);
      form.append('DocType', '');
      form.append('DocumentNo', '');
      form.append('ListFor', 'S');
      // console.log("Attached form data : " + JSON.stringify(form));
      let response = await fetchPOSTMethod(url, form);
        if (response.length != undefined) {
          if (
            response.length === 1 &&
            response[0].hasOwnProperty('Exception')
          ) {
            // console.log("Create Leave exception while fetching employees list from server is : ",response);
            dispatch(createLeaveError(response[0].Exception));
          } else {
            // console.log("Employees list from server is : ", response);
            dispatch(storeEmployees(response));
          }
        } else {
          dispatch(createLeaveError(UNDEFINED_MESSAGE));
        }
      } catch (error) {
        // console.log("Error is:",error);
        dispatch(createLeaveError(UNDEFINED_MESSAGE));
      }
    } else {
      return alert(NO_INTERNET);
    }
  };
};
export const fetchTotalAppliedLeaves = (loginData,startDate,endDate,leaveType,leaveCode,callBack,errorCallBack)=>{
  return async dispatch => {
    let isNetwork = await netInfo();
    if (isNetwork) {
      try {
          dispatch(loading(true));
          let url = properties.getTotalLeaves;
          let form = new FormData();
          form.append('ECSerp', loginData.SmCode);
          form.append('AuthKey', loginData.Authkey);
          let dataToSubmit = {};
          dataToSubmit.ch_empcode = loginData.SmCode;
          dataToSubmit.dt_startDate = startDate;
          dataToSubmit.dt_endDate = endDate;
          dataToSubmit.leaveType = leaveType;
          dataToSubmit.ch_leaveType = leaveCode;

          form.append('Data',JSON.stringify(dataToSubmit));

          let response = await fetchPOSTMethod(url, form);
          console.log('Create leave response is :', response);
          if (response != null) {
            if (
              response.length === 1 &&
              response[0].hasOwnProperty('Exception')
            ) {
              errorCallBack(response[0].Exception);
            } else {
              callBack(response);

            }
          } else {
            // dispatch(createLeaveError(UNDEFINED_MESSAGE));
            errorCallBack(UNDEFINED_MESSAGE);
          }
        } catch (error) {
          let flagToSend = false;
          // dispatch(createLeaveError(UNDEFINED_MESSAGE));
          errorCallBack(UNDEFINED_MESSAGE);
        }
      } else {
        return alert(NO_INTERNET);
      }
    };
};
export const leaveApplyActionCreator = (loginData, callBack,errorCallBack) => {
  return async dispatch => {
    let isNetwork = await netInfo();
    if (isNetwork) {
      try {
          dispatch(loading(true));
          let url = properties.createLeave;
          let form = new FormData();
          form.append('EmployeeCode', loginData.SmCode);
          form.append('ECSerp',loginData.SmCode);
          form.append('Authkey',loginData.Authkey);
          let response = await fetchPOSTMethod(url, form);
          console.log('Create leave balance response is :', response);
          if (response != null) {
            if (
              response.length === 1 &&
              response[0].hasOwnProperty('Exception')
            ) {
              // dispatch(createLeaveError(response[0].Exception));
              errorCallBack(response[0].Exception);
            } else {
              dispatch(fetchEmployeeList(loginData));
              callBack(response);
            }
          } else {
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

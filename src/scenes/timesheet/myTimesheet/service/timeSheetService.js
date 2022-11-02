import { fetchPOSTMethod,fetchPOSTMethodNew } from '../../../../utilities/fetchService';
import { netInfo } from '../../../../utilities/NetworkInfo';
import { NO_INTERNET, UNDEFINED_ERROR, UNDEFINED_MESSAGE } from '../../../../GlobalConstants';
import properties from '../../../../resource/properties';
import { AppStore } from '../../../../../AppStore';
import { prepareTimeSheetApprove } from '../timesheetUtils';

export const getInputControls = async(loginData,data,successCallBack,errorCallBack,type,saveSubmitType) => {
      let isNetwork = await netInfo();
      if (isNetwork) {
        try {
        let url;
        switch (type) {
          case 'Binding':
            url = properties.getInputControls;
            break;
          case 'Days':
            url = properties.getDayTypes;
            break;
          case 'Records':
              url = properties.getRecords;
              break;
          case 'Approvals':
              url = properties.fetchApproverTimeSheetData;
        }
        let form = new FormData();
        form.append('ECSERP', loginData.SmCode);
        form.append('AUTHKEY', loginData.Authkey);
        form.append('APPKEY', 'mobile');
        form.append('Type', type == 'Approvals' ? 2 :  data.Type);
        form.append('StartDate', data.StartDate ? data.StartDate : '');
        form.append('EndDate', data.EndDate ? data.EndDate : '');
        if (type == 'Binding'){
          form.append('EmpCode', data.Type == 3 ? data.EmpCode  : loginData.SmCode);
        }
        if (type == 'Approvals' || type == 'Days'){
          form.append('EmpCode', data.EmpCode);
        }
        let response = await fetchPOSTMethod(url, form);
        if (url == properties.getRecords){
          console.log('Timesheet Records response is : ', response);
        }
        if (url == properties.getDayTypes){
          console.log('Timesheet DayTypes response is : ', response);
        }
        if (url == properties.getInputControls){
          console.log('Timesheet Binding response is : ', response);
        }
        if (url == properties.fetchApproverTimeSheetData){
          console.log('Timesheet approval list response is : ', response);
        }
        if (response?.Message || response?.Result){
            successCallBack(response.Message ? response.Message :  response.Result,type,saveSubmitType);
        } else if (response[0]?.hasOwnProperty('Exception')){
            errorCallBack(response);
        } else {
          errorCallBack('Server not responding');
        }
        } catch (error) {
          // errorCallBack(error);
        }
      } else {
        console.log('I was here 4');
        setTimeout(() => {
          alert(NO_INTERNET);
        }, 1000);
      }
  };

  export const approveRejectTimeSheet = async(loginData,data,successCallBack,errorCallBack,submitType,updatedData) => {
    let isNetwork = await netInfo();
    if (isNetwork) {
      try {
      let url = properties.saveSubmitTimeSheetByApprover;
      let body = {};
      body.ECSerp = loginData.SmCode;
      body.Authkey = loginData.Authkey;
      body._actionType = 'Save';
      body._actionTakenBy = 'SUPV';
      body._submitData = data;
      body._actionTakenFrom = 'Mobile';
      console.log('Form data is ', body);
      console.log('TimeSheet save submit data is ', data.filter((item)=>item.EffortHrs !== '' || item.EffortHrs !== 0 ));
      let response = await fetchPOSTMethodNew(url, JSON.stringify(body));
      console.log('Timesheet saveSubmit response is  : ', response);
      if (response?.Message || response?.Result){
          body._actionType = submitType;
          if (submitType == 'Submit'){
             body._submitData = updatedData;
          }
          let responseApproval = await fetchPOSTMethodNew(url, JSON.stringify(body));
          if (responseApproval?.Message || responseApproval?.Result){
            successCallBack(responseApproval.Message ? responseApproval.Message :  responseApproval.Result,submitType);
          } else if (responseApproval[0]?.hasOwnProperty('Exception')){
           errorCallBack(responseApproval);
       } else {
         errorCallBack('Server not responding');
       }
      } else if (response[0]?.hasOwnProperty('Exception')){
           console.log('I was here 1');
          errorCallBack(response);
      } else {
        console.log('I was here 2');
        errorCallBack('Server not responding');
      }
      } catch (error) {
        // console.log("I was here 3")
        // errorCallBack(error);
      }
    } else {
      console.log('I was here 4');
      setTimeout(() => {
        alert(NO_INTERNET);
      }, 1000);
    }
};

  export const saveSubmitTimeSheet = async(loginData,data,successCallBack,errorCallBack,submitType,getsupCode) => {
    console.log("getsupCode",getsupCode)
    let isNetwork = await netInfo();
    if (isNetwork) {
      try {
      let url = properties.saveSubmitTimeSheet;
      let body = {};
      body.ECSerp = loginData.SmCode;
      body.Authkey = loginData.Authkey;
      body._actionType = submitType;
      body._actionTakenBy = 'User';
      body._submitData = data;
      body._actionTakenFrom = 'Mobile';
      console.log('Form data is ', body);
      console.log('TimeSheet save submit data is ', data.filter((item)=>item.EffortHrs !== '' || item.EffortHrs !== 0 ));
      let response = await fetchPOSTMethodNew(url, JSON.stringify(body));
      console.log('Timesheet saveSubmit response is  : ', response);
      if (response?.Message || response?.Result){
          successCallBack(response.Message ? response.Message :  response.Result,submitType);
      } else if (response[0]?.hasOwnProperty('Exception')){
          errorCallBack(response);
      } else {
        errorCallBack('Server not responding');
      }
      } catch (error) {
        // console.log("I was here 3")
        // errorCallBack(error);
      }
    } else {
      console.log('I was here 4');
      setTimeout(() => {
        alert(NO_INTERNET);
      }, 1000);
    }
};

export const deleteTimeSheetRecord = async(loginData,DID,successCallBack,errorCallBack,titleIndex) => {
  let isNetwork = await netInfo();
  if (isNetwork) {
    try {
    let url = properties.deleteTimeSheetRecord;
    let form = new FormData();
    form.append('_did', DID);
    form.append('ECSERP', loginData.SmCode);
    form.append('AUTHKEY', loginData.Authkey);
    console.log('Form data is ', form);
    let response = await fetchPOSTMethod(url, form);
    console.log('Timesheet delete response is  : ', response);
    if (response?.Message || response?.Result){
        successCallBack(response.Message ? response.Message :  response.Result,titleIndex);
    } else if (response[0]?.hasOwnProperty('Exception')){
         console.log('I was here 1');
        errorCallBack(response);
    } else {
      console.log('I was here 2');
      errorCallBack('Server not responding');
    }
    } catch (error) {
      // console.log("I was here 3")
      // errorCallBack(error);
    }
  } else {
    console.log('I was here 4');
    setTimeout(() => {
      alert(NO_INTERNET);
    }, 1000);
  }
};

  export const getLineItemHistory = async(loginData,TID,successCallBack,errorCallBack) => {
    let isNetwork = await netInfo();
    if (isNetwork) {
      try {
      let url = properties.getLineItemHistory;
      let form = new FormData();
      form.append('TID', TID);
      form.append('ECSERP', loginData.SmCode);
      form.append('AUTHKEY', loginData.Authkey);
      console.log('Form data is ', form);
      let response = await fetchPOSTMethod(url, form);
      console.log('Timesheet Line Item history is  : ', response);
      if (response?.Message || response?.Result){
          successCallBack(response.Message ? response.Message :  response.Result);
      } else if (response[0]?.hasOwnProperty('Exception')){
           console.log('I was here 1');
          errorCallBack(response);
      } else {
        console.log('I was here 2');
        errorCallBack('Server not responding');
      }
      } catch (error) {
        // console.log("I was here 3")
        // errorCallBack(error);
      }
    } else {
      console.log('I was here 4');
      setTimeout(() => {
        alert(NO_INTERNET);
      }, 1000);
    }
};

  export const fetchTimesheetWeek = async(year, type, startDt, endDt, empCode)=>{
    let isNetwork = await netInfo();
    if (isNetwork) {
      let formData = new FormData();
      const loginData = AppStore.getState().loginReducer.loginData;
      formData.append('ECSerp',  loginData.SmCode);
      formData.append('AuthKey', loginData.Authkey);
      formData.append('APPKEY', 'mobile');
      formData.append('Type', type);

      if (year) {
        formData.append('Year', year);
      }
      if (startDt) {
         console.log('CHECK : ',startDt);
        formData.append('StartDate', startDt);
      }
      if (endDt) {
        console.log('CHECK : ',endDt);
        formData.append('EndDate', endDt);
      }
      if (empCode) {
        formData.append('EmpCode', empCode);
      }

      let url = properties.fetchTimesheetWeekList;
      let response = await fetchPOSTMethod(url, formData);
      console.log('key',loginData.Authkey);
      console.log('formData', formData);
      console.log('timesheet week response =======>',response);
      if (response !== undefined) {
            return response;
      } else if (response.length === undefined || response.length === 0 || response === null || response === undefined) {
        throw (UNDEFINED_MESSAGE);
      }
    } else {
      throw (NO_INTERNET);
    }
  };

  export const fetchEmpDetails = async(startDate, endDate)=>{
    let isNetwork = await netInfo();
    if (isNetwork) {
      let formData = new FormData();
      const loginData = AppStore.getState().loginReducer.loginData;
      formData.append('ECSerp', loginData.SmCode);
      formData.append('AuthKey', loginData.Authkey);
      formData.append('APPKEY', 'mobile');
      formData.append('Type', 2);
      if (startDate){
        formData.append('StartDate', startDate);
      }
      if (endDate){
        formData.append('EndDate', endDate);
      }
      formData.append('EmpCode', loginData.SmCode);
      let url = properties.fetchTimesheetEmpDetails;
      let response = await fetchPOSTMethod(url, formData);
      console.log('timesheet emp details response =======>',response);
      if (response !== undefined) {
            return response;
      } else if (response.length === undefined || response.length === 0 || response === null || response === undefined) {
        throw (UNDEFINED_MESSAGE);
      }
    } else {
      throw (NO_INTERNET);
    }
  };

  export const fetchSupervisors = async(startDate, endDate)=>{
    let isNetwork = await netInfo();
    if (isNetwork) {
      let formData = new FormData();
      const loginData = AppStore.getState().loginReducer.loginData;
      formData.append('ECSerp', loginData.SmCode);
      formData.append('AuthKey', loginData.Authkey);
      formData.append('Prefix', '000');
      formData.append('EmpCode', loginData.SmCode);
      
      formData.append('StartDate', startDate);
      formData.append('EndDate', endDate);

      
      // if (startDate){
      //   formData.append('StartDate', startDate);
      // }
      // if (endDate){
      //   formData.append('EndDate', endDate);
      // }
      
      let url = properties.fetchSupervisorList;
      let response = await fetchPOSTMethod(url, formData);
      console.log('supervisor details response =======>',response);
      if (response !== undefined) {
            return response;
      } else if (response.length === undefined || response.length === 0 || response === null || response === undefined) {
        throw (UNDEFINED_MESSAGE);
      }
    } else {
      throw (NO_INTERNET);
    }
  };

  export const fetchSelectedWeekList = async(startDate, endDate, empCode)=>{
    let isNetwork = await netInfo();
    if (isNetwork) {
      let formData = new FormData();
      const loginData = AppStore.getState().loginReducer.loginData;
      formData.append('ECSerp', loginData.SmCode);
      formData.append('AuthKey', loginData.Authkey);
      formData.append('APPKEY', 'mobile');
      formData.append('Type', 3);
      formData.append('StartDate', startDate);
      formData.append('EndDate', endDate);
      formData.append('EmpCode', empCode);

      let url = properties.fetchTimesheetMyWeekList;
      let response = await fetchPOSTMethod(url, formData);
      console.log('timesheet selected week list response =======>',response);
      if (response !== undefined) {
            return response;
      } else if (response.length === undefined || response.length === 0 || response === null || response === undefined) {
        throw (UNDEFINED_MESSAGE);
      }
    } else {
      throw (NO_INTERNET);
    }
  };

  export const fetchTimeSheetApprovals = async()=>{
    let isNetwork = await netInfo();
    if (isNetwork) {
      let formData = new FormData();
      const loginData = AppStore.getState().loginReducer.loginData;
      formData.append('ECSerp', loginData.SmCode);
      formData.append('AuthKey', loginData.Authkey);
      formData.append('APPKEY', 'mobile');
      let url = properties.fetchTimeSheetApprovals;
      let response = await fetchPOSTMethod(url, formData);
      console.log('timesheet Approvals response =======>',response);
      if (response !== undefined) {
            return response;
      } else if (response.length === undefined || response.length === 0 || response === null || response === undefined) {
        throw (UNDEFINED_MESSAGE);
      }
    } else {
      throw (NO_INTERNET);
    }
  };

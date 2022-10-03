import { fetchPOSTMethod } from "../../utilities/fetchService";
import { netInfo } from "../../utilities/NetworkInfo";
import { NO_INTERNET, UNDEFINED_MESSAGE } from "../../GlobalConstants";
import properties from "../../resource/properties";
let constants = require("./constants");
let empcode;
let authToken;

const loading = () => {
  return {
    type: constants.VISA_LOADING
  };
};

const resetVisa = () => {
  return {
    type: constants.VISA_RESET_SCREEN
  };
};

const storeVisaData = data => {
  return {
    type: constants.STORE_VISA_DATA,
    payload: data
  };
};

const storeVisaError = msg => {
  return {
    type: constants.STORE_VISA_ERROR,
    payload: msg
  };
};

const storeVisaHistory = data => {
  return {
    type: constants.STORE_VISA_HISTORY,
    payload: data
  }
}

//ApproveReject

const visaActionSuccess = msg => {
  return {
    type: constants.ACTION_SUCCESS,
    payload: msg
  };
};

const visaActionError = message => {
  return {
    type: constants.ACTION_ERROR,
    payload: message
  };
};

const visaSupervisorData = data => {
  return {
    type: constants.SUPERVISOR_DATA,
    payload: data
  };
};

export const visaFetchData = (empCode, authToken, isPullToLoaderActive) => {
  return async dispatch => {
    let isNetwork = await netInfo();
    if (isNetwork) {
      this.empCode = empCode;
      this.authToken = authToken;
      if (!isPullToLoaderActive) {
        dispatch(loading());
      }
      let form = new FormData();
      form.append("ECSerp", empCode);
      form.append("AuthKey", authToken);
      form.append("Type", "4");
      let url = properties.getVisaUrl;
      let visaResponse = await fetchPOSTMethod(url, form);
      if (visaResponse.length != undefined) {
        // console.log("Visa response for main Screen : ", visaResponse);
        if (
          visaResponse.length === 1 &&
          visaResponse[0].hasOwnProperty("Exception")
        ) {
          dispatch(storeVisaError(visaResponse[0].Exception));
        } else {
          dispatch(storeVisaData(visaResponse));
        }
      } else if (
        visaResponse.length === undefined ||
        visaResponse.length === 0 ||
        visaResponse === null ||
        visaResponse === undefined
      ) {
        dispatch(storeVisaError(UNDEFINED_MESSAGE));
      }
    } else {
      return alert(NO_INTERNET);
    }
  };
};

export const visaTakeAction = (data, action, remarks, defaultApprover) => {
  // console.log("DATA : ", data);
  return async dispatch => {
    let isNetwork = await netInfo();
    if (isNetwork) {
      dispatch(loading());
      let actionValue = "";
      let myDefaultApprover = defaultApprover != null ? defaultApprover : data.DefaultApprover;
      // console.log("final approver value", myDefaultApprover);
      let approverCodeOnly = myDefaultApprover.split(":");
      let approverCodeVal = approverCodeOnly[0].trim();
      let requestIdCodeOnly = data.VisaID.substring(4);
      let requestIdCodeSeparator = requestIdCodeOnly.split(/^0+/g);
      let requestIdCodeVal = requestIdCodeSeparator[1];
      if (action === constants.APPROVED_TEXT) {
        actionValue = "submit";
      } else if (action === constants.REJECTED_TEXT) {
        actionValue = "sendback";
      }
      let form = new FormData();
      form.append("ECSerp", this.empCode);
      form.append("AuthKey", this.authToken);
      form.append("TargetAction", actionValue);
      form.append("Type", "1");
      form.append("Comments", remarks);
      form.append("ApproverCode", approverCodeVal);
      form.append("CountryCode", data.CountryCode);
      form.append("VisaTypeCode", data.VisaTypeCode);
      form.append("VisaSubTypeCode", data.VisaSubTypeCode);
      form.append("ProcessingTypeCode", data.ProcessingTypeCode);
      form.append("TravelTypeCode", data.TravelTypeCode);
      form.append("DurationOfTravelCode", data.DurationOfTravelCode);
      form.append("FromRole", data.FromRole);
      form.append("LoggedInEmployeeCode", this.empCode);
      form.append("RequestID", requestIdCodeVal);
      form.append("EmpCode", data.EmpCode);
      let url = properties.visaActionUrl;
      // console.log("Action URL is :" + url);
      console.log("Submit visa Form data is: " + JSON.stringify(form));
      let response = await fetchPOSTMethod(url, form);
      // console.log("Visa taken action response from server is : ", response);
      if (response != undefined) {
        //response in array from hina mittal
        if (response.Remarks === "SUCCESS") {
          dispatch(visaActionSuccess(response.Remarks));
        } else if (response[0].hasOwnProperty("Exception")) {
          dispatch(visaActionError(response[0].Exception));
        }
      } else if (response === undefined || response === null) {
        dispatch(visaActionError(UNDEFINED_MESSAGE));
      }
    } else {
      return alert(NO_INTERNET);
    }
  };
};

export const fetchRequestorList = () => {
  return async dispatch => {
    let isNetwork = await netInfo();
    if (isNetwork) {
      dispatch(loading());
      let url = properties.fetchSupervisorVisaUrl;
      // console.log("Supervisor list url for visa is : ", url);
      let form = new FormData();
      form.append("ECSerp", this.empCode);
      form.append("AuthKey", this.authToken);
      form.append("Band", "6");
      let response = await fetchPOSTMethod(url, form);
      // console.log("Supervisor list response for visa from server is : ",response);
      if (response.length != undefined) {
        if (response.length === 1 && response[0].hasOwnProperty("Exception")) {
          // console.log("visa api exception while fetching visa list from server is : ",response);
          dispatch(storeVisaError(response[0].Exception));
        } else {
          // console.log("Supervisor list Valid response from server is : ",response);
          dispatch(visaSupervisorData(response.map(item => item.Code)));
        }
      } else if (
        response.length === undefined ||
        response.length === 0 ||
        response === null ||
        response === undefined
      ) {
        dispatch(storeVisaError(UNDEFINED_MESSAGE));
      }
    } else {
      return alert(NO_INTERNET);
    }
  };
};

export const visaFetchHistory = visaID => {
  return async dispatch => {
    let isNetwork = await netInfo();
    if (isNetwork) {
      dispatch(loading());
      let requestIdCodeOnly = visaID.substring(4);
      let requestIdCodeSeparator = requestIdCodeOnly.split(/^0+/g);
      let requestIdCodeVal = requestIdCodeSeparator[1];
      let form = new FormData();
      form.append("ECSerp", this.empCode);
      form.append("AuthKey", this.authToken);
      form.append("VisaID", requestIdCodeVal);
      let url = properties.visaHistoryUrl;
      let historyResponse = await fetchPOSTMethod(url, form);
      // console.log("visa response::::::", historyResponse);
      if (historyResponse.length != undefined) {
        // console.log("Visa history response for main Screen : ",historyResponse);
        if (
          historyResponse.length === 1 &&
          historyResponse[0].hasOwnProperty("Exception")
        ) {
          dispatch(storeVisaError(historyResponse[0].Exception));
        } else {
          dispatch(storeVisaHistory(historyResponse));
        }
      } else if (
        historyResponse.length === undefined ||
        historyResponse.length === 0 ||
        historyResponse === null ||
        historyResponse === undefined
      ) {
        dispatch(storeVisaError(UNDEFINED_MESSAGE));
      }
    } else {
      return alert(NO_INTERNET);
    }
  };
};

export const resetSupervisor = () => {
  return {
    type: constants.RESET_SUPERVISOR_DATA
  };
};

export const resetVisaHome = () => {
  return async dispatch => {
    dispatch(resetVisa());
  };
};

import { netInfo } from "../../utilities/NetworkInfo";
import { NO_INTERNET, UNDEFINED_MESSAGE } from "../../GlobalConstants";
import properties from "../../resource/properties";
import { fetchPOSTMethod } from "../../utilities/fetchService";
let constants = require('./constants');
let globalConstants = require("../../GlobalConstants");
let empCode;
let authToken;

const loading = () => {
    return {
      type: constants.ECRP_LOADING
    };
  };
  
  const storeEcrpData = data => {
    return {
      type: constants.ECRP_DATA,
      payload: data
    };
  };
  
  const storeEcrpError = msg => {
    return {
      type: constants.ECRP_ERROR,
      payload: msg
    };
  };

  const storeEcrpActionError=(message)=>{
    return {
        type: constants.ECRP_ACTION_ERROR,
        payload: message,
    }
  }

const storeEcrpHistory = data => {
  return {
    type: constants.STORE_ECRP_HISTORY,
    payload: data
  }
}

export const storeEcrpActionSuccess = msg => {
    return {
      type: constants.ECRP_ACTION_SUCCESS,
      payload: msg
    };
};

export const ecrpFetchData = (empCode, authToken, isPullToLoaderActive) => {
    return async dispatch => {
      let isNetwork = await netInfo();
      if (isNetwork) {
        this.empCode = empCode;
        this.authToken = authToken;
        if (!isPullToLoaderActive) {
          dispatch(loading());
        }
        let formData = new FormData();
        formData.append("ECSerp", empCode);
        formData.append("AuthKey", authToken);
        // console.log("33333333",formData)
        let url = properties.getECRPUrl;
        let ecrpResponse = await fetchPOSTMethod(url, formData);
        // console.log(ecrpResponse)
        if (ecrpResponse.length != undefined) {
          // console.log( "ECRP Card response for main Screen : ",ecrpResponse);
          if (
            ecrpResponse.length === 1 &&
            ecrpResponse[0].hasOwnProperty("Exception")
          ) {
            dispatch(storeEcrpError(ecrpResponse[0].Exception));
          } else {
            dispatch(storeEcrpData(ecrpResponse));
          }
        } else if (
          ecrpResponse.length === undefined ||
          ecrpResponse.length === 0 ||
          ecrpResponse === null ||
          ecrpResponse === undefined
        ) {
          dispatch(storeEcrpError(UNDEFINED_MESSAGE));
        }
      } else {
        return alert(NO_INTERNET);
      }
    };
  };

  export const completeRequest = (
    empData,
    type,
    remarks,
    action,
    selectedEmp
  ) => {
    return async dispatch => {
      let isNetwork = await netInfo();
      if (isNetwork) {
        dispatch(loading());
        // console.log("remarks value", remarks)
        let dataObj;
        if(action === globalConstants.APPROVED_TEXT) {
          let firstLevelSupValue = empData.FirstLevelSup.Value.split(":")
          // console.log("selectedEmp",selectedEmp)
          let pendingStatusValue = (selectedEmp === empData.FirstLevelSup.Value) ? 13 : 14    //SM-14,FL-13
          // console.log("pendingStatusValue",pendingStatusValue)
        dataObj = {
          LetterSNo: empData.LetterSNo,
          FirstLevelSup: firstLevelSupValue[0].trim(),
          SMCode: empData.SMCode,
          Remarks: remarks,
          PendingStatus: pendingStatusValue
        }
        }
        if(action === globalConstants.REJECTED_TEXT) {
        dataObj = { 
          "LetterSNo": empData.LetterSNo,
          "Remarks": remarks
        }
        }
        let formData = new FormData();
        formData.append("ECSerp", this.empCode);
        formData.append("AuthKey", this.authToken);
        formData.append("data", JSON.stringify(dataObj));
        formData.append("Type", type)
        let url = properties.ECRPActionUrl
        let actionResponse = await fetchPOSTMethod(url, formData);
        if (actionResponse.length != undefined) {
          if (actionResponse.length === 1 && actionResponse[0].hasOwnProperty("Exception")) {
            // console.log("ecrp submit api exception while submitting to server is : ",actionResponse);
            dispatch(storeEcrpActionError(actionResponse[0].Exception));
          } else {
            // console.log("ecrp submit response from server is : ", actionResponse);
            dispatch(storeEcrpActionSuccess(actionResponse[0].msgTxt));
          }
        } else if (
          actionResponse.length === undefined ||
          actionResponse.length === 0 ||
          actionResponse === null ||
          actionResponse === undefined
        ) {
          dispatch(storeEcrpActionError(UNDEFINED_MESSAGE));
        }
      } else {
        return alert(NO_INTERNET);
      }
    };
  };

export const resetEcrpStore = () => {
    return {
      type: constants.ECRP_RESET_STORE
    };
};

export const ecrpFetchHistory = docNumber => {
  return async dispatch => {
    let isNetwork = await netInfo();
    if (isNetwork) {
      dispatch(loading());
      let form = new FormData();
      form.append("ECSerp", this.empCode);
      form.append("AuthKey", this.authToken);
      form.append("LetterSNo", docNumber);
      let url = properties.ECRPHistoryUrl;
      let historyResponse = await fetchPOSTMethod(url, form);
      if (historyResponse.length != undefined) {
        // console.log("ECRP history response for main Screen : ",historyResponse);
        if (
          historyResponse.length === 1 &&
          historyResponse[0].hasOwnProperty("Exception")
        ) {
          dispatch(storeEcrpError(historyResponse[0].Exception));
        } else {
          dispatch(storeEcrpHistory(historyResponse));
        }
      } else if (
        historyResponse.length === undefined ||
        historyResponse.length === 0 ||
        historyResponse === null ||
        historyResponse === undefined
      ) {
        dispatch(storeEcrpError(UNDEFINED_MESSAGE));
      }
    } else {
      return alert(NO_INTERNET);
    }
  };
};
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
      type: constants.EES_LOADING
    };
  };
  
  const storeEESData = data => {
    return {
      type: constants.EES_DATA,
      payload: data
    };
  };
  
  const storeEESError = msg => {
    return {
      type: constants.EES_ERROR,
      payload: msg
    };
  };

  const storeEESReset = () => {
    return {
      type: constants.EES_RESET_STORE
    };
  };

  const storeEESSaveData = data => {
    return {
      type: constants.EES_SAVE_DATA,
      payload: data
    };
  };
  
  const storeEESSaveError = msg => {
    return {
      type: constants.EES_SAVE_ERROR,
      payload: msg
    };
  };

  export const eesFetchData = (empCode, authToken) => {
    return async dispatch => {
      let isNetwork = await netInfo();
      if (isNetwork) {
        this.empCode = empCode;
        dispatch(loading());
        let formData = new FormData();
        formData.append("_EmployeeCode", empCode);
        // formData.append("AuthKey", authToken);
        let url = properties.getEESRecordUrl;
        let response = await fetchPOSTMethod(url, formData);  //response is in object form here
        console.log("EES response",response)
        if (response != undefined || response != null) {
          if (response.length === 1 && response[0].hasOwnProperty("Exception")) {
            dispatch(storeEESError(response[0].Exception));
          } else {
            dispatch(storeEESData(response._response));
          }
        } else if (response.length === undefined || response.length === 0 || response === null || response === undefined) {
          dispatch(storeEESError(UNDEFINED_MESSAGE));
        }
      } else {
        return alert(NO_INTERNET);
      }
    };
  };

  export const eesSaveAndSubmit = (type, record) => {
    return async dispatch => {
      let isNetwork = await netInfo();
      if (isNetwork) {
        dispatch(loading());
        let formData = new FormData();
        console.log("66666666", type)
        formData.append("_EmployeeCode", this.empCode);
        formData.append("_Feedback", "");
        formData.append("_Type", type);
        formData.append("_Jsonrecords", JSON.stringify(record));
        let url = properties.saveAndSubmitEESUrl;
        let response = await fetchPOSTMethod(url, formData);  //response is in object form here
        console.log("EES save data response",response)
        if (response != undefined || response != null) {
          if (response.length === 1 && response[0].hasOwnProperty("Exception")) {
            dispatch(storeEESSaveError(response[0].Exception));
          } else {
            let timeoutTime = 1000
            if(type == globalConstants.SUBMIT_TEXT) {
              timeoutTime = 10
            }
            setTimeout(() => {
              dispatch(storeEESSaveData(response._response));
            }, timeoutTime)
          }
        } else if (response.length === undefined || response.length === 0 || response === null || response === undefined) {
          dispatch(storeEESSaveError(UNDEFINED_MESSAGE));
        }
      } else {
        return alert(NO_INTERNET);
      }
    };
  };

  export const resetEESHome = () => {
    return async dispatch => {
      dispatch(storeEESReset());
    };
  };
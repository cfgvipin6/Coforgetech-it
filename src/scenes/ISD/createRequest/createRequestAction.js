import { netInfo } from "../../../utilities/NetworkInfo";
import properties from "../../../resource/properties";
import { fetchPOSTMethod, fetchGETMethod } from "../../../utilities/fetchService";
let globalConstants = require("../../../GlobalConstants");
let constants = require("./constants");
let empCode;
let authToken;

const loading = () => {
    return {
      type: constants.ISD_LOADING
    };
  };
  
  const storeISDDefaultData = data => {
    return {
      type: constants.ISD_DEFAULT_DATA,
      payload: data
    };
  };
  const storeISDtoUpdate = data => {
    return {
      type: constants.ISD_UPDATE_DATA,
      payload: data
    }
  }
  const storeISDDefaultError = msg => {
    return {
      type: constants.ISD_DEFAULT_ERROR,
      payload: msg
    };
  };

  const storeISDServiceTypeData = data => {
    return {
      type: constants.ISD_SERVICE_TYPE_DATA,
      payload: data
    };
  };
  
  const storeISDServiceTypeError = msg => {
    return {
      type: constants.ISD_SERVICE_TYPE_ERROR,
      payload: msg
    };
  };

  const storeISDSaveData = data => {
    return {
      type: constants.ISD_SAVE_DATA,
      payload: data
    };
  };
  const storeAdditionalRemarks =data=>{
    return {
      type: constants.ADDITIONAL_REMARKS,
      payload: data
    };
  }
  const storeISDSaveError = msg => {
    return {
      type: constants.ISD_SAVE_ERROR,
      payload: msg
    };
  };

  const storeISDFileResponseData = data => {
    return {
      type: constants.ISD_FILE_RESPONSE_DATA,
      payload: data
    };
  };
  
  const storeISDFileResponseError = msg => {
    return {
      type: constants.ISD_FILE_RESPONSE_ERROR,
      payload: msg
    };
  };

  const storeISDSearchEmpData = data => {
    return {
      type: constants.ISD_SEARCH_EMPLOYEE_DATA,
      payload: data
    };
  };
  
  const storeISDSearchEmpError = msg => {
    return {
      type: constants.ISD_SEARCH_EMPLOYEE_ERROR,
      payload: msg
    };
  };

  const storeISDCreateReset = () => {
    return {
      type: constants.ISD_RESET_STORE
    };
  };
  const storeDeleteAction = (data) => {
    return{
      type: constants.DELETE_FILE,
      payload: data
    }
  }
  const storeFileData =(data) =>{
    return{
      type: constants.DOWNLOAD_FILE,
      payload: data
    }
  }
  export const isdFetchDefaultData = (empCode, authToken,recordUpdateCallBack) => {
    return async dispatch => {
      let isNetwork = await netInfo();
      if (isNetwork) {
        this.empCode = empCode;
        this.authToken = authToken;
        dispatch(loading());
        let formData = new FormData();
        formData.append("ECSerp", empCode);
        formData.append("AuthKey", authToken);
        let url = properties.isdCreateRequestUrl;
        let response = await fetchPOSTMethod(url, formData); 
        console.log("isd default response",response)
        if (response.length != undefined) {
          if (response.length === 1 && response[0].hasOwnProperty("Exception")) {
            dispatch(storeISDDefaultError(response[0].Exception));
          } else {
            dispatch(storeISDDefaultData(response));
            setTimeout(()=>{
              recordUpdateCallBack()
            },500)
          }
        } else if (response.length === undefined || response.length === 0 || response === null || response === undefined) {
          dispatch(storeISDDefaultError(globalConstants.UNDEFINED_MESSAGE));
        }
      } else {
        return alert(globalConstants.NO_INTERNET);
      }
    };
  };

  export const isdFetchServiceTypeData = (empCode,authToken,type) => {
    console.log("isdFetchServiceTypeData", type)
    return async dispatch => {
      let isNetwork = await netInfo();
      if (isNetwork) {
        dispatch(loading());
        let formData = new FormData();
        formData.append("ECSerp", empCode);
        formData.append("AuthKey", authToken);
        formData.append("serviceReqType", type)
        let url = properties.isdGetServiceTypeUrl;
        let response = await fetchPOSTMethod(url, formData); 
        console.log("Filter data response : ",response)
        if (response.length != undefined) {
          if (response.length === 1 && response[0].hasOwnProperty("Exception")) {
            dispatch(storeISDServiceTypeError(response[0].Exception));
          } else {
            dispatch(storeISDServiceTypeData(response));
          }
        } else if (response.length === undefined || response.length === 0 || response === null || response === undefined) {
          dispatch(storeISDServiceTypeError(globalConstants.UNDEFINED_MESSAGE));
        }
      } else {
        return alert(globalConstants.NO_INTERNET);
      }
    };
  };

  export const isdSaveOrSubmit = (record) => {
    return async dispatch => {
      let isNetwork = await netInfo();
      if (isNetwork) {
        dispatch(loading());
        let formData = new FormData();
        formData.append("ECSerp", this.empCode);
        formData.append("AuthKey", this.authToken);
        formData.append("serviceDetails", JSON.stringify(record));
        let url = properties.isdSaveOrSubmitUrl;
        let response = await fetchPOSTMethod(url, formData);  
        console.log("isd save or submit data response",response)
        if (response.length != undefined) {
          if (response.length === 1 && response[0].hasOwnProperty("Exception")) {
            dispatch(storeISDSaveError(response[0].Exception));
          } else {
            dispatch(storeISDSaveData(response[0].OUTPUT));
          }
        } else if (response.length === undefined || response.length === 0 || response === null || response === undefined) {
          dispatch(storeISDSaveError(globalConstants.UNDEFINED_MESSAGE));
        }
      } else {
        return alert(globalConstants.NO_INTERNET);
      }
    };
  };

  export const isdFileUpload = (fileName, fileData, requestID) => {
    return async dispatch => {
      let isNetwork = await netInfo();
      if (isNetwork) {
        try{
          dispatch(loading());
          let formData = new FormData();
          formData.append("ECSerp", this.empCode);
          formData.append("AuthKey", this.authToken);
          formData.append("RequestID", requestID);
          formData.append("data", fileData);
          formData.append("FileName", fileName);
          let url = properties.isdFileUploadUrl;
          let response = await fetchPOSTMethod(url, formData);  
          console.log("isd file upload data response",response)
          if (response != undefined || response != null) {
            if (response.length === 1 && response[0].hasOwnProperty("Exception")) {
              dispatch(storeISDFileResponseError(response[0].Exception));
            } else {
              dispatch(storeISDFileResponseData(response[0]));
            }
          } else if (response.length === undefined || response.length === 0 || response === null || response === undefined) {
            dispatch(storeISDFileResponseError(globalConstants.UNDEFINED_MESSAGE));
          }
        }catch(error){
          dispatch(storeISDFileResponseError(error.toString()));
        }
      } else {
        return alert(globalConstants.NO_INTERNET);
      }
    };
  };

  export const isdAutoCompleteEmployee = (term) => {
    return async dispatch => {
      let isNetwork = await netInfo();
      if (isNetwork) {
        // dispatch(loading());
        // let formData = new FormData();
        // formData.append("ECSerp", this.empCode);
        // formData.append("AuthKey", this.authToken);
        // formData.append("term", term);
        // let url = properties.autoCompleteEmployeeUrl;
        let url = properties.autoCompleteEmployeeNewUrl;
        let response = await fetchGETMethod(url+ "term=" + term);  
        console.log("isd auto search response",response)
        if (response.length != undefined) {
          if (response.length === 1 && response[0].hasOwnProperty("Exception")) {
            dispatch(storeISDSearchEmpError(response[0].Exception));
          } else {
            dispatch(storeISDSearchEmpData(response.slice(0,5)));
          }
        } else if (response.length === undefined || response.length === 0 || response === null || response === undefined) {
          dispatch(storeISDSearchEmpError(globalConstants.UNDEFINED_MESSAGE));
        }
      } else {
        return alert(globalConstants.NO_INTERNET);
      }
    };
  };

  export const isdUpdateRequestorDetails = (requestorID) => {
    return async dispatch => {
      let isNetwork = await netInfo();
      if (isNetwork) {
        dispatch(loading());
        let formData = new FormData();
        formData.append("ECSerp", this.empCode);
        formData.append("AuthKey", this.authToken);
        formData.append("MobileRequest",2)
        formData.append("RequestorID", requestorID);
        let url = properties.isdRequestorUpdateUrl;
        let response = await fetchPOSTMethod(url, formData);  
        console.log("isd requestor update response",response)
        if (response.length != undefined) {
          if (response.length === 1 && response[0].hasOwnProperty("Exception")) {
            dispatch(storeISDDefaultError(response[0].Exception));
          } else {
            dispatch(storeISDDefaultData(response));
          }
        } else if (response.length === undefined || response.length === 0 || response === null || response === undefined) {
          dispatch(storeISDDefaultError(globalConstants.UNDEFINED_MESSAGE));
        }
      } else {
        return alert(globalConstants.NO_INTERNET);
      }
    };
  };

  export const isdResetCreateScreen = () => {
    return async dispatch => {
      dispatch(storeISDCreateReset());
    };
  };

  export const previousRecordsToUpdate = (empCode, authToken,requestID,requestFrom,teamID,Type,updateScreenCallBack) =>{
    return async dispatch => {
      let isNetwork = await netInfo();
      if (isNetwork) {
        dispatch(loading());
        let formData = new FormData();
        formData.append("ECSerp", empCode);
        formData.append("AuthKey", authToken);
        formData.append("requestid", requestID);
        formData.append("requestfrom", requestFrom);
        formData.append("TeamId", teamID);
        formData.append("Type", Type);
        formData.append("MobileRequest", 2);
        let url = properties.isdMyRequestDetailsUrl;
        console.log("Form data is :", formData);
        let response = await fetchPOSTMethod(url, formData);  
        console.log("Fetched isd records to update ",response)
        if (response != undefined || response != null) {
          if (response.length === 1 && response[0].hasOwnProperty("Exception")) {
            dispatch(storeISDDefaultError(response[0].Exception));
          } else {
            dispatch(storeISDtoUpdate(response));
            setTimeout(()=>{
              updateScreenCallBack();
            },500)
          }
        } else if (response.length === undefined || response.length === 0 || response === null || response === undefined) {
          dispatch(storeISDDefaultError(globalConstants.UNDEFINED_MESSAGE));
        }
      } else {
        return alert(globalConstants.NO_INTERNET);
      }
    };
  }

  export const submitRemarksOpen=(empCode,authToken,requestID,remarks)=>{
    return async dispatch => {
      let isNetwork = await netInfo();
      if (isNetwork) {
        dispatch(loading());
        let formData = new FormData();
        formData.append("ECSerp", empCode);
        formData.append("AuthKey", authToken);
        formData.append("RequestID", requestID);
        formData.append("AddRemarkUser", remarks);
        let url = properties.reOpenURL;
        console.log("Form data is :", formData);
        let response = await fetchPOSTMethod(url, formData);  
        console.log("Reopen remarks response ",response)
        if (response != undefined || response != null) {
          if (response.length === 1 && response[0].hasOwnProperty("Exception")) {
            dispatch(storeISDDefaultError(response[0].Exception));
          } else {
            dispatch(storeAdditionalRemarks(response));
          }
        } else if (response.length === undefined || response.length === 0 || response === null || response === undefined) {
          dispatch(storeISDDefaultError(globalConstants.UNDEFINED_MESSAGE));
        }
      } else {
        return alert(globalConstants.NO_INTERNET);
      }
    };
   }
 export const submitAdditionalRemarksAction=(empCode,authToken,requestID,remarks)=>{
  return async dispatch => {
    let isNetwork = await netInfo();
    if (isNetwork) {
      dispatch(loading());
      let formData = new FormData();
      formData.append("ECSerp", empCode);
      formData.append("AuthKey", authToken);
      formData.append("requestid", requestID);
      formData.append("AddtionalComments", remarks);

      let url = properties.submitITAdditionalRemarks;
      console.log("Form data is :", formData);
      let response = await fetchPOSTMethod(url, formData);  
      console.log("Additional remarks response ",response)
      if (response != undefined || response != null) {
        if (response.length === 1 && response[0].hasOwnProperty("Exception")) {
          dispatch(storeISDDefaultError(response[0].Exception));
        } else {
          dispatch(storeAdditionalRemarks(response));
        }
      } else if (response.length === undefined || response.length === 0 || response === null || response === undefined) {
        dispatch(storeISDDefaultError(globalConstants.UNDEFINED_MESSAGE));
      }
    } else {
      return alert(globalConstants.NO_INTERNET);
    }
  };
 }

 export const performFileAction=(empCode,authToken,action,fileId,writeFileCallBack)=>{
  return async dispatch => {
    let isNetwork = await netInfo();
    if (isNetwork) {
      dispatch(loading());
      let formData = new FormData();
      formData.append("ECSerp", empCode);
      formData.append("AuthKey", authToken);
      formData.append("FileId", fileId);
      formData.append("MobileRequest", 2);
      let url = action==="delete" ?  properties.deleteISDFile : properties.downloadISDFile;
      console.log("Form data is :", formData);
      let response = await fetchPOSTMethod(url, formData);  
      console.log("File "+ action + " ",response)
      if (response != undefined || response != null) {
        if (response.length === 1 && response[0].hasOwnProperty("Exception")) {
          dispatch(storeISDDefaultError(response[0].Exception));
        } else {
          if(action==="delete"){
            dispatch(storeDeleteAction(response[0]));
          }else if(action==="download") {
            dispatch(storeFileData(response));
            setTimeout(()=>{
              writeFileCallBack();
            },1000)
          }
        }
      } else if (response.length === undefined || response.length === 0 || response === null || response === undefined) {
        dispatch(storeISDDefaultError(globalConstants.UNDEFINED_MESSAGE));
      }
    } else {
      return alert(globalConstants.NO_INTERNET);
    }
  }
 }
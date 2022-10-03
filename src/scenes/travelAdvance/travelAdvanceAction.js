import { netInfo } from "../../utilities/NetworkInfo";
import { NO_INTERNET, UNDEFINED_MESSAGE } from "../../GlobalConstants";
import properties from "../../resource/properties";
import { fetchPOSTMethod, fetchGETMethod } from "../../utilities/fetchService";
let constants = require("./constants");
let empCode;
let authToken;
let approverType;

const resetTravelAdvance = () => {
    return {
      type: constants.TRAVEL_ADVANCE_RESET_STORE
    };
  };
  
  const loading = () => {
    return {
      type: constants.TRAVEL_ADVANCE_LOADING
    };
  };
  
  const storeTravelAdvanceHistory = data => {
    return {
      type: constants.TRAVEL_ADVANCE_HISTORY,
      payload: data
    }
  }
  
  const storeTravelAdvanceData = data => {
    return {
      type: constants.TRAVEL_ADVANCE_DATA,
      payload: data
    };
  };
  
  const storeTravelAdvanceError = msg => {
    return {
      type: constants.TRAVEL_ADVANCE_ERROR,
      payload: msg
    };
  };
  
  const storeApproverData = data => {
    return {
      type: constants.TRAVEL_ADVANCE_APPROVER_DATA,
      payload: data
    };
  };
  
  const storeTravelAdvanceActionError=(message)=>{
      return {
          type: constants.TRAVEL_ADVANCE_ACTION_ERROR,
          payload: message,
      }
  }
  
  const storeTravelAdvanceActionSuccess = msg => {
      return {
        type: constants.TRAVEL_ADVANCE_ACTION_MSG,
        payload: msg
      };
  };

  export const TravelAdvanceFetchData = (empCode, authToken, isPullToLoaderActive, serviceType) => {
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
        formData.append("DocType", serviceType);
        let url = properties.getAdvanceTravelUrl;
        let response = await fetchPOSTMethod(url, formData);
        if (response.length != undefined) {
          // console.log("Advance Travel response for main Screen : ",response);
          if (response.length === 1 && response[0].hasOwnProperty("Exception")) {
            dispatch(storeTravelAdvanceError(response[0].Exception));
          } else {
            dispatch(storeTravelAdvanceData(response));
          }
        } else if (response.length === undefined || response.length === 0 || response === null || response === undefined) {
          dispatch(storeTravelAdvanceError(UNDEFINED_MESSAGE));
        }
      } else {
        return alert(NO_INTERNET);
      }
    };
  };

  export const resetTravelAdvanceStore = () => {
    return async dispatch => {
      dispatch(resetTravelAdvance());
    };
  };

  export const fetchRequestorList = (item, approverType, isDomesticRequest) => {
    return async dispatch => {
      let isNetwork = await netInfo();
      if (isNetwork) {
        this.approverType = approverType;
        dispatch(loading(true));
        let url = properties.getTrApproverList;
        let form = new FormData();
        form.append("ECSerp", this.empCode);
        form.append("AuthKey", this.authToken);
        form.append("DocType", (isDomesticRequest) ? "D" : "I");
        form.append("DocumentNo", item.DocumentNo);
        form.append("ListFor", approverType);
        let response = await fetchPOSTMethod(url, form);
        // console.log("Advance Travel approver List response::",response)
          if (response.length != undefined) {
            if (response.length === 1 && response[0].hasOwnProperty("Exception")) {
              // console.log("Advance Travel exception while fetching approver list from server is : ",response);
              dispatch(storeTravelAdvanceError(response[0].Exception));
            } else {
              // console.log("Advance Travel approver list from server is : ", response);
              dispatch(storeApproverData(response));
            }
          } else if (
            response.length === undefined ||
            response.length === 0 ||
            response === null ||
            response === undefined
          ) {
            dispatch(storeTravelAdvanceError(UNDEFINED_MESSAGE));
          }
      } else {
        return alert(NO_INTERNET);
      }
    };
  };

  export const resetApprover = () => {
    return {
      type: constants.TRAVEL_ADVANCE_RESET_APPROVER_DATA
    };
  };

  export const completeRequest = (isDomesticRequest, item, actionValue, approverEmpId, MyRemarks) => {
    return async dispatch => {
      let isNetwork = await netInfo();
      if (isNetwork) {
        dispatch(loading());
        let pendingWithValue;
        let loginEmpCodeValue;
        if (actionValue === "A") {
        pendingWithValue = approverEmpId;
        loginEmpCodeValue = item.DocOwnerCode;
        } else if (actionValue ===  "R") {
        pendingWithValue = item.DocOwnerCode;
        loginEmpCodeValue = this.empCode;
        }
        let dataObj = {
          // Type : (isDomesticRequest) ? "2" : "1",
          Type: 1,
          AdvDocNo : item.ADVDocNo,
          LoginEmpCode: loginEmpCodeValue,
          Remarks : MyRemarks,
          Action : actionValue,
          PendingWith : pendingWithValue,
          SendTo : this.approverType
          }
        let formData = new FormData();
        formData.append("ECSerp", this.empCode);
        formData.append("AuthKey", this.authToken);
        formData.append("Data", JSON.stringify(dataObj));
        let url = properties.advanceTravelActionUrl;
        let actionResponse = await fetchPOSTMethod(url, formData);
        // console.log("Advance Travel action response",actionResponse)
        if (actionResponse.length != undefined && actionResponse[0]!=undefined) {
          if (actionResponse.length === 1 && actionResponse[0].hasOwnProperty("Exception")) {
            // console.log("Advance Travel submit api exception while submitting to server is : ",actionResponse);
            dispatch(storeTravelAdvanceActionError(actionResponse[0].Exception));
          } else {
            // console.log("Advance Travel submit response from server is : ", actionResponse);
            dispatch(storeTravelAdvanceActionSuccess(actionResponse[0].msgTxt));
          }
        } else if (
          actionResponse.length === undefined ||
          actionResponse.length === 0 ||
          actionResponse === null ||
          actionResponse === undefined
        ) {
          dispatch(storeTravelAdvanceActionError(UNDEFINED_MESSAGE));
        }
      } else {
        return alert(NO_INTERNET);
      }
    };
  };
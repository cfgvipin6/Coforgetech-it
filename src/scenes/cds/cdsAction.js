import { netInfo } from "../../utilities/NetworkInfo";
import { NO_INTERNET, UNDEFINED_MESSAGE } from "../../GlobalConstants";
import properties from "../../resource/properties";
import { fetchPOSTMethod, fetchGETMethod } from "../../utilities/fetchService";
let constants = require("./constants");
let empCode;
let authToken;

const resetCds = () => {
    return {
      type: constants.CDS_RESET_STORE
    };
  };
  
  const loading = () => {
    return {
      type: constants.CDS_LOADING
    };
  };
  
  const storeCdsData = data => {
    return {
      type: constants.CDS_DATA,
      payload: data
    };
  };
  
  const storeCdsError = msg => {
    return {
      type: constants.CDS_ERROR,
      payload: msg
    };
  };

  const storeCdsHistory = data => {
    return {
      type: constants.CDS_HISTORY,
      payload: data
    }
  }

  const storeCdsLineItemData = data => {
    return {
      type: constants.CDS_LINE_ITEM_DATA,
      payload: data
    }
  }

  const storeCdsDetailError = msg => {
    return {
      type: constants.CDS_DETAIL_ERROR,
      payload: msg
    }
  }

  const storeCdsDetailData = data => {
    return {
      type: constants.CDS_DETAIL_DATA,
      payload: data
    }
  }

  const storeCdsLineItemError = msg => {
    return {
      type: constants.CDS_LINE_ITEM_ERROR,
      payload: msg
    }
  }

  const storeCdsActionListData = data => {
    return {
      type: constants.CDS_ACTION_LIST_DATA,
      payload: data
    }
  }

  const storeCdsActionListError = msg => {
    return {
      type: constants.CDS_ACTION_LIST_ERROR,
      payload: msg
    }
  }

  const storeCdsActionApproveData = data => {
    return {
      type: constants.CDS_ACTION_APPROVE_DATA,
      payload: data
    }
  }

  const storeCdsActionApproveError = msg => {
    return {
      type: constants.CDS_ACTION_APPROVE_ERROR,
      payload: msg
    }
  }

  const storeCdsActionTakenData = message => {
    return {
      type: constants.CDS_ACTION_TAKEN_SUCCESS,
      payload: message
    }
  }

  const storeCdsActionTakenError = msg => {
    return {
      type: constants.CDS_ACTION_TAKEN_ERROR,
      payload: msg
    }
  }

  export const cdsFetchData = (empCode, authToken, isPullToLoaderActive) => {
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
        let url = properties.getCDSUrl;
        let response = await fetchPOSTMethod(url, formData);
        // let response = [
        //   {
        //       "ErrorFlag": "N",
        //       "Exception": "Person is authorized to view the details",
        //       "Result": "Success"
        //   }
        // ]
        if (response.length != undefined) {
          // console.log("CDS response for main Screen : ",response);
          if (
            response.length === 1 &&
            response[0].hasOwnProperty("Exception")
          ) {
            dispatch(storeCdsError(response[0].Exception));
          } else {
            dispatch(storeCdsData(response));
          }
        } else if (
          response.length === undefined ||
          response.length === 0 ||
          response === null ||
          response === undefined
        ) {
          dispatch(storeCdsError(UNDEFINED_MESSAGE));
        }
      } else {
        return alert(NO_INTERNET);
      }
    };
  };

  export const cdsFetchDetailData = (cdsCode) => {
    return async dispatch => {
      let isNetwork = await netInfo();
      if (isNetwork) {
        dispatch(loading());
        let formData = new FormData();
        formData.append("ECSerp", this.empCode);
        formData.append("AuthKey", this.authToken);
        formData.append("CDSCode", cdsCode)
        let url = properties.getCDSDetailUrl;
        let response = await fetchPOSTMethod(url, formData);
        if (response.length != undefined) {
          // console.log("CDS Details response : ",response);
          if (response.length === 1 && response[0].hasOwnProperty("Exception")) {
            dispatch(storeCdsDetailError(response[0].Exception));
          } else if(response[0].ErrorFlag == "Y") {
            dispatch(storeCdsDetailError(response[0].Message))
          } else {
            dispatch(storeCdsDetailData(response[0].Result));
          }
        } else if (
          response.length === undefined ||
          response.length === 0 ||
          response === null ||
          response === undefined
        ) {
          dispatch(storeCdsDetailError(UNDEFINED_MESSAGE));
        }
      } else {
        return alert(NO_INTERNET);
      }
    };
  };

  export const cdsFetchLineItemData = (cdsCode) => {
    return async dispatch => {
      let isNetwork = await netInfo();
      if (isNetwork) {
        dispatch(loading());
        let formData = new FormData();
        formData.append("ECSerp", this.empCode);
        formData.append("AuthKey", this.authToken);
        formData.append("CDSCode", cdsCode)
        let url = properties.getCDSLineItemUrl;
        let response = await fetchPOSTMethod(url, formData);
        
        if (response.length != undefined) {
          // console.log("CDS Line Item response : ",response);
          if (response.length === 1 && response[0].hasOwnProperty("Exception")) {
            dispatch(storeCdsLineItemError(response[0].Exception));
          } else if(response[0].ErrorFlag == "Y") {
            dispatch(storeCdsLineItemError(response[0].Message))
          } else {
            dispatch(storeCdsLineItemData(response[0].Result));
          }
        } else if (
          response.length === undefined ||
          response.length === 0 ||
          response === null ||
          response === undefined
        ) {
          dispatch(storeCdsLineItemError(UNDEFINED_MESSAGE));
        }
      } else {
        return alert(NO_INTERNET);
      }
    };
  };

  export const cdsFetchActionListData = (cdsCode) => {
    return async dispatch => {
      let isNetwork = await netInfo();
      if (isNetwork) {
        dispatch(loading());
        let formData = new FormData();
        formData.append("ECSerp", this.empCode);
        formData.append("AuthKey", this.authToken);
        formData.append("CDSCode", cdsCode)
        let url = properties.getCDSActionListUrl;
        let response = await fetchPOSTMethod(url, formData);
        if (response.length != undefined) {
          // console.log("CDS Action List response : ",response);
          if (response.length === 1 && response[0].hasOwnProperty("Exception")) {
            dispatch(storeCdsActionListError(response[0].Exception));
          } else if(response[0].ErrorFlag == "Y") {
            dispatch(storeCdsActionListError(response[0].Message))
          } else {
            dispatch(storeCdsActionListData(response[0].Result));
          }
        } else if (
          response.length === undefined ||
          response.length === 0 ||
          response === null ||
          response === undefined
        ) {
          dispatch(storeCdsActionListError(UNDEFINED_MESSAGE));
        }
      } else {
        return alert(NO_INTERNET);
      }
    };
  };

  export const cdsActionApprove = (cdsCode) => {
    return async dispatch => {
      let isNetwork = await netInfo();
      if (isNetwork) {
        dispatch(loading());
        let formData = new FormData();
        formData.append("ECSerp", this.empCode);
        formData.append("AuthKey", this.authToken);
        formData.append("CDSCode", cdsCode)
        let url = properties.getCDSActionSelectUrl;
        let response = await fetchPOSTMethod(url, formData);
        if (response.length != undefined) {
          // console.log("CDS Action Approve data : ",response);
          if (response.length === 1 && response[0].hasOwnProperty("Exception")) {
            dispatch(storeCdsActionApproveError(response[0].Exception));
          } else if(response[0].ErrorFlag == "Y") {
            dispatch(storeCdsActionApproveError(response[0].Message))
          } else {
            dispatch(storeCdsActionApproveData(response[0].Result));
          }
        } else if (
          response.length === undefined ||
          response.length === 0 ||
          response === null ||
          response === undefined
        ) {
          dispatch(storeCdsActionApproveError(UNDEFINED_MESSAGE));
        }
      } else {
        return alert(NO_INTERNET);
      }
    };
  };

  export const cdsActionTaken = (cdsCode, userAction, remarks, itemsString, submitTo) => {
    return async dispatch => {
      let isNetwork = await netInfo();
      if (isNetwork) {
        dispatch(loading());
        let formData = new FormData();
        formData.append("ECSerp", this.empCode);
        formData.append("AuthKey", this.authToken);
        formData.append("CDSCode", cdsCode)
        formData.append("UserAction", userAction)
        formData.append("Remarks", remarks)
        formData.append("Items", itemsString)
        formData.append("SubmitTo", submitTo)
        let url = properties.CDSActionUrl;
        // console.log("formData",formData)
        let response = await fetchPOSTMethod(url, formData);
        // let response = [
        //   {
        //       "ErrorFlag": "N",
        //       "Exception": "Person is authorized to view the details",
        //   }
        // ]
        if (response.length != undefined) {
          // console.log("CDS Action Taken data : ",response);
          if (response.length === 1 && response[0].hasOwnProperty("Exception")) {
            dispatch(storeCdsActionTakenError(response[0].Exception));
          } else if(response[0].ErrorFlag == "Y") {
            dispatch(storeCdsActionTakenError(response[0].Message))
          } else {
            dispatch(storeCdsActionTakenData(response[0].Result));
          }
        } else if (
          response.length === undefined ||
          response.length === 0 ||
          response === null ||
          response === undefined
        ) {
          dispatch(storeCdsActionTakenError(UNDEFINED_MESSAGE));
        }
      } else {
        return alert(NO_INTERNET);
      }
    };
  };

  export const resetCdsDetailsScreen = () => {
    return {
      type : constants.CDS_LINE_ITEM_RESET
    }
  };

  export const resetCdsHome = () => {
    return {
      type : constants.CDS_RESET_STORE
    }
  }

  export const cdsFetchHistory = cdsCode => {
    return async dispatch => {
      let isNetwork = await netInfo();
      if (isNetwork) {
        dispatch(loading());
        let form = new FormData();
        form.append("ECSerp", this.empCode);
        form.append("AuthKey", this.authToken);
        form.append("CDSCode", cdsCode);
        let url = properties.CDSHistoryUrl;
        let historyResponse = await fetchPOSTMethod(url, form);
        if (historyResponse.length != undefined) {
          // console.log("CDS history response for main Screen : ",historyResponse);
          if (
            historyResponse.length === 1 &&
            historyResponse[0].hasOwnProperty("Exception")
          ) {
            dispatch(storeCdsError(historyResponse[0].Exception));
          } else {
            dispatch(storeCdsHistory(historyResponse));
          }
        } else if (
          historyResponse.length === undefined ||
          historyResponse.length === 0 ||
          historyResponse === null ||
          historyResponse === undefined
        ) {
          dispatch(storeCdsError(UNDEFINED_MESSAGE));
        }
      } else {
        return alert(NO_INTERNET);
      }
    };
  };

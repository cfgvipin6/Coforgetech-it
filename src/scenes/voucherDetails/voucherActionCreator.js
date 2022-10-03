import { VOUCHER_LOADING, RESET_VOUCHER, VOUCHER_ERROR, STORE_VOUCHER, SUBMIT_ACTION_SUCCESS } from "./constants";
import { fetchPOSTMethod } from "../../utilities/fetchService";
import { netInfo } from "../../utilities/NetworkInfo";
import { NO_INTERNET, UNDEFINED_MESSAGE } from "../../GlobalConstants";
import properties from "../../resource/properties";

const voucherLoading=()=>{
    return{
        type: VOUCHER_LOADING
    }
}
export const resetVoucherState=()=>{
    return{
        type:RESET_VOUCHER,
    }
}
const storeVoucherError=(message)=>{
     return {
         type: VOUCHER_ERROR,
         payload: message,
     }
}
const usSubmitActionSuccess=(msg)=>{
    return{
        type: SUBMIT_ACTION_SUCCESS,
        payload:msg
    }
}
const storeVoucherData = (data) => {
    return {
        type: STORE_VOUCHER,
        payload: data,
    }
}
export const getPendingVoucherRequestDetail = (loginId, authKey, voucher) => {
  return async dispatch => {
    let isNetwork = await netInfo();
    if (isNetwork) {
      dispatch(voucherLoading());
      let documentNo = voucher.DocumentNo;
      let documentType = voucher.DocumentType;
      let form = new FormData();
      form.append("ECSerp", loginId);
      form.append("AuthKey", authKey);
      form.append("DocumentNo", documentNo);
      let response;
      if (documentType != "LCV") {
        response = await fetchPOSTMethod(properties.getCSHVoucherUrl, form);
        // console.log("NON LCV response : ", response);
      } else if (documentType === "LCV") {
        response = await fetchPOSTMethod(properties.getLCVoucherUrl, form);
        // console.log("LCV response : ", response);
      }
      console.log("Voucher response is :", response);
      if(response.length!=undefined){
          if(response.length===1 && response[0].hasOwnProperty("Exception")){
              dispatch(storeVoucherError(response[0].Exception));
          } else {
            dispatch(storeVoucherData(response));
          }
      }
       else if(response.length===undefined || response.length===0 || response ===null || response===undefined){
          dispatch(storeVoucherError(UNDEFINED_MESSAGE));
    }
    }
    else{
        return alert(NO_INTERNET);
    }
  };
};

export const usVoucherSubmitAction = (loginId, authKey, docNo, escalatedTo, remarks, action, selectStatus) => {
  // console.log("111111")
  return async dispatch => {
    let isNetwork = await netInfo();
    if (isNetwork) {
      // console.log("222222",docNo,"\n", loginId,"\n", escalatedTo,"\n", remarks,"\n", action,"\n", selectStatus)
      dispatch(voucherLoading());
      let expenseId = docNo;
      let dataObj = {
        "ExpenseId" : expenseId,
        "LoginUser" : loginId,
        "escalatedto": escalatedTo,
        "Remarks" : remarks,
        "Action" : action,
        "StrUserInput" : selectStatus
      }
      // let dataToPost = this.createJson(expenseId, loginId, escalatedTo, remarks, action, selectStatus);
      // console.log("333333",dataObj)
      let url = properties.usVoucherActionUrl;
      let form = new FormData();
      form.append("ECSerp", loginId);
      form.append("AuthKey", authKey);
      form.append("Data", JSON.stringify(dataObj));
      let response =  await fetchPOSTMethod(url, form);
      // console.log("US voucher SUBMIT action response from server is : " ,response);
      try {
        if(response.length!=undefined){
            if(response.length===1 && response[0].hasOwnProperty("Exception")){
                dispatch(storeVoucherError(response[0].Exception))
            }else if(response[0].msgTxt === "Success"){
                dispatch(usSubmitActionSuccess(response[0].msgTxt));
            }
        }
      } catch (error) {
          if(response.length===undefined || response.length===0 || response ===null || response===undefined){
            dispatch(storeVoucherError(UNDEFINED_MESSAGE));
          }
      }
    } else {
      return alert(NO_INTERNET);
    }
  }
}

createJson = (expenseId, loginId, escalatedTo, remarks, action, selectStatus) => {
  // console.log("444444")
  return {
    "ExpenseId" : expenseId,
    "LoginUser" : loginId,
    "escalatedto": escalatedTo,
    "Remarks" : remarks,
    "Action" : action,
    "StrUserInput" : selectStatus
  }
}

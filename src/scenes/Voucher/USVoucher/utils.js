import { netInfo } from "../../../utilities/NetworkInfo";
import properties from "../../../resource/properties";
import { fetchPOSTMethod } from "../../../utilities/fetchService";
import { connect } from "react-redux";
let globalConstants = require("../../../GlobalConstants")
import { AppStore } from '../../../../AppStore';
import { RecyclerViewBackedScrollViewBase } from "react-native";
import { usAdditionalDetails } from "../createVoucher/cvUtility";
import _ from "lodash"


 export const getExpenseTypes = async(catID)=>{ //can be used from empDetails
    let isNetwork = await netInfo();
    if (isNetwork) {
      let formData = new FormData();
      const loginData = AppStore.getState().loginReducer.loginData;
      formData.append("ECSerp",  loginData.SmCode);
      formData.append("AuthKey", loginData.Authkey);
      formData.append("categoryId", catID)
      let url = properties.getUSExpenseTypes;
      let response = await fetchPOSTMethod(url, formData);  
      console.log("Us Voucher ExpenseType Response is :",response)
      if(response && response.length != undefined){
        if (response.length === 1 && response[0].hasOwnProperty("Exception")) {
          throw response[0].Exception;
        } else {
          return response;
        }
      }else{
        throw(globalConstants.UNDEFINED_MESSAGE)
      }
    } else {
      throw(globalConstants.NO_INTERNET)
    }
}

export const searchSupervisors = async(supervisorText,docNo)=>{
  let isNetwork = await netInfo();
  if (isNetwork) {
    let formData = new FormData();
    const loginData = AppStore.getState().loginReducer.loginData;
    formData.append("ECSerp",  loginData.SmCode);
    formData.append("AuthKey", loginData.Authkey);
    formData.append("DocNo", docNo);
    formData.append("SearchText", supervisorText)
    let url = properties.cvSupervisorSearchUrl;
    let response = await fetchPOSTMethod(url, formData);  
    console.log("Project supervisors are =======>",response)
    if (response.length != undefined) {
      if (response.length === 1 && response[0].hasOwnProperty("Exception")) {
        return response[0].Exception;
      } else {
        return response.slice(0,5);
      }
    } else if (response.length === undefined || response.length === 0 || response === null || response === undefined) {
      throw(globalConstants.UNDEFINED_MESSAGE)
    }
  } else {
    throw(globalConstants.NO_INTERNET)
  }
}

export const uploadData = async(expenseData,projectData,empDetailsData,remarks,submitType,documentNumber,fileData,isEdit,superVisorCode,catID,balanceKitty,balanceReimburesement,usData,expenseType)=>{
  let isNetwork = await netInfo();
  let forwardTo = (superVisorCode!==undefined && superVisorCode!=="") ? "S" : "F"
  let docTypeValue="";
  let expenseTypeObject = expenseType
  console.log("CAT ID : ", catID);
  console.log("US Additional data : ", usData);
  console.log("Expense data : ", expenseData);
  console.log("Expense Type : ", expenseTypeObject);
  switch(catID){
    case  "12" :
      docTypeValue = "REL";
      break;
    case  "11" :
      docTypeValue = "TRV";
      break;
    case "13" :
      docTypeValue = "OTH";
      break;
  }
  if (isNetwork) {
    console.log("Balance Kitty : ", balanceKitty)
    console.log("Reimburement balance : ", balanceReimburesement)
    let formData = new FormData();
    let lcvFrom = "", lcvTo = "", lcvUsMode = "", lcvKM = "", lcvDesc = "", journeyFromDate = "" , journeyToDate = "", memoDate = "",
    destFrom = "", destTo = "", modeOfTravel = "", usLocation = "", carrier = "", hotelName = "", particulars = "", usTypeVal = "", guest = "", validTill = "";
    if (expenseTypeObject.ID == 1) {
      memoDate = expenseData.date
      journeyFromDate = expenseData.startDate
      journeyToDate = expenseData.endDate
      destFrom = expenseData.from
      destTo = expenseData.to
      modeOfTravel = expenseData.modeOfConveyanceObj.ID
      carrier = expenseData.carrier
    } else if (expenseTypeObject.ID == 2 || expenseTypeObject.ID == 7) {
      journeyFromDate = expenseData.startDate
      journeyToDate = expenseData.endDate
      hotelName = expenseData.hotel
      usLocation = expenseData.location //
    } else if (expenseTypeObject.ID == 3) {
      memoDate = expenseData.date
      lcvFrom = expenseData.from
      lcvTo = expenseData.to
      lcvUsMode = expenseData.modeOfConveyanceObj.ID
      lcvKM = expenseData.miles
      particulars = expenseData.description
    } else if (expenseTypeObject.ID == 4) {
      memoDate = expenseData.date
      particulars = expenseData.description
      usTypeVal = expenseData.type
    } else if (expenseTypeObject.ID == 5) {
      memoDate = expenseData.date
      particulars = expenseData.description
    } else if (expenseTypeObject.ID == 6 || expenseTypeObject.ID == 8 || expenseTypeObject.ID == 9 || expenseTypeObject.ID == 12) {
      memoDate = expenseData.date
      particulars = expenseData.description
      usTypeVal = expenseData.meal.ID
    } else if (expenseTypeObject.ID == 10) {
      memoDate = expenseData.date
      particulars = expenseData.description
      usTypeVal = expenseData.meal.ID
      guest = expenseData.guest
    } else if (expenseTypeObject.ID == 11) {
      memoDate = expenseData.date
      particulars = expenseData.description
      usTypeVal = expenseData.meal.ID
      validTill = expenseData.validTill
    }
    const loginData = AppStore.getState().loginReducer.loginData;
    console.log("Login data: ", loginData)
    formData.append("ECSerp",  loginData.SmCode);
    formData.append("AuthKey", loginData.Authkey);
    formData.append("Type", 19); 
    formData.append("DocNo", documentNumber)
    formData.append("EmpCode", loginData.SmCode)
    formData.append("DocType", docTypeValue)
    formData.append("DocStartDate", empDetailsData.DocDate)
    formData.append("DocEndDate", empDetailsData.DocDate)
    formData.append("PACode", empDetailsData.PA)
    formData.append("PSACode", empDetailsData.PSA)
    formData.append("CompanyCode", empDetailsData.CO_CODE)
    formData.append("OUCode", empDetailsData.OU)
    formData.append("CostcenterCode", projectData.CCCode)
    formData.append("CostcenterText", projectData.CCText)
    formData.append("NCostcenterCode", projectData.CCCode)
    formData.append("NCostcenterText", projectData.CCText)
    // formData.append("CategoryCode", catID)// For Mobile
    formData.append("vc_Currency", expenseData ?  expenseData.currency.ID : "")
    formData.append("Currency", empDetailsData.CURRENCY)
    formData.append("Remarks", remarks)
    formData.append("TotalApprovedAmt", expenseData!==undefined ?  expenseData.amount : "") //total of line item
    formData.append("ProjectCode", projectData.ProjectCode) //line item input
    formData.append("NProjectCode", projectData.ProjectCode) //line item input
    formData.append("PlanCode", empDetailsData.PLAN1)
    formData.append("VoucherType", 'Others') // Need to confirm
    formData.append("MemoNo", "")
    formData.append("MemoDate", memoDate)
    formData.append("Amount", expenseData!==undefined ? expenseData.amount : "")

    // US voucher new fields
    formData.append("TripName", usData.relocationFromToValue)
    formData.append("Billable", usData.billableToClientIdValue)
    formData.append("AccompaniedBy", usData.accompaniedByValue)
    formData.append("TravelType", usData.transferTypeValue=="Domestic"? 1:2)
    formData.append("ClientName", usData.clientIdId) //pass client id here
    formData.append("ContractId", usData.contractIdValue)
    formData.append("UsPurpose", usData.purposeValue) 
    formData.append("TypeofExpense", expenseTypeObject.ID)
    formData.append("ExpenseProofAttached",expenseData && expenseData.sAtCheck ? 1: 0)
    formData.append("PayReceiptAttached",expenseData &&  expenseData.rAtCheck ? 1: 0)
    formData.append("PayType",expenseData ? expenseData.payType.ID : "") 
    formData.append("UsAmount",expenseData ? expenseData.amountInput : "")
    formData.append("ExchRate",expenseData ? expenseData.rate : "")
    formData.append("AmountInDollar",expenseData ?  expenseData.amount : "")
    formData.append("LCVFrom", lcvFrom)
    formData.append("LCVTo", lcvTo)
    formData.append("LCVUsMode", lcvUsMode)
    formData.append("LCVKM", lcvKM)
    formData.append("Particulars", particulars) // For mohit
    formData.append("JourneyFromDate", journeyFromDate)
    formData.append("JourneyToDate", journeyToDate)
    formData.append("DestFrom", destFrom)   // For mohit
    formData.append("DestTo", destTo)  // For mohit
    formData.append("ModeOfTravel", modeOfTravel)
    formData.append("HotelName", hotelName)  // For mohit
    formData.append("Guest", guest)
    formData.append("ValidTill", validTill)
    formData.append("Carrier", carrier)  // for travel
    formData.append("UsLocation", usLocation)

    // formData.append("ApprovingAuth", "")  // not applicable confirmed by Nirmod
    formData.append("UsType",usTypeVal);
    //.... US voucher new fields ends here ....

    formData.append("ApprovedAmt",expenseData!==undefined ? expenseData.amount : "")
    formData.append("CostCode", projectData.CCCode)
    formData.append("ProjCode", projectData.ProjectCode)
    formData.append("IsActive", 1)
    formData.append("CreatedBy", loginData.SmCode)
    formData.append("ModifiedBy", loginData.SmCode)
    formData.append("IsSubmitBySM", submitType) //0-save,1-submit
    formData.append("LoginEmpCode", loginData.SmCode)
    formData.append("EmpFrom", loginData.SmCode)
    formData.append("Category", catID) // CategoryId for mobile Data.
    formData.append("FromStatus", submitType) //IsSubmitBySM 1 than 1 else status value 0
    formData.append("LineItemId", !isEdit ? "" : fileData!==undefined ? fileData.RowId : "" ) // rowId of getLineItem service response
    formData.append("ChildName", "")
    formData.append("Childbdate", "")
    formData.append("ClaimFor", "")
    formData.append("InvestmentPlan", "")
    formData.append("FirstClaimTill", "")
    formData.append("SecondClaimTill", "")
    formData.append("WeddingDate", "")
    formData.append("CategoryCode", empDetailsData.DIS.charAt(0))
    formData.append("Purpose","")
    formData.append("PurposeText","")
    formData.append("TelNo","")
    formData.append("Status", submitType==0 ? 0 : (submitType==1 && forwardTo=="S") ? 2 : 3) // please check the condition in service document
    formData.append("ForwordTo",submitType==0 ? "" : forwardTo) // please check the condition in service document
    formData.append("EmpTo", submitType==0 ? loginData.SmCode : (submitType==1 && forwardTo=="S") ? superVisorCode : "") // please check the condition in service document
    formData.append("PendingWith", submitType==0 ? loginData.SmCode : (submitType==1 && forwardTo=="S") ? superVisorCode : "") // please check the condition in service document
    let url = properties.cvSaveAndSubmitUrl;
    let response = await fetchPOSTMethod(url, formData);  
    console.log("mobile upload response=======>",response)
    console.log("Form data to upload :", formData);
    if (response !== undefined) {
          return response;
    } else if (response.length === undefined || response.length === 0 || response === null || response === undefined) {
      throw(globalConstants.UNDEFINED_MESSAGE)
    }
  } else {
    throw(globalConstants.NO_INTERNET)
  }
}

export const getLineItems = async(docNumber)=>{
  let isNetwork = await netInfo();
  if (isNetwork) {
    console.log("docNumber: ", docNumber)
    let formData = new FormData();
    const loginData = AppStore.getState().loginReducer.loginData;
    formData.append("ECSerp",  loginData.SmCode);
    formData.append("AuthKey", loginData.Authkey);
    formData.append("DocNo", docNumber); 
    let url = properties.cvGetLineItemDataUrl;
    let response = await fetchPOSTMethod(url, formData);  
    console.log("mobile line item response =======>",response)
    if (response!==undefined) {
          return response;
    } else if (response.length === undefined || response.length === 0 || response === null || response === undefined) {
      throw(globalConstants.UNDEFINED_MESSAGE)
    }
  } else {
    throw(globalConstants.NO_INTERNET)
  }
}

export const removeVoucher = async(docNumber)=>{
  let isNetwork = await netInfo();
  if (isNetwork) {
    console.log("Voucher number to delete is : ", docNumber)
    let formData = new FormData();
    const loginData = AppStore.getState().loginReducer.loginData;
    formData.append("ECSerp",  loginData.SmCode);
    formData.append("AuthKey", loginData.Authkey);
    formData.append("DocNo", docNumber); 
    let url = properties.cvDeleteVoucherUrl;
    let response = await fetchPOSTMethod(url, formData);
    console.log("Voucher delete response =======>",response)
    if (response !== undefined) {
      return response;
    } else if (response.length === undefined || response.length === 0 || response === null || response === undefined) {
      throw(globalConstants.UNDEFINED_MESSAGE)
    }
  } else {
    throw(globalConstants.NO_INTERNET)
  }
}

export const deleteFile = async(fileId)=>{
  let isNetwork = await netInfo();
  if (isNetwork) {
    console.log("File id to delete is : ", fileId)
    let formData = new FormData();
    const loginData = AppStore.getState().loginReducer.loginData;
    formData.append("ECSerp",  loginData.SmCode);
    formData.append("AuthKey", loginData.Authkey);
    formData.append("ItemId", fileId); 
    let url = properties.cvDeleteLineItemUrl;
    let response = await fetchPOSTMethod(url, formData);
    console.log("mobile line item delete response =======>",response)
    if (response !== undefined) {
      return response;
    } else if (response.length === undefined || response.length === 0 || response === null || response === undefined) {
      throw(globalConstants.UNDEFINED_MESSAGE)
    }
  } else {
    throw(globalConstants.NO_INTERNET)
  }
}

export const fetchLCVModeRate = async (docDate, categoryId)=>{
  let isNetwork = await netInfo();
  if (isNetwork) {
    let vouType = ""
    if (categoryId == 11) {
      vouType = 1
    } else if (categoryId == 12) {
      vouType = 2
    } else if (categoryId == 13) {
      vouType = 3
    }
    console.log("doc data is : ", docDate, vouType)
    let formData = new FormData();
    const loginData = AppStore.getState().loginReducer.loginData;
    formData.append("ECSerp",  loginData.SmCode);
    formData.append("AuthKey", loginData.Authkey);
    formData.append("lcvDocDate", docDate);
    formData.append("vouType", vouType)
    let url = properties.getUSLCVModeRate;
    let response = await fetchPOSTMethod(url, formData);
    console.log("lcv mode rate response =======>",response)
    if (response !== undefined) {
      return response;
    } else if (response.length === undefined || response.length === 0 || response === null || response === undefined) {
      throw(globalConstants.UNDEFINED_MESSAGE)
    }
  } else {
    throw(globalConstants.NO_INTERNET)
  }
}

export const validateDetails = async(documentNumber,empData,projData,expData,fileToEdit,catID)=>{
  let isNetwork = await netInfo();
  let typeVal = catID==6 ? 4 : 5;
  if (isNetwork) {
    console.log("docNumber: ", documentNumber)
    console.log("empData: ", empData)
    console.log("projData: ", projData)
    console.log("expData: ", expData)
    let formData = new FormData();
    const loginData = AppStore.getState().loginReducer.loginData;
    formData.append("ECSerp",  loginData.SmCode);
    formData.append("AuthKey", loginData.Authkey);
    formData.append("EmpCode",  loginData.SmCode);
    formData.append("Type", typeVal);
    formData.append("CatId", catID); 
    formData.append("DocType", 'MBL');
    formData.append("CompanyCode", empData.CO_CODE);
    formData.append("ClaimDate", expData.date); 
    formData.append("ProjectCode", projData.ProjectCode); 
    formData.append("CostCode", projData.CCCode); 
    formData.append("VoucherType", catID);
    formData.append("MemoNo", expData.billNumber);
    formData.append("LineItemId", fileToEdit!==undefined ? fileToEdit.RowId : 0 )// in case of creation it is blank otherwise filled with file data of cvLineItemArray.
    formData.append("DocumentNo", documentNumber); 
    formData.append("Purpose", "");// from the textbox;

    let url = properties.cvValidationUrl;
    let response = await fetchPOSTMethod(url, formData);  
    console.log("Validation response is =======>",response)
    if (response!==undefined) {
          return response;
    } else if (response.length === undefined || response.length === 0 || response === null || response === undefined) {
      throw(globalConstants.UNDEFINED_MESSAGE)
    }
  } else {
    throw(globalConstants.NO_INTERNET)
  }
}

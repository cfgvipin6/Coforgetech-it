import { netInfo } from '../../../utilities/NetworkInfo';
import properties from '../../../resource/properties';
import { fetchPOSTMethod } from '../../../utilities/fetchService';
import { connect } from 'react-redux';
let globalConstants = require('../../../GlobalConstants');
import { AppStore } from '../../../../AppStore';
import { RecyclerViewBackedScrollViewBase } from 'react-native';

export const searchSupervisors = async(supervisorText,docNo)=>{
  let isNetwork = await netInfo();
  if (isNetwork) {
    let formData = new FormData();
    const loginData = AppStore.getState().loginReducer.loginData;
    formData.append('ECSerp',  loginData.SmCode);
    formData.append('AuthKey', loginData.Authkey);
    formData.append('DocNo', docNo);
    formData.append('SearchText', supervisorText);
    let url = properties.cvSupervisorSearchUrl;
    let response = await fetchPOSTMethod(url, formData);
    console.log('Create supervisor search result : ', response);
    console.log('Project supervisors are =======>',response);

    if (response.length != undefined) {
      if (response.length === 1 && response[0].hasOwnProperty('Exception')) {
        return response[0].Exception;
      } else {
        return response.slice(0,5);
      }
    } else if (response.length === undefined || response.length === 0 || response === null || response === undefined) {
      throw (globalConstants.UNDEFINED_MESSAGE);
    }
  } else {
    throw (globalConstants.NO_INTERNET);
  }
};

export const uploadData = async(expenseData,projectData,empDetailsData,remarks,submitType,documentNumber,fileData,isEdit,superVisorCode,catID,balanceKitty,balanceReimburesement)=>{
  let isNetwork = await netInfo();
  let forwardTo = (superVisorCode !== undefined && superVisorCode !== '') ? 'S' : 'F';
  let docTypeValue = '';
  console.log('CAT ID : ', catID);
  switch (catID){
    case  '6' :
      docTypeValue = 'MBL';
      break;
    case  '5' :
      docTypeValue = 'PET';
      break;
    case '4' :
      docTypeValue = 'DRV';
      break;
    case '7' :
        docTypeValue = 'MED';
        break;
  }
  if (isNetwork) {

    // console.log("expense data: ", expenseData)
    console.log('PROJ_DATA_TESTING: ', projectData);
    // console.log("empData: ", empDetailsData)
    // console.log("Remarks: ", remarks)
    // console.log("submitType: ", submitType)
    // console.log("documentNumber: ", documentNumber)
    // console.log("fileData: ", fileData)
    // console.log("isEdit: ", isEdit)
    // console.log("superVisorCode: ", superVisorCode)
    console.log('Balance Kitty : ', balanceKitty);
    console.log('Reimburement balance : ', balanceReimburesement);

    let formData = new FormData();
    const loginData = AppStore.getState().loginReducer.loginData;
    console.log('Login data: ', loginData);
    formData.append('ECSerp',  loginData.SmCode);
    formData.append('AuthKey', loginData.Authkey);
    formData.append('Type', 1); // For mobile,driver, petrol
    formData.append('DocNo', documentNumber);
    formData.append('EmpCode', loginData.SmCode);
    formData.append('DocType', docTypeValue); // MBL for mobile.
    formData.append('DocStartDate', empDetailsData.DocDate);
    formData.append('DocEndDate', empDetailsData.DocDate);
    formData.append('PACode', empDetailsData.PA);
    formData.append('PSACode', empDetailsData.PSA);
    formData.append('CompanyCode', empDetailsData.CO_CODE);
    formData.append('OUCode', empDetailsData.OU);
    formData.append('CostcenterCode', projectData.CCCode);
    formData.append('CostcenterText', projectData.CCText);
    formData.append('NCostcenterCode', projectData.CCCode);
    formData.append('NCostcenterText', projectData.CCText);
    // formData.append("CategoryCode", catID)// For Mobile
    formData.append('Currency', 'INR');
    formData.append('Remarks', remarks);
    formData.append('TotalApprovedAmt', expenseData !== undefined ?  expenseData.amount : ''); //total of line item
    formData.append('ProjectCode', projectData.ProjectCode); //line item input
    formData.append('NProjectCode', projectData.ProjectCode); //line item input
    formData.append('PlanCode', empDetailsData.PLAN1);
    formData.append('VoucherType', 'Others'); // Need to confirm
    formData.append('MemoNo', expenseData !== undefined ? expenseData.billNumber : '');
    formData.append('MemoDate',expenseData !== undefined ? expenseData.date : '');
    formData.append('Particulars', expenseData !== undefined ? expenseData.particulars : '');
    formData.append('Amount', expenseData !== undefined ? expenseData.amount : '');

    if (catID == 7){
      formData.append('MedDoctor', expenseData !== undefined ? expenseData.particulars : '');
      formData.append('MedPatientname', loginData.SmFirstname + ' ' + loginData.SmLastName);
      formData.append('MedRelation', 'Self');
    }

    if (catID == 6){
      console.log('MobileBalanceKitty', balanceKitty);
      console.log('MobileReimbursement', balanceReimburesement);

      formData.append('MobileBalanceKitty',balanceKitty);
      formData.append('MobileReimbursement', balanceReimburesement);
    }

    formData.append('ApprovedAmt',expenseData !== undefined ? expenseData.amount : '');
    formData.append('CostCode', projectData.CCCode);
    formData.append('ProjCode', projectData.ProjectCode);
    formData.append('IsActive', 1);
    formData.append('CreatedBy', loginData.SmCode);
    formData.append('ModifiedBy', loginData.SmCode);
    formData.append('IsSubmitBySM', submitType); //0-save,1-submit
    formData.append('LoginEmpCode', loginData.SmCode);
    formData.append('EmpFrom', loginData.SmCode);
    formData.append('Category', catID); // CategoryId for mobile Data.
    formData.append('FromStatus', submitType); //IsSubmitBySM 1 than 1 else status value 0
    formData.append('LineItemId', !isEdit ? '' : fileData !== undefined ? fileData.RowId : '' ); // rowId of getLineItem service response
    formData.append('ChildName', '');
    formData.append('Childbdate', '');
    formData.append('ClaimFor', '');
    formData.append('InvestmentPlan', '');
    formData.append('FirstClaimTill', '');
    formData.append('SecondClaimTill', '');
    formData.append('WeddingDate', '');
    formData.append('CategoryCode', empDetailsData.DIS.charAt(0));
    formData.append('Purpose', expenseData !== undefined && expenseData.purpose.ID != null ? expenseData.purpose.ID : '');
    formData.append('PurposeText', expenseData !== undefined  && expenseData.purpose.DisplayText != null ?  expenseData.purpose.DisplayText : '');
    formData.append('TelNo', expenseData !== undefined ? expenseData.phoneNumber : '');
    formData.append('Status', submitType == 0 ? 0 : (submitType == 1 && forwardTo == 'S') ? 2 : 3); // please check the condition in service document
    formData.append('ForwordTo',submitType == 0 ? '' : forwardTo); // please check the condition in service document
    formData.append('EmpTo', submitType == 0 ? loginData.SmCode : (submitType == 1 && forwardTo == 'S') ? superVisorCode : ''); // please check the condition in service document
    formData.append('PendingWith', submitType == 0 ? loginData.SmCode : (submitType == 1 && forwardTo == 'S') ? superVisorCode : ''); // please check the condition in service document
    let url = properties.cvSaveAndSubmitUrl;
    let response = await fetchPOSTMethod(url, formData);
    console.log('mobile upload response=======>',response);
    if (response && response.status !== undefined){
      return response;
    } else if (response[0] && response[0].hasOwnProperty('Exception')){
      console.log('Throwing exception', response[0].Exception);
          throw response[0].Exception;
    }
     else {
      throw (globalConstants.UNDEFINED_MESSAGE);
    }
  } else {
    throw (globalConstants.NO_INTERNET);
  }
};

export const getLineItems = async(docNumber)=>{
  let isNetwork = await netInfo();
  if (isNetwork) {
    console.log('docNumber: ', docNumber);
    let formData = new FormData();
    const loginData = AppStore.getState().loginReducer.loginData;
    formData.append('ECSerp',  loginData.SmCode);
    formData.append('AuthKey', loginData.Authkey);
    formData.append('DocNo', docNumber);
    let url = properties.cvGetLineItemDataUrl;
    let response = await fetchPOSTMethod(url, formData);
    console.log('mobile line item response =======>',response);
    if (response !== undefined) {
          return response;
    } else if (response.length === undefined || response.length === 0 || response === null || response === undefined) {
      throw (globalConstants.UNDEFINED_MESSAGE);
    }
  } else {
    throw (globalConstants.NO_INTERNET);
  }
};

export const removeVoucher = async(docNumber)=>{
  let isNetwork = await netInfo();
  if (isNetwork) {
    console.log('Voucher number to delete is : ', docNumber);
    let formData = new FormData();
    const loginData = AppStore.getState().loginReducer.loginData;
    formData.append('ECSerp',  loginData.SmCode);
    formData.append('AuthKey', loginData.Authkey);
    formData.append('DocNo', docNumber);
    let url = properties.cvDeleteVoucherUrl;
    let response = await fetchPOSTMethod(url, formData);
    console.log('Voucher delete response =======>',response);
    if (response && response.status !== undefined) {
          return response;
    } else if (response.length === undefined || response.length === 0 || response === null || response === undefined) {
      throw (globalConstants.UNDEFINED_MESSAGE);
    }
  } else {
    throw (globalConstants.NO_INTERNET);
  }
};

export const deleteFile = async(fileId)=>{
  let isNetwork = await netInfo();
  if (isNetwork) {
    console.log('File id to delete is : ', fileId);
    let formData = new FormData();
    const loginData = AppStore.getState().loginReducer.loginData;
    formData.append('ECSerp',  loginData.SmCode);
    formData.append('AuthKey', loginData.Authkey);
    formData.append('ItemId', fileId);
    let url = properties.cvDeleteLineItemUrl;
    let response = await fetchPOSTMethod(url, formData);
    console.log('mobile line item response =======>',response);
    if (response && response.status !== undefined) {
          return response;
    } else if (response.length === undefined || response.length === 0 || response === null || response === undefined) {
      throw (globalConstants.UNDEFINED_MESSAGE);
    }
  } else {
    throw (globalConstants.NO_INTERNET);
  }
};

export const validateDetails = async(documentNumber,empData,projData,expData,fileToEdit,catID)=>{
  let isNetwork = await netInfo();
  let typeVal = catID == 6 ? 4 : 5;
  let claimAmount = catID == 4 ? expData.amount : 0;
  if (isNetwork) {
    console.log('docNumber: ', documentNumber);
    console.log('empData: ', empData);
    console.log('projData: ', projData);
    console.log('expData: ', expData);
    let formData = new FormData();
    const loginData = AppStore.getState().loginReducer.loginData;
    formData.append('ECSerp',  loginData.SmCode);
    formData.append('AuthKey', loginData.Authkey);
    formData.append('EmpCode',  loginData.SmCode);
    formData.append('Type', typeVal);
    formData.append('CatId', catID);
    formData.append('DocType', 'MBL');
    formData.append('CompanyCode', empData.CO_CODE);
    formData.append('ClaimDate', expData.date);
    formData.append('ClaimAmount', claimAmount);
    formData.append('ProjectCode', projData.ProjectCode);
    formData.append('CostCode', projData.CCCode);
    formData.append('VoucherType', catID);
    formData.append('MemoNo', expData.billNumber);
    formData.append('LineItemId', fileToEdit !== undefined ? fileToEdit.RowId : 0 );// in case of creation it is blank otherwise filled with file data of cvLineItemArray.
    formData.append('DocumentNo', documentNumber);
    formData.append('Purpose', expData.purpose.ID == null ? '' :  expData.purpose.ID);

    let url = properties.cvValidationUrl;
    let response = await fetchPOSTMethod(url, formData);
    console.log('Validation response is =======>',response);
    if (response !== undefined) {
          return response;
    } else if (response.length === undefined || response.length === 0 || response === null || response === undefined) {
      throw (globalConstants.UNDEFINED_MESSAGE);
    }
  } else {
    throw (globalConstants.NO_INTERNET);
  }
};

export const fetchBalance = async(url,catID)=>{
  let isNetwork = await netInfo();
  if (isNetwork) {
    let formData = new FormData();
    const loginData = AppStore.getState().loginReducer.loginData;
    formData.append('ECSerp',  loginData.SmCode);
    formData.append('AuthKey', loginData.Authkey);
    formData.append('EmpCode', loginData.SmCode);
    let response = await fetchPOSTMethod(url, formData);
    console.log('Balance response is =======>',response);
    if (response !== undefined) {
          switch (catID){
            case '6':
            return response.MobileBalanceKitty + ':' + response.MobileReimbursement + ':' + response.IsDataCard;
            break;
            case '5':
            return response.PetBalance;
            break;
            case '4':
            return response.DrvBalance;
            break;
            case '7':
            return response.MedBalance;
            break;
          }

    } else if (response.length === undefined || response.length === 0 || response === null || response === undefined) {
      throw (globalConstants.UNDEFINED_MESSAGE);
    }
  } else {
    throw (globalConstants.NO_INTERNET);
  }
};

export const fetchBalanceData = async(url,catID)=>{
  let isNetwork = await netInfo();
  if (isNetwork) {
    let formData = new FormData();
    const loginData = AppStore.getState().loginReducer.loginData;
    formData.append('ECSerp',  loginData.SmCode);
    formData.append('AuthKey', loginData.Authkey);
    formData.append('EmpCode', loginData.SmCode);
    let response = await fetchPOSTMethod(url, formData);
    console.log('Balance response is =======>',response);
    if (response !== undefined) {
          return response;

    } else if (response.length === undefined || response.length === 0 || response === null || response === undefined) {
      throw (globalConstants.UNDEFINED_MESSAGE);
    }
  } else {
    throw (globalConstants.NO_INTERNET);
  }
};

export const fetchProjectList = async (compCode, costCenterCode) => {
    let isNetwork = await netInfo();
    if (isNetwork) {
      let formData = new FormData();
      const loginData = AppStore.getState().loginReducer.loginData;
      formData.append('ECSerp', loginData.SmCode);
      formData.append('AuthKey', loginData.Authkey);
      formData.append('companyCode', compCode);
      formData.append('costCenterCode', costCenterCode);
      let url = properties.fetchProjectListUrl;
      let myResponse = await fetchPOSTMethod(url, formData);
      let response = Array.isArray(myResponse) ? myResponse : [myResponse];
      // response = [{StatusCode: 500, Exception: "Error occurred while accessing data in DataAccessCommonServices.GetDataSetByProc()"}]
      console.log('project list response=======>',response);
      if (response.length != undefined) {
        if (response.length === 1 && response[0].hasOwnProperty('Exception')) {
          throw response[0].Exception;
        } else {
          return response;
        }
      } else if (response.length === undefined || response.length === 0 || response === null || response === undefined) {
        throw (globalConstants.UNDEFINED_MESSAGE);
      }
    } else {
      throw (globalConstants.NO_INTERNET);
    }
};

export const fetchCreateModifyStopData = async (categoryId) => {
  let isNetwork = await netInfo();
  if (isNetwork) {
    let formData = new FormData();
    const loginData = AppStore.getState().loginReducer.loginData;
    formData.append('ECSerp', loginData.SmCode);
    formData.append('AuthKey', loginData.Authkey);
    formData.append('Category', categoryId);
    let url = properties.fetchCreateModifyStop;
    let myResponse = await fetchPOSTMethod(url, formData);
    let response = Array.isArray(myResponse) ? myResponse : [myResponse];
    console.log('stop modify response=======>',response);
    if (response.length > 0) {
      if (response.length === 1 && response[0].hasOwnProperty('Exception')) {
        throw response[0].Exception;
      } else {
        return response;
      }
    } else if (response.length === undefined || response.length === 0 || response === null || response === undefined) {
      throw (globalConstants.UNDEFINED_MESSAGE);
    }
  } else {
    throw (globalConstants.NO_INTERNET);
  }
};

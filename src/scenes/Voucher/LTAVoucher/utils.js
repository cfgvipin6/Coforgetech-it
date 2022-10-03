import { netInfo } from '../../../utilities/NetworkInfo';
import properties from '../../../resource/properties';
import { fetchPOSTMethod } from '../../../utilities/fetchService';
import { connect } from 'react-redux';
let globalConstants = require('../../../GlobalConstants');
import moment from 'moment';
import { AppStore } from '../../../../AppStore';
import { RecyclerViewBackedScrollViewBase } from 'react-native';
import { getDependents } from './ltaDependents/ltaDependents';
let relations = '';
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

const getRelations = (dependents) => {

  let filterArray = dependents.filter((data)=>data.IsChecked);
  console.log('Filtered Array : ', filterArray);
  filterArray.map((element,index) => {
    relations = relations.concat(element.Name);
    if (index < filterArray.length - 1){
      relations = relations.concat('~');
      console.log('Concating relation : ', relations);
    }
  });
  console.log('Relations found : ', relations);
  return relations;
};

export const uploadData = async(projectData,empDetailsData,remarks,submitType,documentNumber,withoutBill,isEdit,superVisorCode,catID,ltaExpense,ltaCost,ltaDependents)=>{
  let isNetwork = await netInfo();
  let forwardTo = (superVisorCode !== undefined && superVisorCode !== '') ? 'S' : 'F';
  console.log('CAT ID : ', catID);
  console.log('Project Data : ', projectData);
  console.log('EmpDetail Data : ', empDetailsData);
  console.log('Remarks Data : ', remarks);
  console.log('LTA Expense : ', ltaExpense);
  console.log('LTA Cost  : ', ltaCost);
  console.log('LTA Members : ', ltaDependents);
  if (isNetwork) {

    console.log('projectData: ', projectData);
    console.log('empData: ', empDetailsData);
    console.log('Remarks: ', remarks);
    console.log('submitType: ', submitType);
    console.log('documentNumber: ', documentNumber);
    console.log('isEdit: ', isEdit);
    console.log('superVisorCode: ', superVisorCode);

    let formData = new FormData();
    const loginData = AppStore.getState().loginReducer.loginData;
    console.log('Login data: ', loginData);
    formData.append('ECSerp',  loginData.SmCode);
    formData.append('AuthKey', loginData.Authkey);
    formData.append('Type', 17);
    formData.append('DocNo', documentNumber);
    formData.append('EmpCode', loginData.SmCode);
    formData.append('DocType', 'LTA');
    formData.append('DocStartDate', withoutBill == 0 ? empDetailsData.DocDate : moment(new Date()).format('DD-MM-YY HH:MM:SS'));
    formData.append('DocEndDate',withoutBill == 0 ?  empDetailsData.DocDate :  moment(new Date()).format('DD-MM-YY HH:MM:SS'));
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
    formData.append('VisitingPlace',withoutBill == 0 ? ltaExpense.placesVisited : '');
    formData.append('TicketCost',withoutBill == 0 ? parseInt(ltaCost.actualMajorCost) : '');
    formData.append('ModeOfTravel',withoutBill == 0 ? ltaDependents.mode : '');//
    formData.append('MinorTicketCost', withoutBill == 0 ? parseInt(ltaCost.actualMinorCost) : '');
    formData.append('TotalMinorPersons', withoutBill == 0 ? ltaCost.minorPersons : '');
    formData.append('TotalMajorPersons', withoutBill == 0 ? ltaCost.majorPersons : '');
    formData.append('ActualTotalMajorAmt', withoutBill == 0 ? ltaCost.majorCost : '');
    formData.append('ActualTotalMinorAmt',withoutBill == 0 ? ltaCost.minorCost : '');
    formData.append('Relations',withoutBill == 0 ? getRelations(ltaDependents.dependents) : '');

    formData.append('NOP',withoutBill == 0 ? ltaDependents.dependents.filter((item) => item.IsChecked).length + 1 : '');
    formData.append('TotalApprovedAmt', ltaCost !== undefined ?  parseInt(ltaCost.totalCost) : ''); //total of line item
    formData.append('ProjectCode', projectData.ProjectCode); //line item input
    formData.append('NProjectCode', projectData.ProjectCode); //line item input
    formData.append('PlanCode', empDetailsData.PLAN1);
    formData.append('VoucherType', ''); // Need to confirm
    formData.append('IsTaxable',withoutBill == 1 ? true : false);
    formData.append('JourneyFromDate', withoutBill == 0 ? ltaExpense.fromDateValue :  moment(new Date()).format('DD-MM-YY HH:MM:SS'));
    formData.append('JourneyToDate', withoutBill == 0 ?  ltaExpense.toDateValue :  moment(new Date()).format('DD-MM-YY HH:MM:SS'));
    formData.append('MemoNo','');
    formData.append('MemoDate', '');
    formData.append('Particulars','');
    formData.append('Amount', ltaCost !== undefined ?  parseInt(ltaCost.totalCost) : '');

    formData.append('ApprovedAmt',ltaCost !== undefined ?  parseInt(ltaCost.totalCost) : '');
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
    formData.append('LineItemId','' ); // rowId of getLineItem service response
    formData.append('ChildName', '');
    formData.append('Childbdate', '');
    formData.append('ClaimFor', '');
    formData.append('InvestmentPlan', '');
    formData.append('FirstClaimTill', '');
    formData.append('SecondClaimTill', '');
    formData.append('WeddingDate', '');
    formData.append('CategoryCode', empDetailsData.DIS.charAt(0));
    formData.append('Status', submitType == 0 ? 0 : (submitType == 1 && forwardTo == 'S') ? 2 : 3); // please check the condition in service document
    formData.append('ForwordTo',submitType == 0 ? '' : forwardTo); // please check the condition in service document
    formData.append('EmpTo', submitType == 0 ? loginData.SmCode : (submitType == 1 && forwardTo == 'S') ? superVisorCode : ''); // please check the condition in service document
    formData.append('PendingWith', empDetailsData.AccountantEmpCode); // please check the condition in service document
    let url = properties.cvSaveAndSubmitUrl;
    let response = await fetchPOSTMethod(url, formData);
    console.log('mobile upload response=======>',response);
    if (response && response[0]?.hasOwnProperty('Exception')){
        return response[0].Exception;
    }
    else if (response && response.status !== undefined) {
      if (projectData?.files.length > 0){
         let fileData = new Set(projectData.files);

         console.log('File Data : ', Array.from(fileData));
         Array.from(fileData).map(async(item)=>{
          let fileForm = new FormData();
          const loginData = AppStore.getState().loginReducer.loginData;
          fileForm.append('ECSerp',  loginData.SmCode);
          fileForm.append('AuthKey', loginData.Authkey);
          fileForm.append('DocNo',response.DocumentNo);
          fileForm.append('file',item);
          let url2 = properties.uploadVoucherAttachmentLTA;
          let response2 = await fetchPOSTMethod(url2, fileForm);
          console.log('Response 2 : ', response2);
        });
       return response;
      }
      else {
        return response;
      }
    }
    else if (response.length === undefined || response.length === 0 || response === null || response === undefined) {
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
export const validateLTA = async(empData,projData,expData,catID,claimDate)=>{
  let isNetwork = await netInfo();
  if (isNetwork) {
    console.log('empData: ', empData);
    console.log('projData: ', projData);
    console.log('expData: ', expData);
    let formData = new FormData();
    const loginData = AppStore.getState().loginReducer.loginData;
    formData.append('ECSerp',  loginData.SmCode);
    formData.append('AuthKey', loginData.Authkey);
    formData.append('EmpCode',  loginData.SmCode);
    formData.append('Type', 6);
    formData.append('CatId', catID);
    formData.append('DocType', 'LTA');
    formData.append('CompanyCode', empData.CO_CODE);
    formData.append('ClaimDate', claimDate); //without bill => current date otherwise from date
    formData.append('ProjectCode', projData.ProjectCode);
    formData.append('CostCode', projData.CCCode);
    formData.append('VoucherType', catID);
    formData.append('MemoNo', '');
    formData.append('LineItemId', '');
    formData.append('DocumentNo', '');
    formData.append('Purpose', '');

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
            case '3':
            // return response.LtaBalanceLBN + ":" + response.LtaBalanceLBY;
            return response;
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

export const convertNumberToWords = (amount)=>{
  var words = new Array();
  words[0] = '';
  words[1] = 'One';
  words[2] = 'Two';
  words[3] = 'Three';
  words[4] = 'Four';
  words[5] = 'Five';
  words[6] = 'Six';
  words[7] = 'Seven';
  words[8] = 'Eight';
  words[9] = 'Nine';
  words[10] = 'Ten';
  words[11] = 'Eleven';
  words[12] = 'Twelve';
  words[13] = 'Thirteen';
  words[14] = 'Fourteen';
  words[15] = 'Fifteen';
  words[16] = 'Sixteen';
  words[17] = 'Seventeen';
  words[18] = 'Eighteen';
  words[19] = 'Nineteen';
  words[20] = 'Twenty';
  words[30] = 'Thirty';
  words[40] = 'Forty';
  words[50] = 'Fifty';
  words[60] = 'Sixty';
  words[70] = 'Seventy';
  words[80] = 'Eighty';
  words[90] = 'Ninety';
  amount = amount.toString();
  var atemp = amount.split('.');
  var number = atemp[0].split(',').join('');
  var n_length = number.length;
  var words_string = '';
  if (n_length <= 9) {
      var n_array = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
      var received_n_array = new Array();
      for (var i = 0; i < n_length; i++) {
          received_n_array[i] = number.substr(i, 1);
      }
      for (var i = 9 - n_length, j = 0; i < 9; i++, j++) {
          n_array[i] = received_n_array[j];
      }
      for (var i = 0, j = 1; i < 9; i++, j++) {
          if (i == 0 || i == 2 || i == 4 || i == 7) {
              if (n_array[i] == 1) {
                  n_array[j] = 10 + parseInt(n_array[j]);
                  n_array[i] = 0;
              }
          }
      }
      value = '';
      for (var i = 0; i < 9; i++) {
          if (i == 0 || i == 2 || i == 4 || i == 7) {
              value = n_array[i] * 10;
          } else {
              value = n_array[i];
          }
          if (value != 0) {
              words_string += words[value] + ' ';
          }
          if ((i == 1 && value != 0) || (i == 0 && value != 0 && n_array[i + 1] == 0)) {
              words_string += 'Crores ';
          }
          if ((i == 3 && value != 0) || (i == 2 && value != 0 && n_array[i + 1] == 0)) {
              words_string += 'Lakhs ';
          }
          if ((i == 5 && value != 0) || (i == 4 && value != 0 && n_array[i + 1] == 0)) {
              words_string += 'Thousand ';
          }
          if (i == 6 && value != 0 && (n_array[i + 1] != 0 && n_array[i + 2] != 0)) {
              words_string += 'Hundred and ';
          } else if (i == 6 && value != 0) {
              words_string += 'Hundred ';
          }
      }
      words_string = words_string.split('  ').join(' ');
  }
  return words_string;
};

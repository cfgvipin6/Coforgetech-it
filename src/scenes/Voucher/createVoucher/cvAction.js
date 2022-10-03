import { netInfo } from '../../../utilities/NetworkInfo';
import properties from '../../../resource/properties';
import { fetchPOSTMethod, fetchGETMethod } from '../../../utilities/fetchService';
let globalConstants = require('../../../GlobalConstants');
let constants = require('./constants');
let empCode;
let authToken;

const loading = () => {
    return {
      type: constants.CV_LOADING,
    };
  };

  const storeCVEmployeeData = data => {
    return {
      type: constants.CV_EMPLOYEE_DATA,
      payload: data,
    };
  };

//   const storeCVtoUpdate = data => {
//     return {
//       type: constants.CV_UPDATE_DATA,
//       payload: data
//     }
//   }
  const storeCVEmployeeError = msg => {
    return {
      type: constants.CV_EMPLOYEE_ERROR,
      payload: msg,
    };
  };

  const storeCVCategoryData = data => {
    return {
      type: constants.CV_CATEGORY_DATA,
      payload: data,
    };
  };
  export const resetCvHistoryData = ()=>{
    return {
      type: constants.RESET_CV_HISTORY_DATA,
    };
  };

  const storeCVExpenseTypeData = data => {
    return {
      type: constants.CV_EXPENSE_TYPE_DATA,
      payload: data,
    };
  };

  const storeCVExpenseTypeError = msg => {
    return {
      type: constants.CV_EXPENSE_TYPE_ERROR,
      payload: msg,
    };
  };

  const storeCVMileageCommMilesData = data => {
    return {
      type: constants.CV_MILEAGE_COMM_MILES_DATA,
      payload: data,
    };
  };

  const storeCVMileageCommMilesError = msg => {
    return {
      type: constants.CV_MILEAGE_COMM_MILES_ERROR,
      payload: msg,
    };
  };

  const storeCVTravelLocationData = data => {
    return {
      type: constants.CV_TRAVEL_LOCATION_DATA,
      payload: data,
    };
  };

  const storeCVTravelLocationError = msg => {
    return {
      type: constants.CV_TRAVEL_LOCATION_ERROR,
      payload: msg,
    };
  };

  const storeCVTravelAmountData = data => {
    return {
      type: constants.CV_TRAVEL_AMOUNT_DATA,
      payload: data,
    };
  };

  const storeCVTravelAmountError = msg => {
    return {
      type: constants.CV_TRAVEL_AMOUNT_ERROR,
      payload: msg,
    };
  };

  const storeCVCurrencyTypeData = data => {
    return {
      type: constants.CV_CURRENCY_TYPE_DATA,
      payload: data,
    };
  };

  const storeCVCurrencyTypeError = msg => {
    return {
      type: constants.CV_CURRENCY_TYPE_ERROR,
      payload: msg,
    };
  };

  const storeCVChildData = data => {
    return {
      type: constants.CV_CHILD_DATA,
      payload: data,
    };
  };

  const storeCVChildError = msg => {
    return {
      type: constants.CV_CHILD_ERROR,
      payload: msg,
    };
  };

  const storeCVClaimForData = data => {
    return {
      type: constants.CV_CLAIM_FOR_DATA,
      payload: data,
    };
  };

  const storeCVClaimForError = msg => {
    return {
      type: constants.CV_CLAIM_FOR_ERROR,
      payload: msg,
    };
  };

  const storeCVInvestmentPlanData = data => {
    return {
      type: constants.CV_INVESTMENT_PLAN_DATA,
      payload: data,
    };
  };

  const storeCVInvestmentPlanError = msg => {
    return {
      type: constants.CV_INVESTMENT_PLAN_ERROR,
      payload: msg,
    };
  };

  const storeCVWeddingDateData = data => {
    return {
      type: constants.CV_WEDDING_DATE_DATA,
      payload: data,
    };
  };

  const storeCVWeddingDateError = msg => {
    return {
      type: constants.CV_WEDDING_DATE_ERROR,
      payload: msg,
    };
  };

  const storeCVTakeABreakData = data => {
    return {
      type: constants.CV_TAKE_A_BREAK_DATA,
      payload: data,
    };
  };

  const storeCVTakeABreakError = msg => {
    return {
      type: constants.CV_TAKE_A_BREAK_ERROR,
      payload: msg,
    };
  };

  const storeCVSaveAndSubmitData = data => {
    return {
      type: constants.CV_SAVE_AND_SUBMIT_DATA,
      payload: data,
    };
  };

  const storeCVSaveAndSubmitError = msg => {
    return {
      type: constants.CV_SAVE_AND_SUBMIT_ERROR,
      payload: msg,
    };
  };

  const storeCVSearchProjectData = data => {
    return {
      type: constants.CV_SEARCH_PROJECT_DATA,
      payload: data,
    };
  };

  const storeCVSearchProjectError = msg => {
    return {
      type: constants.CV_SEARCH_PROJECT_ERROR,
      payload: msg,
    };
  };

  const storeCVSearchSupervisorData = data => {
    return {
      type: constants.CV_SEARCH_SUPERVISOR_DATA,
      payload: data,
    };
  };

  const storeCVSearchSupervisorError = msg => {
    return {
      type: constants.CV_SEARCH_SUPERVISOR_ERROR,
      payload: msg,
    };
  };

  const storeCVDeleteLineItemData = data => {
    return {
      type: constants.CV_DELETE_LINE_ITEM_DATA,
      payload: data,
    };
  };

  const storeCVDeleteLineItemError = msg => {
    return {
      type: constants.CV_DELETE_LINE_ITEM_ERROR,
      payload: msg,
    };
  };

  const storeCVDeleteVoucherData = data => {
    return {
      type: constants.CV_DELETE_VOUCHER_DATA,
      payload: data,
    };
  };

  const storeCVDeleteVoucherError = msg => {
    return {
      type: constants.CV_DELETE_VOUCHER_ERROR,
      payload: msg,
    };
  };

  const storeCVHistoryData = data => {
    return {
      type: constants.CV_HISTORY_DATA,
      payload: data,
    };
  };

  const storeCVHistoryError = msg => {
    return {
      type: constants.CV_HISTORY_ERROR,
      payload: msg,
    };
  };

  const storeCVLineItemData = data => {
    return {
      type: constants.CV_LINE_ITEM_DATA,
      payload: data,
    };
  };

  const storeCVLineItemError = msg => {
    return {
      type: constants.CV_LINE_ITEM_ERROR,
      payload: msg,
    };
  };

  const storeCVSubCategoryData = data => {
    return {
      type: constants.CV_SUB_CATEGORY_DATA,
      payload: data,
    };
  };

  const storeCVSubCategoryError = msg => {
    return {
      type: constants.CV_SUB_CATEGORY_ERROR,
      payload: msg,
    };
  };

  const storeCVValidationData = data => {
    return {
      type: constants.CV_VALIDATION_DATA,
      payload: data,
    };
  };

  const storeCVValidationError = msg => {
    return {
      type: constants.CV_VALIDATION_ERROR,
      payload: msg,
    };
  };

  const storeCVCreateReset = () => {
    return {
      type: constants.CV_RESET_STORE_DATA,
    };
  };

  const storeCVEmpDataReset = () => {
    return {
      type: constants.CV_RESET_EMP_DATA,
    };
  };

  export const cvFetchEmployeeData = (empCode, authToken, docNumber, getCategoryCallBack) => {
    return async dispatch => {
      let isNetwork = await netInfo();
      if (isNetwork) {
        this.empCode = empCode;
        this.authToken = authToken;
        dispatch(loading());
        let formData = new FormData();
        formData.append('ECSerp', empCode);
        formData.append('AuthKey', authToken);
        formData.append('EmpCode', empCode);
        formData.append('DocNo', docNumber);
        let url = properties.cvEmployeeDetailsUrl;
        let myResponse = await fetchPOSTMethod(url, formData);
        let response = Array.isArray(myResponse) ? myResponse : [myResponse];
        console.log('cv Employee data response=======>',response);
        if (response.length != undefined) {
          if (response.length === 1 && response[0].hasOwnProperty('Exception')) {
            dispatch(storeCVEmployeeError(response[0].Exception));
          } else {
            dispatch(storeCVEmployeeData(response));
            setTimeout(()=>{
              getCategoryCallBack();
            },500);
          }
        } else if (response.length === undefined || response.length === 0 || response === null || response === undefined) {
          dispatch(storeCVEmployeeError(globalConstants.UNDEFINED_MESSAGE));
        }
      } else {
        return alert(globalConstants.NO_INTERNET);
      }
    };
  };

  export const cvFetchCategory = () => {
    return async dispatch => {
      let isNetwork = await netInfo();
      if (isNetwork) {
        dispatch(loading());
        let formData = new FormData();
        formData.append('ECSerp', this.empCode);
        formData.append('AuthKey', this.authToken);
        formData.append('Type', 1);
        let url = properties.cvGetCategoryUrl;
        let myResponse = await fetchPOSTMethod(url, formData);
        let response = Array.isArray(myResponse) ? myResponse : [myResponse];
        console.log('cv category response=======>',response);
        if (response.length != undefined) {
          if (response.length === 1 && response[0].hasOwnProperty('Exception')) {
            dispatch(storeCVEmployeeError(response[0].Exception));
          } else {
            dispatch(storeCVCategoryData(response));
          }
        } else if (response.length === undefined || response.length === 0 || response === null || response === undefined) {
          dispatch(storeCVEmployeeError(globalConstants.UNDEFINED_MESSAGE));
        }
      } else {
        return alert(globalConstants.NO_INTERNET);
      }
    };
  };

  export const cvFetchExpenseType = (catType) => {
    return async dispatch => {
      let isNetwork = await netInfo();
      if (isNetwork) {
        dispatch(loading());
        let formData = new FormData();
        formData.append('ECSerp', this.empCode);
        formData.append('AuthKey', this.authToken);
        formData.append('Voucherhead', catType);
        let url = properties.cvGetExpenseTypeUrl;
        let myResponse = await fetchPOSTMethod(url, formData);
        let response = Array.isArray(myResponse) ? myResponse : [myResponse];
        console.log('cv expense type response=======>',response);
        if (response.length != undefined) {
          if (response.length === 1 && response[0].hasOwnProperty('Exception')) {
            dispatch(storeCVExpenseTypeError(response[0].Exception));
          } else {
            dispatch(storeCVExpenseTypeData(response));
          }
        } else if (response.length === undefined || response.length === 0 || response === null || response === undefined) {
          dispatch(storeCVExpenseTypeError(globalConstants.UNDEFINED_MESSAGE));
        }
      } else {
        return alert(globalConstants.NO_INTERNET);
      }
    };
  };

  export const cvFetchMileageCommMiles = (docNo) => {
    return async dispatch => {
      let isNetwork = await netInfo();
      if (isNetwork) {
        dispatch(loading());
        let formData = new FormData();
        formData.append('ECSerp', this.empCode);
        formData.append('AuthKey', this.authToken);
        formData.append('DocNo', docNo);
        let url = properties.cvGetMileageCommMilesUrl;
        let myResponse = await fetchPOSTMethod(url, formData);
        let response = Array.isArray(myResponse) ? myResponse : [myResponse];
        console.log('cv comm miles response=======>',response);
        if (response.length != undefined) {
          if (response.length === 1 && response[0].hasOwnProperty('Exception')) {
            dispatch(storeCVMileageCommMilesError(response[0].Exception));
          } else {
            dispatch(storeCVMileageCommMilesData(response));
          }
        } else if (response.length === undefined || response.length === 0 || response === null || response === undefined) {
          dispatch(storeCVMileageCommMilesError(globalConstants.UNDEFINED_MESSAGE));
        }
      } else {
        return alert(globalConstants.NO_INTERNET);
      }
    };
  };

  export const cvFetchTravelLocation = () => {
    return async dispatch => {
      let isNetwork = await netInfo();
      if (isNetwork) {
        dispatch(loading());
        let formData = new FormData();
        formData.append('ECSerp', this.empCode);
        formData.append('AuthKey', this.authToken);
        formData.append('Type', 5);
        let url = properties.cvGetTravelLocationUrl;
        let myResponse = await fetchPOSTMethod(url, formData);
        let response = Array.isArray(myResponse) ? myResponse : [myResponse];
        console.log('cv travel location response=======>',response);
        if (response.length != undefined) {
          if (response.length === 1 && response[0].hasOwnProperty('Exception')) {
            dispatch(storeCVTravelLocationError(response[0].Exception));
          } else {
            dispatch(storeCVTravelLocationData(response));
          }
        } else if (response.length === undefined || response.length === 0 || response === null || response === undefined) {
          dispatch(storeCVTravelLocationError(globalConstants.UNDEFINED_MESSAGE));
        }
      } else {
        return alert(globalConstants.NO_INTERNET);
      }
    };
  };

  export const cvFetchTravelAmount = (startDate, startHour, endDate, endHour) => { // expType = 14
    return async dispatch => {
      let isNetwork = await netInfo();
      if (isNetwork) {
        dispatch(loading());
        let formData = new FormData();
        formData.append('ECSerp', this.empCode);
        formData.append('AuthKey', this.authToken);
        formData.append('StartDate', startDate);
        formData.append('StartTime', startHour);
        formData.append('EndDate', endDate);
        formData.append('EndTime', endHour);
        let url = properties.cvGetTravelAmountUrl;
        let myResponse = await fetchPOSTMethod(url, formData);
        let response = Array.isArray(myResponse) ? myResponse : [myResponse];
        console.log('cv travel amount response=======>',response);
        if (response.length != undefined) {
          if (response.length === 1 && response[0].hasOwnProperty('Exception')) {
            dispatch(storeCVTravelAmountError(response[0].Exception));
          } else {
            dispatch(storeCVTravelAmountData(response));
          }
        } else if (response.length === undefined || response.length === 0 || response === null || response === undefined) {
          dispatch(storeCVTravelAmountError(globalConstants.UNDEFINED_MESSAGE));
        }
      } else {
        return alert(globalConstants.NO_INTERNET);
      }
    };
  };

  export const cvFetchCurrencyType = () => {
    return async dispatch => {
      let isNetwork = await netInfo();
      if (isNetwork) {
        dispatch(loading());
        let formData = new FormData();
        formData.append('ECSerp', this.empCode);
        formData.append('AuthKey', this.authToken);
        formData.append('Type', 2);
        let url = properties.cvGetCurrencyTypeUrl;
        let myResponse = await fetchPOSTMethod(url, formData);
        let response = Array.isArray(myResponse) ? myResponse : [myResponse];
        console.log('cv currency type response=======>',response);
        if (response.length != undefined) {
          if (response.length === 1 && response[0].hasOwnProperty('Exception')) {
            dispatch(storeCVCurrencyTypeError(response[0].Exception));
          } else {
            dispatch(storeCVCurrencyTypeData(response));
          }
        } else if (response.length === undefined || response.length === 0 || response === null || response === undefined) {
          dispatch(storeCVCurrencyTypeError(globalConstants.UNDEFINED_MESSAGE));
        }
      } else {
        return alert(globalConstants.NO_INTERNET);
      }
    };
  };

  export const cvFetchSubCategory = (catId) => {
    return async dispatch => {
      let isNetwork = await netInfo();
      if (isNetwork) {
        dispatch(loading());
        let formData = new FormData();
        formData.append('ECSerp', this.empCode);
        formData.append('AuthKey', this.authToken);
        formData.append('sCatId', catId);
        let url = properties.cvGetSubCategoryUrl;
        let myResponse = await fetchPOSTMethod(url, formData);
        let response = Array.isArray(myResponse) ? myResponse : [myResponse];
        console.log('cv sub category response=======>',response);
        if (response.length != undefined) {
          if (response.length === 1 && response[0].hasOwnProperty('Exception')) {
            dispatch(storeCVSubCategoryError(response[0].Exception));
          } else {
            dispatch(storeCVSubCategoryData(response));
          }
        } else if (response.length === undefined || response.length === 0 || response === null || response === undefined) {
          dispatch(storeCVSubCategoryError(globalConstants.UNDEFINED_MESSAGE));
        }
      } else {
        return alert(globalConstants.NO_INTERNET);
      }
    };
  };

  export const cvFetchChildDetails = () => {
    return async dispatch => {
      let isNetwork = await netInfo();
      if (isNetwork) {
        dispatch(loading());
        let formData = new FormData();
        formData.append('ECSerp', this.empCode);
        formData.append('AuthKey', this.authToken);
        formData.append('EmpCode', this.empCode);
        let url = properties.cvGetChildDetailsUrl;
        let myResponse = await fetchPOSTMethod(url, formData);
        let response = Array.isArray(myResponse) ? myResponse : [myResponse];
        console.log('cv child Details response=======>',response);
        if (response.length != undefined) {
          if (response.length === 1 && response[0].hasOwnProperty('Exception')) {
            dispatch(storeCVChildError(response[0].Exception));
          } else {
            dispatch(storeCVChildData(response));
          }
        } else if (response.length === undefined || response.length === 0 || response === null || response === undefined) {
          dispatch(storeCVChildError(globalConstants.UNDEFINED_MESSAGE));
        }
      } else {
        return alert(globalConstants.NO_INTERNET);
      }
    };
  };

  export const cvFetchClaimFor = () => {
    return async dispatch => {
      let isNetwork = await netInfo();
      if (isNetwork) {
        dispatch(loading());
        let formData = new FormData();
        formData.append('ECSerp', this.empCode);
        formData.append('AuthKey', this.authToken);
        let url = properties.cvGetClaimForUrl;
        let myResponse = await fetchPOSTMethod(url, formData);
        let response = Array.isArray(myResponse) ? myResponse : [myResponse];
        console.log('cv claim for response=======>',response);
        if (response.length != undefined) {
          if (response.length === 1 && response[0].hasOwnProperty('Exception')) {
            dispatch(storeCVClaimForError(response[0].Exception));
          } else {
            dispatch(storeCVClaimForData(response));
          }
        } else if (response.length === undefined || response.length === 0 || response === null || response === undefined) {
          dispatch(storeCVClaimForError(globalConstants.UNDEFINED_MESSAGE));
        }
      } else {
        return alert(globalConstants.NO_INTERNET);
      }
    };
  };

  export const cvFetchInvestmentPlan = () => {
    return async dispatch => {
      let isNetwork = await netInfo();
      if (isNetwork) {
        dispatch(loading());
        let formData = new FormData();
        formData.append('ECSerp', this.empCode);
        formData.append('AuthKey', this.authToken);
        let url = properties.cvGetInvestmentPlanUrl;
        let myResponse = await fetchPOSTMethod(url, formData);
        let response = Array.isArray(myResponse) ? myResponse : [myResponse];
        console.log('cv investment plan response=======>',response);
        if (response.length != undefined) {
          if (response.length === 1 && response[0].hasOwnProperty('Exception')) {
            dispatch(storeCVInvestmentPlanError(response[0].Exception));
          } else {
            dispatch(storeCVInvestmentPlanData(response));
          }
        } else if (response.length === undefined || response.length === 0 || response === null || response === undefined) {
          dispatch(storeCVInvestmentPlanError(globalConstants.UNDEFINED_MESSAGE));
        }
      } else {
        return alert(globalConstants.NO_INTERNET);
      }
    };
  };

  export const cvFetchWeddingDate = () => {
    return async dispatch => {
      let isNetwork = await netInfo();
      if (isNetwork) {
        dispatch(loading());
        let formData = new FormData();
        formData.append('ECSerp', this.empCode);
        formData.append('AuthKey', this.authToken);
        let url = properties.cvGetWeddingDateUrl;
        let myResponse = await fetchPOSTMethod(url, formData);
        let response = Array.isArray(myResponse) ? myResponse : [myResponse];
        console.log('cv wedding date response=======>',response);
        if (response.length != undefined) {
          if (response.length === 1 && response[0].hasOwnProperty('Exception')) {
            dispatch(storeCVWeddingDateError(response[0].Exception));
          } else {
            dispatch(storeCVWeddingDateData(response));
          }
        } else if (response.length === undefined || response.length === 0 || response === null || response === undefined) {
          dispatch(storeCVWeddingDateError(globalConstants.UNDEFINED_MESSAGE));
        }
      } else {
        return alert(globalConstants.NO_INTERNET);
      }
    };
  };

  export const cvFetchTakeABreakBalance = (docNo) => {
    return async dispatch => {
      let isNetwork = await netInfo();
      if (isNetwork) {
        dispatch(loading());
        let formData = new FormData();
        formData.append('ECSerp', this.empCode);
        formData.append('AuthKey', this.authToken);
        formData.append('Type', 1);
        formData.append('EmpCode', this.empCode);
        formData.append('DocNo', docNo);
        let url = properties.cvGetTakeABreakBalanceUrl;
        let myResponse = await fetchPOSTMethod(url, formData);
        let response = Array.isArray(myResponse) ? myResponse : [myResponse];
        console.log('cv take a break response=======>',response);
        if (response.length != undefined) {
          if (response.length === 1 && response[0].hasOwnProperty('Exception')) {
            dispatch(storeCVTakeABreakError(response[0].Exception));
          } else {
            dispatch(storeCVTakeABreakData(response));
          }
        } else if (response.length === undefined || response.length === 0 || response === null || response === undefined) {
          dispatch(storeCVTakeABreakError(globalConstants.UNDEFINED_MESSAGE));
        }
      } else {
        return alert(globalConstants.NO_INTERNET);
      }
    };
  };

  export const cvSaveAndSubmitDetails = (empDetailsData, docNo, docType, particular, cashMemo, date, date2, currency, amount, approvedAmt, totalApprovedAmt, catType,
    catId, subCatId, childName, childDobOriginal, claimForId, investmentPlanId, firstClaimTill, secondClaimTill, weddingDate,
    remarks, saveOrSubmit, status, forwardTo, empTo, lineItemId, project, costCenter, lcvFrom, lcvTo, lcvMode, lcvKM, lcvRoundTrip,
    ukCreditCardFlag, ukExpenseType, lineItemCurrency, lineItemProjectCode, lineItemCostCenterCode, fromTime, toTime, location, getLineItemDataCallBack,numPeople) => {
    return async dispatch => {
      let isNetwork = await netInfo();
      if (isNetwork) {
        let projCode, projText, costCenterCode, costCenterText;
        if (project != '') {
          projCode = project.split('~')[0];
          projText = project.split('~')[1];
        } else {
          projCode = '';
          projText = '';
        }
        if (costCenter != '') {
          costCenterCode = costCenter.split('~')[0];
          costCenterText = costCenter.split('~')[1];
        } else {
          costCenterCode = '';
          costCenterText = '';
        }
        console.log('empDetailsData',empDetailsData);
        console.log('project',project.split('~'));
        console.log('costCenter',costCenter);
        dispatch(loading());
        let formData = new FormData();
        formData.append('ECSerp', this.empCode);
        formData.append('AuthKey', this.authToken);
        formData.append('Type', catType);
        formData.append('EmpCode', this.empCode);
        formData.append('DocNo', docNo);
        formData.append('DocType', docType);
        formData.append('DocStartDate', empDetailsData.DocDate);
        formData.append('DocEndDate', empDetailsData.DocDate);
        formData.append('PACode', empDetailsData.PA);
        formData.append('PSACode', empDetailsData.PSA);
        formData.append('CompanyCode', empDetailsData.CO_CODE);
        formData.append('OUCode', empDetailsData.OU);
        formData.append('CostcenterCode', costCenterCode); //line item input
        formData.append('CostcenterText', costCenterText); //line item input
        formData.append('NCostcenterCode', costCenterCode); //line item input
        formData.append('NCostcenterText', costCenterText); //line item input
        formData.append('CategoryCode', empDetailsData.DIS.charAt(0));
        formData.append('Currency', empDetailsData.CURRENCY); //need to discuss
        formData.append('Remarks', remarks);
        formData.append('TotalApprovedAmt', totalApprovedAmt); //total of line item
        formData.append('ProjectCode', projCode); //line item input
        formData.append('NProjectCode', projCode); //line item input
        formData.append('PlanCode', empDetailsData.PLAN1);
        formData.append('VoucherType', subCatId);
        formData.append('MemoNo', cashMemo);
        formData.append('MemoDate', date);
        formData.append('MemoDate2', date2);
        formData.append('Particulars', particular);
        formData.append('Amount', amount);
        formData.append('ApprovedAmt', approvedAmt); //final exch amount in local currency for catId == 9
        formData.append('CostCode', costCenterCode); //line item input //discuss with anil again
        formData.append('ProjCode', projCode); //line item input
        formData.append('IsActive', 1);
        formData.append('CreatedBy', this.empCode);
        formData.append('ModifiedBy', this.empCode);
        formData.append('IsSubmitBySM', saveOrSubmit); //0-save,1-submit
        formData.append('LoginEmpCode', this.empCode);
        formData.append('EmpFrom', this.empCode);
        formData.append('Category', catId);
        formData.append('FromStatus', saveOrSubmit); //IsSubmitBySM 1 than 1 else status value 0
        formData.append('LineItemId', lineItemId);
        formData.append('ChildName', childName);
        formData.append('Childbdate', childDobOriginal);
        formData.append('ClaimFor', claimForId);
        formData.append('InvestmentPlan', investmentPlanId);
        formData.append('FirstClaimTill', firstClaimTill);
        formData.append('SecondClaimTill', secondClaimTill);
        formData.append('WeddingDate', weddingDate);
        formData.append('Status', status);
        formData.append('ForwordTo', forwardTo);
        formData.append('EmpTo', empTo);
        formData.append('PendingWith', empTo);
        formData.append('LCVFrom', lcvFrom);
        formData.append('LCVTo', lcvTo);
        formData.append('LCVMode', lcvMode);
        formData.append('LCVKM', lcvKM); //exch rate in expense, travel
        formData.append('LCVRoundtrip', lcvRoundTrip);
        formData.append('CreditCardRem', ukCreditCardFlag); // Y or N
        formData.append('vc_VoucherType', ukExpenseType);
        formData.append('vc_Currency', lineItemCurrency);
        formData.append('vc_Projectcode', lineItemProjectCode);
        formData.append('CostCode', lineItemCostCenterCode); //line item cost code
        formData.append('FromTime', fromTime.replace(':',''));
        formData.append('ToTime', toTime.replace(':',''));
        formData.append('Location', location);
        formData.append('People', numPeople);

        let url = properties.cvSaveAndSubmitUrl;
        console.log('Submit payload =======>',formData);
        let myResponse = await fetchPOSTMethod(url, formData);
        let response = Array.isArray(myResponse) ? myResponse : [myResponse];
        console.log('cv save and submit response=======>',response);
        if (response.length != undefined) {
          if (response.length === 1 && response[0].hasOwnProperty('Exception')) {
            dispatch(storeCVSaveAndSubmitError(response[0].Exception));
          } else {
            dispatch(storeCVSaveAndSubmitData(response));
            setTimeout(()=>{
              getLineItemDataCallBack();
            },500);
          }
        } else if (response.length === undefined || response.length === 0 || response === null || response === undefined) {
          dispatch(storeCVSaveAndSubmitError(globalConstants.UNDEFINED_MESSAGE));
        }
      } else {
        return alert(globalConstants.NO_INTERNET);
      }
    };
  };

  export const cvFetchLineItemData = (docNo) => {
    return async dispatch => {
      let isNetwork = await netInfo();
      if (isNetwork) {
        dispatch(loading());
        let formData = new FormData();
        formData.append('ECSerp', this.empCode);
        formData.append('AuthKey', this.authToken);
        formData.append('DocNo', docNo);
        let url = properties.cvGetLineItemDataUrl;
        let myResponse = await fetchPOSTMethod(url, formData);
        let response = Array.isArray(myResponse) ? myResponse : [myResponse];
        console.log('cv line item response=======>',response);
        if (response.length != undefined) {
          if (response.length === 1 && response[0].hasOwnProperty('Exception')) {
            dispatch(storeCVLineItemError(response[0].Exception));
          } else {
            dispatch(storeCVLineItemData(response));
          }
        } else if (response.length === undefined || response.length === 0 || response === null || response === undefined) {
          dispatch(storeCVLineItemError(globalConstants.UNDEFINED_MESSAGE));
        }
      } else {
        return alert(globalConstants.NO_INTERNET);
      }
    };
  };

  export const cvSearchProject = (term, compCode) => {
    return async dispatch => {
      let isNetwork = await netInfo();
      if (isNetwork) {
        // dispatch(loading());
        let formData = new FormData();
        formData.append('ECSerp', this.empCode);
        formData.append('AuthKey', this.authToken);
        formData.append('Company', compCode);
        formData.append('SearchText', term);
        let url = properties.cvProjectSearchUrl;
        let response = await fetchPOSTMethod(url, formData);
        console.log('cv project search response=======>',response);
        if (response.length != undefined) {
          if (response.length === 1 && response[0].hasOwnProperty('Exception')) {
            dispatch(storeCVSearchProjectError(response[0].Exception));
          } else {
            dispatch(storeCVSearchProjectData(response.slice(0,5)));
          }
        } else if (response.length === undefined || response.length === 0 || response === null || response === undefined) {
          dispatch(storeCVSearchProjectError(globalConstants.UNDEFINED_MESSAGE));
        }
      } else {
        return alert(globalConstants.NO_INTERNET);
      }
    };
  };

  export const cvSearchSupervisor = (docNo, term) => {
    return async dispatch => {
      let isNetwork = await netInfo();
      if (isNetwork) {
        // dispatch(loading());
        let formData = new FormData();
        formData.append('ECSerp', this.empCode);
        formData.append('AuthKey', this.authToken);
        formData.append('DocNo', docNo);
        formData.append('SearchText', term);
        let url = properties.cvSupervisorSearchUrl;
        let response = await fetchPOSTMethod(url, formData);
        console.log('cv supervisor search response=======>',response);
        if (response.length != undefined) {
          if (response.length === 1 && response[0].hasOwnProperty('Exception')) {
            dispatch(storeCVSearchSupervisorError(response[0].Exception));
          } else {
            dispatch(storeCVSearchSupervisorData(response.slice(0,5)));
          }
        } else if (response.length === undefined || response.length === 0 || response === null || response === undefined) {
          dispatch(storeCVSearchSupervisorError(globalConstants.UNDEFINED_MESSAGE));
        }
      } else {
        return alert(globalConstants.NO_INTERNET);
      }
    };
  };

  export const cvDeleteLineItem = (itemId) => {
    return async dispatch => {
      let isNetwork = await netInfo();
      if (isNetwork) {
        dispatch(loading());
        let formData = new FormData();
        formData.append('ECSerp', this.empCode);
        formData.append('AuthKey', this.authToken);
        formData.append('ItemId', itemId);
        let url = properties.cvDeleteLineItemUrl;
        let myResponse = await fetchPOSTMethod(url, formData);
        let response = Array.isArray(myResponse) ? myResponse : [myResponse];
        console.log('cv line item delete response=======>',response);
        if (response.length != undefined) {
          if (response.length === 1 && response[0].hasOwnProperty('Exception')) {
            dispatch(storeCVDeleteLineItemError(response[0].Exception));
          } else {
            dispatch(storeCVDeleteLineItemData(response));
          }
        } else if (response.length === undefined || response.length === 0 || response === null || response === undefined) {
          dispatch(storeCVDeleteLineItemError(globalConstants.UNDEFINED_MESSAGE));
        }
      } else {
        return alert(globalConstants.NO_INTERNET);
      }
    };
  };

  export const cvDeleteVoucher = (docNo) => {
    return async dispatch => {
      let isNetwork = await netInfo();
      if (isNetwork) {
        dispatch(loading());
        let formData = new FormData();
        formData.append('ECSerp', this.empCode);
        formData.append('AuthKey', this.authToken);
        formData.append('DocNo', docNo);
        let url = properties.cvDeleteVoucherUrl;
        let myResponse = await fetchPOSTMethod(url, formData);
        let response = Array.isArray(myResponse) ? myResponse : [myResponse];
        console.log('cv voucher delete response=======>',response);
        if (response.length != undefined) {
          if (response.length === 1 && response[0].hasOwnProperty('Exception')) {
            dispatch(storeCVDeleteVoucherError(response[0].Exception));
          } else {
            dispatch(storeCVDeleteVoucherData(response));
          }
        } else if (response.length === undefined || response.length === 0 || response === null || response === undefined) {
          dispatch(storeCVDeleteVoucherError(globalConstants.UNDEFINED_MESSAGE));
        }
      } else {
        return alert(globalConstants.NO_INTERNET);
      }
    };
  };

  export const cvFetchHistory = (docNo,callBack) => {
    return async dispatch => {
      let isNetwork = await netInfo();
      if (isNetwork) {
        dispatch(loading());
        let formData = new FormData();
        formData.append('ECSerp', this.empCode);
        formData.append('AuthKey', this.authToken);
        formData.append('DocumentNo', docNo);
        let url = properties.cvHistoryUrl;
        let myResponse = await fetchPOSTMethod(url, formData);
        let response = Array.isArray(myResponse) ? myResponse : [myResponse];
        console.log('cv history response=======>',response);
        if (response.length != undefined) {
          if (response.length === 1 && response[0].hasOwnProperty('Exception')) {
            dispatch(storeCVHistoryError(response[0].Exception));
          } else {
            dispatch(storeCVHistoryData(response));
            if (callBack !== undefined){
              callBack();
            }
          }
        } else if (response.length === undefined || response.length === 0 || response === null || response === undefined) {
          dispatch(storeCVHistoryError(globalConstants.UNDEFINED_MESSAGE));
        }
      } else {
        return alert(globalConstants.NO_INTERNET);
      }
    };
  };

  export const cvValidateDetails = (empDetailsData, docNo, docType, cashMemo, date, project, costCenter, catId, subCatId, lineItemId, weddingDate, childName, claimForId) => {
    return async dispatch => {
      let isNetwork = await netInfo();
      if (isNetwork) {
        let projCode, projText, costCenterCode, costCenterText;
        if (project != '') {
          projCode = project.split('~')[0];
          projText = project.split('~')[1];
        } else {
          projCode = '';
          projText = '';
        }
        if (costCenter != '') {
          costCenterCode = costCenter.split('~')[0];
          costCenterText = costCenter.split('~')[1];
        } else {
          costCenterCode = '';
          costCenterText = '';
        }
        dispatch(loading());
        let formData = new FormData();
        formData.append('ECSerp', this.empCode);
        formData.append('AuthKey', this.authToken);
        formData.append('EmpCode', this.empCode);
        formData.append('Type', 1);
        formData.append('CatId', catId);
        formData.append('DocNo', docNo);
        formData.append('DocType', docType);
        formData.append('CompanyCode', empDetailsData.CO_CODE);
        formData.append('ClaimDate', date);
        formData.append('ProjectCode', projCode);
        formData.append('CostCode', costCenterCode);
        formData.append('VoucherType', catId);
        formData.append('VoucherSubType', subCatId);
        formData.append('MemoNo', cashMemo);
        formData.append('LineItemId', lineItemId);
        formData.append('DocumentNo', docNo);
        formData.append('Purpose', '');
        formData.append('WeddingDate', weddingDate);
        formData.append('ChildName', childName);
        formData.append('ClaimFor', claimForId);
        let url = properties.cvValidationUrl;
        let myResponse = await fetchPOSTMethod(url, formData);
        let response = Array.isArray(myResponse) ? myResponse : [myResponse];
        console.log('cv validation response=======>',response);
        if (response.length != undefined) {
          if (response.length === 1 && response[0].hasOwnProperty('Exception')) {
            dispatch(storeCVValidationError(response[0].Exception));
          } else {
            dispatch(storeCVValidationData(response));
          }
        } else if (response.length === undefined || response.length === 0 || response === null || response === undefined) {
          dispatch(storeCVValidationError(globalConstants.UNDEFINED_MESSAGE));
        }
      } else {
        return alert(globalConstants.NO_INTERNET);
      }
    };
  };

  export const cvResetScreen = () => {
    return async dispatch => {
      dispatch(storeCVCreateReset());
    };
  };

  export const cvResetEmpData = () => {
    return async dispatch => {
      dispatch(storeCVEmpDataReset());
    };
  };

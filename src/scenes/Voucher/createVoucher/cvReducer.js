let constants = require('./constants');

const initialState = {
    cvEmployeeData: [],
    cvEmployeeError: '',
    cvLoader: false,
    cvCategoryData: [],
    cvSubCategoryData: [],
    cvSubCategoryError: '',
    cvChildData: [],
    cvChildError: '',
    cvClaimForData: [],
    cvClaimForError: '',
    cvInvestmentPlanData: [],
    cvInvestmentPlanError: '',
    cvWeddingDateData: [],
    cvWeddingDateError: '',
    cvTakeABreakData: [],
    cvTakeABreakError: '',
    cvSaveAndSubmitData: [],
    cvSaveAndSubmitError: '',
    cvLineItemData: [],
    cvLineItemError: '',
    cvSearchProjectData: [],
    cvSearchProjectError: '',
    cvSearchSupervisorData: [],
    cvSearchSupervisorError: '',
    cvDeleteLineItemData: [],
    cvDeleteLineItemError: '',
    cvDeleteVoucherData: [],
    cvDeleteVoucherError: '',
    cvHistoryData: [],
    cvHistoryError: '',
    cvExpenseTypeData: [],
    cvExpenseTypeError: '',
    cvCurrencyTypeData: [],
    cvCurrencyTypeError: '',
    cvValidationData: [],
    cvValidationError: '',
    cvTravelLocationData: [],
    cvTravelLocationError: '',
    cvTravelAmountData: [],
    cvTravelAmountError: '',
    cvMileageCommMilesData: [],
    cvMileageCommMilesError: '',
};

export const CVReducer = (state = initialState, action) => {
    switch (action.type) {
        case constants.CV_LOADING :
            return {...state, cvLoader: true};
        case constants.CV_RESET_EMP_DATA :
            return {...state, cvLoader: false, cvEmployeeData: [], cvEmployeeError: ''};
        case constants.CV_RESET_STORE_DATA :
            return {...state, cvLoader: false, cvSaveAndSubmitData: [], cvSaveAndSubmitError: '', cvLineItemData: [],
            cvLineItemError: '', cvSearchProjectData: [], cvSearchProjectError: '', cvSearchSupervisorData: [], cvSearchSupervisorError: '',
            cvDeleteLineItemData: [], cvDeleteLineItemError: '', cvDeleteVoucherData: [], cvDeleteVoucherError: ''};
        case constants.CV_EMPLOYEE_ERROR :
            return {...state, cvLoader: false, cvEmployeeData: [], cvCategoryData: [], cvEmployeeError: action.payload};
        case constants.CV_EMPLOYEE_DATA :
            return {...state, cvLoader: false, cvEmployeeData: action.payload, cvEmployeeError: ''};
        case constants.CV_CATEGORY_DATA :
            return {...state, cvLoader: false, cvCategoryData: action.payload, cvEmployeeError: ''};
        case constants.CV_EXPENSE_TYPE_ERROR :
            return {...state, cvLoader: false, cvExpenseTypeData: [], cvExpenseTypeError: action.payload};
        case constants.CV_EXPENSE_TYPE_DATA :
            return {...state, cvLoader: false, cvExpenseTypeData: action.payload, cvExpenseTypeError: ''};
        case constants.CV_MILEAGE_COMM_MILES_ERROR :
            return {...state, cvLoader: false, cvMileageCommMilesData: [], cvMileageCommMilesError: action.payload};
        case constants.CV_MILEAGE_COMM_MILES_DATA :
            return {...state, cvLoader: false, cvMileageCommMilesData: action.payload, cvMileageCommMilesError: ''};
        case constants.CV_TRAVEL_LOCATION_ERROR :
            return {...state, cvLoader: false, cvTravelLocationData: [], cvTravelLocationError: action.payload};
        case constants.CV_TRAVEL_LOCATION_DATA :
            return {...state, cvLoader: false, cvTravelLocationData: action.payload, cvTravelLocationError: ''};
        case constants.CV_TRAVEL_AMOUNT_ERROR :
            return {...state, cvLoader: false, cvTravelAmountData: [], cvTravelAmountError: action.payload};
        case constants.CV_TRAVEL_AMOUNT_DATA :
            return {...state, cvLoader: false, cvTravelAmountData: action.payload, cvTravelAmountError: ''};
        case constants.CV_CURRENCY_TYPE_ERROR :
            return {...state, cvLoader: false, cvCurrencyTypeData: [], cvCurrencyTypeError: action.payload};
        case constants.CV_CURRENCY_TYPE_DATA :
            return {...state, cvLoader: false, cvCurrencyTypeData: action.payload, cvCurrencyTypeError: ''};
        case constants.CV_SUB_CATEGORY_ERROR :
            return {...state, cvLoader: false, cvSubCategoryData: [], cvSubCategoryError: action.payload};
        case constants.CV_SUB_CATEGORY_DATA :
            return {...state, cvLoader: false, cvSubCategoryData: action.payload, cvSubCategoryError: ''};
        case constants.CV_CHILD_ERROR :
            return {...state, cvLoader: false, cvChildData: [], cvChildError: action.payload};
        case constants.CV_CHILD_DATA :
            return {...state, cvLoader: false, cvChildData: action.payload, cvChildError: ''};
        case constants.CV_CLAIM_FOR_ERROR :
            return {...state, cvLoader: false, cvClaimForData: [], cvClaimForError: action.payload};
        case constants.CV_CLAIM_FOR_DATA :
            return {...state, cvLoader: false, cvClaimForData: action.payload, cvClaimForError: ''};
        case constants.CV_INVESTMENT_PLAN_ERROR :
            return {...state, cvLoader: false, cvInvestmentPlanData: [], cvInvestmentPlanError: action.payload};
        case constants.CV_INVESTMENT_PLAN_DATA :
            return {...state, cvLoader: false, cvInvestmentPlanData: action.payload, cvInvestmentPlanError: ''};
        case constants.CV_WEDDING_DATE_ERROR :
            return {...state, cvLoader: false, cvWeddingDateData: [], cvWeddingDateError: action.payload};
        case constants.CV_WEDDING_DATE_DATA :
            return {...state, cvLoader: false, cvWeddingDateData: action.payload, cvWeddingDateError: ''};
        case constants.CV_TAKE_A_BREAK_ERROR :
            return {...state, cvLoader: false, cvTakeABreakData: [], cvTakeABreakError: action.payload};
        case constants.CV_TAKE_A_BREAK_DATA :
            return {...state, cvLoader: false, cvTakeABreakData: action.payload, cvTakeABreakError: ''};
        case constants.CV_SAVE_AND_SUBMIT_ERROR :
            return {...state, cvLoader: false, cvSaveAndSubmitData: [], cvSaveAndSubmitError: action.payload};
        case constants.CV_SAVE_AND_SUBMIT_DATA :
            return {...state, cvLoader: false, cvSaveAndSubmitData: action.payload, cvSaveAndSubmitError: ''};
        case constants.CV_LINE_ITEM_ERROR :
            return {...state, cvLoader: false, cvLineItemData: [], cvLineItemError: action.payload};
        case constants.CV_LINE_ITEM_DATA :
            return {...state, cvLoader: false, cvLineItemData: action.payload, cvLineItemError: ''};
        case constants.CV_SEARCH_PROJECT_ERROR :
            return {...state, cvLoader: false, cvSearchProjectData: [], cvSearchProjectError: action.payload};
        case constants.CV_SEARCH_PROJECT_DATA :
            return {...state, cvLoader: false, cvSearchProjectData: action.payload, cvSearchProjectError: ''};
        case constants.CV_SEARCH_SUPERVISOR_ERROR :
            return {...state, cvLoader: false, cvSearchSupervisorData: [], cvSearchSupervisorError: action.payload};
        case constants.CV_SEARCH_SUPERVISOR_DATA :
            return {...state, cvLoader: false, cvSearchSupervisorData: action.payload, cvSearchSupervisorError: ''};
        case constants.CV_DELETE_LINE_ITEM_ERROR :
            return {...state, cvLoader: false, cvDeleteLineItemData: [], cvDeleteLineItemError: action.payload};
        case constants.CV_DELETE_LINE_ITEM_DATA :
            return {...state, cvLoader: false, cvDeleteLineItemData: action.payload, cvDeleteLineItemError: ''};
        case constants.CV_DELETE_VOUCHER_ERROR :
            return {...state, cvLoader: false, cvDeleteVoucherData: [], cvDeleteVoucherError: action.payload};
        case constants.CV_DELETE_VOUCHER_DATA :
            return {...state, cvLoader: false, cvDeleteVoucherData: action.payload, cvDeleteVoucherError: ''};
        case constants.CV_HISTORY_ERROR :
            return {...state, cvLoader: false, cvHistoryData: [], cvHistoryError: action.payload};
        case constants.CV_HISTORY_DATA :
            return {...state, cvLoader: false, cvHistoryData: action.payload, cvHistoryError: ''};
        case constants.CV_VALIDATION_ERROR :
            return {...state, cvLoader: false, cvValidationData: [], cvValidationError: action.payload};
        case constants.CV_VALIDATION_DATA :
            return {...state, cvLoader: false, cvValidationData: action.payload, cvValidationError: ''};
        case constants.RESET_CV_HISTORY_DATA :
                return {...state, cvLoader: false, cvHistoryData: [], cvHistoryError: ''};
        default :
            return state;
    }
};

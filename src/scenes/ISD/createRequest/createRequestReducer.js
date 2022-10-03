let constants = require('./constants');

const initialState = {
    isdDefaultData: [],
    isdDefaultError: "",
    isdLoader: false,
    isdServiceTypeData: [],
    isdServiceTypeError: "",
    isdSaveData: [],
    isdSaveError: "",
    isdFileResponseData: "",
    isdFileResponseError: "",
    isdSearchEmployeeData: [],
    isdSearchEmployeeError: "",
    isdDataToUpdate:[],
    additionalRemarks:"",
    deleteResponse:"",
    downloadResponse:[]
}

export const ISDCreateRequestReducer = (state = initialState, action) => {
    switch(action.type) {
        case constants.ISD_LOADING :
          return {...state, isdLoader: true}
        case constants.ISD_DEFAULT_ERROR :
            return {...state, isdLoader: false, isdDefaultError: action.payload,deleteResponse:""}
        case constants.ISD_DEFAULT_DATA :
            return {...state, isdLoader: false, isdDefaultData: action.payload, isdDefaultError: "",deleteResponse:""}
        case constants.ISD_RESET_STORE :
            return {...state, isdLoader: false, isdServiceTypeData: [], isdServiceTypeError: "", isdDefaultData: [], isdDefaultError: "", isdSaveData:[], isdSaveError: "",isdDataToUpdate:[],additionalRemarks:"",deleteResponse:"",downloadResponse:[]}
        case constants.ISD_SERVICE_TYPE_ERROR :
            return {...state, isdLoader: false, isdServiceTypeData: [], isdServiceTypeError: action.payload,deleteResponse:""}
        case constants.ISD_SERVICE_TYPE_DATA :
            return {...state, isdLoader: false, isdServiceTypeData: action.payload, isdServiceTypeError: "",deleteResponse:"",isdFileResponseData:""}
        case constants.ISD_SAVE_ERROR :
            return {...state, isdLoader: false, isdSaveData: [], isdSaveError: action.payload,deleteResponse:""}
        case constants.ISD_SAVE_DATA :
            return {...state, isdLoader: false,deleteResponse:"",isdSaveError: "",isdFileResponseData:"", isdSaveData: action.payload}
        case constants.ISD_FILE_RESPONSE_ERROR :
            return {...state, isdLoader: false, isdFileResponseData: "", isdFileResponseError: action.payload,deleteResponse:""}
        case constants.ISD_FILE_RESPONSE_DATA :
            return {...state, isdLoader: false,deleteResponse:"", isdFileResponseData: action.payload, isdFileResponseError: ""}
        case constants.ISD_SEARCH_EMPLOYEE_ERROR :
            return {...state, isdLoader: false, isdSearchEmployeeData: [], isdSearchEmployeeError: action.payload,deleteResponse:"",isdFileResponseData:"",}
        case constants.ISD_SEARCH_EMPLOYEE_DATA :
            return {...state, isdLoader: false, isdSearchEmployeeData: action.payload, isdSearchEmployeeError: "",deleteResponse:"",isdFileResponseData:"",}
        case constants.ISD_UPDATE_DATA :
            return {...state, isdLoader: false, isdDataToUpdate: action.payload, isdDefaultError: "",deleteResponse:"",isdFileResponseData:""}
        case constants.ADDITIONAL_REMARKS :
            return {...state, isdLoader: false, additionalRemarks: action.payload, isdDefaultError: ""}
        case constants.DELETE_FILE :
            return {...state, isdLoader:false,isdFileResponseData:"", deleteResponse: action.payload, isdDefaultError: ""}
        case constants.DOWNLOAD_FILE :
            return {...state, isdLoader: false,deleteResponse:"",isdFileResponseData:"", downloadResponse: action.payload, isdDefaultError: ""}
        default :
            return state
    }
}
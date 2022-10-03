let constants = require('./constants')

let initialStates = {
    visaData: [],
    visaLoader: false,
    visaError: "",
    visaHistory: [],
    visaHistoryError: "",

    visaActionResponse: "",
    visaActionError: "",
    visaSupervisorData: [],
}

export const VisaReducer = (state = initialStates, action) => {
    switch(action.type){
        case constants.VISA_LOADING :
            return {...state, visaLoader: true}
        case constants.STORE_VISA_DATA :
            return {...state, visaData: action.payload, visaLoader: false, visaError: "", visaActionResponse: "", visaActionError: ""}
        case constants.STORE_VISA_ERROR :
            return {...state, visaError: action.payload, visaLoader: false, visaData: []}
        case constants.STORE_VISA_HISTORY :
            return {...state, visaHistory: action.payload, visaLoader: false, visaHistoryError: ""}
        case constants.STORE_VISA_HISTORY_ERROR :
            return {...state, visaHistoryError: action.payload, visaLoader: false, visaHistory: []}
        case constants.VISA_RESET_SCREEN :
            return {...state, visaError: "", visaLoader: false, visaData: []}
        case constants.ACTION_SUCCESS :
            return {...state, visaActionResponse: action.payload, visaActionError: "", visaLoader: false}
        case constants.ACTION_ERROR :
            return {...state, visaActionResponse: "", visaActionError: action.payload, visaLoader: false}
        case constants.SUPERVISOR_DATA : 
            return {...state, visaLoader: false, visaSupervisorData: action.payload}
        case constants.RESET_SUPERVISOR_DATA : 
            return {...state, visaLoader: false, visaSupervisorData: []}
        default : 
            return state
    }
}
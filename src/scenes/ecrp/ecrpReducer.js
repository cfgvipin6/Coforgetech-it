let constants = require('./constants');

const initialState = {
    ecrpData: [],
    ecrpError: "",
    ecrpLoader: false,
    ecrpHistory: [],
    ecrpHistoryError: "",
    ecrpSupervisorData: [],
    ecrpActionResponse: "",
    ecrpActionError: ""
}

export const ECRPReducer = (state = initialState, action) => {
    switch(action.type) {
        case constants.ECRP_LOADING :
          return {...state, ecrpLoader: true}
        case constants.ECRP_ERROR :
            return {...state, ecrpLoader: false, ecrpData: [], ecrpError: action.payload}
        case constants.ECRP_DATA :
            return {...state, ecrpLoader: false, ecrpData: action.payload, ecrpError: "", ecrpActionResponse: "", ecrpActionError: ""}
        case constants.ECRP_RESET_STORE :
            return {...state, ecrpLoader: false, ecrpData: [], ecrpError: ""}
        case constants.STORE_ECRP_HISTORY :
            return {...state, ecrpHistory: action.payload, ecrpLoader: false, ecrpHistoryError: ""}
        case constants.STORE_ECRP_HISTORY_ERROR :
            return {...state, ecrpHistoryError: action.payload, ecrpLoader: false, ecrpHistory: []}
        case constants.ECRP_ACTION_SUCCESS :
            return {...state, ecrpLoader: false, ecrpActionResponse: action.payload, ecrpSupervisorData: []}
        case constants.ECRP_ACTION_ERROR :
            return {...state, ecrpLoader: false, ecrpActionError: action.payload, ecrpSupervisorData: [], ecrpActionResponse: ""}
        default :
            return state
    }
}
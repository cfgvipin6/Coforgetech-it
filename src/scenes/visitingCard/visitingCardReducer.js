let constants = require('./constants');

const initialState = {
    visitingData: [],
    visitingError: "",
    visitingLoader: false,
    visitingHistory: [],
    visitingHistoryError: "",
    visitingSupervisorData: [],
    visitingActionResponse: "",
    visitingActionError: ""
}

export const VisitingCardReducer = (state = initialState, action) => {
    switch(action.type) {
        case constants.VISITING_LOADING :
          return {...state, visitingLoader: true}
        case constants.VISITING_ERROR :
            return {...state, visitingLoader: false, visitingData: [], visitingError: action.payload}
        case constants.VISITING_DATA :
            return {...state, visitingLoader: false, visitingData: action.payload, visitingError: "", visitingActionResponse: "", visitingActionError: ""}
        case constants.VISITING_RESET_STORE :
            return {...state, visitingLoader: false, visitingData: [], visitingError: ""}
        case constants.VISITING_HISTORY :
            return {...state, visitingHistory: action.payload, visitingLoader: false, visitingHistoryError: ""}
        case constants.VISITING_HISTORY_ERROR :
            return {...state, visitingHistoryError: action.payload, visitingLoader: false, visitingHistory: []}
        case constants.VISITING_ACTION_MSG :
            return {...state, visitingLoader: false, visitingActionResponse: action.payload, visitingSupervisorData: []}
        case constants.VISITING_ACTION_ERROR :
            return {...state, visitingLoader: false, visitingActionError: action.payload, visitingSupervisorData: [], visitingActionResponse: ""}
        case constants.VISITING_SUPERVISOR_DATA :
            return {...state, visitingLoader: false, visitingSupervisorData: action.payload}
        case constants.VISITING_RESET_SUPERVISOR_DATA :
            return {...state, visitingLoader: false, visitingSupervisorData: []}
        default :
            return state
    }
}
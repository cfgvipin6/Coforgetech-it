let constants = require('./constants');

const initialState = {
    travelAdvanceData: [],
    travelAdvanceError: "",
    travelAdvanceLoader: false,
    travelAdvanceHistory: [],
    travelAdvanceHistoryError: "",
    travelAdvanceApproverData: [],
    travelAdvanceActionResponse: "",
    travelAdvanceActionError: ""
}

export const TravelAdvanceReducer = (state = initialState, action) => {
    switch(action.type) {
        case constants.TRAVEL_ADVANCE_LOADING :
          return {...state, travelAdvanceLoader: true}
        case constants.TRAVEL_ADVANCE_ERROR :
            return {...state, travelAdvanceLoader: false, travelAdvanceData: [], travelAdvanceError: action.payload}
        case constants.TRAVEL_ADVANCE_DATA :
            return {...state, travelAdvanceLoader: false, travelAdvanceData: action.payload, travelAdvanceError: "", travelAdvanceActionResponse: "", travelAdvanceActionError: ""}
        case constants.TRAVEL_ADVANCE_RESET_STORE :
            return {...state, travelAdvanceLoader: false, travelAdvanceData: [], travelAdvanceError: ""}
        case constants.TRAVEL_ADVANCE_HISTORY :
            return {...state, travelAdvanceHistory: action.payload, travelAdvanceLoader: false, travelAdvanceHistoryError: ""}
        case constants.TRAVEL_ADVANCE_HISTORY_ERROR :
            return {...state, travelAdvanceHistoryError: action.payload, travelAdvanceLoader: false, travelAdvanceHistory: []}
        case constants.TRAVEL_ADVANCE_ACTION_MSG :
            return {...state, travelAdvanceLoader: false, travelAdvanceActionResponse: action.payload, travelAdvanceApproverData: []}
        case constants.TRAVEL_ADVANCE_ACTION_ERROR :
            return {...state, travelAdvanceLoader: false, travelAdvanceActionError: action.payload, travelAdvanceApproverData: [], travelAdvanceActionResponse: ""}
        case constants.TRAVEL_ADVANCE_APPROVER_DATA :
            return {...state, travelAdvanceLoader: false, travelAdvanceApproverData: action.payload}
        case constants.TRAVEL_ADVANCE_RESET_APPROVER_DATA :
            return {...state, travelAdvanceLoader: false, travelAdvanceApproverData: []}
        default :
            return state
    }
}
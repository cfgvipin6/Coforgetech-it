let constants = require('./constants');

const initialState = {
    exitData: [],
    exitError: "",
    exitLoader: false,
    exitHistory: [],
    exitHistoryError: "",
    detailData:[],
    exitSupervisorData: [],
    exitActionResponse: "",
    exitActionError: "",
    noticePeriod:"",
    exitDetailError:""
}

export const ExitReducer = (state = initialState, action) => {
    switch(action.type) {
        case constants.EXIT_LOADING :
          return {...state, exitLoader: true}
        case constants.EXIT_ERROR :
            return {...state, exitLoader: false, exitData: [], exitError: action.payload}
        case constants.EXIT_DETAIL_ERROR:
            return {...state, exitLoader: false,exitDetailError: action.payload}
        case constants.EXIT_DATA :
            return {...state, exitLoader: false, exitData: action.payload, exitError: "", exitActionResponse: "", exitActionError: ""}
        case constants.EXIT_RESET_STORE :
            return {...state, exitLoader: false, exitData: [], exitError: ""}
        case constants.EXIT_HISTORY :
            return {...state, exitHistory: action.payload, exitLoader: false, exitHistoryError: ""}
        case constants.EXIT_HISTORY_ERROR :
            return {...state, exitHistoryError: action.payload, exitLoader: false, exitHistory: []}
        case constants.DETAIL_DATA:
            return {...state,exitLoader:false,detailData:action.payload,exitError:""}
        case constants.EXIT_SUPERVISOR_DATA :
            return {...state, exitLoader: false, exitSupervisorData: action.payload}
        case constants.EXIT_RESET_SUPERVISOR_DATA :
            return {...state, exitLoader: false, exitSupervisorData: []}
        case constants.EXIT_ACTION_TAKEN_ERROR :
            return {...state, exitLoader: false, exitActionResponse:"", exitActionError: action.payload}
        case constants.EXIT_ACTION_TAKEN_SUCCESS :
            return {...state, exitLoader: false, exitActionResponse: action.payload, exitActionError: ""}
        case constants.RESET_DETAILS:
            return {...state,noticePeriod:"",exitDetailError:"",exitLoader:false,detailData:[]}
        case constants.STORE_NOTICE_PERIOD:
            return{...state, exitLoader:false, exitError:"",exitDetailError:"",exitActionError: "",noticePeriod:action.payload}
        default:
            return state
    }
}
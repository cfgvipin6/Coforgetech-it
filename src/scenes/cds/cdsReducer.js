let constants = require('./constants');

const initialState = {
    cdsData: [],
    cdsError: "",
    cdsLoader: false,
    cdsHistory: [],
    cdsHistoryError: "",
    cdsDetailData: [],
    cdsDetailError: "",
    cdsLineItemData: [],
    cdsLineItemError: "",
    cdsActionListData: [],
    cdsActionListError: "",
    cdsActionApproveData: [],
    cdsActionApproveError: "",
    cdsActionTakenResponse: "",
    cdsActionTakenError: ""
}

export const CDSReducer = (state = initialState, action) => {
    switch(action.type) {
        case constants.CDS_LOADING :
          return {...state, cdsLoader: true}
        case constants.CDS_ERROR :
            return {...state, cdsLoader: false, cdsData: [], cdsError: action.payload}
        case constants.CDS_DATA :
            return {...state, cdsLoader: false, cdsData: action.payload, cdsError: "", cdsActionResponse: "", cdsActionError: "", cdsActionTakenResponse: "", cdsActionTakenError: ""}
        case constants.CDS_RESET_STORE :
            // console.log("CDS_RESET_STORE")
            return {...state, cdsLoader: false, cdsData: [], cdsError: ""}
        case constants.CDS_HISTORY :
            return {...state, cdsHistory: action.payload, cdsLoader: false, cdsHistoryError: ""}
        case constants.CDS_HISTORY_ERROR :
            return {...state, cdsHistoryError: action.payload, cdsLoader: false, cdsHistory: []}
        case constants.CDS_DETAIL_ERROR :
            return {...state, cdsLoader: false, cdsDetailData:[], cdsDetailError: action.payload}
        case constants.CDS_DETAIL_DATA :
            return {...state, cdsLoader: false, cdsDetailData: action.payload, cdsDetailError: ""}
        case constants.CDS_DETAIL_RESET :
            return {...state, cdsLoader: false, cdsDetailData: [], cdsDetailError: ""}
        case constants.CDS_LINE_ITEM_ERROR :
            return {...state, cdsLoader: false, cdsLineItemData:[], cdsLineItemError: action.payload}
        case constants.CDS_LINE_ITEM_DATA :
            return {...state, cdsLoader: false, cdsLineItemData: action.payload, cdsLineItemError: ""}
        case constants.CDS_LINE_ITEM_RESET :
            // console.log("CDS_LINE_ITEM_RESET")
            return {...state, cdsLoader: false, cdsLineItemData: [], cdsLineItemError: ""}
        case constants.CDS_ACTION_LIST_ERROR :
            return {...state, cdsLoader: false, cdsActionListData:[], cdsActionListError: action.payload}
        case constants.CDS_ACTION_LIST_DATA :
            return {...state, cdsLoader: false, cdsActionListData: action.payload, cdsActionListError: ""}
        case constants.CDS_ACTION_LIST_RESET :
            return {...state, cdsLoader: false, cdsActionListData: [], cdsActionListError: ""} 
        case constants.CDS_ACTION_APPROVE_ERROR :
            return {...state, cdsLoader: false, cdsActionApproveData:[], cdsActionApproveError: action.payload}
        case constants.CDS_ACTION_APPROVE_DATA :
            // console.log("2222222222222")
            return {...state, cdsLoader: false, cdsActionApproveData: action.payload, cdsActionApproveError: ""}
        case constants.CDS_ACTION_APPROVE_RESET :
            return {...state, cdsLoader: false, cdsActionApproveData: [], cdsActionApproveError: ""}
        case constants.CDS_ACTION_TAKEN_ERROR :
                return {...state, cdsLoader: false, cdsActionTakenResponse:"", cdsActionTakenError: action.payload}
        case constants.CDS_ACTION_TAKEN_SUCCESS :
                return {...state, cdsLoader: false, cdsActionTakenResponse: action.payload, cdsActionTakenError: ""}
        default :
            return state
    }
}
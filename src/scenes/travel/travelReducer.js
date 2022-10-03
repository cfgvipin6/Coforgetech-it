import { STORE_TRAVEL_ACTION, TRAVEL_LOADING, TRAVEL_ACTION_LOADING, TRAVEL_ACTION_DATA, TRAVEL_ERROR_FROM_SERVER, STORE_TRAVEL_PENDING, RESET, ACTION_SUCCESS, NO_DATA, TRAVEL_ERROR, RESET_TRAVEL_HOME, STORE_ERROR, STORE_TRAVEL_HISTORY, STORE_TRAVEL_HISTORY_ERROR } from "./constants"

const initialState = {
    travelData:[],
    travelLoading:false,
    travelError:"",
    travelHistory: [],
    travelHistoryError: "",
    travelActionLoading:false,
    travelActionData:[],
    pendingTravelData:[],
    travelAction:"",
}
export const TravelReducer = (state = initialState , action) => {

    switch(action.type){
        case STORE_ERROR:
            return{...state, travelLoading:false,travelError:action.payload,travelData:[]}
        case RESET:
            return{...state,travelLoading:false,travelActionLoading:false,travelActionData:[],travelAction:"",pendingTravelData:[]}
        case RESET_TRAVEL_HOME:
            return{...state, travelLoading: false,travelError:"",travelData:[]}
        case TRAVEL_LOADING:
            // console.log('travel loading dispatched succesfully!')
            return {...state , travelLoading: action.payload}
        case STORE_TRAVEL_HISTORY :
            return {...state, travelHistory: action.payload, travelLoading: false, travelHistoryError: ""}
        case STORE_TRAVEL_HISTORY_ERROR :
            return {...state, travelHistoryError: action.payload, travelLoading: false, travelHistory: []}
        case STORE_TRAVEL_ACTION:
            return {...state, travelData:action.payload , travelLoading: false,travelAction:"",travelError:""}
        case TRAVEL_ERROR:
            return{...state,travelData:[],travelLoading:false,travelError:action.payload}
        case TRAVEL_ACTION_LOADING:
            return {...state, travelActionLoading:true}
        case TRAVEL_ACTION_DATA:
            return {...state, travelActionData: action.payload, travelActionLoading:false,travelAction:""}
        case STORE_TRAVEL_PENDING:
            // console.log('travel pending data dispatched succesfully!')
            return {...state, travelLoading:false, travelAction:"", pendingTravelData:action.payload}
        case TRAVEL_ERROR_FROM_SERVER:
            // console.log('travel error from server dispatched succesfully!')
            return {...state, travelLoading:false, travelAction:action.payload}
        case ACTION_SUCCESS:
            // console.log('Action success dispatched successfuly!');
            return{...state,travelLoading:false,travelAction:action.payload,travelActionData:[],pendingTravelData:[]}
        default:
            return state;
    }
}
import { RESET_IT_DESK, IT_DESK_LOADING, IT_DESK_DATA, IT_DESK_ERROR, IT_DESK_ACTION_DATA, RESET_IT_PENDING, IT_DESK_HISTORY_DATA } from "./constants"

const initialState = {
    itDeskPendingData:[],
    itDeskLoading:false,
    itDeskError:"",
    itDeskActionData:[],
    itDeskHistory:[]
}
export const ITDeskPendingReducer = (state = initialState , action) => {

    switch(action.type){
        case RESET_IT_DESK:
            return{...state,itDeskLoading:false,itDeskError:"",itDeskPendingData:[],itDeskActionData:[]}
        case IT_DESK_LOADING:
            return {...state,itDeskLoading:action.payload}
        case IT_DESK_DATA:
            return {...state,itDeskLoading:false,itDeskPendingData:action.payload}
        case IT_DESK_HISTORY_DATA:
            return {...state,itDeskLoading:false,itDeskHistory:action.payload}
        case IT_DESK_ACTION_DATA:
            return {...state,itDeskLoading:false,itDeskError:"",itDeskActionData:action.payload}
        case IT_DESK_ERROR:
            return {...state,itDeskLoading:false,itDeskActionData:[],itDeskPendingData:[],itDeskError:action.payload}
        default:
            return state;
    }
}
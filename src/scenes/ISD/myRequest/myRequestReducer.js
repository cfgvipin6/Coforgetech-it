import { MY_REQUEST_LOADING, MY_REQUEST_DATA,MY_REQUEST_ERROR, RESET_MY_REQUEST } from "./constants"

const initialState = {
    myRequestData:[],
    myRequestLoading:false,
    myRequestError:"",
}
export const ITDeskMyRequestReducer = (state = initialState , action) => {
    switch(action.type){
        case MY_REQUEST_LOADING:
            return {...state,myRequestLoading:action.payload}
        case MY_REQUEST_DATA:
            return {...state,myRequestLoading:false,myRequestData:action.payload}
        case MY_REQUEST_ERROR:
            return {...state,myRequestLoading:false,myRequestData:[],myRequestError:action.payload}
        case RESET_MY_REQUEST:
            return {...state,myRequestData:[], myRequestLoading:false, myRequestError:""}
        default:
            return state;
    }
}
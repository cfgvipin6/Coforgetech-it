import { STORE_TRAVEL_ACTION, TRAVEL_LOADING, TRAVEL_ACTION_LOADING, TRAVEL_ACTION_DATA, TRAVEL_ERROR_FROM_SERVER, STORE_TRAVEL_PENDING, RESET, ACTION_SUCCESS, NO_DATA, TRAVEL_ERROR, RESET_TRAVEL_HOME, STORE_ERROR, FAMILY_LOADING, STORE_FAMILY_DATA, FAMILY_ERROR, RESET_FAMILY } from "./constants"

const initialState = {
    familyData:[],
    familyLoading:false,
    familyError:"",
    blankData:false,
}
export const FamilyReducer = (state = initialState , action) => {

    switch(action.type){
        case FAMILY_LOADING:
            return {...state,familyLoading:action.payload}
        case STORE_FAMILY_DATA:
            return {...state,familyLoading:false,familyData:action.payload,blankData:true}
        case FAMILY_ERROR:
            return {...state,familyLoading:false,familyData:[],familyError:action.payload,blankData:false}
        case RESET_FAMILY:
            return {...state, familyLoading:false,familyData:[],familyError:"",blankData:false}
           default:
            return state;
    }
}
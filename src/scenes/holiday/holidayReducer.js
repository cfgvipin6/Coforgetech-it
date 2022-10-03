import { STORE_YEAR_LOCATION, RESET_HOLIDAY, HOLIDAY_LOADING, STORE_HOLIDAY_DATA, HOLIDAY_ERROR, RESET_HOLIDAY_FETCHED, NO_LEAVE_DATA } from "./constants"

const initialState = {
    yearData:[],
    locationData:[],
    holidayData:[],
    holidayLoading:false,
    holidayError:"",
    isNoLeaves:false,
}
export const HolidayReducer = (state = initialState , action) => {
    switch(action.type){
        case RESET_HOLIDAY_FETCHED:
            return{...state,isNoLeaves:false}
        case NO_LEAVE_DATA:
            return{...state,isNoLeaves:true,holidayLoading:false,holidayData:[]}
        case RESET_HOLIDAY:
            return{...state,isNoLeaves:false,holidayData:[],yearData:[],locationData:[],holidayLoading:false,holidayError:""}
        case STORE_YEAR_LOCATION:
            return{...state,isNoLeaves:false,holidayLoading:false,yearData:action.payload.Year,locationData:action.payload.Location}
        case HOLIDAY_LOADING:
            return {...state,isNoLeaves:false,holidayLoading:action.payload}
        case STORE_HOLIDAY_DATA:
            return {...state,isNoLeaves:false,holidayLoading:false,holidayData:action.payload}
        case HOLIDAY_ERROR:
            return {...state,isNoLeaves:false,holidayLoading:false,holidayData:[],holidayError:action.payload}
           default:
            return state;
    }
}
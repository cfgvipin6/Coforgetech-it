import {MY_VOUCHER_LOADING,MY_VOUCHER_ERROR, MY_VOUCHER_DATA, RESET_MY_VOUCHER} from "./constants"

const initialState = {
    myVoucherData:[],
    myVoucherLoading:false,
    myVoucherError:"",
}
export const MyVoucherReducer = (state = initialState , action) => {
    switch(action.type){
        case MY_VOUCHER_LOADING:
            return {...state,myVoucherLoading:action.payload}
        case MY_VOUCHER_DATA:
            return {...state,myVoucherLoading:false,myVoucherData:action.payload}
        case MY_VOUCHER_ERROR:
            return {...state,myVoucherLoading:false,myVoucherData:[],myVoucherError:action.payload}
        case RESET_MY_VOUCHER:
            return {...state,myVoucherData:[], myVoucherLoading:false, myVoucherError:""}
        default:
            return state;
    }
}
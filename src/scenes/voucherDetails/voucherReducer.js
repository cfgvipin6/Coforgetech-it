import { VOUCHER_ERROR, RESET_VOUCHER, VOUCHER_LOADING, STORE_VOUCHER, SUBMIT_ACTION_SUCCESS } from './constants';

const initialState = {
    voucherData:[],
    voucherLoading:false,
    voucherError:'',
    voucherUSSubmitAction: '',
};
export const VoucherReducer = (state = initialState , action) => {

    switch (action.type){
        case VOUCHER_ERROR:
            return {...state, voucherLoading:false,voucherError:action.payload,voucherData:[],voucherUSSubmitAction:''};
        case RESET_VOUCHER:
            return {...state,voucherLoading:false,voucherData:[],voucherError:'',voucherUSSubmitAction:''};
        case VOUCHER_LOADING:
            return {...state,voucherLoading: true};
        case STORE_VOUCHER:
            return {...state,voucherData:action.payload,voucherLoading:false,voucherError:'',voucherUSSubmitAction:''};
        case SUBMIT_ACTION_SUCCESS:
            return {...state,voucherLoading:false,voucherError:'',voucherData:[],voucherUSSubmitAction:action.payload};
        default:
            return state;
    }
};

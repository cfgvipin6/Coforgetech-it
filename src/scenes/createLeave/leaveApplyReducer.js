import { APPLY_LEAVE_LOADING, CREATE_LEAVE_ERROR, STORE_CREATE_LEAVE_DATA, STORE_EMP_DATA, RESET_CREATE_LEAVE, STORE_TOTAL_LEAVE, SUBMIT_LEAVE, RESET_SUBMIT_DATA, RESET_ERROR_DATA } from './constants';

const initialState = {
    applyLeaveData:[],
    applyLeaveLoading:false,
    applyLeaveError:'',
    empData:[],
    storedLeaves:'',
    submittedAction:[],
};
export const leaveApplyReducer = (state = initialState,action)=>{
    switch (action.type){
        case RESET_SUBMIT_DATA:
            return {...state,submittedAction:[]};
        case RESET_ERROR_DATA:
                return {...state,applyLeaveError:'',applyLeaveLoading:false};
        case RESET_CREATE_LEAVE:
            return {...state,applyLeaveData:[],empData:[],applyLeaveLoading:false,applyLeaveError:'',storedLeaves:'',submittedAction:[]};
        case APPLY_LEAVE_LOADING:
            return {...state,applyLeaveLoading:action.payload};
        case CREATE_LEAVE_ERROR:
            return {...state,applyLeaveLoading:false,applyLeaveError:action.payload};
        case STORE_CREATE_LEAVE_DATA:
            return {...state,applyLeaveLoading:false,applyLeaveError:'',applyLeaveData:action.payload};
        case STORE_TOTAL_LEAVE:
            return {...state,applyLeaveLoading:false,applyLeaveError:'',storedLeaves:action.payload};
        case STORE_EMP_DATA:
            return {...state, applyLeaveLoading:false,applyLeaveError:'',empData:action.payload};
        case SUBMIT_LEAVE:
            return {...state,applyLeaveLoading:false,empData:[],applyLeaveError:'',submittedAction:action.payload};
        default:
            return state;
    }
};

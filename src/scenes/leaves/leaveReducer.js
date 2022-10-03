import {RESET_LEAVE,LEAVE_LOADING,STORE_LEAVE_DATA,LEAVE_ERROR, STORE_SUPERVISOR, RESET_SUPERVISOR, RESET_LEAVE_ACTION, STORE_LEAVE_SUBMIT_DATA, STORE_LEAVE_HISTORY, STORE_LEAVE_HISTORY_ERROR } from './constants';

const initialState = {
    leaveData:[],
    superVisorData:[],
    leaveHistory: [],
    leaveReversalHistory:[],
    leaveHistoryError: '',
    submissionData:'',
    leaveLoading:false,
    leaveError:'',
    blankData:false,
};
export const LeaveReducer = (state = initialState , action) => {

    switch (action.type){
        case RESET_LEAVE_ACTION:
            return {...state,leaveLoading:false,leaveError:'',superVisorData:[],submissionData:''};
        case RESET_LEAVE:
            return {...state,leaveData:[],leaveLoading:false,leaveError:'',blankData:false};
        case LEAVE_LOADING:
            return {...state,leaveLoading:action.payload};
        case STORE_LEAVE_DATA:
            return {...state,leaveLoading:false,leaveData:action.payload,blankData:true};
        case LEAVE_ERROR:
            return {...state,leaveLoading:false,leaveData:[],leaveError:action.payload,blankData:false};
        case STORE_LEAVE_HISTORY :
                return {...state, leaveHistory: action.payload.Leave, leaveReversalHistory: action.payload.ReversalLeave, leaveLoading: false, leaveHistoryError: ''};
        case STORE_LEAVE_HISTORY_ERROR :
                return {...state, leaveHistoryError: action.payload, leaveLoading: false, leaveHistory: [], leaveReversalHistory: []};
        case STORE_SUPERVISOR:
            return {...state,leaveLoading:false,superVisorData:action.payload};
        case STORE_LEAVE_SUBMIT_DATA:
            return {...state,leaveLoading:false,submissionData:action.payload,superVisorData:[]};
        case RESET_SUPERVISOR:
            return {...state,leaveLoading:false,superVisorData:[]};
        default:
            return state;
    }
};

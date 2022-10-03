import {STORE_COMMUNICATION_ACTION,COMM_PENDING,STORE_PENDING_ERROR,RESET_COMM_STORE} from './constants'
const initialState = {
    communicationData:[],
    comm_pending:false,
    comm_error:"",
    
}
export const CommunicationReducer = (state = initialState ,  action) => {
    switch(action.type){
        case STORE_COMMUNICATION_ACTION:
            return {...state, communicationData: action.payload, comm_pending:false}
        case COMM_PENDING:
                return{...state, comm_pending:true}
        case STORE_PENDING_ERROR:
                return{...state, comm_error:action.payload,comm_pending: false}
        case RESET_COMM_STORE:
                return{...state, comm_error:"",comm_pending: false,communicationData:[]}       
        default:
                return state
    }
}
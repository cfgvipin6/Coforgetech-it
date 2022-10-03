import { RESET_GRATUITY_STORE,GRATUITY_PENDING, STORE_GRATUITY_ACTION, STORE_GRATUITY_ERROR } from './constants';
const initialState = {
    gratuityData:[],
    gratuity_pending:false,
    gratuity_error:'',

};
export const GratuityReducer = (state = initialState ,  action) => {
    switch (action.type){
        case STORE_GRATUITY_ACTION:
            return {...state, gratuityData:action.payload, gratuity_pending:false};
        case GRATUITY_PENDING:
                return {...state, gratuity_pending:true};
        case STORE_GRATUITY_ERROR:
                return {...state, gratuity_error:action.payload,gratuity_pending: false};
        case RESET_GRATUITY_STORE:
                return {...state, gratuity_error:'',gratuity_pending: false,gratuityData:[]};
        default:
                return state;
    }
};

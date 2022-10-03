import { APP_VERSION, AUTH_LOADING, MODAL_AUTH_LOADING, STORE_VERSION_ERROR } from "./constants"

const initialState={
    authLoading:false,
    modal_auth_loading:false,
    version:"",
    error:""
}
export const AuthReducer = (state = initialState ,  action) => {
    switch(action.type){
        case APP_VERSION:
            return{...state,version:action.payload,authLoading:false,error:""}
        case AUTH_LOADING:
                return{...state, authLoading:action.payload}
        case MODAL_AUTH_LOADING:
                return{...state, modal_auth_loading:action.payload}
        case STORE_VERSION_ERROR:{
            return{...state, modal_auth_loading:action.payload,error:action.payload}
        }
        default:
                return state
    }
}
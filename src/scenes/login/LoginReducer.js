import {
  LOGIN_ACTION,
  LOGIN_LOADING,
  MODAL_LOADING,
  APP_VERSION,
  LOGIN_DATA_CLEAR,
} from './constants';
const initialState = {
  loginData: [],
  login_loading: false,
  modal_loading: false,
  version: '',
};
export default (LoginReducer = (state = initialState, action) => {
  switch (action.type) {
    case APP_VERSION:
      return {
        ...state,
        version: action.payload,
        login_loading: false,
        modal_loading: false,
      };
    case LOGIN_ACTION:
      return { ...state, loginData: action.payload, login_loading: false };
    case LOGIN_LOADING:
      return { ...state, login_loading: action.payload };
    case MODAL_LOADING:
      return { ...state, modal_loading: action.payload };
    case LOGIN_DATA_CLEAR:
      // console.log("Logged in user is clear.")
      return { state: undefined };
    // return{...state,loginData:[],login_loading:false,modal_loading:false,version:""}
    default:
      return state;
  }
});

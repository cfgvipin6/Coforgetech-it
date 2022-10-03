let constants = require("./constants")

const initialState = {
  firstAdData: [],
  secondAdData: [],
  adError: "",
  adLoading: false
}

export const WebReducer = (state = initialState, action) => {
  switch (action.type) {
    case constants.REMOVE_LOADER:
      return { ...state, adLoading: false }
    case constants.CLEAR_USER_DATA:
      return { ...state, firstAdData: [], adError: "", adLoading: false }
    case constants.AD_LOADING:
      return { ...state, adLoading: action.payload }
    case constants.AD_ERROR:
      return { ...state, adLoading: false, firstAdData: [], adError: action.payload }
    case constants.AD_RESPONSE:
      return { ...state, adLoading: false, firstAdData: action.payload, adError: "" }
    default:
      return state
  }
}

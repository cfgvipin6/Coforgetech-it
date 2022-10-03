let constants = require('./constants');

const initialState = {
    eesData: [],
    eesError: "",
    eesLoader: false,
    eesSaveData: [],
    eesSaveError: "",
}

export const EESReducer = (state = initialState, action) => {
    switch(action.type) {
        case constants.EES_LOADING :
          return {...state, eesLoader: true}
        case constants.EES_ERROR :
            return {...state, eesLoader: false, eesData: [], eesError: action.payload}
        case constants.EES_DATA :
            return {...state, eesLoader: false, eesData: action.payload, eesError: "", eesSaveData: [], eesSaveError: ""}
        case constants.EES_RESET_STORE :
            return {...state, eesLoader: false, eesData: [], eesError: ""}
        case constants.EES_SAVE_ERROR :
            return {...state, eesLoader: false, eesSaveData: [], eesSaveError: action.payload}
        case constants.EES_SAVE_DATA :
            return {...state, eesLoader: false, eesSaveData: action.payload, eesSaveError: ""}
        default :
            return state
    }
}

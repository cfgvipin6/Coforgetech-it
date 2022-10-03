let constants = require('./constants')

let initialState = {
    addressResponse: [],
    addressLoader: false,
    addressError: "",
}

export const AddressReducer = (state = initialState, action) => {
    switch(action.type) {
        case constants.RESET_ADDRESS:
            return{...state,addressLoader:false,addressResponse:[],addressError:""}
        case constants.ADDRESS_LOADING :
            return {...state, addressLoader: true}
        case constants.ADDRESS_INFO_LIST :
            return {...state, addressResponse: action.payload, addressLoader: false, addressError: ""}
        case constants.ADDRESS_INFO_ERROR :
            return {...state, addressError: action.payload, addressLoader: false, addressResponse: []}
        case constants.ADDRESS_RESET :
            return {...state, addressError: "", addressLoader: false, addressResponse: []}
        default :
            return state
    }
}
import { fetchPOSTMethod } from '../../utilities/fetchService'
import properties from '../../resource/properties'
import { netInfo } from "../../utilities/NetworkInfo"
import { NO_INTERNET, UNDEFINED_MESSAGE } from "../../GlobalConstants"
let constants = require('./constants');

const addressException = (message) => {
    return {
        type: constants.ADDRESS_INFO_ERROR,
        payload: message
    }
}

const addressInfoList = (data) => {
    return {
        type: constants.ADDRESS_INFO_LIST,
        payload: data
    }
}

const loading = () => {
    return {
        type: constants.ADDRESS_LOADING
    }
}

export const resetAddress=()=>{
    return{
        type: constants.ADDRESS_RESET
    }
}
export const resetAddressData=()=>{
    return{
        type:constants.RESET_ADDRESS
    }
}

export const userInfo= (loginData) => {
    return async (dispatch) => {
        let isNetwork = await netInfo();
        if(isNetwork) {
            try {
            dispatch(loading())
            let form = new FormData()
            form.append("ECSerp", loginData.SmCode);
            form.append("AuthKey", loginData.Authkey);
            let url = properties.addressInfoUrl;
            let addressResponse = await fetchPOSTMethod(url,form)
            console.log("Address response is ", addressResponse);
                if(addressResponse.length != undefined) {
                    // console.log("address response :::",addressResponse)
                    if(addressResponse.length ===1 && addressResponse[0].hasOwnProperty("Exception")) {
                        // console.log("address exception :::",addressResponse)
                        dispatch(addressException(addressResponse[0].Exception))
                    } else {
                        // console.log("valid address response :::",addressResponse)
                        dispatch(addressInfoList(addressResponse))
                    }
                }
            } 
            catch (error) {
                // console.log("Inside error block of address",error)
                dispatch(addressException(UNDEFINED_MESSAGE))
            }
        } else {
            return alert(NO_INTERNET)
        }
    } 
}
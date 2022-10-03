import { NO_INTERNET, UNDEFINED_MESSAGE} from "../../../GlobalConstants"
import properties from "../../../resource/properties"
import { netInfo } from "../../../utilities/NetworkInfo"
import { fetchPOSTMethod } from "../../../utilities/fetchService"
import {MY_VOUCHER_LOADING,MY_VOUCHER_ERROR, MY_VOUCHER_DATA, RESET_MY_VOUCHER} from "./constants"
const loading = (data) => {
	return {
		type: MY_VOUCHER_LOADING,
		payload: data,
	}
}

const myVoucherError = (data) => {
	return {
		type: MY_VOUCHER_ERROR,
		payload: data,
	}
}

const myVoucherData = (data) => {
	return {
		type: MY_VOUCHER_DATA,
		payload: data,
	}
}
export const resetMyRequests = () => {
	console.log("Resetting my request")
	return {
		type: RESET_MY_VOUCHER,
	}
}
export const getMyRequestsData =(userId, authKey, isPullToRefreshActive)=>{
    return async (dispatch) => {
		let isNetwork = await netInfo()
		if (isNetwork) {
			try {
				if (!isPullToRefreshActive) {
					dispatch(loading(true))
				}
				let url = properties.myVouchers
				let form = new FormData()
				form.append("ECSerp", userId)
				form.append("Authkey", authKey)
				form.append("Stab", "DOCUMENT")
				form.append("VouType", "")
				let response = await fetchPOSTMethod(url, form)
				if (response.length != undefined) {
					if (response.length === 1 && response[0].hasOwnProperty("Exception")) {
						console.log("Exception from My vouchers is : ", response)
						dispatch(myVoucherError(response[0].Exception))
					} else {
						console.log("My Voucher respopnse from server is : ", response)
						if(response.length===0){
							let msg = "No Voucher found !"
							dispatch(myVoucherError(msg));
						}
						dispatch(myVoucherData(response))
					}
				} else {
					dispatch(myVoucherError(UNDEFINED_MESSAGE))
				}
			} catch (error) {
				dispatch(myVoucherError(UNDEFINED_MESSAGE))
			}
		} else {
			return alert(NO_INTERNET)
		}
	}
}
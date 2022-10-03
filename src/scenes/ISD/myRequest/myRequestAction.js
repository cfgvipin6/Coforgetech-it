import { NO_INTERNET, UNDEFINED_MESSAGE, MY_REQUEST_IT_DESK } from "../../../GlobalConstants"
import properties from "../../../resource/properties"
import { netInfo } from "../../../utilities/NetworkInfo"
import { fetchPOSTMethod } from "../../../utilities/fetchService"
import {MY_REQUEST_LOADING,MY_REQUEST_ERROR, MY_REQUEST_DATA, RESET_MY_REQUEST} from "./constants"
const loading = (data) => {
	return {
		type: MY_REQUEST_LOADING,
		payload: data,
	}
}

const itDeskError = (data) => {
	return {
		type: MY_REQUEST_ERROR,
		payload: data,
	}
}

const itDeskData = (data) => {
	return {
		type: MY_REQUEST_DATA,
		payload: data,
	}
}
export const resetMyRequests = () => {
	console.log("Resetting my request")
	return {
		type: RESET_MY_REQUEST,
	}
}
export const getMyRequestsData =(userId, authKey, isPullToRefreshActive)=>{
    console.log("Going to my requests")
    return async (dispatch) => {
		let isNetwork = await netInfo()
		if (isNetwork) {
			try {
				if (!isPullToRefreshActive) {
					dispatch(loading(true))
				}
				let url = properties.getMyRequestsITDesk
				let form = new FormData()
				form.append("ECSerp", userId)
				form.append("Authkey", authKey)
				console.log("Data to append is ", form)
				let response = await fetchPOSTMethod(url, form)
                console.log("Response from server is ", response)
				if (response.length != undefined) {
					if (response.length === 1 && response[0].hasOwnProperty("Exception")) {
						console.log("Exception from IT Desk is : ", response)
						dispatch(itDeskError(response[0].Exception))
					} else {
						console.log("IT Desk respopnse from server is : ", response)
						if(response.length===0){
							let msg = "No requests found !"
							dispatch(itDeskError(msg));
						}
						dispatch(itDeskData(response))
					}
				} else {
					dispatch(itDeskError(UNDEFINED_MESSAGE))
				}
			} catch (error) {
				dispatch(itDeskError(UNDEFINED_MESSAGE))
			}
		} else {
			return alert(NO_INTERNET)
		}
	}
}
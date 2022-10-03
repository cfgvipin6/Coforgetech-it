import { NO_INTERNET, UNDEFINED_MESSAGE } from '../../../GlobalConstants';
import properties from '../../../resource/properties';
import { netInfo } from '../../../utilities/NetworkInfo';
import { fetchPOSTMethod } from '../../../utilities/fetchService';
import moment from 'moment';
import {
	IT_DESK_LOADING,
	IT_DESK_ERROR,
	IT_DESK_DATA,
	RESET_IT_DESK,
	IT_DESK_ACTION_DATA,
	RESET_IT_PENDING,
	IT_DESK_HISTORY_DATA,
} from './constants';
let UserId;
let AuthKey;
const loading = (data) => {
	return {
		type: IT_DESK_LOADING,
		payload: data,
	};
};
const itDeskError = (data) => {
	return {
		type: IT_DESK_ERROR,
		payload: data,
	};
};
const itDeskData = (data) => {
	return {
		type: IT_DESK_DATA,
		payload: data,
	};
};

const itDeskHistoryData = (data) =>{
	return {
		type: IT_DESK_HISTORY_DATA,
		payload: data,
	};
};

const itDeskActionData = (data) => {
	return {
		type: IT_DESK_ACTION_DATA,
		payload: data,
	};
};

export const resetITDesk = () => {
	return {
		type: RESET_IT_DESK,
	};
};
export const getITHistory = (userId, authKey,documentId)=>{
	return async (dispatch) => {
		let isNetwork = await netInfo();
		if (isNetwork) {
			try {
				let url = properties.itHistory;
				let form = new FormData();
				form.append('Authkey', authKey);
				form.append('id', documentId);
				form.append('ECSerp', userId);
				form.append('isMobileREquest', 2);
				let response = await fetchPOSTMethod(url, form);
				console.log('Response from server is ', response);
				if (response.length != undefined) {
					if (response.length === 1 && response[0].hasOwnProperty('Exception')) {
						console.log('Exception from IT Desk is : ', response);
						dispatch(itDeskError(response[0].Exception));
					} else {
						console.log('IT Desk respopnse from server is : ', response);
						dispatch(itDeskHistoryData(response));
					}
				} else {
					dispatch(itDeskError(UNDEFINED_MESSAGE));
				}
			} catch (error) {
				dispatch(itDeskError(UNDEFINED_MESSAGE));
			}
		} else {
			return alert(NO_INTERNET);
		}
	};
};
export const approveITPendingRecord = (userId, authKey, record, remarks, action) => {
	return async (dispatch) => {
		let isNetwork = await netInfo();
		if (isNetwork) {
			try {
				if (!isPullToRefreshActive) {
					dispatch(loading(true));
				}
				let url = properties.approveITPendingRecords;
				let form = new FormData();
				let jsonData = createJson(record, remarks, action);
				console.log('JSON created data is ', jsonData);
				form.append('ECSerp', userId);
				form.append('Authkey', authKey);
				form.append('servicerequest', JSON.stringify(jsonData));
				console.log('Data to append is ', form);
				let response = await fetchPOSTMethod(url, form);
				console.log('Response from server is ', response);
				if (response.length != undefined) {
					if (response.length === 1 && response[0].hasOwnProperty('Exception')) {
						console.log('Exception from IT Desk is : ', response);
						dispatch(itDeskError(response[0].Exception));
					} else {
						console.log('IT Desk respopnse from server is : ', response);
						dispatch(itDeskActionData(response));
					}
				} else {
					dispatch(itDeskError(UNDEFINED_MESSAGE));
				}
			} catch (error) {
				dispatch(itDeskError(UNDEFINED_MESSAGE));
			}
		} else {
			return alert(NO_INTERNET);
		}
	};
};
export const getITServicePendingRecords = (userId, authKey, isPullToRefreshActive) => {
	return async (dispatch) => {
		UserId = userId;
		AuthKey = authKey;
		let isNetwork = await netInfo();
		if (isNetwork) {
			try {
				if (!isPullToRefreshActive) {
					dispatch(loading(true));
				}
				let url = properties.getITPendingRecords;
				let form = new FormData();
				form.append('ECSerp', UserId);
				form.append('AuthKey', AuthKey);
				let response = await fetchPOSTMethod(url, form);
				if (response.length != undefined) {
					if (response.length === 1 && response[0].hasOwnProperty('Exception')) {
						console.log('Exception from IT Desk is : ', response);
						dispatch(itDeskError(response[0].Exception));
					} else {
						console.log('IT Desk respopnse from server is : ', response);
						if (response.length === 0){
							let msg = 'No records found !';
							dispatch(itDeskError(msg));
						}
						dispatch(itDeskData(response));
					}
				} else {
					dispatch(itDeskError(UNDEFINED_MESSAGE));
				}
			} catch (error) {
				dispatch(itDeskError(UNDEFINED_MESSAGE));
			}
		} else {
			return alert(NO_INTERNET);
		}
	};
}; //empNameCode.substring(0, empNameCode.indexOf(":")).trim(),
const createJson = (record, remark, action) => {
	let data;
	let pendingTo =
		record.TeamMemberID !== undefined && record.TeamMemberID !== null && record.TeamMemberID !== ''
			? record.TeamMemberID
			: '';
  let pastDate = moment(record.ModifiedOn, 'DD-MMM-YYYY');
  let currentDate  = moment(moment(new Date()), 'DD-MM-YYYY');
  let days = currentDate.diff(pastDate, 'days');
  console.log('Days found is ',days);
	let lstApproverDataArray = [];
	let recordItem = {};
	recordItem.RequestId = parseInt(record.RequestID);
	recordItem.pendingTo = pendingTo;
	recordItem.teamID = record.TeamID;
	recordItem.TeamMemberID = pendingTo;
	recordItem.pendingFrom = record.RequesterName.substring(
		0,
		record.RequesterName.indexOf(':')
	).trim();
	recordItem.ToStatus = action === 'APPROVE' ? 3 : 0; // 3  for approve 0 for reject action
	recordItem.FromStatus = record.RequestStatus;
	recordItem.TimeTaken = days;
	recordItem.RemarksType = 1; // Always fixed confirmed with Sonam.
	recordItem.Remark = remark;
	lstApproverDataArray.push(recordItem);
	data = {
		lstApproverData: lstApproverDataArray,
	};
	return data;
};

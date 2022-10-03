import { NO_INTERNET, UNDEFINED_MESSAGE } from '../../../GlobalConstants';
import properties from '../../../resource/properties';
import { netInfo } from '../../../utilities/NetworkInfo';
import { fetchPOSTMethod } from '../../../utilities/fetchService';

export const getSurveyQuestions = async(userId, authKey, successCallBack, errorCallBack)=>{
		let isNetwork = await netInfo();
		if (isNetwork) {
			try {
				let url = properties.getITDeskSurveyQuestions;
				let form = new FormData();
				form.append('ECSerp', userId);
				form.append('Authkey', authKey);
				console.log('Data to append is ', form);
				let response = await fetchPOSTMethod(url, form);
                console.log('IT desk survey questions from server is :  ', response);
					if (response[0]?.hasOwnProperty('Exception')) {
						console.log('Exception from IT Desk survery questions is : ', response);
						errorCallBack(response[0].Exception);
					} else if (response?.Answer?.length > 0){
                        successCallBack(response);
                    }

			} catch (error) {
				errorCallBack(UNDEFINED_MESSAGE);
			}
		} else {
			return alert(NO_INTERNET);
		}
};


export const getHRSurveyQuestions = async(userId, authKey, successCallBack, errorCallBack)=>{
	let isNetwork = await netInfo();
	if (isNetwork) {
		try {
			let url = properties.hrSurveyQuestions;
			let form = new FormData();
			form.append('ECSerp', userId);
			form.append('Authkey', authKey);
			console.log('Data to append is ', form);
			let response = await fetchPOSTMethod(url, form);
			console.log('HR Desk survey questions from server is :  ', response);
				if (response[0]?.hasOwnProperty('Exception')) {
					console.log('Exception from HR Desk survery questions is : ', response);
					errorCallBack(response[0].Exception);
				} else if (response?.Question?.length > 0){
					successCallBack(response);
				}

		} catch (error) {
			errorCallBack(UNDEFINED_MESSAGE);
		}
	} else {
		return alert(NO_INTERNET);
	}
};


export const submitSuveryQuestions = async(userId, authKey, successCallBack, errorCallBack, data)=>{
	console.log('Data to submit is : ',data);
	let isNetwork = await netInfo();
	if (isNetwork) {
		try {
			let url = properties.submitSurveyQuestions;
			let form = new FormData();
			form.append('ECSerp', userId);
			form.append('Authkey', authKey);
			form.append('SurveyQuestion', JSON.stringify(data));
			console.log('Data to append is ', form);
			let response = await fetchPOSTMethod(url, form);
			console.log('IT desk submit response is  :  ', response);
				if (response[0]?.hasOwnProperty('Exception')) {
					console.log('Exception from IT Desk survery questions is : ', response);
					errorCallBack(response[0].Exception);
				} else if ( response[0]?.message?.length > 0 && response[0]?.message == 'Success'){
					successCallBack(response[0].message);
				}
				else if (response[0]?.message?.length > 0 ) {
					errorCallBack(response[0].message);
				}

		} catch (error) {
			errorCallBack(UNDEFINED_MESSAGE);
		}
	} else {
		return alert(NO_INTERNET);
	}
};

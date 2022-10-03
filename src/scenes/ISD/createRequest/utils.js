import { netInfo } from '../../../utilities/NetworkInfo';
import properties from '../../../resource/properties';
import { fetchPOSTMethod, post } from '../../../utilities/fetchService';
import { connect } from 'react-redux';
let globalConstants = require('../../../GlobalConstants');
import { AppStore } from '../../../../AppStore';
import { RecyclerViewBackedScrollViewBase } from 'react-native';


export const getISD_SurveyQuestions = async () => {
    let isNetwork = await netInfo();
    if (isNetwork) {
      let formData = new FormData();
      const loginData = AppStore.getState().loginReducer.loginData;
      formData.append('ECSerp', loginData.SmCode);
      formData.append('AuthKey', loginData.Authkey);
      let url = properties.getISD_SurveyQuestion;
      let myResponse = await fetchPOSTMethod(url, formData);
      let response = Array.isArray(myResponse) ? myResponse : [myResponse];
      // response = [{StatusCode: 500, Exception: "Error occurred while accessing data in DataAccessCommonServices.GetDataSetByProc()"}]
      console.log('ISd Survey response =======>',response);
      if (response.length != undefined) {
        if (response.length === 1 && response[0].hasOwnProperty('Exception')) {
          throw response[0].Exception;
        } else {
          return response;
        }
      } else if (response.length === undefined || response.length === 0 || response === null || response === undefined) {
        throw (globalConstants.UNDEFINED_MESSAGE);
      }
    } else {
      throw (globalConstants.NO_INTERNET);
    }
};

export const submitIsdSuveryQuestions = async (surveyData) => {
  let isNetwork = await netInfo();
  if (isNetwork) {
    let formData = new FormData();
    const loginData = AppStore.getState().loginReducer.loginData;
    // formData.append("ECSerp", loginData.SmCode);
    // formData.append("AuthKey", loginData.Authkey);
    // formData.append("Data", JSON.stringify(surveyData));
    let url = properties.submitISDSurvey;
    let myResponse = await post(url, surveyData);
    let response = Array.isArray(myResponse) ? myResponse : [myResponse];
    // response = [{StatusCode: 500, Exception: "Error occurred while accessing data in DataAccessCommonServices.GetDataSetByProc()"}]
    console.log('ISd submit Survey response =======>',response);
    if (response.length != undefined) {
      if (response.length === 1 && response[0].hasOwnProperty('Exception')) {
        throw response[0].Exception;
      } else {
        return response;
      }
    } else if (response.length === undefined || response.length === 0 || response === null || response === undefined) {
      throw (globalConstants.UNDEFINED_MESSAGE);
    }
  } else {
    throw (globalConstants.NO_INTERNET);
  }
};

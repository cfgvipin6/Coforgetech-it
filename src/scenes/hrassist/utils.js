import { netInfo } from '../../utilities/NetworkInfo';
import properties from '../../resource/properties';
import { fetchPOSTMethod, post } from '../../utilities/fetchService';
import { connect } from 'react-redux';
let globalConstants = require('../../GlobalConstants');
import { AppStore } from './../../../AppStore';
import { RecyclerViewBackedScrollViewBase } from 'react-native';
import { base64File, getISDFiles } from '../ISD/Attachment/AttachmentView';
import RNFetchBlob from 'rn-fetch-blob';

export const CAT_REQUIRED = 'Please select Category!';
export const SUB_CAT_REQUIRED  = 'Please select SubCategory!';
export const SUBJECT_REQUIRED  = 'Please enter subject!';
export const DESC_REQUIRED = 'Please enter question!';
export const MOB_REQUIRED = 'Please select mobile number!';
export const REMARK_REQUIRED = 'Please put some remarks!';
export const FILES_REQUIRED = 'Please put some remarks!';
export const getMyRequestDetail = async (encID, successCallBack, errorCallBack) => {
  let isNetwork = await netInfo();
  if (isNetwork) {
    let formData = new FormData();
    const loginData = AppStore.getState().loginReducer.loginData;
    formData.append('QueryID', encID);
    formData.append('ECSerp', loginData.SmCode);
    formData.append('AuthKey', loginData.Authkey);
    let url = properties.getMyTicketDetail;
    let myResponse = await fetchPOSTMethod(url, formData);
    let response = Array.isArray(myResponse) ? myResponse : [myResponse];
    // response = [{StatusCode: 500, Exception: "Error occurred while accessing data in DataAccessCommonServices.GetDataSetByProc()"}]
    console.log('HR  My ticket detail response =======>',response);
    if (response.length != undefined) {
      if (response.length === 1 && response[0].hasOwnProperty('Exception')) {
           errorCallBack(response[0].Exception);
      } else {
          successCallBack(response);
      }
    } else if (response.length === undefined || response.length === 0 || response === null || response === undefined) {
      throw (globalConstants.UNDEFINED_MESSAGE);
    }
  } else {
    throw (globalConstants.NO_INTERNET);
  }
};

export const getHREmpDetails = async (successCallBack, errorCallBack) => {
    let isNetwork = await netInfo();
    if (isNetwork) {
      let formData = new FormData();
      const loginData = AppStore.getState().loginReducer.loginData;
      formData.append('ECSerp', loginData.SmCode);
      formData.append('AuthKey', loginData.Authkey);
      let url = properties.getHREmpDetails;
      let myResponse = await fetchPOSTMethod(url, formData);
      let response = Array.isArray(myResponse) ? myResponse : [myResponse];
      // response = [{StatusCode: 500, Exception: "Error occurred while accessing data in DataAccessCommonServices.GetDataSetByProc()"}]
      console.log('HR  emp detail response =======>',response);
      if (response.length != undefined) {
        if (response.length === 1 && response[0].hasOwnProperty('Exception')) {
             errorCallBack(response[0].Exception);
        } else {
            successCallBack(response);
        }
      } else if (response.length === undefined || response.length === 0 || response === null || response === undefined) {
        throw (globalConstants.UNDEFINED_MESSAGE);
      }
    } else {
      throw (globalConstants.NO_INTERNET);
    }
};

export const getHRSubCategory = async (catID,successCallBack, errorCallBack) => {
  let isNetwork = await netInfo();
  if (isNetwork) {
    let formData = new FormData();
    const loginData = AppStore.getState().loginReducer.loginData;
    formData.append('ECSerp', loginData.SmCode);
    formData.append('AuthKey', loginData.Authkey);
    formData.append('CategoryId', catID);
    let url = properties.getHRSubCategory;
    let myResponse = await fetchPOSTMethod(url, formData);
    let response = Array.isArray(myResponse) ? myResponse : [myResponse];
    // response = [{StatusCode: 500, Exception: "Error occurred while accessing data in DataAccessCommonServices.GetDataSetByProc()"}]
    console.log('HR  Subcategory response =======>',response);
    if (response.length != undefined) {
      if (response.length === 1 && response[0].hasOwnProperty('Exception')) {
           errorCallBack(response[0].Exception);
      } else {
          successCallBack(response);
      }
    } else if (response.length === undefined || response.length === 0 || response === null || response === undefined) {
      throw (globalConstants.UNDEFINED_MESSAGE);
    }
  } else {
    throw (globalConstants.NO_INTERNET);
  }
};

export const getHRCategory = async (successCallBack, errorCallBack) => {
    let isNetwork = await netInfo();
    if (isNetwork) {
      let formData = new FormData();
      const loginData = AppStore.getState().loginReducer.loginData;
      formData.append('ECSerp', loginData.SmCode);
      formData.append('AuthKey', loginData.Authkey);
      let url = properties.getHRCategory;
      let myResponse = await fetchPOSTMethod(url, formData);
      let response = Array.isArray(myResponse) ? myResponse : [myResponse];
      // response = [{StatusCode: 500, Exception: "Error occurred while accessing data in DataAccessCommonServices.GetDataSetByProc()"}]
      console.log('HR  Category response =======>',response);
      if (response.length != undefined) {
        if (response.length === 1 && response[0].hasOwnProperty('Exception')) {
             errorCallBack(response[0].Exception);
        } else {
            successCallBack(response);
        }
      } else if (response.length === undefined || response.length === 0 || response === null || response === undefined) {
        throw (globalConstants.UNDEFINED_MESSAGE);
      }
    } else {
      throw (globalConstants.NO_INTERNET);
    }
};


export const getHrRequestsList = async (successCallBack, errorCallBack) => {
  let isNetwork = await netInfo();
  if (isNetwork) {
    let formData = new FormData();
    const loginData = AppStore.getState().loginReducer.loginData;
    formData.append('ECSerp', loginData.SmCode);
    formData.append('AuthKey', loginData.Authkey);
    let url = properties.getHrMyList;
    let myResponse = await fetchPOSTMethod(url, formData);
    let response = Array.isArray(myResponse) ? myResponse : [myResponse];
    // response = [{StatusCode: 500, Exception: "Error occurred while accessing data in DataAccessCommonServices.GetDataSetByProc()"}]
    console.log('HR  Category response =======>',response);
    if (response.length != undefined) {
      if (response.length === 1 && response[0].hasOwnProperty('Exception')) {
           errorCallBack(response[0].Exception);
      } else {
          successCallBack(response);
      }
    } else if (response.length === undefined || response.length === 0 || response === null || response === undefined) {
      throw (globalConstants.UNDEFINED_MESSAGE);
    }
  } else {
    throw (globalConstants.NO_INTERNET);
  }
};

export const getHrSlaDetail = async (queryID, successCallBack, errorCallBack) => {
  let isNetwork = await netInfo();
  if (isNetwork) {
    let formData = new FormData();
    const loginData = AppStore.getState().loginReducer.loginData;
    formData.append('QueryID', queryID);
    formData.append('ECSerp', loginData.SmCode);
    formData.append('AuthKey', loginData.Authkey);
    let url = properties.getHrSlaDetails;
    let myResponse = await fetchPOSTMethod(url, formData);
    let response = Array.isArray(myResponse) ? myResponse : [myResponse];
    // response = [{StatusCode: 500, Exception: "Error occurred while accessing data in DataAccessCommonServices.GetDataSetByProc()"}]
    console.log('HR  SLA details =======>',response);
    if (response.length != undefined) {
      if (response.length === 1 && response[0].hasOwnProperty('Exception')) {
           errorCallBack(response[0].Exception);
      } else {
          successCallBack(response);
      }
    } else if (response.length === undefined || response.length === 0 || response === null || response === undefined) {
      throw (globalConstants.UNDEFINED_MESSAGE);
    }
  } else {
    throw (globalConstants.NO_INTERNET);
  }
};

export const getHrActivityDetail = async (encID, successCallBack, errorCallBack) => {
  let isNetwork = await netInfo();
  if (isNetwork) {
    let formData = new FormData();
    const loginData = AppStore.getState().loginReducer.loginData;
    formData.append('QID', encID);
    formData.append('ECSerp', loginData.SmCode);
    formData.append('AuthKey', loginData.Authkey);
    let url = properties.getHrActivities;
    let myResponse = await fetchPOSTMethod(url, formData);
    let response = Array.isArray(myResponse) ? myResponse : [myResponse];
    // response = [{StatusCode: 500, Exception: "Error occurred while accessing data in DataAccessCommonServices.GetDataSetByProc()"}]
    console.log('HR  Activity details =======>',response);
    if (response.length != undefined) {
      if (response.length === 1 && response[0].hasOwnProperty('Exception')) {
           errorCallBack(response[0].Exception);
      } else {
          successCallBack(response);
      }
    } else if (response.length === undefined || response.length === 0 || response === null || response === undefined) {
      throw (globalConstants.UNDEFINED_MESSAGE);
    }
  } else {
    throw (globalConstants.NO_INTERNET);
  }
};

export const submitData = async ( data, successCallBack, errorCallBack) => {
  let isNetwork = await netInfo();
  if (isNetwork) {
    let formData = new FormData();
    const payload = {
      CategoryId:  data.CategoryId,
      SubCategoryId: data.SubCategoryId,
      SubjectLine: data.SubjectLine,
      Description: data.Description,
      Mobile: data.Mobile,
      SMAction: data.SMAction,
    };
    const loginData = AppStore.getState().loginReducer.loginData;
    formData.append('ECSerp', loginData.SmCode);
    formData.append('AuthKey', loginData.Authkey);
    formData.append('QueryDetails', JSON.stringify(payload));

    let url = properties.submitHrData;
    let myResponse = await fetchPOSTMethod(url, formData);
    let response = Array.isArray(myResponse) ? myResponse : [myResponse];
    // response = [{StatusCode: 500, Exception: "Error occurred while accessing data in DataAccessCommonServices.GetDataSetByProc()"}]
    console.log('HR  submit data response =======>',response);
    if (response.length != undefined) {
      if (response.length === 1 && response[0].hasOwnProperty('Exception')) {
           errorCallBack(response[0].Exception);
      } else {
          successCallBack(response);
      }
    } else if (response.length === undefined || response.length === 0 || response === null || response === undefined) {
      throw (globalConstants.UNDEFINED_MESSAGE);
    }
  } else {
    throw (globalConstants.NO_INTERNET);
  }
};

export const submitDataByHR = async ( data, successCallBack, errorCallBack) => {
  let isNetwork = await netInfo();
  if (isNetwork) {
    let formData = new FormData();
    const loginData = AppStore.getState().loginReducer.loginData;
    formData.append('ECSerp', loginData.SmCode);
    formData.append('AuthKey', loginData.Authkey);
    formData.append('QueryDetails', JSON.stringify(data));
    let url = properties.submitByHrData;
    let myResponse = await fetchPOSTMethod(url, formData);
    let response = Array.isArray(myResponse) ? myResponse : [myResponse];
    console.log('Submit by HR response =======>',response);
    if (response.length != undefined) {
      if (response.length === 1 && response[0].hasOwnProperty('Exception')) {
           errorCallBack(response[0].Exception);
      } else {
          successCallBack(response);
      }
    } else if (response.length === undefined || response.length === 0 || response === null || response === undefined) {
      throw (globalConstants.UNDEFINED_MESSAGE);
    }
  } else {
    throw (globalConstants.NO_INTERNET);
  }
};

export const submitHrSurvey = async (data, successCallBack, errorCallBack) => {
  let isNetwork = await netInfo();
  if (isNetwork) {
    let formData = new FormData();
    const loginData = AppStore.getState().loginReducer.loginData;
    formData.append('ECSerp', loginData.SmCode);
    formData.append('AuthKey', loginData.Authkey);
    formData.append('SurveyQuestions', JSON.stringify({lstQuestionAnswers:data}));

    let url = properties.submitHrSurvey;
    let myResponse = await fetchPOSTMethod(url, formData);
    let response = Array.isArray(myResponse) ? myResponse : [myResponse];
    console.log('HR  submit survey response =======>',response);
    if (response.length != undefined) {
      if (response.length === 1 && response[0].hasOwnProperty('Exception')) {
           errorCallBack(response[0].Exception);
      } else {
          successCallBack(response);
      }
    } else if (response.length === undefined || response.length === 0 || response === null || response === undefined) {
      throw (globalConstants.UNDEFINED_MESSAGE);
    }
  } else {
    throw (globalConstants.NO_INTERNET);
  }
};

export const uploadHrFiles = async (index,queryId,file,  successCallBack, errorCallBack) => {
  let isNetwork = await netInfo();
  if (isNetwork) {
    let formData = new FormData();
    const loginData = AppStore.getState().loginReducer.loginData;
    formData.append('QueryID', queryId);
    formData.append('ECSerp', loginData.SmCode);
    formData.append('AuthKey', loginData.Authkey);
    formData.append('files', file);
    let url = properties.uploadHrFile;
    let myResponse = await fetchPOSTMethod(url, formData);
    console.log('My response : ', myResponse);
    let response = Array.isArray(myResponse) ? myResponse : [myResponse];
    // response = [{StatusCode: 500, Exception: "Error occurred while accessing data in DataAccessCommonServices.GetDataSetByProc()"}]
    console.log('HR  Files details =======>',response);
    if (response.length != undefined) {
      if (response.length === 1 && response[0].hasOwnProperty('Exception')) {
           errorCallBack(response[0].Exception);
      } else {
          successCallBack(index,response);
      }
    } else if (response.length === undefined || response.length === 0 || response === null || response === undefined) {
      throw (globalConstants.UNDEFINED_MESSAGE);
    }
  } else {
    throw (globalConstants.NO_INTERNET);
  }
};

export const getHrFiles = async (queryId, successCallBack, errorCallBack) => {
  let isNetwork = await netInfo();
  if (isNetwork) {
    let formData = new FormData();
    const loginData = AppStore.getState().loginReducer.loginData;
    formData.append('QueryID', queryId);
    formData.append('ECSerp', loginData.SmCode);
    formData.append('AuthKey', loginData.Authkey);
    let url = properties.getHrFiles;
    let myResponse = await fetchPOSTMethod(url, formData);
    console.log('My response : ', myResponse);
    let response = Array.isArray(myResponse) ? myResponse : [myResponse];
    // response = [{StatusCode: 500, Exception: "Error occurred while accessing data in DataAccessCommonServices.GetDataSetByProc()"}]
    console.log('HR  Files details =======>',response);
    if (response.length != undefined) {
      if (response.length === 1 && response[0].hasOwnProperty('Exception')) {
           errorCallBack(response[0].Exception);
      } else {
          successCallBack(response);
      }
    } else if (response.length === undefined || response.length === 0 || response === null || response === undefined) {
      throw (globalConstants.UNDEFINED_MESSAGE);
    }
  } else {
    throw (globalConstants.NO_INTERNET);
  }
};

export const deleteHrFile = async (fileID, successCallBack, errorCallBack) => {
  let isNetwork = await netInfo();
  if (isNetwork) {
    let formData = new FormData();
    const loginData = AppStore.getState().loginReducer.loginData;
    formData.append('FileId', fileID);
    formData.append('ECSerp', loginData.SmCode);
    formData.append('AuthKey', loginData.Authkey);
    let url = properties.deleteHrFile;
    let myResponse = await fetchPOSTMethod(url, formData);
    console.log('My response : ', myResponse);
    let response = Array.isArray(myResponse) ? myResponse : [myResponse];
    // response = [{StatusCode: 500, Exception: "Error occurred while accessing data in DataAccessCommonServices.GetDataSetByProc()"}]
    console.log('HR  Files details =======>',response);
    if (response.length != undefined) {
      if (response.length === 1 && response[0].hasOwnProperty('Exception')) {
           errorCallBack(response[0].Exception);
      } else {
          successCallBack(response);
      }
    } else if (response.length === undefined || response.length === 0 || response === null || response === undefined) {
      throw (globalConstants.UNDEFINED_MESSAGE);
    }
  } else {
    throw (globalConstants.NO_INTERNET);
  }
};

export const convertToStream = async (file) => {
  console.log('File object is : ', file.file);
  let data = '';
  RNFetchBlob.fs.readStream(
      'base64',
      file.FileUri,
      4095)
  .then((ifstream) => {
      ifstream.open();
      ifstream.onData((chunk) => {
        data += chunk;
      });
      ifstream.onError((err) => {
        console.log('Stream conversion error :', err);
      });
      ifstream.onEnd(() => {
        return data;
      });
  });
};

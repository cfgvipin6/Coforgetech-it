import { writeLog } from '../utilities/logger';
import moment from 'moment';
const TIMEOUT = 60000;
const POST_METHOD = 'POST';

const handleError = (error) => {
  if (error?.length) {
    return error;
  } else if (
    error === undefined ||
    error === null ||
    error.length === 0 ||
    error === ''
  ) {
    return 'No response is found from server! Please try after sometime.';
  }
};

const onApiCall = (url, data = {}, requestType = 'get') => {
  let controller = new AbortController();
  const postBody = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    body: data,
  };
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      controller.abort();
      reject('Timeout');
    }, TIMEOUT);
    fetch(url, {
      method: requestType,
      signal: controller.signal,
      timeout: TIMEOUT,
      ...(requestType.toUpperCase() === POST_METHOD && postBody),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          return [{ Exception: response.status }];
        }
      })
      .then((responseData) => {
        resolve(responseData);
      })
      .catch((err) => {
        reject(handleError(err));
      })
      .done();
  });
};

export const fetchGETMethod = async (url) => {
  let myURLArr = url.split('/');
  let apiEndPoint = myURLArr[myURLArr.length - 1];
  let startTime = new Date();
  writeLog(
    `${apiEndPoint} invoke=> ${startTime.toLocaleDateString()} ${startTime.toLocaleTimeString()} ${startTime
      .getMilliseconds()
      .toLocaleString()}`
  );
  const res = await onApiCall(url);
  let endTime = new Date().getTime();
  let timeDiff = endTime - startTime.getTime();
  let timeTaken = moment.duration(timeDiff, 'milliseconds').asSeconds();
  console.log(`${apiEndPoint} login response time=> ${timeTaken}`);
  writeLog(`${apiEndPoint} login response time=> ${timeTaken}`);
  return res;
};

export const fetchPOSTMethodNew = async (url, form) => {
  const res = await onApiCall(url, form, POST_METHOD);
  return res;
};

// login method
export const fetchPOSTMethod = async (url, form) => {
  let myURLArr = url.split('/');
  let apiEndPoint = myURLArr[myURLArr.length - 1];
  let startTime = new Date();
  console.log(
    `${apiEndPoint} invoke=> ${startTime.toLocaleDateString()} ${startTime.toLocaleTimeString()} ${startTime
      .getMilliseconds()
      .toLocaleString()}`
  );
  console.log('Form data is : ', JSON.stringify(form));
  console.log('Url is === : ' + url);
  // writeLog(urlToLog + " " + "is invoked for POST request with body :" +  "\n"+JSON.stringify(form))
  writeLog(
    `${apiEndPoint} invoke=> ${startTime.toLocaleDateString()} ${startTime.toLocaleTimeString()} ${startTime
      .getMilliseconds()
      .toLocaleString()}`
  );
  const res = await onApiCall(url, form, POST_METHOD);
  let endTime = new Date().getTime();
  let timeDiff = endTime - startTime.getTime();
  let timeTaken = moment.duration(timeDiff, 'milliseconds').asSeconds();
  console.log(`${apiEndPoint} login response time=> ${timeTaken}`);
  writeLog(`${apiEndPoint} login response time=> ${timeTaken}`);
  return res;
};

export const post = async (url, data) => {
  const res = await onApiCall(url, data, POST_METHOD);
  return res;
};

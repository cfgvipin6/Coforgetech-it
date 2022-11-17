import { writeLog } from '../utilities/logger';
import moment from 'moment';
const TIMEOUT = 60000;

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
      ...(requestType.toUpperCase() === 'POST' && postBody),
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

async function fetchGETMethod(url) {
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
}

async function fetchPOSTMethodNew(url, form) {
  const res = await onApiCall(url, form, 'POST');
  return res;
}

// login method
async function fetchPOSTMethod(url, form) {
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
  const res = await onApiCall(url, form, 'POST');
  let endTime = new Date().getTime();
  let timeDiff = endTime - startTime.getTime();
  let timeTaken = moment.duration(timeDiff, 'milliseconds').asSeconds();
  console.log(`${apiEndPoint} login response time=> ${timeTaken}`);
  writeLog(`${apiEndPoint} login response time=> ${timeTaken}`);
  return res;
}

// async function fetchAnotherPost(url, form) {
//   console.log('Url is : ' + url);
//   console.log('Form data is : ', JSON.stringify(form));
//   const res = await onApiCall(url, form, 'POST');
//   return res;
// }

async function post(url, data) {
  const res = await onApiCall(url, data, 'POST');
  return res;
}

export {
  fetchGETMethod,
  fetchPOSTMethod,
  fetchPOSTMethodNew,
  // fetchAnotherPost,
  post,
};

import { Component } from "react";
import { writeLog } from "../utilities/logger";
import moment from "moment";
const TIMEOUT = 60000;
export default class FetchService extends Component {
  constructor() {
    super();
  }
}
async function fetchGETMethod(url) {
  let myURLArr = url.split("/");
  let apiEndPoint = myURLArr[myURLArr.length - 1];
  let startTime = new Date();
  let controller = new AbortController();
  // console.log("GET method api endPoint is : ", apiEndPoint)
  console.log(
    apiEndPoint + " invoke=>",
    startTime.toLocaleDateString(),
    startTime.toLocaleTimeString(),
    startTime.getMilliseconds().toLocaleString()
  );
  console.log("Url is : " + url);
  writeLog(
    apiEndPoint +
      " invoke=>" +
      startTime.toLocaleDateString() +
      " " +
      startTime.toLocaleTimeString() +
      " " +
      startTime.getMilliseconds().toLocaleString()
  );
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      controller.abort();
      reject("Timeout");
    }, TIMEOUT);
    fetch(url, {
      method: "GET",
      timeout: TIMEOUT,
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          return [{ Exception: response.status }];
        }
      })
      .then((responseData) => {
        let endTime = new Date().getTime();
        let timeDiff = endTime - startTime.getTime();
        let timeTaken = moment.duration(timeDiff, "milliseconds").asSeconds();
        console.log(apiEndPoint + " time=> ", timeTaken);
        writeLog(apiEndPoint + " time=> " + timeTaken);
        resolve(responseData);
      })
      .catch((error) => {
        if (error != undefined && error != null && error.length > 0) {
          // console.log("There has been a problem with your fetch GET operation: ",error);
          reject(error);
        } else if (
          error === undefined ||
          error === null ||
          error.length === 0 ||
          error === ""
        ) {
          reject(
            "No response is found from server! Please try after sometime."
          );
        }
      })
      .done();
  });
}

async function fetchPOSTMethodNew(url, form) {
  let myURLArr = url.split("/");
  let apiEndPoint = myURLArr[myURLArr.length - 1];
  let controller = new AbortController();
  let startTime = new Date();
  let urlToLog = url.substring(url.lastIndexOf("/") + 1);
  console.log(
    apiEndPoint + " invoke=>",
    startTime.toLocaleDateString(),
    startTime.toLocaleTimeString(),
    startTime.getMilliseconds().toLocaleString()
  );
  console.log("Form data is : ", JSON.stringify(form));
  console.log("Url is : " + url);
  writeLog(
    apiEndPoint +
      " invoke=>" +
      startTime.toLocaleDateString() +
      " " +
      startTime.toLocaleTimeString() +
      " " +
      startTime.getMilliseconds().toLocaleString()
  );
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      controller.abort();
      reject("Timeout");
    }, TIMEOUT);
    fetch(url, {
      signal: controller.signal, //it has to implement with timeout
      method: "POST",
      timeout: TIMEOUT, // it is not working....
      headers: {
        "Content-Type": "application/json",
      },
      body: form,
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          return [{ Exception: response.status }];
        }
      })
      .then((responseData) => {
        let endTime = new Date().getTime();
        let timeDiff = endTime - startTime.getTime();
        let timeTaken = moment.duration(timeDiff, "milliseconds").asSeconds();
        console.log(apiEndPoint + " time=> ", timeTaken);
        writeLog(apiEndPoint + " time=>" + timeTaken);
        resolve(responseData);
      })
      .catch((error) => {
        console.log(
          "There has been a problem with your fetch Post operation: ",
          error
        );
        if (error != undefined && error != null && error.length > 0) {
          console.log(" Defined Error rejected");
          reject(error);
        } else if (
          error === undefined ||
          error === null ||
          error.length === 0 ||
          error === ""
        ) {
          console.log(" UnDefined Error rejected");
          reject(
            "No response is found from server! Please try after sometime."
          );
        }
      })
      .done();
  });
}

async function fetchPOSTMethod(url, form) {
  let myURLArr = url.split("/");
  let apiEndPoint = myURLArr[myURLArr.length - 1];
  let controller = new AbortController();
  let startTime = new Date();
  let urlToLog = url.substring(url.lastIndexOf("/") + 1);
  // console.log("POST method api endPoint is : ", apiEndPoint)
  console.log(
    apiEndPoint + " invoke=>",
    startTime.toLocaleDateString(),
    startTime.toLocaleTimeString(),
    startTime.getMilliseconds().toLocaleString()
  );
  console.log("Form data is : ", JSON.stringify(form));
  console.log("Url is : " + url);
  // writeLog(urlToLog + " " + "is invoked for POST request with body :" +  "\n"+JSON.stringify(form))
  writeLog(
    apiEndPoint +
      " invoke=>" +
      startTime.toLocaleDateString() +
      " " +
      startTime.toLocaleTimeString() +
      " " +
      startTime.getMilliseconds().toLocaleString()
  );
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      controller.abort();
      reject("Timeout");
    }, TIMEOUT);
    fetch(url, {
      signal: controller.signal,
      method: "POST",
      timeout: TIMEOUT,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      body: form,
    })
      .then((response) => {
        console.log("Direct response from server : ", response);
        if (response.ok) {
          return response.json();
        } else {
          return [{ Exception: response.status }];
        }
      })
      .then((responseData) => {
        let endTime = new Date().getTime();
        let timeDiff = endTime - startTime.getTime();
        let timeTaken = moment.duration(timeDiff, "milliseconds").asSeconds();
        console.log(apiEndPoint + " time=> ", timeTaken);
        writeLog(apiEndPoint + " time=>" + timeTaken);
        resolve(responseData);
      })
      .catch((error) => {
        console.log(
          "There has been a problem with your fetch Post operation: ",
          error
        );
        if (error != undefined && error != null && error.length > 0) {
          console.log(" Defined Error rejected");
          reject(error);
        } else if (
          error === undefined ||
          error === null ||
          error.length === 0 ||
          error === ""
        ) {
          console.log(" UnDefined Error rejected");
          reject(
            "No response is found from server! Please try after sometime."
          );
        }
      })
      .done();
  });
}

async function fetchAnotherPost(url, form) {
  console.log("Url is : " + url);
  let controller = new AbortController();
  console.log("Form data is : ", JSON.stringify(form));
  let urlToLog = url.substring(url.lastIndexOf("/") + 1);
  console.log("Url is : " + urlToLog);
  // writeLog(urlToLog + " " + "is invoked for POST request with body :" +  "\n"+JSON.stringify(form))
  writeLog(urlToLog + " " + "is invoked for POST request");
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      controller.abort();
      reject("Timeout");
    }, TIMEOUT);
    fetch(url, {
      signal: controller.signal, //it has to implement with timeout
      method: "POST",
      timeout: TIMEOUT, // it is not working....
      headers: {
        "Content-Type": "multipart/form-data",
      },
      body: form,
    })
      .then((response) => {
        console.log("New method response: ", response);
        resolve(response);
      })
      .catch((error) => {
        console.log("Problem with Post operation: ", error);
        if (error != undefined && error != null && error.length > 0) {
          console.log(" Defined Error rejected");
          reject(error);
        } else if (
          error === undefined ||
          error === null ||
          error.length === 0 ||
          error === ""
        ) {
          console.log(" UnDefined Error rejected");
          reject(
            "No response is found from server! Please try after sometime."
          );
        }
      })
      .done();
  });
}

async function post(url, data) {
  console.log("Url is : " + url);
  let controller = new AbortController();
  console.log(" data is : ", JSON.stringify(data));
  let urlToLog = url.substring(url.lastIndexOf("/") + 1);
  console.log("Url is : " + urlToLog);
  // writeLog(urlToLog + " " + "is invoked for POST request with body :" +  "\n"+JSON.stringify(form))
  writeLog(urlToLog + " " + "is invoked for POST request");
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      controller.abort();
      reject("Timeout");
    }, TIMEOUT);
    fetch(url, {
      signal: controller.signal, //it has to implement with timeout
      method: "POST",
      timeout: TIMEOUT, // it is not working....
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        console.log("Direct response from server : ", response);
        return response.json();
      })
      .then((json) => {
        console.log(json);
        resolve(json);
      })
      .catch((error) => {
        console.log("Problem with Post operation: ", error);
        if (error != undefined && error != null && error.length > 0) {
          console.log(" Defined Error rejected");
          reject(error);
        } else if (
          error === undefined ||
          error === null ||
          error.length === 0 ||
          error === ""
        ) {
          console.log(" UnDefined Error rejected");
          reject(
            "No response is found from server! Please try after sometime."
          );
        }
      })
      .done();
  });
}

export {
  fetchGETMethod,
  fetchPOSTMethod,
  fetchPOSTMethodNew,
  fetchAnotherPost,
  post,
};

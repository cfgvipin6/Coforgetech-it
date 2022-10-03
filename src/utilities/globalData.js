import { Component } from 'react';
var isUserLogin = false;
var singleInstance = '';
let accessToken = "";
let employeeId = "";
export default class GlobalData extends Component {
    constructor() {
        super();
        if (!singleInstance) {
            singleInstance = this;
        }
        return singleInstance;
    }

    setUserLogin(flag) {
        return isUserLogin = flag;
    }
    getUserLogin() {
        return isUserLogin;
    }
    setAccessToken(generatedAccessToken) {
        accessToken = generatedAccessToken;
    }
    getAccessToken() {
        return accessToken;
    }
    setLoggedInEmployeeId(id) {
        employeeId = id;
    }
    getLoggedInEmployeeId() {
        return employeeId;
    }
}
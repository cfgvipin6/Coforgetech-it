import { writeLog } from '../utilities/logger';
export default {
    extractDate : function (value){
        let matches = value.match(/\((.*?)\)/);
        if (matches) {
            let submatch = matches[1];
            if (submatch != undefined){
                let getDate = this.convertMilliToDate(parseInt(submatch));
                return getDate;
            }
            else {
                return null;
            }
        }
        else {
            return null;
        }
    },
    convertMilliToDate : function (val){
        let dateValue = new Date(val);
        return dateValue.toDateString();
    },

    onOkAfterError: (ref)=>{
        writeLog('Clicked on ' + 'logout from ' + ref.props.navigation.state.routeName);
       ref.props.navigation.navigate('Login');
    },

    // isDevEnvironment = true for dev inside properties.js

    // let response = [{
    //     StatusCode: 404,
    //     Exception: "Unauthorized access. Authentication Failed."
    // }]


    // *********** sort alphabetically supervisor logic *************

    // let mySort = this.state.localSuperVisorData.map((val)=>val.NAME.trim())
    // // console.log("supervisor data :::::", this.state.localSuperVisorData.map((val)=>val.NAME.trim()))
    // // console.log("supervisor data sort:::::", mySort.sort())
};

//this.setState({startDate:dateData,endDate: this.state.isHalfDay ? dateData:"End Date"},()=>{

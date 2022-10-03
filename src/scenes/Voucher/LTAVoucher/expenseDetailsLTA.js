import React, { useState, useEffect } from 'react'
import { ImageBackground, StyleSheet,Text,View, TouchableOpacity, ProgressBarAndroidComponent } from "react-native"
import { moderateScale } from "../../../components/fontScaling.js";
import { LabelText, LabelTextDashValue } from '../../../GlobalComponent/LabelText/LabelText.js';
import { sectionTitle, calculateFinancialYear } from '../createVoucher/cvUtility.js';
import { LabelEditText } from '../../../GlobalComponent/LabelEditText/LabelEditText.js';
import { DatePicker } from '../../../GlobalComponent/DatePicker/DatePicker.js';
import CustomButton from '../../../components/customButton.js';
let appConfig = require("../../../../appconfig");
import moment from "moment"
import { Dropdown } from '../../../GlobalComponent/DropDown/DropDown.js';
import { RESET_DETAILS } from '../../eExit/constants.js';
import { showToast } from '../../../GlobalComponent/Toast.js';
let constants = require("./constants")

let expenseObj={};
export const getLtaExpenseItem =()=>{
 return expenseObj;
}
export const ExpenseDetailLTA = (props) => {
 let placeVisitedHeading="";
 let vistedPlaceHolder="";
 let fromDateHeading="";
 let toDateHeading="";
 let disable = (props.docStatus== undefined || props.docStatus== 0 || props.docStatus== 1 || props.docStatus== 5 || props.docStatus== 7 || props.docStatus == 12 || props.docStatus == 14) ? false :true
 console.log("Details : ",props.details)
      placeVisitedHeading="Place Visited";
      vistedPlaceHolder="Place Visited";
      fromDateHeading="From Date*";
      toDateHeading="To Date*";
    let emp = props.emp[0];
    this.purposeRef = React.createRef();
    console.log("Props in expense details : ", props);
    let dateDefault = moment().format("DD-MMM-YYYY");
    console.log("Employee data : ", emp);
    let expenseData = {};
    let docDate = (emp.DocDate === undefined) ? "" : emp.DocDate.replace(/-/g, " ");
    const [placesVisited,setPlaces]=useState( props.details!==undefined ? props.details.VisitingPlace :  '');
    const [fromDateValue,setFromDate]=useState(props.details!==undefined ? props.details.JourneyFromDate : dateDefault);
    const [toDateValue,setToDate]=useState(props.details!==undefined ? props.details.JourneyToDate : dateDefault);
    const [fromCalendarVisible,setFromCalendarVisible]=useState(false);
    const [toCalendarVisible,setToCalendarVisible]=useState(false);
    let financialYearFromStartDate = calculateFinancialYear(fromDateValue)
    let financialYearToStartDate = calculateFinancialYear(toDateValue)
    
    const showFromDateCalendar = () => {
		setFromCalendarVisible(true)
    }
    const showToDateCalendar = () => {
		setToCalendarVisible(true)
    }
    const setFromDates = (fromDate) => {
        setFromCalendarVisible(false)
        setFromDate(moment(fromDate).format("DD-MMM-YYYY"))
    }
    const setToDates = (toDate) => {
        setToCalendarVisible(false)
        let fromMoment = moment(fromDateValue);
        let toMoment = moment(moment(toDate).format("DD-MMM-YYYY"));
        if(toMoment.diff(fromMoment)>=0){
          setToDate(moment(toDate).format("DD-MMM-YYYY"))
        } else if(props.details==undefined){
          setTimeout(()=>{
            return alert(constants.DATE_DIFF_MESSAGE)
          },700)
        }
    }
	const hideFromDateCalendar = () => {
		setFromCalendarVisible(false)
  }
  const hideToDateCalendar = () => {
    setToCalendarVisible(false)
}
  
  useEffect(() => {
    if(props.details!==undefined){
      console.log("Setting places : ",props.details.VisitingPlace)
      // setPlaces(props.details.VisitingPlace)
      // setFromDates(props.details.JourneyFromDate)
      // setToDates(props.details.JourneyToDate)
    }
    
    expenseObj["fromDateValue"]=fromDateValue;
    expenseObj["toDateValue"]=toDateValue;
    expenseObj["placesVisited"]=placesVisited;
	})
    return (
        <View style={styles.container}>
          {sectionTitle("Expense Details")}
          <ImageBackground style={styles.cardBackground} resizeMode="cover">
          <LabelEditText
              heading={placeVisitedHeading}
              placeHolder={vistedPlaceHolder}
              myMaxLength={50}
              myNumberOfLines={2}
              isEditable={!disable}
              // isMultiline={true}// This obstructs the scroll view up.
              onTextChanged={(text)=>setPlaces(text)}
              myValue={placesVisited}
              isSmallFont={true}
           />
           { disable ? 
            <LabelEditText
              heading={"From Date *"}
              placeHolder={"From Date"}
              myMaxLength={50}
              myNumberOfLines={2}
              isEditable={!disable}
              myValue={fromDateValue}
              isSmallFont={true}
           />
             : <DatePicker
              myDatePickerVisible={fromCalendarVisible}
              heading={fromDateHeading}
              myMaxDate={moment().toDate()}
              myMinDate={moment(financialYearFromStartDate,"DD-MMM-YYYY").toDate()}
              myCalenderSelectedDate={moment(fromDateValue,"DD-MMM-YYYY").toDate()}
              myDateValue={fromDateValue}
              showMyCalendar={showFromDateCalendar}
              handleConfirm={(date) => setFromDates(date)}
              hideDatePicker={hideFromDateCalendar}
            /> }
            { disable ? 
            <LabelEditText
              heading={"To Date *"}
              placeHolder={"To Date"}
              myMaxLength={50}
              myNumberOfLines={2}
              isEditable={!disable}
              myValue={toDateValue}
              isSmallFont={true}
           />
             : 
            <DatePicker
              myDatePickerVisible={toCalendarVisible}
              heading={toDateHeading}
              myMaxDate={moment().toDate()}
              myMinDate={moment(financialYearToStartDate,"DD-MMM-YYYY").toDate()}
              myCalenderSelectedDate={moment(toDateValue,"DD-MMM-YYYY").toDate()}
              myDateValue={toDateValue}
              showMyCalendar={showToDateCalendar}
              handleConfirm={(date) => setToDates(date)}
              hideDatePicker={hideToDateCalendar}
            /> }
        </ImageBackground>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        margin:5,
    },
    cardBackground: {
        borderWidth: 2,
        flex: 0,
        borderColor: appConfig.FIELD_BORDER_COLOR,
        borderRadius: 5,
        shadowOffset: { width: 10, height: 10 },
        shadowColor: "black",
        padding:5,  
    },
    autocompleteStyle:{
        flex: 1,
        marginTop:moderateScale(2),
    },
    autocompleteInputStyle: {
        borderColor:'grey',
        borderWidth: 1,
      },
    autocompleteListStyle: {
        position: "relative",
        backgroundColor: appConfig.CARD_BACKGROUND_COLOR,
    },
    addItemButtonView: {
        width: "25%",
        flex: 0,
        alignSelf: "flex-end",
        marginTop: moderateScale(6)
      },
})
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { ImageBackground, StyleSheet,Text,View, TouchableOpacity, ProgressBarAndroidComponent } from 'react-native';
import { moderateScale } from '../../../components/fontScaling.js';
import { LabelText } from '../../../GlobalComponent/LabelText/LabelText.js';
import { sectionTitle, calculateFinancialYear } from '../createVoucher/cvUtility.js';
import { LabelEditText } from '../../../GlobalComponent/LabelEditText/LabelEditText.js';
import { DatePicker } from '../../../GlobalComponent/DatePicker/DatePicker.js';
import CustomButton from '../../../components/customButton.js';
let appConfig = require('../../../../appconfig');
import moment from 'moment';
import { Dropdown } from '../../../GlobalComponent/DropDown/DropDown.js';
import { RESET_DETAILS } from '../../eExit/constants.js';
import { showToast } from '../../../GlobalComponent/Toast.js';
let constants = require('./constants');
export const ExpenseDetail = (props) => {
 let billMemoNumberHeading = '';
 let billPlaceHolder = '';
 let billDateHeading = '';
 let particularsHeading = '';
 let particularsPlaceHolder = '';
 let amountHeading = '';
 let amountPlaceHolder = '';
 let purposeHeading = '';
 let phoneNumberHeading = '';
 let phoneNumberPlaceHolder = '';
  switch (props.catID){
    case '6':
      billMemoNumberHeading = 'Bill No.*';
      billPlaceHolder = 'Bill No.';
      billDateHeading = 'Date*';
      particularsHeading = 'Particulars*';
      particularsPlaceHolder = 'Particulars';
      amountHeading = 'Amount*';
      amountPlaceHolder = 'Amount';
      purposeHeading = 'Purpose.*';
      phoneNumberHeading = 'Phone No.*';
      phoneNumberPlaceHolder = 'Phone number';
      break;
    case '5':
      billMemoNumberHeading = 'Cash Memo No.*';
      billPlaceHolder = 'Cash Memo No.';
      billDateHeading = 'Bill Date*';
      particularsHeading = 'Particulars*';
      particularsPlaceHolder = 'Particulars';
      amountHeading = 'Amount*';
      amountPlaceHolder = 'Amount';
      break;
      case '4':
        billMemoNumberHeading = 'Cash Memo No.*';
        billPlaceHolder = 'Cash Memo No.';
        billDateHeading = 'Bill Date*';
        particularsHeading = 'Particulars*';
        particularsPlaceHolder = 'Particulars';
        amountHeading = 'Amount*';
        amountPlaceHolder = 'Amount';
        break;
        case '7':
          billMemoNumberHeading = 'Cash Memo No.*';
          billPlaceHolder = 'Cash Memo No.';
          billDateHeading = 'Bill Date*';
          particularsHeading = 'Doctor/Chemist*';
          particularsPlaceHolder = 'Doctor/Chemist';
          amountHeading = 'Amount*';
          amountPlaceHolder = 'Amount';
          break;

  }
    let emp = props.emp[0];
    this.purposeRef = React.createRef();
    console.log('Props in expense details : ', props);
    let dateDefault = moment().format('DD-MMM-YYYY');
    console.log('Employee data : ', emp);
    let expenseData = {};
    console.log('Mobile voucher purpose: ', emp.MobileVoucherPurpose);
    let docDate = (emp.DocDate === undefined) ? '' : emp.DocDate.replace(/-/g, ' ');
    const [billNumberVal,setBillNumber] = useState('');
    const [dateValue,setDate] = useState(dateDefault);
    const [calendarVisible,setcalendarVisible] = useState(false);
    const [phoneNumber,setPhoneNumber] = useState('');
    const [particulars,setParticulars] = useState('');
    const [amount,setAmount] = useState('');
    const [purpose,setPurpose] = useState({});

    let financialYearStartDate = calculateFinancialYear(dateValue);


    const showDateCalendar = () => {
		setcalendarVisible(true);
    };
    const setDateFromPicker = (date) => {
        setcalendarVisible(false);
        setDate(moment(date).format('DD-MMM-YYYY'));
    };

	const hideDateCalendar = () => {
		setcalendarVisible(false);
  };
  const resetExpense = ()=>{
    setBillNumber('');
    setDate(dateDefault);
    setcalendarVisible(false);
    setPhoneNumber('');
    setParticulars('');
    setAmount('');
    if (this.purposeRef.current !== null && this.purposeRef.current !== undefined){
      this.purposeRef.current.select(-1);
      setPurpose({});
    }
  };
  const updateExpense = (file)=>{
    if (file !== undefined){
      setTimeout(()=>{
        setAmount('' + file.Amount);
        setBillNumber(file.MemoNo);
        setDate(file.SMemoDate);
        setcalendarVisible(false);
        setPhoneNumber(file.TelNo);
        setParticulars(file.Particulars);
        let purpose = {};
        purpose.ID = file.Purpose;
        purpose.DisplayText = file.PurposeText;
        if (this.purposeRef.current !== null){
          this.purposeRef.current.select(parseInt(file.Purpose) - 1);
        }
        setPurpose(purpose);
      },500);
    }
  };
  const addItem = ()=>{
    expenseData.billNumber = billNumberVal;
    expenseData.date = dateValue;
    expenseData.phoneNumber = phoneNumber;
    expenseData.purpose = purpose;
    expenseData.particulars = particulars;
    expenseData.amount = amount;
    props.setExpenseDetails(expenseData);
  };

  const onPurposeSelection = (index, value)=>{
        console.log('Purpose selected',value);
        let purposeObj =   emp.MobileVoucherPurpose.find((el)=>el.DisplayText == value);
        console.log('Purpose selected',purposeObj);
        setPurpose(purposeObj);
  };
  useEffect(()=>{
    props.setEditDeleteCallBacks(resetExpense,updateExpense);
  },[]);
    return (
        <View style={styles.container}>
          {sectionTitle('Employee Expense Details')}
          <ImageBackground style={styles.cardBackground} resizeMode="cover">
          <LabelEditText
              heading={billMemoNumberHeading}
              placeHolder={billPlaceHolder}
              myMaxLength={50}
              myNumberOfLines={2}
              // isMultiline={true}// This obstructs the scroll view up.
              onTextChanged={setBillNumber}
              myValue={billNumberVal}
              isSmallFont={true}
              isEditable={!props.isFreezed}
           />
            <DatePicker
              myDatePickerVisible={calendarVisible}
              heading={billDateHeading}
              isFreezed={props.isFreezed}
              myMaxDate={moment().toDate()}
              myMinDate={moment(financialYearStartDate,'DD-MMM-YYYY').toDate()}
              myCalenderSelectedDate={moment(dateValue,'DD-MMM-YYYY').toDate()}
              myDateValue={dateValue}
              showMyCalendar={showDateCalendar}
              handleConfirm={(date) => setDateFromPicker(date)}
              hideDatePicker={hideDateCalendar}
            />
            {props.catID == 6 ? <LabelEditText
              heading={phoneNumberHeading}
              placeHolder={phoneNumberPlaceHolder}
              myMaxLength={13}
              myNumberOfLines={2}
              // isMultiline={true}// This obstructs the scroll view up.
              onTextChanged={setPhoneNumber}
              myValue={phoneNumber}
              isSmallFont={true}
              myKeyboardType="numeric"
              isEditable={!props.isFreezed}
           /> : null}
           {props.catID == 6 ?
           <Dropdown title={purposeHeading}
                disabled={props.isFreezed}
                forwardedRef={this.purposeRef}
                dropDownData={emp.MobileVoucherPurpose.map((value)=>value.DisplayText)}
                dropDownCallBack={(index,value) => onPurposeSelection(index, value)} />
            : null}
            <LabelEditText
              heading={particularsHeading}
              placeHolder={particularsPlaceHolder}
              myMaxLength={50}
              myNumberOfLines={2}
              // isMultiline={true} // This obstructs the scroll view up.
              onTextChanged={setParticulars}
              myValue={particulars}
              isSmallFont={true}
              isEditable={!props.isFreezed}
           />
           <LabelEditText
              heading={amountHeading}
              placeHolder={amountPlaceHolder}
              myMaxLength={50}
              myNumberOfLines={2}
              // isMultiline={true} // This obstructs the scroll view up.
              onTextChanged={setAmount}
              myValue={amount}
              isSmallFont={true}
              myKeyboardType="numeric"
              isEditable={!props.isFreezed}
           />

            <View style={styles.addItemButtonView}>
              <CustomButton
                isFreezed={props.isFreezed}
                label={!props.editCase ?  'Add Item' : 'Update Item'}
                positive={true}
                performAction={() => addItem()}
              />
            </View>
        </ImageBackground>
        </View>
    );
};

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
        shadowColor: 'black',
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
        position: 'relative',
        backgroundColor: appConfig.CARD_BACKGROUND_COLOR,
    },
    addItemButtonView: {
        width: '30%',
        flex: 0,
        alignSelf: 'flex-end',
        marginTop: moderateScale(6),
      },
});

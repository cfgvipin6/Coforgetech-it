/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { ImageBackground, Text, View, TouchableOpacity } from "react-native";
import {
  sectionTitle,
  calculateFinancialYear,
  calculateDaysDiff,
} from "../../createVoucher/cvUtility.js";
import { LabelEditText } from "../../../../GlobalComponent/LabelEditText/LabelEditText.js";
import { DatePicker } from "../../../../GlobalComponent/DatePicker/DatePicker.js";
import CustomButton from "../../../../components/customButton.js";
import { CheckBox, Tooltip } from "react-native-elements";
import _ from "lodash";
import moment from "moment";
import { Dropdown } from "../../../../GlobalComponent/DropDown/DropDown.js";
import { styles } from "../../createVoucher/styles";
import { fetchLCVModeRate } from "../utils.js";
let appConfig = require("../../../../../appconfig");
let constants = require("./../../createVoucher/constants");
let globalConstants = require("../../../../GlobalConstants");
let editableFile;
export const ExpenseDetailOneUS = (props) => {
  console.log("propssss", props);
  let categoryId = props.myCategoryId;
  let isDocumentSaved = true; //props.isDocumentSaved
  let dateDefault = moment().format("DD-MMM-YYYY");
  let empData = props.myEmpData[0];
  let defaultCurrencyIdValue =
    empData.CURRENCY !== "" ? empData.CURRENCY : "INR";
  let dateLbl,
    startDateLbl,
    endDateLbl,
    dateRowVisible,
    startDateRowVisible,
    endDateRowVisible,
    hotelRowVisible,
    guestRowVisible,
    validTillDateVisible,
    locationRowVisible,
    fromRowVisible,
    toRowVisible,
    modeOfConveyanceVisible,
    carrierVisible,
    milesVisible,
    descriptionVisible,
    modeOfTravelData,
    typeDropdownVisible,
    typeDropdownData,
    typeFieldVisible,
    modeRef = React.createRef();
  payTypeRef = React.createRef();
  currencyRef = React.createRef();
  typeRef = React.createRef();
  const [expenseId, setExpenseId] = useState(props.myExpenseTypeId);
  console.log("expenseTypeId4444", expenseId);
  const [dateValue, setDateValue] = useState(dateDefault);
  const [dateCalendarVisible, setDateCalendarVisible] = useState(false);
  const [startDateValue, setStartDateValue] = useState(dateDefault);
  const [startDateCalendarVisible, setStartDateCalendarVisible] = useState(
    false
  );
  const [endDateValue, setEndDateValue] = useState(dateDefault);
  const [endDateCalendarVisible, setEndDateCalendarVisible] = useState(false);
  const [validTillCalendarVisible, setValidTillCalendarVisible] = useState(
    false
  );
  const [validTillDateValue, setValidTillDateValue] = useState(dateDefault);
  const [fromInput, setFromInput] = useState("");
  const [toInput, setToInput] = useState("");
  const [carrierInput, setCarrierInput] = useState("");
  const [amountInput, setAmountInput] = useState("");
  const [amountEditable, setAmountEditable] = useState(true);
  const [exchRateInput, setExchRateInput] = useState("");
  const [exchRateEditable, setExchRateEditable] = useState(false);
  const [finalExchAmount, setFinalExchAmount] = useState("");
  const [modeOfConveyanceObject, setModeOfConveyanceObject] = useState({});
  const [payTypeObject, setPayTypeObject] = useState({});
  const [currencyObject, setCurrencyObject] = useState({});
  const [hotelInput, setHotelInput] = useState("");
  const [guestInput, setGuestInput] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [milesValue, setMilesValue] = useState("");
  const [descriptionValue, setDescriptionValue] = useState("");
  const [sChecked, setSChecked] = useState(false);
  const [rChecked, setRChecked] = useState(false);
  const [type, setType] = useState("");
  const [meal, setIncident] = useState({});
  const [editPress, setEditPress] = useState(0);
  const [ownCarRate, setOwnCarRate] = useState(0);
  let financialYearStartDate = calculateFinancialYear(dateValue);
  let ModeRef;

  if (expenseId == 1) {
    dateRowVisible = true;
    startDateRowVisible = true;
    endDateRowVisible = true;
    fromRowVisible = true;
    toRowVisible = true;
    modeOfConveyanceVisible = true;
    carrierVisible = true;
    dateLbl = globalConstants.BOOKING_DATE_TEXT;
    startDateLbl = globalConstants.START_DATE_TEXT;
    endDateLbl = globalConstants.END_DATE_TEXT;
    modeOfTravelData = empData.UsTravelMode;
  } else if (expenseId == 2 || expenseId == 7) {
    dateRowVisible = false;
    startDateRowVisible = true;
    endDateRowVisible = true;
    hotelRowVisible = true;
    locationRowVisible = true;
    startDateLbl = constants.CHECK_IN_TEXT;
    endDateLbl = constants.CHECK_OUT_TEXT;
    // modeOfTravelData = empData.UsTravelMode
  } else if (expenseId == 3) {
    dateRowVisible = true;
    startDateRowVisible = false;
    endDateRowVisible = false;
    fromRowVisible = true;
    toRowVisible = true;
    milesVisible = true;
    descriptionVisible = true;
    modeOfConveyanceVisible = true;
    dateLbl = globalConstants.DATE_TEXT;
    modeOfTravelData = empData.UsLcvMode;
  } else if (expenseId == 4) {
    dateRowVisible = true;
    dateLbl = globalConstants.DATE_TEXT;
    descriptionVisible = true;
    typeFieldVisible = true;
  } else if (expenseId == 5) {
    dateRowVisible = true;
    dateLbl = globalConstants.DATE_TEXT;
    descriptionVisible = true;
  } else if (expenseId == 6) {
    dateRowVisible = true;
    dateLbl = globalConstants.DATE_TEXT;
    descriptionVisible = true;
    typeDropdownVisible = true;
    typeDropdownData = empData.UsIncidentalTypes;
  } else if (expenseId == 8) {
    dateRowVisible = true;
    dateLbl = globalConstants.DATE_TEXT;
    descriptionVisible = true;
    typeDropdownVisible = true;
    typeDropdownData = empData.MealIncidentalTypes;
  } else if (expenseId == 9) {
    dateRowVisible = true;
    dateLbl = globalConstants.DATE_TEXT;
    descriptionVisible = true;
    typeDropdownVisible = true;
    typeDropdownData = empData.UsTelecomTypes;
  } else if (expenseId == 10) {
    dateRowVisible = true;
    dateLbl = globalConstants.DATE_TEXT;
    descriptionVisible = true;
    guestRowVisible = true;
    typeDropdownVisible = true;
    if (categoryId == 11) {
      typeDropdownData = empData.UsTrBpWelfareTypes;
    } else if (categoryId == 13) {
      typeDropdownData = empData.UsOthBpWelfareTypes;
    }
  } else if (expenseId == 11) {
    dateRowVisible = true;
    dateLbl = globalConstants.DATE_TEXT;
    descriptionVisible = true;
    validTillDateVisible = true;
    typeDropdownVisible = true;
    typeDropdownData = empData.UsMemberSubsTypes;
  } else if (expenseId == 12) {
    dateRowVisible = true;
    dateLbl = globalConstants.DATE_TEXT;
    descriptionVisible = true;
    typeDropdownVisible = true;
    typeDropdownData = empData.UsOtherTypes;
  }

  const onModeOfConveyanceSelection = (i, val) => {
    let myModeOfConveyanceObject = modeOfTravelData.find(
      (el) => el.DisplayText == val
    );
    console.log("My Mode of ConveyanceObject", myModeOfConveyanceObject);
    setModeOfConveyanceObject(myModeOfConveyanceObject);
    if (expenseId == 3 && myModeOfConveyanceObject.ID == 2) {
      fetchLCVModeRate(dateValue, categoryId).then((res) => {
        props.checkError(res);
        if (res.UsLcvModeRate > 0) {
          setAmountEditable(false);
          setOwnCarRate(res.UsLcvModeRate);
          if (milesValue > 0) {
            setAmountInput(
              (milesValue * res.UsLcvModeRate).toFixed(2).toString()
            );
          } else {
            setAmountInput("");
          }
        } else {
          setAmountEditable(true);
          setOwnCarRate(0);
        }
      });
    } else {
      setAmountEditable(true);
      setOwnCarRate(0);
    }
  };

  const onPayTypeSelection = (i, val) => {
    let myPayTypeObject = empData.UsVoucherPayTypeList.find(
      (el) => el.DisplayText == val
    );
    setPayTypeObject(myPayTypeObject);
  };

  const onCurrencySelection = (i, val) => {
    let myCurrencyObject = empData.UsVoucherCurrencyList.find(
      (el) => el.DisplayText == val
    );
    setCurrencyObject(myCurrencyObject);
  };

  const onMilesTextChanged = (text) => {
    setMilesValue(text);
    if (
      expenseId == 3 &&
      !_.isEmpty(modeOfConveyanceObject) &&
      modeOfConveyanceObject.ID == 2
    ) {
      if (ownCarRate > 0) {
        setAmountInput((text * ownCarRate).toFixed(2).toString());
      } else {
        setAmountInput("");
      }
    }
  };

  const dateConfirm = (date) => {
    setDateCalendarVisible(false);
    setDateValue(moment(date).format("DD-MMM-YYYY"));
  };

  const startDateConfirm = (date) => {
    setStartDateCalendarVisible(false);
    setStartDateValue(moment(date).format("DD-MMM-YYYY"));
  };

  const endDateConfirm = (date) => {
    setEndDateCalendarVisible(false);
    setEndDateValue(moment(date).format("DD-MMM-YYYY"));
  };

  const validTillDateConfirm = (date) => {
    setValidTillCalendarVisible(false);
    setValidTillDateValue(moment(date).format("DD-MMM-YYYY"));
  };

  const addItem = () => {
    if (expenseId == 1) {
      if (_.isEmpty(fromInput.trim())) {
        return alert(constants.FROM_ERR_MSG);
      } else if (_.isEmpty(toInput.trim())) {
        return alert(constants.TO_ERR_MSG);
      } else if (_.isEmpty(modeOfConveyanceObject)) {
        return alert(constants.MODE_OF_CONVEY_ERR_MSG);
      } else if (_.isEmpty(carrierInput.trim())) {
        return alert(constants.CARRIER_ERR_MSG);
      }
    } else if (expenseId == 2 || expenseId == 7) {
      if (_.isEmpty(hotelInput.trim())) {
        return alert(constants.HOTEL_ERR_MSG);
      } else if (_.isEmpty(locationInput.trim())) {
        return alert(constants.LOCATION_ERR_MSG1);
      }
    } else if (expenseId == 3) {
      if (_.isEmpty(fromInput.trim())) {
        return alert(constants.FROM_ERR_MSG);
      } else if (_.isEmpty(toInput.trim())) {
        return alert(constants.TO_ERR_MSG);
      } else if (_.isEmpty(modeOfConveyanceObject)) {
        return alert(constants.MODE_OF_CONVEY_ERR_MSG);
      } else if (_.isEmpty(milesValue.trim())) {
        return alert(constants.MILES_ERR_MSG);
      } else if (_.isEmpty(descriptionValue.trim())) {
        return alert(constants.DESCRIPTION_ERR_MSG);
      }
    } else if (expenseId == 4) {
      if (_.isEmpty(type.trim())) {
        return alert(constants.TYPE_ERR_MSG1);
      } else if (_.isEmpty(descriptionValue.trim())) {
        return alert(constants.DESCRIPTION_ERR_MSG);
      }
    } else if (expenseId == 5) {
      if (_.isEmpty(descriptionValue.trim())) {
        return alert(constants.DESCRIPTION_ERR_MSG);
      }
    } else if (
      expenseId == 6 ||
      expenseId == 8 ||
      expenseId == 9 ||
      expenseId == 11 ||
      expenseId == 12
    ) {
      if (_.isEmpty(meal)) {
        return alert(constants.TYPE_ERR_MSG);
      } else if (_.isEmpty(descriptionValue.trim())) {
        return alert(constants.DESCRIPTION_ERR_MSG);
      }
    } else if (expenseId == 10) {
      if (_.isEmpty(meal)) {
        return alert(constants.TYPE_ERR_MSG);
      } else if (_.isEmpty(descriptionValue.trim())) {
        return alert(constants.DESCRIPTION_ERR_MSG);
      } else if (_.isEmpty(guestInput.trim())) {
        return alert(constants.GUEST_ERR_MSG);
      }
    }

    let empDOJDiff = moment(empData.DOJ, "YYYYMMDD").diff(
      moment(dateValue, "DD-MMM-YYYY"),
      "days"
    );
    if (_.isEmpty(payTypeObject)) {
      alert(constants.PAY_TYPE_ERR_MSG);
    } else if (_.isEmpty(currencyObject)) {
      alert(constants.CURRENCY_ERR_MSG);
    } else if (_.isEmpty(amountInput.trim()) || amountInput <= 0) {
      alert(constants.AMOUNT_ERR_MSG);
    } else if (_.isEmpty(exchRateInput.trim()) || exchRateInput <= 0) {
      alert(constants.EXCH_RATE_ERR_MSG);
    } else if (empDOJDiff > 0) {
      alert(constants.DOJ_ERR_MSG);
    } else {
      let expenseInputData = {};
      expenseInputData.date = dateValue;
      expenseInputData.startDate = startDateValue;
      expenseInputData.endDate = endDateValue;
      expenseInputData.meal = meal;
      expenseInputData.type = type;
      expenseInputData.from = fromInput;
      expenseInputData.to = toInput;
      expenseInputData.modeOfConveyanceObj = modeOfConveyanceObject;
      expenseInputData.carrier = carrierInput;
      expenseInputData.hotel = hotelInput;
      expenseInputData.guest = guestInput;
      expenseInputData.validTill = validTillDateValue;
      expenseInputData.location = locationInput;
      expenseInputData.miles = milesValue;
      expenseInputData.description = descriptionValue;
      expenseInputData.payType = payTypeObject;
      expenseInputData.currency = currencyObject;
      expenseInputData.amountInput = amountInput;
      expenseInputData.rate = exchRateInput;
      expenseInputData.amount = finalExchAmount;
      expenseInputData.sAtCheck = sChecked;
      expenseInputData.rAtCheck = rChecked;
      expenseInputData.expenseId = expenseId;
      props.setExpenseInputData(expenseInputData);
    }
  };

  const onTypeSelection = (typeVal) => {
    setType(typeVal);
  };
  const updateExpense = (file) => {
    console.log("File to edit is : ", file);
    editableFile = file;
    setEditPress(2);
    setExpenseId(file.TypeofExpense);
    let expenseType = {};
    let payTypeObject = {};
    let currencyObject = {};
    if (file !== undefined) {
      switch (file.TypeofExpense) {
        case "1":
          setDateValue(file.SMemoDate);
          setCarrierInput(file.Carrier);
          setStartDateValue(file.JourneyFromDate);
          setEndDateValue(file.JourneyToDate);
          setFromInput(file.DestFrom);
          setToInput(file.DestTo);
          break;
        case "2":
          setStartDateValue(file.JourneyFromDate);
          setEndDateValue(file.JourneyToDate);
          setHotelInput(file.HotelName);
          setLocationInput(file.UsLocation);
          break;
        case "3":
          setDateValue(file.SMemoDate);
          setMilesValue(file.LCVKM);
          setDescriptionValue(file.Particulars);
          setFromInput(file.LCVFrom);
          setToInput(file.LCVTo);
          break;
        case "4":
          setDateValue(file.SMemoDate);
          setDescriptionValue(file.Particulars);
          setType(file.UsType);
          break;
        case "5":
          setDateValue(file.SMemoDate);
          setDescriptionValue(file.Particulars);
          setType(file.UsType);
          break;

        case "6":
          setDateValue(file.SMemoDate);
          setDescriptionValue(file.Particulars);
          expenseType.ID = file.UsType;
          expenseType.DisplayText = file.TypeofExpenseText;
          if (typeRef.current !== null) {
            let expenseTypeIndex = empData.UsIncidentalTypes.findIndex(
              (element) => element.DisplayText == file.TypeofExpenseText
            );
            typeRef.current.select(expenseTypeIndex);
            setIncident(expenseType);
            console.log(
              "Setting expense type while update drop down: ",
              expenseType
            );
          }
          break;
        case "7":
          setStartDateValue(file.JourneyFromDate);
          setEndDateValue(file.JourneyToDate);
          setHotelInput(file.HotelName);
          setLocationInput(file.UsLocation);
          break;
        case "8":
          setDateValue(file.SMemoDate);
          setDescriptionValue(file.Particulars);
          expenseType.ID = file.UsType;
          expenseType.DisplayText = file.TypeofExpenseText;
          if (typeRef.current !== null) {
            let expenseTypeIndex = empData.MealIncidentalTypes.findIndex(
              (element) => element.DisplayText == file.TypeofExpenseText
            );
            typeRef.current.select(expenseTypeIndex);
            setIncident(expenseType);
            console.log(
              "Setting expense type while update drop down: ",
              expenseType
            );
          }
          break;
        case "9":
          setDateValue(file.SMemoDate);
          setDescriptionValue(file.Particulars);
          expenseType.ID = file.UsType;
          expenseType.DisplayText = file.TypeofExpenseText;
          if (typeRef.current !== null) {
            let expenseTypeIndex = empData.UsTelecomTypes.findIndex(
              (element) => element.DisplayText == file.TypeofExpenseText
            );
            typeRef.current.select(expenseTypeIndex);
            setIncident(expenseType);
            console.log(
              "Setting expense type while update drop down: ",
              expenseType
            );
          }
          break;
        case "10":
          if (categoryId == 11) {
            typeDropdownData = empData.UsTrBpWelfareTypes;
          } else if (categoryId == 13) {
            typeDropdownData = empData.UsOthBpWelfareTypes;
          }
          expenseType.ID = file.UsType;
          expenseType.DisplayText = file.TypeofExpenseText;
          setDateValue(file.SMemoDate);
          setDescriptionValue(file.Particulars);
          setGuestInput(file.Guest);
          if (typeRef.current !== null) {
            let expenseTypeIndex = typeDropdownData.findIndex(
              (element) => element.DisplayText == file.TypeofExpenseText
            );
            typeRef.current.select(expenseTypeIndex);
            setIncident(expenseType);
            console.log(
              "Setting expense type while update drop down: ",
              expenseType
            );
          }
          break;
        case "11":
          setDateValue(file.SMemoDate);
          setDescriptionValue(file.Particulars);
          setValidTillDateValue(file.ValidTill);
          expenseType.ID = file.UsType;
          expenseType.DisplayText = file.TypeofExpenseText;
          if (typeRef.current !== null) {
            let expenseTypeIndex = empData.UsMemberSubsTypes.findIndex(
              (element) => element.DisplayText == file.TypeofExpenseText
            );
            typeRef.current.select(expenseTypeIndex);
            setIncident(expenseType);
            console.log(
              "Setting expense type while update drop down: ",
              expenseType
            );
          }
          break;
        case "12":
          setDateValue(file.SMemoDate);
          setDescriptionValue(file.Particulars);
          expenseType.ID = file.UsType;
          expenseType.DisplayText = file.TypeofExpenseText;
          if (typeRef.current !== null) {
            let expenseTypeIndex = empData.UsOtherTypes.findIndex(
              (element) => element.DisplayText == file.TypeofExpenseText
            );
            typeRef.current.select(expenseTypeIndex);
            setIncident(expenseType);
            console.log(
              "Setting expense type while update drop down: ",
              expenseType
            );
          }
          break;
      }
      setSChecked(file.ExpenseProofAttached == "Yes" ? true : false);
      setRChecked(file.PayReceiptAttached == "Yes" ? true : false);
      payTypeObject.ID = file.PayType;
      payTypeObject.DisplayText = file.PayTypeText;

      setTimeout(() => {
        if (payTypeRef.current !== null) {
          let payTypeIndex = empData.UsVoucherPayTypeList.findIndex(
            (element) => element.DisplayText == file.PayTypeText
          );
          payTypeRef.current.select(payTypeIndex);
        }
        setPayTypeObject(payTypeObject);
      }, 100);

      setTimeout(() => {
        currencyObject.ID = file.vc_Currency;
        currencyObject.DisplayText = file.Currency;
        if (currencyRef.current !== null) {
          let currencyIndex = empData.UsVoucherCurrencyList.findIndex(
            (element) => element.DisplayText == file.vc_Currency
          );
          currencyRef.current.select(currencyIndex);
          setCurrencyObject(currencyObject);
        }
      }, 100);

      setAmountInput("" + file.UsAmount);
      setExchRateInput("" + file.ExchRate);
    }
  };

  const onIncidentalTypeSelection = (index, value) => {
    if (expenseId == 6) {
      typeDropdownData = empData.UsIncidentalTypes;
    } else if (expenseId == 8) {
      typeDropdownData = empData.MealIncidentalTypes;
    } else if (expenseId == 9) {
      typeDropdownData = empData.UsTelecomTypes;
    } else if (expenseId == 10) {
      if (categoryId == 11) {
        typeDropdownData = empData.UsTrBpWelfareTypes;
      } else if (categoryId == 13) {
        typeDropdownData = empData.UsOthBpWelfareTypes;
      }
    } else if (expenseId == 11) {
      typeDropdownData = empData.UsMemberSubsTypes;
    } else if (expenseId == 12) {
      typeDropdownData = empData.UsOtherTypes;
    }
    let typeObject = typeDropdownData.find((el) => el.DisplayText == value);
    console.log("Type object is : ", typeObject);
    setIncident(typeObject);
  };

  const resetExpense = (file) => {
    console.log("Expense Id in resetExpense: ", expenseId);
    console.log("Expense type is :", file.TypeofExpense);
    setEditPress(1);
    setDateValue(dateDefault);
    setAmountInput("");
    setExchRateInput("");
    setType("");
    setDateCalendarVisible(false);
    setSChecked(false);
    setRChecked(false);
    setEndDateValue(dateDefault);
    setStartDateValue(dateDefault);
    setFromInput("");
    setToInput("");
    setCarrierInput("");
    setDescriptionValue("");
    setHotelInput("");
    setLocationInput("");
    setMilesValue("");
    setGuestInput("");
  };

  expenseDetailsInputFieldsView = () => {
    console.log("typeDropdownData", typeDropdownData); //expenseId
    console.log("Expense id ", expenseId);
    console.log("categoryId ", categoryId);
    return (
      <View>
        {dateRowVisible ? (
          <DatePicker
            heading={dateLbl + globalConstants.ASTERISK_SYMBOL}
            myDatePickerVisible={dateCalendarVisible}
            myMaxDate={moment().toDate()}
            myMinDate={moment(financialYearStartDate, "DD-MMM-YYYY").toDate()}
            myCalenderSelectedDate={moment(dateValue, "DD-MMM-YYYY").toDate()}
            myDateValue={dateValue}
            showMyCalendar={() => setDateCalendarVisible(true)}
            handleConfirm={(date) => dateConfirm(date)}
            hideDatePicker={() => setDateCalendarVisible(false)}
          />
        ) : null}
        {typeDropdownVisible ? (
          <Dropdown
            title={globalConstants.TYPE_TEXT + globalConstants.ASTERISK_SYMBOL}
            disabled={false}
            forwardedRef={typeRef}
            dropDownData={typeDropdownData.map((value) => value.DisplayText)}
            dropDownCallBack={(index, value) =>
              onIncidentalTypeSelection(index, value)
            }
          />
        ) : typeFieldVisible ? (
          <LabelEditText
            heading={
              globalConstants.TYPE_TEXT + globalConstants.ASTERISK_SYMBOL
            }
            onTextChanged={(text) => onTypeSelection(text)}
            myValue={type}
            isSmallFont={true}
          />
        ) : null}
        {startDateRowVisible ? (
          <DatePicker
            heading={startDateLbl + globalConstants.ASTERISK_SYMBOL}
            myDatePickerVisible={startDateCalendarVisible}
            myMaxDate={moment().toDate()}
            myMinDate={moment(financialYearStartDate, "DD-MMM-YYYY").toDate()}
            myCalenderSelectedDate={moment(
              startDateValue,
              "DD-MMM-YYYY"
            ).toDate()}
            myDateValue={startDateValue}
            showMyCalendar={() => setStartDateCalendarVisible(true)}
            handleConfirm={(date) => startDateConfirm(date)}
            hideDatePicker={() => setStartDateCalendarVisible(false)}
          />
        ) : null}
        {endDateRowVisible ? (
          <DatePicker
            heading={endDateLbl + globalConstants.ASTERISK_SYMBOL}
            myDatePickerVisible={endDateCalendarVisible}
            myMaxDate={moment().toDate()}
            myMinDate={moment(financialYearStartDate, "DD-MMM-YYYY").toDate()}
            myCalenderSelectedDate={moment(
              endDateValue,
              "DD-MMM-YYYY"
            ).toDate()}
            myDateValue={endDateValue}
            showMyCalendar={() => setEndDateCalendarVisible(true)}
            handleConfirm={(date) => endDateConfirm(date)}
            hideDatePicker={() => setEndDateCalendarVisible(false)}
          />
        ) : null}
        {hotelRowVisible ? (
          <LabelEditText
            heading={constants.HOTEL_TEXT + globalConstants.ASTERISK_SYMBOL}
            onTextChanged={(text) => setHotelInput(text)}
            myValue={hotelInput}
            isSmallFont={true}
          />
        ) : null}
        {locationRowVisible ? (
          <LabelEditText
            heading={
              globalConstants.LOCATION_TEXT + globalConstants.ASTERISK_SYMBOL
            }
            onTextChanged={(text) => setLocationInput(text)}
            myValue={locationInput}
            isSmallFont={true}
          />
        ) : null}
        {fromRowVisible ? (
          <LabelEditText
            heading={constants.FROM_TEXT + globalConstants.ASTERISK_SYMBOL}
            onTextChanged={(text) => setFromInput(text)}
            myValue={fromInput}
            isSmallFont={true}
          />
        ) : null}
        {toRowVisible ? (
          <LabelEditText
            heading={constants.TO_TEXT + globalConstants.ASTERISK_SYMBOL}
            onTextChanged={(text) => setToInput(text)}
            myValue={toInput}
            isSmallFont={true}
          />
        ) : null}
        {modeOfConveyanceVisible ? (
          <Dropdown
            title={
              constants.MODE_OF_CONVEYANCE_TEXT +
              globalConstants.ASTERISK_SYMBOL
            }
            disabled={false}
            dropDownData={modeOfTravelData.map((value) => value.DisplayText)}
            dropDownCallBack={(index, value) =>
              onModeOfConveyanceSelection(index, value)
            }
            isSmallFont={true}
            forwardedRef={modeRef}
          />
        ) : null}
        {carrierVisible ? (
          <LabelEditText
            heading={constants.CARRIER_TEXT + globalConstants.ASTERISK_SYMBOL}
            onTextChanged={(text) => setCarrierInput(text)}
            myValue={carrierInput}
            isSmallFont={true}
          />
        ) : null}
        {descriptionVisible ? (
          <LabelEditText
            heading={
              constants.DESCRIPTION_TEXT + globalConstants.ASTERISK_SYMBOL
            }
            onTextChanged={(text) => setDescriptionValue(text)}
            myValue={descriptionValue}
            isSmallFont={true}
          />
        ) : null}
        {milesVisible ? (
          <LabelEditText
            heading={constants.MILES_TEXT + globalConstants.ASTERISK_SYMBOL}
            onTextChanged={(text) => onMilesTextChanged(text)}
            myValue={milesValue}
            isSmallFont={true}
            myKeyboardType="numeric"
          />
        ) : null}
        {guestRowVisible ? (
          <LabelEditText
            heading={constants.GUEST_TEXT + globalConstants.ASTERISK_SYMBOL}
            onTextChanged={(text) => setGuestInput(text)}
            myValue={guestInput}
            isSmallFont={true}
          />
        ) : null}
        {validTillDateVisible ? (
          <DatePicker
            heading={
              constants.VALID_TILL_TEXT + globalConstants.ASTERISK_SYMBOL
            }
            myDatePickerVisible={validTillCalendarVisible}
            myMinDate={moment().toDate()}
            myCalenderSelectedDate={moment(
              validTillDateValue,
              "DD-MMM-YYYY"
            ).toDate()}
            myDateValue={validTillDateValue}
            showMyCalendar={() => setValidTillCalendarVisible(true)}
            handleConfirm={(date) => validTillDateConfirm(date)}
            hideDatePicker={() => setValidTillCalendarVisible(false)}
          />
        ) : null}
        <Dropdown
          title={constants.PAY_TYPE_TEXT + globalConstants.ASTERISK_SYMBOL}
          disabled={false}
          forwardedRef={payTypeRef}
          dropDownData={empData.UsVoucherPayTypeList.map(
            (value) => value.DisplayText
          )}
          dropDownCallBack={(index, value) => onPayTypeSelection(index, value)}
          isSmallFont={true}
        />
        <Dropdown
          title={
            globalConstants.CURRENCY_TEXT + globalConstants.ASTERISK_SYMBOL
          }
          disabled={false}
          forwardedRef={currencyRef}
          dropDownData={empData.UsVoucherCurrencyList.map(
            (value) => value.DisplayText
          )}
          dropDownCallBack={(index, value) => onCurrencySelection(index, value)}
          isSmallFont={true}
        />
        <LabelEditText
          heading={
            globalConstants.AMOUNT_TEXT + globalConstants.ASTERISK_SYMBOL
          }
          onTextChanged={(text) => setAmountInput(text)}
          myValue={amountInput}
          isEditable={amountEditable}
          isSmallFont={true}
          myKeyboardType="numeric"
        />
        <LabelEditText
          heading={constants.EXCH_RATE_TEXT + globalConstants.ASTERISK_SYMBOL}
          onTextChanged={(text) => setExchRateInput(text)}
          myValue={exchRateInput}
          isEditable={exchRateEditable}
          isSmallFont={true}
          myKeyboardType="numeric"
        />
        <LabelEditText
          heading={
            constants.AMOUNT_IN_TEXT +
            defaultCurrencyIdValue +
            globalConstants.ASTERISK_SYMBOL
          }
          onTextChanged={(text) => setFinalExchAmount(text)}
          myValue={finalExchAmount}
          isEditable={false}
          isSmallFont={true}
        />
        <View style={styles.autocompleteParentView}>
          <Tooltip
            // containerStyle={styles.container}
            height={60}
            backgroundColor={appConfig.LOGIN_FIELDS_BACKGROUND_COLOR}
            // withOverlay={false}
            popover={<Text>{constants.S_AT_THE_RATE_TOOLTIP_MSG}</Text>}
          >
            <Text style={styles.tooltipText}>
              {constants.S_AT_THE_RATE_TEXT}
            </Text>
          </Tooltip>
          {/* <Checkbox.Android
            color={appConfig.DARK_BLUISH_COLOR}
            status={sChecked ? "checked" : "unchecked"}
            onPress={() => setSChecked(!sChecked)}
          /> */}
          <CheckBox
            iconType="material-community"
            checkedIcon="checkbox-marked"
            uncheckedIcon="checkbox-blank-outline"
            checkedColor={appConfig.DARK_BLUISH_COLOR}
            uncheckedColor="gray"
            // title={item.Name}
            textStyle={{ fontWeight: "400" }}
            containerStyle={{
              backgroundColor: "transparent",
              borderWidth: 0,
            }}
            checked={sChecked}
            onPress={() => setSChecked(!sChecked)}
          />
        </View>
        <View style={styles.autocompleteParentView}>
          <Tooltip
            // containerStyle={styles.container}
            height={70}
            width={170}
            // highlightColor={appConfig.LIST_BORDER_COLOUR}
            backgroundColor={appConfig.LOGIN_FIELDS_BACKGROUND_COLOR}
            // withOverlay={false}
            popover={<Text>{constants.R_AT_THE_RATE_TOOLTIP_MSG}</Text>}
          >
            <Text style={styles.tooltipText}>
              {constants.R_AT_THE_RATE_TEXT}
            </Text>
          </Tooltip>
          {/* <Checkbox.Android
            color={appConfig.DARK_BLUISH_COLOR}
            status={rChecked ? "checked" : "unchecked"}
            onPress={() => setRChecked(!rChecked)}
          /> */}
          <CheckBox
            iconType="material-community"
            checkedIcon="checkbox-marked"
            uncheckedIcon="checkbox-blank-outline"
            checkedColor={appConfig.DARK_BLUISH_COLOR}
            uncheckedColor="gray"
            // title={item.Name}
            textStyle={{ fontWeight: "400" }}
            containerStyle={{
              backgroundColor: "transparent",
              borderWidth: 0,
            }}
            checked={rChecked}
            onPress={() => setRChecked(!rChecked)}
          />
        </View>
        <View style={styles.addItemButtonView}>
          <CustomButton
            label={
              props.editCase ? constants.UPDATE_TEXT : constants.ADD_ITEM_TEXT
            }
            positive={true}
            performAction={() => addItem()}
          />
        </View>
      </View>
    );
  };

  useEffect(() => {
    console.log("5555", currencyObject);
    if (defaultCurrencyIdValue !== currencyObject.ID) {
      setExchRateEditable(true);
    } else {
      setExchRateEditable(false);
      setExchRateInput("1");
    }
  }, [currencyObject]);

  useEffect(() => {
    let myFixAmountInLocal = amountInput * exchRateInput;
    setFinalExchAmount(parseFloat(myFixAmountInLocal.toString()).toFixed(2));
  }, [amountInput, exchRateInput]);

  useEffect(() => {
    let bookingStartDateDiff = calculateDaysDiff(dateValue, startDateValue);
    let startDestDateDiff = calculateDaysDiff(startDateValue, endDateValue);
    console.log("Bookking Date : ", dateValue);
    console.log("Bookking start date : ", startDateValue);
    console.log("EXPENSE ID :  ", expenseId);
    console.log("Bookking end date : ", endDateValue);
    if (expenseId == 1 && bookingStartDateDiff > 0) {
      setStartDateValue(dateDefault);
      setTimeout(() => {
        alert(constants.BOOKING_DATE_ERR_MSG);
      }, 100);
    }
    if (startDestDateDiff > 0) {
      setEndDateValue(dateDefault);
      setTimeout(() => {
        alert(
          expenseId == 1
            ? constants.END_DATE_ERR_MSG
            : constants.CHECK_OUT_DATE_ERR_MSG
        );
      }, 100);
    }
  }, [dateValue, startDateValue, endDateValue, expenseId]);
  useEffect(() => {
    if (modeRef.current == null) {
      return;
    } else {
      if (editPress == 1) {
        modeRef.current.select(-1);
        setModeOfConveyanceObject({});
      } else if (
        editPress == 2 &&
        editableFile &&
        editableFile.TypeofExpense == 1
      ) {
        let modeIndex = empData.UsTravelMode.findIndex(
          (element) => element.DisplayText == editableFile.UsModeOfTravelText
        );
        modeRef.current.select(modeIndex);
        let conveyanceModeObject = {};
        conveyanceModeObject.ID = editableFile.ModeOfTravel;
        conveyanceModeObject.DisplayText = editableFile.ModeOfTravelText;
        setModeOfConveyanceObject(conveyanceModeObject);
      } else if (
        modeRef.current !== null &&
        editPress == 2 &&
        editableFile &&
        editableFile.TypeofExpense == 3
      ) {
        let modeIndex = empData.UsLcvMode.findIndex(
          (element) => element.DisplayText == editableFile.LCVUsModeText
        );
        modeRef.current.select(modeIndex);
        if (editableFile.LCVUsMode == 2) {
          fetchLCVModeRate(dateValue, categoryId).then((res) => {
            props.checkError(res);
            if (res.UsLcvModeRate > 0) {
              setOwnCarRate(res.UsLcvModeRate);
              setAmountEditable(false);
            } else {
              setAmountEditable(true);
            }
          });
        }
        let conveyanceModeObject = {};
        conveyanceModeObject.ID = editableFile.LCVUsMode;
        conveyanceModeObject.DisplayText = editableFile.LCVUsModeText;
        setModeOfConveyanceObject(conveyanceModeObject);
      }
    }
  }, [dateValue, editPress]);

  useEffect(() => {
    if (editPress == 1) {
      if (typeRef.current !== null) {
        typeRef.current.select(-1);
        setIncident({});
      }
      if (currencyRef.current !== null) {
        currencyRef.current.select(-1);
        setCurrencyObject({});
      }
      if (payTypeRef.current !== null) {
        payTypeRef.current.select(-1);
        setPayTypeObject({});
      }
    }
  }, [editPress]);

  useEffect(() => {
    props.setEditDeleteCallBacks(resetExpense, updateExpense);
  }, []);

  if (expenseId == undefined) {
    return null;
  } else {
    return (
      <View style={styles.userInfoView}>
        <ImageBackground style={styles.cardBackground} resizeMode="cover">
          {sectionTitle(
            isDocumentSaved
              ? constants.ENTER_EXPENSE_DETAILS_TEXT
              : constants.EXPENSE_DETAILS_TEXT
          )}
          <View style={styles.cardStyle}>
            {expenseDetailsInputFieldsView()}
          </View>
        </ImageBackground>
      </View>
    );
  }
};

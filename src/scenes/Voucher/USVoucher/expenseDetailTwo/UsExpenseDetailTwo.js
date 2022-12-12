import React, { useState } from "react";
import { ImageBackground, Text, View } from "react-native";
import {
  sectionTitle,
  calculateFinancialYear,
} from "../../createVoucher/cvUtility.js";
import { LabelEditText } from "../../../../GlobalComponent/LabelEditText/LabelEditText.js";
import { DatePicker } from "../../../../GlobalComponent/DatePicker/DatePicker.js";
import CustomButton from "../../../../components/customButton.js";
import { CheckBox } from "react-native-elements";
let appConfig = require("../../../../../appconfig");
import moment from "moment";
import { Dropdown } from "../../../../GlobalComponent/DropDown/DropDown.js";
import _ from "lodash";
let constants = require("./constants");

export const UsExpenseDetailTwo = (props) => {
  let empData = props.myEmpData[0];
  this.typeRef = React.createRef();
  this.payTypeRef = React.createRef();
  this.currencyRef = React.createRef();

  console.log("Props in expense details : ", props);
  let dateDefault = moment().format("DD-MMM-YYYY");
  console.log("Employee data : ", empData);
  let expenseData = {};
  let docDate =
    empData.DocDate === undefined ? "" : empData.DocDate.replace(/-/g, " ");
  const [expenseId, setExpenseId] = useState(props.myExpenseTypeId);
  const [meal, setIncident] = useState({});
  const [type, setType] = useState("");
  const [currency, setCurrency] = useState({});
  const [payType, setPayType] = useState({});
  const [dateValue, setDate] = useState(dateDefault);
  const [calendarVisible, setcalendarVisible] = useState(false);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState(""); //final amt
  const [amountInput, setAmountInput] = useState("");
  const [rate, setExchange] = useState("");
  const [sChecked, setSchecked] = useState(false);
  const [rChecked, setRchecked] = useState(false);
  // const[currencyIndex,setCurrencyIndex] = useState(-1);
  let financialYearStartDate = calculateFinancialYear(dateValue);

  const showDateCalendar = () => {
    setcalendarVisible(true);
  };
  const setDateFromPicker = (date) => {
    setcalendarVisible(false);
    setDate(moment(date).format("DD-MMM-YYYY"));
  };
  const hideDateCalendar = () => {
    setcalendarVisible(false);
  };
  const calculateAmount = () => {
    console.log("RAte : ", rate);
    console.log("amountInput : ", amountInput);
    let calculatedAmount = rate * amountInput;
    console.log("Calculated Amount is : ", calculatedAmount);
    if (isNaN(calculatedAmount)) {
      setAmount(0);
    } else {
      setAmount(calculatedAmount.toFixed(2));
    }
  };
  const handleAmountInput = (text) => {
    let input = parseFloat(text);
    setAmountInput(input);
  };
  const handleExchangeInput = (text) => {
    let input = parseFloat(text);
    setExchange(input);
  };
  const toggleChecked = (item, index) => {
    item.IsChecked = !item.IsChecked;
  };
  const addItem = () => {
    if ((expenseId == 6 && _.isEmpty(meal)) || (expenseId == 4 && type == "")) {
      alert(constants.TYPE_ERROR);
    } else if (description == "") {
      alert(constants.DESCRIPTION_ERROR);
    } else if (_.isEmpty(payType)) {
      alert(constants.PAY_TYPE_ERROR);
    } else if (_.isEmpty(currency)) {
      alert(constants.CURRENCY_ERROR);
    } else if (amount == 0) {
      alert(constants.AMOUNT_ERROR);
    } else {
      expenseData.meal = meal;
      expenseData.type = type;
      expenseData.currency = currency;
      expenseData.payType = payType;
      expenseData.date = dateValue;
      expenseData.description = description;
      expenseData.amountInput = amountInput;
      expenseData.rate = rate;
      expenseData.amount = amount;
      expenseData.sChecked = sChecked;
      expenseData.rChecked = rChecked;
      props.setExpenseData(expenseData);
    }
  };
  const onTypeSelection = (typeval) => {
    setType(typeval);
  };
  const onIncidentalTypeSelection = (index, value) => {
    let typeObject = empData.UsIncidentalTypes.find(
      (el) => el.DisplayText == value
    );
    console.log("Type object is : ", typeObject);
    setIncident(typeObject);
  };
  const oncurrencySelection = (index, value) => {
    console.log("Currency selected is :", value);
    let currencyObject = empData.UsVoucherCurrencyList.find(
      (el) => el.DisplayText == value
    );
    console.log("Currency object is :", currencyObject);
    setCurrency(currencyObject);
  };
  const onPayTypeSelection = (index, value) => {
    console.log("Paytype selected is :", value);
    let paytypeObject = empData.UsVoucherPayTypeList.find(
      (el) => el.DisplayText == value
    );
    console.log("Paytype object is :", paytypeObject);
    setPayType(paytypeObject);
  };
  const onPurposeSelection = (index, value) => {
    console.log("Purpose selected", value);
    let purposeObj = empData.MobileVoucherPurpose.find(
      (el) => el.DisplayText == value
    );
    console.log("Purpose selected", purposeObj);
    setExpense(purposeObj);
  };
  const resetExpense = () => {
    setAmountInput("0");
    setExchange("0");
    setType("");
    setDate(dateDefault);
    setcalendarVisible(false);
    setDescription("");
    setSchecked(false);
    setRchecked(false);
    if (this.typeRef.current !== null && this.typeRef.current !== undefined) {
      this.typeRef.current.select(-1);
      setIncident({});
    }
    if (
      this.currencyRef.current !== null &&
      this.currencyRef.current !== undefined
    ) {
      this.currencyRef.current.select(-1);
      setCurrency({});
    }
    if (
      this.payTypeRef.current !== null &&
      this.payTypeRef.current !== undefined
    ) {
      this.payTypeRef.current.select(-1);
      setPayType({});
    }
  };
  const updateExpense = (file) => {
    console.log("File to edit is : ", file.TypeofExpense);
    setExpenseId(file.TypeofExpense);
    let expenseType = {};
    let payType = {};
    let currency = {};
    if (file !== undefined) {
      setDate(file.SMemoDate);
      // setcalendarVisible(false)
      setDescription(file.Particulars);
      setSchecked(file.ExpenseProofAttached == "Yes" ? true : false);
      setRchecked(file.PayReceiptAttached == "Yes" ? true : false);

      if (!isNaN(parseInt(file.UsType))) {
        expenseType.ID = file.UsType;
        expenseType.DisplayText = file.TypeofExpenseText;
        if (this.typeRef.current !== null) {
          let expenseTypeIndex = empData.UsIncidentalTypes.findIndex(
            (element) => element.DisplayText == file.TypeofExpenseText
          );
          this.typeRef.current.select(expenseTypeIndex);
          // setIncident(expenseType);
          console.log(
            "Setting expense type while update drop down: ",
            expenseType
          );
        }
      } else {
        console.log(
          "Setting expense type while update non drop down : ",
          file.UsType
        );
        setType(file.UsType);
      }

      payType.ID = file.PayType;
      payType.DisplayText = file.PayTypeText;
      if (this.payTypeRef.current !== null) {
        let payTypeIndex = empData.UsVoucherPayTypeList.findIndex(
          (element) => element.DisplayText == file.PayTypeText
        );
        this.payTypeRef.current.select(payTypeIndex);
      }
      setPayType(payType);

      currency.ID = file.vc_Currency;
      currency.DisplayText = file.Currency;
      if (this.currencyRef.current !== null) {
        let currencyIndex = empData.UsVoucherCurrencyList.findIndex(
          (element) => element.DisplayText == file.vc_Currency
        );
        this.currencyRef.current.select(currencyIndex);
        setCurrency(currency);
      }
      // setAmount(file.AmountInDollar)
      setAmountInput("" + file.UsAmount);
      setExchange("" + file.ExchRate);
    }
  };

  return (
    <View style={styles.container}>
      {sectionTitle("Employee Expense Details")}
      <ImageBackground style={styles.cardBackground} resizeMode="cover">
        <DatePicker
          myDatePickerVisible={calendarVisible}
          heading="Date"
          myMaxDate={moment().toDate()}
          myMinDate={moment(financialYearStartDate, "DD-MMM-YYYY").toDate()}
          myCalenderSelectedDate={moment(dateValue, "DD-MMM-YYYY").toDate()}
          myDateValue={dateValue}
          showMyCalendar={showDateCalendar}
          handleConfirm={(date) => setDateFromPicker(date)}
          hideDatePicker={hideDateCalendar}
        />
        {expenseId == 6 ? (
          <Dropdown
            title="Type"
            disabled={false}
            forwardedRef={this.typeRef}
            dropDownData={empData.UsIncidentalTypes.map(
              (value) => value.DisplayText
            )}
            dropDownCallBack={(index, value) =>
              onIncidentalTypeSelection(index, value)
            }
          />
        ) : expenseId == 4 ? (
          <LabelEditText
            heading="Type"
            placeHolder="Type"
            myMaxLength={50}
            myNumberOfLines={2}
            // isMultiline={true}// This obstructs the scroll view up.
            onTextChanged={(text) => onTypeSelection(text)}
            myValue={type}
            isSmallFont={true}
          />
        ) : null}
        <LabelEditText
          heading="Description"
          placeHolder="Description"
          myMaxLength={50}
          myNumberOfLines={2}
          // isMultiline={true}// This obstructs the scroll view up.
          onTextChanged={setDescription}
          myValue={description}
          isSmallFont={true}
        />

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
          }}
        >
          <Text>S@</Text>
          {/* <Checkbox.Android
            disabled={false}
            color={appConfig.DARK_BLUISH_COLOR}
            uncheckedColor="grey"
            status={sChecked == true ? "checked" : "unchecked"}
            onPress={() => setSchecked(!sChecked)}
          /> */}
          <CheckBox
            iconType="material-community"
            checkedIcon="checkbox-marked"
            uncheckedIcon="checkbox-blank-outline"
            checkedColor={appConfig.DARK_BLUISH_COLOR}
            uncheckedColor="gray"
            // title={"S@"}
            textStyle={{ fontWeight: "400" }}
            containerStyle={{
              backgroundColor: "transparent",
              borderWidth: 0,
            }}
            checked={sChecked}
            onPress={() => setSchecked(!sChecked)}
          />
          <Dropdown
            title="Pay Type"
            disabled={false}
            forwardedRef={this.payTypeRef}
            dropDownData={empData.UsVoucherPayTypeList.map(
              (value) => value.DisplayText
            )}
            dropDownCallBack={(index, value) =>
              onPayTypeSelection(index, value)
            }
          />
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
          <Text>R@</Text>
          {/* <Checkbox.Android
            disabled={false}
            color={appConfig.DARK_BLUISH_COLOR}
            uncheckedColor="grey"
            status={rChecked == true ? "checked" : "unchecked"}
            onPress={() => setRchecked(!rChecked)}
          /> */}
          <CheckBox
            iconType="material-community"
            checkedIcon="checkbox-marked"
            uncheckedIcon="checkbox-blank-outline"
            checkedColor={appConfig.DARK_BLUISH_COLOR}
            uncheckedColor="gray"
            // title={"R@"}
            textStyle={{ fontWeight: "400" }}
            containerStyle={{
              backgroundColor: "transparent",
              borderWidth: 0,
            }}
            checked={rChecked}
            onPress={() => setRchecked(!rChecked)}
          />
          <Dropdown
            title="Currency"
            disabled={false}
            forwardedRef={this.currencyRef}
            dropDownData={empData.UsVoucherCurrencyList.map(
              (value) => value.DisplayText
            )}
            dropDownCallBack={(index, value) =>
              oncurrencySelection(index, value)
            }
          />
        </View>
        <LabelEditText
          heading="Amount"
          placeHolder="Amount"
          myMaxLength={50}
          myNumberOfLines={2}
          // isMultiline={true} // This obstructs the scroll view up.
          onTextChanged={(text) => handleAmountInput(text)}
          myValue={amountInput}
          isSmallFont={true}
          myKeyboardType="numeric"
        />
        <LabelEditText
          heading="Exch. Rate"
          placeHolder="Exch. Rate"
          myMaxLength={50}
          myNumberOfLines={2}
          // isMultiline={true} // This obstructs the scroll view up.
          onTextChanged={(text) => handleExchangeInput(text)}
          myValue={rate}
          isSmallFont={true}
          myKeyboardType="numeric"
        />

        <LabelEditText
          heading="Amount in $"
          placeHolder="Amount in $"
          myMaxLength={50}
          myNumberOfLines={2}
          isEditable={false}
          // isMultiline={true} // This obstructs the scroll view up.
          myValue={"" + amount}
          isSmallFont={true}
        />

        <View style={styles.addItemButtonView}>
          <CustomButton
            label={!props.editCase ? "Add Item" : "Update Item"}
            positive={true}
            performAction={() => addItem()}
          />
        </View>
      </ImageBackground>
    </View>
  );
};

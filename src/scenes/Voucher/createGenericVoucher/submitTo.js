import React, { useState, useEffect } from "react";
import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ProgressBarAndroidComponent,
  Alert,
} from "react-native";
import { moderateScale } from "../../../components/fontScaling.js";
import { LabelText } from "../../../GlobalComponent/LabelText/LabelText.js";
import {
  sectionTitle,
  calculateFinancialYear,
} from "../createVoucher/cvUtility.js";
import { LabelEditText } from "../../../GlobalComponent/LabelEditText/LabelEditText.js";
import { DatePicker } from "../../../GlobalComponent/DatePicker/DatePicker.js";
import CustomButton from "../../../components/customButton.js";
let appConfig = require("../../../../appconfig");
import { Dropdown } from "../../../GlobalComponent/DropDown/DropDown.js";
import Autocomplete from "react-native-autocomplete-input";
let constants = require("./constants");
let globalConstants = require("../../../GlobalConstants");
import { searchSupervisors } from "./utils.js";
export const SubmitTo = (props) => {
  console.log("submit to props:", props);
  this.submitToRef = React.createRef();
  let empData = props.myEmpData[0];
  let documentNumber = props.documentNumber;
  let submitToInitialValue =
    documentNumber.includes("MBL") ||
    documentNumber.includes("PET") ||
    documentNumber.includes("DRV") ||
    props.subCategoryId == 10 ||
    documentNumber.includes("MED") ||
    (empData && empData.IsApplicableToForwardFSO) === "YES"
      ? "FSO"
      : "";
  const [submitToValue, submitTo] = useState(submitToInitialValue);
  const [autoSearchSupervisorDataArray, setSupervisorDataArray] = useState([]);
  const [supervisorSearchValue, setSupervisorSearchVal] = useState("");
  const [autoCompleteSupervisorHideResult, setHideResult] = useState(false);
  const [remarksInput, onRemarksChanged] = useState("");
  const onSubmitToSelection = (i, value) => {
    console.log("submit to value", value);
    submitTo(value);
  };
  const renderAutoCompleteSupervisorResult = (item, i) => {
    console.log("Item found ", item);
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            setHideResult(true);
            setSupervisorSearchVal(item.Key);
            props.setSupervisor(item);
          }}
        >
          <Text>{item.Key}</Text>
        </TouchableOpacity>
        <View style={{ height: 1, backgroundColor: "white" }} />
      </View>
    );
  };
  const submitAction = () => {
    console.log("Desired props : ", props);
    let fn = props.submitDetails;
    console.log("Desired Function : ", fn);
    fn(submitToValue, remarksInput);
  };
  const deleteAction = () => {
    Alert.alert(
      "Delete Document!",
      "Are you sure you want to delete this Voucher?",
      [
        {
          text: "Yes",
          onPress: () => {
            props.deleteVoucher();
          },
        },
        { text: "No", onPress: () => {} },
      ]
    );
  };
  const onAutoCompleteSupervisorChangeText = async (text) => {
    if (text.length > 1) {
      setHideResult(false);
      try {
        setSupervisorSearchVal(text);
        let searchVal = await searchSupervisors(text, props.documentNumber);
        setSupervisorDataArray(searchVal);
        console.log("Searched supervisor is: ", searchVal);
      } catch (error) {
        console.log("Error in searching supervisor is : ", error);
      }
    } else {
      setSupervisorSearchVal("");
      setSupervisorDataArray([]);
      // props.setProjectData(undefined);
    }
  };
  const submitToSupervisorView = () => {
    if (submitToValue === "Supervisor") {
      return (
        <Autocomplete
          placeholder={"Search Supervisors.."}
          data={autoSearchSupervisorDataArray}
          defaultValue={supervisorSearchValue}
          containerStyle={styles.autocompleteStyle}
          inputContainerStyle={styles.autocompleteInputStyle}
          listStyle={styles.autocompleteListStyle}
          selectTextOnFocus={true}
          hideResults={autoCompleteSupervisorHideResult}
          onChangeText={(text) => onAutoCompleteSupervisorChangeText(text)}
          renderItem={({ item, i }) =>
            renderAutoCompleteSupervisorResult(item, i)
          }
        />
      );
    } else {
      return null;
    }
  };
  const fsoView = () => {
    return (
      <LabelEditText
        heading={"Forward To :"}
        isEditable={false}
        myValue={"FSO"}
        isSmallFont={true}
      />
    );
  };
  return (
    <View style={styles.userInfoView}>
      <ImageBackground style={styles.cardBackground} resizeMode="cover">
        {sectionTitle("Forward To")}
        <View style={styles.cardStyle}>
          {props.documentNumber.includes("MBL") ||
          props.documentNumber.includes("DRV") ||
          props.documentNumber.includes("PET") ||
          props.documentNumber.includes("MED") ||
          (empData && empData.IsApplicableToForwardFSO) === "YES" ||
          props?.subCategoryId == 10 ? (
            fsoView()
          ) : (
            <View>
              <Dropdown
                title={globalConstants.SUBMIT_TO_TEXT}
                forwardedRef={this.submitToRef}
                dropDownData={this.submitToOption(props)}
                dropDownCallBack={(index, value) =>
                  onSubmitToSelection(index, value)
                }
              />
              {submitToSupervisorView()}
            </View>
          )}

          <LabelEditText
            heading="Remarks*"
            placeHolder="Max 500 characters"
            myMaxLength={500}
            // isMultiline={true}
            onTextChanged={onRemarksChanged}
            myValue={remarksInput}
            isSmallFont={true}
          />
          <View style={{ flexDirection: "row", alignSelf: "flex-end" }}>
            <View style={styles.addItemButtonView}>
              <CustomButton
                label={globalConstants.SUBMIT_TEXT}
                positive={true}
                performAction={() => submitAction()}
              />
            </View>
            <View style={styles.addItemButtonView}>
              <CustomButton
                label={globalConstants.DELETE_TEXT}
                positive={false}
                performAction={() => deleteAction()}
              />
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

submitToOption = (props) => {
  console.log("test2", props);
  // let checkBand4 =props.myEmpData[0].IsIndianCompany == "1" && props.myEmpData[0].BAND<=4 && props.myEmpData[0].Category== '1'|| props.myEmpData[0].Category == '2' && props.subCategoryId == "0" || props.subCategoryId == "7" || props.subCategoryId == "14"
  let checkBand4 =
    props.myEmpData[0].IsIndianCompany == "1" &&
    (props.categoryDataId == "1" &&
      (props.subCategoryId == "0" ||
        props.subCategoryId == "7" ||
        props.subCategoryId == "14")) &&
    props.myEmpData[0].BAND <= 4;

  let checkBand5 =
    (props.myEmpData[0].IsIndianCompany == "1" &&
      props.myEmpData[0].BAND == "5" &&
      props.totalAmount > 10000 &&
      props.categoryDataId == "1") ||
    (props.categoryDataId == "2" && props.subCategoryId == "0") ||
    props.subCategoryId == "7" ||
    props.subCategoryId == "14";

  let checkBand6 =
    (props.myEmpData[0].IsIndianCompany == "1" &&
      props.myEmpData[0].BAND == "6" &&
      props.totalAmount > 50000 &&
      props.categoryDataId == "1") ||
    (props.myEmpData[0].Category == "2" && props.subCategoryId == "0") ||
    props.subCategoryId == "7" ||
    props.subCategoryId == "14";

  let checkBand7 =
    (props.myEmpData[0].IsIndianCompany == "1" &&
      props.myEmpData[0].BAND == "7" &&
      props.totalAmount > 75000 &&
      props.categoryDataId == "1") ||
    (props.myEmpData[0].Category == "2" && props.subCategoryId == "0") ||
    props.subCategoryId == "7" ||
    props.subCategoryId == "14";

  let checkBand8 =
    (props.myEmpData[0].IsIndianCompany == "1" &&
      props.myEmpData[0].BAND == "8" &&
      props.totalAmount > 100000 &&
      props.categoryDataId == "1") ||
    (props.myEmpData[0].Category == "2" && props.subCategoryId == "0") ||
    props.subCategoryId == "7" ||
    props.subCategoryId == "14";

  let isSameBand_5 =
    props.myEmpData[0].BAND == "5" && props.totalAmount < 10000
      ? constants.SUBMIT_TO_TYPES
      : constants.SUBMIT_TO_IND_TYPES;

  let checkBand_B = props.myEmpData[0].BAND == "B";
  //  console.log("isSameBand_5",!isSameBand_5)

  let checkStaffWelfare = props.subCategoryId == "13";

  if (props.subCategoryId == "1" && props.categoryDataId == "1") {
    //take a break
    console.log("if working");
    return constants.SUBMIT_TO_FSO;
  } else if (
    (props.categoryDataId == "1" && props.subCategoryId == "8") ||
    props.subCategoryId == "9"
  ) {
    console.log("else if working");
    return constants.SUBMIT_TO_HR;
  } else {
    console.log("else working");
    return checkBand4 ||
      checkBand5 ||
      checkBand6 ||
      checkBand7 ||
      checkBand8 ||
      checkStaffWelfare ||
      checkBand_B
      ? constants.SUBMIT_TO_IND_TYPES
      : constants.SUBMIT_TO_TYPES;
  }
};

const styles = StyleSheet.create({
  userInfoView: {
    margin: moderateScale(6),
  },
  cardBackground: {
    borderWidth: 2,
    flex: 0,
    borderColor: appConfig.FIELD_BORDER_COLOR,
    borderRadius: 5,
    shadowOffset: { width: 10, height: 10 },
    shadowColor: "black",
  },
  cardStyle: {
    flex: 0,
    marginHorizontal: moderateScale(6),
    paddingVertical: moderateScale(4),
  },
  autocompleteStyle: {
    flex: 1,
    marginTop: moderateScale(2),
  },
  autocompleteInputStyle: {
    borderColor: "grey",
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
    marginTop: moderateScale(6),
  },
});

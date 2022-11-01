import React, { Component } from "react";
import {
  Text,
  View,
  BackHandler,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Dimensions,
  ImageBackground,
} from "react-native";
import { connect } from "react-redux";
import { styles } from "./styles";
import { SafeAreaView, ScrollView } from "react-navigation";
import SubHeader from "../../GlobalComponent/SubHeader";
import helper from "../../utilities/helper";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import DatePicker from "./dateTimePicker/DateTimePicker";
import { LabelTextDashValue } from "../../GlobalComponent/LabelText/LabelText";
import {
  leaveApplyActionCreator,
  resetForm,
  submitLeave,
  fetchTotalAppliedLeaves,
  resetSubmitData,
  resetErrorData,
} from "./leaveApplyActionCreator";
import ActivityIndicatorView from "../../GlobalComponent/myActivityIndicator";
import { writeLog } from "../../utilities/logger";
import {
  HeaderView,
  Form,
  Dropdown,
  DateDifferenceView,
  filePicker,
  Attachment,
  WorkRow,
  Iniitian,
  LineView,
  ActionButtons,
  EmployeeSearchView,
  RadioForms,
  OtherReason,
  ShowResultDialog,
} from "./Helper";
import {
  START_DATE_NOT_SELECTED,
  END_DATE_NOT_SELECTED,
  END_DATE_PASSED,
  SUPERVISOR_REMARKS_MANDATORY,
  SELECT_LEAVE_TYPE,
  SELECT_LEAVE_REASON,
  SELECT_WORK_HANDLE,
  SELECT_WORK_HANDLE_REMARKS,
  OTHER_REASON_REMARKS,
  SELECT_FAMILY_MEMBER,
  CONTACT_MANDATORY,
  NO_DOT,
  SELECT_OTHER_RELATION,
  ADD_1_Required,
  ADD_2_Required,
  SELECT_WEDDING_DATE,
  SELECT_COMP_START_DATE,
  SELECT_COMP_END_DATE,
  SELECT_COMP_TOIL_START_DATE,
  SELECT_COMP_TOIL_END_DATE,
  WAIT_FOR_NUM_DAYS,
} from "./constants";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import UserMessage from "../../components/userMessage";

import images from "../../images";
let globalConstants = require("../../GlobalConstants");

let startDate, endDate;
let leaveCodes = [];
let reasonCodes = [];
class CreateLeave extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: "Start Date",
      endDate: "End Date",
      modalVisible: false,
      resultModalVisible: false,
      query: "",
      empData: [],
      localEmpData: [],
      fileData: "",
      fileName: "",
      selectedEmpCode: "",
      selectedEmpName: "",
      isHalfDay: false,
      halfDayVal: 1,
      otherRemarks: false,
      leaveCode: "",
      leaveType: "",
      dateAlert: false,
      handlerRemarks: "",
      supervisorRemarks: "",
      leaveReasonVal: "",
      leaveReasonCode: "",
      otherReasonRemarks: "",
      middleView: true,
      bereavementFamilyMember: "",
      contactNo: "",
      showPopUp: false,
      noLeavePopUp: false,
      popUpMessage: "",
      popUpHeading: "",
      familyOtherRelation: "",
      address1: "",
      address2: "",
      weddingDate: "Wedding Date *",
      compOffStartDate: "Start Date",
      compOffEndDate: " End Date ",
      loading: false,
      leaveData: {},
      storedLeaves: "",
      errorMessage: "",
    };
    this.startCalendar = React.createRef();
    this.endCalendar = React.createRef();
    this.weddingCalendar = React.createRef();
    this.compOffStartCalendar = React.createRef();
    this.compOffEndCalendar = React.createRef();
  }
  static getDerivedStateFromProps(nextProps, state) {
    if (
      nextProps.empData &&
      nextProps.empData.length > 0 &&
      !state.query.length > 0
    ) {
      return {
        empData: nextProps.empData,
        localEmpData: nextProps.empData,
      };
    } else {
      return null;
    }
  }

  handleBack = () => {
    this.props.navigation.pop();
  };
  handleBackButtonClick = () => {
    this.handleBack();
    return true;
  };
  fetchTotalLeavesFromServer = () => {
    let endMoment = moment(this.state.endDate, "DD-MMM-YYYY");
    let startMoment = moment(this.state.startDate, "DD-MMM-YYYY");
    let diff = endMoment.diff(startMoment, "days");
    if (this.state.leaveCode == "") {
      return alert(SELECT_LEAVE_TYPE);
    } else if (this.state.startDate == "") {
      return alert(START_DATE_NOT_SELECTED);
    } else if (this.state.endDate == "") {
      return alert(END_DATE_NOT_SELECTED);
    } else if (diff < 0) {
      return alert(END_DATE_PASSED);
    } else {
      this.props.fetchTotalLeaveDays(
        this.props.loginData,
        this.state.startDate,
        this.state.endDate,
        this.state.leaveType,
        this.state.leaveCode,
        this.totalLeavesCallBack,
        this.errorCallBack
      );
    }
  };
  errorCallBack = (error) => {
    console.log("Error in error call back : ", error);
    this.setState({ errorMessage: error }, () => {
      this.setState({ loader: false, loading: false }, () => {
        setTimeout(() => {
          this.setState({
            showPopUp: true,
            popUpMessage: this.state.errorMessage,
            popUpHeading: "Error",
          });
        });
      });
    });
  };
  totalLeavesCallBack = (response) => {
    console.log("Stored leave response : ", response);
    this.setState({ storedLeaves: response });
  };
  startDateChanged = (dateData) => {
    this.setState(
      {
        startDate: dateData,
        endDate: this.state.isHalfDay ? dateData : "End Date",
      },
      () => {
        if (this.state.endDate !== "End Date" && this.state.leaveCode !== "") {
          let endMoment = moment(this.state.endDate, "DD-MMM-YYYY");
          let startMoment = moment(this.state.startDate, "DD-MMM-YYYY");
          let diff = endMoment.diff(startMoment, "days");
          if (diff < 0) {
          } else {
            this.fetchTotalLeavesFromServer();
          }
        }
      }
    );
  };
  weddingDateChanged = (dateData) => {
    this.setState({ weddingDate: dateData });
  };
  compOffStartDateChanged = (dateData) => {
    let companyCode =
      this.state.leaveData &&
      this.state.leaveData.Details &&
      this.state.leaveData.Details[0] &&
      this.state.leaveData.Details[0].CompanyCode.Value;
    this.setState({ compOffStartDate: dateData });
    if (
      this.state.leaveCode == "0440" &&
      (companyCode == "N081" ||
        companyCode == "N001" ||
        companyCode == "N028" ||
        companyCode == "N070" ||
        companyCode == "NDEV" ||
        companyCode == "NSU1" ||
        companyCode == "NSU3" ||
        companyCode == "NSU4")
    ) {
      this.setState({ compOffEndDate: dateData });
    }
  };
  compOffEndDateChanged = (dateData) => {
    this.setState({ compOffEndDate: dateData });
  };
  endDateChanged = (endDateData) => {
    this.setState({ endDate: endDateData }, () => {
      if (this.state.leaveCode !== "") {
        let endMoment = moment(this.state.endDate, "DD-MMM-YYYY");
        let startMoment = moment(this.state.startDate, "DD-MMM-YYYY");
        let diff = endMoment.diff(startMoment, "days");
        if (diff < 0) {
        } else {
          this.fetchTotalLeavesFromServer();
        }
      }
    });
  };
  renderDateRow = () => {
    if (this.state.leaveCode !== "") {
      return (
        <View style={styles.compContainer}>
          <View style={styles.dateRow}>
            <Text style={styles.heading}>Leave Start Date *</Text>
            <View style={{ flex: 1, alignItems: "flex-end" }}>
              <DatePicker
                callBack={this.startDateChanged}
                title={this.state.startDate}
                ref={this.startCalendar}
              />
            </View>
          </View>
          {this.state.startDate !== "Start Date" ? (
            <View style={styles.dateRow}>
              <Text style={styles.heading}>Leave End Date *</Text>
              <View style={{ flex: 1, alignItems: "flex-end" }}>
                <DatePicker
                  callBack={this.endDateChanged}
                  title={this.state.endDate}
                  ref={this.endCalendar}
                />
              </View>
            </View>
          ) : null}
        </View>
      );
    } else {
      return null;
    }
  };

  getLeavesCallBack = (response) => {
    console.log("Inside leaves call back : ", response);
    if (response?.Balances?.length == 0) {
      this.setState({
        loading: false,
        showPopUp: true,
        popUpMessage:
          "Sorry! You don't have leave balances to apply for leave.",
        popUpHeading: "No Leave",
      });
    } else if (response?.Balances?.length > 0) {
      this.setState({
        loading: false,
        leaveData: response,
      });
    }
  };

  async componentDidMount() {
    console.log("Compnent is Mounted");
    writeLog("Landed on " + "CreateLeave");
    leaveCodes = [];
    reasonCodes = [];
    let reset = await this.resetCreateLeave();
    console.log("Reset", reset);
    BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
    this.setState(
      { showPopUp: false, popUpMessage: "", popUpHeading: "", loading: true },
      () => {
        this.props.fetchLeaveData(
          this.props.loginData,
          this.getLeavesCallBack,
          this.errorCallBack
        );
      }
    );
  }

  resetCreateLeave = async () => {
    let p = new Promise((resolve, reject) => {
      BackHandler.removeEventListener(
        "hardwareBackPress",
        this.handleBackButtonClick
      );
      this.props.resetData();
      this.setState(
        {
          startDate: "Start Date",
          endDate: "End Date",
          modalVisible: false,
          resultModalVisible: false,
          query: "",
          empData: [],
          localEmpData: [],
          fileData: "",
          fileName: "",
          selectedEmpCode: "",
          selectedEmpName: "",
          isHalfDay: false,
          halfDayVal: 1,
          otherRemarks: false,
          leaveCode: "",
          leaveType: "",
          dateAlert: false,
          handlerRemarks: "",
          supervisorRemarks: "",
          leaveReasonVal: "",
          leaveReasonCode: "",
          otherReasonRemarks: "",
          middleView: true,
          bereavementFamilyMember: "",
          contactNo: "",
          showPopUp: false,
          familyOtherRelation: "",
          address1: "",
          address2: "",
          weddingDate: "Wedding Date *",
          compOffStartDate: "Start Date",
          compOffEndDate: " End Date ",
        },
        () => {
          console.log("Create leave data reset");
          resolve("RESET");
        }
      );
    });
    return p;
  };

  leaveTypeSelection = (index, value) => {
    if (this.props.loginData && this.props.loginData.SmCode) {
      writeLog(
        "Selected leave is " + value + " for " + this.props.loginData.SmCode
      );
    }
    // console.log("Leave type selected is :",index,value,leaveCodes[index],this.state.startDate,this.state.endDate)
    if (value.includes("1/2")) {
      this.setState({
        isHalfDay: true,
        leaveCode: leaveCodes[index],
        leaveType: value,
        startDate: "Start Date",
        endDate: "End Date",
      });
    } else {
      this.setState({
        isHalfDay: false,
        halfDayVal: 1,
        leaveCode: leaveCodes[index],
        leaveType: value,
        startDate: "Start Date",
        endDate: "End Date",
      });
    }
  };
  reasonSelection = (index, value) => {
    // console.log("Reason selected is :", index, value, reasonCodes[index])
    if (this.props.loginData && this.props.loginData.SmCode) {
      writeLog(
        "Selected reason is " + value + " for " + this.props.loginData.SmCode
      );
    }
    if (index == 8) {
      this.setState({
        otherRemarks: true,
        leaveReasonVal: value,
        leaveReasonCode: reasonCodes[index],
      });
    } else {
      this.setState({
        otherRemarks: false,
        leaveReasonVal: value,
        leaveReasonCode: reasonCodes[index],
      });
    }
  };
  onEmployeeSearch = () => {
    writeLog("Clicked on " + "onEmployeeSearch" + " of " + "CreateLeave");
    this.setState({ modalVisible: true });
  };
  modalClose = () => {
    writeLog("Clicked on " + "modalClose" + " of " + "CreateLeave");
    this.setState({ modalVisible: false });
  };
  updateSearch = (searchText) => {
    this.setState(
      {
        query: searchText,
      },
      () => {
        console.log("Search Query : ", this.state.query);
        const filteredData = this.state.localEmpData.filter((element) => {
          let str1 = element.EmpCode.trim();
          let str2 = element.EmpName.trim();
          let searchedText = str1.concat(str2);
          let elementSearched = searchedText.toString().toLowerCase();
          let queryLowerCase = this.state.query.toString().toLowerCase();
          return elementSearched.indexOf(queryLowerCase) > -1;
        });
        this.setState(
          {
            empData: filteredData,
          },
          () => {
            console.log("Update search called", filteredData);
          }
        );
      }
    );
  };
  pickEmployee = (empData) => {
    writeLog(
      "Clicked on " +
        "pickEmployee" +
        " of " +
        "CreateLeave" +
        ".  Employee picked is " +
        empData.EmpCode
    );
    // console.log("picked employee", empData.EmpCode, empData.EmpName)
    this.setState({
      selectedEmpCode: empData.EmpCode,
      selectedEmpName: empData.EmpName,
    });
    this.modalClose();
  };
  onHalfDaySelection = (value) => {
    let val = value == 0 ? 1 : 2;
    this.setState({ halfDayVal: val });
    // console.log("Half day selected is: ", value)
  };
  setLeaveCodes = (leaveCode) => {
    leaveCodes.push(leaveCode);
  };
  setReasonCodes = (reasonCode) => {
    reasonCodes.push(reasonCode);
  };
  onFamilySelection = (index, member) => {
    // console.log("Selected family member is :", member)
    this.setState({ bereavementFamilyMember: member }, () => {
      console.log(
        "Selected family member is : ",
        this.state.bereavementFamilyMember
      );
    });
  };
  handlerRemarks = (handlerRemarks) => {
    this.setState({ handlerRemarks: handlerRemarks });
  };
  contactNoCallBack = (contactNo) => {
    this.setState({ contactNo: contactNo });
  };
  otherReasonRemarks = (otherReasonRemarks) => {
    this.setState({ otherReasonRemarks: otherReasonRemarks });
  };
  supervisorRemarks = (supervisorRemarks) => {
    this.setState({ supervisorRemarks: supervisorRemarks });
  };
  fileCallBack = (fileData, file_Name) => {
    // console.log("File data in attachment : ", fileData);
    writeLog(
      "Clicked on " +
        "fileCallBack" +
        " of " +
        "CreateLeave" +
        " & choosen file is " +
        file_Name
    );
    this.setState({ fileData: fileData, fileName: file_Name }, () => {});
  };
  submitCallBack = () => {
    let endMoment = moment(endDate, "DD-MMM-YYYY");
    let startMoment = moment(startDate, "DD-MMM-YYYY");
    let address1 =
      this.state.leaveData.Details[0].Address1.Value.trim() !== "" &&
      this.state.leaveData.Details[0].Address1.Value !== undefined
        ? this.state.leaveData.Details[0].Address1.Value
        : this.state.address1;
    let address2 =
      this.state.leaveData.Details[0].Address2.Value.trim() !== "" &&
      this.state.leaveData.Details[0].Address2.Value !== undefined
        ? this.state.leaveData.Details[0].Address2.Value
        : this.state.address2;

    let companyCode = this.state?.leaveData?.Details[0]?.CompanyCode.Value;
    console.log("Address one :", address1);
    console.log("Address two :", address2);
    console.log("Leave code : ", this.state.leaveCode);
    console.log("Company code : ", companyCode);
    console.log(
      "Bereavement Family Member : ",
      this.state.bereavementFamilyMember
    );
    if (
      this.startCalendar.current !== null &&
      this.endCalendar.current !== null
    ) {
      startDate = this.startCalendar.current.state.selectedDate;
      endDate = this.endCalendar.current.state.selectedDate;
    }
    let diff = endMoment.diff(startMoment, "days");
    if (this.state.contactNo.includes(".")) {
      return alert(NO_DOT);
    } else if (address1.trim() == "") {
      return alert(ADD_1_Required);
    } else if (address2.trim() == "") {
      return alert(ADD_2_Required);
    } else if (
      this.state.leaveData.Details[0].ContactNo.Value == "" &&
      this.state.contactNo == ""
    ) {
      return alert(CONTACT_MANDATORY);
    } else if (this.state.leaveType == "") {
      return alert(SELECT_LEAVE_TYPE);
    } else if (this.state.startDate == "Start Date") {
      return alert(START_DATE_NOT_SELECTED);
    } else if (this.state.endDate == "End Date") {
      return alert(END_DATE_NOT_SELECTED);
    } else if (diff < 0) {
      return alert(END_DATE_PASSED);
    } else if (this.state.storedLeaves == "") {
      return alert(WAIT_FOR_NUM_DAYS);
    } else if (
      this.state.leaveCode == "0430" &&
      companyCode == "N060" &&
      this.state.weddingDate == "Wedding Date *"
    ) {
      return alert(SELECT_WEDDING_DATE);
    } else if (
      this.state.leaveCode == "0440" &&
      companyCode == "N060" &&
      this.state.compOffStartDate == "Start Date"
    ) {
      return alert(SELECT_COMP_START_DATE);
    } else if (
      this.state.leaveCode == "0440" &&
      (companyCode == "N081" ||
        companyCode == "N001" ||
        companyCode == "N028" ||
        companyCode == "N070" ||
        companyCode == "NDEV" ||
        companyCode == "NSU1" ||
        companyCode == "NSU3" ||
        companyCode == "NSU4") &&
      this.state.compOffStartDate == "Start Date"
    ) {
      return alert(SELECT_COMP_START_DATE);
    } else if (
      this.state.leaveCode == "0440" &&
      companyCode == "N060" &&
      this.state.compOffEndDate == " End Date "
    ) {
      return alert(SELECT_COMP_END_DATE);
    } else if (
      (this.state.leaveCode == "0400" || this.state.leaveCode == "0410") &&
      companyCode == "N062" &&
      this.state.compOffStartDate == "Start Date"
    ) {
      return alert(SELECT_COMP_TOIL_START_DATE);
    } else if (
      (this.state.leaveCode == "0400" || this.state.leaveCode == "0410") &&
      companyCode == "N062" &&
      this.state.compOffEndDate == " End Date "
    ) {
      return alert(SELECT_COMP_TOIL_END_DATE);
    } else if (
      ((this.state.leaveCode == "0350" && companyCode == "N055") ||
        (this.state.leaveCode == "0550" && companyCode == "N076") ||
        this.state.leaveCode == "0530") &&
      this.state.bereavementFamilyMember == ""
    ) {
      return alert(SELECT_FAMILY_MEMBER);
    } else if (
      this.state.bereavementFamilyMember.includes("Other") &&
      this.state.familyOtherRelation == ""
    ) {
      return alert(SELECT_OTHER_RELATION);
    } else if (this.state.leaveReasonVal == "") {
      return alert(SELECT_LEAVE_REASON);
    } else if (
      this.state.leaveReasonCode == "9" &&
      this.state.otherReasonRemarks == ""
    ) {
      return alert(OTHER_REASON_REMARKS);
    } else if (
      this.state.startDate !== "Start Date" &&
      this.state.selectedEmpCode == ""
    ) {
      if (
        startMoment.diff(moment(new Date(), "DD-MMM-YYYY"), "days") >= 0 &&
        companyCode !== "N081"
      ) {
        return alert(SELECT_WORK_HANDLE);
      }
    }

    let dataToSubmit = {};
    dataToSubmit.ch_empcode = this.state.leaveData.Details[0].EmpCode.Value;
    dataToSubmit.dt_startDate = this.state.startDate;
    dataToSubmit.dt_endDate = this.state.endDate;
    dataToSubmit.dc_NoDays = this.state.storedLeaves;
    dataToSubmit.in_torole = 1;
    dataToSubmit.vc_docno = "";
    dataToSubmit.vc_remarks = this.state.supervisorRemarks;
    dataToSubmit.Action = 1;
    dataToSubmit.ch_modified = this.state.leaveData.Details[0].EmpCode.Value;
    dataToSubmit.ch_pendingwith = this.state.leaveData.Details[0].SupervisorCode.Value;
    dataToSubmit.vc_workhandler = this.state.selectedEmpCode;
    dataToSubmit.leaveType = this.state.leaveType;
    dataToSubmit.ch_leaveType = this.state.leaveCode;
    dataToSubmit.in_LeaveSubType = this.state.isHalfDay
      ? this.state.halfDayVal
      : 0; // Need to ask. for half day it could be 1 for first half or 2. for second half other wise 0
    dataToSubmit.in_reason = this.state.leaveReasonCode;
    dataToSubmit.vc_reason = this.state.otherReasonRemarks;
    dataToSubmit.vc_add1 = address1;
    dataToSubmit.vc_add2 = address2;
    dataToSubmit.vc_tel =
      this.state.contactNo == ""
        ? this.state.leaveData.Details[0].ContactNo.Value
        : this.state.contactNo;
    dataToSubmit.vc_FamilyMemberRelation = this.state.bereavementFamilyMember; // blank otherwise relation when berevment leave
    dataToSubmit.vc_FamilyOtherRelation = this.state.familyOtherRelation;
    dataToSubmit.SupervisorCode = this.state.leaveData.Details[0].SupervisorCode.Value;
    dataToSubmit.flagDownload = this.state.fileName == "" ? false : true; // Need to work later.
    dataToSubmit.ch_created = this.state.leaveData.Details[0].EmpCode.Value;
    dataToSubmit.ContentType = ""; // would be according to attachment will be cleared later
    dataToSubmit.vc_remarksworkhandler = this.state.handlerRemarks;
    dataToSubmit.VC_DOCUMENTNAME = this.state.fileName; // need to update later
    dataToSubmit.VB_DOCUMENT = this.state.fileData; // need to update later?
    dataToSubmit.dt_CompOffDate =
      this.state.leaveCode == "0440" ||
      this.state.leaveCode == "0400" ||
      this.state.leaveCode == "0410"
        ? this.state.compOffStartDate
        : "";
    dataToSubmit.dt_CompOffToDate =
      this.state.leaveCode == "0440" ||
      this.state.leaveCode == "0400" ||
      this.state.leaveCode == "0410"
        ? this.state.compOffEndDate
        : "";
    dataToSubmit.dt_WeddingDate =
      this.state.leaveCode == "0430" ? this.state.weddingDate : "";
    writeLog("Clicked on " + "submitCallBack" + " of " + "CreateLeave");
    this.setState(
      { showPopUp: false, popUpHeading: "", popUpMessage: "", loading: true },
      () => {
        this.props.submitLeave(
          this.props.loginData,
          dataToSubmit,
          this.onSubmitLeave,
          this.errorCallBack
        );
      }
    );
  };
  onSubmitLeave = (response) => {
    if (response[0].msgTxt !== undefined) {
      this.setState({ loading: false }, () => {
        this.setState(
          {
            showPopUp: true,
            popUpMessage: "Leave has been applied successfully",
            popUpHeading: "Success",
          },
          () => {
            console.log("Submitted Action finally : ", response[0].msgTxt);
          }
        );
      });
    }
  };
  onMobileNumberFocus = () => {
    this.setState({ middleView: false });
  };
  onMobileNumberBlur = () => {
    this.setState({ middleView: true });
  };
  showPopUp = () => {
    writeLog(
      "Dialog is open for " + this.state.popUpMessage + " on " + "CreateLeave"
    );
    console.log("showPopUp", this.state.showPopUp);
    console.log("popUpMessage", this.state.popUpMessage);
    console.log("popUpHeading", this.state.popUpHeading);
    return (
      <UserMessage
        modalVisible={this.state.showPopUp}
        heading={this.state.popUpHeading}
        message={this.state.popUpMessage}
        okAction={() => {
          this.onOkClick();
        }}
      />
    );
  };

  showNoLeaves = () => {
    console.log("showPopUp", this.state.showPopUp);
    console.log("popUpMessage", this.state.popUpMessage);
    console.log("popUpHeading", this.state.popUpHeading);
    writeLog(
      "Dialog is open for " +
        "You are not eligible for applying leave right now." +
        " on " +
        "CreateLeave"
    );
    return (
      <UserMessage
        modalVisible={this.state.showPopUp}
        heading="No Leaves"
        message="You are not eligible for applying leave right now."
        okAction={() => {
          this.onOkClick();
        }}
      />
    );
  };
  onOkClick = () => {
    writeLog("Clicked on " + "onOkClick" + " of " + "CreateLeave");
    this.setState({ showPopUp: false }, () => {
      setTimeout(async () => {
        this.props.navigation.pop();
      }, 1000);
      this.props.resetLeaveError();
    });
  };
  address1InputHandler = (text) => {
    this.setState({ address1: text });
  };
  address2InputHandler = (text) => {
    this.setState({ address2: text });
  };
  renderMainView = () => {
    console.log(
      "Bereavement Family Member : ",
      this.state.bereavementFamilyMember
    );
    let companyCode =
      this.state.leaveData?.Details &&
      this.state.leaveData?.Details[0]?.CompanyCode?.Value;
    if (this.startCalendar.current && this.endCalendar.current) {
      startDate = this.startCalendar.current.state.selectedDate;
      endDate = this.endCalendar.current.state.selectedDate;
    }
    return (
      <View>
        <SubHeader
          pageTitle={globalConstants.CREATE_LEAVE_TITLE}
          backVisible={true}
          logoutVisible={true}
          handleBackPress={() => this.handleBack()}
          navigation={this.props.navigation}
        />
        {this.state.leaveData?.Balances?.length > 0 ? (
          <View>
            <HeaderView props={this.state.leaveData} />
            <Form
              address1InputHandler={this.address1InputHandler}
              address2InputHandler={this.address2InputHandler}
              onTextFocus={() => {
                this.onMobileNumberFocus();
              }}
              onTextBlur={() => {
                this.onMobileNumberBlur();
              }}
              props={this.state.leaveData}
              contactNoCallBack={(contactNo) => {
                this.contactNoCallBack(contactNo);
              }}
            />
            <Dropdown
              title="Select leave type : "
              leftFlex={0.35}
              props={this.state.leaveData?.LeaveType}
              dropDownCallBack={(index, value) =>
                this.leaveTypeSelection(index, value)
              }
              setLeaveCodes={(values) => {
                this.setLeaveCodes(values);
              }}
            />
            {(this.state.leaveCode == "0350" &&
              companyCode !== "N055" &&
              companyCode !== "N050" &&
              companyCode !== "N009") ||
            (this.state.leaveCode == "0550" && companyCode == "N076") ||
            this.state.leaveCode == "0530" ? (
              <Dropdown
                leftFlex={0.35}
                title="Select family member : "
                props={this.state.leaveData?.BereavementLeave}
                dropDownCallBack={(index, value) =>
                  this.onFamilySelection(index, value)
                }
              />
            ) : null}

            {this.state.bereavementFamilyMember.includes("Other") ? (
              <View style={styles.halfHolder}>
                <Text style={styles.heading}>Other Relation</Text>
                <View style={styles.description}>
                  <TextInput
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoCompleteType={false}
                    onChangeText={(text) =>
                      this.setState({ familyOtherRelation: text })
                    }
                    placeholder={"Other Relation ?"}
                    editable={true}
                    multiline={false}
                    style={styles.textInputStyle}
                  />
                </View>
              </View>
            ) : null}

            {this.state.isHalfDay == true ? (
              <RadioForms
                onHalfDaySelection={(value) => {
                  this.onHalfDaySelection(value);
                }}
              />
            ) : null}
            {this.state.leaveCode == "0430" && companyCode == "N060" ? (
              <View style={styles.compContainer}>
                <View style={styles.dateRow}>
                  <Text style={styles.heading}>Wedding Date *</Text>
                  <DatePicker
                    callBack={this.weddingDateChanged}
                    title={this.state.weddingDate}
                    ref={this.weddingCalendar}
                  />
                </View>
              </View>
            ) : null}
            {this.state.leaveCode == "0440" && companyCode == "N060" ? (
              <View style={styles.compContainer}>
                <View style={styles.dateRow}>
                  <Text style={styles.heading}>Comp Off Start Date *</Text>
                  <DatePicker
                    callBack={this.compOffStartDateChanged}
                    title={this.state.compOffStartDate}
                    ref={this.compOffStartCalendar}
                  />
                </View>
                <View style={styles.dateRow}>
                  <Text style={styles.heading}>Comp Off End Date *</Text>
                  <DatePicker
                    callBack={this.compOffEndDateChanged}
                    title={this.state.compOffEndDate}
                    ref={this.compOffEndCalendar}
                  />
                </View>
              </View>
            ) : null}
            {this.state.leaveCode == "0440" &&
            (companyCode == "N081" ||
              companyCode == "N001" ||
              companyCode == "N028" ||
              companyCode == "N070" ||
              companyCode == "NDEV" ||
              companyCode == "NSU1" ||
              companyCode == "NSU3" ||
              companyCode == "NSU4") ? (
              <View style={styles.compContainer}>
                <View style={styles.dateRow}>
                  <Text style={styles.heading}>Comp Off Date *</Text>
                  <DatePicker
                    callBack={this.compOffStartDateChanged}
                    title={this.state.compOffStartDate}
                    ref={this.compOffStartCalendar}
                  />
                </View>
              </View>
            ) : null}
            {(this.state.leaveCode == "0410" ||
              this.state.leaveCode == "0400") &&
            companyCode == "N062" ? (
              <View style={styles.compContainer}>
                <View style={styles.dateRow}>
                  <Text style={styles.heading}>Comp Off From Date *</Text>
                  <DatePicker
                    callBack={this.compOffStartDateChanged}
                    title={this.state.compOffStartDate}
                    ref={this.compOffStartCalendar}
                  />
                </View>
                <View style={styles.dateRow}>
                  <Text style={styles.heading}>Comp Off To Date *</Text>
                  <DatePicker
                    callBack={this.compOffEndDateChanged}
                    title={this.state.compOffEndDate}
                    ref={this.compOffEndCalendar}
                  />
                </View>
              </View>
            ) : null}
            {this.renderDateRow()}
            {this.state.startDate !== "Start Date" &&
            this.state.endDate !== "End Date" ? (
              <DateDifferenceView
                data={this.state.leaveData?.Details}
                leaveCode={this.state.leaveCode}
                startDate={this.state.startDate}
                endDate={this.state.endDate}
                totalLeaveApplied={this.state.storedLeaves}
              />
            ) : null}
            <Dropdown
              title="Reason : "
              leftFlex={0.35}
              props={this.state.leaveData?.Reason}
              dropDownCallBack={(index, value) =>
                this.reasonSelection(index, value)
              }
              setReasonCodes={(values) => {
                this.setReasonCodes(values);
              }}
            />
            {this.state.otherRemarks == true ? (
              <OtherReason
                onReason={(val) => {
                  this.onReason(val);
                }}
                otherReasonRemarks={(otherReasonRemarks) => {
                  this.otherReasonRemarks(otherReasonRemarks);
                }}
              />
            ) : null}
            <Attachment
              title={this.state.fileName}
              fileCallBack={(data, fileName) => {
                this.fileCallBack(data, fileName);
              }}
            />
            <WorkRow title="Work to be handled by" />
            <Iniitian
              data={this.state.leaveData?.Details}
              isSupervisor={false}
              searchCallBack={() => {
                this.onEmployeeSearch();
              }}
              selectedEmpCode={this.state.selectedEmpCode}
              selectedEmpName={this.state.selectedEmpName}
              handlerRemarks={(textRemarks) => {
                this.handlerRemarks(textRemarks);
              }}
            />
            <WorkRow
              data={this.state.leaveData?.Details}
              title="Forward to supervisor"
            />
            <Iniitian
              data={this.state.leaveData?.Details}
              isSupervisor={true}
              searchCallBack={() => {
                this.onEmployeeSearch();
              }}
              supervisorRemarks={(supervisorRemarks) => {
                this.supervisorRemarks(supervisorRemarks);
              }}
            />
            <ActionButtons
              submitCallBack={() => {
                this.submitCallBack();
              }}
            />
            <EmployeeSearchView
              query={this.state.query}
              visibility={this.state.modalVisible}
              closeCallBack={() => {
                this.modalClose();
              }}
              search={() => this.updateSearch}
              empData={this.state.empData}
              pickEmployee={(empData) => {
                this.pickEmployee(empData);
              }}
            />
          </View>
        ) : null}
        {this.state.showPopUp == true && this.state.popUpMessage !== ""
          ? this.showPopUp()
          : null}
      </View>
    );
  };
  //
  render() {
    let behave = this.state.middleView == false ? "padding" : "position";
    return (
      <ImageBackground source={images.loginBackground} style={styles.container}>
        <ActivityIndicatorView loader={this.state.loading} />
        <KeyboardAwareScrollView keyboardShouldPersistTaps="never">
          {this.renderMainView()}
        </KeyboardAwareScrollView>
      </ImageBackground>
    );
  }
}
mapDispatchToProps = (dispatch) => {
  return {
    fetchLeaveData: (loginData, callBack, errorCallBack) =>
      dispatch(leaveApplyActionCreator(loginData, callBack, errorCallBack)),
    resetSubmitData: () => dispatch(resetSubmitData()),
    resetLeaveError: () => dispatch(resetErrorData()),
    resetData: () => dispatch(resetForm()),
    submitLeave: (loginData, leaveObject, callBack, errorCallBack) =>
      dispatch(submitLeave(loginData, leaveObject, callBack, errorCallBack)),
    fetchTotalLeaveDays: (
      loginData,
      startDate,
      endDate,
      leaveType,
      leaveCode,
      callBack,
      errorCallBack
    ) =>
      dispatch(
        fetchTotalAppliedLeaves(
          loginData,
          startDate,
          endDate,
          leaveType,
          leaveCode,
          callBack,
          errorCallBack
        )
      ),
  };
};
mapStateToProps = (state) => {
  return {
    loginData: state && state.loginReducer && state.loginReducer.loginData,
    applyData: state.leaveApplyReducer.applyLeaveData,
    applyLeaveLoading: state.leaveApplyReducer.applyLeaveLoading,
    empData: state.leaveApplyReducer.empData,
    submittedAction: state.leaveApplyReducer.submittedAction,
    applyLeaveError: state.leaveApplyReducer.applyLeaveError,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateLeave);

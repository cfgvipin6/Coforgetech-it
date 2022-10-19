import React, { Component } from "react";
import {
  View,
  Text,
  BackHandler,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
  ImageBackground,
  Alert,
} from "react-native";
import { connect } from "react-redux";
import SubHeader from "../../../GlobalComponent/SubHeader";
import { styles } from "./styles";
import RadioForm from "react-native-simple-radio-button";
import { globalFontStyle } from "../../../components/globalFontStyle";
import { LabelEditText } from "../../../GlobalComponent/LabelEditText/LabelEditText";
import {
  RadioForms,
  RadioFormHorizontal,
} from "../../../GlobalComponent/LabelRadioForm/LabelRadioForm";
import { Dropdown } from "../../../GlobalComponent/DropDown/DropDown";
import { DatePicker } from "../../../GlobalComponent/DatePicker/DatePicker";
import { LabelTextDashValue } from "../../../GlobalComponent/LabelText/LabelText";
import CustomButton from "../../../components/customButton";
import ActivityIndicatorView from "../../../GlobalComponent/myActivityIndicator";
import {
  isdFetchDefaultData,
  isdFetchServiceTypeData,
  isdSaveOrSubmit,
  isdResetCreateScreen,
  previousRecordsToUpdate,
  isdAutoCompleteEmployee,
  submitAdditionalRemarksAction,
  isdUpdateRequestorDetails,
  submitRemarksOpen,
} from "./createRequestAction";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import UserMessage from "../../../components/userMessage";
import helper from "../../../utilities/helper";
import { writeLog } from "../../../utilities/logger";
import { DialogButtons } from "../../../GlobalComponent/DialogButtons/DialogButtons";
import { FlatList } from "react-native-gesture-handler";
import { HistoryView } from "../../../GlobalComponent/HistoryView/HistoryView";
import { Icon } from "react-native-elements";
import { showToast } from "../../../GlobalComponent/Toast";
import moment from "moment";
import { EmployeeSearchView } from "../../createLeave/Helper";
import { AttachmentView, uploadIsdFiles } from "../Attachment/AttachmentView";
import { Modal } from "react-native";
import { optionIndexToValue } from "../../EES/utils";
import { getISD_SurveyQuestions, submitIsdSuveryQuestions } from "./utils";
let globalConstants = require("../../../GlobalConstants");
let appConfig = require("../../../../appconfig");
let constants = require("./constants");
const { height } = Dimensions.get("window");
import _ from "lodash";
import images from "../../../images";
export class CreateRequestScreen extends Component {
  constructor(props) {
    super(props);
    selectedOptionArr = [];
    jsonRecord = [];
    this.state = {
      serviceTypeIndex: -1, // incident=1, service request=2
      requestorTypeIndex: 0,
      managerOnLeaveIndex: 0,
      durationIndex: -1,
      descriptionInput: "",
      selectedLocation: "",
      isSubCategoryNotAvailable: false,
      isLocationOthers: false,
      locationOthersInput: "",
      seatNumberInput: "",
      ipAddressInput: "",
      assetCodeInput: "",
      thirdWitnessInput: "",
      isdDefaultDataArray: [],
      isdServiceTypeDataArray: [],
      isdCategoryArray: [],
      isdSubCategoryArray: [],
      isdNewSubCategoryArray: [],
      isdLocationArray: [],
      isdPriorityArray: [],
      isdDurationArray: [],
      durationApplicableFlag: 0,
      assetCodeFlag: 0,
      seatNumberFlag: 0,
      ipAddressFlag: 0,
      witNessFlag: undefined,
      thirdWitnessFlag: undefined,
      incidentDateFlag: undefined,
      isCategorySelected: false,
      isSubCategorySelected: false,
      isPrioritySelected: false,
      isLocationSelected: false,
      requestCategoryIdValue: "",
      requestSubCategoryIdValue: "",
      requestPriorityIdValue: "",
      requesterLocationIdValue: "",
      requestDurationIdValue: "",
      isMgrOnLeaveValue: "N",
      isSaveFlag: "",
      showStartCalendar: false,
      showEndCalendar: false,
      showIncidentCalendar: false,
      query: "",
      empSearchData: [],
      isRequestUpdate: false,
      dialogContainerVisible: false,
      historyItem: [],
      additionalRemarks: "",
      isPopUp: false,
      popUpMessage: "",
      popUpHeading: "",
      newMobileNumber: "",
      isMobileNumberUpdated: false,
      noOfDurationDays: 0,
      durationFromDateValue: "",
      durationEndDateValue: "",
      currentDate: new Date(),
      durationEndDateMaxValue: "",
      durationEndDateMinValue: "",
      requestorUpdated: false,
      witnessUpdated: false,
      witnessQuery: "",
      searchFinished: true,
      witnessSearchFinished: true,
      incidentDate: "",
      requestClosed: false,
      isRecordSaved: false,
      requestID: "",
      browseLoading: false,
      onBehalfVisible: false,
      witnessVisible: false,
      localOnBehalfSearchData: [],
      subCategoryName: "",
      reopenRemarks: "",
      isFeedBackShown: false,
      feedVisible: false,
      optionIndex: "",
      questionArray: [],
      selectedOptionArray: [],
      questionIndex: 0,
      isAllRecordFilled: true,
      isSubmitRecord: false,
      currentSelectedIndex: "",
      isd_surveyData: {},
    };
    this._durationRef = React.createRef();
    this.serviceTypeRef = React.createRef();
    this.categoryRef = React.createRef();
    this.priorityRef = React.createRef();
    this.subCategoryRef = React.createRef();
    this.locationRef = React.createRef();
    this._panel = React.createRef();
    this.mangerLeaveRef = React.createRef();
  }
  resetLocalState = () => {
    this.setState({
      serviceTypeIndex: -1, // incident=1, service request=2
      managerOnLeaveIndex: 0,
      durationIndex: -1,
      descriptionInput: "",
      selectedLocation: "",
      isSubCategoryNotAvailable: false,
      isLocationOthers: false,
      locationOthersInput: "",
      seatNumberInput: "",
      ipAddressInput: "",
      assetCodeInput: "",
      thirdWitnessInput: "",
      isdDefaultDataArray: [],
      isdServiceTypeDataArray: [],
      isdCategoryArray: [],
      isdSubCategoryArray: [],
      isdNewSubCategoryArray: [],
      isdLocationArray: [],
      isdPriorityArray: [],
      isdDurationArray: [],
      durationApplicableFlag: 0,
      assetCodeFlag: 0,
      seatNumberFlag: 0,
      ipAddressFlag: 0,
      witNessFlag: undefined,
      thirdWitnessFlag: undefined,
      incidentDateFlag: undefined,
      isCategorySelected: false,
      isSubCategorySelected: false,
      isPrioritySelected: false,
      isLocationSelected: false,
      isDurationSelected: false,
      requestCategoryIdValue: "",
      requestSubCategoryIdValue: "",
      requestPriorityIdValue: "",
      requesterLocationIdValue: "",
      requestDurationIdValue: "",
      isMgrOnLeaveValue: "N",
      isSaveFlag: "",
      showStartCalendar: false,
      showEndCalendar: false,
      showIncidentCalendar: false,
      query: "",
      empSearchData: [],
      isRequestUpdate: false,
      dialogContainerVisible: false,
      historyItem: [],
      additionalRemarks: "",
      popUpMessage: "",
      popUpHeading: "",
      newMobileNumber: "",
      isMobileNumberUpdated: false,
      noOfDurationDays: 0,
      durationFromDateValue: "",
      durationEndDateValue: "",
      currentDate: new Date(),
      durationEndDateMaxValue: "",
      durationEndDateMinValue: "",
      requestorUpdated: false,
      witnessUpdated: false,
      witnessQuery: "",
      searchFinished: true,
      witnessSearchFinished: true,
      incidentDate: "",
      requestClosed: false,
      isRecordSaved: false,
      requestID: "",
      browseLoading: false,
      onBehalfVisible: false,
      witnessVisible: false,
      localOnBehalfSearchData: [],
      subCategoryName: "",
      reopenRemarks: "",
      isFeedBackShown: false,
      feedVisible: false,
      optionIndex: "",
      isd_surveyData: {},
    });
  };
  updateScreen = () => {
    let data =
      this.props.isdDataForUpdate &&
      this.props.isdDataForUpdate.length > 0 &&
      this.props.isdDataForUpdate[0];
    console.log("Updating screen with data : ", data);
    if (data !== undefined) {
      this.setState({ isdDefaultDataArray: data }, () => {
        if (this.mangerLeaveRef && this.mangerLeaveRef.current) {
          console.log("IS Manager on Leave : ", data.IsMgrOnLeave);
          if (
            data.IsMgrOnLeave !== undefined &&
            data.IsMgrOnLeave.trim() !== "" &&
            data.IsMgrOnLeave === "N"
          ) {
            console.log("IS Manager on Leave no case: ", data.IsMgrOnLeave);
            this.mangerLeaveRef.current.updateIsActiveIndex(0);
            this.mangerLeaveRef.current.props.onPress(0);
          } else if (
            data.IsMgrOnLeave !== undefined &&
            data.IsMgrOnLeave.trim() !== "" &&
            data.IsMgrOnLeave === "Y"
          ) {
            console.log("IS Manager on Leave yes case: ", data.IsMgrOnLeave);
            this.mangerLeaveRef.current.updateIsActiveIndex(1);
            this.mangerLeaveRef.current.props.onPress(1);
          }
        }
      });
    }
    if (
      data.RequestCategoryId !== undefined &&
      data.RequestCategoryId !== null &&
      data.RequestCategoryId !== "" &&
      data.RequestCategoryId !== "0"
    ) {
      setTimeout(() => {
        this.onCategorySelection(
          parseInt(data.RequestCategoryId),
          undefined,
          data
        );
      }, 500);
    }
    if (
      data.RequestPriorityId !== undefined &&
      data.RequestPriorityId !== null &&
      data.RequestPriorityId !== "" &&
      data.RequestPriorityId !== "0"
    ) {
      this.onPrioritySelection(data.RequestPriorityId);
    }
    if (
      data.RequesterLocationId !== undefined &&
      data.RequesterLocationId !== null &&
      data.RequesterLocationId !== "" &&
      data.RequesterLocationId !== "0"
    ) {
      this.onLocationSelection(data.RequesterLocationId);
    }
    if (
      data.RequestDurationId !== undefined &&
      data.RequestDurationId !== null &&
      data.RequestDurationId !== "" &&
      data.RequestDurationId !== "0"
    ) {
      console.log("Calling onDurationSelection ...", data.RequestDurationId);
      this.onDurationSelection(data.RequestDurationId);
    }
    if (
      data.RequestDescription !== undefined &&
      data.RequestDescription !== null &&
      data.RequestDescription !== ""
    ) {
      this.setState({ descriptionInput: data.RequestDescription });
    }
    if (
      data.ThirdWitness !== undefined &&
      data.ThirdWitness !== null &&
      data.ThirdWitness !== ""
    ) {
      this.setState({ thirdWitnessInput: data.ThirdWitness });
    }
    if (
      data.witness !== undefined &&
      data.witness !== null &&
      data.witness !== ""
    ) {
      this.setState({ witnessQuery: data.witness });
    }
    if (
      data.RequesterSeatNo !== undefined &&
      data.RequesterSeatNo !== null &&
      data.RequesterSeatNo !== ""
    ) {
      this.setState({ seatNumberInput: data.RequesterSeatNo });
    }
    if (
      data.RequesterIP !== undefined &&
      data.RequesterIP !== null &&
      data.RequesterIP !== ""
    ) {
      this.setState({ ipAddressInput: data.RequesterIP });
    }
    if (
      data.RequesterAssetCode !== undefined &&
      data.RequesterAssetCode !== null &&
      data.RequesterAssetCode !== ""
    ) {
      this.setState({ assetCodeInput: data.RequesterAssetCode });
    }
    if (
      data.DurationFromDate !== undefined &&
      data.DurationFromDate !== null &&
      data.DurationFromDate !== ""
    ) {
      this.setState({ durationFromDateValue: data.DurationFromDate });
    }
    if (
      data.DurationToDate !== undefined &&
      data.DurationToDate !== null &&
      data.DurationToDate !== ""
    ) {
      this.setState({ durationEndDateValue: data.DurationToDate });
    }
    if (
      data.IncidentDate !== undefined &&
      data.IncidentDate !== null &&
      data.IncidentDate !== "" &&
      !data.IncidentDate.includes("1900")
    ) {
      let incidentDateFormatted = moment(data.IncidentDate).format(
        "DD-MM-YYYY"
      );
      this.setState({ incidentDate: incidentDateFormatted });
    } else {
      this.setState({ assetCodeInput: data.RequesterAssetCode });
    }
    this.showFeedbackView();
  };
  autoCompleteISD = () => {
    this.props.autoCompleteEmployeeISD("");
  };
  recordUpdateCallBack = () => {
    if (this.props.navigation.state.params !== undefined) {
      let dataFromPreviousScreen = this.props.navigation.state.params
        .dataToUpdate;
      this.props.fetchPreviousRecordsToUpdate(
        this.props.empCode,
        this.props.accessToken,
        dataFromPreviousScreen.RequestID,
        "",
        dataFromPreviousScreen.TeamID,
        dataFromPreviousScreen.Type,
        this.updateScreen
      );
    }
  };
  componentDidMount() {
    BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
    if (
      this.props.navigation.state.params &&
      this.props.navigation.state.params.dataToUpdate !== undefined
    ) {
      let dataFromPreviousScreen = this.props.navigation.state.params
        .dataToUpdate;
      let categorySelected = dataFromPreviousScreen.ServiceNumber.includes(
        "INC"
      )
        ? 0
        : dataFromPreviousScreen.ServiceNumber.includes("SCI")
        ? 2
        : 1;
      this.setState(
        {
          isdDefaultDataArray: dataFromPreviousScreen,
          serviceTypeIndex: categorySelected,
          isRequestUpdate: true,
          requestorTypeIndex: parseInt(
            dataFromPreviousScreen.RequestPriorityId
          ),
        },
        () => {
          this.serviceTypeRef.current.updateIsActiveIndex(categorySelected);
          this.serviceTypeRef.current.props.onPress(categorySelected);
          setTimeout(() => {
            this.props.fetchISDDefaultData(
              this.props.empCode,
              this.props.accessToken,
              this.recordUpdateCallBack
            );
          }, 1000);
        }
      );
    } else {
      setTimeout(() => {
        this.props.fetchISDDefaultData(
          this.props.empCode,
          this.props.accessToken,
          this.recordUpdateCallBack
        );
      }, 500);
    }
  }
  componentWillUnmount() {
    this.props.resetISDCreateScreen();
    this.resetLocalState();
    console.log("Component is unmounted");
    BackHandler.removeEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
  }

  static getDerivedStateFromProps(nextProps, state) {
    let mobileNumberFromService =
      nextProps.isdDataForUpdate && nextProps.isdDataForUpdate.length > 0
        ? nextProps.isdDataForUpdate[0].RequesterMobile
        : nextProps.isdDefaultData && nextProps.isdDefaultData.length > 0
        ? nextProps.isdDefaultData[0].RequesterMobile
        : undefined;
    return {
      isdServiceTypeDataArray: nextProps.isdServiceTypeData,
      isdCategoryArray:
        nextProps.isdServiceTypeData && nextProps.isdServiceTypeData.length > 0
          ? nextProps.isdServiceTypeData.filter(
              (value) => value.SearchText == "CATEGORY"
            )
          : [],
      isdSubCategoryArray:
        nextProps.isdServiceTypeData && nextProps.isdServiceTypeData.length > 0
          ? nextProps.isdServiceTypeData.filter(
              (value) => value.SearchText == "SUBCATEGORY"
            )
          : [],
      isdLocationArray:
        nextProps.isdServiceTypeData && nextProps.isdServiceTypeData.length > 0
          ? nextProps.isdServiceTypeData.filter(
              (value) => value.SearchText == "LOCATION"
            )
          : [],
      isdPriorityArray:
        nextProps.isdServiceTypeData && nextProps.isdServiceTypeData.length > 0
          ? nextProps.isdServiceTypeData.filter(
              (value) => value.SearchText == "PRIORITY"
            )
          : [],
      isdDurationArray:
        nextProps.isdServiceTypeData && nextProps.isdServiceTypeData.length > 0
          ? nextProps.isdServiceTypeData.filter(
              (value) => value.SearchText == "Duration"
            )
          : [],
      isdDefaultDataArray:
        nextProps.isdDefaultData && nextProps.isdDefaultData.length > 0
          ? nextProps.isdDefaultData[0]
          : [],
      newMobileNumber:
        mobileNumberFromService && !state.isMobileNumberUpdated
          ? mobileNumberFromService
          : state.newMobileNumber,
      // localOnBehalfSearchData: nextProps.searchData.length > 0 && !state.query.length > 0 && nextProps.searchData ,
      // onBehalfSearchData: nextProps.searchData.length > 0 && !state.query.length > 0 && nextProps.searchData
    };
  }

  componentDidUpdate(prevProps, prevState) {
    console.log("ISD - SAVE DATA", this.props.isdSaveData);
    console.log("Pop up message", this.state.popUpMessage);
    console.log("LOADING", this.props.isdLoading);
    if (
      this.props.isdLoading === false &&
      this.state.popUpMessage === "" &&
      (this.props.isdSaveData === "success" ||
        this.props.isdSaveData.includes("_SR") ||
        this.props.isdSaveData.includes("_INC") ||
        this.props.isdSaveData.includes("_SCI"))
    ) {
      setTimeout(() => {
        let customMessge = "Data saved successfully with request number ";
        let requestNumber =
          this.props.navigation.state.params &&
          this.props.navigation.state.params.dataToUpdate !== undefined
            ? this.props.navigation.state.params.dataToUpdate.ServiceNumber
            : this.props.isdSaveData.split("_")[1];
        let message =
          requestNumber !== undefined
            ? customMessge + requestNumber
            : customMessge;
        this.setState({
          isPopUp: true,
          popUpMessage: message,
          popUpHeading: "Data Saved!",
          isRecordSaved: true,
        });
      }, 1000);
    } else if (
      this.props.isdLoading === false &&
      this.state.popUpMessage === "" &&
      this.props.isdSaveError.length > 0
    ) {
      setTimeout(() => {
        this.setState({
          isPopUp: true,
          popUpMessage: this.props.isdSaveError,
          popUpHeading: "Error",
        });
      }, 1000);
    } else if (
      this.props.isdLoading === false &&
      this.state.popUpMessage === "" &&
      this.props.additionalRemarks.length > 0
    ) {
      setTimeout(() => {
        this.setState({
          isPopUp: true,
          popUpMessage: "Remarks submitted successfully",
          popUpHeading: "Remarks Submitted",
        });
      }, 1000);
    }
    if (
      prevProps?.isdDefaultData[0]?.ManagerID !==
        this.props?.isdDefaultData[0]?.ManagerID &&
      this.props.navigation.state.params == undefined
    ) {
      if (this.props.isdDefaultData[0]?.ManagerID == "00000000") {
        setTimeout(() => {
          return Alert.alert(
            "No Supervisor !",
            "Please contact your HR to update your supervisor in system.",
            [
              {
                text: "ok",
                onPress: () => this.props.navigation.pop(),
              },
            ]
          );
        }, 2000);
      }
    }
  }

  handleBackButtonClick = () => {
    this.onBack();
    return true;
  };

  handleBack = () => {
    this.props.resetISDCreateScreen();
    setTimeout(() => {
      this.props.navigation.navigate("ITDeskDashBoard");
    }, 1000);
  };
  onBack = () => {
    this.props.navigation.pop();
  };
  showStartCalendar = () => {
    let data =
      (this.props.isdDataForUpdate && this.props.isdDataForUpdate.length) > 0
        ? this.props.isdDataForUpdate[0]
        : this.state.isdDefaultDataArray;
    this.state.isRequestUpdate === true && data.isSave === false
      ? this.setState({
          showStartCalendar: false,
        })
      : this.setState({
          showStartCalendar: true,
        });
  };

  handleStartDateConfirm = (startDate) => {
    this.hideStartDatePicker();
    let startDateSelected = moment(startDate, "DD-MM-YYYY").format(
      "DD-MM-YYYY"
    );
    let endDateUpdated = moment(startDate, "DD-MM-YYYY")
      .add(this.state.noOfDurationDays, "days")
      .format("DD-MM-YYYY");

    this.setState({
      durationFromDateValue: startDateSelected,
      durationEndDateValue: endDateUpdated,
      durationEndDateMinValue: moment(startDate, "DD-MM-YYYY").toDate(),
      durationEndDateMaxValue: moment(startDate, "DD-MM-YYYY")
        .add(this.state.noOfDurationDays, "days")
        .toDate(),
    });
    console.log("A start date has been picked: ", startDateSelected);
  };
  incidentDateConfirm = (date) => {
    this.hideIncidentCalendar();
    let incidentDateSelected = moment(date, "DD-MMM-YYYY").format(
      "DD-MMM-YYYY"
    );
    console.log("Incident date : ", incidentDateSelected);
    console.log("Date : ", date);
    this.setState({ incidentDate: incidentDateSelected }, () => {
      console.log("Incident Date : ", this.state.incidentDate);
    });
  };
  hideStartDatePicker = () => {
    this.setState({
      showStartCalendar: false,
    });
  };

  showIncidentCalendar = () => {
    let data =
      (this.props.isdDataForUpdate && this.props.isdDataForUpdate.length) > 0
        ? this.props.isdDataForUpdate[0]
        : this.state.isdDefaultDataArray;
    this.state.isRequestUpdate === true && data.isSave === false
      ? this.setState({
          showIncidentCalendar: false,
        })
      : this.setState({
          showIncidentCalendar: true,
        });
  };

  hideIncidentCalendar = () => {
    this.setState({
      showIncidentCalendar: false,
    });
  };

  showEndCalendar = () => {
    let data =
      (this.props.isdDataForUpdate && this.props.isdDataForUpdate.length) > 0
        ? this.props.isdDataForUpdate[0]
        : this.state.isdDefaultDataArray;
    this.state.isRequestUpdate === true && data.isSave === false
      ? this.setState({
          showEndCalendar: false,
        })
      : this.setState({
          showEndCalendar: true,
        });
  };

  handleEndDateConfirm = (endDate) => {
    this.hideEndDatePicker();
    let endDateSelected = moment(endDate, "DD-MM-YYYY").format("DD-MM-YYYY");
    this.setState({
      durationEndDateValue: endDateSelected,
    });
    console.log("A end date has been picked: ", endDateSelected);
  };

  hideEndDatePicker = () => {
    this.setState({
      showEndCalendar: false,
    });
  };

  requestorSearchView = () => {};

  requestorSearch = (text) => {};

  onNameChanged = (text) => {
    console.log(text + "written");
  };
  onNameFocus = () => {
    console.log("Name is focused");
  };
  onMobileChanged = (text) => {
    this.setState({
      isMobileNumberUpdated: true,
      newMobileNumber: text,
    });
    console.log(text + "mobile text written");
  };
  onMobileFocus = () => {
    console.log("mobile is focused");
  };
  onSeatNoChanged = (text) => {
    this.setState({
      seatNumberInput: text,
    });
  };
  onSeatNoFocus = () => {
    console.log("seat number is focused");
  };
  onIPChanged = (text) => {
    this.setState({
      ipAddressInput: text,
    });
  };
  onIPFocus = () => {
    console.log("ip is focused");
  };
  onAssetCodeChanged = (text) => {
    this.setState({
      assetCodeInput: text,
    });
  };
  onThirdWitnessChanged = (text) => {
    this.setState(
      {
        thirdWitnessInput: text,
      },
      () => {
        console.log("Third witness input is :", text);
      }
    );
  };
  onAssetCodeFocus = () => {
    console.log("asset code is focused");
  };
  onNoSubCategoryChanged = (text) => {
    console.log(text + "written");
  };
  onNoSubCategoryFocus = () => {
    console.log("sub category is focused");
  };
  onLocationOthersChanged = (text) => {
    this.setState({
      locationOthersInput: text,
      isLocationSelected: true,
    });
    console.log(text + "written");
  };
  onLocationOthersFocus = () => {
    console.log("location others is focused");
  };
  onDescriptionChanged = (text) => {
    this.setState({
      descriptionInput: text,
    });
    console.log(text + "written");
  };
  onDescriptionFocus = () => {
    console.log("description is focused");
  };
  onProjectChanged = (text) => {
    console.log(text + "written");
  };
  onProjectFocus = () => {
    console.log("Project is focused");
  };

  onServiceTypeSelection = (serviceType) => {
    console.log("Service type array:", this.state.isdServiceTypeDataArray);
    this.setState(
      {
        serviceTypeIndex: serviceType + 1,
      },
      () => {
        this.props.fetchISDServiceTypeData(
          this.props.empCode,
          this.props.accessToken,
          this.state.serviceTypeIndex
        );
      }
    );
    if (this.categoryRef.current) {
      this.categoryRef.current.select(-1);
    }
    if (this.subCategoryRef.current) {
      this.subCategoryRef.current.select(-1);
    }
    console.log("Service type selected is :", serviceType);
  };

  onRequestorTypeSelection = (requestorType) => {
    console.log("Service type array:", this.state.isdServiceTypeDataArray);

    this.setState(
      {
        requestorTypeIndex: requestorType,
        onBehalfVisible: requestorType === 1 ? true : false,
      },
      () => {
        if (requestorType === 0) {
          this.props.updateRequestorDetailsISD(this.props.empCode);
        }
        // this.state.requestorUpdated ? this.props.updateRequestorDetailsISD(this.props.empCode) : null
      }
    );
    console.log("Requester type selected is :", requestorType);
  };

  onManagerOnLeaveSelection = (index) => {
    this.setState({
      managerOnLeaveIndex: index,
      isMgrOnLeaveValue: index === 1 ? "Y" : "N",
    });
    console.log("manager on leave answer selected is :", index);
  };
  onCategorySelection = (i, value, data) => {
    let myCategoryId;
    let index;
    console.log("onCategorySelection : ", i, value, data);
    if (value === undefined) {
      // update case
      myCategoryId = i;
      index = this.state.isdCategoryArray.findIndex(
        (element) => element.Value == myCategoryId
      );
    } else {
      // create case
      myCategoryId =
        this.state.isdCategoryArray[i] !== undefined
          ? this.state.isdCategoryArray[i].Value
          : -1;
      console.log("My category ID : ", myCategoryId);
    }
    this.setState({
      isCategorySelected: true,
      requestCategoryIdValue: myCategoryId,
      isSubCategorySelected: false,
    });
    if (this.subCategoryRef.current) {
      this.subCategoryRef.current.select(-1);
    }
    console.log("Category ID :", myCategoryId, this.state.isdCategoryArray);
    // let newSubcategory = (this.state.isRequestUpdate===true) ? this.state.isdSubCategoryArray.filter( val =>  val === myCategoryId)  : this.state.isdSubCategoryArray.filter(value => value.CategoryId == myCategoryId)
    let newSubcategory = this.state.isdSubCategoryArray.filter(
      (value) => value.CategoryId == myCategoryId
    );
    if (newSubcategory.length === 0) {
      this.setState({
        isSubCategoryNotAvailable: true,
      });
    } else {
      this.setState({
        isSubCategoryNotAvailable: false,
        isdNewSubCategoryArray: newSubcategory,
      });
    }
    console.log("newSubcategory", newSubcategory);
    console.log("sub Category data:", this.state.isdSubCategoryArray);
    console.log("sub Category new data :", this.state.isdNewSubCategoryArray);
    console.log(
      "Category selected is :",
      this.state.requestCategoryIdValue,
      i,
      value
    );
    if (this.state.isRequestUpdate === true && this.categoryRef.current) {
      this.categoryRef.current.select(index);
    }
    if (
      data !== undefined &&
      data.RequestSubCategoryId !== undefined &&
      data.RequestSubCategoryId !== null &&
      data.RequestSubCategoryId !== "" &&
      data.RequestSubCategoryId !== "0"
    ) {
      this.onSubCategorySelection(data.RequestSubCategoryId);
    }
  };
  onSubCategorySelection = (index, value) => {
    let subCatArray =
      this.state.isdNewSubCategoryArray.length > 0
        ? this.state.isdNewSubCategoryArray
        : this.state.isdSubCategoryArray;
    let subCategoryConditions =
      value === undefined
        ? index.split("_")
        : subCatArray[index].Value.split("_");
    let subCategoryId = subCategoryConditions[0];
    let durationApplicable = subCategoryConditions[1];
    let durationDays = subCategoryConditions[2];
    let assetCode = subCategoryConditions[3];
    let seatNumber = subCategoryConditions[4];
    let ipAddress = subCategoryConditions[5];
    let witness = subCategoryConditions[6];
    let thirdWitness = subCategoryConditions[7];
    let incidentDate = subCategoryConditions[8];
    let approvalReq = subCategoryConditions[9];
    let exceptionalApprovalReq = subCategoryConditions[10];
    this.setState({
      subCategoryName: value,
      isSubCategorySelected: true,
      requestSubCategoryIdValue: subCategoryId,
      durationApplicableFlag: durationApplicable,
      assetCodeFlag: assetCode,
      seatNumberFlag: seatNumber,
      ipAddressFlag: ipAddress,
      noOfDurationDays: durationDays,
      witNessFlag: witness === "0" ? undefined : witness === "2" ? "M" : "Y", // this way is correct
      // witNessFlag: witness === "1" ? undefined : witness === "0" ? "M" : "Y", // this way is for test
      thirdWitnessFlag:
        thirdWitness === "0" ? undefined : thirdWitness === "2" ? "M" : "Y",
      incidentDateFlag:
        incidentDate === "0" ? undefined : incidentDate === "2" ? "M" : "Y",
    });

    if (this.state.isRequestUpdate === true) {
      if (subCatArray.length > 0) {
        subCatArray.forEach((element, i) => {
          if (element.Value === index && this.subCategoryRef.current) {
            let currIndex = subCatArray.findIndex(
              (element) => element.Value === index
            );
            this.subCategoryRef.current.select(currIndex);
            console.log(
              "Sub Category selected is :",
              this.state.requestSubCategoryIdValue,
              index,
              value
            );
          }
        });
      } else if (this.state.isdSubCategoryArray.length > 0) {
        this.state.isdSubCategoryArray.forEach((element, i) => {
          if (element.Value === index && this.subCategoryRef.current) {
            let currIndex = this.state.isdSubCategoryArray.findIndex(
              (element) => element.Value === index
            );
            this.subCategoryRef.current.select(currIndex);
            console.log(
              "Sub Category selected is :",
              this.state.requestSubCategoryIdValue,
              index,
              value
            );
          }
        });
      }
    } else {
      console.log(
        "Sub Category selected is :",
        this.state.requestSubCategoryIdValue,
        index,
        value
      );
    }
  };
  onPrioritySelection = (i, value) => {
    let index = 0;
    if (value === undefined && this.state.isdPriorityArray.length > 0) {
      this.state.isdPriorityArray.map((val, idx) => {
        if (i === val.Value) {
          index = idx;
        }
      });
    } else {
      index = i;
    }
    console.log("Priority Array : ", this.state.isdPriorityArray, index);
    let myPriorityId =
      this.state.isdPriorityArray.length > 0 &&
      this.state.isdPriorityArray[index].Value;
    console.log("My priority id is :", myPriorityId);
    this.setState({
      isPrioritySelected: true,
      requestPriorityIdValue: myPriorityId,
    });
    if (this.state.isRequestUpdate === true && this.priorityRef.current) {
      this.priorityRef.current.select(index);
      console.log(
        "Priority selected is :",
        index,
        this.state.requestPriorityIdValue
      );
    } else {
      console.log(
        "Priority selected is :",
        index,
        this.state.requestPriorityIdValue
      );
    }
  };
  onLocationSelection = (i, value) => {
    let index = value === undefined ? i - 1 : i;
    let myLocationId =
      this.state.isdLocationArray.length > 0 &&
      this.state.isdLocationArray[index] &&
      this.state.isdLocationArray[index].Value;
    if (value === "Others") {
      this.setState({
        isLocationOthers: true,
        requesterLocationIdValue: myLocationId,
      });
    } else {
      this.setState({
        selectedLocation: value,
        requesterLocationIdValue: myLocationId,
        isLocationSelected: true,
      });
    }
    if (this.state.isRequestUpdate === true && this.locationRef.current) {
      this.locationRef.current.select(index);
      console.log(
        "Location selected is :",
        this.state.requesterLocationIdValue,
        value
      );
    } else {
      console.log(
        "Location selected is :",
        this.state.requesterLocationIdValue,
        value
      );
    }
  };
  onDurationSelection = (value) => {
    this.setState(
      {
        durationIndex: value - 1,
        requestDurationIdValue: value,
      },
      () => {
        console.log("5555555", this.state.durationIndex);
        console.log("666666666", this.state.requestDurationIdValue);
      }
    );
    if (value === 2) {
      const today = this.state.currentDate;
      let startDate = moment(today, "DD-MM-YYYY").format("DD-MM-YYYY");
      let endDateMinValue = moment(today, "DD-MM-YYYY").toDate();
      let endDateMaxValue = moment()
        .add(this.state.noOfDurationDays, "days")
        .toDate();
      let endDate = moment()
        .add(this.state.noOfDurationDays, "days")
        .format("DD-MM-YYYY");
      this.setState({
        durationFromDateValue: startDate,
        durationEndDateValue: endDate,
        durationEndDateMinValue: endDateMinValue,
        durationEndDateMaxValue: endDateMaxValue,
      });
    } else {
      this.setState({
        durationFromDateValue: "",
        durationEndDateValue: "",
        durationEndDateMinValue: "",
        durationEndDateMaxValue: "",
      });
    }
  };
  renderHistoryButton = (item, index) => {
    return (
      <TouchableOpacity
        style={styles.historyButton}
        onPress={() => {
          this.showHistoryDetail(item, index);
        }}
      >
        <Text style={styles.historyText}>{item.ActionTakenDate.trim()}</Text>
      </TouchableOpacity>
    );
  };
  showHistoryDetail = (item, index) => {
    this.setState(
      { historyItem: [item], dialogContainerVisible: false },
      () => {
        setTimeout(() => {
          if (this._panel.current !== null) {
            this._panel.current.show(height / 1.3);
          }
        }, 500);
      }
    );
  };
  showHistory = () => {
    this.setState({ dialogContainerVisible: true });
  };
  onDialogClose = () => {
    console.log("onDialogClose called");
    this.setState({ dialogContainerVisible: false });
  };
  onPanelClose = () => {
    this.setState({ historyItem: [] });
  };
  onReOpenRemarks = (remarks) => {
    this.setState({ reopenRemarks: remarks }, () => {
      console.log("Reopen Remarks", this.state.reopenRemarks);
    });
  };
  onAdditionalRemarks = (additionalRemarks) => {
    this.setState({ additionalRemarks: additionalRemarks }, () => {
      console.log("ADDITIONAL REMARKS", this.state.additionalRemarks);
    });
  };
  onSubmitAdditionalRemarks = (submittedData) => {
    this.props.submitAdditionalRemarks(
      this.props.empCode,
      this.props.accessToken,
      submittedData.RequestID,
      this.state.additionalRemarks
    );
  };
  onSubmitReopenRemarks = (submittedData) => {
    this.props.submitReopenRemarks(
      this.props.empCode,
      this.props.accessToken,
      submittedData.RequestID,
      this.state.reopenRemarks
    );
  };
  onSubmitOrSave = (actionType) => {
    console.log("Default Data array", this.state.isdDefaultDataArray);
    let defaultDataArray = this.state.isdDefaultDataArray;
    let myRequestorCode = defaultDataArray.RequesterName.split(":")[0].trim();
    console.log(
      "PROJECT Code",
      defaultDataArray.RequesterProjectName.split(":")[0].trim()
    );
    let record = {
      requestID:
        this.state.isRequestUpdate === true
          ? this.props.navigation.state.params.dataToUpdate.RequestID
          : this.state.requestID,
      requesterCode: myRequestorCode,
      requesterMobile: defaultDataArray.RequesterMobile,
      requesterProjectCode: defaultDataArray.RequesterProjectCode,
      requestType: "",
      requestCategoryId: "",
      requestSubCategoryId: "",
      requestPriorityId: "",
      requesterLocationId: "",
      otherLocation: "",
      requesterSeatNo: "",
      requesterIP: "",
      requesterAssetCode: "",
      requestDescription: "",
      requestDurationId: "",
      durationFromDate: "",
      durationToDate: "",
      managerID:
        this.state.serviceTypeIndex === 2 ? defaultDataArray.ManagerID : "",
      isMgrOnLeave:
        this.state.serviceTypeIndex === 2 ? this.state.isMgrOnLeaveValue : "",
      isSave: "",
      smBand: this.state.serviceTypeIndex === 2 ? defaultDataArray.SMBand : "",
      reviewingManagerID:
        this.state.serviceTypeIndex === 2
          ? defaultDataArray.ReviewingManagerID
          : "",
      witness:
        this.state.serviceTypeIndex === 3
          ? this.state.witnessQuery.split(":")[0].trim()
          : "",
      ThirdWitness:
        this.state.serviceTypeIndex === 3 ? this.state.thirdWitnessInput : "",
      IncidentDate:
        this.state.serviceTypeIndex === 3 ? this.state.incidentDate : "",
    };
    // if (this.state.requestorTypeIndex === 1 && !this.state.requestorUpdated) {
    // 	return alert("Please select valid Requester!!")
    // } else
    console.log("Mobile number : ", this.state.newMobileNumber);
    console.log("Mobile length : ", this.state.newMobileNumber.length);
    if (
      this.state.newMobileNumber.length < 10 ||
      this.state.newMobileNumber.length > 15
    ) {
      return alert("Valid Mobile number is mandatory.");
    }
    if (/[*%#:&\s]/.test(this.state.newMobileNumber)) {
      return alert("Valid Mobile number is mandatory.");
    }

    if (this.state.serviceTypeIndex === -1) {
      return alert("Please select Request Type!!");
    } else {
      record.requestType = this.state.serviceTypeIndex;
      console.log("record", record);
      console.log("Action type : ", actionType);
      if (actionType === constants.SUBMIT_TEXT) {
        this.setState(
          {
            isSaveFlag: false,
            requestClosed: true,
            popUpMessage: "",
          },
          () => {
            record.isSave = false;
            let mySeatNumberInput = this.state.seatNumberInput.trim();
            let myIPAddressInput = this.state.ipAddressInput.trim();
            let myAssetCodeInput = this.state.assetCodeInput.trim();
            let myDescriptionInput = this.state.descriptionInput.trim();
            if (
              !this.state.isCategorySelected ||
              !this.state.isSubCategorySelected ||
              !this.state.isPrioritySelected ||
              !this.state.isLocationSelected ||
              !this.state.isLocationSelected ||
              !this.state.isLocationSelected ||
              (this.state.isLocationOthers &&
                this.state.locationOthersInput.length === 0) ||
              (this.state.seatNumberFlag == 2 && mySeatNumberInput === "") ||
              (this.state.ipAddressFlag == 2 && myIPAddressInput === "") ||
              (this.state.witNessFlag &&
                this.state.witNessFlag === "M" &&
                this.state.witnessQuery.trim() === "") ||
              (this.state.thirdWitnessFlag &&
                this.state.thirdWitnessFlag === "M" &&
                this.state.thirdWitnessInput.trim() === "") ||
              (this.state.incidentDateFlag &&
                this.state.incidentDateFlag === "M" &&
                this.state.incidentDate.trim() === "") ||
              (this.state.assetCodeFlag == 2 && myAssetCodeInput === "") ||
              (this.state.durationApplicableFlag == 2 &&
                this.state.durationIndex === -1) ||
              this.state.newMobileNumber.length == 0
            ) {
              return alert("All fields with * are mandatory.");
            }
            if (
              this.state.isdDefaultDataArray.ManagerName == "" &&
              this.state.isMgrOnLeaveValue == "N"
            ) {
              return alert(
                "Your manager is not defined in HR records. Please contact your HR for manager mapping."
              );
            } else if (myDescriptionInput.length < 25) {
              return alert("Description can't be lesser than 25 characters.");
            } else if (myDescriptionInput.length > 4000) {
              return alert(
                "Description can't be greater than 4000 characters."
              );
            } else {
              record.requestCategoryId = this.state.requestCategoryIdValue;
              record.requestSubCategoryId = this.state.requestSubCategoryIdValue;
              record.requestPriorityId = this.state.requestPriorityIdValue;
              record.requesterLocationId = this.state.requesterLocationIdValue;
              record.otherLocation =
                this.state.isLocationOthers &&
                this.state.locationOthersInput.length > 0
                  ? this.state.locationOthersInput
                  : "";
              record.requesterSeatNo =
                this.state.seatNumberFlag != 0 ? mySeatNumberInput : "";
              record.requesterIP =
                this.state.ipAddressFlag != 0 ? myIPAddressInput : "";
              record.requesterAssetCode =
                this.state.assetCodeFlag != 0 ? myAssetCodeInput : "";
              record.requestDescription = myDescriptionInput;
              record.requestDurationId = this.state.requestDurationIdValue;
              record.durationFromDate = this.state.durationFromDateValue;
              record.durationToDate = this.state.durationEndDateValue;
              record.requesterMobile = this.state.newMobileNumber;
              this.props.saveOrSubmitISD(record).then(() => {
                console.log("mohit submit", this.props.isdSaveData);
                if (this.props.isdSaveData && this.props.isdSaveData != "") {
                  let myReqId =
                    this.state.isRequestUpdate === true
                      ? this.props.navigation.state.params.dataToUpdate
                          .RequestID
                      : this.props.isdSaveData.split("_")[0];
                  console.log("MyRequest ID : ", myReqId);
                  if (this.state.fileData != "") {
                    uploadIsdFiles(myReqId);
                  }
                }
              });
            }
          }
        );
      } else {
        this.setState(
          {
            isSaveFlag: true,
            popUpMessage: "",
          },
          () => {
            record.isSave = true;
            record.requestCategoryId = this.state.requestCategoryIdValue;
            record.requestSubCategoryId = this.state.requestSubCategoryIdValue;
            record.requestPriorityId = this.state.requestPriorityIdValue;
            record.requesterLocationId = this.state.requesterLocationIdValue;
            record.otherLocation = this.state.isLocationOthers
              ? this.state.locationOthersInput
              : "";
            record.requesterSeatNo =
              this.state.seatNumberFlag != 0 ? this.state.seatNumberInput : "";
            record.requesterIP =
              this.state.ipAddressFlag != 0 ? this.state.ipAddressInput : "";
            record.requesterAssetCode =
              this.state.assetCodeFlag != 0 ? this.state.assetCodeInput : "";
            record.requestDescription = this.state.descriptionInput;
            record.requestDurationId = this.state.requestDurationIdValue;
            record.durationFromDate = this.state.durationFromDateValue;
            record.durationToDate = this.state.durationEndDateValue;
            record.requesterMobile = this.state.newMobileNumber;
            console.log("final save input record", record);
            this.props.saveOrSubmitISD(record).then((data) => {
              if (this.props.isdSaveData && this.props.isdSaveData != "") {
                let myReqId =
                  this.state.isRequestUpdate === true
                    ? this.props.navigation.state.params.dataToUpdate.RequestID
                    : this.props.isdSaveData.split("_")[0];
                uploadIsdFiles(myReqId);
              }
            });
          }
        );
      }
    }
    console.log("Submit Action clicked", actionType);
  };

  findEmployee = (query) => {
    if (query === "") {
      return [];
    }

    if (query.length >= 2) {
      this.props.autoCompleteEmployeeISD(query);
      return this.props.isdSearchEmployeeData;
    }
  };
  formView = () => {
    let data =
      (this.props.isdDataForUpdate && this.props.isdDataForUpdate.length) > 0
        ? this.props.isdDataForUpdate[0]
        : this.state.isdDefaultDataArray;
    console.log("ManagerName", this.state.isdDefaultDataArray.ManagerName);
    console.log("DATA updated", data);
    const { query, witnessQuery } = this.state;
    let empSearchResult;
    let witnessSearchResult;
    if (query !== "" && !this.state.searchFinished) {
      empSearchResult = this.findEmployee(query);
    }
    if (witnessQuery !== "" && !this.state.witnessSearchFinished) {
      witnessSearchResult = this.findEmployee(witnessQuery);
    }
    let reOpenStatus = data.RequestStatus;
    let startMoment = moment(new Date(data.ModifiedOn), "DD-MM-YYYY");
    let endMoment = moment(new Date(), "DD-MM-YYYY");
    let duration = moment.duration(endMoment.diff(startMoment));
    let timeElapsedReopen = Math.round(duration.asHours());
    console.log("DATA : ", data);
    console.log("Time elapse reopen : ", timeElapsedReopen);
    return (
      <View style={[globalFontStyle.contentViewGlobal, styles.contentView]}>
        <RadioFormHorizontal
          disable={
            this.state.isRequestUpdate === true ||
            this.state.isRecordSaved === true
              ? true
              : false
          }
          title="Request For*"
          selectedVal={this.state.requestorTypeIndex}
          onValueSelection={(val) => this.onRequestorTypeSelection(val)}
          options={constants.REQUESTOR_TYPES}
        />
        <LabelEditText
          heading="Requester*"
          isEditable={false}
          myNumberOfLines={2}
          isMultiline={true}
          myValue={data.RequesterName}
        />
        <LabelEditText
          heading="Mobile*"
          myKeyboardType={"numeric"}
          isEditable={
            this.state.requestorTypeIndex == -1 ||
            (!data.isSave && this.state.isRequestUpdate)
              ? false
              : true
          }
          myValue={this.state.newMobileNumber}
          onTextChanged={this.onMobileChanged}
          onFocusView={this.onMobileFocus}
        />
        <LabelEditText
          heading="Project*"
          isEditable={false}
          myNumberOfLines={2}
          isMultiline={true}
          myValue={data.RequesterProjectName}
        />
        <RadioForms
          disable={
            this.state.isRequestUpdate || this.state.isRecordSaved
              ? true
              : false
          }
          forwardedRef={this.serviceTypeRef}
          selectedVal={this.state.serviceTypeIndex}
          onValueSelection={(val) => this.onServiceTypeSelection(val)}
          labelHorizontal={true}
          title="Request Type*"
          options={constants.SERVICE_TYPES}
        />
        {this.state.serviceTypeIndex !== -1 ? (
          <View>
            <Dropdown
              title="Category*"
              disabled={
                (this.state.isRequestUpdate === true && !data.isSave) === true
                  ? true
                  : false
              }
              forwardedRef={this.categoryRef}
              dropDownData={this.state.isdCategoryArray.map(
                (value) => value.Display
              )}
              dropDownCallBack={(index, value) =>
                this.onCategorySelection(index, value)
              }
            />
            <Dropdown
              title="Sub Category*"
              disabled={
                (this.state.isRequestUpdate === true && !data.isSave) === true
                  ? true
                  : false
              }
              forwardedRef={this.subCategoryRef}
              dropDownData={
                this.state.isdNewSubCategoryArray.length === 0
                  ? this.state.isdSubCategoryArray.map((value) => value.Display)
                  : this.state.isdNewSubCategoryArray.map(
                      (value) => value.Display
                    )
              }
              dropDownCallBack={(index, value) =>
                this.onSubCategorySelection(index, value)
              }
            />
            <Dropdown
              title="Priority*"
              disabled={
                (this.state.isRequestUpdate === true && !data.isSave) === true
                  ? true
                  : false
              }
              forwardedRef={this.priorityRef}
              dropDownData={this.state.isdPriorityArray.map(
                (value) => value.Display
              )}
              dropDownCallBack={(index, value) =>
                this.onPrioritySelection(index, value)
              }
            />
            <Dropdown
              title="Office/Building Location*"
              disabled={
                (this.state.isRequestUpdate === true && !data.isSave) === true
                  ? true
                  : false
              }
              forwardedRef={this.locationRef}
              dropDownData={this.state.isdLocationArray.map(
                (value) => value.Display
              )}
              dropDownCallBack={(index, value) =>
                this.onLocationSelection(index, value)
              }
            />
            {this.state.isLocationOthers ? (
              <LabelEditText
                isEditable={
                  (this.state.isRequestUpdate === true && !data.isSave) === true
                    ? false
                    : true
                }
                myValue={this.state.locationOthersInput}
                onTextChanged={this.onLocationOthersChanged}
                onFocusView={this.onLocationOthersFocus}
              />
            ) : null}
            {this.state.seatNumberFlag != 0 ? (
              <LabelEditText
                isEditable={
                  (this.state.isRequestUpdate === true && !data.isSave) === true
                    ? false
                    : true
                }
                heading={
                  this.state.seatNumberFlag == 1
                    ? constants.SEAT_NUMBER_TEXT
                    : constants.SEAT_NUMBER_TEXT + constants.ASTERISK_SYMBOL
                }
                onTextChanged={this.onSeatNoChanged}
                myValue={this.state.seatNumberInput}
                onFocusView={this.onSeatNoFocus}
              />
            ) : null}
            {this.state.ipAddressFlag != 0 ? (
              <LabelEditText
                isEditable={
                  (this.state.isRequestUpdate === true && !data.isSave) === true
                    ? false
                    : true
                }
                heading={
                  this.state.ipAddressFlag == 1
                    ? constants.IP_TEXT
                    : constants.IP_TEXT + constants.ASTERISK_SYMBOL
                }
                onTextChanged={this.onIPChanged}
                myValue={this.state.ipAddressInput}
                onFocusView={this.onIPFocus}
              />
            ) : null}
            {(this.state.witNessFlag &&
              data.isSave === false &&
              this.state.isRequestUpdate === false) ||
            (this.state.witNessFlag &&
              data.isSave === true &&
              this.state.isRequestUpdate === true) ? (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={{ fontWeight: "bold", flex: 1 }}>
                  {this.state.witNessFlag === "M" ? "Witness*" : "Witness"}
                </Text>
                <TouchableOpacity
                  style={{ flex: 1 }}
                  onPress={() => {
                    this.setState({ witnessVisible: true });
                  }}
                >
                  <Text style={styles.hyperLink}>
                    {this.state.witnessQuery !== "" &&
                    this.state.witnessQuery !== null
                      ? this.state.witnessQuery
                      : "Select Witness"}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : this.state.witNessFlag &&
              !data.isSave &&
              this.state.isRequestUpdate === true ? (
              <LabelEditText
                isEditable={false}
                heading={
                  this.state.witNessFlag === "M" ? "Witness*" : "Witness"
                }
                myValue={data.witness} // Need to update later
              />
            ) : null}
            {this.state.thirdWitnessFlag ? (
              <LabelEditText
                isEditable={
                  (this.state.isRequestUpdate === true && !data.isSave) === true
                    ? false
                    : true
                }
                heading={
                  this.state.thirdWitnessFlag === "M"
                    ? "Third Party Witness*"
                    : "Third Party Witness"
                }
                placeHolder="Third Party Witness"
                onTextChanged={(text) => this.onThirdWitnessChanged(text)}
                myValue={this.state.thirdWitnessInput}
              />
            ) : null}

            {this.state.incidentDateFlag ? (
              <DatePicker
                myDatePickerVisible={this.state.showIncidentCalendar}
                heading={
                  this.state.incidentDateFlag === "M"
                    ? "Incident Date*"
                    : "Incident Date"
                }
                myDateValue={this.state.incidentDate}
                showMyCalendar={this.showIncidentCalendar}
                handleConfirm={(date) => this.incidentDateConfirm(date)}
                hideDatePicker={this.hideIncidentCalendar}
                myMaxDate={moment(new Date(), "DD-MM-YYYY").toDate()}
              />
            ) : null}

            {this.state.assetCodeFlag != 0 ? (
              <LabelEditText
                isEditable={
                  (this.state.isRequestUpdate === true && !data.isSave) === true
                    ? false
                    : true
                }
                heading={
                  this.state.assetCodeFlag == 1
                    ? constants.ASSET_CODE_TEXT
                    : constants.ASSET_CODE_TEXT + constants.ASTERISK_SYMBOL
                }
                onTextChanged={this.onAssetCodeChanged}
                myValue={this.state.assetCodeInput}
                onFocusView={this.onAssetCodeFocus}
              />
            ) : null}
            <LabelEditText
              isEditable={
                (this.state.isRequestUpdate === true && !data.isSave) === true
                  ? false
                  : true
              }
              heading="Description*"
              placeHolder="Min 25 & Max 4000 Characters"
              myMaxLength={4000}
              myNumberOfLines={3}
              myValue={this.state.descriptionInput}
              isMultiline={true}
              onTextChanged={this.onDescriptionChanged}
              onFocusView={this.onDescriptionFocus}
            />
            {this.state.durationApplicableFlag != 0 &&
            this.state.subCategoryName !== "Access Card Lost" ? (
              <RadioForms
                disable={
                  (this.state.isRequestUpdate === true && !data.isSave) === true
                    ? true
                    : false
                }
                forwardedRef={this._durationRef}
                selectedVal={this.state.durationIndex}
                onValueSelection={(val) => this.onDurationSelection(val + 1)}
                labelHorizontal={true}
                title={
                  this.state.durationApplicableFlag == 1
                    ? constants.DURATION_TEXT
                    : constants.DURATION_TEXT + constants.ASTERISK_SYMBOL
                }
                options={constants.DURATION_TYPES}
              />
            ) : null}
            {this.state.durationIndex > 0 ? (
              <View>
                <DatePicker
                  myDatePickerVisible={this.state.showStartCalendar}
                  heading="From Date*"
                  myDateValue={this.state.durationFromDateValue}
                  myCalenderSelectedDate={moment(
                    this.state.durationFromDateValue,
                    "DD-MM-YYYY"
                  ).toDate()}
                  myMinDate={moment().toDate()}
                  showMyCalendar={this.showStartCalendar}
                  handleConfirm={(date) => this.handleStartDateConfirm(date)}
                  hideDatePicker={this.hideStartDatePicker}
                />
                <DatePicker
                  myDatePickerVisible={this.state.showEndCalendar}
                  heading="To Date*"
                  myDateValue={this.state.durationEndDateValue}
                  myCalenderSelectedDate={moment(
                    this.state.durationEndDateValue,
                    "DD-MM-YYYY"
                  ).toDate()}
                  myMinDate={this.state.durationEndDateMinValue}
                  myMaxDate={this.state.durationEndDateMaxValue}
                  showMyCalendar={this.showEndCalendar}
                  handleConfirm={(date) => this.handleEndDateConfirm(date)}
                  hideDatePicker={this.hideEndDatePicker}
                />
              </View>
            ) : null}
            {this.state.serviceTypeIndex === 2 ? (
              <RadioForms
                disable={
                  (this.state.isRequestUpdate === true && !data.isSave) === true
                    ? true
                    : false
                }
                forwardedRef={this.mangerLeaveRef}
                selectedVal={this.state.managerOnLeaveIndex}
                onValueSelection={(val) => this.onManagerOnLeaveSelection(val)}
                labelHorizontal={true}
                title="Is Manager on Leave"
                options={constants.MANAGER_ON_LEAVE_TYPES}
              />
            ) : null}
            {this.state.serviceTypeIndex === 2 ? (
              <LabelEditText
                heading="Manager Name"
                isEditable={false}
                myNumberOfLines={2}
                isMultiline={true}
                myValue={
                  this.state.managerOnLeaveIndex === 0
                    ? this.state.isdDefaultDataArray.ManagerName
                    : this.state.isdDefaultDataArray.ReviewingManagerName
                }
              />
            ) : null}
            <AttachmentView
              heading="Attachment"
              files={data.lstISDFiles}
              disable={
                (this.state.isRequestUpdate === true && !data.isSave) === true
                  ? true
                  : false
              }
            />
            {data && data.HistoryNotes && data.HistoryNotes.length > 0 ? (
              <LabelTextDashValue
                hyperLink={true}
                onHyperLinkClick={() => this.showHistory()}
                heading="History"
                description="View History"
              />
            ) : null}
          </View>
        ) : null}
        <DialogButtons
          title="History"
          onDialogClose={() => this.onDialogClose()}
          visible={this.state.dialogContainerVisible}
        >
          <FlatList
            data={data.HistoryNotes}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) =>
              this.renderHistoryButton(item, index)
            }
            keyExtractor={(item, index) => "history_" + index.toString()}
          />
        </DialogButtons>
        {data.isSave === false && this.state.isRequestUpdate === true ? (
          timeElapsedReopen < 72 &&
          data.RequesterCode == this.props.empCode &&
          ((data.RequestStatus == 5 &&
            ((data.RequestType == 1 || data.RequestType == 3) &&
              data.StageId != 5)) ||
            (data.RequestStatus == 5 &&
              (data.RequestType == 2 && data.StageId != 6))) ? (
            <View>
              <LabelEditText
                heading="Reopen Remarks"
                placeHolder="Reopen remarks"
                myNumberOfLines={3}
                isMultiline={true}
                onTextChanged={this.onReOpenRemarks}
              />
              <View style={styles.remarksButtonHolder}>
                <CustomButton
                  label={constants.REOPEN}
                  positive={true}
                  performAction={() => this.onSubmitReopenRemarks(data)}
                />
              </View>
            </View>
          ) : (data.RequestStatus !== 5 &&
              ((data.RequestType == 1 || data.RequestType == 3) &&
                data.StageId != 5)) ||
            (data.RequestStatus !== 5 &&
              (data.RequestType == 2 && data.StageId != 6)) ? (
            <View>
              <LabelEditText
                heading="Additional Remarks"
                placeHolder="Input your additional remarks if any ."
                myNumberOfLines={3}
                isMultiline={true}
                onTextChanged={this.onAdditionalRemarks}
              />
              <View style={styles.remarksButtonHolder}>
                <CustomButton
                  label={constants.SUBMIT_REMARKS}
                  positive={true}
                  performAction={() => this.onSubmitAdditionalRemarks(data)}
                />
              </View>
            </View>
          ) : null
        ) : (
          <View style={styles.bottomButtonView}>
            <View style={styles.bottomButtonInnerView}>
              <CustomButton
                label={constants.SAVE_TEXT}
                positive={true}
                performAction={() => this.onSubmitOrSave(constants.SAVE_TEXT)}
              />
            </View>
            <View style={styles.bottomButtonInnerView}>
              <CustomButton
                label={constants.SUBMIT_TEXT}
                positive={true}
                performAction={() => this.onSubmitOrSave(constants.SUBMIT_TEXT)}
              />
            </View>
          </View>
        )}
      </View>
    );
  };

  backNavigate = () => {
    writeLog(
      "Clicked on " + "backNavigate" + " of " + "Create Incident/SR Screen"
    );
    this.setState(
      { isPopUp: false, popUpHeading: "", popUpMessage: "" },
      () => {
        this.props.navigation.navigate("ITDeskDashBoard");
      }
    );
  };

  showPopUp = () => {
    return (
      <UserMessage
        modalVisible={true}
        heading={this.state.popUpHeading}
        message={this.state.popUpMessage}
        okAction={() => {
          this.setState({ isPopUp: false }, () => {
            if (this.state.popUpHeading.includes("Error")) {
              helper.onOkAfterError(this);
            } else {
              console.log("ISD SAVE DATA : ", this.props.isdSaveData);
              if (
                this.state.requestClosed ||
                this.state.popUpHeading === "Remarks Submitted"
              ) {
                this.handleBack();
              } else if (
                this.props.isdSaveData &&
                this.props.isdSaveData.includes("_")
              ) {
                this.setState(
                  { requestID: this.props.isdSaveData.split("_")[0] },
                  () => {
                    console.log("Request ID saved is : ", this.state.requestID);
                  }
                );
              }
            }
          });
        }}
      />
    );
  };
  modalClose = () => {
    this.setState({ onBehalfVisible: false, witnessVisible: false });
  };

  showFeedbackView = () => {
    if (!this.state.isFeedBackShown) {
      this.setState({ isFeedBackShown: true }, async () => {
        let response = await getISD_SurveyQuestions();
        if (response && response.length > 0) {
          this.setState({ feedVisible: true, isd_surveyData: response[0] });
        }
      });
    }
  };
  optionClick = (item, i) => {
    let myOptionValue = optionIndexToValue(i);
    selectedOptionArr[this.state.questionIndex] = item.value;
    this.setState({
      selectedOptionArray: selectedOptionArr,
      optionIndex: i,
      currentSelectedIndex: myOptionValue,
    });
  };
  renderOptionView = (item, i) => {
    return (
      <TouchableOpacity onPress={() => this.optionClick(item, i)}>
        <View
          style={[
            styles.item,
            {
              backgroundColor:
                i === this.state.optionIndex
                  ? appConfig.DARK_BLUISH_COLOR
                  : appConfig.LOGIN_FIELDS_BACKGROUND_COLOR,
            },
          ]}
        >
          <Text> {item.title} </Text>
          {i === 0 || i === 4 ? (
            <View style={styles.buttonsContainer}>
              <Image source={item.image} />
              <Image source={item.image} />
              <Image source={item.image} />
            </View>
          ) : i == 1 || i == 2 ? (
            <View style={styles.buttonsContainer}>
              <Image source={item.image} />
              <Image source={item.image} />
            </View>
          ) : (
            <Image source={item.image} />
          )}
        </View>
      </TouchableOpacity>
    );
  };
  // manageIndex = () => {
  //   let answerArray = this.state.isd_surveyData.Answer;
  //   let selectedOptions = this.state.selectedOptionArray;
  //   if (selectedOptions.length > 0) {
  //     let value = selectedOptions[this.state.questionIndex];
  //     console.log("value managerIndex===>", value);
  //     let requiredIndex = answerArray.findIndex((item) => item.Value == value);
  //     this.setState({ optionIndex: requiredIndex });
  //   }
  // };
  changeQuestion = async (action) => {
    console.log("Action fired ", action);
    if (action == "NEXT") {
      this.setState(
        { questionIndex: this.state.questionIndex + 1, optionIndex: "" },
        () => {
          this.manageIndex();
        }
      );
    } else if (action == "PREVIOUS") {
      this.setState(
        { questionIndex: this.state.questionIndex - 1, optionIndex: "" },
        () => {
          this.manageIndex();
        }
      );
    } else if (action == "SUBMIT") {
      let answerArray = this.state.isd_surveyData.Answer;
      let selectedOptions = this.state.selectedOptionArray;
      let questionArray = this.state.isd_surveyData.Question;
      let empCode = this.props.empCode;
      let authKey = this.props.accessToken;

      console.log("Selected option array : ", selectedOptions);
      console.log("Selected answer Array  : ", answerArray);
      console.log("Question  Array  : ", questionArray);

      let data = {};
      let questArray = [];
      data.Type = 0;
      data.LoggedInEmpCode = empCode;
      data.ModelXML = null;
      data.OUTPUT = null;
      questionArray.map((quest, index) => {
        let questData = {};
        questData.QuestionID = index + 1;
        questData.EmpCode = empCode;
        questData.AnswerId = selectedOptions[index];
        questData.RequestId = this.props.navigation.state.params.dataToUpdate.RequestID;
        questArray.push(questData);
      });
      data.lstQuestionAnswers = questArray;
      console.log("Data to send :", data);
      let submitResponse = await submitIsdSuveryQuestions(data);
      console.log("Submit response in screen is : ", submitResponse[0].message);
      if (submitResponse[0].message == "Success") {
        this.setState({ feedVisible: false }, () => {
          setTimeout(() => {
            showToast(submitResponse[0].message);
          }, 1000);
        });
      }
    }
  };
  questionView = (qIndex) => {
    return (
      <Text
        style={{
          paddingVertical: 10,
          borderRadius: 5,
          borderWidth: 1,
          borderColor: appConfig.GUN_METAL_COLOR,
          paddingHorizontal: 30,
          fontSize: 15,
          fontWeight: "bold",
        }}
      >
        {this.state.isd_surveyData.Question[qIndex].QuestionDesc + " ?"}
      </Text>
    );
  };
  answerView = () => {
    if (!_.isEmpty(this.state.isd_surveyData)) {
      return (
        <View
          style={{
            borderWidth: 1,
            borderColor: appConfig.GUN_METAL_COLOR,
            width: "100%",
            height: "70%",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 20,
            paddingVertical: 20,
            paddingHorizontal: 20,
            borderRadius: 8,
          }}
        >
          <FlatList
            data={constants.optionsArray}
            keyExtractor={(item, index) => "Option_" + index.toString()}
            renderItem={({ item, index }) => this.renderOptionView(item, index)}
            contentContainerStyle={{ marginTop: 20 }}
          />
          <View style={[styles.buttonsContainer, { marginTop: 20 }]}>
            <View style={[styles.button]}>
              {this.state.questionIndex !== 0 && (
                <CustomButton
                  label={constants.PREVIOUS_TEXT}
                  positive={true}
                  performAction={() =>
                    this.changeQuestion(constants.PREVIOUS_TEXT)
                  }
                />
              )}
            </View>
            <View style={styles.button}>
              <CustomButton
                label={
                  this.state.questionIndex ==
                  this.state.isd_surveyData.Question.length - 1
                    ? constants.SUBMIT
                    : constants.NEXT_TEXT
                }
                positive={true}
                performAction={() =>
                  this.changeQuestion(
                    this.state.questionIndex ==
                      this.state.isd_surveyData.Question.length - 1
                      ? constants.SUBMIT
                      : constants.NEXT_TEXT
                  )
                }
              />
            </View>
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: appConfig.INVALID_BUTTON_COLOR,
              borderRadius: 7,
              marginTop: 10,
            }}
            onPress={() => this.setState({ feedVisible: false })}
          >
            <Text
              style={{
                textAlign: "center",
                paddingHorizontal: 60,
                paddingVertical: 13,
                color: "#fff",
                fontSize: 16,
              }}
            >
              CLOSE
            </Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return null;
    }
  };
  feedBackView = () => {
    return (
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.feedVisible}
          onRequestClose={() => {
            this.setState({ feedVisible: false });
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              {!_.isEmpty(this.state.isd_surveyData) &&
                this.questionView(this.state.questionIndex)}
              {this.answerView()}
            </View>
          </View>
        </Modal>
      </View>
    );
  };

  updateSearch = (searchText) => {
    this.setState(
      {
        query: searchText,
      },
      () => {
        const filteredData = this.props.searchData.filter((element) => {
          let str1 = element.EmpCode.trim();
          let str2 = element.EmpName.trim();
          let searchedText = str1.concat(str2);
          let elementSearched = searchedText.toString().toLowerCase();
          let queryLowerCase = this.state.query.toString().toLowerCase();
          return elementSearched.indexOf(queryLowerCase) > -1;
        });
        console.log("Search Query : ", this.state.query);
        console.log("Fileterd data : ", filteredData);
        this.setState({
          localOnBehalfSearchData: filteredData,
        });
      }
    );
  };
  pickEmployee = (empData) => {
    console.log("Emp Data :", empData);
    this.setState({ query: "" }, () => {
      if (this.state.onBehalfVisible) {
        this.setState({ onBehalfVisible: false }, () => {
          setTimeout(() => {
            this.props.updateRequestorDetailsISD(empData.EmpCode);
          }, 500);
        });
      } else {
        this.setState({ witnessVisible: false, witnessQuery: empData.EmpName });
      }
    });
  };
  render() {
    let data =
      (this.props.isdDataForUpdate && this.props.isdDataForUpdate.length) > 0
        ? this.props.isdDataForUpdate[0]
        : this.state.isdDefaultDataArray;
    return (
      <ImageBackground style={{ flex: 1 }} source={images.loginBackground}>
        <View style={styles.container}>
          <View style={globalFontStyle.subHeaderViewGlobal}>
            <SubHeader
              pageTitle={
                this.state.isRequestUpdate
                  ? globalConstants.UPDATE_REQUEST_IT_TITLE
                  : globalConstants.CREATE_REQUEST_IT_TITLE
              }
              backVisible={true}
              logoutVisible={true}
              handleBackPress={() => this.onBack()}
              navigation={this.props.navigation}
            />
          </View>
          <KeyboardAwareScrollView keyboardShouldPersistTaps="never">
            {this.formView()}
            <HistoryView
              historyData={this.state.historyItem}
              forwardedRef={this._panel}
              isComingFromVoucher={false}
              visibility={this.state.historyItem.length > 0}
              onClose={() => this.onPanelClose()}
            />
            {/* {this.state.historyItem.length > 0 ? <HistoryView onClose={() => this.onPanelClose()} historyData={this.state.historyItem} forwardedRef={this._panel} isComingFromVoucher={false} /> : null} */}
          </KeyboardAwareScrollView>
          {this.state.isPopUp === true ? this.showPopUp() : null}
          <ActivityIndicatorView loader={this.props.isdLoading} />
          <ActivityIndicatorView loader={this.state.browseLoading} />
          <EmployeeSearchView
            query={this.state.query}
            visibility={
              this.state.onBehalfVisible === true
                ? this.state.onBehalfVisible
                : this.state.witnessVisible
            }
            closeCallBack={() => {
              this.modalClose();
            }}
            search={() => this.updateSearch}
            empData={
              this.state.query.length > 0 &&
              this.state.localOnBehalfSearchData.length > 0
                ? this.state.localOnBehalfSearchData
                : this.props.searchData
            }
            pickEmployee={(empData) => {
              this.pickEmployee(empData);
            }}
          />
          {/* {data.RequestStatus == 5 && data.IsSurveyDone == 0 && this.state.isFeedBackShown && data.RequesterCode==this.props.empCode && this.feedBackView()} */}
        </View>
      </ImageBackground>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    searchData: state.leaveApplyReducer.empData,
    empCode:
      state.loginReducer.loginData !== undefined
        ? state.loginReducer.loginData.SmCode
        : "",
    accessToken:
      state.loginReducer.loginData !== undefined
        ? state.loginReducer.loginData.Authkey
        : "",
    isdDefaultData: state.isdCreateRequestReducer.isdDefaultData,
    isdLoading: state.isdCreateRequestReducer.isdLoader,
    isdDefaultError: state.isdCreateRequestReducer.isdDefaultError,
    isdServiceTypeData: state.isdCreateRequestReducer.isdServiceTypeData,
    isdServiceTypeError: state.isdCreateRequestReducer.isdServiceTypeError,
    isdSaveData: state.isdCreateRequestReducer.isdSaveData,
    isdSaveError: state.isdCreateRequestReducer.isdSaveError,
    isdFileResponseError: state.isdCreateRequestReducer.isdFileResponseError,
    isdSearchEmployeeData: state.isdCreateRequestReducer.isdSearchEmployeeData,
    isdSearchEmployeeError:
      state.isdCreateRequestReducer.isdSearchEmployeeError,
    isdDataForUpdate:
      state &&
      state.isdCreateRequestReducer &&
      state.isdCreateRequestReducer.isdDataToUpdate,
    additionalRemarks:
      state &&
      state.isdCreateRequestReducer &&
      state.isdCreateRequestReducer.additionalRemarks,
  };
};
const today = moment();
const disableFutureDt = (current) => {
  return current.isBefore(today);
};
const mapDispatchToProps = (dispatch) => {
  return {
    resetISDCreateScreen: () => dispatch(isdResetCreateScreen()),
    fetchISDDefaultData: (empCode, authToken, recordUpdateCallBack) =>
      dispatch(isdFetchDefaultData(empCode, authToken, recordUpdateCallBack)),
    fetchISDServiceTypeData: (empCode, authToken, type) =>
      dispatch(isdFetchServiceTypeData(empCode, authToken, type)),
    saveOrSubmitISD: (record) => dispatch(isdSaveOrSubmit(record)),
    autoCompleteEmployeeISD: (term) => dispatch(isdAutoCompleteEmployee(term)),
    updateRequestorDetailsISD: (requestorID) =>
      dispatch(isdUpdateRequestorDetails(requestorID)),
    fetchPreviousRecordsToUpdate: (
      empCode,
      authToken,
      requestID,
      requestFrom,
      teamID,
      Type,
      updateScreenCallBack
    ) =>
      dispatch(
        previousRecordsToUpdate(
          empCode,
          authToken,
          requestID,
          requestFrom,
          teamID,
          Type,
          updateScreenCallBack
        )
      ),
    submitAdditionalRemarks: (empCode, authToken, requestID, remarks) =>
      dispatch(
        submitAdditionalRemarksAction(empCode, authToken, requestID, remarks)
      ),
    submitReopenRemarks: (empCode, authToken, requestID, reOpenRemarks) =>
      dispatch(submitRemarksOpen(empCode, authToken, requestID, reOpenRemarks)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateRequestScreen);

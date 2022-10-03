import React, { Component } from "react";
import {
  View,
  Text,
  Keyboard,
  Platform,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Alert,
} from "react-native";
import { connect } from "react-redux";
import { DismissKeyboardView } from "../../components/DismissKeyboardView";
import { styles } from "./styles";
import {
  fetchRequestorList,
  resetApprover,
  completeRequest,
  resetTravelAdvanceStore,
} from "./travelAdvanceAction";
import SubHeader from "../../GlobalComponent/SubHeader";
import UserMessage from "../../components/userMessage";
import ActivityIndicatorView from "../../GlobalComponent/myActivityIndicator";
import CustomButton from "../../components/customButton";
import { Icon, SearchBar } from "react-native-elements";
import ModalDropdown from "react-native-modal-dropdown";
import helper from "../../utilities/helper";
import { globalFontStyle } from "../../components/globalFontStyle.js";
let globalConstants = require("../../GlobalConstants");
let constants = require("./constants");
import { writeLog } from "../../utilities/logger";
import { WHITE_COLOR } from "../../../appconfig";
import images from "../../images";
export class TravelAdvanceApproveRejectScreen extends Component {
  constructor(props) {
    super(props);
    previousScreenData = this.props.navigation.state.params;
    (empData = previousScreenData.employeeDetails),
      (action = previousScreenData.action),
      (isDomesticRequest = previousScreenData.isDTRService),
      (this.state = {
        remarks: "",
        submitTo: "Select",
        query: "",
        localSuperVisorData: [],
        localSuperVisorSearchList: [],
        showModal: false,
        messageType: null,
        approverEmpName: "",
        approverEmpId: "",
        isAlertMessage: "",
      });
  }
  componentDidMount() {
    writeLog("Landed on " + "TravelAdvanceApproveRejectScreen");
  }
  componentWillUnmount() {
    this.props.resetSupervisor();
  }

  static getDerivedStateFromProps(nextProps, state) {
    // console.log("nextProps travel advance::::",nextProps)
    // console.log("state travel advance:::::",state)
    if (
      nextProps.travelAdvanceApproverData &&
      !state.query.length > 0 &&
      nextProps.travelAdvanceActionResponse == "" &&
      nextProps.travelAdvanceActionError == ""
    ) {
      return {
        localSuperVisorData: nextProps.travelAdvanceApproverData,
        localSuperVisorSearchList: nextProps.travelAdvanceApproverData,
      };
    } else {
      return null;
    }
  }
  componentDidUpdate() {
    if (
      this.props.travelAdvanceActionResponse === "Success" &&
      this.state.isAlertMessage === ""
    ) {
      setTimeout(() => {
        this.setState({
          showModal: true,
          messageType: 0,
          isAlertMessage: this.props.travelAdvanceActionResponse,
        });
      }, 1000);
    } else if (
      this.props.travelAdvanceActionError.length > 0 &&
      this.state.isAlertMessage === ""
    ) {
      setTimeout(() => {
        this.setState({
          showModal: true,
          messageType: 1,
          isAlertMessage: this.props.travelAdvanceActionError,
        });
      }, 1000);
    }
  }
  handleBack() {
    writeLog(
      "Clicked on " + "handleBack" + " of " + "TravelAdvanceApproveRejectScreen"
    );
    this.props.navigation.pop();
  }

  userDetailGridView = (itemName, itemValue) => {
    if (itemValue != "" && itemValue != undefined && itemValue != null) {
      return (
        <View style={styles.rowStyle}>
          <Text style={[styles.textOne, globalFontStyle.imageBackgroundLayout]}>
            {itemName}
          </Text>
          <Text style={[styles.textTwo, globalFontStyle.imageBackgroundLayout]}>
            {itemValue}
          </Text>
        </View>
      );
    } else {
      return null;
    }
  };

  userDetail = (empData) => {
    let deptDate = empData.DeptDate.replace(/-/g, " ");
    let returnDate = empData.ReturnDate.replace(/-/g, " ");
    return (
      <View style={styles.userDetailStyle}>
        <ImageBackground style={styles.cardBackground} resizeMode="cover">
          <View style={styles.cardStyle}>
            {this.userDetailGridView(
              globalConstants.DOCUMENT_NUMBER_TEXT,
              empData.DocumentNo.trim()
            )}
            {this.userDetailGridView(
              globalConstants.EMPLOYEE_TEXT,
              empData.DocOwnerCode.trim() + " : " + empData.DocOwnerName.trim()
            )}
            {this.userDetailGridView(
              constants.ITINERARY_TEXT,
              empData.Itinerary.trim()
            )}
            {this.userDetailGridView(constants.DEP_DATE_TEXT, deptDate)}
            {this.userDetailGridView(
              constants.EXP_DATE_OF_RETURN_TEXT,
              returnDate
            )}
            {this.userDetailGridView(
              constants.VISIT_TYPE_TEXT,
              empData.VisitType
            )}
          </View>
        </ImageBackground>
      </View>
    );
  };

  rejectReq = () => {
    let MyRemarks = this.state.remarks.trim();
    let actionValue = action === globalConstants.APPROVED_TEXT ? "A" : "R";
    if (MyRemarks === "") {
      return alert("Please enter remarks!!");
    }
    writeLog(
      "Invoked " +
        "rejectReq" +
        " of " +
        "TravelAdvanceApproveRejectScreen" +
        " for " +
        action
    );
    this.props.completeRequest(
      isDomesticRequest,
      empData,
      actionValue,
      "",
      MyRemarks
    );
  };

  renderRemarks = () => {
    return (
      <View style={styles.remarksParent}>
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          autoCompleteType={false}
          multiline={true}
          maxLength={200}
          onChangeText={(text) => this.setState({ remarks: text })}
          value={this.state.remarks}
          placeholder="Remarks"
          style={styles.textInputStyle}
        />
      </View>
    );
  };

  showRemarksAndRejectButton = () => {
    return (
      <View>
        {this.renderRemarks()}
        <View style={styles.rejectContainer}>
          <TouchableOpacity
            onPress={() => this.rejectReq()}
            style={styles.negativeButton}
          >
            <Text style={styles.rejectButtonText}>
              {globalConstants.REJECT_CAPS_TEXT}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  onApproverSelection = (approver) => {
    writeLog(
      "Invoked " +
        "onApproverSelection" +
        " of " +
        "TravelAdvanceApproveRejectScreen" +
        " for " +
        approver
    );
    if (approver === "Supervisor") {
      this.props.getSelectedRequestorList(empData, "s", isDomesticRequest);
    } else {
      this.props.getSelectedRequestorList(empData, "T", isDomesticRequest);
    }
  };

  onSelection = (index, value) => {
    this.setState(
      {
        submitTo: value,
        approverEmpName: "",
      },
      () => {
        this.onApproverSelection(value);
      }
    );
  };

  showPicker = () => {
    let selectors = ["Supervisor", "Travel Desk"];
    return (
      <View style={styles.dropDownContainer}>
        <Text>{globalConstants.SUBMIT_TO_TEXT}</Text>
        <View style={styles.pickerBox}>
          <View style={styles.dropIcon}>
            <ModalDropdown
              ref={this.submitRef}
              options={selectors}
              defaultValue={this.state.submitTo}
              style={styles.pickerObject}
              textStyle={styles.pickerTextStyle}
              dropdownStyle={styles.dropdownStyle}
              dropdownTextStyle={styles.dropdownTextStyle}
              onSelect={(index, value) => this.onSelection(index, value)}
            >
              <View style={globalFontStyle.dropDownView}>
                <View style={globalFontStyle.dropDownInnerView}>
                  <Text style={globalFontStyle.dropDownText1}>
                    {this.state.submitTo}
                  </Text>
                </View>
                <Icon
                  style={{ flex: 1 }}
                  name="arrow-drop-down"
                  size={30}
                  color={WHITE_COLOR}
                />
              </View>
            </ModalDropdown>
            {/* <Icon name="arrow-drop-down" size={30} color={'white'} /> */}
          </View>
        </View>
      </View>
    );
  };

  updateSearch = (searchText) => {
    this.setState(
      {
        query: searchText,
      },
      () => {
        const filteredData = this.state.localSuperVisorSearchList.filter(
          (element) => {
            let elementSearched = element.EmpName.toLowerCase();
            let queryLowerCase = this.state.query.toLowerCase();
            return elementSearched.indexOf(queryLowerCase) > -1;
          }
        );
        this.setState({
          localSuperVisorData: filteredData,
        });
      }
    );
  };

  renderSearch = () => {
    const { query } = this.state;
    return (
      <SearchBar
        lightTheme
        placeholder={globalConstants.SEARCH_PLACEHOLDER_TEXT}
        onChangeText={this.updateSearch}
        value={query}
        raised={true}
        containerStyle={styles.searchBar}
        autoCapitalize="none"
        autoCompleteType="off"
        autoCorrect={false}
      />
    );
  };

  onSupervisorSelection = (supervisor) => {
    this.props.resetSupervisor();
    this.setState({
      approverEmpName: supervisor.EmpName,
      approverEmpId: supervisor.EmpCode,
      query: "",
    });
  };

  renderSuperVisors = (item, index) => {
    return (
      <TouchableOpacity
        onPress={() => this.onSupervisorSelection(item)}
        style={styles.listItem}
      >
        <Text>{item.EmpName}</Text>
        <View style={styles.supervisorSeparator} />
      </TouchableOpacity>
    );
  };

  showRequests = () => {
    if (this.state.localSuperVisorData.length > 0) {
      // console.log("this.state.localSuperVisorData",this.state.localSuperVisorData)
      let data = this.state.localSuperVisorData.sort(
        (a, b) => a.EmpCode - b.EmpCode
      );
      return (
        <FlatList
          data={data}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => this.renderSuperVisors(item, index)}
          keyExtractor={(item, index) =>
            "supervisorRequest_" + index.toString()
          }
        />
      );
    } else {
      return null;
    }
  };

  submitRequest = () => {
    writeLog(
      "Invoked " +
        "submitRequest" +
        " of " +
        "TravelAdvanceApproveRejectScreen" +
        " for " +
        this.state.submitTo
    );
    let MyRemarks = this.state.remarks.trim();
    let actionValue = action === globalConstants.APPROVED_TEXT ? "A" : "R";
    if (MyRemarks === "") {
      return alert("Please enter remarks!!");
    }

    if (this.state.submitTo === "Travel Desk") {
      this.props.completeRequest(
        isDomesticRequest,
        empData,
        actionValue,
        this.state.approverEmpId,
        MyRemarks
      );
    } else {
      this.props.completeRequest(
        isDomesticRequest,
        empData,
        actionValue,
        this.state.approverEmpId,
        MyRemarks
      );
    }
  };

  displayApproverName = () => {
    if (
      this.state.approverEmpName != "" &&
      (this.state.submitTo === "Travel Desk" ||
        this.state.submitTo === "Supervisor")
    ) {
      return (
        <View>
          <View style={styles.remarksParent}>
            <Text style={styles.approverText}>
              {this.state.approverEmpName}
            </Text>
          </View>
          {this.renderRemarks()}
          <TouchableOpacity
            style={styles.submitButtonView}
            onPress={() => this.submitRequest()}
          >
            <Text style={styles.submitButtonText}>
              {globalConstants.APPROVE_CAPS_TEXT}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
  };

  backNavigate() {
    writeLog(
      "Clicked on " +
        "backNavigate" +
        " of " +
        "TravelAdvanceApproveRejectScreen"
    );
    this.props.navigation.navigate("DashBoard");
  }

  showDialogBox = () => {
    let message = "";
    let heading = "";
    if (this.state.showModal) {
      if (this.state.messageType === 0) {
        message = "Your request has been ";
        message = action != undefined ? message + action.toLowerCase() : "";
        heading = "Successful";
        return (
          <UserMessage
            heading={heading}
            message={message}
            okAction={() => {
              this.props.resetTravelAdvance();
              this.setState({ showModal: false, isAlertMessage: "" }, () => {
                this.backNavigate();
              });
            }}
          />
        );
      } else {
        // console.log("In side show error of Travel Advance screen.");
        return (
          <UserMessage
            heading="Error"
            message={this.props.travelAdvanceActionError}
            okAction={() => {
              this.props.resetTravelAdvance();
              this.setState({ showModal: false, isAlertMessage: "" }, () => {
                this.backNavigate();
              });
            }}
          />
        );
      }
    }
  };

  render() {
    return (
      <ImageBackground style={{ flex: 1 }} source={images.loginBackground}>
        <DismissKeyboardView style={styles.container}>
          <SubHeader
            pageTitle={
              isDomesticRequest
                ? globalConstants.TRAVEL_ADVANCE_DOMESTIC_ACTION_TITLE
                : globalConstants.TRAVEL_ADVANCE_INTERNATIONAL_ACTION_TITLE
            }
            backVisible={true}
            logoutVisible={true}
            handleBackPress={() => this.handleBack()}
            navigation={this.props.navigation}
          />
          <ActivityIndicatorView loader={this.props.travelAdvanceLoading} />
          {this.state.submitTo === "Select" ||
          this.state.submitTo === "Travel Desk" ||
          (this.state.approverEmpName != "" &&
            this.state.submitTo === "Supervisor")
            ? this.userDetail(empData)
            : null}
          {action === globalConstants.APPROVED_TEXT
            ? this.showPicker()
            : this.showRemarksAndRejectButton()}
          {this.state.submitTo === "Supervisor" &&
          this.state.approverEmpName === ""
            ? this.renderSearch()
            : null}
          <ScrollView
            keyboardShouldPersistTaps="handled"
            style={styles.scrollViewStyle}
            showsVerticalScrollIndicator={false}
          >
            {this.showRequests()}
            {this.displayApproverName()}
          </ScrollView>
          {this.state.showModal ? this.showDialogBox() : null}
        </DismissKeyboardView>
      </ImageBackground>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    travelAdvanceApproverData:
      state.travelAdvanceReducer.travelAdvanceApproverData,
    travelAdvanceActionResponse:
      state.travelAdvanceReducer.travelAdvanceActionResponse,
    travelAdvanceActionError:
      state.travelAdvanceReducer.travelAdvanceActionError,
    travelAdvanceLoading: state.travelAdvanceReducer.travelAdvanceLoader,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getSelectedRequestorList: (item, type, isDomesticRequest) =>
      dispatch(fetchRequestorList(item, type, isDomesticRequest)),
    resetSupervisor: () => dispatch(resetApprover()),
    resetTravelAdvance: () => dispatch(resetTravelAdvanceStore()),
    completeRequest: (
      isDomesticRequest,
      item,
      actionValue,
      approverEmpId,
      MyRemarks
    ) =>
      dispatch(
        completeRequest(
          isDomesticRequest,
          item,
          actionValue,
          approverEmpId,
          MyRemarks
        )
      ),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TravelAdvanceApproveRejectScreen);

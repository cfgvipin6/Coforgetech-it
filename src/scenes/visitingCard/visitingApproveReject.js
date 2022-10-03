import React, { Component } from "react";
import {
  Text,
  View,
  Alert,
  ImageBackground,
  ScrollView,
  FlatList,
  TouchableOpacity,
  TextInput,
  BackHandler,
  Platform,
} from "react-native";
import { styles } from "./styles";
import { connect } from "react-redux";
import { DismissKeyboardView } from "../../components/DismissKeyboardView";
import SubHeader from "../../GlobalComponent/SubHeader";
import { globalFontStyle } from "../../components/globalFontStyle";
import ModalDropdown from "react-native-modal-dropdown";
import { Icon, SearchBar } from "react-native-elements";
import UserMessage from "../../components/userMessage";
import {
  fetchSupervisorData,
  resetSupervisor,
  completeRequest,
} from "./visitingCardAction";
import helper from "../../utilities/helper";
import { writeLog } from "../../utilities/logger";
import { WHITE_COLOR } from "../../../appconfig";
import images from "../../images";
let constants = require("./constants");
let globalConstants = require("../../GlobalConstants");

class VisitingApproveRejectScreen extends Component {
  constructor(props) {
    super(props);
    previousScreenData = this.props.navigation.state.params;
    (empData = previousScreenData.employeeDetails),
      (action = previousScreenData.action),
      (this.state = {
        localSuperVisorData: [],
        localSuperVisorSearchList: [],
        submitTo: "Select",
        superVisorEmpName: "",
        superVisorEmpId: "",
        remarks: "",
        query: "",
        showModal: false,
        messageType: null,
        isPopUp: "",
      });
    this.submitRef = React.createRef();
  }

  componentWillUnmount() {
    this.props.resetSupervisor();
  }
  supervisorCallBack = (data) => {
    console.log("Data in supervisor call back : ", data);
    this.setState({
      localSuperVisorData: data,
      localSuperVisorSearchList: data,
    });
  };
  componentDidUpdate(prevState, prevProps) {
    if (prevProps.query != this.state.query) {
      if (this.state.query.length > 2) {
        this.props.fetchSuperVisorData(
          this.supervisorCallBack,
          this.state.query
        );
      }
    }
    if (
      this.state.query.length < 1 &&
      this.state.localSuperVisorData.length != 0
    ) {
      this.setState({
        localSuperVisorData: [],
        localSuperVisorSearchList: [],
      });
    }
    if (
      this.props.visitingActionResponse === "SUCCESS" &&
      this.props.visitingActionError.length === 0 &&
      this.state.isPopUp === ""
    ) {
      setTimeout(() => {
        this.setState({
          showModal: true,
          messageType: 0,
          isPopUp: this.props.visitingActionResponse,
        });
      }, 1000);
    } else if (
      this.props.visitingActionError &&
      this.props.visitingActionError.length > 0
    ) {
      setTimeout(() => {
        this.setState({
          showModal: true,
          messageType: 1,
          isPopUp: this.props.visitingActionError,
        });
      }, 1000);
    }
  }
  componentDidMount() {
    writeLog("Landed on " + "VisitingApproveRejectScreen");
  }
  onFocus = () => {
    if (this.submitRef.current != null) {
      this.submitRef.current.select(-1);
    }
  };

  handleBack = () => {
    writeLog(
      "Clicked on " + "handleBack" + " of " + "VisitingApproveRejectScreen"
    );
    this.props.navigation.pop();
  };

  showVisitingUserDetails = () => {
    return (
      <View style={styles.cardOuterView}>
        <ImageBackground style={styles.cardBackground} resizeMode="cover">
          <View style={styles.view_One}>
            {this.showVisitingRowGrid(
              constants.DOCUMENT_NUMBER_TEXT,
              empData.in_request_no.Value.trim()
            )}
            {this.showVisitingRowGrid(
              constants.EMPLOYEE_TEXT,
              empData.NAME.Value.trim()
            )}
            {this.showVisitingRowGrid(
              constants.DESIGNATION_TEXT,
              empData.vc_designation.Value.trim()
            )}
            {this.showVisitingRowGrid(
              globalConstants.EMAIL_TEXT,
              empData.vc_mail.Value.trim()
            )}
            {this.showVisitingRowGrid(
              globalConstants.MOBILE_TEXT,
              empData.vc_mobile_no.Value
            )}
            {this.showVisitingRowGrid(
              constants.DIRECT_NO_TEXT,
              empData.vc_direct_no.Value
            )}
            {this.showVisitingRowGrid(
              constants.FAX_TEXT,
              empData.vc_fax_no.Value
            )}
            {this.showVisitingRowGrid(
              constants.ADDRESS_TEXT,
              empData.in_address_no.Value.trim()
            )}
            {this.showVisitingRowGrid(
              constants.QUANTITY_TEXT,
              empData.in_quantity.Value
            )}
          </View>
        </ImageBackground>
      </View>
    );
  };

  showVisitingRowGrid = (itemName, itemValue) => {
    if (itemValue != "" && itemValue != null && itemValue != undefined) {
      return (
        <View style={styles.rowStyle}>
          <Text style={[globalFontStyle.imageBackgroundLayout, styles.textOne]}>
            {itemName}
          </Text>
          <Text style={[globalFontStyle.imageBackgroundLayout, styles.textTwo]}>
            {itemValue}
          </Text>
        </View>
      );
    } else {
      return null;
    }
  };

  showPicker = () => {
    let selectors = ["Supervisor", "LHR"];
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
            {/* <Icon name="arrow-drop-down" size={30} color={WHITE_COLOR} /> */}
          </View>
        </View>
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
    if (approver === "Supervisor") {
      // this.props.fetchSuperVisorData(this.state.query);
    } else {
      this.props.resetSupervisor();
    }
  };

  onSelection = (index, value) => {
    writeLog(
      "Invoked " +
        "onSelection" +
        " of " +
        "VisitingApproveReject" +
        " for " +
        value
    );
    this.setState(
      {
        submitTo: value,
        superVisorEmpName: "",
      },
      () => {
        this.onApproverSelection(value);
      }
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

  submitRequest = () => {
    let MyRemarks = this.state.remarks.trim();
    if (MyRemarks === "") {
      return alert("Please enter remarks!!");
    }

    if (this.state.submitTo === "LHR") {
      this.props.completeRequest(
        empData.ch_empcode.Value,
        empData.in_request_no.Value,
        1,
        3,
        "",
        3,
        MyRemarks
      );
    } else {
      this.props.completeRequest(
        empData.ch_empcode.Value,
        empData.in_request_no.Value,
        1,
        2,
        this.state.superVisorEmpId,
        2,
        MyRemarks
      );
    }
  };

  rejectReq = () => {
    let MyRemarks = this.state.remarks.trim();
    if (MyRemarks === "") {
      return alert("Please enter remarks!!");
    }
    writeLog(
      "Invoked " +
        "rejectReq" +
        " of " +
        "VisitingApproveRejectScreen" +
        " for " +
        empData.in_request_no.Value
    );
    this.props.completeRequest(
      empData.ch_empcode.Value,
      empData.in_request_no.Value,
      2,
      "",
      "",
      "",
      MyRemarks
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
            let elementSearched = element.EmpCode.toLowerCase();
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

  backNavigate() {
    writeLog(
      "Clicked on " + "backNavigate" + " of " + "VisitingApproveRejectScreen"
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
              this.setState({ showModal: false, isPopUp: "" });
              this.backNavigate();
            }}
          />
        );
      } else {
        // console.log("In side show error of Visiting screen.");
        return (
          <UserMessage
            heading="Error"
            message={this.props.visitingActionError}
            okAction={() => {
              this.setState({ showModal: false, isPopUp: "" });
              this.backNavigate();
            }}
          />
        );
      }
    }
  };

  onSupervisorSelection = (supervisor) => {
    this.props.resetSupervisor();
    this.setState({
      superVisorEmpName: supervisor.EmpName.split(":")[1],
      superVisorEmpId: supervisor.EmpCode,
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
      let data = this.state.localSuperVisorData.sort(
        (a, b) => a.EmployeeId - b.EmployeeId
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

  displaySupervisorName = () => {
    if (
      this.state.submitTo != "Select" &&
      (this.state.submitTo === "LHR" ||
        (this.state.submitTo === "Supervisor" &&
          this.state.superVisorEmpName !== ""))
    ) {
      return (
        <View>
          {this.state.submitTo === "LHR" ? null : (
            <View style={styles.remarksParent}>
              <Text style={styles.textSupervisor}>
                {this.state.superVisorEmpName}
              </Text>
            </View>
          )}
          {this.renderRemarks()}
          <TouchableOpacity
            style={styles.submitButton}
            onPress={() => this.submitRequest()}
          >
            <Text style={styles.btnSupervisorText}>
              {constants.SUBMIT_TEXT}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
  };

  render() {
    return (
      <ImageBackground source={images.loginBackground} style={styles.container}>
        <SubHeader
          pageTitle={globalConstants.VISITING_CARD_ACTION_TITLE}
          backVisible={true}
          logoutVisible={true}
          handleBackPress={() => this.handleBack()}
          navigation={this.props.navigation}
        />
        {/* {this.activityIndicator()} */}
        {this.state.submitTo === "Supervisor" &&
        this.state.superVisorEmpName === ""
          ? null
          : this.showVisitingUserDetails()}
        {action === globalConstants.APPROVED_TEXT
          ? this.showPicker()
          : this.showRemarksAndRejectButton()}
        {this.state.submitTo === "Supervisor" &&
        this.state.superVisorEmpName === ""
          ? this.renderSearch()
          : null}
        <ScrollView
          keyboardShouldPersistTaps="handled"
          style={styles.scrollViewStyle}
          showsVerticalScrollIndicator={false}
        >
          {this.showRequests()}
          {this.displaySupervisorName()}
        </ScrollView>
        {/* {this.props.leaveError && this.props.leaveError.length > 0
          ? this.showError()
          : null} */}
        {this.state.showModal ? this.showDialogBox() : null}
        {/* {this.state.showModal
          ? Platform.OS === "android"
            ? this.showDialogBox()
            : this.showDialogBoxIOS(action)
          : null} */}
      </ImageBackground>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    visitingSupervisorData: state.visitingReducer.visitingSupervisorData,
    visitingActionResponse: state.visitingReducer.visitingActionResponse,
    visitingActionError: state.visitingReducer.visitingActionError,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchSuperVisorData: (callBack, searchText) =>
      dispatch(fetchSupervisorData(callBack, searchText)),
    resetSupervisor: () => dispatch(resetSupervisor()),
    completeRequest: (
      chEmpCode,
      inReqNo,
      type,
      inStatus,
      chPendingWith,
      inPendingRole,
      vcRemarks
    ) =>
      dispatch(
        completeRequest(
          chEmpCode,
          inReqNo,
          type,
          inStatus,
          chPendingWith,
          inPendingRole,
          vcRemarks
        )
      ),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VisitingApproveRejectScreen);

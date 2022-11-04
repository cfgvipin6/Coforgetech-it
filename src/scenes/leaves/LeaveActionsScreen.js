import React, { Component } from "react";
import {
  Text,
  View,
  ImageBackground,
  FlatList,
  TouchableOpacity,
  TextInput,
  BackHandler,
} from "react-native";
import { connect } from "react-redux";
import { styles } from "./styles";
import { Icon, SearchBar } from "react-native-elements";
import {
  fetchSupervisorForLeaves,
  resetSupervisor,
  completeRequest,
  resetLeave,
  resetLeaveAction,
} from "./leaveActionCreator";
import { SUBMIT_TO, APPROVE, SEND_BACK, REJ } from "./constants";
import ActivityIndicatorView from "../../GlobalComponent/myActivityIndicator";
import SubHeader from "../../GlobalComponent/SubHeader";
import UserMessage from "../../components/userMessage";
let globalConstants = require("../../GlobalConstants");
import { writeLog } from "../../utilities/logger";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import LinearGradient from "react-native-linear-gradient";
import images from "../../images.js";
import { Dropdown } from "../../GlobalComponent/DropDown/DropDown.js";
class LeaveActionsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      localSuperVisorData: [],
      localSuperVisorSearchList: [],
      submitTo: "Select",
      leaveItem: this.props.navigation.state.params.leaveItem,
      leaveAction: this.props.navigation.state.params.leaveAction,
      query: "",
      remarks: "",
      superVisorEmpName: "",
      superVisorEmpId: "",
      showModal: false,
      showErrorModal: false,
      messageType: null,
      isDisplayed: "",
    };
    rejectType = "";
    this.submitRef = React.createRef();
  }
  showDialogBox() {
    let message = "";
    let heading = "";
    if (this.state.showModal) {
      if (this.state.messageType === 0) {
        message = "Your leave request has been ";
        message =
          rejectType != "" && rejectType == 4
            ? message + SEND_BACK.toLowerCase()
            : message + this.state.leaveAction.toLowerCase();
        heading = "Successful";
      } else {
        heading = "Sorry";
      }
      return (
        <UserMessage
          heading={heading}
          message={message}
          okAction={() => {
            this.setState({ showModal: false }, () => {
              this.props.navigation.navigate("Leave");
            });
          }}
        />
      );
    }
  }
  backNavigate() {
    this.props.navigation.navigate("Leave");
  }

  componentDidMount() {
    this.props.navigation.addListener("willFocus", this.onFocus);
    BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
  }
  componentWillUnmount() {
    this.props.resetLeaveAction();
  }
  onFocus = () => {
    writeLog("Landed on " + "LeaveActionsScreen");
    if (this.submitRef.current != null) {
      this.submitRef.current.select(-1);
    }
  };
  handleBack = () => {
    writeLog("Clicked on " + "handleBack" + " of " + "LeaveActionsScreen");
    this.props.navigation.pop();
  };
  handleBackButtonClick = () => {
    this.handleBack();
    return true;
  };

  showError = () => {
    // console.log("In side show error of leave data screen.")
    return (
      <UserMessage
        modalVisible={true}
        heading="Error"
        message={this.props.leaveError}
        okAction={() => {
          this.onOkClick();
        }}
      />
    );
  };
  onOkClick = () => {
    this.setState({ showErrorModal: false }, () => {
      setTimeout(() => {
        this.props.navigation.navigate("Leave");
      }, 1000);
    });
  };
  renderSubItem = (item) => {
    let items = [];
    for (key in item) {
      items.push(item[key]);
    }
    return items.map((e) => {
      console.log("Item Key : ", e);
      if (e.IsActive) {
        return (
          <View key={e.key} style={styles.textContainer}>
            <Text style={styles.heading}>{e.Key}</Text>
            <Text style={styles.value}>{e.Value}</Text>
          </View>
        );
      } else {
        return null;
      }
    });
  };
  showLeaveDetails = () => {
    return (
      <ImageBackground style={styles.cardBackground} resizeMode="cover">
        {this.renderSubItem(this.state.leaveItem)}
      </ImageBackground>
    );
  };
  updateSearch = (searchText) => {
    this.setState(
      {
        query: searchText,
      },
      () => {
        console.log("Query : ", this.state.query);
        const filteredData = this.state.localSuperVisorSearchList.filter(
          (element) => {
            console.log("Element : ", element);
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
        placeholder={"Enter Emp Code or Name to search"}
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
  onApproverSelection = (approver) => {
    if (approver === "Supervisor") {
    } else {
      this.props.resetSupervisor();
    }
  };
  onSelection = (index, value) => {
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
  showPicker = () => {
    let selectors = ["Supervisor", "HR"];
    return (
      <View style={styles.dropDownContainer}>
        <Text>{SUBMIT_TO}</Text>
        <Dropdown
          forwardedRef={this.submitRef}
          dropDownData={selectors}
          dropDownCallBack={(index, value) => this.onSelection(index, value)}
        />
        {/* <View
         style={styles.pickerBox}>
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            colors={["#D3E5FC", "#F9F6EE"]}
            style={styles.dropIcon}
          >
            <ModalDropdown
              ref={this.submitRef}
              options={selectors}
              defaultValue={this.state.submitTo}
              style={styles.pickerObject1}
              textStyle={styles.pickerTextStyle}
              dropdownStyle={styles.dropdownStyle}
              renderSeparator={() => (
                <View style={{ height: 1, backgroundColor: "#f68a23" }} />
              )}
              dropdownTextStyle={styles.dropdownTextStyle}
              onSelect={(index, value) => this.onSelection(index, value)}
            >
              <View style={globalFontStyle.dropDownView}>
                <View style={globalFontStyle.dropDownInnerView}>
                  <Text
                    style={{ fontSize: 17, alignSelf: "center", color: "#000" }}
                  >
                    {this.state.submitTo}
                  </Text>
                </View>
                <Icon
                  style={{ flex: 1 }}
                  name="arrow-drop-down"
                  size={30}
                  color={"#000"}
                />
              </View>
            </ModalDropdown>
          </LinearGradient>
        </View> */}
      </View>
    );
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
  renderRemarks = () => {
    return (
      <View style={styles.remarksParent}>
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          autoCompleteType={false}
          // multiline={true}
          maxLength={200}
          onChangeText={(text) => this.setState({ remarks: text })}
          value={this.state.remarks}
          placeholder="Remarks"
          returnKeyType="done"
          style={styles.textInputStyle}
        />
      </View>
    );
  };
  finishRequest = () => {
    if (this.state.submitTo === "HR") {
      this.props.completeRequest("", this.state.leaveItem, "", 2);
    } else {
      if (this.state.remarks === "") {
        return alert("Please enter remarks!");
      }
      this.props.completeRequest(
        this.state.superVisorEmpId,
        this.state.leaveItem,
        this.state.remarks,
        1
      );
    }
  };
  displaySupervisor = () => {
    if (
      this.state.submitTo != "Select" &&
      (this.state.submitTo === "HR" ||
        (this.state.submitTo === "Supervisor" &&
          this.state.superVisorEmpName !== ""))
    ) {
      return (
        <View>
          {this.state.submitTo === "HR" ? null : (
            <View style={styles.selectedSupervisor}>
              <Text style={styles.textSupervisor}>
                {this.state.superVisorEmpName}
              </Text>
            </View>
          )}
          {this.renderRemarks()}
          <TouchableOpacity
            style={styles.submitButton}
            onPress={() => this.finishRequest()}
          >
            <Text style={styles.btnSupervisorText}>
              {this.state.submitTo === "HR" ? "Approve" : "Submit"}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
  };
  rejectLeave = (value) => {
    rejectType = value;
    // console.log("8888888888",rejectType)
    if (this.state.remarks === "") {
      return alert("Please enter remarks!!");
    }
    this.props.completeRequest(
      "",
      this.state.leaveItem,
      this.state.remarks,
      value
    );
  };
  showRejectButtons = () => {
    return (
      <View>
        {this.renderRemarks()}
        <View style={styles.rejectContainer}>
          <TouchableOpacity
            onPress={() => this.rejectLeave(3)}
            style={styles.negativeButton}
          >
            <Text style={styles.canButtonText}>{REJ}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.rejectLeave(4)}
            style={styles.negativeButton}
          >
            <Text style={styles.canButtonText}>{SEND_BACK}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  supervisorCallBack = (data) => {
    this.setState({
      localSuperVisorData: data !== -1 ? data : [],
      localSuperVisorSearchList: data !== -1 ? data : [],
    });
  };
  componentDidUpdate(prevState, prevProps) {
    if (prevProps.query != this.state.query) {
      if (this.state.query.length > 2) {
        this.props.fetchSuperVisorData(
          this.state.query,
          this.supervisorCallBack
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
      this.props.submittedData === "Success" &&
      this.state.isDisplayed === ""
    ) {
      setTimeout(() => {
        this.setState({
          showModal: true,
          messageType: 0,
          isDisplayed: this.props.submittedData,
        });
      }, 1000);
    } else if (
      (this.props.submittedData &&
        this.state.isDisplayed === "" &&
        (JSON.stringify(this.props.submittedData).includes("Exception") ||
          this.props.submittedData.includes("No Data from server!"))) ||
      this.props.submittedData.includes("Unauthorized access")
    ) {
      setTimeout(() => {
        this.setState({
          showModal: true,
          messageType: 2,
          isDisplayed: this.props.submittedData,
        });
      }, 1000);
    } else if (
      this.props.leaveError &&
      this.props.leaveError.length > 0 &&
      this.state.isDisplayed === ""
    ) {
      setTimeout(() => {
        this.setState({
          showErrorModal: true,
          isDisplayed: this.props.leaveError,
        });
      }, 1000);
    }
  }
  render() {
    return (
      <ImageBackground style={{ flex: 1 }} source={images.loginBackground}>
        <View style={styles.container}>
          <SubHeader
            pageTitle={globalConstants.LEAVES_ACTION_TITLE}
            backVisible={true}
            logoutVisible={true}
            handleBackPress={() => this.handleBack()}
            navigation={this.props.navigation}
          />
          <KeyboardAwareScrollView keyboardShouldPersistTaps="never">
            <ActivityIndicatorView loader={this.props.leaveLoading} />
            {this.state.submitTo === "Supervisor" &&
            this.state.superVisorEmpName === ""
              ? null
              : this.showLeaveDetails()}
            {this.state.leaveAction === APPROVE
              ? this.showPicker()
              : this.showRejectButtons()}
            {this.state.submitTo === "Supervisor" &&
            this.state.superVisorEmpName === ""
              ? this.renderSearch()
              : null}
            {this.showRequests()}
            {this.displaySupervisor()}
            {this.state.showErrorModal === true ? this.showError() : null}
            {this.state.showModal ? this.showDialogBox() : null}
          </KeyboardAwareScrollView>
        </View>
      </ImageBackground>
    );
  }
}

mapDispatchToProps = (dispatch) => {
  return {
    resetLeaveAction: () => dispatch(resetLeaveAction()),
    fetchSuperVisorData: (searchText, superVisorCallBack) =>
      dispatch(fetchSupervisorForLeaves(searchText, superVisorCallBack)),
    resetSupervisor: () => dispatch(resetSupervisor()),
    completeRequest: (superVisorEmpId, leaveItem, remarks, action) =>
      dispatch(completeRequest(superVisorEmpId, leaveItem, remarks, action)),
  };
};
mapStateToProps = (state) => {
  return {
    loginData: state && state.loginReducer && state.loginReducer.loginData,
    superVisorData: state.leaveReducer.superVisorData,
    submittedData: state.leaveReducer.submissionData,
    leaveLoading: state.leaveReducer.leaveLoading,
    leaveError: state.leaveReducer.leaveError,
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LeaveActionsScreen);

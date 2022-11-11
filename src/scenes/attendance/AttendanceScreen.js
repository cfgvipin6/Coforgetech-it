import React, { Component } from "react";
import { Text, View, Alert, BackHandler, ImageBackground } from "react-native";
import { Card } from "react-native-elements";
import { connect } from "react-redux";
import { ScrollView } from "react-native-gesture-handler";
import { styles } from "./styles";
import { AttendanceInfo } from "./AttendanceInfo";
import { globalFontStyle } from "../../components/globalFontStyle";
import ActivityIndicatorView from "../../GlobalComponent/myActivityIndicator";
import SubHeader from "../../GlobalComponent/SubHeader";
import { Icon } from "react-native-elements";
import { currentTime } from "../Dashboard/DashboardUtility2";
import { writeLog } from "../../utilities/logger";
import {
  resetDashboardCreator,
  checkingForEligibility,
  resetEligibility,
  loading,
} from "../Dashboard/PendingAction";
import moment from "moment";
import UserMessage from "../../components/userMessage";
import images from "../../images";
let globalConstants = require("../../GlobalConstants");
class AttendanceScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      errorMessage: "",
    };
  }
  componentDidMount() {
    BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
    this.props.navigation.addListener("willFocus", this.onFocus);
  }
  componentDidUpdate() {
    if (
      this.props.pendingError &&
      this.props.pendingError.length > 0 &&
      this.state.errorMessage === ""
    ) {
      setTimeout(() => {
        this.setState({
          showModal: true,
          errorMessage: this.props.pendingError,
        });
      }, 1000);
    }
  }

  onFocus = () => {
    writeLog("Landed on " + "AttendanceScreen");
    this.props.resetEligibility();
    if (this.props.loginData && this.props.loginData.SmCode) {
      this.props.checkAttendance(
        currentTime,
        this.props.loginData.SmCode,
        this.props.loginData.Authkey
      );
    }
  };
  handleBack = () => {
    writeLog("Clicked on " + "handleBack" + " of " + "AttendanceScreen");
    this.props.navigation.pop();
  };
  componentWillUnmount() {
    BackHandler.removeEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
    this.props.reset();
  }

  handleBackButtonClick = () => {
    this.handleBack();
    return true;
  };
  showError = () => {
    // console.log("In side show error of View attendance screen.")
    return (
      <UserMessage
        modalVisible={true}
        heading="Error"
        message={this.props.pendingError}
        okAction={() => {
          this.onOkClick();
        }}
      />
    );
  };
  onOkClick = () => {
    this.setState({ showModal: false, errorMessage: "" }, () => {
      this.props.navigation.navigate("AdLogin");
    });
  };
  attendanceCard = () => {
    if (this.props.eligibilityData && this.props.eligibilityData.length > 0) {
      this.props.hideLoader();
      // console.log("data to show : ", this.props.eligibilityData)
      let date = new moment(
        this.props.eligibilityData[0].attendaceMarkedDate,
        "DD-MM-YYYY HH:mm:ss"
      ).format("DD-MM-YYYY");
      let time = new moment(
        this.props.eligibilityData[0].attendaceMarkedDate,
        "DD-MM-YYYY HH:mm:ss"
      ).format("HH:mm:ss");
      // console.log("Date time from server is :" + date + " " + time)
      const { eligibilityData } = this.props;
      const eligibilityInfo = eligibilityData[0];
      return (
        <Card style={styles.attendanceCard}>
          <View>
            <AttendanceInfo
              label="Attendance Marked"
              value={eligibilityInfo?.attendaceMarked === "Y" ? "Yes" : "No"}
            />
            <AttendanceInfo
              label="Attendance Date"
              value={eligibilityInfo?.attendanceMarkedDate}
            />

            <AttendanceInfo
              label="Attendance Time"
              value={eligibilityInfo?.attendanceMarkedTime}
            />
            {eligibilityInfo.scheduledInTime && (
              <AttendanceInfo
                label="ScheduledInTime"
                value={eligibilityInfo?.scheduledInTime}
              />
            )}
            {eligibilityInfo.scheduledOutTime && (
              <AttendanceInfo
                label="ScheduledOutTime"
                value={eligibilityInfo?.scheduledOutTime}
              />
            )}
          </View>
        </Card>
      );
    }
  };
  render() {
    let blank = false;
    if (this.props.eligibilityData && this.props.eligibilityData.length > 0) {
      blank = true;
    }
    return (
      <ImageBackground style={{ flex: 1 }} source={images.loginBackground}>
        <View style={styles.container}>
          <SubHeader
            pageTitle={globalConstants.ATTENDANCE_TITLE}
            backVisible={true}
            logoutVisible={true}
            handleBackPress={() => this.handleBack()}
            navigation={this.props.navigation}
          />
          <ActivityIndicatorView loader={this.props.loading} />
          {this.state.showModal === true ? this.showError() : null}
          <ScrollView keyboardShouldPersistTaps="handled">
            {this.attendanceCard()}
            <View style={styles.icon}>
              {blank === true ? (
                this.props.eligibilityData[0].attendaceMarked === "Y" ? (
                  <Icon name="check-circle" size={150} color="green" />
                ) : (
                  <Icon name="cancel" size={150} color="red" />
                )
              ) : null}
            </View>
          </ScrollView>
        </View>
      </ImageBackground>
    );
  }
}

mapDispatchToProps = (dispatch) => {
  return {
    checkAttendance: (currentTime, empCode, authKey) =>
      dispatch(checkingForEligibility(currentTime, empCode, authKey, null)),
    reset: () => dispatch(resetDashboardCreator()),
    resetEligibility: () => dispatch(resetEligibility()),
    hideLoader: () => dispatch(loading(false)),
  };
};
mapStateToProps = (state) => {
  return {
    loginData: state && state.loginReducer && state.loginReducer.loginData,
    loading: state.pendingReducer.loading_pending,
    pendingError: state.pendingReducer.viewAttendanceError,
    eligibilityData: state.pendingReducer.eligibilityData,
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AttendanceScreen);

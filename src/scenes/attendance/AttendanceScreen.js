import React, { Component } from "react";
import { Text, View, Alert, BackHandler, ImageBackground } from "react-native";
import { Card } from "react-native-elements";
import { connect } from "react-redux";
import { ScrollView } from "react-native-gesture-handler";
import { styles } from "./styles";
import { globalFontStyle } from "../../components/globalFontStyle";
import ActivityIndicatorView from "../../GlobalComponent/myActivityIndicator";
import SubHeader from "../../GlobalComponent/SubHeader";
import helper from "../../utilities/helper";
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
      return (
        <Card style={styles.attendanceCard}>
          <View>
            <View style={styles.cardView}>
              <Text style={globalFontStyle.cardLeftText}>
                Attendance Marked :{" "}
              </Text>
              <Text style={globalFontStyle.cardRightText}>
                {this.props.eligibilityData[0].attendaceMarked === "Y"
                  ? "Yes"
                  : "No"}
              </Text>
            </View>

            <View style={styles.cardView}>
              <Text style={globalFontStyle.cardLeftText}>
                Attendance Date :{" "}
              </Text>
              <Text style={globalFontStyle.cardRightText}>
                {this.props.eligibilityData[0].attendanceMarkedDate}
              </Text>
            </View>

            <View style={styles.cardView}>
              <Text style={globalFontStyle.cardLeftText}>
                Attendance Time :{" "}
              </Text>
              <Text style={globalFontStyle.cardRightText}>
                {this.props.eligibilityData[0].attendanceMarkedTime}
              </Text>
            </View>
            {this.props.eligibilityData[0].scheduledInTime != null ? (
              <View style={styles.cardView}>
                <Text style={globalFontStyle.cardLeftText}>
                  ScheduledInTime :{" "}
                </Text>
                <Text style={globalFontStyle.cardRightText}>
                  {this.props.eligibilityData[0].scheduledInTime}
                </Text>
              </View>
            ) : null}

            {this.props.eligibilityData[0].scheduledOutTime != null ? (
              <View style={styles.cardView}>
                <Text style={globalFontStyle.cardLeftText}>
                  ScheduledOutTime :{" "}
                </Text>
                <Text style={globalFontStyle.cardRightText}>
                  {this.props.eligibilityData[0].scheduledOutTime}
                </Text>
              </View>
            ) : null}
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
  // console.log("Eligibility data in side attendance view screen. ",state.pendingReducer.eligibilityData)
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

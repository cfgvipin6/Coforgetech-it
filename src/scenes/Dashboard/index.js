/*
Author: Gaganesh Sharma & Mohit Garg(70024)
*/

import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Text,
  View,
  TouchableOpacity,
  BackHandler,
  Alert,
  RefreshControl,
  ScrollView,
  Image,
  ImageStore,
  ImageBackground,
} from "react-native";
import { pendingActionCreator, resetDashboardCreator } from "./PendingAction";
import { FlatList } from "react-native-gesture-handler";
import { globalFontStyle } from "../../components/globalFontStyle";
import { styles } from "./styles";
import SubHeader from "../../GlobalComponent/SubHeader";
import ActivityIndicatorView from "../../GlobalComponent/myActivityIndicator";
import { Icon } from "react-native-elements";
import { writeLog } from "../../utilities/logger";
import UserMessage from "../../components/userMessage";
import images from "../../images";
let constants = require("./Constants");
let globalConstants = require("../../GlobalConstants");
let appConfig = require("../../../appconfig");
let serviceType = "";
class DashboardView extends Component {
  constructor(props) {
    super(props);
    previousScreenData = this.props.navigation.state.params;
    isComingFromCreateVoucher =
      previousScreenData.isComingFromCV != undefined
        ? previousScreenData.isComingFromCV
        : false;
    this.state = {
      userDetails: this.props.loginData,
      messageType: null,
      countResponseSet: [],
      errorMessage: "",
      isRefreshing: false,
      showModal: false,
    };

    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    isPullToRefreshActive = false;
  }
  componentDidUpdate = () => {
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
  };
  componentDidMount() {
    //console.log("USER DETAILS:", this.state.userDetails);
    writeLog(this.state.userDetails.SmCode + " Landed on " + "DashboardView");
    BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
    this.getPendingCounts();
    this.willFocusSubscription = this.props.navigation.addListener(
      "willFocus",
      () => {
        this.getPendingCounts();
      }
    );
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
    this.willFocusSubscription.remove();
  }

  onRefresh = () => {
    this.setState({ isRefreshing: true });
    isPullToRefreshActive = true;
    this.wait(2000).then(() => this.setState({ isRefreshing: false }));
  };

  wait(timeout) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.getPendingCounts());
      }, timeout);
    });
  }

  handleBackButtonClick() {
    writeLog(
      "Clicked on " + "handleBackButtonClick" + " of " + "DashboardView"
    );
    this.props.navigation.pop();
    return true;
  }
  showError = () => {
    // console.log("In side show error of Dashboard screen.", this.props.pendingError)
    return (
      <UserMessage
        modalVisible={true}
        heading="Error"
        message={this.state.errorMessage}
        okAction={() => {
          this.onOkClick();
        }}
      />
    );
  };
  static getDerivedStateFromProps(nextProps, state) {
    if (
      nextProps.pendingData &&
      nextProps.pendingData.length > 0 &&
      nextProps.pendingError === ""
    ) {
      const data = nextProps.pendingData;
      //alert(JSON.stringify(data));
      if (data.length > 0) {
        return {
          countResponseSet: data,
        };
      } else {
        return {
          messageType: 1,
        };
      }
    } else if (
      nextProps.pendingError != "" &&
      nextProps.pendingData.length === 0
    ) {
      return {
        countResponseSet: [],
      };
    } else {
      return null;
    }
  }

  async getPendingCounts() {
    this.setState({
      countResponseSet: [],
    });
    this.props.getPendingCounts(this.props.loginData, isPullToRefreshActive);
  }
  sectionItemClick(item) {
    console.log("items", item);
    writeLog("Clicked on " + item.Type + " of " + "DashboardView");
    if (item.Type === "Resource Request") {
      if (item.Count == 0) {
        countErrorMessage =
          constants.YOU_DONT_HAVE_ERROR_TEXT +
          constants.RESOURCE_REQUEST_ERROR_TEXT;
        alert(countErrorMessage);
      } else {
        serviceType = "RR Service";
        this.props.navigation.navigate("Home", {
          loginApiResponse: this.state.userDetails,
          serviceType: serviceType,
          pageTitle: globalConstants.RR_TITLE,
        });
      }
    } 
    else if (item.Type === "Local Conveyance Voucher") {
      if (item.Count == 0) {
        countErrorMessage =
          constants.YOU_DONT_HAVE_ERROR_TEXT +
          constants.LOCAL_CONVEYANCE_VOUCHER_ERROR_TEXT;
        alert(countErrorMessage);
      } else {
        serviceType = "Local Voucher Service";
        this.props.navigation.navigate("Home", {
          loginApiResponse: this.state.userDetails,
          serviceType: serviceType,
          pageTitle: globalConstants.LCV_TITLE,
        });
      }
    } 
    // timesheet approval
    else if (item.Type === "Timesheet Approval") {
      if (item.Count == 0) {
        countErrorMessage =
          constants.YOU_DONT_HAVE_ERROR_TEXT +
          constants.TIMESHEET_APPROVAL_ERROR_TEXT;
        alert(countErrorMessage);
      } else {
        serviceType = "Timesheet Approval";
        this.props.navigation.navigate("TimeSheetApproval", {
          loginApiResponse: this.state.userDetails,
          serviceType: serviceType,
          pageTitle: globalConstants.TIMESHEET_APPROVALS,
        });
      }
    } 
    else if (item.Type === "Cash Voucher") {
      if (item.Count == 0) {
        countErrorMessage =
          constants.YOU_DONT_HAVE_ERROR_TEXT +
          constants.CASH_VOUCHER_ERROR_TEXT;
        alert(countErrorMessage);
      } else {
        serviceType = "Cash Voucher Service";
        this.props.navigation.navigate("Home", {
          loginApiResponse: this.state.userDetails,
          serviceType: serviceType,
          pageTitle: globalConstants.CASH_TITLE,
        });
      }
    } else if (item.Type === "Domestic Travel Request") {
      if (item.Count == 0) {
        countErrorMessage =
          constants.YOU_DONT_HAVE_ERROR_TEXT +
          constants.DOMESTIC_TRAVEL_ERROR_TEXT;
        alert(countErrorMessage);
      } else {
        serviceType = "Domestic Travel Request";
        this.props.navigation.navigate("Travel", {
          loginApiResponse: this.state.userDetails,
          serviceType: serviceType,
        });
      }
    } else if (item.Type === "International Travel Request") {
      if (item.Count == 0) {
        countErrorMessage =
          constants.YOU_DONT_HAVE_ERROR_TEXT +
          constants.INTERNATIONAL_TRAVEL_ERROR_TEXT;
        alert(countErrorMessage);
      } else {
        serviceType = "International Travel Request";
        this.props.navigation.navigate("Travel", {
          loginApiResponse: this.state.userDetails,
          serviceType: serviceType,
        });
      }
    } else if (item.Type === "Conv. & Travel Voucher") {
      //UK travel voucher
      if (item.Count == 0) {
        countErrorMessage =
          constants.YOU_DONT_HAVE_ERROR_TEXT + constants.UK_TRAVEL_ERROR_TEXT;
        alert(countErrorMessage);
      } else {
        serviceType = "UK_Travel";
        this.props.navigation.navigate("Home", {
          loginApiResponse: this.state.userDetails,
          serviceType: serviceType,
          pageTitle: globalConstants.CONV_AND_TRAVEL_TITLE,
        });
      }
    } else if (item.Type === "Expense Voucher") {
      //UK expense voucher
      if (item.Count == 0) {
        countErrorMessage =
          constants.YOU_DONT_HAVE_ERROR_TEXT + constants.UK_EXPENSE_ERROR_TEXT;
        alert(countErrorMessage);
      } else {
        serviceType = "UK_Expense";
        this.props.navigation.navigate("Home", {
          loginApiResponse: this.state.userDetails,
          serviceType: serviceType,
          pageTitle: globalConstants.EXPENSE_TITLE,
        });
      }
    } else if (item.Type === "Mileage Voucher") {
      //UK mileage voucher
      if (item.Count == 0) {
        countErrorMessage =
          constants.YOU_DONT_HAVE_ERROR_TEXT + constants.UK_MILEAGE_ERROR_TEXT;
        alert(countErrorMessage);
      } else {
        serviceType = "UK_Mileage";
        this.props.navigation.navigate("Home", {
          loginApiResponse: this.state.userDetails,
          serviceType: serviceType,
          pageTitle: globalConstants.MILEAGE_TITLE,
        });
      }
    } else if (item.Type === "Leave") {
      //Leave
      if (item.Count == 0) {
        countErrorMessage =
          constants.YOU_DONT_HAVE_ERROR_TEXT + constants.LEAVE_ERROR_TEXT;
        alert(countErrorMessage);
      } else {
        serviceType = "UK_Mileage";
        this.props.navigation.navigate("LeaveRoute", {
          loginApiResponse: this.state.userDetails,
        });
      }
    } else if (item.Type === "US Expense Claims") {
      //US expense voucher
      if (item.Count == 0) {
        countErrorMessage =
          constants.YOU_DONT_HAVE_ERROR_TEXT + constants.US_EXPENSE_ERROR_TEXT;
        alert(countErrorMessage);
      } else {
        serviceType = "US_Expense";
        this.props.navigation.navigate("Home", {
          loginApiResponse: this.state.userDetails,
          serviceType: serviceType,
          pageTitle: globalConstants.US_EXPENSE_TITLE,
        });
      }
    } else if (item.Type === "Visa") {
      //Visa
      if (item.Count == 0) {
        countErrorMessage =
          constants.YOU_DONT_HAVE_ERROR_TEXT + constants.VISA_ERROR_TEXT;
        alert(countErrorMessage);
      } else {
        this.props.navigation.navigate("Visa");
      }
    } else if (item.Type === "Visiting Card") {
      //Visiting Card
      if (item.Count == 0) {
        countErrorMessage =
          constants.YOU_DONT_HAVE_ERROR_TEXT +
          constants.VISITING_CARD_ERROR_TEXT;
        alert(countErrorMessage);
      } else {
        this.props.navigation.navigate("VisitingCard");
      }
    } else if (item.Type === "CRP Letter") {
      //CRP Letter
      if (item.Count == 0) {
        countErrorMessage =
          constants.YOU_DONT_HAVE_ERROR_TEXT + constants.ECRP_ERROR_TEXT;
        alert(countErrorMessage);
      } else {
        this.props.navigation.navigate("Ecrp");
      }
    } else if (item.Type === "Capital Deployment Sanction") {
      //CDS
      if (item.Count == 0) {
        countErrorMessage =
          constants.YOU_DONT_HAVE_ERROR_TEXT + constants.CDS_ERROR_TEXT;
        alert(countErrorMessage);
      } else {
        this.props.navigation.navigate("Cds");
      }
    } else if (item.Type === "Resignation") {
      //Resignation
      if (item.Count == 0) {
        countErrorMessage =
          constants.YOU_DONT_HAVE_ERROR_TEXT + constants.RESIGNATION_ERROR_TEXT;
        alert(countErrorMessage);
      } else {
        this.props.navigation.navigate("Exit");
      }
    } else if (item.Type === "Additional Advance (Domestic)") {
      //Advance Domestic Travel
      if (item.Count == 0) {
        countErrorMessage =
          constants.YOU_DONT_HAVE_ERROR_TEXT +
          constants.ADV_DOMESTIC_TRAVEL_ERROR_TEXT;
        alert(countErrorMessage);
      } else {
        serviceType = "Travel Advance Domestic";
        this.props.navigation.navigate("TravelAdvance", {
          serviceType: serviceType,
        });
      }
    } else if (item.Type === "Additional Advance (Intl.)") {
      //Advance Intl Travel
      if (item.Count == 0) {
        countErrorMessage =
          constants.YOU_DONT_HAVE_ERROR_TEXT +
          constants.ADV_INTL_TRAVEL_ERROR_TEXT;
        alert(countErrorMessage);
      } else {
        serviceType = "Travel Advance International";
        this.props.navigation.navigate("TravelAdvance", {
          serviceType: serviceType,
        });
      }
    } else if (item.Type === "IT Service Desk") {
      if (item.Count == 0) {
        countErrorMessage =
          constants.YOU_DONT_HAVE_ERROR_TEXT +
          constants.IT_SERVICE_DESK_ERROR_TEXT;
        alert(countErrorMessage);
      } else {
        this.props.navigation.navigate("PendingRequestIT");
      }
    }
  }

  sectionItem(item) {
    return (
      <TouchableOpacity onPress={() => this.sectionItemClick(item)}>
        <View style={[styles.item, { opacity: item.Count == 0 ? 0.6 : 1 }]}>
          <View style={styles.rowContainer}>
            {/* <Image source={images.rightCircleArrow}/> */}
            <Text
              style={[
                globalFontStyle.dashboardTitleSize,
                { marginLeft: 5, paddingVertical: 5 },
              ]}
            >
              {item.Type}
            </Text>
            <View style={styles.countView}>
              <Text style={styles.countText}>{"(" + item.Count + ")"}</Text>
            </View>
          </View>
          <Icon
            style={{ marginRight: 10 }}
            size={30}
            color={appConfig.DARK_BLUISH_COLOR}
            name="chevron-right"
          />
        </View>
      </TouchableOpacity>
    );
  }
  onOkClick = () => {
    this.props.resetState();
    this.setState({ showModal: false, errorMessage: "" }, () => {
      this.props.navigation.pop();
    });
  };

  handleBack() {
    this.props.resetState();
    this.props.navigation.pop();
  }
  render() {
    let dataToDisplay = this.state.countResponseSet.sort(
      (a, b) => b.Count - a.Count
    );
    if (isComingFromCreateVoucher) {
      dataToDisplay = dataToDisplay.filter(
        (item) =>
          item.Type == "Cash Voucher" ||
          item.Type == "Local Conveyance Voucher" ||
          item.Type == "US Expense Claims" ||
          item.Type == "Conv. & Travel Voucher" ||
          item.Type == "Domestic Travel Request" ||
          item.Type == "International Travel Request" ||
          item.Type == "Mileage Voucher" ||
          item.Type == "Expense Voucher" ||
          item.Type == "Additional Advance (Domestic)" ||
          item.Type == "Additional Advance (Intl.)"
      );
    }
    return (
      <ImageBackground
        style={styles.backGroundView}
        source={images.loginBackground}
      >
        <SubHeader
          pageTitle={
            isComingFromCreateVoucher
              ? globalConstants.DASHBOARD_WITH_VOUCHER_TITLE
              : globalConstants.DASHBOARD_TITLE
          }
          backVisible={true}
          logoutVisible={true}
          handleBackPress={() => this.handleBack()}
          navigation={this.props.navigation}
        />
        {/* <ScrollView
          keyboardShouldPersistTaps="handled"
          style={{ height: "100%" }}
        > */}
        <View style={{ marginLeft: 0, marginRight: 10 }}>
          {this.state.countResponseSet.length > 0 ? (
            <FlatList
              showsVerticalScrollIndicator={false}
              data={dataToDisplay}
              keyExtractor={(item, index) => item + index}
              renderItem={({ item }) => this.sectionItem(item)}
              refreshControl={
                <RefreshControl
                  onRefresh={this.onRefresh}
                  refreshing={this.state.isRefreshing}
                />
              }
            />
          ) : null}
        </View>
        {/* </ScrollView> */}
        {this.props.pendingError != "" ? this.showError() : null}
        <ActivityIndicatorView loader={this.props.loading} />
      </ImageBackground>
    );
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    resetState: () => dispatch(resetDashboardCreator()),
    getPendingCounts: (loginData, isPullToRefreshActive) =>
      dispatch(pendingActionCreator(loginData, isPullToRefreshActive)),
  };
};

const mapStateToProps = (state) => {
  // console.log("Pending data from pending reducer is : ", state.pendingReducer.pendingData)
  return {
    loginData: state && state.loginReducer && state.loginReducer.loginData,
    pendingData: state.pendingReducer.pendingData,
    loading: state.pendingReducer.loading_pending,
    pendingError: state.pendingReducer.pendingError,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardView);

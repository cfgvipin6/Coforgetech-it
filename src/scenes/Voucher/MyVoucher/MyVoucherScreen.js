/* eslint-disable no-trailing-spaces */
/* eslint-disable eqeqeq */
/* eslint-disable no-alert */
/* eslint-disable semi */
/* eslint-disable quotes */
/* eslint-disable no-undef */
/* eslint-disable keyword-spacing */
/* eslint-disable prettier/prettier */

import React, { Component, useRef, useEffect } from "react";
import {
  View,
  Text,
  BackHandler,
  ImageBackground,

 } from "react-native";
import { connect } from "react-redux";
import SubHeader from "../../../GlobalComponent/SubHeader";
import { styles } from "./styles";
import { globalFontStyle } from "../../../components/globalFontStyle";
import { LabelTextDashValue } from "../../../GlobalComponent/LabelText/LabelText";
import ActivityIndicatorView from "../../../GlobalComponent/myActivityIndicator";
import { Card, SearchBar } from "react-native-elements";
import { ApproveRejectCards } from "../../../GlobalComponent/ApproveRejectList/ApproveRejectList";
import { getMyRequestsData, resetMyRequests } from "./myVoucherRequestAction";
import { writeLog } from "../../../utilities/logger";
import UserMessage from "../../../components/userMessage";
let globalConstants = require("../../../GlobalConstants");

const stopMessage =
  "India Expense Claim (Vouchers) modification process has been stopped due to financial year end closing.";
class MyVoucherScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isRefreshing: false,
      localMyRequestSearchData: [],
      myRequestSearchData: [],
      query: "",
      actionPopUP: false,
      actionMessage: "",
    };
    isPullToRefreshActive = false;
    this._panel = React.createRef();
  }

  static getDerivedStateFromProps = (nextProps, state) => {
    if (nextProps.myRequestData.length > 0 && !state.query.length > 0) {
      let data = nextProps.myRequestData.filter(
        (data) => data.VoucherTypeDesc != "CASH - Covid-vaccination"
      );
      return {
        myRequestSearchData: data.sort(
          (a, b) => new Date(b.DocStartDate) - new Date(a.DocStartDate)
        ),
        localMyRequestSearchData: data.sort(
          (a, b) => new Date(b.DocStartDate) - new Date(a.DocStartDate)
        ),
      };
    } else {
      return null;
    }
  };
  componentDidUpdate() {
    if (
      this.props.myRequestError &&
      this.props.myRequestError.length > 0 &&
      this.state.actionMessage === ""
    ) {
      setTimeout(() => {
        this.setState({
          actionPopUP: true,
          actionMessage: this.props.myRequestError,
        });
      }, 1000);
    }
  }

  componentDidMount() {
    BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
    this.props.getMyRequests(
      this.props.loginData.SmCode,
      this.props.loginData.Authkey,
      isPullToRefreshActive
    );
  }
  onRefresh = () => {
    console.log("On Refresh is called");
    this.setState({ isRefreshing: true });
    isPullToRefreshActive = true;
    this.wait(2000).then(() => this.setState({ isRefreshing: false }));
  };
  wait(timeout) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          this.props.getMyRequests(
            this.props.loginData.SmCode,
            this.props.loginData.Authkey,
            isPullToRefreshActive
          )
        );
      }, timeout);
    });
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      info: errorInfo,
    });
  }
  componentWillUnmount() {
    this.props.resetMyRequestData();
    BackHandler.removeEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
    this.setState({
      localMyRequestSearchData: [],
      myRequestSearchData: [],
      actionMessage: "",
      actionPopUP: false,
    });
  }

  handleBackButtonClick = () => {
    this.handleBack();
    return true;
  };

  handleBack = () => {
    this.props.navigation.pop();
  };

  // openNewPanel = (item, panel) => {
  //   if (this._panel.current !== null) {
  //     this._panel.current.show(height / 1.3);
  //   }
  // };

  proceedRequest = (item) => {
    //usVoucher handle
    console.log("sending data", item);
    let CO_CODE = this.props.loginData.CO_CODE;
    let isCodeMatched =
      CO_CODE == "N001" ||
      CO_CODE == "NSU1" ||
      CO_CODE == "NSU3" ||
      CO_CODE == "NSU4" ||
      CO_CODE == "NDEV" ||
      CO_CODE == "N028" ||
      CO_CODE == "N060" ||
      CO_CODE == "N070";

    docStatusCode = item.StatusCode;
    if (
      docStatusCode == 0 ||
      docStatusCode == 1 ||
      docStatusCode == 5 ||
      docStatusCode == 7 ||
      docStatusCode == 12 ||
      docStatusCode == 14
    ) {
      isDocumentSaved = true;
    } else {
      isDocumentSaved = false;
    }

    if (item.DocNo.includes("MBL")) {
      console.log("Going to MBL");
      this.props.navigation.navigate("CreateGenericVoucher", {
        isComingFromMyVoucher: true,
        docDetails: item,
        Title: globalConstants.CREATE_MOBILE_VOUCHER,
        CatID: "6",
        isFileRequired: item.FileRequired,
      });
    } else if (item.DocNo.includes("LTA")) {
      this.props.navigation.navigate("CreateLtaVoucher", {
        isComingFromMyVoucher: true,
        docDetails: item,
        Title: globalConstants.CREATE_LTA_VOUCHER,
        CatID: "3",
        isFileRequired: item.FileRequired,
      });
    } else if (item.DocNo.includes("PET")) {
      this.props.navigation.navigate("CreateGenericVoucher", {
        isComingFromMyVoucher: true,
        docDetails: item,
        Title: globalConstants.CREATE_PETROL_VOUCHER,
        CatID: "5",
        isFileRequired: item.FileRequired,
      });
    } else if (item.DocNo.includes("DRV")) {
      this.props.navigation.navigate("CreateGenericVoucher", {
        isComingFromMyVoucher: true,
        docDetails: item,
        Title: globalConstants.CREATE_DRIVER_VOUCHER,
        CatID: "4",
        isFileRequired: item.FileRequired,
      });
    } else if (item.DocNo.includes("MED")) {
      console.log("Going to MED");
      this.props.navigation.navigate("CreateGenericVoucher", {
        isComingFromMyVoucher: true,
        docDetails: item,
        Title: globalConstants.CREATE_HEALTH_VOUCHER,
        CatID: "7",
        isFileRequired: item.FileRequired,
      });
    } else if (
      item.DocType == "TRV" ||
      item.DocType == "REL" ||
      item.DocType == "OTH"
    ) {
      console.log("Going to US Voucher");
      if (isDocumentSaved) {
        this.props.navigation.navigate("CreateVoucher", {
          isComingFromMyVoucher: true,
          docDetails: item,
        });
      } else {
        this.props.navigation.navigate("CreateUSVoucher", {
          isComingFromMyVoucher: true,
          docDetails: item,
          Title: globalConstants.UPDATE_VOUCHER_TITLE,
          CatID: item.Category,
          isFileRequired: item.FileRequired,
        });
      }
    } else {
      this.props.navigation.navigate("CreateVoucher2", {
        isComingFromMyVoucher: true,
        docDetails: item,
        isFileRequired: item.FileRequired,
      });
    }
  };
  renderItems = (item, index) => {
    return (
      <ImageBackground style={styles.cardBackground} resizeMode="cover">
        <LabelTextDashValue
          item={item}
          hyperLink={true}
          onHyperLinkClick={(item) => this.proceedRequest(item)}
          heading="Document Number"
          description={item.DocNo}
        />
        <LabelTextDashValue
          heading="Voucher Type"
          description={item.VoucherTypeDesc}
        />
        <LabelTextDashValue
          heading="Amount"
          description={parseFloat(item.TotalApprovedAmt).toFixed(2)}
        />
        <LabelTextDashValue
          heading="Document Date"
          description={item.DocStartDate}
        />
        <LabelTextDashValue
          heading="Pending With"
          description={item.PendingWith}
        />
        <LabelTextDashValue heading="Status" description={item.Status} />
      </ImageBackground>
    );
  };

  updateSearch = (searchText) => {
    this.setState(
      {
        query: searchText,
      },
      () => {
        const filteredData = this.state.localMyRequestSearchData.filter(
          (element) => {
            console.log("Element to filter : ", element);
            let str1 = element.DocNo;
            let str2 = element.EmpCode;
            let str3 = element.EmpName;
            let searchedText = str1.concat(str2).concat(str3);
            let elementSearched = searchedText.toString().toLowerCase();
            let queryLowerCase = this.state.query.toString().toLowerCase();
            return elementSearched.indexOf(queryLowerCase) > -1;
          }
        );
        this.setState(
          {
            myRequestSearchData: filteredData,
          },
          () => {
            console.log("Update search called", filteredData);
          }
        );
      }
    );
  };
  onOkClick = () => {
    writeLog("Clicked on " + "onOkClick" + " of " + "PendingRequest screen");
    this.props.navigation.pop();
  };
  showPopUp = () => {
    writeLog(
      "Dialog is open with exception " +
        this.props.itError +
        " on " +
        "MyRequest screen"
    );
    return (
      <UserMessage
        modalVisible={true}
        heading="Error"
        message={this.props.myRequestError}
        okAction={() => {
          this.onOkClick();
        }}
      />
    );
  };
  render() {
    const { query } = this.state;
    if (this.state.error) {
      return (
        <View style={styles.container}>
          <Text>{this.state.error}</Text>
          <Text>{this.state.info}</Text>
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <View style={globalFontStyle.subHeaderViewGlobal}>
          <SubHeader
            pageTitle={globalConstants.MY_VOUCHERS}
            backVisible={true}
            logoutVisible={true}
            handleBackPress={() => this.handleBack()}
            navigation={this.props.navigation}
          />
        </View>
        <View style={globalFontStyle.searchViewGlobal}>
          <SearchBar
            lightTheme
            placeholder={"Search by document number"}
            onChangeText={this.updateSearch}
            value={query}
            raised={true}
            containerStyle={globalFontStyle.searchGlobal}
            autoCapitalize="none"
            autoCompleteType="off"
            autoCorrect={false}
          />
        </View>
        <View style={globalFontStyle.contentViewGlobal}>
          <ApproveRejectCards
            data={this.state.myRequestSearchData}
            renderItem={({ item, index }) => this.renderItems(item, index)}
            refreshing={this.state.isRefreshing}
          />
        </View>
        <ActivityIndicatorView loader={this.props.myRequestLoading} />
        {this.state.actionPopUP === true ? this.showPopUp() : null}
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loginData: state && state.loginReducer && state.loginReducer.loginData,
    myRequestData:
      state && state.myVoucherReducer && state.myVoucherReducer.myVoucherData,
    myRequestLoading:
      state &&
      state.myVoucherReducer &&
      state.myVoucherReducer.myVoucherLoading,
    myRequestError:
      state && state.myVoucherReducer && state.myVoucherReducer.myVoucherError,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getMyRequests: (loginId, authKey, isPullToRefreshActive) =>
      dispatch(getMyRequestsData(loginId, authKey, isPullToRefreshActive)),
    resetMyRequestData: () => dispatch(resetMyRequests()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyVoucherScreen);

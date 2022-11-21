/*
Author: Mohit Garg(70024)
*/

import React, { Component } from "react";
import {
  Text,
  View,
  FlatList,
  LayoutAnimation,
  TouchableHighlight,
  RefreshControl,
  ImageBackground,
  TouchableOpacity,
  Image,
} from "react-native";
import SubHeader from "../../GlobalComponent/SubHeader";
import { styles } from "./styles";
import { SearchBar } from "react-native-elements";
import ActivityIndicatorView from "../../GlobalComponent/myActivityIndicator";
import { globalFontStyle } from "../../components/globalFontStyle";
import {
  TravelAdvanceFetchData,
  resetTravelAdvanceStore,
} from "./travelAdvanceAction";
import { connect } from "react-redux";
import { writeLog } from "../../utilities/logger";
import images from "../../images";
import BoxContainer from "../../components/boxContainer.js";
import Seperator from "../../components/Seperator";
import { TravelInfo } from "../travel/travelInfo";
let globalConstants = require("../../GlobalConstants");
let constants = require("./constants");

export class TravelAdvanceScreen extends Component {
  constructor(props) {
    super(props);
    userServiceType = this.props.navigation.state.params.serviceType;
    this.state = {
      isRefreshing: false,
      localTravelAdvanceData: [],
      localTravelAdvanceSearchData: [],
      active_index: -1,
      updatedHeight: 0,
      expand: false,
      query: "",
    };
    isDTRService = false;
    isITRService = false;
    this.checkServiceType();
    isPullToRefreshActive = false;
  }

  componentDidMount() {
    writeLog("Landed on " + "TravelAdvanceScreen");
    if (isDTRService) {
      writeLog(
        "Invoked " +
          "fetchTravelAdvanceData" +
          " of " +
          "TravelAdvanceScreen" +
          " for Domestic"
      );
      this.props.fetchTravelAdvanceData(
        this.props.empCode,
        this.props.accessToken,
        isPullToRefreshActive,
        "D"
      );
    } else if (isITRService) {
      writeLog(
        "Invoked " +
          "fetchTravelAdvanceData" +
          " of " +
          "TravelAdvanceScreen" +
          " for International"
      );
      this.props.fetchTravelAdvanceData(
        this.props.empCode,
        this.props.accessToken,
        isPullToRefreshActive,
        "I"
      );
    }
  }

  static getDerivedStateFromProps(nextProps, state) {
    // console.log("next props::::::", nextProps)
    if (
      nextProps.travelAdvanceData[0] &&
      nextProps.travelAdvanceData.length > 0 &&
      !state.query.length > 0
    ) {
      return {
        localTravelAdvanceData: nextProps.travelAdvanceData,
        localTravelAdvanceSearchData: nextProps.travelAdvanceData,
      };
    } else {
      return null;
    }
  }

  checkServiceType() {
    if (
      userServiceType != "" &&
      userServiceType != null &&
      userServiceType != undefined
    ) {
      writeLog(
        "Invoked " +
          "checkServiceType" +
          " of " +
          "TravelAdvanceScreen" +
          " for " +
          userServiceType
      );
      if (userServiceType === "Travel Advance Domestic") {
        isDTRService = true;
      } else if (userServiceType === "Travel Advance International") {
        isITRService = true;
      }
    }
  }

  onRefresh = () => {
    this.setState({ isRefreshing: true });
    isPullToRefreshActive = true;
    this.wait(2000).then(() => this.setState({ isRefreshing: false }));
  };

  wait(timeout) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.resetTravelAdvanceState());
      }, timeout);
    });
  }

  resetTravelAdvanceState = () => {
    this.props.resetTravelAdvanceHome();
    if (isDTRService) {
      writeLog(
        "Invoked " +
          "fetchTravelAdvanceData for resetTravelAdvanceState" +
          " of " +
          "TravelAdvanceScreen" +
          " for Domestic"
      );
      this.props.fetchTravelAdvanceData(
        this.props.empCode,
        this.props.accessToken,
        isPullToRefreshActive,
        "D"
      );
    } else if (isITRService) {
      writeLog(
        "Invoked " +
          "fetchTravelAdvanceData for resetTravelAdvanceState" +
          " of " +
          "TravelAdvanceScreen" +
          " for International"
      );
      this.props.fetchTravelAdvanceData(
        this.props.empCode,
        this.props.accessToken,
        isPullToRefreshActive,
        "I"
      );
    }
  };

  updateSearch = (searchText) => {
    this.setState(
      {
        query: searchText,
      },
      () => {
        const filteredData = this.state.localTravelAdvanceSearchData.filter(
          (element) => {
            let str1 = element.DocumentNo.trim();
            let str2 = element.DocOwnerCode.trim();
            let str3 = element.DocOwnerName.trim();
            let searchedText = str1.concat(str2).concat(str3);
            let elementSearched = searchedText.toString().toLowerCase();
            let queryLowerCase = this.state.query.toString().toLowerCase();
            return elementSearched.indexOf(queryLowerCase) > -1;
          }
        );
        this.setState({
          localTravelAdvanceData: filteredData,
        });
      }
    );
  };

  handleBack = () => {
    writeLog("Clicked on " + "handleBack" + " of " + "TravelAdvanceScreen");
    this.props.resetTravelAdvanceHome();
    this.props.navigation.pop();
  };

  renderTravelSubView(item) {
    return (
      <View>
        {this.showTravelAdvanceRowGrid(
          constants.VISIT_TYPE_TEXT,
          item.VisitType
        )}
        {this.showTravelAdvanceRowGrid(
          globalConstants.COST_CENTER_TEXT,
          item.CostCenterCode.trim() + " : " + item.CostCenterDesc.trim()
        )}
        {this.showTravelAdvanceRowGrid(
          globalConstants.PROJECT_TEXT,
          item.ProjectDesc === "NA"
            ? "NA"
            : item.ProjectCode.trim() + " : " + item.ProjectDesc.trim()
        )}
        {this.showTravelAdvanceRowGrid(
          constants.BILLABLE_TEXT,
          item.Billable === "Y" ? "Yes" : "No"
        )}
        {this.showTravelAdvanceRowGrid(
          constants.TOTAL_ADV_TAKEN_TEXT,
          item.TotalAdvTaken
        )}
        {this.showTravelAdvanceRowGrid(
          constants.ADDITIONAL_ADV_REQUIRED_TEXT,
          item.AddlAdvRequired
        )}
      </View>
    );
  }

  renderTravelMoreView(item) {
    return (
      <TouchableHighlight>
        <View>{}</View>
      </TouchableHighlight>
    );
  }

  expand_collapse_Function = (i) => {
    LayoutAnimation.configureNext({
      duration: 300,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      update: { type: LayoutAnimation.Types.easeInEaseOut },
    });
    if (i == this.state.active_index) {
      this.setState({
        active_index: -1,
        updatedHeight: 0,
        expand: false,
      });
    } else {
      this.setState({
        active_index: i,
        updatedHeight: 150,
        expand: true,
      });
    }
  };

  openNewPanel = (docNumber) => {
    // this._panel.show(height/1.3)
    // {this.props.fetchTravelHistory(docNumber)}
  };

  travelRequestAction = (action, item, isDTRService) => {
    this.props.navigation.navigate("TravelAdvanceApproveReject", {
      employeeDetails: item,
      action: action,
      isDTRService: isDTRService,
    });
  };

  showTravelAdvanceRowGrid = (itemName, itemValue) => {
    return (
      <TravelInfo
        label={itemName}
        value={itemValue == undefined ? "" : itemValue}
      />
    );
  };

  renderAdvTravelRequest = (item, index) => {
    let deptDate = item.DeptDate.replace(/-/g, " ");
    let returnDate = item.ReturnDate.replace(/-/g, " ");
    return (
      <BoxContainer>
        <View style={styles.cardStyle}>
          {this.showTravelAdvanceRowGrid(
            globalConstants.DOCUMENT_NUMBER_TEXT,
            item.DocumentNo.trim()
          )}
          {this.showTravelAdvanceRowGrid(
            globalConstants.EMPLOYEE_TEXT,
            item.DocOwnerCode.trim() + " : " + item.DocOwnerName.trim()
          )}
          {this.showTravelAdvanceRowGrid(
            constants.ITINERARY_TEXT,
            item.Itinerary.trim()
          )}
          {this.showTravelAdvanceRowGrid(constants.DEP_DATE_TEXT, deptDate)}
          {this.showTravelAdvanceRowGrid(
            constants.EXP_DATE_OF_RETURN_TEXT,
            returnDate
          )}
        </View>
        <Seperator />
        {this.state.active_index === index ? (
          this.renderTravelSubView(item)
        ) : (
          <View />
        )}
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-around",
            marginTop: "2%",
          }}
        >
          {this.state.active_index === index ? (
            <TouchableOpacity
              onPress={() => this.expand_collapse_Function(index)}
              style={{ alignItems: "center" }}
            >
              <Image source={images.lessButton} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => this.expand_collapse_Function(index)}
              style={{ alignItems: "center" }}
            >
              <Image source={images.moreButton} />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() =>
              this.travelRequestAction(
                globalConstants.APPROVED_TEXT,
                item,
                isDTRService
              )
            }
            style={{ alignItems: "center" }}
          >
            <Image source={images.approveButton} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              this.travelRequestAction(
                globalConstants.REJECTED_TEXT,
                item,
                isDTRService
              )
            }
            style={{ alignItems: "center" }}
          >
            <Image source={images.rejectButton} />
          </TouchableOpacity>
        </View>
      </BoxContainer>
    );
  };

  showRequestsView = () => {
    return (
      <View style={globalFontStyle.listContentViewGlobal}>
        <FlatList
          contentContainerStyle={globalFontStyle.listContentGlobal}
          data={this.state.localTravelAdvanceData}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) =>
            this.renderAdvTravelRequest(item, index)
          }
          keyExtractor={(item, index) => "pendingRequest_" + index.toString()}
          ItemSeparatorComponent={() => (
            <View style={globalFontStyle.listContentSeparatorGlobal} />
          )}
          refreshControl={
            <RefreshControl
              onRefresh={this.onRefresh}
              refreshing={this.state.isRefreshing}
            />
          }
        />
      </View>
    );
  };

  render() {
    const { query } = this.state;
    return (
      <ImageBackground source={images.loginBackground} style={styles.container}>
        <ActivityIndicatorView loader={this.props.travelAdvanceLoading} />
        <View style={globalFontStyle.subHeaderViewGlobal}>
          <SubHeader
            pageTitle={
              isDTRService
                ? globalConstants.TRAVEL_ADVANCE_DOMESTIC_TITLE
                : globalConstants.TRAVEL_ADVANCE_INTERNATIONAL_TITLE
            }
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
          {this.showRequestsView()}
        </View>
      </ImageBackground>
    );
  }
}

mapStateToProps = (state) => {
  return {
    empCode:
      state.loginReducer.loginData !== undefined
        ? state.loginReducer.loginData.SmCode
        : "",
    accessToken:
      state.loginReducer.loginData !== undefined
        ? state.loginReducer.loginData.Authkey
        : "",
    travelAdvanceData: state.travelAdvanceReducer.travelAdvanceData,
    travelAdvanceLoading: state.travelAdvanceReducer.travelAdvanceLoader,
    travelAdvanceError: state.travelAdvanceReducer.travelAdvanceError,
  };
};

mapDispatchToProps = (dispatch) => {
  return {
    resetTravelAdvanceHome: () => dispatch(resetTravelAdvanceStore()),
    fetchTravelAdvanceData: (
      empCode,
      authToken,
      isPullToRefreshActive,
      serviceType
    ) =>
      dispatch(
        TravelAdvanceFetchData(
          empCode,
          authToken,
          isPullToRefreshActive,
          serviceType
        )
      ),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TravelAdvanceScreen);

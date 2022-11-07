/*
Author: Gaganesh Sharma
*/

import React, { Component } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  LayoutAnimation,
  UIManager,
  Platform,
  FlatList,
  RefreshControl,
  ImageBackground,
  BackHandler,
  ScrollView,
  Dimensions,
  Image,
} from "react-native";
import { connect } from "react-redux";
import { styles } from "./styles";
import {
  travelActionCreator,
  resetTravelHome,
  travelFetchHistory,
} from "./travelAction";
import { SearchBar, Card } from "react-native-elements";
import SlidingUpPanel from "rn-sliding-up-panel";
import { globalFontStyle } from "../../components/globalFontStyle";
import ActivityIndicatorView from "../../GlobalComponent/myActivityIndicator";
import { TravelInfo } from "./travelInfo";
import SubHeader from "../../GlobalComponent/SubHeader";
import helper from "../../utilities/helper";
import { writeLog } from "../../utilities/logger";
import UserMessage from "../../components/userMessage";
import BoxContainer from "../../components/boxContainer.js/index.js";
import Seperator from "../../components/Seperator.js";
let appConfig = require("../../../appconfig");
import images from "../../images";
let globalConstants = require("../../GlobalConstants");
let constants = require("./constants");
let isDTRService = false;
let isITRService = false;
const { height } = Dimensions.get("window");
class TravelScreen extends Component {
  constructor(props) {
    super(props);
    if (Platform.OS === "android") {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    this.state = {
      localTravelData: [],
      localTravelSearchList: [],
      active_index: -1,
      updatedHeight: 0,
      isRefreshing: false,
      expand: false,
      userServiceType: this.props.navigation.state.params.serviceType,
      query: "",
      errorPopUp: false,
      isError: "",
    };
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    isPullToRefreshActive = false;
  }

  onRefresh = () => {
    this.setState({ isRefreshing: true });
    isPullToRefreshActive = true;
    this.wait(2000).then(() => this.setState({ isRefreshing: false }));
  };

  wait(timeout) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.resetTravelState());
      }, timeout);
    });
  }
  resetTravelState = () => {
    this.setState(
      {
        localTravelData: [],
      },
      this.fetchTravelData()
    );
  };

  fetchTravelData = () => {
    if (isDTRService) {
      this.props.fetchTravel(
        this.props.empCode,
        this.props.accessToken,
        "D",
        isPullToRefreshActive
      );
    } else if (isITRService) {
      this.props.fetchTravel(
        this.props.empCode,
        this.props.accessToken,
        "I",
        isPullToRefreshActive
      );
    }
  };
  componentDidUpdate() {
    if (
      this.props.travelError &&
      this.props.travelError.length > 0 &&
      this.state.isError === ""
    ) {
      setTimeout(() => {
        this.setState({ errorPopUp: true, isError: this.props.travelError });
      }, 1000);
    }
  }
  componentDidMount() {
    this.checkServiceType();
    writeLog("Landed on " + "TravelScreen");
    this.resetTravelState();
    BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
  }

  handleBackButtonClick() {
    writeLog("Clicked on " + "handleBackButtonClick" + " of " + "TravelScreen");
    isITRService = false;
    isDTRService = false;
    this.props.navigation.goBack(null);
    return true;
  }

  checkServiceType() {
    console.log("Checking service type : ", this.state.userServiceType);
    writeLog(
      "Invoked " +
        "checkServiceType" +
        " of " +
        "TravelScreen" +
        " & service type is : " +
        this.state.userServiceType
    );
    if (
      this.state.userServiceType != "" &&
      this.state.userServiceType != null &&
      this.state.userServiceType != undefined
    ) {
      if (this.state.userServiceType === "Domestic Travel Request") {
        isDTRService = true;
      } else if (
        this.state.userServiceType === "International Travel Request"
      ) {
        isITRService = true;
      }
    }
  }

  travelRequestAction(action, item) {
    writeLog("Clicked on " + "travelRequestAction" + " of " + "TravelScreen");
    this.props.navigation.navigate("TravelAction", {
      employeeDetails: item,
      action: action,
      loggedInDetails: this.state.loggedInDetails,
      checkDTRService: isDTRService,
    });
  }
  showError = () => {
    // console.log("In side show error of travel screen.")
    return (
      <UserMessage
        modalVisible={true}
        heading="Error"
        message={this.props.travelError}
        okAction={() => {
          this.onOkClick();
        }}
      />
    );
  };
  static getDerivedStateFromProps(nextProps, state) {
    if (nextProps.travelData.length > 0 && !state.query.length > 0) {
      return {
        localTravelData: nextProps.travelData,
        localTravelSearchList: nextProps.travelData,
      };
    } else {
      return null;
    }
  }

  showTravelInfoGrid = (itemName, itemValue) => {
    return (
      <TravelInfo
        label={itemName}
        value={itemValue == undefined ? "" : itemValue}
      />
    );
  };

  renderTravelSubView(item) {
    let shortNotice = item.IsShotNotice;
    return (
      <View>
        <View>
          {this.showTravelInfoGrid(constants.VISIT_TYPE_TEXT, item.VisitType)}
          {this.showTravelInfoGrid(
            constants.COST_CENTER_TEXT,
            item.CostCenterCode.trim() + " : " + item.CostCenterDesc.trim()
          )}
          {this.showTravelInfoGrid(
            constants.PROJECT_TEXT,
            item.ProjectDesc === "NA"
              ? "NA"
              : item.ProjectCode.trim() + " : " + item.ProjectDesc.trim()
          )}
          {this.showTravelInfoGrid(
            constants.BILLABLE_TEXT,
            item.Billable === "Y" ? "Yes" : "No"
          )}
          {this.showTravelInfoGrid(constants.ADVANCE_TEXT, item.Advance.trim())}
        </View>
      </View>
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
  renderTravelRequest(item, index) {
    let deptDate = item.DeptDate.replace(/-/g, " ");
    return (
      <BoxContainer>
        <View style={styles.view_One}>
          <TravelInfo label={"Document#"} value={item.DocumentNo.trim()} />;
          <TravelInfo
            label={"Employee"}
            value={item.DocOwnerCode.trim() + " : " + item.DocOwnerName.trim()}
          />
          ;
          <TravelInfo label={"Itinerary"} value={item.Itinerary.trim()} />;
          <TravelInfo label={"Departure Date"} value={deptDate} />;
        </View>
        <View style={styles.view_Two}>
          {this.state.active_index === index ? (
            this.renderTravelSubView(item)
          ) : (
            <View />
          )}
        </View>
        <Seperator />
        <View style={styles.bottomButtonContainer}>
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
            onPress={() => this.openNewPanel(item.DocumentNo.trim())}
            style={{ alignItems: "center" }}
          >
            <Image source={images.historyButton} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => this.travelRequestAction("Approved", item)}
            style={{ alignItems: "center" }}
          >
            <Image source={images.approveButton} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => this.travelRequestAction("Rejected", item)}
            style={{ alignItems: "center" }}
          >
            <Image source={images.rejectButton} />
          </TouchableOpacity>
        </View>
      </BoxContainer>
    );
  }

  showRequests() {
    if (this.state.localTravelData.length > 0) {
      return (
        <View style={globalFontStyle.listContentViewGlobal}>
          <FlatList
            contentContainerStyle={globalFontStyle.listContentGlobal}
            data={this.state.localTravelData}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) =>
              this.renderTravelRequest(item, index)
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
    } else {
      return null;
    }
  }

  updateSearch = (searchText) => {
    this.setState(
      {
        query: searchText,
      },
      () => {
        const filteredData = this.state.localTravelSearchList.filter(
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
          localTravelData: filteredData,
        });
      }
    );
  };

  onOkClick = () => {
    isITRService = false;
    isDTRService = false;
    this.props.resetTravelScreen();
    this.setState({ errorPopUp: false, isError: "" }, () => {
      helper.onOkAfterError(this);
    });
  };
  handleBack() {
    writeLog("Clicked on " + "handleBack" + " of " + "TravelScreen");
    isITRService = false;
    isDTRService = false;
    this.props.navigation.pop();
  }

  openNewPanel = (docNumber) => {
    this._panel.show(height / 1.3);
    {
      this.props.fetchTravelHistory(docNumber);
    }
  };

  renderCardItem = (data) => {
    // console.log("final card Data::::",data)
    let keys = [];
    for (let key in data) {
      keys.push(key);
    }
    return keys.map((key) => {
      if (data[key].IsActive) {
        return (
          <View style={globalFontStyle.cardDirection}>
            <Text style={globalFontStyle.cardLeftText}>{data[key].Key}</Text>
            <Text style={globalFontStyle.cardRightText}>
              {data[key].Value === "" ? "-" : data[key].Value}
            </Text>
          </View>
        );
      }
    });
  };

  renderTravelHistory = () => {
    return this.props.travelHistory.map((data, index) => {
      let myIndex = index + 1;
      return (
        <View key={index.toString()} style={globalFontStyle.panelContainer}>
          <View
            style={{
              flexDirection: "row",
              alignSelf: "center",
              borderColor: "light-grey",
              borderBottomWidth: 0.25,
              width: "96%",
              paddingVertical: 5,
              marginLeft: 5,
              zIndex: 10,
              borderBottomColor: "light-grey",
            }}
          >
            <Image source={images.rightCircleArrow} />
            <Text style={{ color: appConfig.BLUISH_COLOR, marginLeft: 10 }}>
              {globalConstants.HISTORY_RECORD_HEADING_TEXT + myIndex}
            </Text>
          </View>
          <View style={{ marginVertical: 10 }}>
            {this.renderCardItem(data)}
          </View>
        </View>
      );
    });
  };

  renderHistory = () => {
    return (
      <SlidingUpPanel
        ref={(c) => (this._panel = c)}
        draggableRange={{ top: height / 1.3, bottom: 0 }}
        height={height}
        onMomentumDragStart={(height) => {
          height;
        }}
        onMomentumDragEnd={0}
      >
        {(dragHandler) => (
          <View style={globalFontStyle.panelNewContainer}>
            <View style={globalFontStyle.dragHandler} {...dragHandler}>
              <TouchableOpacity
                style={{ marginTop: 10 }}
                onPress={() => this._panel.hide()}
              >
                <Image source={images.crossButton} />
              </TouchableOpacity>
            </View>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              style={{ flex: 1, marginBottom: height - height / 1.3 }}
            >
              <View style={{ marginBottom: 10 }}>
                {this.renderTravelHistory()}
              </View>
            </ScrollView>
          </View>
        )}
      </SlidingUpPanel>
    );
  };

  render() {
    const { query } = this.state;
    return (
      <ImageBackground style={styles.container} source={images.loginBackground}>
        {/* <View style={{ paddingVertical: moderateScale(12) }}> */}
        <View style={globalFontStyle.subHeaderViewGlobal}>
          <SubHeader
            pageTitle={
              isDTRService
                ? globalConstants.TRAVEL_DOMESTIC_TITLE
                : globalConstants.TRAVEL_INTERNATIONAL_TITLE
            }
            backVisible={true}
            logoutVisible={true}
            handleBackPress={() => this.handleBack()}
            navigation={this.props.navigation}
          />
        </View>
        <ActivityIndicatorView loader={this.props.travelLoading} />
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
          {this.showRequests()}
        </View>
        {this.renderHistory()}
        {/* </View> */}
        {/* {this.props.travelError.length>0 ? this.showError(): null} */}
        {this.state.errorPopUp === true ? this.showError() : null}
      </ImageBackground>
    );
  }
}

mapDispatchToProps = (dispatch) => {
  return {
    resetTravelScreen: () => dispatch(resetTravelHome()),
    fetchTravel: (empCode, authToken, serviceType, isPullToRefreshActive) =>
      dispatch(
        travelActionCreator(
          empCode,
          authToken,
          serviceType,
          isPullToRefreshActive
        )
      ),
    resetTravelHomePage: () => dispatch(resetTravelHome()),
    fetchTravelHistory: (docNumber) => dispatch(travelFetchHistory(docNumber)),
  };
};
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
    travelData: state.travelReducer.travelData,
    travelLoading: state.travelReducer.travelLoading,
    travelSearchList: state.travelReducer.travelData,
    dashBoardData: state.pendingReducer.pendingData,
    travelError: state.travelReducer.travelError,
    travelHistory: state.travelReducer.travelHistory,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TravelScreen);

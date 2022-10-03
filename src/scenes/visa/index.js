/*
Author: Mohit Garg(70024)
*/

import React, { Component } from "react";
import {
  Text,
  View,
  FlatList,
  RefreshControl,
  ImageBackground,
  TouchableOpacity,
  LayoutAnimation,
  TouchableHighlight,
  Alert,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import { connect } from "react-redux";
import { SearchBar, Card } from "react-native-elements";
import { styles } from "./styles";
import { moderateScale } from "../../components/fontScaling";
import ActivityIndicatorView from "../../GlobalComponent/myActivityIndicator";
import SubHeader from "../../GlobalComponent/SubHeader";
import { visaFetchData, resetVisaHome, visaFetchHistory } from "./visaAction";
import { globalFontStyle } from "../../components/globalFontStyle";
import CustomButton from "../../components/customButton";
import SlidingUpPanel from "rn-sliding-up-panel";
import SwipeablePanel from "rn-swipeable-panel";
import helper from "../../utilities/helper";
let globalConstants = require("../../GlobalConstants");
let constants = require("./constants");
const { height } = Dimensions.get("window");
import { writeLog } from "../../utilities/logger";
import UserMessage from "../../components/userMessage";
import BoxContainer from "../../components/boxContainer.js";
let appConfig = require("../../../appconfig");
import images from "../../images";
import Seperator from "../../components/Seperator";
class VisaScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isRefreshing: false,
      localVisaData: [],
      localVisaSearchData: [],
      query: "",
      active_index: -1,
      updatedHeight: 0,
      expand: false,
      swipeablePanelActive: false,
      myVisaID: "",
      errorPopUp: false,
      isError: "",
    };
    isPullToRefreshActive = false;
  }

  componentDidMount() {
    this.props.navigation.addListener("willFocus", this.onFocus);
    this.resetVisaState();
  }

  static getDerivedStateFromProps(nextProps, state) {
    // console.log("Visa getDerivedStateFromProps props:::::", nextProps);
    if (nextProps.visaData.length > 0 && !state.query.length > 0) {
      return {
        localVisaData: nextProps.visaData,
        localVisaSearchData: nextProps.visaData,
      };
    } else {
      return null;
    }
  }
  componentDidUpdate() {
    if (
      this.props.visaError &&
      this.props.visaError.length > 0 &&
      this.state.isError === ""
    ) {
      setTimeout(() => {
        this.setState({ errorPopUp: true, isError: this.props.visaError });
      }, 1000);
    }
  }
  componentWillUnmount() {
    this.setState({
      localVisaData: [],
      query: "",
    });
    this.props.resetVisaScreen();
  }
  onFocus = () => {
    writeLog("Landed on " + "VisaScreen");
    this.props.fetchVisaData(
      this.props.empCode,
      this.props.accessToken,
      isPullToRefreshActive
    );
  };

  onOkClick = () => {
    writeLog("Clicked on " + "onOkClick" + " of " + "Visa Screen");
    this.props.resetVisaScreen();
    this.setState({ errorPopUp: false, isError: "" }, () => {
      this.props.navigation.pop();
    });
  };

  showError = () => {
    // console.log("In side show error of Visa screen.");
    writeLog(
      "Dialog is open with exception " +
        this.props.visaError +
        " on " +
        "VisaScreen"
    );
    return (
      <UserMessage
        modalVisible={true}
        heading="Error"
        message={this.props.visaError}
        okAction={() => {
          this.onOkClick();
        }}
      />
    );
  };

  visaRequestAction(action, item) {
    writeLog(
      "Invoked " +
        "visaRequestAction" +
        " of " +
        "VisaScreen" +
        " for " +
        action
    );
    this.props.navigation.navigate("VisaApproveReject", {
      employeeDetails: item,
      action: action,
    });
  }

  renderVisaMoreView(item) {
    // console.log("visa Item is ",item);
    return (
      <View>
        <View>
          {this.showVisaRowGrid(
            constants.PROCESSING_TYPE_TEXT,
            item.ProcessingType
          )}
          {this.showVisaRowGrid(constants.TRAVEL_TYPE_TEXT, item.TravelType)}
          {this.showVisaRowGrid(
            constants.IS_OTHER_PROJECT_TEXT,
            item.IsOtherProject
          )}
          {this.showVisaRowGrid(
            item.IsOtherProject === "Yes"
              ? constants.ALTERNATE_COST_CENTER_TEXT
              : constants.COST_CENTER_TEXT,
            item.CostCode
          )}
          {this.showVisaRowGrid(
            item.IsOtherProject === "Yes"
              ? constants.ALTERNATE_PROJECT_TEXT
              : constants.PROJECT_TEXT,
            item.ProjectName
          )}
          {this.showVisaRowGrid(constants.CLIENT_NAME_TEXT, item.ClientName)}
          {this.showVisaRowGrid(
            constants.DURATION_OF_TRAVEL_TEXT,
            item.DurationOfTravel
          )}
          {this.showVisaRowGrid(
            constants.PURPOSE_OF_TRAVEL_TEXT,
            item.PurposeOfTravel
          )}
          {this.showVisaRowGrid(
            constants.REPORTING_MANAGER_TEXT,
            item.ReportingManager
          )}
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

  showVisaRowGrid = (itemName, itemValue) => {
    // console.log("item Name", itemName,"item value",itemValue);
    // if (itemValue != "" && itemValue != null && itemValue != undefined) {
    return (
      <View style={styles.rowStyle}>
        <Text style={[globalFontStyle.imageBackgroundLayout, styles.textTwo]}>
          {itemName}
        </Text>
        <Text style={[globalFontStyle.imageBackgroundLayout, styles.textTwo]}>
          {itemValue == undefined ? "" : itemValue}
        </Text>
      </View>
    );
    // } else {
    //   return null;
    // }
  };

  updateSearch = (searchText) => {
    this.setState(
      {
        query: searchText,
      },
      () => {
        const filteredData = this.state.localVisaSearchData.filter(
          (element) => {
            let str1 = element.VisaID;
            let str2 = element.EmpCode.trim();
            let str3 = element.EmpName.trim();
            let searchedText = str1.concat(str2).concat(str3);
            let elementSearched = searchedText.toString().toLowerCase();
            let queryLowerCase = this.state.query.toString().toLowerCase();
            return elementSearched.indexOf(queryLowerCase) > -1;
          }
        );
        this.setState({
          localVisaData: filteredData,
        });
      }
    );
  };

  handleBack() {
    writeLog("Clicked on " + "handleBack" + " of " + "VisaScreen");
    this.props.resetVisaScreen();
    this.props.navigation.pop();
  }

  renderVisaRequest = (item, index) => {
    let startDate =
      item.TravelStartDate === undefined
        ? ""
        : item.TravelStartDate.replace(/-/g, " ");
    let endDate =
      item.TravelEndDate === undefined
        ? ""
        : item.TravelEndDate.replace(/-/g, " ");
    return (
      <BoxContainer style={{ marginHorizontal: 10 }}>
        <View style={styles.view_One}>
          {this.showVisaRowGrid(
            constants.DOCUMENT_NUMBER_TEXT,
            item.VisaID.trim()
          )}
          {this.showVisaRowGrid(constants.EMPLOYEE_TEXT, item.EmpName.trim())}
          {this.showVisaRowGrid(constants.STATE_TEXT, item.StateDesc)}
          {this.showVisaRowGrid(constants.COUNTRY_TEXT, item.Country.trim())}
          {this.showVisaRowGrid(constants.VISA_TYPE_TEXT, item.VisaType.trim())}
          {this.showVisaRowGrid(
            constants.VISA_SUB_TYPE_TEXT,
            item.VisaSubType.trim()
          )}
          {this.showVisaRowGrid(constants.TRAVEL_START_DATE_TEXT, startDate)}
          {this.showVisaRowGrid(constants.TRAVEL_END_DATE_TEXT, endDate)}
        </View>
        <View style={styles.view_Two}>
          {this.state.active_index === index
            ? this.renderVisaMoreView(item)
            : null}
        </View>
        <Seperator />
        <View style={styles.buttonContainer}>
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
            onPress={() => this.openNewPanel(item.VisaID)}
            style={{ alignItems: "center" }}
          >
            <Image source={images.historyButton} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              this.visaRequestAction(globalConstants.APPROVED_TEXT, item)
            }
            style={{ alignItems: "center" }}
          >
            <Image source={images.approveButton} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              this.visaRequestAction(globalConstants.REJECTED_TEXT, item)
            }
            style={{ alignItems: "center" }}
          >
            <Image source={images.rejectButton} />
          </TouchableOpacity>
        </View>
      </BoxContainer>
    );
  };

  onRefresh = () => {
    this.setState({ isRefreshing: true });
    isPullToRefreshActive = true;
    this.wait(2000).then(() => this.setState({ isRefreshing: false }));
  };

  wait(timeout) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.resetVisaState());
      }, timeout);
    });
  }

  resetVisaState = () => {
    this.setState(
      {
        localVisaData: [],
      },
      () =>
        this.props.fetchVisaData(
          this.props.empCode,
          this.props.accessToken,
          isPullToRefreshActive
        )
    );
  };

  showRequestsView = () => {
    if (this.state.localVisaData.length > 0) {
      return (
        <FlatList
          contentContainerStyle={globalFontStyle.listContentGlobal}
          data={this.state.localVisaData}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => this.renderVisaRequest(item, index)}
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
      );
    } else {
      return null;
    }
  };

  openPanel = (visaID) => {
    this.setState({ swipeablePanelActive: true }, () => {
      this.props.fetchVisaHistory(visaID);
    });
  };

  closePanel = () => {
    this.setState({ swipeablePanelActive: false });
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

  renderVisaHistory = () => {
    return this.props.visaHistory.map((data, index) => {
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

  openNewPanel = (visaID) => {
    this._panel.show(height / 1.3);
    {
      this.props.fetchVisaHistory(visaID);
    }
  };

  renderHistory = () => {
    return (
      <SlidingUpPanel
        ref={(c) => (this._panel = c)}
        draggableRange={{ top: height / 1.3, bottom: 0 }}
        // showBackdrop={false}
        height={height}
        // allowMomentum={true}
        onMomentumDragStart={(height) => {
          height;
        }} //height of panel here : height/1.3
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
                {this.renderVisaHistory()}
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
      <ImageBackground style={{ flex: 1 }} source={images.loginBackground}>
        <View style={styles.container}>
          <ActivityIndicatorView loader={this.props.visaLoading} />
          {/* <View style={styles.innerContainer}> */}
          <View style={globalFontStyle.subHeaderViewGlobal}>
            <SubHeader
              pageTitle={globalConstants.VISA_TITLE}
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
          <View>{this.showRequestsView()}</View>
          {this.renderHistory()}
          {this.state.errorPopUp === true ? this.showError() : null}
          {this.props.visaError.length > 0 ? this.showError() : null}
        </View>
      </ImageBackground>
    );
  }
}

mapDispatchToProps = (dispatch) => {
  // console.log("map dispatch to prop visa", dispatch);
  return {
    resetVisaScreen: () => dispatch(resetVisaHome()),
    fetchVisaData: (empCode, authToken, isPullToRefreshActive) =>
      dispatch(visaFetchData(empCode, authToken, isPullToRefreshActive)),
    fetchVisaHistory: (visaID) => dispatch(visaFetchHistory(visaID)),
  };
};

mapStateToProps = (state) => {
  // console.log("map state to prop visa", state.visaReducer);
  return {
    visaLoading: state.visaReducer.visaLoader,
    visaError: state.visaReducer.visaError,
    visaData: state.visaReducer.visaData,
    visaSearchData: state.visaReducer.visaData,
    visaHistory: state.visaReducer.visaHistory,
    empCode:
      state.loginReducer.loginData !== undefined
        ? state.loginReducer.loginData.SmCode
        : "",
    accessToken:
      state.loginReducer.loginData !== undefined
        ? state.loginReducer.loginData.Authkey
        : "",
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VisaScreen);

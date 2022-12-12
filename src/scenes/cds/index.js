/*
Author: Mohit Garg(70024)
*/

import React, { Component } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  ImageBackground,
  Alert,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { connect } from "react-redux";
import ActivityIndicatorView from "../../GlobalComponent/myActivityIndicator";
import { cdsFetchData, resetCdsHome, cdsFetchHistory } from "./cdsAction";
import { SearchBar, Card } from "react-native-elements";
import CustomButton from "../../components/customButton";
import SlidingUpPanel from "rn-sliding-up-panel";
import { globalFontStyle } from "../../components/globalFontStyle";
import { styles } from "./styles";
import SubHeader from "../../GlobalComponent/SubHeader";
import { writeLog } from "../../utilities/logger";
import UserMessage from "../../components/userMessage";
import images from "../../images";
import { setHeight } from "../../components/fontScaling";
let globalConstants = require("../../GlobalConstants");
let constants = require("./constants");


export class CDSScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isRefreshing: false,
      localCdsData: [],
      localCdsSearchData: [],
      query: "",
      showModal: false,
      errorMessage: "",
    };
    isPullToRefreshActive = false;
  }
  componentDidMount() {
    writeLog("Landed on " + "CDSScreen");
    this.props.fetchCdsData(
      this.props.empCode,
      this.props.accessToken,
      isPullToRefreshActive
    );
  }
  componentDidUpdate() {
    if (
      this.props.cdsError &&
      this.props.cdsError.length > 0 &&
      this.state.errorMessage === ""
    ) {
      setTimeout(() => {
        this.setState({ showModal: true, errorMessage: this.props.cdsError });
      }, 1000);
    }
  }

  static getDerivedStateFromProps(nextProps, state) {
    // console.log("next props::::::", nextProps)
    if (
      nextProps.cdsData?.length > 0 &&
      nextProps.cdsData[0] &&
      !state.query.length > 0
    ) {
      return {
        localCdsData: nextProps.cdsData,
        localCdsSearchData: nextProps.cdsData,
      };
    } else {
      return null;
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
        resolve(this.resetCdsState());
      }, timeout);
    });
  }

  resetCdsState = () => {
    this.props.resetCdsStore();
    this.props.fetchCdsData(
      this.props.empCode,
      this.props.accessToken,
      isPullToRefreshActive
    );
  };

  showCdsRowGrid = (itemName, itemValue) => {
    if (
      itemValue != "" &&
      itemValue != null &&
      itemValue != undefined &&
      itemValue != " : "
    ) {
      return (
        <View style={styles.rowStyle}>
          <Text style={[globalFontStyle.imageBackgroundLayout, styles.textOne]}>
            {itemName}
          </Text>
          <Text
            style={
              itemName === constants.UTILIZATION_TEXT &&
              itemValue === "Non-Budget"
                ? [globalFontStyle.imageBackgroundLayout, styles.textTwoRed]
                : [globalFontStyle.imageBackgroundLayout, styles.textTwo]
            }
          >
            {itemValue}
          </Text>
        </View>
      );
    } else {
      return null;
    }
  };

  cdsDetails = (item) => {
    writeLog("Clicked on " + "cdsDetails" + " of " + "CDSScreen");
    this.props.navigation.navigate("CdsDetails", { docDetails: item });
  };

  renderCdsRequest = (item, i) => {
    return (
      <View>
        <ImageBackground style={styles.cardBackground} resizeMode="cover">
          <View style={styles.cardStyle}>
            {this.showCdsRowGrid(
              globalConstants.DOCUMENT_NUMBER_TEXT,
              item.CDSCode
            )}
            {this.showCdsRowGrid(
              globalConstants.EMPLOYEE_TEXT,
              item.EmpCode.trim()
                .concat(" : ")
                .concat(item.EmpName.trim())
            )}
            {this.showCdsRowGrid(
              constants.CDS_STATUS_DESC_TEXT,
              item.CDSStatusDesc.trim()
            )}
            {this.showCdsRowGrid(
              globalConstants.COST_CENTER_TEXT,
              item.CostCenterCode.trim()
                .concat(" : ")
                .concat(item.CostCenterName.trim())
            )}
            {this.showCdsRowGrid(
              globalConstants.PROJECT_TEXT,
              item.ProjectCode.trim()
                .concat(" : ")
                .concat(item.ProjectName.trim())
            )}
            {this.showCdsRowGrid(
              globalConstants.COMPANY_CODE_TEXT,
              item.CompCode
            )}
            {this.showCdsRowGrid(
              constants.UTILIZATION_TEXT,
              item.UtilizationDesc
            )}
            {this.showCdsRowGrid(
              constants.TOTAL_AMOUNT_TEXT,
              item.CDSFinalAmount
            )}
          </View>
          <View style={styles.historyViewStyle}>
            <TouchableOpacity onPress={() => this.openNewPanel(item.CDSCode)}>
              <Text style={globalFontStyle.hyperlinkText}>
                {globalConstants.HISTORY_TEXT}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.proceedView}>
            <View style={styles.proceedInnerView}>
              <CustomButton
                label={constants.PROCEED_TEXT}
                positive={true}
                performAction={() => this.cdsDetails(item)}
              />
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  };

  showRequestsView = () => {
    return (
      <View style={globalFontStyle.listContentViewGlobal}>
        <FlatList
          contentContainerStyle={globalFontStyle.listContentGlobal}
          data={this.state.localCdsData}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => this.renderCdsRequest(item, index)}
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

  updateSearch = (searchText) => {
    this.setState(
      {
        query: searchText,
      },
      () => {
        const filteredData = this.state.localCdsSearchData.filter((element) => {
          let str1 = element.CDSCode;
          let str2 = element.EmpCode;
          let str3 = element.EmpName;
          let searchedText = str1.concat(str2).concat(str3);
          let elementSearched = searchedText.toString().toLowerCase();
          let queryLowerCase = this.state.query.toString().toLowerCase();
          return elementSearched.indexOf(queryLowerCase) > -1;
        });
        this.setState({
          localCdsData: filteredData,
        });
      }
    );
  };
  showError = () => {
    // console.log("In side show error of voucher screen.")
    writeLog(
      "Dialog is open with exception " +
        this.props.cdsError +
        " on " +
        "CDSScreen"
    );
    return (
      <UserMessage
        modalVisible={true}
        heading="Error"
        message={this.props.cdsError}
        okAction={() => {
          this.onOkClick();
        }}
      />
    );
  };
  onOkClick = () => {
    writeLog("Clicked on " + "onOkClick" + " of " + "CDSScreen");
    this.props.resetCdsStore();
    this.setState({ showModal: false, errorMessage: "" }, () => {
      this.props.navigation.navigate("DashBoard");
    });
  };

  handleBack = () => {
    writeLog("Clicked on " + "handleBack" + " of " + "CDSScreen");
    this.props.resetCdsStore();
    this.props.navigation.pop();
  };

  openNewPanel = (cdsCode) => {
    writeLog(
      "Clicked on " + "openNewPanel" + " of " + "CDSScreen" + " for " + cdsCode
    );
    this._panel.show(setHeight(80));
    {
      this.props.fetchCdsHistory(cdsCode);
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
              {data[key].Value === ""
                ? "-"
                : data[key].Value.replace(":", " : ")}
            </Text>
          </View>
        );
      }
    });
  };

  renderCdsHistory = () => {
    return this.props.cdsHistory.map((data, index) => {
      let myIndex = index + 1;
      return (
        <View style={globalFontStyle.panelContainer}>
          <View>
            <Text>{globalConstants.HISTORY_RECORD_HEADING_TEXT + myIndex}</Text>
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
        draggableRange={{ top: setHeight(75), bottom: 0 }}
        height={setHeight(100)}
        onMomentumDragStart={(height) => {
          setHeight(100);
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
              style={{ flex: 1, marginBottom:setHeight(10)}}
            >
              <View style={{ marginBottom: 10 }}>
                {this.renderCdsHistory()}
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
          <ActivityIndicatorView loader={this.props.cdsLoading} />
          {/* <View style={styles.innerContainer}> */}
          <View style={globalFontStyle.subHeaderViewGlobal}>
            <SubHeader
              pageTitle={globalConstants.CDS_TITLE}
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
              round={true}
              autoCapitalize="none"
              autoCompleteType="off"
              autoCorrect={false}
              containerStyle={globalFontStyle.searchGlobal}
            />
          </View>
          <View style={globalFontStyle.contentViewGlobal}>
            {this.showRequestsView()}
          </View>
          {this.renderHistory()}
          {/* </View> */}
          {this.state.showModal === true ? this.showError() : null}
        </View>
      </ImageBackground>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    empCode:
      state.loginReducer.loginData !== undefined
        ? state.loginReducer.loginData.SmCode
        : "",
    accessToken:
      state.loginReducer.loginData !== undefined
        ? state.loginReducer.loginData.Authkey
        : "",
    cdsData: state.cdsReducer.cdsData,
    cdsError: state.cdsReducer.cdsError,
    cdsLoading: state.cdsReducer.cdsLoader,
    cdsHistory: state.cdsReducer.cdsHistory,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    resetCdsStore: () => dispatch(resetCdsHome()),
    fetchCdsData: (empCode, authToken, isPullToRefreshActive) =>
      dispatch(cdsFetchData(empCode, authToken, isPullToRefreshActive)),
    fetchCdsHistory: (cdsCode) => dispatch(cdsFetchHistory(cdsCode)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CDSScreen);

import React, { Component } from "react";
import {
  View,
  Text,
  BackHandler,
  TextInput,
  TouchableOpacity,
  Image,
  ImageBackground,
  Dimensions,
  RefreshControl,
  LayoutAnimation,
} from "react-native";
import { connect } from "react-redux";
import SubHeader from "../../../GlobalComponent/SubHeader";
import { styles } from "./styles";
import { globalFontStyle } from "../../../components/globalFontStyle";
import { LabelTextDashValue } from "../../../GlobalComponent/LabelText/LabelText";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import {
  getITServicePendingRecords,
  resetITPending,
  resetITDesk,
  getITHistory,
} from "./pendingRequestAction";
import ActivityIndicatorView from "../../../GlobalComponent/myActivityIndicator";
import { SearchBar } from "react-native-elements";
import { ApproveRejectCards } from "../../../GlobalComponent/ApproveRejectList/ApproveRejectList";
import { HistoryView } from "../../../GlobalComponent/HistoryView/HistoryView";
import UserMessage from "../../../components/userMessage";
import { writeLog } from "../../../utilities/logger";
import images from "../../../images";
import BoxContainer from "../../../components/boxContainer.js";
import Seperator from "../../../components/Seperator";
let globalConstants = require("../../../GlobalConstants");
class PendingRequestScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isRefreshing: false,
      localITSearchData: [],
      ITSearchData: [],
      query: "",
      actionPopUP: false,
      actionMessage: "",
      modalVisible: false,
      updatedHeight: 0,
      expand: false,
      active_index: -1,
      temp_index: -1,
    };
    isPullToRefreshActive = false;
    this._panel = React.createRef();
  }
  static getDerivedStateFromProps = (nextProps, state) => {
    if (nextProps.itPendingData.length > 0 && !state.query.length > 0) {
      return {
        ITSearchData: nextProps.itPendingData,
        localITSearchData: nextProps.itPendingData,
      };
    }
    if (nextProps.itPendingData.length === 0 && !state.query.length > 0) {
      return {
        ITSearchData: nextProps.itPendingData,
        localITSearchData: nextProps.itPendingData,
      };
    } else {
      return null;
    }
  };
  componentDidUpdate() {
    if (
      this.props.itError &&
      this.props.itError.length > 0 &&
      this.state.actionMessage === ""
    ) {
      setTimeout(() => {
        this.setState({ actionPopUP: true, actionMessage: this.props.itError });
      }, 1000);
    }
  }
  componentDidMount() {
    BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
    this.props.navigation.addListener("willFocus", this.onFocus);
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
          this.props.getRecords(
            this.props.loginData.SmCode,
            this.props.loginData.Authkey,
            isPullToRefreshActive
          )
        );
      }, timeout);
    });
  }
  onFocus = () => {
    this.props.getRecords(
      this.props.loginData.SmCode,
      this.props.loginData.Authkey,
      isPullToRefreshActive
    );
  };

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      info: errorInfo,
    });
  }
  componentWillUnmount() {
    BackHandler.removeEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
  }

  handleBackButtonClick = () => {
    this.handleBack();
    return true;
  };

  handleBack = () => {
    this.setState(
      { localITSearchData: [], actionPopUP: false, actionMessage: "" },
      () => {
        this.props.resetITData();
        this.props.navigation.pop();
      }
    );
  };

  buttonAction = (item, action) => {
    console.log("Button clicked with " + action + " of item ", item);
    this.props.navigation.navigate("PendingRequestDetail", {
      pendingRecord: item,
      action: action,
    });
  };
  openNewPanel = (item, panel) => {
    this.props.getHistoryData(
      this.props.loginData.SmCode,
      this.props.loginData.Authkey,
      item.RequestID
    );
    if (!this.props.itLoading) {
      this.setState({ modalVisible: true });
    }
  };

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
      this.setState(
        {
          active_index: -1,
        },
        () => {
          this.setState({
            updatedHeight: 0,
            expand: false,
          });
        }
      );
    } else {
      this.setState(
        {
          active_index: i,
        },
        () => {
          this.setState({
            updatedHeight: 150,
            expand: true,
          });
        }
      );
    }
  };

  renderItems = (item, index) => {
    return (
      <BoxContainer>
        <LabelTextDashValue
          heading="Service Number"
          description={item.ServiceNumber}
        />
        <LabelTextDashValue
          heading="Requester Code"
          description={item.RequesterName}
        />
        <LabelTextDashValue
          heading="Category"
          description={item.RequestCategoryName}
        />
        <LabelTextDashValue
          heading="Pending Since"
          description={item.ModifiedOn}
        />
        {/* <DetailHistoryPanel
					index={index}
					item={item}
					openNewPanel={(item) => {
						this.openNewPanel(item);
					}}>

				</DetailHistoryPanel> */}
        {this.state.active_index === index ? (
          <View>
            <LabelTextDashValue
              heading="Subcategory"
              description={item.RequestSubCategoryName}
            />
            <LabelTextDashValue
              heading="Description"
              description={item.RequestDescription}
            />
          </View>
        ) : (
          <View />
        )}
        <Seperator />
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
            onPress={() => this.openNewPanel(item)}
            style={{ alignItems: "center" }}
          >
            <Image source={images.historyButton} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              this.buttonAction(item, "APPROVE");
            }}
            style={{ alignItems: "center" }}
          >
            <Image source={images.approveButton} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => this.buttonAction(item, "REJECT")}
            style={{ alignItems: "center" }}
          >
            <Image source={images.rejectButton} />
          </TouchableOpacity>
        </View>
      </BoxContainer>
    );
  };
  onRemarksInput = (text) => {
    console.log("Remarks entered", text);
  };
  updateSearch = (searchText) => {
    this.setState(
      {
        query: searchText,
      },
      () => {
        const filteredData = this.state.localITSearchData.filter((element) => {
          let str1 = element.ServiceNumber;
          let str2 = element.RequesterName;
          // let str3 = element.EmpName
          let searchedText = str1.concat(str2);
          let elementSearched = searchedText.toString().toLowerCase();
          let queryLowerCase = this.state.query.toString().toLowerCase();
          return elementSearched.indexOf(queryLowerCase) > -1;
        });
        this.setState({
          ITSearchData: filteredData,
        });
      }
    );
  };
  onHistoryClose = () => {
    this.setState({ modalVisible: false }, () => {});
  };
  onOkClick = () => {
    writeLog("Clicked on " + "onOkClick" + " of " + "PendingRequest screen");
    this.props.resetITData();
    this.setState(
      { localITSearchData: [], actionPopUP: false, actionMessage: "" },
      () => {
        this.props.navigation.navigate("DashBoardNew2");
      }
    );
  };
  showPopUp = () => {
    writeLog(
      "Dialog is open with exception " +
        this.props.itError +
        " on " +
        "PendingRequest screen"
    );
    return (
      <UserMessage
        modalVisible={true}
        heading="Error"
        message={this.props.itError}
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
      <ImageBackground source={images.loginBackground} style={styles.container}>
        <View style={globalFontStyle.subHeaderViewGlobal}>
          <SubHeader
            pageTitle={globalConstants.PENDING_REQUEST_IT_TITLE}
            backVisible={true}
            logoutVisible={true}
            handleBackPress={() => this.handleBack()}
            navigation={this.props.navigation}
          />
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
          <ActivityIndicatorView loader={this.props.itLoading} />
        </View>
        <KeyboardAwareScrollView
          style={styles.keyBoardContainer}
          keyboardShouldPersistTaps="never"
          refreshControl={
            <RefreshControl
              onRefresh={this.onRefresh}
              refreshing={this.state.isRefreshing}
            />
          }
        >
          <ApproveRejectCards
            data={this.state.ITSearchData}
            renderItem={({ item, index }) => this.renderItems(item, index)}
            refreshing={this.state.isRefreshing}
          />
        </KeyboardAwareScrollView>
        {this.props.itHistoryData && (
          <HistoryView
            historyData={this.props.itHistoryData}
            forwardedRef={this._panel}
            isComingFromVoucher={false}
            visibility={this.state.modalVisible}
            onClose={() => this.onHistoryClose()}
          />
        )}
        {this.state.actionPopUP === true ? this.showPopUp() : null}
      </ImageBackground>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loginData: state?.loginReducer?.loginData,
    itPendingData: state?.itDeskPendingReducer?.itDeskPendingData,
    itLoading: state?.itDeskPendingReducer?.itDeskLoading,
    itHistoryData: state?.itDeskPendingReducer?.itDeskHistory,
    itError: state?.itDeskPendingReducer?.itDeskError,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getRecords: (loginId, authKey, isPullToRefreshActive) =>
      dispatch(
        getITServicePendingRecords(loginId, authKey, isPullToRefreshActive)
      ),
    resetITData: () => dispatch(resetITDesk()),
    getHistoryData: (loginId, authKey, id) =>
      dispatch(getITHistory(loginId, authKey, id)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PendingRequestScreen);

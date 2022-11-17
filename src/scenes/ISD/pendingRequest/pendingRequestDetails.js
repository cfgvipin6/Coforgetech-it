import React, { Component } from "react";
import { View, ImageBackground, BackHandler } from "react-native";
import { connect } from "react-redux";
import { styles } from "./styles";
import UserMessage from "../../../components/userMessage";
import SubHeader from "../../../GlobalComponent/SubHeader";
import ActivityIndicatorView from "../../../GlobalComponent/myActivityIndicator";
import CustomButton from "../../../components/customButton";
import { LabelTextDashValue } from "../../../GlobalComponent/LabelText/LabelText";
import { Remarks } from "../../../GlobalComponent/Remarks/Remarks";
import { approveITPendingRecord, resetITDesk } from "./pendingRequestAction";
import { REQUEST_SUCCESS } from "./constants";
let globalConstants = require("../../../GlobalConstants");
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import images from "../../../images";
import { writeLog } from "../../../utilities/logger";

class ITPendingDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pendingRecord: this.props.navigation.state.params.pendingRecord,
      action: this.props.navigation.state.params.action,
      remarks: "",
      actionPopUP: false,
      actionMessage: "",
    };
  }
  componentDidUpdate() {
    if (
      this.props.itDeskError &&
      this.props.itDeskError.length > 0 &&
      this.state.actionMessage === ""
    ) {
      setTimeout(() => {
        this.setState({
          actionPopUP: true,
          actionMessage: this.props.itDeskError,
        });
      }, 1000);
    } else if (
      this.props.itDeskActionData &&
      this.props.itDeskActionData.length > 0 &&
      this.state.actionMessage === ""
    ) {
      setTimeout(() => {
        this.setState({
          actionPopUP: true,
          actionMessage: this.props.itDeskActionData[0].message,
        });
      }, 1000);
    }
  }
  componentDidMount() {
    writeLog("Landed on " + "ITPendingDetails");
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

  handleBackButtonClick = () => {
    this.handleBack();
    return true;
  };

  handleBack = () => {
    this.props.navigation.pop();
  };

  onOkClick = () => {
    writeLog("Clicked on " + "onOkClick" + " of " + "ITPendingDetails");
    this.props.resetITDesk();
    this.setState({ actionPopUP: false, actionMessage: "" }, () => {
      this.props.navigation.navigate("PendingRequestIT");
    });
  };
  showPopUp = () => {
    writeLog(
      "Dialog is open with exception " +
        this.props.itDeskError +
        " on " +
        "ITPendingDetails"
    );
    let msgToShow =
      this.state.actionMessage === "success"
        ? REQUEST_SUCCESS
        : this.props.itDeskError;
    return (
      <UserMessage
        modalVisible={true}
        heading={this.state.actionMessage === "success" ? "Success" : "Error"}
        message={msgToShow}
        okAction={() => {
          this.onOkClick();
        }}
      />
    );
  };

  takeAction = () => {
    if (this.state.remarks.trim() === "") {
      return alert("Please enter remarks.");
    }
    console.log("Action is ", this.state.action);
    this.props.approveRecords(
      this.props.loginData.SmCode,
      this.props.loginData.Authkey,
      this.state.pendingRecord,
      this.state.remarks,
      this.state.action
    );
  };

  onRemarks = (remarkText) => {
    this.setState({ remarks: remarkText }, () => {
      console.log("Remarks found", this.state.remarks);
    });
  };
  renderMainView = () => {
    return (
      <ImageBackground style={{ flex: 1 }} source={images.loginBackground}>
        <View>
          <SubHeader
            pageTitle={globalConstants.PENDING_DETAILS_IT_TITLE}
            backVisible={true}
            logoutVisible={true}
            handleBackPress={() => this.handleBack()}
            navigation={this.props.navigation}
          />
          <ImageBackground
            style={styles.cardDetailBackground}
            resizeMode="cover"
          >
            <LabelTextDashValue
              heading="Service Number"
              description={this.state.pendingRecord.ServiceNumber}
            />
            <LabelTextDashValue
              heading="Requester Code"
              description={this.state.pendingRecord.RequesterName}
            />
            <LabelTextDashValue
              heading="Category"
              description={this.state.pendingRecord.RequestCategoryName}
            />
            <LabelTextDashValue
              heading="Subcategory"
              description={this.state.pendingRecord.RequestSubCategoryName}
            />
            <LabelTextDashValue
              heading="Pending Since"
              description={this.state.pendingRecord.ModifiedOn}
            />
            <LabelTextDashValue
              heading="Description"
              description={this.state.pendingRecord.RequestDescription}
            />
          </ImageBackground>
          <Remarks
            onchangeText={(text) => this.onRemarks(text)}
            scrollRef={(r) => {
              this._textInputRef = r;
            }}
          />
          <CustomButton
            label={this.state.action}
            positive={this.state.action === "APPROVE" ? true : false}
            performAction={() => this.takeAction()}
          />
          {this.state.actionPopUP === true ? this.showPopUp() : null}
        </View>
      </ImageBackground>
    );
  };
  render() {
    return (
      <View style={styles.detailContainer}>
        <KeyboardAwareScrollView
          getTextInputRefs={() => {
            return [this._textInputRef];
          }}
          keyboardShouldPersistTaps="never"
        >
          {this.renderMainView()}
          <ActivityIndicatorView loader={this.props.loading} />
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loading:
      state &&
      state.itDeskPendingReducer &&
      state.itDeskPendingReducer.itDeskLoading,
    loginData: state && state.loginReducer && state.loginReducer.loginData,
    itDeskError:
      state &&
      state.itDeskPendingReducer &&
      state.itDeskPendingReducer.itDeskError,
    itDeskActionData:
      state &&
      state.itDeskPendingReducer &&
      state.itDeskPendingReducer.itDeskActionData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    resetITDesk: () => dispatch(resetITDesk()),
    approveRecords: (empID, authKey, record, remarks, action) =>
      dispatch(approveITPendingRecord(empID, authKey, record, remarks, action)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ITPendingDetails);

/*
Author: Mohit Garg(70024)
*/

import React, { Component } from "react";
import {
  Text,
  View,
  ScrollView,
  BackHandler,
  ImageBackground,
} from "react-native";
import { styles } from "./styles";
import { userInfo, resetAddress } from "./addressAction";
import { resetAddressData } from "./addressAction";
import ActivityIndicatorView from "../../GlobalComponent/myActivityIndicator";
import helper from "../../utilities/helper";
import SubHeader from "../../GlobalComponent/SubHeader";
import { connect } from "react-redux";
import { globalFontStyle } from "../../components/globalFontStyle";
import { writeLog } from "../../utilities/logger";
import UserMessage from "../../components/userMessage";
let appConfig = require("../../../appconfig");
let globalConstants = require("../../GlobalConstants");
import BoxContainer from "../../components/boxContainer.js/index.js";
import images from "../../images";

class AddressScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addressResponse: [],
      errorPopUp: false,
      isError: "",
    };
  }

  onFocus = () => {
    writeLog("Landed on " + "AddressScreen");
    this.getUserAddressInfo();
  };
  componentDidUpdate() {
    if (
      this.props.addressError &&
      this.props.addressError.length > 0 &&
      this.state.isError === ""
    ) {
      setTimeout(() => {
        this.setState({ errorPopUp: true, isError: this.props.addressError });
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
  static getDerivedStateFromProps = (nextProps, state) => {
    if (
      nextProps.addressData &&
      nextProps.addressData.length > 0 &&
      nextProps.addressError === ""
    ) {
      const data = nextProps.addressData;
      return { addressResponse: data };
    } else if (
      nextProps.addressError != "" &&
      nextProps.addressData.length === 0
    ) {
      return { addressResponse: [] };
    } else {
      return null;
    }
  };
  async getUserAddressInfo() {
    this.setState({
      addressResponse: [],
    }),
      this.props.getUserAddressInformation(this.props.loginData);
  }
  onOkClick = () => {
    writeLog("Clicked on " + "onOkClick" + " of " + "AddressScreen");
    this.props.resetAddressScreen();
    this.setState({ errorPopUp: false, isError: "" }, () => {
      helper.onOkAfterError(this);
    });
  };
  showError() {
    writeLog(
      "Dialog is open with exception " +
        this.props.addressError +
        " on " +
        "AddressScreen"
    );
    return (
      <UserMessage
        modalVisible={true}
        heading="Error"
        message={this.props.addressError}
        okAction={() => {
          this.onOkClick();
        }}
      />
    );
  }

  cardAddressKeyValue(obj) {
    for (let prop in obj) {
      let newValue = obj.Value;
      if (newValue.trim().length === 0) {
        newValue = "-";
      }
      return (
        <View style={styles.keyValueTextView}>
          <Text style={globalFontStyle.cardLeftText}>{obj.Key}</Text>
          <Text style={globalFontStyle.cardRightText}>{newValue}</Text>
        </View>
      );
    }
  }

  myCardView(addressData) {
    let addressKeyValueArr = [];
    let titleValue = "";
    for (let prop in addressData) {
      key = prop;
      obj = addressData[prop];
      if (key != "Type") {
        addressKeyValueArr.push(this.cardAddressKeyValue(obj));
      } else {
        titleValue = addressData[prop].Value;
      }
    }
    return (
      <BoxContainer>
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 20,
            alignSelf: "center",
            backgroundColor: appConfig.APP_SKY,
            width: "100%",
            textAlign: "center",
            color: appConfig.BLUISH_COLOR,
          }}
        >
          {titleValue}
        </Text>
        <View style={{ margin: 10 }}>{addressKeyValueArr}</View>
      </BoxContainer>
    );
  }

  handleBack() {
    this.props.reset();
    this.props.resetAddressScreen();
    this.props.navigation.pop();
  }

  render() {
    // console.log("Render called")
    let addressArr = [];
    let addressList = this.state.addressResponse;
    for (let key in addressList) {
      addressArr.push(this.myCardView(addressList[key]));
    }
    return (
      <ImageBackground style={{ flex: 1 }} source={images.loginBackground}>
        <View style={styles.container}>
          <View style={globalFontStyle.subHeaderViewGlobal}>
            <SubHeader
              pageTitle={globalConstants.ADDRESS_TITLE}
              backVisible={true}
              logoutVisible={true}
              handleBackPress={() => this.handleBack()}
              navigation={this.props.navigation}
            />
          </View>
          <View style={globalFontStyle.contentViewGlobal}>
            <ScrollView keyboardShouldPersistTaps="handled">
              <View style={styles.innerScrollViewStyle}>
                {addressArr}
                {this.state.errorPopUp === true ? this.showError() : null}
              </View>
            </ScrollView>
          </View>
          <ActivityIndicatorView loader={this.props.loading} />
        </View>
      </ImageBackground>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getUserAddressInformation: (loginData) => dispatch(userInfo(loginData)),
    resetAddressScreen: () => dispatch(resetAddress()),
    reset: () => dispatch(resetAddressData()),
  };
};

const mapStateToProps = (state) => {
  return {
    loginData: state && state.loginReducer && state.loginReducer.loginData,
    addressData: state.addressReducer.addressResponse,
    addressError: state.addressReducer.addressError,
    loading: state.addressReducer.addressLoader,
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddressScreen);

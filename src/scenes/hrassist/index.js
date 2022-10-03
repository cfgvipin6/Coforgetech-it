import React, { Component } from "react";
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  BackHandler,
  ImageBackground,
} from "react-native";
import { DashBoardItem } from "../../GlobalComponent/DashBoardItem/DashBoardItem";
import SubHeader from "../../GlobalComponent/SubHeader";
const data = ["Raise My Query", "Track My Query"];
let globalConstants = require("../../GlobalConstants");
import ActivityIndicatorView from "../../GlobalComponent/myActivityIndicator";
import images from "../../images";
class HRAssist extends Component {
  componentDidMount() {
    BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
  }
  dashBoardItemClick = (item, index) => {
    console.log("Item clicked ", item, index);
    switch (index) {
      case 0:
        this.props.navigation.navigate("HRAssistCreate");
        break;
      case 1:
        this.props.navigation.navigate("Hrassistmyrequest");
        break;
    }
  };
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
  render() {
    return (
      <ImageBackground style={{ flex: 1 }} source={images.loginBackground}>
        <SubHeader
          pageTitle={globalConstants.HR_ASSIST}
          backVisible={true}
          logoutVisible={true}
          handleBackPress={() => this.handleBack()}
          navigation={this.props.navigation}
        />
        <ActivityIndicatorView loader={this.props.loading} />
        <DashBoardItem
          data={data}
          dashBoardItemClick={(item, index) => {
            this.dashBoardItemClick(item, index);
          }}
        />
      </ImageBackground>
    );
  }
}

export default HRAssist;

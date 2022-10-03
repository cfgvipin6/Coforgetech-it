import React, { Component } from "react";
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  BackHandler,
  ImageBackground,
} from "react-native";
import { globalFontStyle } from "../../components/globalFontStyle";
import { Icon } from "react-native-elements";
import { DashBoardItem } from "../../GlobalComponent/DashBoardItem/DashBoardItem";
import SubHeader from "../../GlobalComponent/SubHeader";
import images from "../../images";
const data = ["My Address", "My Family", "My Communication Details"];
let globalConstants = require("../../GlobalConstants");
class MyInfoScreen extends Component {
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
        this.props.navigation.navigate("Address");
        break;
      case 1:
        this.props.navigation.navigate("FamilyRoute");
        break;
      case 2:
        {
          this.props.navigation.navigate("Communication", {});
        }
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
          pageTitle={globalConstants.MY_INFO_TITLE}
          backVisible={true}
          logoutVisible={true}
          handleBackPress={() => this.handleBack()}
          navigation={this.props.navigation}
        />
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

export default MyInfoScreen;

import React, { Component, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  BackHandler,
  Alert,
  ScrollView,
  FlatList,
} from "react-native";
import { styles } from "./styles";
import SubHeader from "../../GlobalComponent/SubHeader";
import { connect } from "react-redux";
import { moderateScale } from "../../components/fontScaling";
let globalConstants = require("../../GlobalConstants");
let constants = require("./constants");
let subTitleString = "";

class SchemsDetails extends Component {
  constructor(props) {
    super(props);
    subTitleString = "";
    console.log(
      "Data from props : ",
      this.props.navigation.state.params && this.props.navigation.state.params
    );
    let parentTitles =
      this.props.navigation.state.params &&
      this.props.navigation.state.params.parent;
    let childTitle =
      this.props.navigation.state.params &&
      this.props.navigation.state.params.items.title;
    console.log("Parent titles : ", parentTitles);
    console.log("Child title : ", childTitle);
    parentTitles.map((element) => {
      subTitleString += element + " > ";
    });
    subTitleString += childTitle;
    console.log("Subtitle string: ", subTitleString);
  }

  handleBack = () => {
    this.props.navigation.pop();
  };
  handleBackButtonClick = () => {
    console.log("Hardware back pressed");
    this.props.navigation.goBack(null);
    return true;
  };
  componentDidMount() {
    BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
  }
  renderViews = (item, index) => {
    return (
      <TouchableOpacity
        style={{
          backgroundColor: "#F6FAFD",
          minHeight: 35,
          paddingLeft: 8,
          paddingTop: 3,
          paddingBottom: 3,
          marginVertical: 7,
          justifyContent: "space-between",
          fontWeight: "bold",
          borderRadius: 5,
          elevation: 2,
          marginLeft: moderateScale(10),
          marginRight: moderateScale(10),
          flexDirection: "row",
          alignItems: "center",
          borderWidth: 1,
          borderColor: "#C9C9C9",
        }}
        onPress={() => {
          this.props.navigation.navigate("SchemePDF", { data: item });
        }}
      >
        <Text style={{ color: "#000", paddingHorizontal: 5 }}>
          {item.item.title}
        </Text>
      </TouchableOpacity>
    );
  };
  componentWillUnmount() {
    BackHandler.removeEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
  }
  render() {
    return (
      <View style={styles.container}>
        <SubHeader
          pageTitle={globalConstants.SCHEME_AND_POLICY_TITLE}
          backVisible={true}
          logoutVisible={true}
          // drawerVisible={true}
          handleBackPress={() => this.handleBack()}
          navigation={this.props.navigation}
        />
        {subTitleString !== "" && (
          <Text
            style={{
              backgroundColor: "#1C62AD",
              color: "#fff",
              textAlign: "center",
              paddingVertical: 10,
              fontWeight: "bold",
              fontSize: 18,
              paddingHorizontal: 5,
            }}
          >
            {subTitleString}
          </Text>
        )}
        <FlatList
          data={this.props.navigation.state.params.items.data}
          renderItem={(item, index) => this.renderViews(item, index)}
        />
      </View>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SchemsDetails);

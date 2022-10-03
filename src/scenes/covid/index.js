/* eslint-disable quotes */
/* eslint-disable comma-dangle */
/* eslint-disable prettier/prettier */
import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Button,
  TextInput,
  Alert,
  ImageBackground,
} from "react-native";
import SubHeader from "../../GlobalComponent/SubHeader";
let globalConstants = require("../../GlobalConstants");
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { globalFontStyle } from "../../components/globalFontStyle";
import images from "../../images";

class covidScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mobileNo: "",
      pinCode: "",
      checkDate: "",
      statesArray: [],
    };
  }

  componentDidMount() {
    // fetch("https://cdn-api.co-vin.in/api/v2/admin/location/states",{
    //     method: "GET",
    //     headers: {
    //         Host: "https://cdn-api.co-vin.in"
    //     }
    // }).then(res=> {
    //     console.log(res)
    //     return res.json()
    // }).then(response => {
    //         console.log("State",response)
    // })
  }

  handleBack = () => {
    this.props.navigation.pop();
  };

  btnPress = () => {
    if (this.state.mobileNo === "") {
      Alert.alert("Mobile number is required.");
    } else {
      console.log("111111");
      fetch("https://cdn-api.co-vin.in/api/v2/auth/public/generateOTP", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mobile: parseInt(this.state.mobileNo),
        }),
      })
        .then((res) => {
          console.log("res", res);
          if (res.status === 200 && res.headers.map.version === "23.0") {
            console.log("qqqqqq");
            return res.json();
          } else if (res.status === 400) {
            console.log("ppppp", res);
            return res;
          }
        })
        .then((resData) => {
          console.log("2222", resData);
          if (resData.status === 400) {
            Alert.alert("OTP Already Sent.");
          } else if (
            resData !== undefined &&
            resData.txnId &&
            resData.txnId !== ""
          ) {
            this.props.navigation.navigate("CovidVerifyOTP", {
              userMobNo: this.state.mobileNo,
              userTxnId: resData.txnId,
            });
          }
        });
    }
  };

  covidCenterBtnPress = () => {
    if (this.state.pinCode === "" || this.state.checkDate === "") {
      Alert.alert("Pin Code/Date is Required");
    } else {
      fetch(
        "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=110001&date=17-05-2021",
        {
          method: "GET",
          headers: {
            Host: "",
          },
          redirect: "follow",
        }
      )
        .then((res) => {
          console.log("res", res);
          if (res.status === 200 && res.headers.map.version === "23.0") {
            console.log("qqqqqq");
            return res.json();
          } else if (res.status === 400) {
            console.log("ppppp", res);
            return res.text();
          }
        })
        .then((resData) => {
          console
            .log("2222", resData)

            .catch((error) => {
              console.log("error", error);
            });
        });
    }
  };

  render() {
    return (
      <ImageBackground style={{ flex: 1 }} source={images.loginBackground}>
        <View style={globalFontStyle.container}>
          <View style={globalFontStyle.subHeaderViewGlobal}>
            <SubHeader
              pageTitle={"COWIN Registration"}
              backVisible={true}
              logoutVisible={true}
              handleBackPress={() => this.handleBack()}
              navigation={this.props.navigation}
            />
          </View>
          <View>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              autoCompleteType={false}
              placeholder="Enter Mobile No."
              value={this.state.mobileNo}
              onChangeText={(text) => this.setState({ mobileNo: text })}
              keyboardType={"numeric"}
              style={{ alignSelf: "center" }}
            />
            <Button
              title="Click to generate OTP"
              onPress={() => {
                this.btnPress();
              }}
            />
          </View>
          <View style={{ paddingBottom: 8 }}>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              autoCompleteType={false}
              placeholder="Enter 6-digit PIN"
              maxLength={6}
              value={this.state.pinCode}
              onChangeText={(text) => this.setState({ pinCode: text })}
              keyboardType={"numeric"}
              style={{ alignSelf: "center" }}
            />
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              autoCompleteType={false}
              placeholder="Enter Date i.e 13-01-2021"
              maxLength={10}
              value={this.state.checkDate}
              onChangeText={(text) => this.setState({ checkDate: text })}
              keyboardType={"numeric"}
              style={{ alignSelf: "center" }}
            />
            <Button
              title="Covid Centers List"
              onPress={() => {
                this.covidCenterBtnPress();
              }}
            />
          </View>
          <Button
            title="go to cowin website"
            onPress={() => {
              this.props.navigation.navigate("CovidWeb");
            }}
          />
        </View>
      </ImageBackground>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(covidScreen);

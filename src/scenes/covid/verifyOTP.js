import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Button,
  TextInput,
  NativeModules,
  ImageBackground,
} from "react-native";
import SubHeader from "../../GlobalComponent/SubHeader";
let globalConstants = require("../../GlobalConstants");
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { globalFontStyle } from "../../components/globalFontStyle";
import images from "../../images";
let appConfig = require("../../../appconfig");
// let Aes = NativeModules.Aes

class covidVerifyOTPScreen extends Component {
  constructor(props) {
    super(props);
    previousScreenData = this.props.navigation.state.params;
    console.log("prevData:", previousScreenData);
    this.state = {
      otpNo: "",
      otpHashNo: "",
      timer: 180,
    };
  }

  componentDidMount() {
    this.myInterval = setInterval(() => {
      this.setState((prevState) => ({
        timer: prevState.timer - 1,
      }));
      //    console.log("timerval", this.state.timer)
    }, 1000);
  }

  componentDidUpdate() {
    if (this.state.timer === 1) {
      clearInterval(this.myInterval);
    }
  }

  componentWillUnmount() {
    clearInterval(this.myInterval);
  }

  handleBack = () => {
    this.props.navigation.pop();
  };

  // encryptInfo = (otp) => {
  //     return Aes.randomKey(16).then(iv => {
  //         return Aes.encrypt(otp, iv).then(cipher => ({
  //             cipher,
  //             iv,
  //         }))
  //     })
  //   }

  btnPress = () => {
    // this.encryptInfo(this.state.otpNo)
    if (this.state.otpNo === "") {
      Alert.alert("Please Enter Valid OTP.");
    } else {
      console.log("111111");
      // sha256(this.state.otpNo).then(myHash => {
      //   this.setState({
      //     otpHashNo: myHash
      //   });
      //   console.log(this.state.otpHashNo);
      //   console.log(previousScreenData.userTxnId.trim());
      // });
      fetch("https://cdn-api.co-vin.in/api/v2/auth/public/confirmOTP", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          otp: this.state.otpHashNo,
          txnId: previousScreenData.userTxnId.trim(),
        }),
      })
        .then((res) => {
          console.log("confirm res", res);
          return res.json();
        })
        .then((resData) => {
          console.log("my OTP", this.state.otpNo);
          console.log("myfinalhash OTP", this.state.otpHashNo);
          console.log("2222", resData);
        });
    }
  };

  render() {
    return (
      <ImageBackground style={{ flex: 1 }} source={images.loginBackground}>
        <View style={globalFontStyle.container}>
          <View style={globalFontStyle.subHeaderViewGlobal}>
            <SubHeader
              pageTitle={"COWIN Verification OTP"}
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
              placeholder="Enter OTP sent to your mobile"
              value={this.state.otpNo}
              onChangeText={(text) => this.setState({ otpNo: text })}
              keyboardType={"numeric"}
              style={{ alignSelf: "center" }}
              // onSubmitEditing={()=> this.encryptInfo(this.state.otpNo)}
            />
            <Text
              style={{
                color:
                  this.state.timer !== 1
                    ? appConfig.VALID_BORDER_COLOR
                    : appConfig.BLUE_TEXT_COLOR,
                alignSelf: "center",
                marginBottom: 6,
                fontWeight: "700",
              }}
            >
              {this.state.timer !== 1
                ? this.state.timer + " sec"
                : "Resend OTP"}
            </Text>
            <Button
              title="Verify & Proceed"
              onPress={() => {
                this.btnPress();
              }}
            />
          </View>
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
)(covidVerifyOTPScreen);

//https://cdn-api.co-vin.in/api/v2/registration/certificate/public/download

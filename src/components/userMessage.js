import React, { Component } from "react";
import {
  Modal,
  TouchableHighlight,
  TouchableOpacity,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
  Platform,
  Alert,
} from "react-native";
import { moderateScale } from "./fontScaling";
import { AppStyle } from "../scenes/commonStyle";
import OrangeBar from "../components/orangeBar";
import images from "../images";
var AppConfig = require("../../appconfig");
const screenwidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
export default class UserMessage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: props.modalVisible,
      heading: props.heading,
      message: props.message,
    };
  }
  showModal = () => {
    return (
      //       <Modal
      //         visible={this.state.modalVisible}
      //         animationType="slide"
      //         transparent={true}
      //         onRequestClose={() => {
      //             this.setState({ modalVisible: false });
      //         }}>
      //         <View style={style.modalOuterView}>
      //             <View style={style.optionsOuterView}>
      //                 <View style={style.headingView}>
      //                     <Text style={style.modalFirstHeading}>{this.state.heading}</Text>
      //                 </View>
      //                 <View style={style.messageView}>
      //                 <Text>{this.state.message}</Text>
      //                 </View>
      // <View style={style.horizontalLine} />
      //                 <View style={[style.optionsView]}>
      //                     <TouchableHighlight onPress={() =>  this.props.okAction()} style={style.modalOptionTouchable} underlayColor={'transparent'}>
      //                         <Text accessibilityLabel={'ok'} testID={'ok'} style={style.modalOptions}>{'OK'}</Text>
      //                     </TouchableHighlight>
      //                 </View>
      //             </View>
      //         </View>
      // </Modal>
      <Modal
        visible={this.state.modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          this.setState({ modalVisible: false });
        }}
      >
        <View style={styles.modalOuterView}>
          <View color={"#D3E5FC"} style={styles.optionsOuterView}>
            <View style={styles.messageView}>
              {/* <View style={styles.rowHolder2}>
                 <View style={styles.innerLogoutView}>
                 <TouchableOpacity onPress={() =>  this.setState({ modalVisible: false })} style={styles.closeButton}>
                 <Image source={images.crossButton}/>
                 </TouchableOpacity>
                 </View>
                 </View> */}
              <View style={styles.headingView}>
                <Text style={styles.modalFirstHeading}>
                  {this.state.heading}
                </Text>
              </View>
              <Text style={styles.messageView}>{this.state.message}</Text>
            </View>
            <View style={[styles.optionsView]}>
              <View style={styles.rowHolder2}>
                <TouchableOpacity
                  onPress={() => this.props.okAction()}
                  style={styles.modalOptionTouchable2}
                  underlayColor={"transparent"}
                >
                  <Text
                    accessibilityLabel={"ok"}
                    testID={"ok"}
                    style={styles.modalOptions}
                  >
                    {"OK"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  };
  render() {
    return (
      <View>
        <OrangeBar />
        {this.showModal()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerView: {
    width: screenwidth,
    height: (screenHeight * 8) / 100,
    backgroundColor: AppConfig.WHITE_COLOR,
    justifyContent: "center",
    alignItems: "flex-start",
    marginTop: "10%",
  },
  rowHolder: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    width: "100%",
  },
  rowHolder2: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
  },
  innerLogoutView: {
    width: "100%",
    justifyContent: "space-around",
  },

  headingView: {
    alignItems: "center",
    justifyContent: "center",
    height: moderateScale(30),
  },
  messageView: {
    marginHorizontal: moderateScale(20),
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  modalOptionTouchable: {
    height: moderateScale(50),
    width: "45%",
    alignItems: "center",
    justifyContent: "center",
  },

  modalOptionTouchable2: {
    height: moderateScale(35),
    width: "20%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: moderateScale(10),
    borderWidth: 1,
    borderColor: "orange",
    borderRadius: 23,
    backgroundColor: "#3469c9",
  },
  optionsOuterView: {
    minHeight: "20%",
    width: "90.9%",
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "space-evenly",
    borderRadius: moderateScale(4),
    borderColor: "orange",
    borderWidth: 1,
  },
  modalOuterView: {
    height: "100%",
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.7)",
    alignItems: "center",
    justifyContent: "center",
  },
  optionsView: {
    alignItems: "center",
    justifyContent: "center",
    height: moderateScale(48),
    width: "100%",
  },
  modalFirstHeading: {
    fontSize: moderateScale(16),
    letterSpacing: moderateScale(0.8),
    color: AppConfig.GUN_METAL_COLOR,
  },
  modalSecondHeading: {
    fontSize: moderateScale(14),
    letterSpacing: moderateScale(0.7),
    color: AppConfig.GUN_METAL_COLOR,
  },
  modalOptions: {
    color: "#fff",
    fontSize: moderateScale(14),
    letterSpacing: moderateScale(0.7),
    lineHeight: 39,
  },
  horizontalLine: {
    height: 1,
    width: "100%",
    backgroundColor: "rgba(0,0,255,0.18)",
    marginTop: moderateScale(18),
  },
  backbutton: {
    height: moderateScale(40),
    alignItems: "flex-start",
    justifyContent: "center",
    marginLeft: moderateScale(6),
  },
  closeButton: {
    justifyContent: "center",
    margin: 10,
    alignSelf: "flex-end",
  },
});

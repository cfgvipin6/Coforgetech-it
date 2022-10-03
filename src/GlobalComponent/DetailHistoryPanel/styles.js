import { StyleSheet, Platform } from "react-native";
import { moderateScale } from "../../components/fontScaling.js";
var appConfig = require("../../../appconfig");
export const styles = StyleSheet.create({
  panelNewContainer: {
    flex: 1,
    zIndex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  dragHandler: {
    alignSelf: 'stretch',
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: appConfig.LOGIN_HEADER_COLOR,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  downArrowStyle: {
    width: 46,
    height: 24
  },
  panelContainer: {
    marginTop: 20,
    // marginBottom: 30
  },
});

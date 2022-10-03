import { StyleSheet, Platform } from "react-native";
import { moderateScale } from "../../components/fontScaling.js";
var appConfig = require("../../../appconfig");
export const styles = StyleSheet.create({
  boldText:{
    fontWeight:'bold',
    marginTop:moderateScale(10),
    flex:1,
  },
  radioButtonHolder:{
    flexDirection: "row",
    flex:1,
  },
  radioGroupDisabledContainer:{
    flex:1,
    marginTop:moderateScale(5),
    paddingTop:moderateScale(5),
    // alignItems:'center',
    borderColor:'grey',
    borderWidth:1,
    opacity: 0.5,
  },
  radioGroupContainer:{
    flex:1,
    marginTop:moderateScale(5),
    paddingTop:moderateScale(5),
    // alignItems:'center',
    borderColor:'grey',
    borderWidth:1,
  },
  radioFormStyle: {
    paddingLeft: moderateScale(5)
  },
  horizontalRadioFromStyle:{
    justifyContent:"center",
    alignItems:"center"
  }
});

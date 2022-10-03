import { StyleSheet, Platform } from "react-native";
import { moderateScale } from "../../components/fontScaling.js";
let appConfig = require("../../../appconfig");
export const styles = StyleSheet.create({
  rowHolder: {
    flexDirection: "row",
    // justifyContent: "space-between",
    alignItems:'center',
    // marginHorizontal: 10
  },
  textInputStyle:{
    flex:1,
    // marginTop:moderateScale(5),
    // justifyContent:'center',
    paddingVertical:moderateScale(4),
    // height: moderateScale(25),
    color:'black',
    paddingLeft: moderateScale(5),
   },
   heading:{
    fontWeight:'bold',
    flex:1,
  },
  description:{
    flex:1,
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    borderColor: appConfig.GUN_METAL_COLOR,
    borderWidth:1,
    marginVertical:1,
  },
});

import { StyleSheet, Platform } from "react-native";
import { moderateScale } from "../../components/fontScaling.js";
var appConfig = require("../../../appconfig");
export const styles = StyleSheet.create({
  rowHolder: {
    // flexDirection: "row",
    flex:1,
    marginVertical: moderateScale(14),
    marginHorizontal:moderateScale(14),
    marginBottom:moderateScale(14),
  },
  textDescription:{
    justifyContent:'center',
    paddingVertical:moderateScale(5),
    color:'black',
    paddingLeft: moderateScale(5),
   },
   heading:{
    fontWeight:'bold',
    
  },
  remarksParent: {
    borderWidth: 1,
    borderColor: appConfig.LIST_BORDER_COLOUR,
    borderRadius: moderateScale(5),
    marginTop:20
  },
  textInputStyle: {
    paddingLeft: 10,
    paddingTop:10,
    paddingBottom:10,
    flex:1
  },
});

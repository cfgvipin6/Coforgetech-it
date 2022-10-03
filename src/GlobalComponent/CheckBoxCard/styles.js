import { StyleSheet, Platform } from "react-native";
import { moderateScale } from "../../components/fontScaling.js";
var appConfig = require("../../../appconfig");
export const styles = StyleSheet.create({
  checkUncheckedImage: {
    height: 24, 
    width: 24,
    marginLeft:10,
  },
  container:{
    flexDirection: "row",
    flex:1,
    alignItems:'center'
  },
  selectAllContainer:{
    flexDirection: "row",
    flex:1,
    alignItems:'center',
    marginTop:moderateScale(10)
  },
  selectAllText:{
    marginLeft:moderateScale(10),
    fontWeight:'bold'
  },
  checkBoxContainer:{ marginTop: 0,backgroundColor:'red' },
  cardHolder:{ 
    flex:1,
   }
});

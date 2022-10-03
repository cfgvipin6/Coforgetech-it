import { StatusBar } from "react-native";
import { StyleSheet, Platform } from "react-native";
import { moderateScale } from "../../../components/fontScaling.js";
let appConfig = require("../../../../appconfig");
export const voucherStyles = StyleSheet.create({
 historyContainer:{
     marginTop:moderateScale(200),
 },
 modalContainer: {
    flex: 1,
    backgroundColor:'#fff',
  },
  searchHolder:{
    flexDirection: "row",
    alignItems:'center',
    width:'100%',
    marginTop:30,
  },
  searchBarSkills: {
    backgroundColor: "#fff",
    flex:1,
    marginLeft: moderateScale(16)
  },
  listItem: {
    marginLeft: moderateScale(16),
    width: "90%",
    paddingTop: 10,
    paddingBottom: 10
  },
  supervisorSeparator: {
    marginTop: 10,
    height: 0.5,
    backgroundColor: appConfig.LIST_BORDER_COLOUR
  },
});

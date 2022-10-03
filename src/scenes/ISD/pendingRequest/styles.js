import { StyleSheet } from "react-native";
import { moderateScale } from "../../../components/fontScaling";
var appConfig = require('../../../../appconfig');
export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  detailContainer: {
    flex: 1,
    marginBottom:'1%',
  },
  item: {
    backgroundColor: "#EC8722",
    paddingLeft: 8,
    paddingTop:3,
    paddingBottom:3,
    marginVertical: 5,
    justifyContent:'space-between',
    fontWeight: "bold",
    borderRadius:5,
    elevation: 2,
    marginLeft:moderateScale(10),
    marginRight:moderateScale(1),
    flexDirection:'row',
    alignItems: 'center',
  },
  keyBoardContainer:{
    marginBottom:'2%'
  },
  contentView: {
      borderWidth: 2,
      borderRadius: 8,
      borderColor: appConfig.LOGIN_FIELDS_BACKGROUND_COLOR,
      borderStyle: 'dotted',
      margin: moderateScale(10),
      padding: moderateScale(6),
  },
  checkUncheckedImage: {
    height: 24, 
    width: 24
  },
	cardBackground: {
		borderWidth: 1,
		borderColor: appConfig.FIELD_BORDER_COLOR,
		flex: 0,
		backgroundColor: "#fff",
		borderRadius: 5,
		shadowOffset: { width: 10, height: 10 },
    shadowColor: "black",
    marginTop:moderateScale(0),
    paddingVertical:moderateScale(5),
    paddingHorizontal:moderateScale(3)
  },
  cardDetailBackground: {
		borderWidth: 1,
		borderColor: appConfig.FIELD_BORDER_COLOR,
		flex: 0,
		backgroundColor: "#fff",
		borderRadius: 5,
		shadowOffset: { width: 10, height: 10 },
    shadowColor: "black",
    margin:moderateScale(10),
    paddingVertical:moderateScale(5),
    paddingHorizontal:moderateScale(5)
  }
});
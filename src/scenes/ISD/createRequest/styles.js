import { StyleSheet } from "react-native";
import { moderateScale } from "../../../components/fontScaling";
var appConfig = require('../../../../appconfig');
export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentView: {
      borderWidth: 2,
      borderRadius: 8,
      borderColor: appConfig.BLUE_BORDER_COLOR,
      margin: moderateScale(10),
      padding: moderateScale(6),
  },
  bottomButtonView: {
    flexDirection: 'row',
    paddingTop: moderateScale(12),
  },
  bottomButtonInnerView: {
    flex: 1
  },
  remarksButtonHolder: {
    marginTop:moderateScale(6)
  },
  historyButton:{
    margin: moderateScale(10),
    borderWidth: 0.5,
    borderBottomColor:'black',
    padding:moderateScale(5)
  },
  fileActionButton:{
    flexDirection:'row',
    marginTop: moderateScale(16),
    marginHorizontal:moderateScale(6),
    borderWidth: 0.5,
    borderBottomColor:'black',
    paddingHorizontal:moderateScale(45),
    justifyContent:'center',
    alignItems:'center'
  },
  hyperLink:{
    color: 'blue',
    textDecorationLine: 'underline',
    marginTop:5,
    marginBottom:5,
  },
  historyText:{
    // fontWeight:'bold'
  },
  autocompleteStyle: {
    flex: 1,
    marginTop:moderateScale(5),
  },
  autocompleteListStyle: {
    position: "relative",
    backgroundColor: appConfig.CARD_BACKGROUND_COLOR,
    // color: appConfig.WHITE_COLOR,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    // alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  innerView: {
    flex: 0.5
  },
  innerView: {
    flex: 0.5
  },
  eesTitle: {
    alignSelf: "center",
    fontSize: 24
  },
  questionText: {
    fontSize: 20, 
    paddingHorizontal: 4, 
    paddingTop: 4
  },
  cardBackground: {
    borderWidth: 2,
    flex: 1,
    borderColor: "grey",
    borderRadius: 5,
    margin: moderateScale(6),
    padding: moderateScale(6),
    shadowColor: "black",
    overflow: 'hidden'
  },
  optionSeparator: {
    height: 2,
    backgroundColor: appConfig.WHITE_COLOR
  },
  buttonsContainer: {
    flexDirection: 'row'
  },
  button: {
    width: "50%"
  },
  item: {
    backgroundColor: appConfig.LOGIN_FIELDS_BACKGROUND_COLOR,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginVertical: 5,
    justifyContent:'space-between',
    fontWeight: "bold",
    borderRadius:5,
    elevation: 2,
    flexDirection:'row',
    alignItems: 'center',
  },
  hyperlinkText: {
    color: 'blue',
    textDecorationLine: 'underline'
  },
  paraSeparate: {
    paddingTop: 12
  },
  startButtonView: {
    width: "98%",
    alignSelf: "center",
    position: "absolute",
    bottom: 2
  },
  bulletPara: {
    flexDirection: 'row',
    paddingBottom: 4
  },
  bulletImage: {
    height: 18,
    width: 16 
  },
  bulletText: {
    width: "95%"
  },
  scrollStyle: {
    marginHorizontal: 10
  },
  dearNiitianText: {
    paddingVertical: 10
  }
});
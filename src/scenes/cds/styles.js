import { StyleSheet } from 'react-native';
import { moderateScale } from '../../components/fontScaling';
let appConfig = require('../../../appconfig');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardInnerView: {
    flexDirection:'row',
    paddingHorizontal:10,
  },
  innerContainer: {
    paddingBottom: moderateScale(30), //due to scroll hiding content from bottom
  },
  cardBackground: {
    borderWidth: 2,
    flex: 0,
    borderColor: '#f2f7ff',
    borderRadius: 5,
    shadowOffset: {
      width: 10,
      height: 10,
    },
    shadowColor: 'black',
  },
  cardLayout: {
    paddingHorizontal: moderateScale(6),
    paddingTop: moderateScale(2),
  },
  cardStyle: {
    flex: 0,
    marginHorizontal: moderateScale(6),
    paddingTop: moderateScale(2),
  },
  proceedView: {
    flex: 0,
    marginTop: 6,
  },
  proceedInnerView: {
    flexDirection: 'column',
    width: '50%',
  },
  rowStyle: {
    flexDirection: 'row',
  },
  textOne: {
    width: '50%',
  },
  textTwo: {
    width: '50%',
  },
  textTwoRed: {
    width: '50%',
    color: appConfig.INVALID_BORDER_COLOR,
  },
  scrollViewStyle: {
    marginBottom: 60,                     //check once
    paddingBottom: moderateScale(16),
    paddingHorizontal: moderateScale(16),
    // backgroundColor: 'green'
  },
  scrollViewNewStyle: {
    marginBottom: 1,   //scrollView Solution Mohit
    // paddingBottom: moderateScale(16),
    // paddingHorizontal: moderateScale(16),
    // backgroundColor: 'green'
  },
  cardView: {
    flexDirection: 'row',
    flex: 1,
    padding: moderateScale(5),
  },
  itemView: {
    width:'50%',
    fontWeight: 'bold',
    fontSize: 13,
  },
  itemViewValue: {
    width:'50%',
    fontSize: 13,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    paddingHorizontal: moderateScale(16),
    backgroundColor: 'white',
  },
  buttonSelectActionContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingHorizontal: moderateScale(16),
    backgroundColor: 'white',
  },
  buttonBox: {
    width:'50%',
  },
  panelContainer: {
    marginTop: 20,
    // marginBottom: 30
  },
  cardTitle: {
    fontSize: 22,
  },
  viewDetailsText: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
  dropIcon: {
    flexDirection: 'row',
    marginBottom: moderateScale(10),
    // borderWidth: 1,
    backgroundColor: appConfig.GUN_METAL_COLOR,
    borderRadius:10,
  },
  pickerObject: {
    width: '100%',
    paddingTop: moderateScale(7),
    paddingBottom: moderateScale(7),
  },
  pickerTextStyle: {
    fontSize: 20,
    textAlign: 'center',
    color: '#fff',
  },
  dropdownStyle: {
    width: '80%',
    marginLeft: 24,
    // height: "12%",
    justifyContent: 'center',
    // alignItems: "center"
  },
  dropdownTextStyle: {
    width: '100%',
    fontSize: 16,
    textAlign: 'center',
    color:'#000',
  },
  rejectView: {
    alignItems: 'center',
  },
  rejectContainer: {
    width: '90%',
    margin: 10,
  },
  negativeButton: {
    borderWidth: 1,
    borderColor: appConfig.LIST_BORDER_COLOUR,
    borderRadius: moderateScale(5),
    alignItems: 'center',
    marginTop: moderateScale(10),
    backgroundColor: appConfig.INVALID_BUTTON_COLOR,
  },
  submitRejectButtonText: {
    fontSize: 16,
    paddingVertical: 12,
    color: '#fff',
  },
  remarksParent: {
    borderWidth: 1,
    borderColor: appConfig.LIST_BORDER_COLOUR,
    borderRadius: moderateScale(5),
    marginHorizontal: 10,
    width: '90%',
    marginTop: moderateScale(14),
  },
  textInputStyle: {
    paddingLeft: 10,
    paddingTop:10,
    paddingBottom:10,
  },
  approverView: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: moderateScale(8),
    width: '100%',
  },
  selectedBoxView: {
    borderWidth: 1,
    borderColor: appConfig.LIST_BORDER_COLOUR,
    borderRadius: moderateScale(5),
    height: moderateScale(40),
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedTextValue: {
    paddingHorizontal: 10,
  },
  submitToText: {
    alignSelf: 'flex-start',
    paddingLeft: 18,
    marginBottom: 6,
  },
  submitButton: {
    borderWidth: 1,
    borderColor: appConfig.LIST_BORDER_COLOUR,
    borderRadius: moderateScale(5),
    width: '90%',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: moderateScale(20),
    backgroundColor: appConfig.BLUISH_COLOR,
  },
  selectOptionView: {
    width: '90%',
    borderWidth: moderateScale(1),
    borderColor: appConfig.LIST_BORDER_COLOUR,
    overflow: 'hidden',
    borderRadius: moderateScale(5),
    height: '40%',
  },
  selectOptionImage: {
    tintColor: appConfig.BORDER_GREY_COLOR,
		height: moderateScale(1),
		width: '100%',
  },
  selectedOptionBoxView: {
    height: moderateScale(40),
    flexDirection: 'row',
    alignItems: 'center',
  },
  successMsgText: {
    marginHorizontal: '4.3%',
    fontSize: moderateScale(14),
    color: appConfig.GUN_METAL_COLOR,
    letterSpacing: moderateScale(0.7),
    textAlign: 'center',
  },
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
    height: 24,
  },
  historyViewStyle:{
    marginTop: 2,
    marginLeft: 6,
    alignSelf: 'flex-start',
  },
});

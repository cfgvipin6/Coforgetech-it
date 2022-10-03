import { StyleSheet } from 'react-native';
import { moderateScale } from '../../components/fontScaling';
let appConfig = require('../../../appconfig');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  view_One: {
    flex: 0,
    marginHorizontal: moderateScale(6),
    paddingTop: moderateScale(2),
  },
  rowStyle: {
    flexDirection: 'row',
  },
  textOne: {
    fontWeight: 'bold',
    width: '50%',
  },
  textTwo: {
    width: '50%',
  },
  cardSeparator: {
    height: moderateScale(16),
  },
  buttonView: {
    flexDirection: 'row',
    paddingTop: moderateScale(8),
  },
  buttonOuterView: {
    width: '50%',
  },
  cardOuterView: {
    margin: 8,
  },
  rejectContainer: {
    margin: 10,
    width: '90%',
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
  },
  successMsgText: {
    marginHorizontal: '4.3%',
    fontSize: moderateScale(14),
    color: appConfig.GUN_METAL_COLOR,
    letterSpacing: moderateScale(0.7),
    textAlign: 'center',
  },
  viewLetterStyle: {
    color: 'blue',
    textDecorationLine: 'underline',
    marginLeft: moderateScale(6),
  },
  approverView: {
    alignItems: 'center',
    // justifyContent: "center",
    marginTop: moderateScale(8),
    width: '100%',
  },
  rejectView: {
    alignItems: 'center',
  },
  submitToText: {
    alignSelf: 'flex-start',
    paddingLeft: 18,
    marginBottom: 6,
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
  selectedOptionBoxView: {
    height: moderateScale(40),
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedTextValue: {
    paddingHorizontal: 10,
  },
  submitButton: {
    borderWidth: 1,
    borderColor: appConfig.LIST_BORDER_COLOUR,
    borderRadius: moderateScale(5),
    width: '90%',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: moderateScale(20),
    backgroundColor: appConfig.DARK_BLUISH_COLOR,
  },
  submitText: {
    color: '#fff',
    paddingVertical: 12,
  },
  selectOptionView: {
    width: '90%',
    borderWidth: moderateScale(1),
    borderColor: appConfig.LIST_BORDER_COLOUR,
    overflow: 'hidden',
    borderRadius: moderateScale(5),
  },
  selectOptionImage: {
    tintColor: appConfig.BORDER_GREY_COLOR,
		height: moderateScale(1),
		width: '100%',
  },
  bandNotHeading: {
    fontSize: 24,
    fontWeight: '700',
    paddingVertical: 5,
    textAlign: 'center',
  },
  bandNotUpperLine: {
    height: 2,
    backgroundColor: 'grey',
    marginBottom: 8,
  },
  bandNotBottomLine: {
    height: 2,
    backgroundColor: 'grey',
    marginTop: 8,
    marginBottom: moderateScale(16),
  },
});

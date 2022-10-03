import { StyleSheet } from 'react-native';
import { moderateScale } from '../../components/fontScaling';
let appConfig = require('../../../appconfig');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBar: {
    backgroundColor: '#FFFFFF',
    width: '90%',
    marginLeft: moderateScale(16),
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
  cardStyle: {
    paddingTop: moderateScale(2),
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
  collapseContainer: {
    flexDirection: 'row',
  },
  textFive:{
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  collapseButton:{
    alignItems: 'center',
  },
  textSix:{
    fontSize: moderateScale(26),
    marginHorizontal: moderateScale(0),
    fontWeight: 'bold',
  },
  view_Two:{
  },
  userDetailStyle: {
    paddingHorizontal: moderateScale(6),
    marginTop: moderateScale(6),
  },
  rejectContainer: {
    margin: 10,
  },
  rejectButtonText: {
    fontSize: 16,
    paddingVertical: 12,
    color: '#fff',
  },
  remarksParent: {
    borderWidth: 1,
    borderColor: appConfig.LIST_BORDER_COLOUR,
    borderRadius: moderateScale(5),
    width: '95%',
    alignSelf: 'center',
    // marginHorizontal: 10,
    marginTop: moderateScale(16),
  },
  dropDownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  pickerBox: {
    width: '60%',
    alignItems: 'center',
    padding: 10,
  },
  dropIcon: {
    flexDirection: 'row',
    borderWidth: 1,
    backgroundColor: appConfig.DARK_BLUISH_COLOR,
  },
  pickerObject: {
    width: '100%',
  },
  pickerTextStyle: {
    fontSize: 20,
    textAlign: 'center',
    color: '#fff',
  },
  dropdownStyle: {
    width: '55%',
    height: '12%',
    alignItems: 'center',
  },
  dropdownTextStyle: {
    fontSize: 16,
    textAlign: 'center',
  },
  listItem: {
    marginLeft: moderateScale(16),
    width: '90%',
    paddingTop: 10,
    paddingBottom: 10,
  },
  supervisorSeparator: {
    marginTop: 10,
    height: 0.5,
    backgroundColor: appConfig.LIST_BORDER_COLOUR,
  },
  approverText: {
    fontSize: 16,
    paddingVertical: 12,
    paddingLeft: 10,
  },
  submitButtonView: {
    borderWidth: 1,
	  borderColor: appConfig.LIST_BORDER_COLOUR,
	  borderRadius: moderateScale(5),
    width: '95%',
    alignItems: 'center',
	  alignSelf: 'center',
    marginTop: moderateScale(20),
    backgroundColor: appConfig.DARK_BLUISH_COLOR,
  },
  submitButtonText: {
    color: '#fff',
    paddingVertical: 12,
  },
  successMsgText: {
    marginHorizontal: '4.3%',
    fontSize: moderateScale(14),
    color: appConfig.GUN_METAL_COLOR,
    letterSpacing: moderateScale(0.7),
    textAlign: 'center',
  },
});

import { StyleSheet } from 'react-native';
import { moderateScale } from '../../components/fontScaling';
let appConfig = require('../../../appconfig');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    paddingBottom: moderateScale(20),     //due to scroll hiding content from bottom
  },
  showRequestView: {
    marginBottom: -40,                    //due to scroll hiding content from bottom
  },
  listOuterView: {
    paddingHorizontal: moderateScale(16),
    paddingBottom: moderateScale(160),
  },
  listContentStyle: {
    flexGrow: 1,
    justifyContent: 'center',
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
  cardOuterView: {
    margin: 8,
  },
  view_One: {
    flex: 0,
    marginHorizontal: moderateScale(6),
    paddingTop: moderateScale(2),
  },
  buttonOuterView: {
    width: '50%',
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
  searchBar: {
    backgroundColor: '#FFFFFF',
    width: '90%',
    marginLeft: moderateScale(16),
  },
  buttonView: {
    flexDirection: 'row',
    paddingTop: moderateScale(8),
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
    height: '20%',
    alignItems: 'center',
  },
  dropdownTextStyle: {
    fontSize: 16,
    textAlign: 'center',
  },
  dropDownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  rejectContainer: {
    margin: 10,
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
  textInputStyle: {
    width: '100%',
    paddingLeft: 10,
  },
  negativeButton: {
    borderWidth: 1,
    borderColor: appConfig.LIST_BORDER_COLOUR,
    borderRadius: moderateScale(5),
    alignItems: 'center',
    marginTop: moderateScale(10),
    backgroundColor: appConfig.INVALID_BUTTON_COLOR,
  },
  rejectButtonText: {
    fontSize: 16,
    paddingVertical: 12,
    color: '#fff',
  },
  modalTextStyle: {
    marginHorizontal: '4.3%',
    fontSize: moderateScale(14),
    color: appConfig.GUN_METAL_COLOR,
    letterSpacing: moderateScale(0.7),
    textAlign: 'center',
  },
  scrollViewStyle: {
    paddingVertical: moderateScale(2),
    height: '75%',
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
  textSupervisor: {
    fontSize: 16,
    paddingVertical: 12,
    paddingLeft: 10,
  },
  submitButton: {
    borderWidth: 1,
	  borderColor: appConfig.LIST_BORDER_COLOUR,
	  borderRadius: moderateScale(5),
    width: '95%',
    alignItems: 'center',
	  alignSelf: 'center',
    marginTop: moderateScale(20),
    backgroundColor: appConfig.DARK_BLUISH_COLOR,
  },
  btnSupervisorText: {
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
  historyViewStyle:{
    marginTop: 2,
    marginLeft: 6,
    alignSelf: 'flex-start',
  },
});

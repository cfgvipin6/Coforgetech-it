import { StyleSheet } from 'react-native';
import { moderateScale, verticalScale, scale } from '../components/fontScaling';
let appConfig = require('../../appconfig');

export const globalFontStyle = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageBackgroundLayout: {
    fontSize: 12,
  },
  buttonSize: {
    height: moderateScale(38),
  },
  buttonTextSize: {
    fontSize: verticalScale(13),
    color: 'white',
  },
  dashboardTitleSize: {
    fontSize: 14,
    color:'#06141F',
  },
  headerNameSize: {
    fontSize: moderateScale(14),
  },
  loginMainHeading: {
    fontSize: 35,
  },
  gratuityDisplayHeadingFont: {
    fontSize: 20,
  },
  cardLeftText: {
    width: '50%',
    fontSize: 13,
    color:'#06141F',
  },
  cardRightText: {
    width: '50%',
    fontSize: 13,
    color:'#06141F',
  },
  cardDirection: {
    flexDirection: 'row',
    paddingHorizontal:10,
  },
  panelContainer: {
    marginTop: 20,
    borderWidth:0.5,
    borderColor:'grey',
    margin:10,
    marginVertical:10,
    borderRadius:5,
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
    alignItems: 'flex-end',
    marginRight:10,
    justifyContent: 'center',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  downArrowStyle: {
    width: 46,
    height: 24,
  },
  historyIcon: {
    width: moderateScale(20),
    height: moderateScale(20),
    // marginVertical: 10,
    marginLeft: 4,
  },
  hyperlinkText: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
  subHeaderViewGlobal: {
    flex: 0,
  },
  searchViewGlobal: {
    flex: 0,
  },
  searchGlobal: {
    backgroundColor: appConfig.WHITE_COLOR,
    marginHorizontal: moderateScale(10),
  },
  contentViewGlobal: {
    flex: 1,
  },
  listContentViewGlobal:{
    paddingHorizontal: moderateScale(16),
    marginVertical: 5,
  },
  listContentGlobal: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  listContentSeparatorGlobal: {
    height: moderateScale(16),
  },
  checkUncheckedGlobal: {
    height: 24,
    width: 24,
  },
  dropDownView: {
    flexDirection: 'row',
    paddingVertical: 3,
    alignItems: 'center',
  },
  dropDownInnerView: {
    flex: 1,
    marginLeft: 6,
  },
  dropDownText: {
    color: appConfig.WHITE_COLOR,
  },
  dropDownText1: {
    color: appConfig.WHITE_COLOR,
    fontSize: 20,
    alignSelf: 'center',
  },
});

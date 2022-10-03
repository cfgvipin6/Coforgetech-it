import { StyleSheet, Platform } from 'react-native';
import { moderateScale } from '../../components/fontScaling.js';
let appConfig = require('../../../appconfig');
export const styles = StyleSheet.create({
  rowHolder: {
    flexDirection: 'row',
    // justifyContent: "space-between",
    alignItems:'center',
    paddingTop:moderateScale(5),
    // backgroundColor: 'red'
    // marginHorizontal: 10
  },
  textInputStyle:{
    borderColor:'grey',
    borderWidth:1,
    marginTop:moderateScale(5),
    // justifyContent:'center',
    paddingVertical:moderateScale(5),
    // height: moderateScale(25),
    color:'black',
    paddingLeft: moderateScale(5),
   },
   heading:{
    fontWeight:'bold',
    flex:1,
  },
  description:{
    flex:1,
  },
  calendarText:{
    backgroundColor: appConfig.DARK_BLUISH_COLOR,
    borderColor:'grey',
    borderWidth:1,
    marginRight: 2,
    color: appConfig.WHITE_COLOR,
    height: moderateScale(24),
    // paddingHorizontal:10,
  },
  calendarView: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
  },
});

import { StyleSheet } from 'react-native';
import { moderateScale } from '../../components/fontScaling.js';
var appConfig = require('../../../appconfig');
export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pickerContainer:{
      flexDirection:'row',
      width:'100%',
      justifyContent:'space-between',
      paddingHorizontal:10,
      height:'21%',
      alignItems:'center',
  },
  pickerBox:{
    width:'17%',
    alignItems:'center',
    marginLeft:moderateScale(18),
  },
  dropIcon:{
    flexDirection:'row',
    borderWidth:1,
    backgroundColor:appConfig.GUN_METAL_COLOR,
    borderRadius:5,
  },
  pickerBox2:{
    width:'58%',
    alignItems:'center',
    marginLeft:moderateScale(23),
  },
  pickerObject1:{
    width:'100%',
    // paddingTop:moderateScale(7),
    // paddingBottom:moderateScale(7),

  },
  pickerObject2:{
    width:'100%',
    // paddingTop:moderateScale(7),
    // paddingBottom:moderateScale(7),
  },
  pickerTextStyle:{
    fontSize: 16,
    textAlign: 'center',
    color: 'black',
  },
  dropdownStyle:{
    width:'20%',
    height:'30%',
    alignItems: 'center',
  },

  dropdownStyle2:{
    width:'50%',
    height:'70%',
    alignItems: 'center',
  },
  dropdownTextStyle:{
    fontSize: 12,
    color:'#000',
  },
  button:{
    width:'10%',
    marginTop:moderateScale(13),
    justifyContent:'flex-end',
  },
  tableHead: {
    height: 40,
    backgroundColor:appConfig.LOGIN_FIELDS_BACKGROUND_COLOR,
},
tableText: {
    margin:6,
    paddingVertical:3,
},
scrollViewStyle:{
  paddingVertical: moderateScale(2),
  paddingHorizontal: moderateScale(7),
  height:'75%',
  marginTop:'2%',
},
buttonText:{
  fontSize: 14,
  textAlign: 'center',
  color:'#fff',
},
});

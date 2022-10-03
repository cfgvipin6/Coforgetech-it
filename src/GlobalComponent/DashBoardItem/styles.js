import { StyleSheet, Platform } from 'react-native';
import { moderateScale } from '../../components/fontScaling.js';
var appConfig = require('../../../appconfig');
export const styles = StyleSheet.create({
  item: {
    backgroundColor: '#F6FAFD',
    paddingLeft: 8,
    paddingTop:3,
    paddingBottom:3,
    marginVertical: 7,
    justifyContent:'space-between',
    fontWeight: 'bold',
    borderRadius:5,
    elevation: 2,
    marginLeft:moderateScale(10),
    marginRight:moderateScale(10),
    flexDirection:'row',
    alignItems: 'center',
    borderWidth:1,
    borderColor:'#C9C9C9',
  },

});

import { StyleSheet, Platform } from 'react-native';
import { moderateScale } from '../../../components/fontScaling.js';
var appConfig = require('../../../../appconfig');
export const styles = StyleSheet.create({
  container:{
      flex:1,
  },
  headerContainer:{
      flex:1,
      flexDirection:'row',
      backgroundColor:appConfig.DARK_BLUISH_COLOR,
      marginTop:10,
  },
  buttonConainer:{
    flex:1,
    justifyContent:'space-between',
    alignItems:'center',
    flexDirection:'row',
  },
  attachText:{
    flex: 1,
    alignSelf:'center',
    color:'#fff',
    fontSize:13,
    marginLeft:7,
  },
  fileItem:{
    flex:1,
    flexDirection:'row',
    alignItems:'flex-start',
    // backgroundColor:appConfig.BLUE_BORDER_COLOR,
  },
  fileHeadingStyle:{
    flex:1,
    color: 'blue',
    textDecorationLine: 'underline',
  },
  camera:{
    marginRight:10,
  },
  fileName:{
    flex:1,
  },
  deleteIcon:{
    flex:1,
    alignItems:'flex-start',
  },
});

import { StyleSheet} from 'react-native';
import { moderateScale, setWidth } from '../../components/fontScaling.js';
var appConfig = require('../../../appconfig');
const sw = setWidth(100)
export const styles = StyleSheet.create({
  dropdownStyle:{
    width: sw / 2,
    backgroundColor:'#D3E5FC',
    borderWidth:1,
    borderColor:'#f68a23',
    position:'absolute',
    left:sw / 4,
    right:sw / 4,
    top:0,
    bottom:0,
     marginTop: 10,
    zIndex:5,
  },
  rowHolderSmall: {
    marginTop:moderateScale(3),
    flexDirection:'row',
    flex:1,
  },
  rowHolder:{
    marginTop:moderateScale(5),
    flexDirection:'row',
    flex:1,
  },
  pickerText:{
    fontWeight:'bold',
  },
  pickerBox:{
    alignSelf:'center',
   
  },
  dropdownTextStyle:{
    fontSize: 12,
    alignSelf:'flex-start',
    color:'#000',
    backgroundColor:'#D3E5FC',
  },
  pickerTextStyle:{
    fontSize: 14,
    textAlign: 'left',
    color:'#000',
    marginTop:moderateScale(4),
  },
  picker:{
    flex:1,
  },
  dropIcon:{
    flexDirection:'row',
    borderWidth:1,
    height:30,
    flex:1,
    borderRadius:5,
    borderColor:appConfig.APP_ORANGE,
  },
});

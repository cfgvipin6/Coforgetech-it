import { StyleSheet, Platform, Dimensions } from 'react-native';
import { moderateScale } from '../../components/fontScaling.js';
var appConfig = require('../../../appconfig');
let dh = Dimensions.get('window').height;
let dw = Dimensions.get('window').window;
export const styles = StyleSheet.create({
  heading:{
    fontWeight:'bold',
    marginLeft:5,
  },

  panelNewContainer: {
    height:dh,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    top:dh * 0.2,
    borderWidth:1,
    borderColor: appConfig.FIELD_BORDER_COLOR,
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
  panelContainer: {
    marginTop: 20,
    // marginBottom: 30
  },
  historyCardView:{
    flexDirection:'row',
    flex:1,
    padding:moderateScale(5),
},
});

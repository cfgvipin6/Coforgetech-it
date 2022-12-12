import { StyleSheet} from 'react-native';
import { moderateScale, setHeight } from '../../components/fontScaling.js';
var appConfig = require('../../../appconfig');
export const styles = StyleSheet.create({
  heading:{
    fontWeight:'bold',
    marginLeft:5,
  },

  panelNewContainer: {
    height:setHeight(100),
    backgroundColor: '#ffff',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    top:setHeight(20),
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

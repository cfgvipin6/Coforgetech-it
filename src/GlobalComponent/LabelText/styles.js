import { StyleSheet, Platform } from 'react-native';
import { moderateScale } from '../../components/fontScaling.js';
var appConfig = require('../../../appconfig');
export const styles = StyleSheet.create({
  rowHolder: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textDescription:{
    justifyContent:'center',
    paddingVertical:moderateScale(5),
    color:'black',
    paddingLeft: moderateScale(2),
   },
   heading:{
    flex:1,
    fontSize:12,
  },
  description:{
    flex:1,
    fontSize:12,
  },
  cardBackground: {
		borderWidth: 2,
		flex: 0,
		borderColor: appConfig.FIELD_BORDER_COLOR,
		borderRadius: 5,
		shadowOffset: { width: 10, height: 10 },
		shadowColor: 'black',
    padding: 5,
    margin: 5,
	},
  recordSeparatorLine: {
    width: '100%',
    height: 2,
    backgroundColor: '#1C62AD',
  },
  totalAmountView: {
    flexDirection: 'row',
    marginVertical: moderateScale(4),
  },
  totalAmountText: {
    paddingLeft: moderateScale(6),
    width: '50%',
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalAmountValue: {
    width: '50%',
    fontSize: 16,
  },
});

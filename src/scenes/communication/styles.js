import { StyleSheet } from 'react-native';
import { moderateScale } from '../../components/fontScaling.js';
var appConfig = require('../../../appconfig');
export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  CommDisplayHeading: {
    fontSize: 22,
    fontWeight:'bold',
    alignItems: 'center',
  },
  displayItemsView: {
    flexDirection: 'row',
    padding: moderateScale(5),
    justifyContent: 'space-between',
  },
  displayItemsTextOne: {
    width: '40%',
  },
  displayItemsTextTwo: {
    width: '50%',
  },
});

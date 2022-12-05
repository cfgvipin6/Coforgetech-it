import { Platform, StyleSheet } from 'react-native';
import { moderateScale } from '../../components/fontScaling.js';
var appConfig = require('../../../appconfig');
export const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#ffffff',
    justifyContent: 'center',
  },
  backGroundView: {
    flex: 1,
    width: '100%',
    height: '100%',
    zIndex: 999,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  containerPending: {
    flex: 1,
    // backgroundColor: 'red',
  },
  versionTextStyle: {
    marginVertical: Platform.OS == 'ios' ? 5 : 12,
    paddingBottom: Platform.OS == 'ios' ? 12 : 10,
    color: 'blue',
    flexDirection: 'row-reverse',
    fontSize: 9,
    paddingLeft: 10,
    // backgroundColor:'red'
  },
  item: {
    backgroundColor: '#F6FAFD',
    paddingLeft: 8,
    paddingTop: 3,
    paddingBottom: 3,
    marginVertical: 7,
    justifyContent: 'space-between',
    fontWeight: 'bold',
    borderRadius: 5,
    elevation: 2,
    marginLeft: moderateScale(10),
    marginRight: moderateScale(1),
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#C9C9C9',
  },
  gridParent: {
    flex: 1,
  },
  header: {
    fontSize: 32,
  },
  gridContainer: {
    flex: 1,
    marginVertical: 20,
  },
  gridItem: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginVertical: 10,
    marginHorizontal: 10,
    borderRadius: 12,
    borderColor: 'orange',
    borderWidth: 0.5,
  },
  gridItemInvisible: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginVertical: 10,
    marginHorizontal: 10,
    borderRadius: 12,
  },
  itemInvisible: {
    backgroundColor: 'transparent',
  },
  gridItemText: {
    fontSize: 11,
    // fontWeight:'bold',
    textAlign: 'center',
  },
  welcomeView: { justifyContent: 'center', alignItems: 'center' },
  welcomeText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    marginLeft: 10,
    marginRight: 10,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowContainer2: {
    flexDirection: 'row',
    backgroundColor: 'red',
  },
  countView: {
    backgroundColor: appConfig.DARK_BLUISH_COLOR,
    borderRadius: 5,
    marginLeft: 7,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  countText: {
    color: '#fff',
  },
});

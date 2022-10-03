import { StyleSheet } from 'react-native';
import { moderateScale } from '../../components/fontScaling';
let appConfig = require('../../../appconfig');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerView: {
    flex: 0.5,
  },
  eesTitle: {
    alignSelf: 'center',
    fontSize: 24,
  },
  questionText: {
    fontSize: 20,
    paddingHorizontal: 4,
    paddingTop: 4,
  },
  cardBackground: {
    borderWidth: 2,
    flex: 1,
    borderColor: 'grey',
    borderRadius: 5,
    margin: moderateScale(6),
    padding: moderateScale(6),
    shadowColor: 'black',
    overflow: 'hidden',
  },
  optionSeparator: {
    height: 2,
    backgroundColor: appConfig.WHITE_COLOR,
  },
  buttonsContainer: {
    flexDirection: 'row',
  },
  button: {
    width: '50%',
  },
  item: {
    backgroundColor: appConfig.LOGIN_FIELDS_BACKGROUND_COLOR,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginVertical: 5,
    justifyContent:'space-between',
    fontWeight: 'bold',
    borderRadius:5,
    elevation: 2,
    flexDirection:'row',
    alignItems: 'center',
  },
  hyperlinkText: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
  paraSeparate: {
    paddingTop: 12,
    color:'#000',
  },
  startButtonView: {
    width: '98%',
    alignSelf: 'center',
    position: 'absolute',
    bottom: 2,
  },
  bulletPara: {
    flexDirection: 'row',
    paddingBottom: 4,
    color:'#000',
  },
  bulletImage: {
    height: 18,
    width: 16,
  },
  bulletText: {
    width: '95%',
    color:'#000',
  },
  scrollStyle: {
    marginHorizontal: 10,
  },
  dearNiitianText: {
    paddingVertical: 10,
    color:'#000',
  },
  // textFontSize: {
  //   fontSize: 12
  // }

});

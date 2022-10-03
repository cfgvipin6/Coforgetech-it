import { StyleSheet } from 'react-native';
import { moderateScale } from '../../components/fontScaling.js';
var appConfig = require('../../../appconfig');
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appConfig.WHITE_COLOR,
  },
  collapseHeader:{
    width:'100%',
    flexDirection:'row',
    justifyContent:'space-between',
  },
  arrowRight:{
    alignSelf:'center',
  },
  rowHolder:{
    flexDirection:'row',
  },
  displayText: {
    fontWeight: 'bold',
    fontSize: 22,
  },
  heading: {
    fontWeight: 'bold',
    fontSize: 24,
    padding: 10,
    textAlign: 'center',
  },
  leftSideVal: {
    width: '50%',
  },
  rightSideVal: {
    width: '50%',
    textAlign:'right',
    fontSize:13,
    color:'black',
  },
  displayItemsView: {
    flexDirection: 'row',
    padding: moderateScale(5),
    justifyContent: 'space-between',
    backgroundColor:"#F6FAFD"
  },
  displayItemsTextOne: {
    width: '25%',
    color:'black',
  },
  displayItemsTextTwo: {
    width: '50%',
    paddingLeft: moderateScale(10),
    paddingRight: moderateScale(10),
    color:'black',
  },
  displayItemsTextThree: {
    width: '25%',
    textAlign:'right',
    color:'black',
  },
  scrollPadding: {
    marginBottom: moderateScale(4),
    
  },
  messageStyle:{
    fontWeight:'bold',
  },
  collapseContainer: {
   width:'100%',
   marginTop:'6%',
},
collapseInnerContainer : {
    width:'90%',
    justifyContent:'center',
    alignSelf:'center',
},
headingText:{
  marginLeft:'5%',
  color:'#0569B9',
},
seperatorView:{
  alignSelf:'center',
  width:'98%',
  height:1,
  backgroundColor:'#D3D3D3',
  marginVertical:'2%',
},
collapseButton: {
  alignItems: 'center' ,
  justifyContent: 'center',
},
textMinusPlus: {
  fontSize: moderateScale(26),
  marginHorizontal: moderateScale(0),
  fontWeight: 'bold',
},
});

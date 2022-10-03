import { StyleSheet,Dimensions, Platform } from 'react-native';
import { moderateScale } from '../../../../components/fontScaling';
let appConfig = require('../../../../../appconfig');
let dw = Dimensions.get('window').width;
let dh = Dimensions.get('window').height;
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#0000',
    padding: 4,
  },
  modalContainer:{
    // position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    backgroundColor: 'rgba(70,70,70, 0.9)',
  },
  innerModalContainer:{
    backgroundColor: 'white',
    padding: 5,
    // width:'95%',
    // height: Platform.OS == 'android' ? '75%' : '34%',
    alignSelf:'center',
    // alignItems:'center',
    borderWidth:1,
    borderRadius:8,
    borderColor:'grey',
    marginBottom:10,
  },
  remarksStyle:{
    flex: 0,
    borderBottomLeftRadius:7,
    borderBottomRightRadius:7,
    borderColor: 'grey',
    borderWidth: 1,
    height:70,
  },
  remarksStyle2:{
    flex: 0,
    borderColor: 'grey',
    borderWidth: 1,
    height:65,
    margin:7,
    paddingHorizontal:7,
    borderRadius:8,
  },
  tileContainer:{
    borderWidth: 1,
    flexDirection: 'row',
    borderRadius: 8,
    borderColor: 'grey',
    marginHorizontal: 6,
    padding: 2,
  },
  holidayContainer:{
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: 'grey',
    marginHorizontal: 6,
    padding: 2,
    justifyContent:'center',
    alignItems:'center',
    marginTop:'6.3%',
  },
  remarksText2:{fontWeight:'bold',fontSize:22,paddingHorizontal:'10%',paddingVertical:'7%',textAlign:'center',alignSelf:'center'},
  remarksText:{fontWeight:'bold',fontSize:22,paddingHorizontal:'10%',paddingVertical:'15%',textAlign:'center',alignSelf:'center'},
  holidayText:{fontWeight:'bold',fontSize:22,paddingHorizontal:'10%',paddingVertical:'15%'},
  tileInnerContainer:{ flex: 1},
  rowHolder:{flexDirection:'row',flex:1},
  dateHolder:{flexDirection:'row',alignSelf:'center',alignItems:'center',justifyContent:'center',marginLeft:30},
  dropIcon:{
    flexDirection:'row',
    flex:1,
  },
  picker:{
    flex:1,
  },
  pickerTextStyle:{
    fontSize: 14,
    textAlign: 'center',
    // color:'#fff',
    marginTop:moderateScale(4),
  },
  dropdownStyle:{
    // flex:1,
    width: '40%',
    flex: 0,
    // height: "25%",
  },
  dropdownTextStyle:{
    fontSize: 12,
    alignSelf:'center',
  },
  addItemButtonView: {
    width: '25%',
    flex: 0,
    alignSelf: 'flex-end',
    marginTop: moderateScale(4),
  },
  dropdownText:{fontSize:12,color:'#000',marginTop:10,marginLeft:10,fontWeight:'bold'},
  recordDropIcon1Style: {
    flexDirection:'row',
    borderBottomWidth: 0.5,
    borderRightWidth: 0.5,
    borderColor: appConfig.FIELD_BORDER_COLOR,
    height:40,
    flex:1,
  },
  recordDropIcon3Style: {
    flexDirection:'row',
    borderBottomWidth: 0.5,
    borderRightWidth: 0.5,
    // borderWidth:1,
    borderColor: appConfig.FIELD_BORDER_COLOR,

    height:40,
    flex:1,
  },
  recordDropIcon2Style: {
    flexDirection:'row',
    borderBottomWidth:0.5,
    borderRightWidth: 0.5,
    // borderWidth:1,
    borderColor: appConfig.FIELD_BORDER_COLOR,

    height:40,
    flex:1,
  },
  scroller:{
    marginBottom:dh * 0.02,
  },
  addButtonContainer:{ flex: 0, padding: 4,marginTop:5 },
  addButtonContainer2:{ flex: 0, flexDirection: 'row' ,marginBottom:10},
  historyButton:{marginLeft:10},
  hourTextStyle:{paddingVertical:10,borderWidth:1,borderColor:appConfig.APP_BORDER_COLOR,flex:1,paddingLeft:15, color: '#000'},
});
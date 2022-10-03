import { StyleSheet } from 'react-native';
import { moderateScale } from '../../../components/fontScaling';
let appConfig = require('../../../../appconfig');
export const styles = StyleSheet.create({
  containerInnerView: {
    marginHorizontal: moderateScale(4),
    flex:1,
  },
  topViewStyle: {
    // flex: 0,
    flexDirection: 'row',
    marginVertical: moderateScale(4),
  },
  topViewStyle1: {
    // flex: 0,
    // flexDirection: "row",
    marginVertical: moderateScale(4),
  },
  item: {
    // backgroundColor: "#EC8722",
    paddingLeft: 8,
    paddingTop:3,
    paddingBottom:3,
    marginTop: 3,
    justifyContent:'space-between',
    fontWeight: 'bold',
    borderRadius:5,
    elevation: 2,
    flexDirection:'row',
    alignItems: 'center',
  },
  dropIcon:{
    flexDirection:'row',
    // borderWidth:1,
    backgroundColor:appConfig.GUN_METAL_COLOR,
    borderRadius:5,
    flex:1,
  },
  picker:{
    flex:1,
  },
  pickerTextStyle:{
    fontSize: 14,
    textAlign: 'center',
    color:'#fff',
    marginTop:moderateScale(4),
  },
  dropdownWeekStyle:{
    // flex:1,
    width: '80%',
    flex: 0,
    // height: "25%",
  },
  dropdownYearStyle:{
    // flex:1,
    width: '50%',
    flex: 0,
    // height: "25%",
  },
  dropdownTextStyle:{
    fontSize: 12,
    alignSelf:'center',
    color:'#000',
  },
  addItemButtonView: {
    width: '25%',
    flex: 0,
    alignSelf: 'flex-end',
    marginTop: moderateScale(4),
  },
  recordDropIcon1Style: {
    flexDirection:'row',
    borderBottomWidth: 0.5,
    borderRightWidth: 0.5,
    // borderWidth:1,
    borderColor: appConfig.FIELD_BORDER_COLOR,
    backgroundColor:appConfig.GUN_METAL_COLOR,
    height:40,
    // flex:1
    flex:0.6,
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
    flex:0.4,
  },
  modalContainer:{
    marginTop:moderateScale(30),
    backgroundColor:'#fff',

  },
  searchHolder:{
    flexDirection: 'row',
    alignItems:'center',
    width:'100%',
  },
  searchBar: {
    backgroundColor: '#FFFFFF',
    width: '90%',
    marginLeft: moderateScale(16),
  },
  searchBarSkills: {
    backgroundColor: '#FFFFFF',
    flex:1,
    marginLeft: moderateScale(16),
  },
  textInputStyle:{
    borderColor:'grey',
    borderWidth:1,
    marginTop:moderateScale(5),
    justifyContent:'center',
    paddingVertical:moderateScale(5),
    height: moderateScale(25),
    color:'black',
   },

   cancelButton:{
    borderColor:'grey',
    borderWidth:1,
    backgroundColor:'red',
    marginLeft:moderateScale(20),
  },
  supervisorSeparator: {
    marginTop: 10,
    height: 0.5,
    backgroundColor: appConfig.LIST_BORDER_COLOUR,
  },
  listItem: {
    marginLeft: moderateScale(16),
    width: '90%',
    paddingTop: 10,
    paddingBottom: 10,
  },
  listContentStyle: {
    flexGrow: 1,
    justifyContent: 'center',
  },

});

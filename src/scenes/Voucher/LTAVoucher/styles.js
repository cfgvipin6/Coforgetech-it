import { StyleSheet } from 'react-native';
import { moderateScale } from '../../../components/fontScaling';
let appConfig = require('../../../../appconfig');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  rowHolder: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems:'center',
    paddingVertical:moderateScale(3),
  },
  radioButtonHolder:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex:1,
  },
  radioButtonHolderWithoutTitle:{
    flexDirection: 'row',
    justifyContent: 'center',
    flex:1,
  },
  treatmentHolder:{
    justifyContent: 'space-between',
    flex:1,
  },
  halfHolder:{
    flexDirection: 'row',
    marginHorizontal: moderateScale(15),
    paddingTop:moderateScale(5),
    alignItems:'center',
  },
  heading:{
    fontWeight:'bold',
    flex:2,
    fontSize: 13,
  },
  reasonHeading:{
    fontWeight:'bold',
    flex:1,
    marginHorizontal:moderateScale(15),
  },
  skillsHeading:{
    fontWeight:'bold',
    flex:1,
  },
  skillText:{
   flex:2,
  //  flexDirection: 'row',
   justifyContent: 'center',
   alignItems: 'center',
  //  backgroundColor: 'pink',

  },
  modalContainer:{
    marginTop:moderateScale(16),
    backgroundColor:'#fff',
  },
  searchHolder:{
    flexDirection: 'row',
    alignItems:'center',
    width:'100%',
  },
  boldText:{
    fontWeight:'bold',
    marginLeft:moderateScale(15),
    marginTop:moderateScale(10),
    flex:1,
  },
  description:{
    flex:1,
    fontSize:13,
  },
  npServedText:{
    flex:1,
    color:'green',
    fontSize:13,
  },
  shortFallText:{
    flex:1,
    color:'red',
    fontSize:13,
  },
  radioGroupContainer:{
    marginTop:moderateScale(5),
    paddingTop:moderateScale(5),
    alignItems:'center',
    borderColor:'grey',
    // borderWidth:1,
    marginHorizontal:moderateScale(15),
  },
  radioGroupContainerRecommended: {
    marginTop:moderateScale(5),
    paddingTop:moderateScale(5),
    borderColor:'grey',
    borderWidth:1,
    marginHorizontal:moderateScale(15),
  },
  radioGroupDisabledContainer:{
    marginTop:moderateScale(5),
    paddingTop:moderateScale(5),
    alignItems:'center',
    borderColor:'grey',
    // borderWidth:1,
    marginHorizontal:moderateScale(15),
    opacity: 0.5,
  },
  radioGroupDisabledRecommended: {
    marginTop:moderateScale(5),
    paddingTop:moderateScale(5),
    borderColor:'grey',
    borderWidth:1,
    marginHorizontal:moderateScale(15),
    opacity: 0.5,
  },
  innerContainer: {
    paddingBottom: moderateScale(30), //due to scroll hiding content from bottom
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
    flex:1,
   },
   reasonInputStyle:{
    borderColor:'grey',
    borderWidth:1,
    marginTop:moderateScale(5),
    justifyContent:'center',
    paddingVertical:moderateScale(5),
    height: moderateScale(25),
    color:'black',
    marginHorizontal:moderateScale(15),
    flex:1,
   },
  cardBackground: {
    margin: 8,
    borderWidth: 2,
    flex: 0,
    borderColor: '#f2f7ff',
    borderRadius: 5,
    shadowOffset: {
      width: 10,
      height: 10,
    },
    shadowColor: 'black',
  },
  view_One: {
    flex: 0,
    marginHorizontal: moderateScale(6),
    paddingTop: moderateScale(2),
  },
  proceedView: {
    flex: 0,
    marginTop: 6,
  },
  proceedInnerView: {
    flexDirection: 'column',
    width: '50%',
  },
  rowStyle: {
    flexDirection: 'row',
  },
  textOne: {
    fontWeight: 'bold',
    width: '50%',
  },
  textTwo: {
    width: '50%',
  },
  skills:{
    flex:2,
    marginHorizontal:moderateScale(15),
  },
  textOtherStyle:{
    // width: '100%',
    // backgroundColor: 'red',
    // justifyContent:'center',
    paddingVertical:moderateScale(5),
    // alignItems: 'center',
    // alignSelf: 'center',
    // height: moderateScale(25),
    // color:'grey',
   },
   textOther2Style:{
    borderColor:'grey',
    borderWidth:1,
    marginTop:moderateScale(5),
    justifyContent:'center',
    paddingVertical:moderateScale(5),
    height: moderateScale(25),
    color:'black',
   },

  line:{
    borderBottomColor: 'grey',
    borderBottomWidth: 1,
    flex:1,
    marginHorizontal:moderateScale(10),
  },
  dropDownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  pickerBox: {
    width: '60%',
    alignItems: 'center',
    padding: 10,
  },
  dropIcon: {
    flexDirection: 'row',
    borderWidth: 1,
    backgroundColor: appConfig.DARK_BLUISH_COLOR,
  },
  pickerObject: {
    width: '100%',
    paddingTop: moderateScale(7),
    paddingBottom: moderateScale(7),
  },
  pickerTextStyle: {
    fontSize: 20,
    textAlign: 'center',
    color: '#fff',
  },
  dropdownStyle: {
    width: '55%',
    height: '12%',
    alignItems: 'center',
  },
  dropdownTextStyle: {
    fontSize: 16,
    textAlign: 'center',
  },
  viewSupervisor: {
    borderWidth: 1,
    borderColor: appConfig.LIST_BORDER_COLOUR,
    borderRadius: moderateScale(5),
    width: '95%',
    alignSelf: 'center',
    // marginHorizontal: moderateScale(16),
    marginTop: moderateScale(16),
  },
  textSupervisor: {
    fontSize: 16,
    paddingVertical: 12,
    paddingLeft: 10,
  },
  submitButton: {
    borderWidth: 1,
	  borderColor: appConfig.LIST_BORDER_COLOUR,
	  borderRadius: moderateScale(5),
    width: '95%',
    alignItems: 'center',
	  alignSelf: 'center',
    marginTop: moderateScale(20),
    backgroundColor: appConfig.DARK_BLUISH_COLOR,
    marginBottom:moderateScale(15),
  },
  submitButtonText:{
    color:'#fff',
    paddingVertical:5,
  },
  btnSupervisorText: {
    color: '#fff',
    paddingVertical: 12,
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
  successMsgText: {
    marginHorizontal: '4.3%',
    fontSize: moderateScale(14),
    color: appConfig.GUN_METAL_COLOR,
    letterSpacing: moderateScale(0.7),
    textAlign: 'center',
  },
  downIconStyle: {
    height: 20,
    width: 17,
    alignSelf: 'center',
  },
  selectSkillInnerView: {
    flex: 2,
    flexDirection: 'row',
    borderColor: 'grey',
    borderWidth: 1,
    marginTop: moderateScale(5),
  },
  historyViewStyle:{
    marginTop: 2,
    marginLeft: 6,
    alignSelf: 'flex-start',
  },
});

import { StyleSheet, Platform } from 'react-native';
import { moderateScale } from '../../../components/fontScaling.js';
let appConfig = require('../../../../appconfig');
export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  userInfoView: {
    margin: moderateScale(6),
},
lineItemView: {
  margin: moderateScale(2),
  flex:0,
  // width:"50%"
},
cardBackground: {
  borderWidth: 2,
  flex: 0,
  borderColor: appConfig.FIELD_BORDER_COLOR,
  borderRadius: 5,
  shadowOffset: { width: 10, height: 10 },
  shadowColor: 'black',
},
cardNewBackground: {
  borderWidth: 2,
  flex: 0,
  borderColor: appConfig.FIELD_BORDER_COLOR,
  borderRadius: 5,
  borderStyle: 'dashed',
  shadowOffset: { width: 10, height: 10 },
  shadowColor: 'black',
},
cardStyle: {
  flex: 0,
  marginHorizontal: moderateScale(6),
  paddingVertical: moderateScale(4),
},
textOne: {
  fontWeight: 'bold',
  width: '50%',
},
textTwo: {
  width: '50%',
},
horizontalSpaceView: {
  marginHorizontal: moderateScale(6),
},
nextButtonView: {
  width: '20%',
  flex: 0,
  alignSelf: 'flex-end',
  marginRight: moderateScale(6),
  // position: "absolute",
  // bottom: 2
},
addItemButtonView: {
  width: '25%',
  flex: 0,
  alignSelf: 'flex-end',
  marginTop: moderateScale(6),
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
autocompleteParentView: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
},
autocompleteParentDisableView: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  opacity: 0.4,
},
autocompleteStyle: {
  flex: 1,
  marginTop:moderateScale(2),
},
autocompleteInputStyle: {
  borderColor:'grey',
  borderWidth: 1,
},
autocompleteListStyle: {
  position: 'relative',
  backgroundColor: appConfig.CARD_BACKGROUND_COLOR,
},
leftTextStyle: {
  flex: 1,
  fontWeight: 'bold',
},
leftNewTextStyle: {
  fontWeight: 'bold',
  marginLeft: moderateScale(2),
},
recordSeparatorLine: {
  width: '100%',
  height: 2,
  backgroundColor: '#1C62AD',
},
historyStyle: {
  alignItems: 'flex-end',
  marginRight: moderateScale(6),
  marginBottom: moderateScale(-6),
},
checkUnCheckIconView: {
  flex:1,
  flexWrap: 'wrap',
  marginVertical: moderateScale(2),
},
checkUnCheckNewIconView: {
  flexWrap: 'wrap',
  marginRight: moderateScale(2),
},
noteLineTextStyle: {
  fontSize: 10,
  color: 'blue',
},
tableHead: {
  height: 40,
  backgroundColor: appConfig.LOGIN_FIELDS_BACKGROUND_COLOR,
},
tableFooter: {
  // height: 60,
  backgroundColor: appConfig.LOGIN_FIELDS_BACKGROUND_COLOR,
},
tableTitle: {
  // flex: 1,
  backgroundColor: appConfig.LOGIN_FIELDS_BACKGROUND_COLOR,
},

tableRows:{
  height: 54,
},
tableText: {
  alignSelf: 'center',
  marginHorizontal: 4,
},
tooltipText: {
  flex: 0,
  textDecorationLine: 'underline',
  color: 'blue',
},
modalContainer: {
  flex: 1,
  backgroundColor:'#fff',
},
searchHolder:{
  flexDirection: 'row',
  alignItems:'center',
  width:'100%',
  marginTop:30,
},
searchBarSkills: {
  backgroundColor: '#fff',
  flex:1,
  marginLeft: moderateScale(16),
},
listItem: {
  marginLeft: moderateScale(16),
  width: '90%',
  paddingTop: 10,
  paddingBottom: 10,
},
supervisorSeparator: {
  marginTop: 10,
  height: 0.5,
  backgroundColor: appConfig.LIST_BORDER_COLOUR,
},
});

import { StyleSheet, Platform, Dimensions } from 'react-native';
import { moderateScale } from '../../components/fontScaling.js';
var appConfig = require('../../../appconfig');
export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  rowHolder: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    alignItems:'center',
  },
  halfHolder:{
    flexDirection: 'row',
    marginHorizontal: 10,
    paddingTop:moderateScale(5),
    alignItems:'center',
  },
  searchHolder:{
    flexDirection: 'row',
    alignItems:'center',
    width:'100%',
  },
  attachText:{
    fontWeight:'bold',
    alignSelf:'center',
  },
  attachIcon:{
    marginLeft:moderateScale(15),
  },
  lineHolder:{
    flexDirection: 'row',
    alignItems:'center',
  },
  line:{
    borderBottomColor: 'grey',
    borderBottomWidth: 1,
    flex:1,
    marginHorizontal:moderateScale(10),
  },
  pickerHolder: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: moderateScale(20),
    marginLeft: moderateScale(10),
  },
  heading:{
    fontWeight:'bold',
    flex:1,
    marginTop:5,
  },
  headingText:{
    fontWeight:'bold',
    marginTop:3,
    color:'#fff',
  },
  warning:{
    fontWeight:'bold',
    flex:1,
    color:'red',
    marginHorizontal:moderateScale(10),
  },
  textDays:{
    flex:1,
    color:'blue',
  },
  description:{
    flex:1,
    marginVertical:3,
  },
  empId:{
    flex:1,
    marginLeft:moderateScale(10),
  },
  name:{
    flex:2,
    marginHorizontal:moderateScale(10),
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
  textOtherStyle:{
    borderColor:'grey',
    borderWidth:1,
    marginTop:moderateScale(5),
    paddingHorizontal:moderateScale(5),
    justifyContent:'center',
    paddingVertical:moderateScale(5),
    height: moderateScale(25),
    color:'grey',
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
  modalContainer:{
    marginTop:moderateScale(30),
    backgroundColor:'#fff',

  },
  listOuterView: {
    paddingHorizontal: moderateScale(16),
    paddingBottom: moderateScale(160),
},
listContentStyle: {
  flexGrow: 1,
  justifyContent: 'center',
},
  remarksStyle:{
    borderColor:'grey',
    borderWidth:1,
    marginVertical:moderateScale(10),
    justifyContent:'center',
    marginHorizontal:moderateScale(10),
    paddingVertical:moderateScale(5),
    height: moderateScale(25),
    color:'black',
   },
   actionButtonHolder:{
     alignItems:'center',
     justifyContent:'center',
   },
   submitButton:{
    borderColor:appConfig.VALID_BORDER_COLOR,
    borderWidth:1,
    borderRadius:moderateScale(6),
    marginBottom:moderateScale(4),
    backgroundColor:appConfig.VALID_BORDER_COLOR,
    paddingHorizontal:moderateScale(15),
  },
  buttonText:{
   color:'#fff',
   paddingHorizontal:moderateScale(15),
   fontWeight:'bold',
   paddingVertical:moderateScale(6),
   fontSize:17,
  },
  cancelButton:{
    borderColor:'grey',
    borderWidth:1,
    backgroundColor:'red',
    marginLeft:moderateScale(20),
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
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginHorizontal: 10,
  },
  headerStyle:{
    backgroundColor: appConfig.LOGIN_FIELDS_BACKGROUND_COLOR,
    alignItems:'center',
    justifyContent:'center',
  },
  pickerContainer:{
    flexDirection:'row',
    paddingVertical:moderateScale(10),
    justifyContent:'space-between',

},
pickerBox:{
  width:'88%',
  alignItems:'center',
  alignSelf:'center',
},
dropView:{
  flexDirection:'row',
  borderWidth:1,
  borderColor:appConfig.APP_ORANGE,
  height:35,
  borderRadius:5,
  paddingLeft:moderateScale(7),
},
pickerBox2:{
  width:'58%',
  alignItems:'center',
  marginLeft:moderateScale(23),
},
picker:{
  width:'90%',
  height:35,
},
pickerTextStyle:{
  fontSize: 17,
  textAlign: 'center',
  color:'#000',
  marginTop:moderateScale(5.5),

},
dropdownStyle:{
  width:Dimensions.get('window').width / 1.3,
  height:Dimensions.get('window').height / 4,
  alignItems: 'center',
  borderColor:appConfig.APP_ORANGE,
  borderWidth:1,
  marginTop:10,
  position:'absolute',
  left:50,
  right:0,
  top:0,
  bottom:0,
  zIndex:10,
},
pickerText:{
  fontWeight:'bold',
  marginLeft:moderateScale(10),
  marginVertical:moderateScale(5),
},
dropdownTextStyle:{
  fontSize: 13,
  color:'#000',
},
radioGroupContainer:{
  marginTop:moderateScale(5),
  alignItems:'center',
},
otherReasonContainer:{
  marginTop:moderateScale(10),
  marginHorizontal:moderateScale(10),
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
compContainer:{
  flex:1,
  // marginVertical:5,
},
});

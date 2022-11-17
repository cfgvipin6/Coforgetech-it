import { StyleSheet } from 'react-native';
var appConfig = require('../../../appconfig');
export const styles = StyleSheet.create({
  container:{
      flex:1,
  },
  headerContainer:{
      flex:1,
      flexDirection:'row',
      backgroundColor:appConfig.DARK_BLUISH_COLOR,
      marginTop:10,
  },
  buttonConainer:{
    flex:1,
    justifyContent:'space-between',
    alignItems:'center',
    flexDirection:'row',
  },
  attachText:{
    flex: 1,
    alignSelf:'center',
    color:'#fff',
    fontSize:13,
    marginLeft:7,
  },
  fileItem:{
    flex:1,
    flexDirection:'row',
    alignItems:'flex-start',
    paddingVertical:4,
    paddingLeft:5,
    // backgroundColor:appConfig.BLUE_BORDER_COLOR,
  },
  fileHeadingStyle:{
    flex:1,
    color: 'blue',
    textDecorationLine: 'underline',
  },
  camera:{
    marginRight:10,
  },
  fileName:{
    flex:1,
  },
  deleteIcon:{
    flex:1,
    alignItems:'flex-start',
  },
  modalView:{
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContainer:{backgroundColor:'#D3E5FC',width:'90%', paddingVertical:10, alignItems:'center',borderRadius:6},
  modalButton:{
    width:'60%',
    height:35,
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'#fff',
    borderWidth:1,
    marginVertical:10,
    borderColor:'grey',
    borderRadius:5,
  },
  closeButton:{
    justifyContent: 'center',
    marginRight: 10,
    alignSelf:'flex-end',
},
});

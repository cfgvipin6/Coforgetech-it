import { StyleSheet } from "react-native";
import { moderateScale } from "../../components/fontScaling";
let appConfig = require("../../../appconfig");

export const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  panelNewContainer: {
    flex: 1,
    zIndex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  dragHandler: {
    alignSelf: 'stretch',
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: appConfig.LOGIN_HEADER_COLOR,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  downArrowStyle: {
    width: 46,
    height: 24
  },
  line:{
    height:2,
    backgroundColor:"#fff",
    marginTop:moderateScale(5),
  },
  modalContainer:{justifyContent:'center',alignSelf:'center',alignItems:"center",marginTop:100,width:300,height:300,backgroundColor:"#EC8722"},
  modalHeading:{fontWeight:'bold',color:"white",marginTop:15,fontSize:22},

});

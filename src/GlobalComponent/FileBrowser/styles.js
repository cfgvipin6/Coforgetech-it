import { StyleSheet, Platform } from "react-native";
import { moderateScale } from "../../components/fontScaling.js";
var appConfig = require("../../../appconfig");
export const styles = StyleSheet.create({
  halfHolder:{
    flexDirection: "row",
    paddingTop:moderateScale(5),
    alignItems:'center'
  },
  columnHolder:{
    paddingTop:moderateScale(5),
  },
  attachText:{
    fontWeight:'bold',
    // alignSelf:'center',
    flex: 1,
  },
  browseFileIconView: {
    flex: 1,
    flexDirection:"row"
  },
  attachIcon:{
    alignSelf: 'flex-start',
   
  },
  fileActionStyle:{
    flex: 1
  },
  hyperlinkText: {
    color: 'blue',
    textDecorationLine: 'underline',
    marginVertical:5,
    paddingBottom:5
  },
  container: {
	  flex: 1,
	  flexDirection: 'column',
	  backgroundColor: 'black',
	},
	preview: {
	  flex: 1,
	  justifyContent: 'flex-end',
	  alignItems: 'center',
	},
	capture: {
	  flex: 0,
	  backgroundColor: '#fff',
	  borderRadius: 5,
	  padding: 15,
	  paddingHorizontal: 20,
	  alignSelf: 'center',
	  margin: 20,
	},
});

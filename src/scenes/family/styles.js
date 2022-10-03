import { StyleSheet } from "react-native";
import { moderateScale } from "../../components/fontScaling.js";
var appConfig = require('../../../appconfig');
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom:10,
  },
  cardView:{
      flexDirection:'row',
      flex:1,
      padding:moderateScale(5),
  },
  itemView:{
    width:'50%',
    fontWeight: 'bold'
  },
  itemViewValue:{
    width:'50%',
  },
  cardTitle:{
    fontSize:22,
  }
});

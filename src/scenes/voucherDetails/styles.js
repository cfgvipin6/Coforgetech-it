
import { moderateScale } from '../../components/fontScaling';
import {StyleSheet } from 'react-native';

var appConfig = require('../../../appconfig');

export const styles =  StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: appConfig.WHITE_COLOR,
    },
    cardBackground: {
        // height: moderateScale(175),
        borderWidth: 2,
        //backgroundColor: appConfig.CARD_BACKGROUND_COLOR,
        borderColor: '#f2f7ff',
        borderRadius: 5,
        shadowOffset:{  width: 10,  height: 10  },
        shadowColor: 'black',
        padding: 8,
    },
    tableHead: {
        height: 40,
        backgroundColor: '#f1f8ff',
    },
    tableText: {
        margin: 6,
    },
    cardTitleText: {
        fontSize: 22,
    },
    keyValueTextView:{
        // backgroundColor:'lightgrey',
        paddingTop: 4,
    },
    approveStatusView:{
        marginTop: 10,
        flexDirection: 'column',
    },
    keyText: {
        width: '50%',
        fontWeight:'bold',
    },
    valueText: {
        width: '50%',
    },
    displayItemTextOne:{
        width: '50%',
    },
    displayItemTextTwo:{
        width: '50%',
    },


    rowStyle:{ flexDirection: 'row' },
    dialogTextStyle:{
        marginHorizontal: '4.3%',
        fontSize: moderateScale(14),
        color: appConfig.GUN_METAL_COLOR,
        letterSpacing: moderateScale(0.7),
        textAlign: 'center',
    },
    scrollViewStyle:{       //check once
        marginBottom: 60,
        paddingBottom: moderateScale(16),
        paddingHorizontal: moderateScale(16),
    },
    cardLayout:{
        paddingHorizontal: moderateScale(6),
        paddingTop: moderateScale(2),
    },
    buttonContainer:{
        position: 'absolute',
        bottom: 0,
        paddingHorizontal: moderateScale(16),
        backgroundColor: 'white',
    },
    cardView:{
        flexDirection:'row',
        flex:1,
        padding:moderateScale(5),
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
      fileName:{
        flex:1,
      },
    itemView:{
      width:'50%',
      fontWeight: 'bold',
    },
    itemViewValue:{
      width:'50%',
    },
    buttonBox:{
        width:'50%',
    },
    remarksParent:{
		borderWidth: 1,
		borderColor: appConfig.LIST_BORDER_COLOUR,
		borderRadius: moderateScale(5),
		width: '90%',
		alignItems: 'center',
		alignSelf: 'center',
        marginTop: moderateScale(10),
        marginBottom: moderateScale(6),
    },
    submitModalText: {
        marginHorizontal: '4.3%',
        fontSize: moderateScale(14),
        color: appConfig.GUN_METAL_COLOR,
        letterSpacing: moderateScale(0.7),
        textAlign: 'center',
    },
});

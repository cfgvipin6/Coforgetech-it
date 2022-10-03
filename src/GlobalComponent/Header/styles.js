import { Dimensions, StyleSheet } from 'react-native';
import { moderateScale } from '../../components/fontScaling';
import { AppStyle } from '../../scenes/commonStyle';
let appConfig = require('../../../appconfig');
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export const styles = StyleSheet.create({
    containerView: {
        width: screenWidth,
        height:screenHeight * 8 / 100,
        backgroundColor:appConfig.WHITE_COLOR,
        justifyContent:'center',
        alignItems:'flex-start',
        marginTop:'10%',
    },
    rowHolder:{
        flexDirection:'row',
        alignItems:'center',
        alignSelf:'center',
        width:'100%',
    },
    rowHolder2:{
        flexDirection:'row',
        width:'100%',
        justifyContent:'space-around',
    },
    innerLogoutView:{
        width:'100%',
        justifyContent:'space-around',
    },
    loginHeaderView: {
        height:moderateScale(80),
        backgroundColor:appConfig.LOGIN_HEADER_COLOR,
        flexDirection:'row',
        justifyContent:'space-between',
    },
    titleLogo:{
        alignSelf:'center',
        width:'45%',
        height:90,
       },
    logoutBox:{
        height:moderateScale(40),
        justifyContent: 'center',
        position: 'absolute',
        right: 10,
        zIndex:10,
    },
    headingView:{
        alignItems: 'center',
        justifyContent: 'center',
        height:moderateScale(47),
    },
    messageView:{
        marginHorizontal:moderateScale(18),
        alignItems: 'center',
        justifyContent: 'center',
        width:'100%',
    },
    modalOptionTouchable: {
        height: moderateScale(50),
        width:'45%',
        alignItems: 'center',
        justifyContent: 'center',
        // borderWidth:2,
        // borderColor:'orange',
        // borderRadius:8,
    },
    modalOptionTouchable2: {
        height: moderateScale(50),
        width:'45%',
        alignItems: 'center',
        justifyContent: 'center',

        // borderWidth:2,
        // borderColor:'orange',
        // borderRadius:8,
    },
    optionsOuterView: {
        minHeight: '20%',
        width: '90.9%',
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        borderRadius: moderateScale(4),
        borderColor:'orange',
        borderWidth:1,
    },
    modalOuterView: {
        height: '100%',
        width: '100%',
        backgroundColor: 'rgba(0,0,0,0.7)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    optionsView: {
        alignItems: 'center',
        justifyContent: 'center',
        height:moderateScale(48),
        width:'100%',
    },
    modalFirstHeading: {
        fontSize: AppStyle.font.fontSmallRegular.fontSize,
        letterSpacing: moderateScale(0.8),
        // color: '#fff',
        // textAlign: 'left',
        justifyContent:'center',
        alignItems: 'center',
        padding: 20,
    },
    modalSecondHeading: {
        fontSize: moderateScale(14),
        letterSpacing: moderateScale(0.7),
        color: appConfig.GUN_METAL_COLOR,
    },
    modalOptions: {
        // color: '#fff',
        fontSize: moderateScale(14),
        letterSpacing: moderateScale(0.7),
        lineHeight: 39,
    },
    horizontalLine: {
        height: 1,
        width: '100%',
        backgroundColor: 'rgba(0,0,255,0.18)',
        marginTop:moderateScale(18),
    },
    backbutton:{
        height:moderateScale(40),
        alignItems: 'flex-start',
        justifyContent: 'center',
        marginLeft: moderateScale(6),
    },
    closeButton:{
        justifyContent: 'center',
        margin: 10,
        alignSelf:'flex-end',
    },
});

import { StyleSheet } from 'react-native';
import { moderateScale } from '../../components/fontScaling';
let appConfig = require('../../../appconfig');

export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    innerContainer: {
        paddingVertical: moderateScale(12),
    },
    // showRequestView: {
    //     marginBottom: -40,
    // },
    // contentView: {
    //     paddingHorizontal: moderateScale(16),
    //     flex: 0.85,
    //     paddingBottom: moderateScale(160),
    // },
    // listContentStyle: {
    //     flexGrow: 1,
    //     marginTop: 5,
    //     paddingBottom:10,
    //     justifyContent: "center"
    // },
    cardBackground: {
        borderWidth: 1,
        flex: 0,
        borderColor: appConfig.FIELD_BORDER_COLOR,
        borderRadius: 5,
        shadowOffset: { width: 10, height: 10 },
        shadowColor: 'black',
    },
    view_One: {
        marginHorizontal: moderateScale(6),
        paddingTop: moderateScale(2),
    },
    view_Two: {
        marginHorizontal: moderateScale(6),
    },
    buttonContainer:{
        flexDirection: 'row',
        justifyContent:'space-evenly',
    },
    rowStyle: {
        flexDirection: 'row',
    },
    collapseContainer: {
        flex: 0,
        flexDirection: 'row',
    },
    collapseInnerContainer : {
        flexDirection: 'row',
        alignItems: 'stretch',
    },
    collapseButton: {
        alignItems: 'center' ,
        justifyContent: 'center',
    },
    textMinusPlus: {
        fontSize: moderateScale(26),
        marginHorizontal: moderateScale(0),
        fontWeight: 'bold',
    },
    button: {
        width: '50%',
    },
    textOne: {
        width: '50%',
    },
    textTwo: {
        width: '50%',
        color:'#06141F',
    },

    actionButton: {
        // alignItems: "center",
        justifyContent: 'center',
        marginTop: moderateScale(8),
        width: '100%',
    },
    actionText: {
        alignSelf: 'flex-start',
        paddingLeft: 17,
        marginBottom: 5,
    },
    myAuthorityBoxView: {
        borderWidth: 1,
        borderColor: appConfig.LIST_BORDER_COLOUR,
        borderRadius: moderateScale(5),
        height: moderateScale(40),
        justifyContent: 'center',
        paddingLeft: 10,
        opacity: 0.4,
    },
    authorityBoxView: {
        borderWidth: 1,
        borderColor: appConfig.LIST_BORDER_COLOUR,
        borderRadius: moderateScale(5),
        height: moderateScale(40),
        marginHorizontal: moderateScale(16),
        marginVertical: moderateScale(6),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        // backgroundColor:'red'
        // opacity: 0.4
    },
    authorityTextValue: {
        paddingLeft: 10,
    },
    changeText: {
        color: 'blue',
        textDecorationLine: 'underline',
        paddingRight: 10,
    },
    cardStyle: {
        flex: 0,
        marginHorizontal: moderateScale(6),
        paddingTop: moderateScale(2),
    },
    userInfoView: {
        margin: moderateScale(6),
    },
    customButtonContainer: {
        width: '100%',
        alignSelf: 'center',
        position: 'absolute',
        bottom: 10,
    },
    remarksParent: {        //check once
        borderWidth: 1,
        borderColor: appConfig.LIST_BORDER_COLOUR,
        borderRadius: moderateScale(5),
        marginHorizontal: moderateScale(16),
        marginVertical: moderateScale(6),
        // width: "90%",
        alignItems: 'center',
        // alignSelf: "center",
        marginTop: moderateScale(10),
    },
    approverInfoView: {
        marginVertical: 8,
        flexDirection: 'column',
    },
    keyValueTextView: {
        // backgroundColor: 'lightgrey',
        paddingTop: 4,
    },
    keyValueInnerTextView: {
        flexDirection: 'row',
    },
    keyText: {
        width: '50%',
        fontWeight:'bold',
    },
    valueText: {
        width: '50%',
    },
    successMsgText: {
        marginHorizontal: '4.3%',
        fontSize: moderateScale(14),
        color: appConfig.GUN_METAL_COLOR,
        letterSpacing: moderateScale(0.7),
        textAlign: 'center',
    },
    scrollViewStyle: {
        paddingVertical: moderateScale(2),
        height: '55%', // no use
    },
    supervisorSeparator: {
        marginTop: 10,
        height: 0.5,
        backgroundColor: appConfig.LIST_BORDER_COLOUR,
    },
    listItem: {
        marginHorizontal: moderateScale(16),
        // width: "90%",
        paddingTop: 10,
        paddingBottom: 10,
    },
    cardTitle: {
        fontSize: 22,
    },
    keyCardText: {
        width: '50%',
        fontWeight:'bold',
        fontSize: 12,
    },
    valueCardText: {
        width: '50%',
        fontSize: 12,
    },
});


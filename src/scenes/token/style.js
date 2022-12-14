import { moderateScale } from '../../components/fontScaling'

var appConfig = require('../../../appconfig');


export default {
    container: {
        flex: 1,
        backgroundColor: appConfig.WHITE_COLOR
    },
    userNameText: {
        fontSize: moderateScale(18),
        marginBottom: moderateScale(16),
        marginHorizontal: moderateScale(16),
        fontWeight: 'bold',
    },
    listOuterView: {
        paddingHorizontal: moderateScale(16),
        paddingBottom: moderateScale(16)
    },
    cardBackground: {
        // height: moderateScale(175), 
         borderWidth: 2, 
        flex: 0,
         //backgroundColor: appConfig.CARD_BACKGROUND_COLOR,
         borderColor: "#f2f7ff",
         borderRadius: 5,
         shadowOffset:{  width: 10,  height: 10,  },
         shadowColor: 'black',
         shadowOpacity: 1.0,
        
    },
    borderShad: {
        shadowColor: "rgba(0,0,0,0.8)",
        shadowOffset: { height: 0, width: 0 },
        shadowOpacity: moderateScale(1),
        shadowRadius: moderateScale(4),
    },
    topOuterContainer: {
        flexDirection: "row",
        paddingTop: moderateScale(8),
        justifyContent: "space-between",
        marginHorizontal: moderateScale(8),
        flex: 1,
        height: moderateScale(60),
    },
    topLeftContainer: {
        flexDirection: "column",
        width: "79%"
    },
    reqNum: {
        fontSize: moderateScale(13),
        color: appConfig.LOGIN_FIELDS_BACKGROUND_COLOR,
        letterSpacing: moderateScale(0.55),
        fontWeight: 'bold',
    },
    textStyle: {
        fontSize: moderateScale(11),
        color: appConfig.BLACK_COLOR,
        letterSpacing: moderateScale(0.55),
        width: "75%",
        marginTop: moderateScale(3),
    },
    shadowTextStyle: {
        textShadowColor: 'rgba(0, 0, 0, 0.91)',
        textShadowOffset: { width: 0.6, height: 0.8 },
        textShadowRadius: 4,
        fontSize: moderateScale(11),
        color: appConfig.BLACK_COLOR,
        letterSpacing: moderateScale(0.55),
        width: "75%",
        marginTop: moderateScale(3),
    },
    topRightContainer: {
        width: "21%",
        flexDirection: "column",
        height: moderateScale(45),
        justifyContent: "space-between",
        marginTop: moderateScale(-2),
        alignItems: 'flex-end'
    },
    middleView: {
        height: moderateScale(120),
        marginHorizontal: moderateScale(8),
        justifyContent: "center"
    },
    statusText: {
        justifyContent: 'center',
        textAlign: 'center',
        marginTop: moderateScale(16),
        color: appConfig.LOGIN_FIELDS_BACKGROUND_COLOR,
        fontWeight: 'bold'
    },
    bottomOuterView: {
        marginHorizontal: moderateScale(8),
        justifyContent: "flex-end",
        marginBottom: moderateScale(5)
    },
    bottomInnerView: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    topView: {
        flexDirection: "row",
        height: moderateScale(62),
        backgroundColor: "yellow"
    },
    linerGradtopBar: {
        height: "100%",
        width: "100%",
        alignSelf: "center",
        justifyContent: "center"
    },
    text1: {
        fontSize: moderateScale(18),
        color: "blue",
        textAlign: "center"
    },
    divVertHighlight: {
        height: "100%",
        width: moderateScale(1),
        tintColor: "red"
    },
    subView: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        height: "100%"
    },
    selectView: {
        flex: 1,
        // alignItems: "center",
        // width: "100%",
        justifyContent: "space-evenly",
        height: "100%",
        backgroundColor: "purple",
    },
    innerViewHistory: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    btnView: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        marginBottom: moderateScale(16),
        marginLeft: "3.5%",
        marginRight: "4.3%"
    },
    pastbtnView: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        marginBottom: moderateScale(16),
        marginLeft: "3.5%",
        marginRight: "4.3%"
    },
    noStayView: {
        alignItems: "center",
        marginLeft: moderateScale(15),
        marginRight: moderateScale(15)
    },
    topviewStay: {
        flex: 1,
        marginLeft: moderateScale(15),
        marginRight: moderateScale(15),
        flexDirection: "column"
    },
    img: {
        width: moderateScale(44),
        height: moderateScale(44),
        marginTop: moderateScale(16),
        marginBottom: moderateScale(16)
    },
    txtStyl: {
        color: "black",
        fontSize: moderateScale(14),
        letterSpacing: moderateScale(0.7),
    },
    logoStyl: {
        marginTop: moderateScale(15),
        marginBottom: moderateScale(15),
        height: moderateScale(25)
    },
    inputView: {
        flexDirection: "row",
        marginTop: moderateScale(15),
        overflow: "visible",
        marginLeft: moderateScale(15),
        marginRight: moderateScale(15)
    },
    topTxt: {
        color: "teal",
        fontSize: moderateScale(14),
        letterSpacing: moderateScale(0.7),
    },
    stayTopView: {
        marginTop: moderateScale(16),
        overflow: "visible",
        marginLeft: moderateScale(16),
        marginRight: moderateScale(16),
        flex: 1
    },
    lgradient: {
        height: "100%",
        width: "100%",
        alignSelf: "center",
        justifyContent: "center"
    },

    callIcon: {
        height: moderateScale(20),
        width: moderateScale(20),
        tintColor: appConfig.WHITE_COLOR
    },
    tapIcon: {
        height: moderateScale(10),
        width: moderateScale(20),
        tintColor: appConfig.WHITE_COLOR,

    },
    mapIcon: {
        height: moderateScale(20),
        width: moderateScale(15),
        tintColor: appConfig.WHITE_COLOR
    },
    txtName: {
        fontSize: moderateScale(11),
        color: appConfig.BLACK_COLOR,
        letterSpacing: moderateScale(0.55),
        textShadowColor: 'rgba(0, 0, 0, 0.91)',
        textShadowOffset: { width: 0.6, height: 0.8 },
        textShadowRadius: 4,
        marginTop: moderateScale(4)
    },
    striketextName: {
        fontSize: moderateScale(11),
        color: appConfig.WHITE_COLOR,
        textDecorationLine: "line-through",
        letterSpacing: moderateScale(0.6),
    },
    txtBottm: {
        fontSize: moderateScale(16),
        color: appConfig.WHITE_COLOR,
        letterSpacing: moderateScale(0.8),
    },
    txtBottmNew: {
        fontSize: moderateScale(14),
        color: appConfig.WHITE_COLOR,
        letterSpacing: moderateScale(0.7),
    },
    cancelText: {
        fontSize: moderateScale(11.5),
        color: "rgb(255,90,0)",
        letterSpacing: moderateScale(0.58),
    },
    successBox: {
        marginTop: moderateScale(15),
        backgroundColor: "yellow",
        // height: moderateScale(35),
        paddingVertical: moderateScale(5)
    },
    successTxt: {
        fontSize: moderateScale(16),
        color: appConfig.WHITE_COLOR,
        marginLeft: "4.5%",
        marginTop: moderateScale(2)
    },
}
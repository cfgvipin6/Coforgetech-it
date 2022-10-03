import { StyleSheet } from 'react-native';
import { moderateScale } from '../../../../components/fontScaling';
let appConfig = require('../../../../../appconfig');


export const styles = StyleSheet.create({
    container:{
        flex:1,
    },
    cardBackground: {
        borderWidth: 1,
        flex: 0,
        borderColor: appConfig.FIELD_BORDER_COLOR,
        borderRadius: 5,
        shadowOffset: { width: 10, height: 10 },
        shadowColor: 'black',
    },
    view_One: {
        flex: 0,
        marginHorizontal: moderateScale(6),
        paddingTop: moderateScale(2),
    },
    rowStyle: {
        flexDirection: 'row',
    },
    buttonContainer:{
        flexDirection: 'row',
        marginVertical:'2%',
    },
    textOne: {
        fontWeight: 'bold',
        width: '50%',
    },
    textTwo: {
        width: '50%',
    },
    button: {
        width: '50%',
    },
})
;

import React from 'react'
import {Text, View, StyleSheet} from "react-native"
export const WarningMessage =(props)=> {
    return (
        <View style={style.container}>
            <Text style={style.warningView}>{props.message}</Text>
        </View>
    )
}
const style = StyleSheet.create({
    container:{flex:1},
    warningView:{
        color:'red',
        fontSize:14,
        fontWeight:'bold',
        padding:7
    }
})
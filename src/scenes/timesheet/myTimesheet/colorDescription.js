import React, { useState, useEffect } from 'react'
import { View, Text } from 'react-native'
import { fetchTimesheetWeek } from './service/timeSheetService';
let appConfig = require("../../../../appconfig");

export default ColorDescription = ({ startDt, endDt, empCode, setColorData}) => {
    console.log("pppppp",startDt)
    const [colorArr, setColorArr] = useState([])

    useEffect(() => {
        fetchTimesheetWeek(undefined, 3, startDt, endDt, empCode).then(res => {
            if (res.Result.length > 0) {
                setColorArr(res.Result.filter(it => it.SearchText === "DayTypeAll"))
                setColorData(res.Result.filter(it => it.SearchText === "DayTypeAll"))
            }
        })
    }, [])

    const colorCodeRow = (heading, bgColor) => {
        return (
            <View
                key={"id:"+heading}
                style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: bgColor,
                }}
            >
                <Text>{heading}</Text>
            </View>
        );
    };

    const colorDescriptionView = () => {
        return (
            <View style={{ flex: 0, flexDirection: 'row' }}>
                {colorArr.map(it => {
                    { return colorCodeRow(it.Display, it.Selected) }
                })}
            </View>
        );
    };

    if (colorArr.length > 0) {
        return (
            <View
                style={{
                    flex: 0,
                    borderWidth: 2,
                    borderColor: 'grey',
                    marginVertical: 3,
                    padding: 3,
                }}
            >
                {colorDescriptionView()}
            </View>
        )
    }
    return null
}

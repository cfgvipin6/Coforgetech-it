/* eslint-disable eqeqeq */
/* eslint-disable no-alert */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import {
    View,
    Text,
  } from 'react-native';
import CustomButton from '../../../../components/customButton';
import { prepareTimeSheetData } from '../timesheetUtils';
let globalConstants = require('../../../../GlobalConstants');
export const TimeSheetSaveSubmit = ({recordData,loginData,daysData,onSaveData,onSubmitData,onApproveData,onRejectData,disable,isWorkingDay,isComingFromApprovals}) => {
let workDayCount = daysData.filter((item)=>item.DayID == '1').length;
const [totalHours, setTotalHours] = useState(0);
let appConfig = require('../../../../../appconfig');
useEffect(() => {
     const loadData = async()=>{
      let records = await (await prepareTimeSheetData(recordData)).filter((item)=>item.EffortHrs !== '');
      if (records.length > 0){
        let hrs = records.reduce((a,b)=> (a + parseFloat(b.EffortHrs)),0);
        setTotalHours(hrs);
      }
     };
     loadData();
});

  return (
    <View
      style={{
        // flexDirection: 'row',
        borderTopColor: appConfig.APP_BORDER_COLOR,
        borderTopWidth: 1,
        paddingTop: 2,
        marginTop: 3,
      }}
    >
      <View style={{ width: '100%',flexDirection:'row',marginVertical:10 }}>
        <Text>{`No. of working days: ${workDayCount} | `}</Text>
        <Text>{`Total recorded hours: ${totalHours?.toFixed(2)}`}</Text>
      </View>
      <View style={{flexDirection:'row',alignItems:'center',width:'100%',justifyContent:'center'}}>
      {
       isComingFromApprovals ?
       <View style={{ width: '25%' }}>
        <CustomButton
          label={globalConstants.APPROVE_TEXT}
          positive={true}
          performAction={() => onApproveData(recordData)}
        />
      </View> :

        !disable  &&  isWorkingDay ?
        <View style={{ width: '25%' }}>
        <CustomButton
          label={globalConstants.SAVE_TEXT}
          positive={true}
          performAction={() => onSaveData(recordData)}
        />
      </View> : null
      }
      {
        isComingFromApprovals ?
        <View style={{ width: '25%' }}>
        <CustomButton
          label={globalConstants.REJECT_TEXT}
          positive={false}
          performAction={() => {
              onRejectData(recordData);
            }}
        />
      </View>
      : !disable  && isWorkingDay ?
        <View style={{ width: '25%' }}>
        <CustomButton
          label={globalConstants.SUBMIT_TEXT}
          positive={true}
          performAction={() => {
              onSubmitData(recordData);
            }}
        />
      </View> : null
      }
      </View>
    </View>
  );
};

/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
import React, { useState, useEffect} from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { fetchSelectedWeekList } from './service/timeSheetService';

export default WeeklyGridTab = (props) => {
  const [selectedWeek, setSelectedWeek] = useState([]);
  const scrollerRef = React.createRef();
  console.log('WeeklyGridTab data : ',props);
  useEffect(() => {
    fetchSelectedWeekList(props.startDt, props.endDt,props.empCode).then(res => {
        if (res.Result.length > 0) {
          setSelectedWeek(res.Result);
        }
        console.log('selectedWeek',selectedWeek);
    });
  }, [props.endDt, props.startDt]);

  useEffect(()=>{
    console.log('week counter : ', props.selectedIndex);
    if (scrollerRef.current){
      scrollerRef.current.scrollTo({ x: props.selectedIndex * 70, y: 0, animated: true });
    }
  });

  const fetchDayHours = ()=>{
    let data = props?.records;
    let records = [];
    data.map((item)=>{
       let weekDays = item.lstColumns;
       if (weekDays){
        for (let i = 0; i < weekDays.length; i++){
          let day = weekDays[i];
          if (day.Value !== ''){
            records.push(day);
          }
     }
       }
    });
    return records;
  };

  const onDateSelected = (item) => {
    console.log('onDateSelected',item);
  };
        if (props.colorData.length > 0) {
         let recs =  fetchDayHours();
         console.log('Records to calculate: ', recs);
        return (
            <View
              style={{
                height: 55,
                borderTopWidth: 1,
                borderBottomWidth: 1,
                borderColor: 'grey',
              }}
            >
              <ScrollView
              	keyboardShouldPersistTaps="handled"
               horizontal={true}
               showsHorizontalScrollIndicator={false}
               ref={scrollerRef}
               >

                {selectedWeek.map((item,index) => {
                  const { StartDate, EndDate, StartDay, DayType, DayID } = {...item};
                  let filteredData = recs.filter((item)=>item.Key == StartDate);
                  {/* let hoursToShow = recs.find((item)=> item.Key == StartDate)?.Value !== undefined ?  recs.find((item)=> item.Key == StartDate)?.Value : 0; */}
                  let hoursToShow = filteredData.reduce((a,b)=> (a + parseFloat(b.Value)),0);
                  return (
                    <TouchableOpacity key = {StartDate} onPress={() => props.onDateSelection(item)}>
                      <View
                        style={{
                          borderWidth: 1,
                          borderRadius: 4,
                          margin: 3,
                          backgroundColor: props.colorData.filter(item => item.Display === DayType).map(item => item.Selected),
                          padding: 4,
                        }}
                      >
                        <Text style={{ textAlign: 'center' }}>{StartDate}</Text>
                        {/* hard coded hors hamza will update */}
                        <Text>{StartDay.substring(0,3) + ' (' + hoursToShow + ' h)'}</Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          );
        }
        return null;
};

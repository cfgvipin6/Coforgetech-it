/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable quotes */
/* eslint-disable prettier/prettier */
/*
Author: Mohit Garg(70024)
*/

import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import SubHeader from "../../../GlobalComponent/SubHeader";
import NestedListView, { NestedRow } from "react-native-nested-listview";
import CustomButton from "../../../components/customButton";
import ModalDropdown from 'react-native-modal-dropdown';
import { connect } from 'react-redux';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { styles } from "./styles";
import { globalFontStyle } from "../../../components/globalFontStyle";
import { LabelTextNoValue } from '../../../GlobalComponent/LabelText/LabelText';
import InputController from './components/inputController';
import ColorDescription from './colorDescription';
import WeeklyGridTab from './weeklyGridTab';
import { fetchSelectedWeekList } from './service/timeSheetService';
import images from '../../../images';

let globalConstants = require("../../../GlobalConstants");
let constants = require("./constants");
let appConfig = require("../../../../appconfig");
let prevScreenEmpData;
export class MyTimesheetScreen5 extends Component {

  constructor(props) {
    super(props);
    prevScreenEmpData = this.props.navigation.state.params;
    this.state = {
      activeSections: [0],
      day: prevScreenEmpData?.selectedWeek?.split(" - ")[0],
      myColorData: [],
      hoursData:[],
      empData: prevScreenEmpData,
      weekData:[],
      weekCounter:0,
      getSuperVisor:prevScreenEmpData?.selectedSupervisor
    };
  }
  goForward=()=>{
    console.log('week data : ', this.state.weekData);
    if (this.state.weekData?.length > 0 && this.state.weekCounter < this.state.weekData?.length - 1){
          this.setState({weekCounter:this.state.weekCounter + 1},()=>{
               this.onDateSelected(this.state.weekData[this.state.weekCounter]);
          });
    }
  }

  goBack=()=>{
    console.log('week data : ', this.state.weekData);
    if (this.state.weekData?.length > 0 && this.state.weekCounter > 0){
      this.setState({weekCounter:this.state.weekCounter - 1},()=>{
        this.onDateSelected(this.state.weekData[this.state.weekCounter]);
      });
    }
  }
  componentDidMount(){
    console.log('MyTimesheetScreen5');
    fetchSelectedWeekList(prevScreenEmpData?.selectedWeek?.split(" - ")[0], prevScreenEmpData?.selectedWeek?.split(" - ")[1], this.state.empData?.empData[0]?.EmpCode).then(res => {
      if (res?.Result?.length > 0) {
        this.setState({weekData:res.Result});
      }
      console.log('selectedWeek',this.state.weekData);
  });
  }

  handleBack = () => {
    this.props.navigation.pop();
  };

  dataFound=(data)=>{
    console.log("Data found till now : ", data);
  }
  colorCodeRow = (heading, bgColor) => {
    return (
      <View
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

  colorDescriptionView = () => {
    return (
      <View style={{ flex: 0, flexDirection: 'row' }}>
        {this.colorCodeRow("Half-Day Leave", appConfig.HALF_DAY_LEAVE_COLOR)}
        {this.colorCodeRow("Work Day", appConfig.WORK_DAY_COLOR)}
        {this.colorCodeRow("Weekly Off", appConfig.WEEKLY_OFF_COLOR)}
        {this.colorCodeRow("Full-Day Leave", appConfig.FULL_DAY_LEAVE_COLOR)}
        {this.colorCodeRow("Holiday", appConfig.HOLIDAY_COLOR)}
      </View>
    );
  };
  onDateSelected = dayVal => {
    console.log("Day Val : ",dayVal.StartDate);
    this.setState({ day: dayVal.StartDate,weekCounter: this.state.weekData.findIndex((item)=>item.StartDate == dayVal.StartDate)});
  };
  weekHorizontalView = () => {
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
        horizontal={true} showsHorizontalScrollIndicator={false}>
          {constants.dummyListData4.map(item => {
            return (
              <TouchableOpacity key = {item.title} onPress={() => this.onDateSelected(item.title)}>
                <View
                  style={{
                    borderWidth: 1,
                    borderRadius: 4,
                    margin: 3,
                    backgroundColor: item.color,
                    padding: 4,
                  }}
                >
                  <Text style={{ textAlign: 'center' }}>{item.title}</Text>
                  <Text>{item.day + ' (' + item.hoursRecorded + ' h)'}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  topView = () => {
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
        {this.colorDescriptionView()}
      </View>
    );
  };

  setColorData = (data) => {
    this.setState({
      myColorData: data,
    });
  }
  hoursData=(data)=>{
   console.log("Hours data : ", data);
   this.setState({hoursData:data});
  }
  dayView = () => {
    console.log("this",this.state.getSuperVisor)
    return (
      <View style={{ backgroundColor: '#fff', flex: 1 }}>
        <InputController
         setSupervisor={prevScreenEmpData?.selectedSupervisor ? this.state.getSuperVisor :null }
         navigation={this.props.navigation}
         onDaySelection={(data)=> this.hoursData(data)}
         saveData={(data)=>this.dataFound(data)}
         startDate={prevScreenEmpData?.selectedWeek?.split(" - ")[0]}
         endDate={prevScreenEmpData?.selectedWeek?.split(" - ")[1]} currentDay = {this.state.day}
         empData = {this.state.empData}
         isComingFromApprovals = {prevScreenEmpData?.isComingFromApprovals}
         goBack={this.goBack}
         goForward={this.goForward}
         />
      </View>
    );
  };
  render() {
    // console.log("first",this.state.empData)
    return (
      <ImageBackground
      style={{flex:1}}
      source={images.loginBackground}
    >
      <View style={{ flex: 1 }}>
        <SubHeader
          pageTitle={globalConstants.MY_TIMESHEET_TITLE}
          backVisible={true}
          logoutVisible={true}
          handleBackPress={() => this.handleBack()}
          navigation={this.props.navigation}
        />
        <View style={styles.containerInnerView}>
          {/* {this.topView()} */}
          <ColorDescription
            empCode={prevScreenEmpData?.empData[0]?.EmpCode}
            startDt={prevScreenEmpData?.selectedWeek?.split(" - ")[0]}
            endDt={prevScreenEmpData?.selectedWeek?.split(" - ")[1]}
            setColorData={(data) => this.setColorData(data)}
          />
          <WeeklyGridTab
            onDateSelection={(date)=>this.onDateSelected(date)}
            startDt={prevScreenEmpData?.selectedWeek?.split(" - ")[0]}
            endDt={prevScreenEmpData?.selectedWeek?.split(" - ")[1]}
            colorData = {this.state.myColorData}
            records={this.state.hoursData}
            selectedIndex={this.state.weekCounter}
            empCode={prevScreenEmpData?.empData[0]?.EmpCode}
          />
          {/* {this.weekHorizontalView()} */}
          {this.state.day !== "" && this.dayView()}
        </View>
      </View>
      </ImageBackground>
    );
  }
}

export default connect(
  null,
  null
)(MyTimesheetScreen5);

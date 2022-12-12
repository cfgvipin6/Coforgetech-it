import React, { Component } from 'react';
import { View, BackHandler, ImageBackground } from 'react-native';
import { connect } from 'react-redux';
import { DashBoardItem } from '../../../GlobalComponent/DashBoardItem/DashBoardItem';
import SubHeader from '../../../GlobalComponent/SubHeader';
import images from '../../../images';
import { APPROVAL_ONLY,TIMESHEET_MENU,MY_TIMESHEET_LABEL,MY_TIMESHEET_APPROVAL } from './constants';

let globalConstants = require('../../../GlobalConstants');

class TimesheetDashboardScreen extends Component {

  componentDidMount() {
		BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
	}

  componentWillUnmount() {
		BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
	}

	handleBackButtonClick = () => {
		this.handleBack();
		return true;
	}

  timeSheetDashboardItemClick = (item, index) => {
    
    let routeName = "MyTimesheet4"
    switch (item) {
      case MY_TIMESHEET_LABEL:
        routeName = "MyTimesheet4"
        break;
      case MY_TIMESHEET_APPROVAL:
          routeName ='TimeSheetApproval'
        break;
       default:""
    }
    console.log('Item clicked ', item, routeName);
    this.props.navigation.navigate(routeName);
  }

  handleBack = () => {
    this.props.navigation.pop();
  }

  render() {
    return (
      <ImageBackground
      style={{flex:1}}
      source={images.loginBackground}
    >
        <SubHeader
          pageTitle={globalConstants.TIMESHEET_TITLE}
          backVisible={true}
          logoutVisible={true}
          handleBackPress={() => this.handleBack()}
          navigation={this.props.navigation}
        />
        <DashBoardItem
          data={this.props.loginData?.IsTimesheetValid === 'Y' ? TIMESHEET_MENU : APPROVAL_ONLY}
          dashBoardItemClick={(item, index) => {
            this.timeSheetDashboardItemClick(item, index);
          }}
        />
      </ImageBackground>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loginData: state && state.loginReducer && state.loginReducer.loginData,
  };
};

export default connect(
  mapStateToProps,
  null
)(TimesheetDashboardScreen);

import React, { Component } from 'react';
import { View, BackHandler, ImageBackground } from 'react-native';
import { connect } from 'react-redux';
import { DashBoardItem } from '../../../GlobalComponent/DashBoardItem/DashBoardItem';
import SubHeader from '../../../GlobalComponent/SubHeader';
import images from '../../../images';
import { APPROVAL_ONLY, ListData, TIMESHEET_MENU } from './constants';
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
    console.log('Item clicked ', item, index);
    switch (index) {
      case 0:
        this.props.navigation.navigate('MyTimesheet4');
        break;
      case 1:
        this.props.navigation.navigate('TimeSheetApproval');
        break;
      case 2:
        {
          // this.props.navigation.navigate("MyTimesheet2", {})
        }
        break;
      case 3:
        // this.props.navigation.navigate("MyTimesheet6")
      break;
    }
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
          data={this.props.loginData?.IsTimesheetValid == 'Y' ? TIMESHEET_MENU : APPROVAL_ONLY}
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

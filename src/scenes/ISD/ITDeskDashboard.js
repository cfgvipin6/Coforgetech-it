import React, { Component } from 'react';
import {BackHandler, ImageBackground } from 'react-native';
import { DashBoardItem } from '../../GlobalComponent/DashBoardItem/DashBoardItem';
import SubHeader from '../../GlobalComponent/SubHeader';
const data = ['My Requests', 'Create Request','Pending For Approval'];
let globalConstants = require('../../GlobalConstants');
import { connect } from 'react-redux';
import { fetchEmployeeList } from '../createLeave/leaveApplyActionCreator';
import ActivityIndicatorView from '../../GlobalComponent/myActivityIndicator';
import images from '../../images';
class ITDeskDashboard extends Component {
	componentDidMount() {
		BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
		this.props.fetchEmployees(this.props.loginData);
	}
	dashBoardItemClick = (item, index) => {
        console.log('Item clicked ', item, index);
        switch (index){
            case 0 :
				this.props.navigation.navigate('ITDeskMyRequests');
                break;
            case 1 :
				this.props.navigation.navigate('CreateRequestISD');
                break;
            case 2 :
            {
                this.props.navigation.navigate('PendingRequestIT');
            }
            break;
        }
	}
	componentWillUnmount() {
		BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
	}
	handleBackButtonClick = () => {
		this.handleBack();
		return true;
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
					pageTitle={globalConstants.IT_TITLE}
					backVisible={true}
					logoutVisible={true}
					handleBackPress={() => this.handleBack()}
					navigation={this.props.navigation}
				/>
				<ActivityIndicatorView loader={this.props.loading}/>
				<DashBoardItem
					data={data}
					dashBoardItemClick={(item, index) => {this.dashBoardItemClick(item,index);}}
				/>
			</ImageBackground>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		loginData: state && state.loginReducer &&  state.loginReducer.loginData,
		loading: state.leaveApplyReducer.applyLeaveLoading,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		fetchEmployees: (loginData) => dispatch(fetchEmployeeList(loginData)),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ITDeskDashboard);


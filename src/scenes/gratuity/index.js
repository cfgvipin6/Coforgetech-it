/*
Author: Anjali Bali
*/

import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Text,
  View,
  BackHandler,
  TouchableOpacity,
  LayoutAnimation,
  Image,
  ImageBackground,
} from 'react-native';
import { Card } from 'react-native-elements';
import ActivityIndicatorView from '../../GlobalComponent/myActivityIndicator';
import { gratuityAction, resetGratuityData } from './gratuityAction';
import { styles } from './styles';
import { globalFontStyle } from '../../components/globalFontStyle';
import { ScrollView } from 'react-native-gesture-handler';
import { writeLog } from '../../utilities/logger';
import UserMessage from '../../components/userMessage';
let constants = require('./constants');
let globalConstants = require('../../GlobalConstants');
import Accordion from 'react-native-collapsible/Accordion';
import images from '../../images';
import { AppStyle } from '../commonStyle';
import SubHeader from '../../GlobalComponent/SubHeader';
class GratuityScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      leave_collapse: false,
      leave_height: 0,
      leave_expand: false,

      reimb_collapse: false,
      reimb_height: 0,
      reimb_expand: false,

      gratuity_collapse: false,
      gratuity_height: 0,
      gratuity_expand: false,
      errorPopUp: false,
      isError: '',
      gratuityPopUp: false,
      leaveArray: [],
      activeSections: [
        constants.LEAVE_HEADING,
        constants.REIMBURSEMENTS_HEADING,
        constants.GRATUITY_CALCULATION,
      ],
    };
  }
  componentDidUpdate(previousProps, previousState) {
    console.log('Gratuity Data : ', this.props.gratuityData);
    if (
      this.props.gratuity_error &&
      this.props.gratuity_error.length > 0 &&
      this.state.isError === ''
    ) {
      setTimeout(() => {
        this.setState({ errorPopUp: true, isError: this.props.gratuity_error });
      }, 1000);
    } else if (
      this.props.gratuityData &&
      this.props.gratuityData.length > 0 &&
      this.props.gratuityData.hasOwnProperty('leave') &&
      this.props.gratuityData.OutSource &&
      this.props.gratuityData.OutSource.IsActive &&
      this.props.gratuityData.OutSource.IsActive === true
    ) {
      setTimeout(() => {
        this.setState({
          gratuityPopUp: true,
          isError: this.props.gratuityData.OutSource.IsActive,
        });
      }, 1000);
    } else if (
      this.props?.gratuityData?.leave &&
      this.props.gratuityData.leave !== previousProps.gratuityData.leave
    ) {
      let leaveData = this.props.gratuityData.leave;
      let leaves = [];
      for (let leave in leaveData) {
        if (leaveData[leave].IsActive) {
          leaves.push(leaveData[leave]);
        }
      }
      this.setState({ leaveArray: leaves }, () => {
        console.log('Leaves array pushed :', this.state.leaveArray);
      });
    }
  }
  componentDidMount() {
    writeLog('Landed on ' + 'GratuityScreen');
    this.getGratuityScreenData();
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick
    );
  }
  getGratuityScreenData() {
    this.props.getGratuityDetails(
      this.props.loginData.SmCode,
      this.props.loginData.Authkey
    );
  }
  componentWillUnmount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick
    );
  }

  handleBackButtonClick = () => {
    this.handleBack();
    return true;
  };
  gratuityCalculationView = (itemName, itemValue, itemCalValue) => {
    return (
      <View style={styles.displayItemsView}>
        <Text
          style={[
            globalFontStyle.imageBackgroundLayout,
            styles.displayItemsTextOne,
          ]}
        >
          {itemName}
        </Text>
        <Text
          style={[
            globalFontStyle.imageBackgroundLayout,
            styles.displayItemsTextTwo,
          ]}
        >
          {itemValue}
        </Text>
        <Text
          style={[
            globalFontStyle.imageBackgroundLayout,
            styles.displayItemsTextThree,
          ]}
        >
          {itemCalValue}
        </Text>
      </View>
    );
  };

  showGratuityCalculation(data) {
    console.log('Gratuity Details : ', data);
    if (
      data?.hasOwnProperty('gratuityDetails') &&
      data?.GratuityVIsible?.IsActive === true
    ) {
      let currentDate = data.gratuityDetails[0].Basicdate.Value;
      return (
        <View>
          {data.gratuityDetails[0].days.IsActive ? (
            <View>
              {this.gratuityCalculationView(
                data.gratuityDetails[0].days.Key,
                constants.TOTAL_INDIAN_DAYS,
                data.gratuityDetails[0].days.Value
              )}
            </View>
          ) : null}
          {data.gratuityDetails[0].NoOfYears.IsActive ? (
            <View>
              {this.gratuityCalculationView(
                data.gratuityDetails[0].NoOfYears.Key,
                constants.TOTAL_GRATUITY_DIVIDE,
                data.gratuityDetails[0].NoOfYears.Value
              )}
            </View>
          ) : null}
          {data.gratuityDetails[0].LastBasic.IsActive ? (
            <View>
              {this.gratuityCalculationView(
                data.gratuityDetails[0].LastBasic.Key,
                constants.LAST_BASIC_DATE + ' ' + currentDate,
                data.gratuityDetails[0].LastBasic.Value
              )}
            </View>
          ) : null}
          {data.gratuityDetails[0].PeryearGratuity.IsActive ? (
            <View>
              {this.gratuityCalculationView(
                data.gratuityDetails[0].PeryearGratuity.Key,
                constants.BASIC_CALCULATE,
                data.gratuityDetails[0].PeryearGratuity.Value
              )}
            </View>
          ) : null}
          {data.gratuityDetails[0].TotalGratuityAmount.IsActive ? (
            <View>
              {this.gratuityCalculationView(
                data.gratuityDetails[0].TotalGratuityAmount.Key,
                constants.PER_YEAR_GRATUITY_CAL,
                data.gratuityDetails[0].TotalGratuityAmount.Value
              )}
            </View>
          ) : null}
          {data?.gratuityDetails[0]?.days?.Value.split(' ')[0] < 1700 && (
            <Text style={styles.messageStyle}>{constants.MESSAGE}</Text>
          )}
        </View>
      );
    } else {
      return null;
    }
  }
  onOkClick = () => {
    this.props.resetGratuityPage();
    this.setState({ errorPopUp: false, isError: '' }, () => {
      this.props.navigation.navigate('Login');
    });
  };
  ResetDataAfterLogout() {
    this.props.resetGratuityPage();
  }
  showError = () => {
    // console.log("error of gratuity screen.")
    return (
      <UserMessage
        modalVisible={true}
        heading="Error"
        message={this.props.gratuity_error}
        okAction={() => {
          this.onOkClick();
        }}
      />
    );
  };
  onOkPress() {
    this.props.resetGratuityPage();
    this.setState({ gratuityPopUp: false, isError: '' }, () => {
      this.props.navigation.navigate('DashBoardNew2');
    });
  }

  showNoBalanceMessage = () => {
    return (
      <UserMessage
        modalVisible={true}
        heading="Message"
        message="Sorry, you do not have any balances"
        okAction={() => {
          this.onOkPress();
        }}
      />
    );
  };
  handleBack() {
    writeLog('Clicked on ' + 'handleBack' + ' of ' + 'GratuityScreen');
    this.props.resetGratuityPage();
    // this.props.navigation.navigate("DashBoardNew")
    this.props.navigation.pop();
  }
  renderReimbursementData() {
    let data = this.props.gratuityData;
    console.log('Gratuity data : ', data);
    if (
      data.hasOwnProperty('reimbursements') &&
      data?.KityBalance?.IsActive === true
    ) {
      return (
        <View>
          {data.reimbursements?.LTA.IsActive ? (
            <View>
              <View style={styles.seperatorView} />

              <View style={styles.displayItemsView}>
                <Text style={globalFontStyle.cardLeftText}>
                  {data.reimbursements.LTA.Key}
                </Text>
                <Text style={styles.rightSideVal}>
                  {data.reimbursements.LTA.Value}
                </Text>
              </View>
            </View>
          ) : null}
          {data.reimbursements?.Petrol.IsActive ? (
            <View style={styles.displayItemsView}>
              <Text style={globalFontStyle.cardLeftText}>
                {data.reimbursements.Petrol.Key}
              </Text>
              <Text style={styles.rightSideVal}>
                {data.reimbursements.Petrol.Value}
              </Text>
            </View>
          ) : null}
          {data.reimbursements?.Mobile.IsActive ? (
            <View style={styles.displayItemsView}>
              <Text style={globalFontStyle.cardLeftText}>
                {data.reimbursements.Mobile.Key}
              </Text>
              <Text style={styles.rightSideVal}>
                {data.reimbursements.Mobile.Value}
              </Text>
            </View>
          ) : null}
          {data.reimbursements?.Driver.IsActive ? (
            <View style={styles.displayItemsView}>
              <Text style={globalFontStyle.cardLeftText}>
                {data.reimbursements.Driver.Key}
              </Text>
              <Text style={styles.rightSideVal}>
                {data.reimbursements.Driver.Value}
              </Text>
            </View>
          ) : null}
        </View>
      );
    } else {
      return null;
    }
  }

  renderLeaveDetails = () => {
    return this.state.leaveArray.map((leave) => {
      return (
        <View>
          <View style={styles.displayItemsView}>
            <Text style={globalFontStyle.cardLeftText}>{leave.Key}</Text>
            <Text style={styles.rightSideVal}>
              {parseInt(leave.Value).toFixed(2)}
            </Text>
          </View>
        </View>
      );
    });
  };
  collapse_Function = (heading) => {
    LayoutAnimation.configureNext({
      duration: 300,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      update: { type: LayoutAnimation.Types.easeInEaseOut },
    });
    switch (heading) {
      case constants.LEAVE_HEADING:
        if (this.state.leave_collapse) {
          this.setState({
            leave_collapse: false,
            leave_height: 0,
            leave_expand: false,
          });
        } else {
          this.setState({
            leave_collapse: true,
            leave_height: 150,
            leave_expand: true,
			reimb_collapse: false,
            reimb_height: 0,
            reimb_expand: false,
			gratuity_collapse: false,
            gratuity_height: 0,
            gratuity_expand: false,
          });
        }
        break;

      case constants.REIMBURSEMENTS_HEADING:
        if (this.state.reimb_collapse) {
          this.setState({
            reimb_collapse: false,
            reimb_height: 0,
            reimb_expand: false,
          });
        } else {
          this.setState({
            reimb_collapse: true,
            reimb_height: 150,
            reimb_expand: true,
			leave_collapse: false,
            leave_height: 0,
            leave_expand: false,
			gratuity_collapse: false,
            gratuity_height: 0,
            gratuity_expand: false,
          });
        }
        break;

      case constants.GRATUITY_CALCULATION:
        if (this.state.gratuity_collapse) {
          this.setState({
            gratuity_collapse: false,
            gratuity_height: 0,
            gratuity_expand: false,
          });
        } else {
          this.setState({
            gratuity_collapse: true,
            gratuity_height: 150,
            gratuity_expand: true,
			reimb_collapse: false,
            reimb_height: 0,
            reimb_expand: false,
			leave_collapse: false,
            leave_height: 0,
            leave_expand: false,
          });
        }
        break;
    }
  };

  renderHeader = (isExpandable, headingText) => {
    return (
      <View style={styles.collapseHeader}>
        <View style={styles.rowHolder}>
          <Image source={images.rightCircleArrow} />
          <Text style={[AppStyle.font.fontRegular, styles.headingText]}>
            {headingText}
          </Text>
        </View>
        {isExpandable ? (
          <Image style={styles.arrowRight} source={images.arrowUp} />
        ) : (
          <Image style={styles.arrowRight} source={images.arrowDown} />
        )}
      </View>
    );
  };

  renderLeaveBalance(heading) {
    return (
      <View style={styles.collapseContainer}>
        <View style={styles.collapseInnerContainer}>
          <TouchableOpacity
            onPress={(value) => this.collapse_Function(heading)}
          >
            <View
              // start={{ x: 0, y: 1 }}
              // end={{ x: 0, y: 0 }}
              // colors={['#fff','#D3E5FC']}
              style={{
                paddingHorizontal: '2%',
                paddingVertical: '3%',
                borderRadius: 5,
				borderColor:'#EDE6D6',
        backgroundColor:'#F6FAFD',
				borderWidth:0.5,
              }}
            >
              {this.state.leave_collapse === true ? (
                <View>
                  {this.renderHeader(this.state.leave_collapse, heading)}
				  <View style={styles.seperatorView}/>
                  {this.renderLeaveDetails()}
                </View>
              ) : (
                <View>
                  {this.renderHeader(this.state.leave_collapse, heading)}
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  renderReimbursement(heading) {
    return (
      <View style={styles.collapseContainer}>
        <View style={styles.collapseInnerContainer}>
          <TouchableOpacity
            onPress={(value) => this.collapse_Function(heading)}
          >
            <View
              // start={{ x: 0, y: 1 }}
              // end={{ x: 0, y: 0 }}
              // colors={['#fff','#D3E5FC']}
              style={{
                paddingHorizontal: '2%',
                paddingVertical: '3%',
                borderRadius: 5,
				borderColor:'#EDE6D6',
				borderWidth:0.5,
        backgroundColor:'#F6FAFD',
              }}
            >
              {this.state.reimb_collapse === true ? (
                <View>
                  {this.renderHeader(this.state.reimb_collapse, heading)}
                  {this.renderReimbursementData()}
                </View>
              ) : (
                <View>
                  {this.renderHeader(this.state.reimb_collapse, heading)}
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  renderGratuityCalculation(heading) {
    return (
      <View style={styles.collapseContainer}>
        <View style={styles.collapseInnerContainer}>
          <TouchableOpacity
            onPress={(value) => this.collapse_Function(heading)}
          >
            <View
              // start={{ x: 0, y: 1 }}
              // end={{ x: 0, y: 0 }}
              // colors={['#fff','#D3E5FC']}
              style={{
                paddingHorizontal: '2%',
                paddingVertical: '3%',
                borderRadius: 5,
				borderColor:'#EDE6D6',
				borderWidth:0.5,
        backgroundColor:'#F6FAFD',
              }}
            >
              {this.state.gratuity_collapse === true ? (
                <View>
                  {this.renderHeader(this.state.gratuity_collapse, heading)}
				  <View style={styles.seperatorView}/>
                  {this.showGratuityCalculation(this.props.gratuityData)}
                </View>
              ) : (
                <View>
                  {this.renderHeader(this.state.gratuity_collapse, heading)}
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  render() {
    return (
      <ImageBackground
      style={{flex:1}}
      source={images.loginBackground}
    >
      <View style={styles.container}>
        <ActivityIndicatorView loader={this.props.gratuity_pending} />
        <SubHeader
         pageTitle={globalConstants.GRATUITY_TITLE}
					backVisible={true}
					logoutVisible={true}
					handleBackPress={() => this.handleBack()}
					navigation={this.props.navigation}
				/>
        {/* <Header backVisible={true} handleBackPress={() => this.handleBack()} props={this.props} /> */}
        {this.state.gratuityPopUp === true ? (
          this.showNoBalanceMessage()
        ) : (
		  <View style={{flex:1 }}>
		  {/* <Text style={[AppStyle.font.fontRegular,{color:AppStyle.color.iengageTheme,marginTop:'5%',marginLeft:'6%'}]}>My Balances</Text> */}
		  <ScrollView
      	keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            style={styles.scrollPadding}
          >
            {this.renderLeaveBalance(constants.LEAVE_HEADING)}
            {this.renderReimbursement(constants.REIMBURSEMENTS_HEADING)}
            {this.renderGratuityCalculation(constants.GRATUITY_CALCULATION)}
            {/* {this.renderReimbursementData()}
            {this.showGratuityCalculation(this.props.gratuityData)} */}
          </ScrollView>
		  </View>

        )}
        {this.state.errorPopUp === true ? this.showError() : null}
      </View>
      </ImageBackground>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getGratuityDetails: (empCode, AuthKey) =>
      dispatch(gratuityAction(empCode, AuthKey)),
    resetGratuityPage: () => dispatch(resetGratuityData()),
  };
};

const mapStateToProps = (state) => {
  return {
    loginData: state && state.loginReducer && state.loginReducer.loginData,
    gratuityData: state.gratuityReducer.gratuityData,
    gratuity_pending: state.gratuityReducer.gratuity_pending,
    gratuity_error: state.gratuityReducer.gratuity_error,
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GratuityScreen);

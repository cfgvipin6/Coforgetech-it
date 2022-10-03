/*
Author: Gaganesh Sharma
*/

import React, { Component } from 'react';
import { View, Text, Keyboard, Platform, ImageBackground } from 'react-native';
import { travelTakeAction, fetchRequestorList, resetActionCreator } from './travelAction';
import { connect } from 'react-redux';
import { DismissKeyboardView } from '../../components/DismissKeyboardView';
import { styles } from './styles';
import { writeLog } from '../../utilities/logger';
import {
  userDetail,
  submitToAction,
  getRequestorOptionList,
  getRequestorListArray,
  displaySelectedRequestorField,
  renderRequestorList,
  renderRemarksView,
  renderAdditionalRemarks,
} from './TravelUtility';
import SubHeader from '../../GlobalComponent/SubHeader';
import UserMessage from '../../components/userMessage';
import ActivityIndicatorView from '../../GlobalComponent/myActivityIndicator';
import CustomButton from '../../components/customButton';
let globalConstants = require('../../GlobalConstants');
let appConfig = require('../../../appconfig');
import { moderateScale } from '../../components/fontScaling.js';
import images from '../../images';

let previousScreenData;
let label;
var type;
class TravelActionScreen extends Component {
  constructor(props) {
    super(props);
    previousScreenData = this.props.navigation.state.params;
    checkDTRService = previousScreenData.checkDTRService;
    this.state = {
      requestorListArray: [],
      empData: previousScreenData.employeeDetails,
      action: previousScreenData.action,
      selectedRequestorOption: null,
      selectedRequestor: null,
      requestorOptionList: false,
      displaySupervisorList: false,
      supervisorList: [],
      displaySelectedRequestor: false,
      query: '',
      supervisorListArrayLength: 0,
      inMemoryList: [],
      isPendingDataFetched: false,
      showModal: false,
      messageType: null,
      displayAdditionalRemarks: false,
      remarks: '',
      add_remarks: '',
      isKeyboardActive: false,
      type:'',
    };
  }
  componentDidMount() {

    writeLog('Landed on ' + 'TravelActionScreen');
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    getRequestorListArray(this, this.state.empData);
    if(  this.state.empData.IsShotNotice === 'Y' && this.state.empData.IsJustificationGiven === 'N'){
      this.setState({displayAdditionalRemarks:true})

    }
    else if(this.state.empData.IsShotNotice === 'Y' && this.state.empData.IsJustificationGiven === 'Y'){
       this.setState({displayAdditionalRemarks:false})
       console.log("else is working")
    }
  }

  _keyboardDidShow = () => {
    this.setState({
      isKeyboardActive: true,
    });
  }

  _keyboardDidHide = () => {
    this.setState({
      isKeyboardActive: false,
    });
  }

  handleBack() {
    writeLog('Clicked on ' + 'handleBack' + ' of ' + 'TravelActionScreen');
    this.props.resetState();
    this.setState(
      {
        query: '',
        remarks: '',
        add_remarks: '',
        showModal: false,
      },
      () => {
        this.props.navigation.pop();
      }
    );
  }
  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
    this.props.resetState();
    this.setState(
      {
        query: '',
        remarks: '',
        add_remarks: '',
        showModal: false,
      },
      () => {
        this.props.navigation.pop();
      }
    );
  }

  showDialogBox() {
    let message = '';
    let heading = '';
    if (this.state.showModal) {
      if (this.state.messageType === 0) {
        message = 'Your request has been ';
        message = this.state.action != undefined ? message + this.state.action.toLowerCase() : '';
        heading = 'Successful';
      } else {
        heading = 'Sorry';
      }
      return (
        <UserMessage
          heading={heading}
          message={message}
          okAction={() => {
            this.setState({ showModal: false },()=>{
              this.backNavigate();
            });
          }}
        />
      );
    }
  }

  backNavigate() {
    writeLog('Clicked on ' + 'backNavigate' + ' of ' + 'TravelActionScreen');
    this.props.navigation.navigate('DashBoard');
  }

  updateRequestorOptionList = () => {
    this.setState({
      requestorOptionList: !this.state.requestorOptionList,
    });
  }

  toggleSupervisor = () => {
    this.setState({
      displaySupervisorList: !this.state.displaySupervisorList,
    });
  }

  renderRequestorOptionList() {
    if (this.state.action === 'Approved') {
      if (this.state.requestorOptionList) {
        return getRequestorOptionList('requestorOptionList', this.state, this.fetchData);
      } else {
        return null;
      }
    }
  }
  // updateAdditionalFlag = () => {
  //   this.setState({
  //     displayAdditionalRemarks:
  //     this.state.empData.IsShotNotice === 'Y' && this.state.empData.IsJustificationGiven === 'N'
  //       ? true
  //       : false,
  //   });
  // }
  validateApprove = action => {
    if (
      this.state.selectedRequestor == null ||
      this.state.selectedRequestor == 'Supervisor' ||
      this.state.selectedRequestor == 'Travel Desk' ||
      this.state.selectedRequestor == 'Approving Authority'
      ){
        return alert('Please select name to whom you want to submit the record. ');
      }
    writeLog('Invoked ' + 'validateApprove' + ' of ' + 'TravelActionScreen' + ' for action ' + action);
    let remark = this.state.remarks.trim();
    let justificationRemark = this.state.add_remarks.trim();
    if (action === 'Rejected' && remark === '' && this.state.empData.IsShotNotice === 'N') {
      return alert('Remarks are mandatory.');
    } else if (action === 'Rejected' && this.state.empData.IsShotNotice === 'Y' && remark === '') {
      return alert('Remarks are mandatory.');
    } else if (action == 'Approved' && this.state.selectedRequestorOption == null) {
      return alert('Please select at least one Value.');
    } else if (
      action === 'Approved' &&
      this.state.empData.IsShotNotice === 'Y' &&
      this.state.empData.IsJustificationGiven === 'N' &&
      justificationRemark === ''
    ) {
      return alert('Please provide justification for short notice travel.');
    } else if (
      action === 'Approved' &&
      this.state.empData.IsShotNotice === 'Y' &&
      this.state.empData.IsJustificationGiven === 'N' &&
      justificationRemark.length <= 25
    ) {
      return alert('Minimun 25 characters are required for justification.');
    } else if (
      action === 'Approved' &&
      this.state.empData.IsShotNotice === 'Y' &&
      this.state.empData.IsJustificationGiven === 'N' &&
      justificationRemark.length >= 500
    ) {
      return alert('Maximum 500 characters are allowed for justification.');
    }
    this.props.postAction(
      this.state.empData,
      action,
      this.state.remarks,
      this.state.add_remarks,
      this.state.selectedRequestor
    );
  }
  fetchData = (item, parameter) => {
    switch (item.item) {
      case 'Supervisor':
        type = 's';
        this.setState({type:'s',supervisorList:[],inMemoryList:[],query:''});
        break;
      case 'Approving Authority':
        type = 'A';
        this.setState({type:'A',supervisorList:[],inMemoryList:[],query:''},()=>{
          this.props.getSelectedRequestorList(this.supervisorCallBack,this.state.query,this.state.empData, this.state.type);
        });
        break;
      case 'Travel Desk':
        type = 'T';
        this.setState({type:'T',supervisorList:[],inMemoryList:[],query:''},()=>{
          this.props.getSelectedRequestorList(this.supervisorCallBack,this.state.query,this.state.empData, this.state.type);
        });
        break;
    }
    if (parameter === 'requestorOptionList') {
      this.props.resetState();
      this.setState(
        {
          isPendingDataFetched: false,
          displaySupervisorList: false, // To show available requestor list
          selectedRequestor: item.item, // To show available requestor list name
          displaySelectedRequestor: true, //
          requestorOptionList: false, //
          selectedRequestorOption: item.item,
        },
        () => {
          this.setState({
            displaySupervisorList: true,
          });
        }
      );
    } else {
      this.setState({
        selectedRequestor: item.item, // To show available requestor list name
        displaySelectedRequestor: true, //
        displaySupervisorList: false, //
        // displayAdditionalRemarks:
        //   this.state.empData.IsShotNotice === 'Y' && this.state.empData.IsJustificationGiven === 'N'
        //     ? true
        //     : false, // To show additional input text.
      });
    }
  }

  updateSearch = searchText => {
    this.setState(
      {
        query: searchText,
      },
      () => {
        const filteredData = this.state.inMemoryList.filter(element => {
          let elementSearched = type == 's' ?  element.EmpName.toLowerCase() :  element.EmpName.toLowerCase().replace(/\s/g,'');
          let queryLowerCase = type == 's' ?  this.state.query.toLowerCase() :  this.state.query.toLowerCase().replace(/\s/g,'');
          return elementSearched.indexOf(queryLowerCase) > -1;
        });
        this.setState({ supervisorList: filteredData });
      }
    );
  }

  supervisorCallBack=(data)=>{
    this.setState({
      supervisorList: this.state.supervisorList.length > 0 ? this.state.supervisorList : data,
      inMemoryList: data,
      supervisorListArrayLength: data.length,
      displaySupervisorList: true,
      isPendingDataFetched: true,
    });
  }

  componentDidUpdate(prevState,prevProps){
    if (prevProps.query != this.state.query){
      if (this.state.query.length > 2 && type == 's'){
         this.props.getSelectedRequestorList(this.supervisorCallBack,this.state.query,this.state.empData, this.state.type);
      }
    }
    if (this.state.query.length < 1 && this.state.supervisorList.length != 0){
      if (this.state.type == 's'){
        this.setState({
          supervisorList:[],
          inMemoryList:[],
        });
      }
    }
     if (this.props.travelAction === 'Success') {
      setTimeout(()=>{
        this.setState({showModal: true, messageType: 0});
      },1000);
    } else if (
      (this.props.travelAction &&
        (JSON.stringify(this.props.travelAction).includes('Exception') ||
        this.props.travelAction.includes('No Data from server!'))) ||
        this.props.travelAction.includes('Unauthorized access')
    ) {
      // console.log("Show modal for failure is up!")
      setTimeout(()=>{
        this.setState({showModal: true, messageType: 2});
      },1000);
    }
  }
  renderMainView = () => {
    return <View style={{}} />;
  }
  render() {
    console.log('Additional Remarks : ', this.state.displayAdditionalRemarks);
    console.log('Employee Data : ', this.state.empData);
    console.log('Selected requestor type : ', this.state.selectedRequestorOption);
    return (
      <DismissKeyboardView style={styles.parentView}>
      <ImageBackground
      style={{flex:1}}
      source={images.loginBackground}
    >
        <SubHeader
          pageTitle={(checkDTRService) ? globalConstants.TRAVEL_DOMESTIC_ACTION_TITLE : globalConstants.TRAVEL_INTERNATIONAL_ACTION_TITLE}
          backVisible={true}
          logoutVisible={true}
          handleBackPress={() => this.handleBack()}
          navigation={this.props.navigation}
        />
        <ActivityIndicatorView loader={this.props.isLoading} />
        {!this.state.isKeyboardActive ? userDetail(this.state.empData) : null}
        {renderRemarksView(this)}
        {renderAdditionalRemarks(this)}
        {submitToAction(this.state, this.updateRequestorOptionList)}
        {this.renderRequestorOptionList()}
        {displaySelectedRequestorField(this.state, this.toggleSupervisor, this.updateSearch)}
        {renderRequestorList(this.state, this.fetchData)}

        <View style={styles.customButtonContainer}>
          <CustomButton
            label={this.state.action === 'Approved' ? 'APPROVE' : 'REJECT'}
            positive={this.state.action === 'Approved' ? true : false}
            performAction={() => this.validateApprove(this.state.action)}
          />
        </View>
        {this.state.showModal
          ? this.showDialogBox()
            :  null}
            </ImageBackground>
      </DismissKeyboardView>
    );
  }
}

const mapStateToProps = state => {
  return {
    isLoading: state.travelReducer.travelLoading,
    isError: state.travelReducer.travelError,
    pendingTravelData: state.travelReducer.pendingTravelData,
    travelAction: state.travelReducer.travelAction,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    resetState: () => dispatch(resetActionCreator()),
    getSelectedRequestorList: (callback,searchText, item, type) => dispatch(fetchRequestorList(callback,searchText, item, type)),
    postAction: (data, action, remarks, add_remarks, submitTo) =>
    dispatch(travelTakeAction(data, action, remarks, add_remarks, submitTo)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TravelActionScreen);

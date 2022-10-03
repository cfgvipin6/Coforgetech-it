import React, { Component } from 'react';
import { Text, View, TouchableOpacity, ScrollView, FlatList, Alert, Keyboard, Platform, ImageBackground } from 'react-native';
import { styles } from './styles';
import { connect } from 'react-redux';
import { SearchBar } from 'react-native-elements';
import { DismissKeyboardView } from '../../components/DismissKeyboardView';
import SubHeader from '../../GlobalComponent/SubHeader';
import { userDetail, submitToAction, getRequestorOptionList, getRequestorListArray, displaySelectedRequestorField, renderRequestorList, renderRemarksView, renderAdditionalRemarks } from './visaUtility';
import { visaTakeAction, fetchRequestorList, resetSupervisor } from './visaAction';
import CustomButton from '../../components/customButton';
import UserMessage from '../../components/userMessage';
import helper from '../../utilities/helper';
let globalConstants = require('../../GlobalConstants');
let constants = require('./constants');
import { writeLog } from '../../utilities/logger';
import { globalFontStyle } from '../../components/globalFontStyle';
import ActivityIndicatorView from '../../GlobalComponent/myActivityIndicator';
import images from '../../images';
class VisaApproveRejectScreen extends Component {
  constructor(props) {
    super(props);
    previousScreenData = this.props.navigation.state.params;
    empData = previousScreenData.employeeDetails,
    action = previousScreenData.action,
    this.state = {
        selectedSupervisorValue: null,
        requestorOptionList: false,
        requestorListArray: [],
        supervisorList: [],
        supervisorSearchList: [],
        query: '',
        isKeyboardActive: false,
        remarks: '',
        showModal: false,
        messageType: null,
        changeApprover: false,
        resultModalVisible:false,
    };
  }

  componentDidMount() {
    writeLog('Landed on ' + 'VisaApproveRejectScreen');
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow',this._keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide',this._keyboardDidHide);
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
    this.props.resetSupervisor();
  }

  static getDerivedStateFromProps(nextProps, state) {
    // console.log("Check : ",nextProps.visaActionResponse,"props : ",nextProps, "  State : ",state);
    if (
      nextProps.visaSupervisorData &&
      !state.query.length > 0 &&
      nextProps.visaActionResponse == '' &&
      nextProps.visaActionError == ''
    ) {
      return {
        supervisorList: nextProps.visaSupervisorData,
        supervisorSearchList: nextProps.visaSupervisorData,
      };
    } else {
      return null;
    }
  }
 componentDidUpdate(){
   if (this.state.resultModalVisible !== true && this.props.visaActionResponse === 'SUCCESS'){
     setTimeout(()=>{
      this.setState({resultModalVisible:true, showModal: true,messageType:0});
     },1000);
   } else if (this.state.resultModalVisible !== true && this.props.visaActionError.length > 0){
    setTimeout(()=>{
      this.setState({resultModalVisible:true, showModal: true,messageType:1});
     },1000);
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

   backNavigate = () => {
    writeLog('Clicked on ' + 'backNavigate' + ' of ' + 'VisaApproveRejectScreen');
    this.props.navigation.navigate('DashBoard');
   }

   showDialogBox = () => {
    let message = '';
    let heading = '';
    if (this.state.showModal) {
      if (this.state.messageType === 0) {
        message = 'Your request has been ';
        message =
            action != undefined
            ? message + action.toLowerCase()
            : '';
        heading = 'Successful';
          return (
            <UserMessage
              modalVisible={true}
              heading={heading}
              message={message}
              okAction={() => {
                this.setState({ showModal: false });
                this.backNavigate();
              }}
            />
          );
      } else {
        let heading = 'Error';
        let message = this.props.visaActionError;
        return (
          <UserMessage
            modalVisible={true}
            heading={heading}
            message={message}
            okAction={() => {
              this.setState({ showModal: false });
              helper.onOkAfterError(this);
            }}
          />
        );
      }
    }
  }

   validateApprove = () => {
    let Remarks = this.state.remarks.trim();
    writeLog('Invoked ' + 'validateApprove' + ' of ' + 'VisaApproveRejectScreen' + ' for ' + action);
    if (Remarks == '') {
			alert('Remarks are mandatory.');
		} else {
			this.props.postAction(
        empData,
        action,
        this.state.remarks,
        this.state.selectedSupervisorValue,
      );
		}
   }

  updateRequestorOptionList = () => {
    if (!this.state.supervisorList.length > 0) {
    this.setState({
      changeApprover: true,
    },() => {
      this.props.getSelectedRequestorList();
    });
  } else {
    this.props.resetSupervisor();
    this.setState({
      changeApprover: false,
    });
  }
    // this.setState({
    //   requestorOptionList: !this.state.requestorOptionList
    // });
  };

  handleBack = () => {
    writeLog('Clicked on ' + 'handleBack' + ' of ' + 'VisaApproveRejectScreen');
    this.props.navigation.pop();
  };

  onSupervisorSelection = (value) => {
    writeLog('Invoked ' + 'onSupervisorSelection' + ' of ' + 'VisaApproveRejectScreen' + ' for ' + value);
    this.props.resetSupervisor();
    this.setState({
      selectedSupervisorValue : value,
      changeApprover: false,
      query: '',
    });
  }

  renderSuperVisors = (item, index) => {
    return (
      <TouchableOpacity
        onPress={() => this.onSupervisorSelection(item.Value)}
        style={styles.listItem}
      >
        <Text>{item.Value}</Text>
        <View style={styles.supervisorSeparator} />
      </TouchableOpacity>
    );
  };

  showRequests = () => {
    if (this.state.supervisorList.length > 0) {
      let data = this.state.supervisorList.sort(
        (a, b) => a.Value - b.Value
      );
      // console.log("sort data::::",data)
      return (
        <FlatList
          data={data}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => this.renderSuperVisors(item, index)}
          keyExtractor={(item, index) =>
            'supervisorRequest_' + index.toString()
          }
        />
      );
    } else {
      return null;
    }
  };

  updateSearch = searchText => {
    this.setState(
      {
        query: searchText,
      },
      () => {
      // console.log("my supervisor data::::",this.state.supervisorSearchList)
        // const filterArray = this.state.supervisorSearchList.map(val => val.Value)
        const filteredData = this.state.supervisorSearchList.filter(
          element => {
            let elementSearched = element.Value.toLowerCase();
            let queryLowerCase = this.state.query.toLowerCase();
            return elementSearched.indexOf(queryLowerCase) > -1;
          }
        );
        this.setState({
          supervisorList: filteredData,
        });
      }
    );
  };

  renderSearch = () => {
    const { query } = this.state;
    return (
      <SearchBar
        lightTheme
        placeholder={globalConstants.SEARCH_PLACEHOLDER_TEXT}
        onChangeText={this.updateSearch}
        value={query}
        raised={true}
        containerStyle={globalFontStyle.searchGlobal}
        autoCapitalize="none"
            autoCompleteType="off"
            autoCorrect={false}
      />
    );
  };

  render() {
    return (
    <ImageBackground
      style={{flex:1}}
      source={images.loginBackground}
    >
      <DismissKeyboardView style={styles.container}>
        <View style={{flex:1}}>
          <SubHeader
            pageTitle={globalConstants.VISA_ACTION_TITLE}
            backVisible={true}
            logoutVisible={true}
            handleBackPress={() => this.handleBack()}
            navigation={this.props.navigation}
          />
          <ActivityIndicatorView loader = {this.props.visaLoader}/>
           {(!this.state.isKeyboardActive) ? (!this.state.changeApprover ? userDetail(empData, action) : null) : null}
           {submitToAction(action, empData.DefaultApprover, this.updateRequestorOptionList, empData.NextStage, this)}
           {(this.state.changeApprover) ? this.renderSearch() : null}
           {(this.state.changeApprover) ? <ScrollView
          style={styles.scrollViewStyle}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {this.showRequests()}
          {/* {this.displaySupervisorName()} */}
        </ScrollView> : null}
           {(!this.state.changeApprover) ? renderRemarksView(this) : null}
           {(!this.state.changeApprover) ? <View style={styles.customButtonContainer}>
             <CustomButton
               label={action === globalConstants.APPROVED_TEXT ? globalConstants.APPROVE_CAPS_TEXT : globalConstants.REJECT_CAPS_TEXT}
               positive={action === globalConstants.APPROVED_TEXT ? true : false}
               performAction={() => this.validateApprove()}
             />
           </View> : null}
           {this.state.showModal ? this.showDialogBox() : null}
        </View>
      </DismissKeyboardView>
      </ImageBackground>
    );
  }
}

const mapStateToProps = state => {
  return {
    visaActionResponse: state.visaReducer.visaActionResponse,
    visaActionError: state.visaReducer.visaActionError,
    visaSupervisorData: state.visaReducer.visaSupervisorData,
    visaLoader: state.visaReducer.visaLoader,
  };
};

const mapDispatchToProps = dispatch => {
  return {
     resetSupervisor: () => dispatch(resetSupervisor()),
     getSelectedRequestorList:() => dispatch(fetchRequestorList()),
     postAction: (data, action, remarks, defaultApprover) => dispatch(visaTakeAction(data, action, remarks, defaultApprover)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VisaApproveRejectScreen);

import React, { Component } from 'react';
import {
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  TextInput,
  Alert,
  FlatList,
  Image,
} from 'react-native';
import { globalFontStyle } from '../../components/globalFontStyle';
import UserMessage from '../../components/userMessage';
import { completeRequest } from './ecrpAction';
import SubHeader from '../../GlobalComponent/SubHeader';
import { connect } from 'react-redux';
import { styles } from './styles';
import helper from '../../utilities/helper';
import { writeLog } from '../../utilities/logger';
import images from '../../images';
let constants = require('./constants');
let globalConstants = require('../../GlobalConstants');

class ECRPApproveReject extends Component {
  constructor(props) {
    super(props);
    previousScreenData = this.props.navigation.state.params;
    (empData = previousScreenData.employeeDetails),
      (action = previousScreenData.action),
      (this.state = {
        localSuperVisorData: [],
        localSuperVisorSearchList: [],
        submitTo: 'Select',
        superVisorEmpId: '',
        remarks: '',
        query: '',
        showModal: false,
        messageType: null,
        selectedEmployeeValue: '',
        selectEmployeeOption: false,
        isSelectedEmployee: false,
        popUpMessage: '',
      });
    this.submitRef = React.createRef();
  }
  componentDidUpdate() {
    if (
      this.props.ecrpActionResponse &&
      this.props.ecrpActionResponse === 'SUCCESS' &&
      this.state.popUpMessage === ''
    ) {
      setTimeout(() => {
        this.setState({
          showModal: true,
          messageType: 0,
          popUpMessage: this.props.ecrpActionResponse,
        });
      }, 1000);
    } else if (
      this.props.ecrpActionError &&
      this.props.ecrpActionError.length > 0 &&
      this.state.popUpMessage === ''
    ) {
      setTimeout(() => {
        this.setState({
          showModal: true,
          messageType: 1,
          popUpMessage: this.props.ecrpActionError,
        });
      }, 1000);
    }
  }
  componentDidMount() {
    writeLog('Landed on ' + 'ECRPApproveReject');
  }

  setData = (item) => {
    this.setState({
      selectedEmployeeValue: item.item,
      selectEmployeeOption: false,
    });
  };

  renderListView = (item) => {
    // console.log("33333",item.item)
    let dataToDisplay = item.item;
    return (
      // <View style={styles.selectedOptionBoxView}>
      <TouchableOpacity
        onPress={() => this.setData(item)}
        style={styles.selectedOptionBoxView}
      >
        <Text style={styles.textInputStyle}>{dataToDisplay}</Text>
      </TouchableOpacity>
      // </View>
    );
  };

  renderList = () => {
    let data = [empData.SMName, empData.FirstLevelSup.Value];
    return (
      <View style={styles.selectOptionView}>
        <FlatList
          data={data}
          // extraData={this.state}
          renderItem={(item) => this.renderListView(item)}
          ItemSeparatorComponent={() => (
            <Image
              source={require('../../assets/divHorizontal.png')}
              style={styles.selectOptionImage}
            />
          )}
        />
      </View>
    );
  };

  renderRequestorOptionList() {
    if (this.state.selectEmployeeOption) {
      return this.renderList();
    }
  }

  showApprover = () => {
    let label = '';
    let selectFlag = false;
    // console.log("------------",empData.FirstLevelSup.IsActive,"\n---------",empData.SupPLAN)
    if (
      empData.FirstLevelSup.IsActive &&
      (empData.SupPLAN === 'R' || empData.SupPLAN === 'S')
    ) {
      // console.log("1111111111SupPlan::",empData.SupPLAN)
      selectFlag = true;
      label =
        this.state.selectedEmployeeValue === ''
          ? constants.SELECT_TEXT
          : this.state.selectedEmployeeValue;
    } else {
      label = empData.SMName;
    }
    return (
      <View style={styles.approverView}>
        <Text style={styles.submitToText}>{constants.SUBMIT_TO_TEXT}</Text>
        {/* <View style={styles.selectedBoxView}> */}
        <TouchableOpacity
          onPress={() => {
            selectFlag
              ? this.setState({
                  selectEmployeeOption: !this.state.selectEmployeeOption,
                })
              : null;
          }}
          style={styles.selectedBoxView}
        >
          <Text style={styles.selectedTextValue}>{label}</Text>
        </TouchableOpacity>
        {/* </View> */}
        {this.renderRequestorOptionList()}
        {this.renderRemarks()}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={() => this.submitRequest()}
        >
          <Text style={styles.submitRejectButtonText}>
            {constants.RELEASE_TEXT}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  backNavigate() {
    writeLog('Clicked on ' + 'backNavigate' + ' of ' + 'ECRPApproveReject');
    this.props.navigation.navigate('DashBoard');
  }

  showDialogBox = () => {
    let message = '';
    let heading = '';
    if (this.state.showModal) {
      if (this.state.messageType === 0) {
        message = 'Your letter has been ';
        message =
          action === globalConstants.REJECTED_TEXT
            ? message + constants.SEND_BACK_TEXT.toLowerCase()
            : message + constants.RELEASE_TEXT.toLowerCase();
        heading = 'Successful';
        return (
          <UserMessage
            heading={heading}
            message={message}
            okAction={() => {
              this.setState({ showModal: false, popUpMessage: '' }, () => {
                this.backNavigate();
              });
            }}
          />
        );
      } else {
        return (
          <UserMessage
            heading="Error"
            message={this.props.ecrpActionError}
            okAction={() => {
              this.setState({ showModal: false, popUpMessage: '' }, () => {
                this.backNavigate();
              });
            }}
          />
        );
      }
    }
  };

  submitRequest = () => {
    // console.log("selectedEmployeeValue",this.state.selectedEmployeeValue)
    let MyRemarks = this.state.remarks.trim();
    if (MyRemarks === '' && action === globalConstants.REJECTED_TEXT) {
      alert('Please enter remarks!!');
    }
    // else if(action === globalConstants.APPROVED_TEXT && this.state.selectedEmployeeValue === "" && empData.FirstLevelSup.IsActive && (empData.SupPLAN === "R" || empData.SupPLAN === "S")) {
    // 	alert("Please select at least one Value!!");
    // }
    else if (action === globalConstants.APPROVED_TEXT) {
      writeLog(
        'Clicked on ' +
          'submitRequest' +
          ' of ' +
          'ECRPApproveReject' +
          ' for ' +
          'Approved'
      );
      this.props.completeRequest(
        empData,
        1,
        MyRemarks,
        action,
        this.state.selectedEmployeeValue
      );
    } else if (action === globalConstants.REJECTED_TEXT) {
      writeLog(
        'Clicked on ' +
          'submitRequest' +
          ' of ' +
          'ECRPApproveReject' +
          ' for ' +
          'Rejected'
      );
      this.props.completeRequest(empData, 2, MyRemarks, action, '');
    }
  };

  renderRemarks = () => {
    return (
      <View style={styles.remarksParent}>
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          autoCompleteType="off"
          multiline={true}
          maxLength={200}
          onChangeText={(text) => this.setState({ remarks: text })}
          value={this.state.remarks}
          placeholder="Remarks"
          style={styles.textInputStyle}
        />
      </View>
    );
  };

  showRemarksAndRejectButton = () => {
    return (
      <View style={styles.rejectView}>
        {this.renderRemarks()}
        <View style={styles.rejectContainer}>
          <TouchableOpacity
            onPress={() => this.submitRequest()}
            style={styles.negativeButton}
          >
            <Text style={styles.submitRejectButtonText}>
              {constants.SEND_BACK_TEXT}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  showEcrpRowGrid = (itemName, itemValue) => {
    if (itemValue != '' && itemValue != null && itemValue != undefined) {
      return (
        <View style={styles.rowStyle}>
          <Text style={[globalFontStyle.imageBackgroundLayout, styles.textOne]}>
            {itemName}
          </Text>
          <Text style={[globalFontStyle.imageBackgroundLayout, styles.textTwo]}>
            {itemValue}
          </Text>
        </View>
      );
    } else {
      return null;
    }
  };

  showEcrpUserDetails = () => {
    let wefValue = empData.WEF.replace(/-/g, ' ');
    return (
      <View style={styles.cardOuterView}>
        <ImageBackground style={styles.cardBackground} resizeMode="cover">
          <View style={styles.view_One}>
            {this.showEcrpRowGrid(
              constants.EMPLOYEE_TEXT,
              empData.SMName.trim()
            )}
            {this.showEcrpRowGrid(constants.WEF_TEXT, wefValue)}
            {this.showEcrpRowGrid(constants.STATUS_TEXT, empData.EmpStatus)}
            {empData.FirstLevelSup.Value != ':'
              ? this.showEcrpRowGrid(
                  constants.FIRST_LEVEL_SUP_TEXT,
                  empData.FirstLevelSup.Value
                )
              : null}
          </View>
        </ImageBackground>
      </View>
    );
  };

  handleBack = () => {
    this.props.navigation.pop();
  };

  render() {
    return (
      <ImageBackground style={{ flex: 1 }} source={images.loginBackground}>
        <View style={styles.container}>
          <SubHeader
            pageTitle={globalConstants.ECRP_ACTION_TITLE}
            backVisible={true}
            logoutVisible={true}
            handleBackPress={() => this.handleBack()}
            navigation={this.props.navigation}
          />
          {this.showEcrpUserDetails()}
          {action === globalConstants.APPROVED_TEXT
            ? this.showApprover()
            : this.showRemarksAndRejectButton()}
          {this.state.showModal ? this.showDialogBox() : null}
        </View>
      </ImageBackground>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    //   ecrpSupervisorData: state.ecrpReducer.ecrpSupervisorData,
    ecrpActionResponse: state.ecrpReducer.ecrpActionResponse,
    ecrpActionError: state.ecrpReducer.ecrpActionError,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    completeRequest: (empData, type, remarks, action, selectedEmp) =>
      dispatch(completeRequest(empData, type, remarks, action, selectedEmp)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ECRPApproveReject);

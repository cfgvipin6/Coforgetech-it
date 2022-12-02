import React, { Component } from 'react';
import {
  View,
  Text,
  ImageBackground,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  ScrollView,
} from 'react-native';
import { connect } from 'react-redux';
import SubHeader from '../../GlobalComponent/SubHeader';
import { styles } from './styles';
import { globalFontStyle } from '../../components/globalFontStyle';
import helper from '../../utilities/helper';
import { cdsActionApprove, cdsActionTaken } from './cdsAction';
import UserMessage from '../../components/userMessage';
import { writeLog } from '../../utilities/logger';
import images from '../../images';
let globalConstants = require('../../GlobalConstants');
let constants = require('./constants');

export class CDSApproveReject extends Component {
  constructor(props) {
    super(props);
    previousScreenData = this.props.navigation.state.params;
    (empData = previousScreenData.docDetails),
      (fullDocDetail = previousScreenData.fullDocDetails),
      (action = previousScreenData.action),
      (userActionValue = previousScreenData.userActionValue),
      (itemsStringArray = previousScreenData.itemsStringArray),
      (approverRoleValue = previousScreenData.approverRole),
      (this.state = {
        remarks: '',
        selectEmployeeOption: false,
        selectedEmployeeValue: '',
        localCdsApproverList: [],
        showModal: false,
        resultModalVisible: false,
      });
  }

  componentDidMount() {
    writeLog('Landed on ' + 'CDSApproveReject');
    if (action === 'Approve') {
      let myData = this.props.fetchCdsActionApproveData(empData.CDSCode);
      // console.log("myData:",myData)
      writeLog(
        'Fetching record for ' +
          'fetchCdsActionApproveData' +
          ' of ' +
          empData.CDSCode
      );
    }
    // this.props.completeRequest(empData.CDSCode)
  }

  static getDerivedStateFromProps(nextProps, state) {
    // console.log("nextprops Approve Reject:::", nextProps);
    if (
      nextProps.cdsApproverListData &&
      nextProps.cdsApproverListData.length > 0 &&
      nextProps.cdsApproverListError === '' &&
      nextProps.cdsActionTakenResponse === ''
    ) {
      return {
        localCdsApproverList: nextProps.cdsApproverListData,
      };
    }
    // else if(nextProps.cdsActionListData && nextProps.cdsActionListData.length > 0 && nextProps.cdsActionListError === "") {
    //   return {
    //     localCdsActionListData: nextProps.cdsActionListData
    //   }
    // }
    else {
      return null;
    }
  }
  componentDidUpdate() {
    if (
      this.state.resultModalVisible !== true &&
      this.props.cdsActionTakenResponse === 'Success'
    ) {
      setTimeout(() => {
        this.setState({
          resultModalVisible: true,
          showModal: true,
          messageType: 0,
        });
      }, 1000);
    } else if (
      this.state.resultModalVisible !== true &&
      this.props.cdsActionTakenError.length > 0
    ) {
      this.setState({
        resultModalVisible: true,
        showModal: true,
        messageType: 1,
      });
    }
  }
  handleBack = () => {
    // this.props.resetCdsDetails();
    writeLog('Clicked on ' + 'handleBack' + ' of ' + 'CDSApproveReject');
    this.props.navigation.pop();
  };

  showCdsRowGrid = (itemName, itemValue) => {
    if (itemValue != '' && itemValue != null && itemValue != undefined) {
      return (
        <View style={styles.rowStyle}>
          <Text style={[globalFontStyle.imageBackgroundLayout, styles.textOne]}>
            {itemName}
          </Text>
          <Text
            style={
              itemName === constants.UTILIZATION_TEXT &&
              itemValue === 'Non-Budget'
                ? [globalFontStyle.imageBackgroundLayout, styles.textTwoRed]
                : [globalFontStyle.imageBackgroundLayout, styles.textTwo]
            }
          >
            {itemValue}
          </Text>
        </View>
      );
    } else {
      return null;
    }
  };

  renderDocumentDetails() {
    let docDetails = fullDocDetail[0];
    // if(this.state.localCdsApproverList && this.state.localCdsApproverList > 1) { //list of supervisor scroll issue
    if (fullDocDetail && fullDocDetail.length > 0) {
      return (
        <ImageBackground style={styles.cardBackground} resizeMode="cover">
          <View style={styles.cardLayout}>
            {this.showCdsRowGrid(
              globalConstants.DOCUMENT_NUMBER_TEXT,
              docDetails.CDSCode
            )}
            {this.showCdsRowGrid(
              globalConstants.EMPLOYEE_TEXT,
              docDetails.EmpCode.concat(' : ').concat(docDetails.EmpName.trim())
            )}
            {/* {this.showCdsRowGrid(
            constants.CDS_STATUS_DESC_TEXT,
            empData.CDSStatusDesc.trim()
          )} */}
            {this.showCdsRowGrid(
              globalConstants.COST_CENTER_TEXT,
              docDetails.CostCenterCode.trim()
                .concat(' : ')
                .concat(docDetails.CostCenterName.trim())
            )}
            {this.showCdsRowGrid(
              globalConstants.PROJECT_TEXT,
              docDetails.ProjectCode.trim()
                .concat(' : ')
                .concat(docDetails.ProjectName.trim())
            )}
            {this.showCdsRowGrid(
              globalConstants.COMPANY_CODE_TEXT,
              docDetails.CompCode
            )}
            {this.showCdsRowGrid(
              constants.UTILIZATION_TEXT,
              docDetails.UtilizationDesc
            )}
            {this.showCdsRowGrid(
              constants.TOTAL_ANNUAL_BUDGET,
              docDetails.TotalAvailableBudgetONOFF
            )}
            {this.showCdsRowGrid(
              constants.RECOVERABLE_TEXT,
              docDetails.RecoveryDesc
            )}
            {docDetails.RecoveryDesc === 'Yes'
              ? this.showCdsRowGrid(
                  constants.RECOVERY_DESC_TEXT,
                  docDetails.RecoveryModeDesc
                )
              : null}
            {docDetails.RecoveryDesc === 'Yes'
              ? this.showCdsRowGrid(
                  constants.CLIENT_CODE_TEXT,
                  docDetails.ClientCode
                )
              : null}
            {this.showCdsRowGrid(
              constants.TOTAL_AMOUNT_TEXT,
              docDetails.CDSFinalAmount + '(' + docDetails.DefaultCurrency + ')'
            )}
          </View>
        </ImageBackground>
      );
    } else {
      return null;
    }
    // } else return null
  }

  renderRemarks = () => {
    return (
      <View style={styles.remarksParent}>
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          autoCompleteType="off"
          // multiline={true}
          maxLength={200}
          onChangeText={(text) => this.setState({ remarks: text })}
          value={this.state.remarks}
          placeholder="Remarks"
          style={styles.textInputStyle}
          // keyboardType='default'
          // returnKeyType='default'
        />
      </View>
    );
  };

  submitRequest = () => {
    let finalString = '';
    itemsStringArray.map((str, i) => {
      if (i === 0) {
        finalString = finalString.concat(str);
      } else {
        finalString = finalString.concat('~').concat(str);
      }
    });
    // console.log("selectedEmployeeValue",this.state.selectedEmployeeValue)
    let MyRemarks = this.state.remarks.trim();
    if (MyRemarks === '') {
      alert('Please enter remarks!!');
    } else if (action.toUpperCase() === globalConstants.APPROVE_CAPS_TEXT) {
      let selectedEmpValue = '';
      if (
        this.state.localCdsApproverList &&
        this.state.localCdsApproverList.length === 1
      ) {
        selectedEmpValue = this.state.localCdsApproverList[0].EmpName.split(
          ':'
        );
        // console.log("single employee",this.state.localCdsApproverList[0].EmpName.split(':'))
      } else {
        selectedEmpValue = this.state.selectedEmployeeValue.split(':');
      }
      writeLog(
        'Clicked on ' +
          'submitRequest' +
          ' of ' +
          'CDSApproveReject' +
          ' for ' +
          selectedEmpValue[0].trim()
      );
      this.props.completeRequest(
        empData.CDSCode,
        userActionValue,
        MyRemarks,
        finalString,
        selectedEmpValue[0].trim()
      );
    } else {
      writeLog(
        'Clicked on ' +
          'submitRequest' +
          ' of ' +
          'CDSApproveReject' +
          ' for ' +
          empData.CDSCode
      );
      this.props.completeRequest(
        empData.CDSCode,
        userActionValue,
        MyRemarks,
        finalString,
        ''
      );
    }
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
              {action.toUpperCase()}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

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
    let data = this.state.localCdsApproverList.map((val) => val.EmpName);
    return (
      <View style={styles.selectOptionView}>
        <FlatList
          data={data}
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
    if (
      this.state.localCdsApproverList &&
      this.state.localCdsApproverList.length === 1
    ) {
      label = this.state.localCdsApproverList[0].EmpName;
    } else {
      selectFlag = true;
      label =
        this.state.selectedEmployeeValue === ''
          ? constants.SELECT_TEXT
          : this.state.selectedEmployeeValue;
    }
    return (
      <View style={styles.approverView}>
        <Text style={styles.submitToText}>
          {constants.SUBMIT_TO_TEXT + '(' + approverRoleValue + ')'}
        </Text>
        {selectFlag ? (
          <TouchableOpacity
            onPress={() =>
              this.setState({
                selectEmployeeOption: !this.state.selectEmployeeOption,
              })
            }
            style={styles.selectedBoxView}
          >
            <Text style={styles.selectedTextValue}>{label}</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.selectedBoxView}>
            <Text style={styles.selectedTextValue}>{label}</Text>
          </View>
        )}
        {/* <View style={styles.selectedBoxView}>
            <TouchableOpacity
              onPress={() => {
								(selectFlag) ?
                this.setState({
									selectEmployeeOption: !this.state.selectEmployeeOption
								}) : null
              }}
            >
              <Text style={styles.selectedTextValue}>{label}</Text>
            </TouchableOpacity>
        </View> */}
        {this.renderRequestorOptionList()}
        {this.renderRemarks()}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={() => this.submitRequest()}
        >
          <Text style={styles.submitRejectButtonText}>
            {action.toUpperCase()}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  backNavigate() {
    writeLog('Clicked on ' + 'backNavigate' + ' of ' + 'CDSApproveReject');
    this.props.navigation.navigate('DashBoard');
  }

  showDialogBox = () => {
    let message = '';
    let heading = '';
    if (this.state.showModal) {
      if (this.state.messageType === 0) {
        message = 'Your request has been ';
        message = action != undefined ? message + action.toLowerCase() : '';
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
        heading = 'Error';
        message = this.props.cdsActionTakenError;
        // console.log("In side show error of CDS screen.");
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
      }
    }
  };

  render() {
    return (
      <ImageBackground style={{ flex: 1 }} source={images.loginBackground}>
        <View style={styles.container}>
          <SubHeader
            pageTitle={globalConstants.CDS_ACTION_TITLE}
            backVisible={true}
            logoutVisible={true}
            handleBackPress={() => this.handleBack()}
            navigation={this.props.navigation}
          />
          {/* {this.renderDocumentDetails()} */}
          {/* <ScrollView style={styles.scrollViewNewStyle}> */}
          {action.toUpperCase() === globalConstants.APPROVE_CAPS_TEXT
            ? this.showApprover()
            : this.showRemarksAndRejectButton()}
          {/* </ScrollView> */}
          {this.state.showModal ? this.showDialogBox() : null}
        </View>
      </ImageBackground>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    cdsApproverListData: state.cdsReducer.cdsActionApproveData,
    cdsApproverListError: state.cdsReducer.cdsActionApproveError,
    cdsActionTakenResponse: state.cdsReducer.cdsActionTakenResponse,
    cdsActionTakenError: state.cdsReducer.cdsActionTakenError,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchCdsActionApproveData: (cdsCode) => dispatch(cdsActionApprove(cdsCode)),
    completeRequest: (cdsCode, userAction, remarks, itemsString, submitTo) =>
      dispatch(
        cdsActionTaken(cdsCode, userAction, remarks, itemsString, submitTo)
      ),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CDSApproveReject);

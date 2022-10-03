/*
Author: Mohit Garg(70024)
*/
import React, { Component } from 'react';
import { Text, View, ImageBackground, BackHandler, TextInput, Alert, TouchableOpacity, Platform } from 'react-native';
import { styles } from './styles';
import { globalFontStyle } from '../../components/globalFontStyle.js';
import { ScrollView } from 'react-native-gesture-handler';
import { Card } from 'react-native-elements';
import { connect } from 'react-redux';
import FileViewer from 'react-native-file-viewer';
import RadioForm, { RadioButton } from 'react-native-simple-radio-button';
import {
  getPendingVoucherRequestDetail,
  resetVoucherState,
  usVoucherSubmitAction,
} from './voucherActionCreator';
import UserMessage from '../../components/userMessage';
import SubHeader from '../../GlobalComponent/SubHeader';
import ActivityIndicatorView from '../../GlobalComponent/myActivityIndicator';
import CustomButton from '../../components/customButton';
import helper from '../../utilities/helper';
import { writeLog } from '../../utilities/logger';
import BoxContainer from '../../components/boxContainer.js';
import images from '../../images';
import { showToast } from '../../GlobalComponent/Toast';
import RNFetchBlob from 'rn-fetch-blob';
import { downloadAttachment } from '../../GlobalComponent/MultiAttachments/AttachmentActionCreator';
let constant = require('./constants');
let globalConstants = require('../../GlobalConstants');
var RNFS = require('react-native-fs');
let selectStatusString = '';
let selectStatusRadioString = '';
let refsArray = [];
let radio_props = [
  { label: 'None', value: 'N' },
  { label: 'Approve', value: 'A' },
  { label: 'UnApprove', value: 'U' },
];
let myArr = [];
let myFinalArr = [];
let newStatusValue = '';
let appConfig = require('../../../appconfig');
class VoucherDetailScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedInDetails: this.props.navigation.state.params.loggedInDetails,
      voucher: this.props.navigation.state.params.voucherInfo,
      totalBudget: this.props.navigation.state.params.TotalBudget,
      consumedBudget: this.props.navigation.state.params.ConsumedBudget,
      quarter: this.props.navigation.state.params.Quarter,
      remainingBudget: this.props.navigation.state.params.RemainingBudget,
      bu: this.props.navigation.state.params.BU,
      showErrorModal: false,
      error_msg: '',
      voucherDataArr: [],
      selectStatusArr: [],
      selectStatusFinalArr: [],
      selectStatusStr: '',
      remarks: '',
      messageType: null,
      showModal: false,
      radioDefaultValue: 'N',
      myIndex: 0,
      isError:'',
      isActionSubmitted:'',
      errorModal:false,
    };
    myPageTitle = this.props.navigation.state.params.pageTitle;
  }

  componentDidMount() {
    this.props.navigation.addListener('willFocus', this.onFocus);
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }



  onFocus = () => {
    writeLog('Landed on ' + 'VoucherDetailScreen');
    this.props.fetchVouchers(
      this.props.loginData.SmCode,
      this.props.loginData.Authkey,
      this.state.voucher
    );
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    this.setState({
      showErrorModal: false,
      isRefreshing: false,
      error_msg: '',
    });
    this.props.resetVoucher();
  }

  handleBackButtonClick = () => {
    this.handleBack();
    return true;
  }

  static getDerivedStateFromProps(nextProps, state) {
    if (
      nextProps.voucherData &&
      nextProps.voucherData.length > 0 &&
      nextProps.voucherError === ''
    ) {
      return {
        voucherDataArr: nextProps.voucherData,
      };
    } else {
      return null;
    }
  }
  openDownloadedFile = (data, fileName) => {
    const DocumentDir =
      Platform.OS === 'ios'
        ? RNFS.DocumentDirectoryPath
        : RNFS.ExternalDirectoryPath;
    let filePath = DocumentDir + '/' + fileName.trim();
    RNFetchBlob.fs
      .writeFile(filePath, data, 'base64')
      .then(() => {
        this.openFile(filePath);
      })
      .catch(error => {
        console.log('Error in opening file : ' + error);
      });
  };
  openFile = filePath => {
    FileViewer.open(filePath)
      .then(() => {
        showToast('File is opening from path ' + filePath);
      })
      .catch(error => {
        showToast('unable to open attachment file due to ' + error);
        console.log('unable to open attachment file due to ' + error);
      });
  };
  downLoadFile = (file) => {
    console.log('File to download is :', file);
    let loginData = this.props.loginData;
    let ERowId = file.ERowId;
      this.props.downloadAttachment(loginData, ERowId, undefined, this.openDownloadedFile);
  };
  componentDidUpdate() {
    if (this.props.voucherUSSubmitAction === 'Success' && this.state.isActionSubmitted === '' ) {
      setTimeout(() => {
        this.setState({showModal: true, messageType: 0 ,isActionSubmitted:this.props.voucherUSSubmitAction});
      }, 1000);
    } else if (
      this.props.voucherUSSubmitAction &&
      JSON.stringify(this.props.voucherUSSubmitAction).includes('Exception') && this.state.isActionSubmitted === ''
    ) {
      setTimeout(() => {
        this.setState({showModal: true, messageType: 2,isActionSubmitted:this.props.voucherUSSubmitAction });
      }, 1000);
    }
    else if (this.props.voucherError && this.props.voucherError.length > 0 && this.state.isError === ''){
      setTimeout(()=>{
        this.setState({errorModal:true,isError:this.props.voucherError});
      },1000);
    }
  }
  renderCardItem = data => {
    console.log('Data : ', data);
    let keys = [];
    for (let key in data) {
      keys.push(key);
    }
    console.log('keys : ', keys);
    return keys.map(key => {
      if (data[key] != null && data[key] != '' && data[key] != undefined) {
        if (data[key].IsActive) {
          console.log('Data keys : ', data[key]);
          console.log('Data Value : ', data[key].Value);//Amount
          if ( data[key].Key == 'People' && data[key].Value == 0){
            return null;
          } else {
            return (
              <View>
              <View style={styles.cardView}>
                <Text style={globalFontStyle.cardLeftText}>{data[key].Key}</Text>
                <Text style={globalFontStyle.cardRightText}>
                  {data[key].Value === '' ? '-' : data[key].Key == 'Amount' ?  parseFloat(data[key].Value).toFixed(2) : data[key].Value}
                </Text>
              </View>
              </View>

            );
          }
        }
      }
    });
  }
  renderCardData = () => {
    let counter = 0;
    let statusValueRadioArray = [];
    refsArray = [];
    console.log('Voucher Data', this.props.voucherData);
    return this.props.voucherData.map((data, i) => {
      counter++;
      let usFlag = false;
      let docType = this.state.voucher.DocumentType;
      if (docType == 'Relocation' || docType == 'Travel' || docType == 'Other') {
        usFlag = true;
      }
      let sNo, expenseType;
      if (usFlag) {
        sNo = data.SNo.Value;
        expenseType = data.ExpenseTypeKey.Value;
        statusValueRadioArray.push(
          sNo
            .concat(':')
            .concat(expenseType)
            .concat(':')
            .concat(this.state.radioDefaultValue)
        );
      }
      let dropDownRef = React.createRef();
      refsArray.push(dropDownRef);
      return (
         <BoxContainer>
        <Text style={{fontWeight:'bold',fontSize:20,alignSelf:'center',backgroundColor:appConfig.APP_SKY,width:'100%',textAlign:'center',color:appConfig.BLUISH_COLOR}}>{'Record' + ' ' + counter}</Text>
          {this.renderCardItem(data)}
          {data?.LstUploadFiles?.length > 0 ? (
        data.LstUploadFiles.map((item,index) => {
         return (
          <View style={{ flex: 1 }}>
          <View style={styles.fileItem} key={data?.LstUploadFiles[index]?.RowID}>
                <TouchableOpacity
                  style={styles.fileName}
                  onPress={() => {
                    if (data?.LstUploadFiles[index]?.uri !== undefined) {
                      this.openFile(data?.LstUploadFiles[index]?.uri);
                    } else {
                      this.downLoadFile(data?.LstUploadFiles[index]);
                    }
                  }}
                >
                  <Text style={styles.fileHeadingStyle}>{data?.LstUploadFiles[index]?.FileName}</Text>
                </TouchableOpacity>
              </View>
        </View>
         );
        })

      ) : null}
          {usFlag ? (
            <View style={styles.approveStatusView}>
              <View style={{ height: 1, backgroundColor: 'grey' }} />
              <View style={styles.keyValueTextView}>
                <Text style={styles.keyText}>{'Approve Status'}</Text>
                <View style={{ marginTop: 6, marginBottom: 2, marginHorizontal: 2 }}>
                  <RadioForm
                    ref={i}
                    radio_props={radio_props}
                    initial={0}
                    formHorizontal={true}
                    buttonOuterSize={18}
                    buttonSize={10}
                    labelStyle={{ paddingLeft: 3, paddingRight: 14, fontSize: 14 }}
                    onPress={(radioValue, index) => {
                      // console.log("My index: ", i)
                      // console.log("statusValueRadioArray1111111", statusValueRadioArray)
                      let myFlag = true;
                      myArr = statusValueRadioArray;
                      statusValueRadioArray.forEach((val, index) => {
                        if (index === i) {
                          let lastValue = val.charAt(val.length - 1);
                          let finalVal = val.replace(lastValue, radioValue);
                          // console.log("=============last value to replace", lastValue)
                          // console.log("=============", finalVal)
                          statusValueRadioArray[i] = finalVal;
                          myArr = statusValueRadioArray;
                          // console.log("===============1111111", myArr)
                        }
                        statusValueRadioArray = myArr;
                        // console.log("statusValueRadioArray:::::", statusValueRadioArray)
                      });
                      selectStatusRadioString = myArr.reduce((finalValue, currentValue) => {
                        // console.log("111111111", finalValue)
                        // console.log("222222222", currentValue)
                        // console.log("333333333 initial value last word",finalValue.charAt(finalValue.length - 1))
                        if (currentValue.charAt(currentValue.length - 1) === 'N') {
                          //need to handle
                          return finalValue;
                        } else {
                          return finalValue.concat('~').concat(currentValue);
                        }
                      });
                    }}
                  />
                </View>
              </View>
            </View>
          ) : null}
        </BoxContainer>
      );
    });
  }
  // activityIndicator = () => {};

  handleLogoutConfirm() {
    this.setState({
      showLogoutModal: false,
    });
    writeLog('Invoked ' + 'handleLogoutConfirm' + ' of ' + 'VoucherDetailScreen');
    this.props.navigation.navigate('Login');
  }

  showDialogBox() {
    if (this.state.showErrorModal) {
      let errorMessage = constant.SLOW_RESPONSE;
      return (
        <UserMessage
          heading={'Error'}
          message={errorMessage}
          okAction={() => {
            this.setState({ showErrorModal: false });
            this.backNavigate();
          }}
        />
      );
    } else if (this.state.showTokenErrorModal) {
      let errorMessage = this.state.error_msg;
      return (
        <UserMessage
          heading={'Access Denied'}
          message={errorMessage}
          okAction={() => {
            this.setState({ showTokenErrorModal: false });
            this.handleLogoutConfirm();
          }}
        />
      );
    } else if (this.state.showSessionErrorModal) {
      let errorMessage = this.state.error_msg;
      return (
        <UserMessage
          heading={'Access Denied'}
          message={errorMessage}
          okAction={() => {
            this.setState({ showSessionErrorModal: false });
            this.handleLogoutConfirm();
          }}
        />
      );
    }
  }

  submitUSVoucherRadio() {
    if (
      selectStatusRadioString == '' ||
      selectStatusRadioString.charAt(selectStatusRadioString.length - 1) == 'N' ||
      selectStatusRadioString.includes('N~')
    ) 
    {
      
      alert(constant.US_SUBMIT_ERROR_MSG);
    } else {
      let resultLength = selectStatusRadioString.split('~').length;
      if (resultLength === this.props.voucherData.length) {
        writeLog('Invoked ' + 'submitUSVoucherRadio' + ' of ' + 'VoucherDetailScreen');
        this.props.submitAction(
          this.props.loginData.SmCode,
          this.props.loginData.Authkey,
          this.state.voucher.DocumentNo.trim(),
          '',
          this.state.remarks,
          'A',
          selectStatusRadioString
        );
      } else {
        alert(constant.US_SUBMIT_ERROR_MSG);
      }
    }
    let allStatusSelectedFlag = false;
    let myFlag = true;
    let newStatusString = '';
    if (myArr == [] || myArr.length === 0) {
    } else {
    }
  }

  resetAllDropDown = () => {
    for (let prop in this.refs) {
      this.refs[prop].updateIsActiveIndex(0);
    }
    // refsArray.map((ref)=>{
    //   ref.current.select(-1);
    // })
    selectStatusString = '';
    selectStatusRadioString = '';
    this.setState({
      selectStatusFinalArr: [],
    });
  }

  voucherUSRequestAction(action, voucherData) {
    writeLog('Invoked ' + 'voucherUSRequestAction' + ' of ' + 'VoucherDetailScreen');
    if (voucherData.Status === 'M') {
      alert(
        constant.MODIFY_DOCUMENT_ERROR_MSG1 +
          voucherData.DocumentNo.trim() +
          constant.MODIFY_DOCUMENT_ERROR_MSG2
      );
    } else if (action === 'Submitted') {
      this.submitUSVoucherRadio();
    } else if (action === 'Escalated') {
      if (
        selectStatusRadioString !== '' &&
        selectStatusRadioString.charAt(selectStatusRadioString.length - 1) !== 'N'
      ) {
        Alert.alert(
          'Alert!',
          'You cannot escalate while the approval status is set.',
          [
            // { text: "CANCEL", style: "cancel" },
            { text: 'OK', onPress: () => this.resetAllDropDown() },
          ]
        );
      } else {
        writeLog('Navigating to  ' + 'SupervisorSelection' + ' from ' + 'VoucherDetailScreen' + ' for ' + action);
        this.props.navigation.navigate('SupervisorSelection', {
          voucher: voucherData,
          action: action,
          isComingFromVoucher: true,
          isComingFromUSVoucher: true,
          loggedInDetails: this.props.loginData,
          pageTitle: myPageTitle,
        });
        // console.log("final array length : ", this.state.selectStatusFinalArr)
        console.log('Voucer types :' , this.props.voucherData[0]?.VoucherType?.Value);
      }
    }
  }

  voucherRequestAction(action, voucherData) {
    writeLog('Invoked ' + 'voucherRequestAction' + ' of ' + 'VoucherDetailScreen');
    if (voucherData.Status === 'M') {
      alert(
        constant.MODIFY_DOCUMENT_ERROR_MSG1 +
          voucherData.DocumentNo.trim() +
          constant.MODIFY_DOCUMENT_ERROR_MSG2
      );
    } else {
      writeLog('Navigating to  ' + 'SupervisorSelection' + ' from ' + 'VoucherDetailScreen' + ' for ' + action);
      this.props.navigation.navigate('SupervisorSelection', {
        voucher: voucherData,
        voucherType:this.props.voucherData[0]?.VoucherType?.Value,
        action: action,
        isComingFromVoucher: true,
        loggedInDetails: this.props.loginData,
        pageTitle: myPageTitle,
        statusCode:this.props.voucherData[0]?.StatusCode?.Value,
        band_5:this.props.voucherData[0]?.BAND?.Value,
        isIndianCompany: this.props.voucherData[0]?.IsIndianCompany?.Value,
      });
    }
  }

  showVoucherInfoGrid(itemName, itemValue) {
    if (itemValue != '' && itemValue != null && itemValue != undefined) {
      return (
        <View style={styles.rowStyle}>
          <Text style={[globalFontStyle.imageBackgroundLayout, styles.displayItemTextOne]}>
            {itemName}
          </Text>
          <Text style={[globalFontStyle.imageBackgroundLayout, styles.displayItemTextTwo]}>
            {itemValue}
          </Text>
        </View>
      );
    } else {
      return null;
    }
  }

  renderDocumentDetails() {
    let voucherData = this.state.voucher;
    let totalbudget = this.state.totalBudget;
    console.log('xxxx :' , totalbudget);
    console.log('Voucer type :' , this.props.voucherData[0]?.VoucherType?.Value);
    let consumedbudget = this.state.consumedBudget;
    let quarterData = this.state.quarter;
    let remainingbudget = this.state.remainingBudget;
    let buData = this.state.bu;
    return (
      <ImageBackground style={styles.cardBackground} resizeMode="cover">
        <View style={styles.cardLayout}>
          {this.showVoucherInfoGrid(constant.DOCUMENT_NUMBER_TEXT, voucherData.DocumentNo.trim())}
          {this.showVoucherInfoGrid(
            constant.EMPLOYEE_TEXT,
            voucherData.EmpCode.trim() + ' : ' + voucherData.EmpName.trim()
          )}
          {this.showVoucherInfoGrid(constant.TOTAL_AMOUNT_TEXT, parseFloat(voucherData.TotalAmount).toFixed(2))}
          {this.showVoucherInfoGrid(
            constant.COMPANY_CODE_TEXT,
            voucherData.CompanyCode.trim() + ' : ' + voucherData.CompanyName.trim()
          )}
          {this.showVoucherInfoGrid(
            constant.COST_CENTER_TEXT,
            voucherData.CostCenterCode.trim() + ' : ' + voucherData.CostCenterDesc.trim()
          )}
          {this.showVoucherInfoGrid(
            constant.PROJECT_TEXT,
            voucherData.ProjectDesc === 'NA'
              ? 'NA'
              : voucherData.ProjectCode.trim() + ' : ' + voucherData.ProjectDesc.trim()
          )}
          {this.showVoucherInfoGrid(constant.REMARKS_TEXT, voucherData.Remarks.trim())}
          {this.showVoucherInfoGrid(
            constant.DOCUMENT_DATE_TEXT,
            voucherData.DocumentDate.replace(/-/g, ' ')
          )}
          {this.showVoucherInfoGrid(constant.VOUCHER_TYPE_TEXT, voucherData.VoucherType)}
          {/* {this.showVoucherInfoGrid(constant.VOUCHER_TYPE_TEXT, voucherData.VoucherType)} */}
          {/* {this.showVoucherInfoGrid(constant.TOTAL_BUDGET,totalbudget)}
          {this.showVoucherInfoGrid(constant.CONSUMED_BUDGET,consumedbudget)}
          {this.showVoucherInfoGrid(constant.QUARTER_TEXT,quarterData)}
          {this.showVoucherInfoGrid(constant.REMAINING_BUDGET,remainingbudget)}
          {this.showVoucherInfoGrid(constant.BU_TEXT,buData)} */}
        </View>
        {
          this.props.voucherData[0]?.VoucherType?.Value == 13 ?
           <BoxContainer style={{marginTop:10,marginHorizontal:8}}>
        <Text style={{fontWeight:'bold',fontSize:20,alignSelf:'center',backgroundColor:appConfig.APP_SKY,width:'100%',textAlign:'center',color:appConfig.BLUISH_COLOR}}>{'Balance'}</Text>
        <View style={styles.cardLayout}>
         {this.showVoucherInfoGrid(constant.TOTAL_BUDGET,totalbudget)}
         {this.showVoucherInfoGrid(constant.CONSUMED_BUDGET,consumedbudget)}
         {this.showVoucherInfoGrid(constant.QUARTER_TEXT,quarterData)}
         {this.showVoucherInfoGrid(constant.REMAINING_BUDGET,remainingbudget)}
         {this.showVoucherInfoGrid(constant.BU_TEXT,buData)}
       </View>
        </BoxContainer> : null
        }
      </ImageBackground>
    );
  }

  renderBottomView() {
    let voucherData = this.state.voucher;
    let docType = this.state.voucher.DocumentType;
    if (docType == 'Relocation' || docType == 'Travel' || docType == 'Other') {
      return (
        <View style={styles.buttonContainer}>
          <View style={styles.rowStyle}>
            <View style={styles.buttonBox}>
              <CustomButton
                label={'Submit'}
                positive={true}

                performAction={() => this.voucherUSRequestAction('Submitted', voucherData)}
              />
            </View>
            <View style={styles.buttonBox}>
              <CustomButton
                label={'Escalate'}
                positive={false}
                performAction={() => this.voucherUSRequestAction('Escalated', voucherData)}
              />
            </View>
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.buttonContainer}>
          <View style={styles.rowStyle}>
            <View style={styles.buttonBox}>
              <CustomButton
                label={'APPROVE'}
                positive={true}
                performAction={() => this.voucherRequestAction('Approved', voucherData)}
              />
            </View>
            <View style={styles.buttonBox}>
              <CustomButton
                label={'REJECT'}
                positive={false}
                performAction={() => this.voucherRequestAction('Rejected', voucherData)}
              />
            </View>
          </View>
        </View>
      );
    }
  }

  showDialogActionModal = () => {
    // console.log("mohit flag::::::", this.state.showModal)
    let message = '';
    let heading = '';
    if (this.state.showModal) {
      if (this.state.messageType === 0) {
        message = 'Your request has been submitted';
        heading = 'Successful';
      } else {
        message = this.props.voucherUSSubmitAction;//constant.SLOW_RESPONSE
        heading = 'Sorry';
      }
      return (
        <UserMessage
          heading={heading}
          message={message}
          okAction={() => {
            this.setState({ showModal: false , isActionSubmitted:''});
            this.dialogOkNavigation();
          }}
        />
      );
    }
  }

  dialogOkNavigation() {
    myArr = [];
    selectStatusString = '';
    selectStatusRadioString = '';
    this.setState({
      voucherDetailResponse: [],
    });
    this.props.navigation.navigate('DashBoard');
  }

  renderRemarksView() {
    let docType = this.state.voucher.DocumentType;
    if (docType == 'Relocation' || docType == 'Travel' || docType == 'Other') {
      return (
        <View style={styles.remarksParent}>
          <TextInput
            multiline={true}
            maxLength={200}
            onChangeText={text => this.setState({ remarks: text })}
            value={this.state.remarks}
            placeholder="Remarks(for Submit)"
            style={{
              width: '100%',
              paddingLeft: 10,
              paddingTop: 10,
              paddingBottom: 10,
            }}
          />
        </View>
      );
    } else {
      return null;
    }
  }

  handleBack() {
    myArr = [];
    selectStatusString = '';
    selectStatusRadioString = '';
    this.state.voucherDetailResponse = [];
    this.props.navigation.pop();
    writeLog('Clicked on ' + 'handleBack' + ' of ' + 'VoucherDetailScreen');
  }

  onOkClick = () => {
    myArr = [];
    selectStatusString = '';
    selectStatusRadioString = '';
    this.props.resetVoucher();
    setTimeout(()=>{
      this.setState({errorModal:false,isError:''},()=>{
        this.props.navigation.pop();
      });
    },1000);
  }

  showError = () => {
    // console.log("In side show error of voucher screen.")
    writeLog('Dialog is open with exception ' + this.props.voucherError + ' on ' + 'VoucherDetailScreen');
    return (
      <UserMessage
        modalVisible={true}
        heading="Error"
        message={this.props.voucherError}
        okAction={() => {
            this.onOkClick();
        }}
      />
    );
  }
  render() {
    let myNewPageTitle = (myPageTitle.search(globalConstants.VOUCHER_TEXT) === -1 ? myPageTitle.concat(globalConstants.DETAILS_TEXT) :
			 myPageTitle.replace(globalConstants.VOUCHER_TEXT,globalConstants.DETAILS_TEXT));
    return (
      <ImageBackground
        source={images.loginBackground}
       style={styles.container}>
        {this.showDialogBox()}
        <SubHeader
          pageTitle={myNewPageTitle}
          backVisible={true}
          logoutVisible={true}
          handleBackPress={() => this.handleBack()}
          navigation={this.props.navigation}
        />
        <ActivityIndicatorView loader={this.props.voucherLoading} />
        {/* {console.log("voucher loading is ",this.props.voucherLoading)} */}
        {this.renderDocumentDetails()}
        {this.renderRemarksView()}
        <ScrollView
        	keyboardShouldPersistTaps="handled"
        style={styles.scrollViewStyle}>
          {this.props.voucherData && this.props.voucherData.length > 0
            ? this.renderCardData()
            : null}
          {this.state.showModal ? this.showDialogActionModal() : null}
        </ScrollView>
        {this.renderBottomView()}
        {this.state.errorModal === true ? this.showError() : null}
        <ActivityIndicatorView loader={this.props.voucherLoading} />
      </ImageBackground>
    );
  }
}

mapDispatchToProps = dispatch => {
  return {
    downloadAttachment:(loginData,rowId,noMethod,downloadCallBack) =>
    dispatch(downloadAttachment(loginData,rowId,noMethod,downloadCallBack)),
    fetchVouchers: (loginId, authKey, voucher) =>
      dispatch(getPendingVoucherRequestDetail(loginId, authKey, voucher)),
    submitAction: (loginId, authKey, docNo, escalatedTo, remarks, action, selectStatus) =>
      dispatch(
        usVoucherSubmitAction(loginId, authKey, docNo, escalatedTo, remarks, action, selectStatus)
      ),
    resetVoucher: () => dispatch(resetVoucherState()),
  };
};
mapStateToProps = state => {
  return {
    loginData:state && state.loginReducer &&  state.loginReducer.loginData,
    voucherLoading: state.voucherReducer.voucherLoading,
    voucherData: state.voucherReducer.voucherData,
    voucherError: state.voucherReducer.voucherError,
    voucherUSSubmitAction: state.voucherReducer.voucherUSSubmitAction,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(VoucherDetailScreen);

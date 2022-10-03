import React, { Component } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Image,
  TextInput,
  StyleSheet,
  Keyboard,
  Dimensions,
  ScrollView,
} from 'react-native';
import { SearchBar } from 'react-native-elements';
import { moderateScale } from '../../components/fontScaling.js';
import { fetchGETMethod, fetchPOSTMethod } from '../../utilities/fetchService';
import { DismissKeyboardView } from '../../components/DismissKeyboardView';
import UserMessage from '../../components/userMessage';
import CustomButton from '../../components/customButton';
import SubHeader from '../../GlobalComponent/SubHeader';
import GlobalData from '../../utilities/globalData';
import ActivityIndicatorView from '../../GlobalComponent/myActivityIndicator';
import style from './style.js';
import properties from '../../resource/properties';
import { netInfo } from '../../utilities/NetworkInfo.js';
import { NO_INTERNET, SEARCH_PLACEHOLDER_TEXT } from '../../GlobalConstants.js';
import { globalFontStyle } from '../../components/globalFontStyle.js';
import { writeLog } from '../../utilities/logger';
import images from '../../images';
import Seperator from '../../components/Seperator.js';
const _ = require('lodash');
let globalData = new GlobalData();
let constant = require('./constants');
let globalConstants = require('../../GlobalConstants');
let appConfig = require('../../../appconfig');
let employeeId = '';
let authenticationKey = '';
let vdhSelectedItemData = {};
let isComingFromUSVoucher, isComingFromVoucher, myPageTitle, checkAction;

export default class SupervisorSelection extends Component {
  constructor(props) {
    super(props);
    this.state = {
       voucherValue:this.props.navigation.state.params.voucherType,
       voucherStatus:this.props.navigation.state.params.statusCode,
       voucherBand:this.props.navigation.state.params.band_5,
       isIndianCompany:this.props.navigation.state.params.isIndianCompany,
      requestorListArray: [],
      loggingDetails: this.props.navigation.state.params.loggedInDetails,
      voucherDetail: this.props.navigation.state.params.voucher,
      requestDetails: this.props.navigation.state.params.employeeDetails,
      requestorOptionList: false,
      selectedRequestorOption: null,
      displaySupervisorList: false,
      supervisorList: [],
      displaySelectedRequestor: false,
      selectedRequestor: null,
      error_msg: null,
      remarks: '',
      supervisorListArrayLength: 0,
      messageType: null,
      isVDHSelected: false,
      query: '',
      isIndicatorVisible: false,
      isErrorMsg: false,
      isKeyboardActive: false,
      superVisorSearchText: '',
      selectedRole: '',
    };
    isComingFromVoucher = this.props.navigation.state.params
      .isComingFromVoucher;
    isComingFromUSVoucher = this.props.navigation.state.params
      .isComingFromUSVoucher;
    checkAction = this.props.navigation.state.params.action;
    myPageTitle = this.props.navigation.state.params.pageTitle;
    console.log("IsIndianCompany",this.state.isIndianCompany)
  }
  
  componentDidMount() {
    console.log("requestVoucherValue",this.state.voucherValue)
    console.log("requestVoucherStatus",this.state.voucherStatus)
    writeLog('Landed on ' + 'SupervisorSelection');
  }

  componentDidUpdate(prevState, prevProps) {
    if (prevProps.superVisorSearchText != this.state.superVisorSearchText) {
      if (
        this.state.superVisorSearchText.length > 2 &&
        this.state.selectedRole == 'Supervisor'
      ) {
        console.log('Selected role : ', this.state.selectedRole);
        this.getSelectedRequestorList(this.state.selectedRole);
      } else if (this.state.superVisorSearchText.length < 1) {
        this.setState({ supervisorList: [], inMemoryList: [] });
      }
    }
  }
  UNSAFE_componentWillMount() {
    employeeId = parseInt(this.state.loggingDetails.SmCode);
    authenticationKey = this.state.loggingDetails.Authkey;
    // this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    // this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    this.getRequestorList();
  }

  updateSearch = (searchText) => {
    if(this.state.supervisorList =""){
      alert("handle")
    }
    else{

    
    this.setState(
      {
        query: searchText,
      },
      () => {
        console.log('SearchText : ', searchText);
        console.log('InMemoryList : ', this.state.inMemoryList);
        const filteredData = this.state.inMemoryList?.filter((element) => {
          let elementSearched = isComingFromVoucher
            ? element.EmpName.toLowerCase()
            : element.Code.toLowerCase();
          let queryLowerCase = this.state.query.toLowerCase();
          return elementSearched.indexOf(queryLowerCase) > -1;
        });

        this.setState({ supervisorList: filteredData });
      }
    );
    }
  };

  async getRequestorList() {
    let requestorListArray = [];

    if (isComingFromVoucher) {
    //IsIndianCompany == "1"
      if (isComingFromUSVoucher) {
        if (this.state?.voucherDetail?.VDHOption == 'YES') {
          requestorListArray = ['VDH'];
        } 
        
        else {
          requestorListArray = ['Supervisor'];
        }
      } else {
        console.log('Voucher detail : ', this.state.voucherDetail);
        if (this.state.voucherDetail.CompanyCode === 'N054') {
          if (this.state?.voucherDetail?.VDHOption == 'YES') {
            requestorListArray = ['VDH'];
          } else if (
            this.state?.voucherDetail?.VoucherType == 'Staff Welfare'
          ) {
            requestorListArray = ['FSO'];
          } else {
            requestorListArray = ['Supervisor', 'HR/FSO'];
          }
        } else {
          if (this.state?.voucherDetail?.VDHOption == 'YES') {
            requestorListArray = ['VDH'];
          } 
          else if (
            this.state?.voucherDetail?.VoucherType == 'Staff Welfare' || this.state?.voucherStatus =="16"
          )
           {
            requestorListArray = ['FSO'];
          }
         else if(this.state?.voucherValue == "13"){
          requestorListArray = ['VDH'];
         }

          //added LCV condition
          else if (
            this.state?.voucherDetail?.VoucherType == 'LOCAL CONVEYANCE VOUCHER' 
          )
           {
            requestorListArray = ['Supervisor'];
          }
          else if(this.state?.voucherValue == "0" ||this.state?.voucherValue == "7" ||this.state?.voucherValue == "14" ){
            // added
            if(this.state.isIndianCompany =="1" && this.state.voucherDetail?.TotalAmount>10000 && this.state?.voucherBand =="5" ){
              requestorListArray = ['Supervisor'];
             }
           else if( this.state.isIndianCompany =="1" && this.state.voucherDetail?.TotalAmount>50000 && this.state?.voucherBand =="6" ){
              requestorListArray = ['Supervisor'];
             }
             else if( this.state.isIndianCompany =="1" &&  this.state.voucherDetail?.TotalAmount>75000 && this.state?.voucherBand =="7" ){
              requestorListArray = ['Supervisor'];
             }
             else if( this.state.isIndianCompany =="1" && this.state.voucherDetail?.TotalAmount>100000 && this.state?.voucherBand =="8" ){
              requestorListArray = ['Supervisor'];
             }
             else{
              requestorListArray = ['Supervisor','FSO'];
             }
             
            
          }
       else if(this.state.voucherDetail?.TotalAmount>10000 && this.state?.voucherBand =="5"){
        
            requestorListArray = ['Supervisor'];
        
        }


          // added payroll
          else if (
            this.state?.voucherValue == "9" || this.state?.voucherValue =="8"
          )
           {
            requestorListArray = ['Payroll'];
          }
         // VoucherType: "CASH"
          // add VDH
          // else if (this.state?.voucherValue == "13") // statuscode ==2
          //  {
          //   requestorListArray = ['VDH'];
          // }
          //
          else if(this.state?.voucherStatus =="2"){
            requestorListArray = ['VDH'];
          }
         
           else {
            requestorListArray = ['Supervisor', 'FSO'];
          }
        }
      }
    } else {
      let item = this.props.navigation.state.params.employeeDetails;
      console.log("else item",item)
      let isOnsite = item.OnsiteRR == 'Y' ? true : false;
      let requestPosition = item.in_position;
      let resourceCategory = item.in_resource_cat;
      let statusForward = item.Status;
      console.log('statusForward', statusForward);
      console.log('requestPosition', requestPosition);
      console.log('resourceCategory', resourceCategory);
      console.log('isOnsite', isOnsite);
      console.log('SLApprovalFlag', item.SLApprovalFlag);
      console.log('item', item);

      if (requestPosition === 1) {
        if (resourceCategory === 1 && statusForward === 5) {
          requestorListArray = ['Supervisor', 'RDG'];
        }
        if (resourceCategory === 2) {
          if (statusForward === 5) {
            requestorListArray = ['Supervisor', 'Finance Controller'];
          }
          if (statusForward === 8) {
            requestorListArray = ['Approving Authority'];
          }
          if (statusForward === 9) {
            requestorListArray = ['Approving Authority 2', 'TA'];
          }
          if (statusForward === 10) {
            requestorListArray = ['TA'];
            if (isOnsite) {
              requestorListArray = ['Onsite TA'];
            }
          }
        }
        if (resourceCategory === 3) {
          if (statusForward === 5) {
            requestorListArray = ['Supervisor', 'Finance Controller'];
          }
          if (statusForward === 8) {
            requestorListArray = ['TA'];
            if (isOnsite) {
              requestorListArray = ['Onsite TA'];
            }
          }
        }
      }

      if (requestPosition === 2) {
        if (resourceCategory === 1) {
          requestorListArray = ['Supervisor'];
          if (item.VDHApprvalFlag == 'Y') {
            requestorListArray.push('VDH');
          }
          if (item.VDHApprvalFlag == 'R' || item.VDHApprvalFlag == 'N') {
            requestorListArray.push('RDG');
          }
        }
        if (resourceCategory === 2) {
          if (statusForward === 5) {
            requestorListArray = ['Supervisor', 'Finance Controller'];
          }
          if (statusForward === 8) {
            requestorListArray = ['Approving Authority'];
          }
          if (statusForward === 9) {
            requestorListArray = ['Approving Authority 2', 'TA'];
          }
          if (statusForward === 10) {
            requestorListArray = ['TA'];
            if (isOnsite) {
              requestorListArray = ['Onsite TA'];
            }
          }
        }
        if (resourceCategory === 3) {
          if (statusForward === 5) {
            requestorListArray = ['Supervisor', 'Finance Controller'];
          }
          if (statusForward === 8) {
            requestorListArray = ['TA'];
            if (isOnsite) {
              requestorListArray = ['Onsite TA'];
            }
          }
        }
      }
    }
    this.setState({
      requestorListArray,
    });
  }

 
  async getSelectedRequestorList(selectedDesignation) {
   
    console.log('selectedDesignation', selectedDesignation);
    let isNetWork = await netInfo();
    if (isNetWork) {
      try {
        let type = '';
        if (selectedDesignation == 'Supervisor') {
          this.setState({ displaySupervisorList: true });
          let supervisorListData;
          if (selectedDesignation == 'Supervisor') {
            type = 1;
          }
          
          console.log(
            'Fetching supervisors',
            this.state.superVisorSearchText.length
          );
          console.log('Is coming from Voucher : ', isComingFromVoucher);
          if (this.state.superVisorSearchText.length > 2) {
            // this.setState({ isIndicatorVisible: true });
            console.log(
              'Fetching supervisors 2 ',
              this.state.superVisorSearchText.length
            );
            let url = properties.getTrApproverList;
            let form = new FormData();
            form.append('ECSerp', employeeId);
            form.append('AuthKey', authenticationKey);
            form.append('DocType', '');
            form.append('DocumentNo', this.state.superVisorSearchText);
            form.append('ListFor', isComingFromVoucher ? 'SV' : 'S');
            supervisorListData = await fetchPOSTMethod(url, form);
			this.setState({ isIndicatorVisible: false });
            console.log(
              'Approve supervisor search result : ',
              supervisorListData
            );
            console.log('Supervisor payload : ', form);
          }
          console.log('Fetched supervisors', supervisorListData);
          if (supervisorListData.length > 0) {
            this.setState({
              supervisorList: supervisorListData,
              inMemoryList: supervisorListData,
              supervisorListArrayLength: supervisorListData.length,
              isIndicatorVisible: false,
            });
          }
          else {
            this.setState({
              isIndicatorVisible: false,
            });
          }
        } else if (selectedDesignation == 'Finance Controller') {
          type = 3;
          let supervisorList = await fetchGETMethod(
            properties.fetchSuperVisorListUrl +
              'ECSerp=' +
              employeeId +
              '&AuthKey=' +
              authenticationKey +
              '&type=' +
              type +
              '&searchText=' +
              this.state.superVisorSearchText
          );
          if (supervisorList.length > 0) {
            this.setState({
              supervisorList,
              supervisorListArrayLength: supervisorList.length,
              displaySupervisorList: true,
              isIndicatorVisible: false,
              inMemoryList: supervisorList,
            });
          }
        } else if (
          selectedDesignation == 'Onsite TA' ||
          selectedDesignation == 'TA'
        ) {
          type = 15;
          if (selectedDesignation == 'TA') {
            type = 5;
          }
          let data = this.props.navigation.state.params;
          let requestIDOnsiteRMG = data.employeeDetails.in_requestid;
          let supervisorList = await fetchGETMethod(
            properties.fetchSuperVisorListUrl +
              'ECSerp=' +
              employeeId +
              '&AuthKey=' +
              authenticationKey +
              '&type=' +
              type +
              '&Requestid=' +
              requestIDOnsiteRMG +
              '&searchText=' +
              this.state.superVisorSearchText
          );

          if (supervisorList.length > 0) {
            this.setState({
              supervisorList,
              supervisorListArrayLength: supervisorList.length,
              displaySupervisorList: true,
              isIndicatorVisible: false,
              inMemoryList: supervisorList,
            });
          }
        }
      } catch (error) {
        this.setState({
          isIndicatorVisible: false,
        });
      }
    } else {
      return alert(NO_INTERNET);
    }
  }

  validateApprove(action) {
    let Remarks = this.state.remarks.trim();
    if (
      (action === 'Approved' || action === 'Escalated') &&
      this.state.selectedRequestorOption == null
    ) {
      alert('Please select at least one Value.');
    } else if (action == 'Rejected' && Remarks == '') {
      alert('Remarks are mandatory.');
    }
    else if(this.state.superVisorSearchText== '' && this.state.selectedRole=="Supervisor"){
     alert("Please choose supervisor, whom to send this document for approval.")
    }
   
    else {
      this.requestAction(action);
    }
  }

  async requestAction(action) {
    let isNetwork = await netInfo();
    writeLog(
      'Invoked ' +
        'requestAction' +
        ' of ' +
        'SupervisorSelection' +
        ' for ' +
        action
    );
    
    if (isNetwork) {
      try {
        console.log("checking")
          this.setState({ isIndicatorVisible: true });
        // alert("Please choose supervisor, whom to send this document for approval.")
        if (isComingFromVoucher) {
          console.log("isComingFromVoucher",isComingFromVoucher)
          if (isComingFromUSVoucher) {
            let expenseIdValue = this.state.voucherDetail.DocumentNo;
            let loginIdValue = employeeId;
            let escalatedToValue = this.state.selectedRequestor?.EmployeeId
              ? this.state.selectedRequestor?.EmployeeId
              : this.state.selectedRequestor.EmpCode;
            let remarksValue = this.state.remarks;
            let actionValue = 'E';
            let selectStatusValue = '';

            let dataObj = {
              ExpenseId: expenseIdValue,
              LoginUser: loginIdValue,
              escalatedto: escalatedToValue,
              Remarks: remarksValue,
              Action: actionValue,
              StrUserInput: selectStatusValue,
            };
// show form data
            let form = new FormData();
            form.append('ECSerp', this.state.loggingDetails.SmCode);
            form.append('AuthKey', this.state.loggingDetails.Authkey);
            form.append('Data', JSON.stringify(dataObj));
            let url = properties.usVoucherActionUrl;
            let usVoucherUpdateStatus = await fetchPOSTMethod(url, form);
            this.setState({ isIndicatorVisible: false });
            if (
              usVoucherUpdateStatus.length > 0 &&
              usVoucherUpdateStatus[0].msgTxt === 'Success'
            ) {
              this.setState(
                {
                  // isIndicatorVisible: false,
                  messageType: 0,
                },
                () => {
                  setTimeout(
                    () =>
                      this.setState({
                        showModal: true,
                      }),
                    400
                  );
                }
              );
            } else if (
				usVoucherUpdateStatus[0].hasOwnProperty('Exception')
            ) {
              this.setState(
                {
                  isIndicatorVisible: false,
                  error_msg: usVoucherUpdateStatus[0].Exception,
                  messageType: 2,
                },
                () => {
                  setTimeout(
                    () =>
                      this.setState({
                        showModal: true,
                      }),
                    400
                  );
                }
              );
            }
          } else {
            let documentNoValue = this.state.voucherDetail.DocumentNo;
            let pendingWithValue = '';
            let submitButtonValue = '';
            let remarksValue = this.state.remarks;
            let companyCodeValue = this.state.voucherDetail.CompanyCode;
            let companyNameValue = this.state.voucherDetail.CompanyName;
            let projectCodeValue = this.state.voucherDetail.ProjectCode.trim(); //check for NA value
            let projectDescValue = this.state.voucherDetail.ProjectDesc;
            let costCenterCodeValue = this.state.voucherDetail.CostCenterCode;
            let costCenterDescValue = this.state.voucherDetail.CostCenterDesc;
            let intActionValue = 0;

            if (this.state.selectedRequestorOption === 'FSO') {
              pendingWithValue = '';
              submitButtonValue = 'FSO';
            } else if (this.state.selectedRequestorOption === 'HR/FSO') {
              pendingWithValue = '';
              submitButtonValue = 'HRO';
            } else if (this.state.selectedRequestorOption === 'Supervisor') {
              pendingWithValue = this.state.selectedRequestor.EmpCode;
              submitButtonValue = 'Supervisor';
            } else if (this.state.selectedRequestorOption === 'VDH') {
              pendingWithValue = '';
              submitButtonValue = 'VDH';
            }
            // added here also payroll
            else if(this.state.selectedRequestorOption === 'Payroll') {
              pendingWithValue = '';
              submitButtonValue = 'Payroll';
            }
            else if(this.state.selectedRequestorOption === 'VDH') {
              pendingWithValue = '';
              submitButtonValue = 'VDH';
            }
            if (action == 'Rejected') {
              pendingWithValue = '';
              submitButtonValue = 'Reject';
            }

            if (this.state.voucherDetail.DocumentType === 'LCV') {
              intActionValue = 1;
            } else {
              intActionValue = 2;
            }
// onApprove
            let dataObj = {
              DocumentNo: documentNoValue,
              PendingWith: pendingWithValue,
              Remarks: remarksValue,
              CompanyCode: companyCodeValue,
              CompanyName: companyNameValue,
              ProjectCode: projectCodeValue,
              ProjectDesc: projectDescValue,
              CostCenterCode: costCenterCodeValue,
              CostCenterDesc: costCenterDescValue,
              // "SendTo" : "SUP",
              submitButton: submitButtonValue,
              intAction: intActionValue,
            };

            let form = new FormData();
            form.append('ECSerp', this.state.loggingDetails.SmCode);
            form.append('AuthKey', this.state.loggingDetails.Authkey);
            form.append('Data', JSON.stringify(dataObj));
            let url = properties.cancelActionUrl;
            let voucherUpdateStatus = await fetchPOSTMethod(url, form);
			// this.setState({isIndicatorVisible: false});
            console.log('Response : ', voucherUpdateStatus);
            if (
              voucherUpdateStatus.length > 0 &&
              voucherUpdateStatus[0].msgTxt === 'Success'
            ) {
              this.setState(
                {
                  isIndicatorVisible: false,
                  messageType: 0,
                },
                () => {
                  setTimeout(
                    () =>
                      this.setState({
                        showModal: true,
                      }),
                    400
                  );
                }
              );
            } else if (voucherUpdateStatus[0].hasOwnProperty('Exception')) {
              this.setState(
                {
                  isIndicatorVisible: false,
                  error_msg: voucherUpdateStatus[0].Exception,
                  messageType: 2,
                },
                () => {
                  setTimeout(
                    () =>
                      this.setState({
                        showModal: true,
                      }),
                    400
                  );
                }
              );
            } else if (voucherUpdateStatus[0].hasOwnProperty('Exception')) {
              this.setState(
                {
                  isIndicatorVisible: false,
                  error_msg: voucherUpdateStatus[0].Exception,
                  messageType: 3,
                },
                () => {
                  setTimeout(
                    () =>
                      this.setState({
                        showModal: true,
                      }),
                    400
                  );
                }
              );
            } else {
              this.setState(
                {
                  isIndicatorVisible: false,
                  messageType: 1,
                },
                () => {
                  setTimeout(
                    () =>
                      this.setState({
                        showModal: true,
                      }),
                    400
                  );
                }
              );
            }
          }
        } else {
          let data = this.props.navigation.state.params;
          let requestId = data.employeeDetails.in_requestid;
          let action = data.action;
          let remarks = this.state.remarks;
          if (action == 'Rejected') {
            let form = new FormData();
            form.append('ECSerp', employeeId);
            form.append('AuthKey', authenticationKey);
            form.append('Requestid', requestId);
            form.append('Click', action);
            form.append('ch_fc_code', '');
            form.append('Statustobeupdate', 0);
            form.append('Slxstage', 0);

            if (remarks != '') {
              form.append('vc_remarks', remarks);
            } else {
              form.append('vc_remarks', '');
            }

            let url = properties.approveActionUrl;
            let requestUpdateStatus = await fetchPOSTMethod(url, form);
			this.setState({isIndicatorVisible: false});
            if (requestUpdateStatus.length > 0) {
              this.setState(
                {
                  isIndicatorVisible: false,
                  messageType: 0,
                },
                () => {
                  setTimeout(
                    () =>
                      this.setState({
                        showModal: true,
                      }),
                    400
                  );
                }
              );
            } else {
              this.setState(
                {
                  isIndicatorVisible: false,
                  messageType: 1,
                },
                () => {
                  setTimeout(
                    () =>
                      this.setState({
                        showModal: true,
                      }),
                    400
                  );
                }
              );
            }
          } //Approve start
          else {
            let fcCode = null;
            let item = this.props.navigation.state.params.employeeDetails;
            let isOnsite = item.OnsiteRR == 'Y' ? true : false;
            let requestPosition = item.in_position;
            let resourceCategory = item.in_resource_cat;
            let statusForward = item.Status;
            let role = null;
            let status = null;
            console.log(
              'this.state.selectedRequestorOption',
              this.state.selectedRequestorOption
            );
            console.log('item', item);
            console.log('data.employeeDetails', data.employeeDetails);

            if (
              this.state.isVDHSelected &&
              data.employeeDetails.VDHApprvalFlag != '' &&
              data.employeeDetails.VDHApprvalFlag != 'N' &&
              data.employeeDetails.VDHApprvalFlag == 'Y'
            ) {
              console.log('aaaaaaa');
              let vdhfcCodeValue = data.employeeDetails.VDH;
              let vdhfcCodeSeperateArray = vdhfcCodeValue.split(':');
              fcCode = vdhfcCodeSeperateArray[0].trim();
              isIndicatorVisible = false;
            } else if (this.state.selectedRequestorOption == item.VDH) {
              console.log('bbbbbbb');
              let ap2fcCodeValue = data.employeeDetails.VDH;
              let rdgfcCodeSeparateArray = ap2fcCodeValue.split(':');
              fcCode = rdgfcCodeSeparateArray[0].trim();
              isIndicatorVisible = false;
            } else if (
              this.state.isVDHSelected &&
              data.employeeDetails.VDHApprvalFlag != ''
            ) {
              console.log('cccccccc');
              let rdgfcCodeValue = data.employeeDetails.RDG;
              let rdgfcCodeSeparateArray = rdgfcCodeValue.split(':');
              fcCode = rdgfcCodeSeparateArray[0].trim();
              // console.log("RDG 44444 fccode",fcCode)
              isIndicatorVisible = false;
            } else if (this.state.requestorListArray == 'Approving Authority') {
              console.log('dddddddd');
              isIndicatorVisible = false;
              fcCode = null;
            } else {
              console.log('eeeeeee');
              fcCode = this.state.selectedRequestor.EmployeeId;
            }

            // if (data.employeeDetails.VDHApprvalFlag == "Y" && data.employeeDetails.VDHApprvalFlag != "" && data.employeeDetails.VDHApprvalFlag != "N") {
            // 	role = "VDH"
            // }
            // else
            if (
              this.state.isVDHSelected &&
              data.employeeDetails.VDHApprvalFlag != '' &&
              data.employeeDetails.VDHApprvalFlag != 'N' &&
              data.employeeDetails.VDHApprvalFlag == 'Y'
            ) {
              role = 'VDH';
            } else if (
              this.state.isVDHSelected &&
              data.employeeDetails.VDHApprvalFlag != '' &&
              data.employeeDetails.VDHApprvalFlag != 'N'
            ) {
              role = 'RDG';
            } else if (
              (requestPosition == 1 || requestPosition == 2) &&
              resourceCategory == 3 &&
              statusForward == 8
            ) {
              console.log('ggggggg');
              role = 'TA';
              if (isOnsite) {
                console.log('Onsite TA');
                role = 'Onsite TA';
              } // sales both cases done
            } else if (
              requestPosition == 2 &&
              resourceCategory == 1 &&
              statusForward == 13
            ) {
              console.log('hhhhhhh');
              role = 'RDG';
            } else if (
              (requestPosition == 1 || requestPosition == 2) &&
              resourceCategory == 2 &&
              statusForward == 8
            ) {
              console.log('iiiiiii');
              role = 'Approving Authority';
            } else if (
              (requestPosition == 1 || requestPosition == 2) &&
              resourceCategory == 2 &&
              statusForward == 9
            ) {
              console.log('mmmmmmmm');
              if (this.state.selectedRequestorOption == item.VDH) {
                role = 'Approving Authority 2';
              } else {
                role = 'TA';
                if (isOnsite) {
                  role = 'Onsite TA';
                }
              }
            } else if (
              (requestPosition == 1 || requestPosition == 2) &&
              resourceCategory == 2 &&
              statusForward == 10
            ) {
              console.log('jjjjjjj');
              role = 'TA';
              if (isOnsite) {
                role = 'Onsite TA';
              } //diss here
            } else {
              console.log('kkkkkkkk');
              role = this.state.selectedRequestorOption;
            }

            if (action == 'Rejected') {
              status = 0;
            } else {
              console.log('new role', role);
              if (role == 'Supervisor') {
                status = 5;
              }
              // else if (role == "Requestor Service line") {
              // 	// console.log("Requestor Service line18")
              // 	status = 18;
              // }
              // else if(role == "Releasing Service line") {
              // 	status = 19;
              // } //RR new changes
              else if (role == 'Finance Controller') {
                status = 8; // Finance Controller(8)
              } else if (role == 'Onsite TA') {
                status = 15;
              } else if (role == 'RDG') {
                status = 12;
              } else if (role == 'VDH') {
                // console.log("VDH13")
                status = 13;
              } else if (role == 'TA') {
                status = 2;
              } else if (role == 'Approving Authority') {
                status = 9;
              } else if (role == 'Approving Authority 2') {
                status = 10;
              }
            }
            let form = new FormData();

            form.append('ECSerp', employeeId);
            form.append('AuthKey', authenticationKey);
            form.append('Requestid', requestId);
            form.append('Click', action);
            form.append('ch_fc_code', fcCode);
            form.append('Statustobeupdate', status);
            form.append('Slxstage', 0);
            console.log('final form data', form);
            if (remarks != '') {
              form.append('vc_remarks', remarks);
            } else {
              form.append('vc_remarks', '');
            }
            let url = properties.approveActionUrl;
            let requestUpdateStatus = await fetchPOSTMethod(url, form);
			this.setState({isIndicatorVisible: false});
            // console.log(requestUpdateStatus);
            if (requestUpdateStatus.length > 0) {
              this.setState(
                {
                  isIndicatorVisible: false,
                  messageType: 0,
                },
                () => {
                  setTimeout(
                    () =>
                      this.setState({
                        showModal: true,
                      }),
                    400
                  );
                }
              );
            } else {
              this.setState(
                {
                  isIndicatorVisible: false,
                  messageType: 1,
                },
                () => {
                  setTimeout(
                    () =>
                      this.setState({
                        showModal: true,
                      }),
                    400
                  );
                }
              );
            }
          }
          let form = new FormData();

          form.append('ECSerp', employeeId);
          form.append('AuthKey', authenticationKey);
          form.append('Requestid', requestId);
          form.append('Click', action);
          form.append('ch_fc_code', fcCode);
          form.append('Statustobeupdate', status);
          form.append('Slxstage', 0);
          if (remarks != '') {
            form.append('vc_remarks', remarks);
          } else {
            form.append('vc_remarks', '');
          }
          let url = properties.RRActionUrl;
          let requestUpdateStatus = await fetchPOSTMethod(url, form);
		  this.setState({isIndicatorVisible: false});
          // console.log(requestUpdateStatus);
          if (requestUpdateStatus.length > 0) {
            this.setState(
              {
                isIndicatorVisible: false,
                messageType: 0,
              },
              () => {
                setTimeout(
                  () =>
                    this.setState({
                      showModal: true,
                    }),
                  400
                );
              }
            );
          } else if (requestUpdateStatus?.Exception?.length > 0) {
            this.setState(
              {
                isIndicatorVisible: false,
                error_msg: requestUpdateStatus.Exception,
                messageType: 2,
              },
              () => {
                setTimeout(
                  () =>
                    this.setState({
                      showModal: true,
                    }),
                  400
                );
              }
            );
          } else if (requestUpdateStatus?.Exception?.length > 0) {
            this.setState(
              {
                isIndicatorVisible: false,
                error_msg: requestUpdateStatus.Exception,
                messageType: 3,
              },
              () => {
                setTimeout(
                  () =>
                    this.setState({
                      showModal: true,
                    }),
                  400
                );
              }
            );
          } else {
            this.setState(
              {
                isIndicatorVisible: false,
                messageType: 1,
              },
              () => {
                setTimeout(
                  () =>
                    this.setState({
                      showModal: true,
                    }),
                  400
                );
              }
            );
          }
        }
      } catch (error) {}
    } else {
      
      alert(NO_INTERNET);
    }
  }

  getData(item, parameter) {
    
    if (_.isString(item.item)) {
      this.setState({ selectedRole: item.item }, () => {
        if (this.state.selectedRole == 'Supervisor') {
          this.setState({ inMemoryList: [], supervisorList: [] });
        }
      });
    }
    console.log('Selected Parameter : ', parameter);
    if (parameter == 'requestorOptionList') {
      if (isComingFromVoucher) {
        this.setState({
          selectedRequestorOption: item.item,
          requestorOptionList: false,
        });
        
        if (isComingFromUSVoucher) {
          if (item.item == 'Supervisor') {
            this.setState({
              displaySupervisorList: false,
              selectedRequestor: null,
            });
            this.getSelectedRequestorList(item.item);
          }
        } else {
          if (item.item == 'FSO') {
            this.setState({
              isIndicatorVisible: false,
              displaySupervisorList: false,
              displaySelectedRequestor: false,
            });
          } else if (item.item == 'Supervisor') {
            this.setState({
              displaySupervisorList: false,
              selectedRequestor: null,
            });
            
            this.getSelectedRequestorList(item.item);
          } else if (item.item == 'HR/FSO') {
            this.setState({
              isIndicatorVisible: false,
              displaySupervisorList: false,
              displaySelectedRequestor: false,
            });
          }
        }
      } else {
        vdhSelectedItemData = this.props.navigation.state.params
          .employeeDetails;
        if (item.item == 'VDH') {
          this.setState({
            selectedRequestorOption: vdhSelectedItemData.VDH, //VDH name with code ex:   00012345 : Ajay dixit
            requestorOptionList: false,
            displaySupervisorList: false,
            selectedRequestor: null,
            isVDHSelected: true,
            isIndicatorVisible: false,
          });
          vdhApproveFlag = vdhSelectedItemData.VDHApprvalFlag;
        } else if (item.item == 'RDG' || item.item == 'TA') {
          //need to diss with kirti
          this.setState({
            selectedRequestorOption: vdhSelectedItemData.RDG,
            requestorOptionList: false,
            displaySupervisorList: false,
            selectedRequestor: null,
            isVDHSelected: true,
            isIndicatorVisible: false,
          });
          vdhApproveFlag = vdhSelectedItemData.VDHApprvalFlag;
        } else if (item.item == 'Approving Authority 2') {
          this.setState({
            selectedRequestorOption: vdhSelectedItemData.VDH,
            requestorOptionList: false,
            displaySupervisorList: false,
            selectedRequestor: null,
            isVDHSelected: true,
            isIndicatorVisible: false,
          });
          vdhApproveFlag = vdhSelectedItemData.VDHApprvalFlag;
        } else if (item.item == 'Approving Authority') {
          this.setState({
            isIndicatorVisible: false,
            selectedRequestorOption: item.item, // designation like supervisor,finance controller etc and replace 'select' label value.
            requestorOptionList: false, // supervisor, finance controller, onsite TA etc dropdown list boolean
            displaySupervisorList: false, // boolean to show 2nd list like 00072345: mahaboob, 000156322: anil
            // isIndicatorVisible: false,
            selectedRequestor: null,
            isVDHSelected: false,
          });
        } else {
          this.setState({
            isIndicatorVisible: false,
            selectedRequestorOption: item.item, // designation like supervisor,finance controller etc and replace 'select' label value.
            requestorOptionList: false, // supervisor, finance controller, onsite TA etc dropdown list boolean
            displaySupervisorList: false, // boolean to show 2nd list like 00072345: mahaboob, 000156322: anil
            selectedRequestor: null,
            isVDHSelected: false,
          });

          this.getSelectedRequestorList(item.item);
        }
      }
    } else if (parameter == 'supervisorList') {
      // after selecting supervisor/finance controller from dropdown(who have multiple option to select further)
      console.log('Selected Item : ', item.item);
      this.setState({
        selectedRequestor: item.item, // content of one supervisor
        displaySelectedRequestor: true, // flag to show 2nd box with selected supervisor value
        displaySupervisorList: false,
        isVDHSelected: false,
      });
    }
  }

  backNavigate() {
    writeLog('Clicked on ' + 'backNavigate' + ' of ' + 'SupervisorSelection');
    this.setState({
      requestorListArray: [],
      requestorOptionList: false,
      selectedRequestorOption: null,
      displaySupervisorList: false,
      supervisorList: [],
      displaySelectedRequestor: false,
      selectedRequestor: null,
      remarks: '',
      vdhApproveFlag: '',
      vdhSelectedItemData: {},
      messageType: null,
      isVDHSelected: false,
    });
    if (isComingFromUSVoucher) {
      this.props.navigation.navigate('DashBoard');
    } else if (isComingFromVoucher) {
      this.props.navigation.navigate('Home');
    } else {
      this.props.navigation.pop();
    }
  }
  renderListView(item, parameter) {
    console.log("item",item) 
    console.log("parameter",parameter)
    let dataToDisplay = null;
    if (parameter == 'requestorOptionList') {
      dataToDisplay = item.item;
      console.log("dataTos",item.item)
    } else if (parameter == 'supervisorList') {
      dataToDisplay = item.item.EmpName;
    }
 
    return (
      <View
        style={{
          flex: 1,
          width: '100%',
          height: moderateScale(40),
          justifyContent: 'center',
        }}
      >
        <TouchableOpacity
          onPress={() => this.getData(item, parameter)}
          style={{ paddingLeft: 10, justifyContent: 'center' }}
        >
          <Text>{dataToDisplay}</Text>
        </TouchableOpacity>
      </View>
    );
  }
  renderList(parameter) {
    console.log('Inside render list parameters : ', parameter);
    let data = [];
    if (parameter == 'requestorOptionList') {
        console.log("DocumentType",this.state.voucherDetail.DocumentType) 
      console.log(
        'this.state.requestorListArray',
        this.state.requestorListArray //  ['Supervisor', 'FSO']
      );
      data = this.state.requestorListArray;
      
      }

     else if (parameter == 'supervisorList') {
      data = this.state.supervisorList;
      data = data.sort((a, b) => a.EmpCode - b.EmpCode);
      console.log("getData",data)
    }
   
    console.log(' data : ', data);
console.log("this.state.voucherDetail",this.state.voucherDetail)
    return (
      <View
        style={{
          width: parameter == 'supervisorList' ? '100%' : '90%',
          overflow: 'hidden',
        }}
      >
        
        <FlatList
          contentContainerStyle={{ width: '100%' }}
           data={data}
          // data={this.state.voucherDetail.DocumentType =="LCV" ?['Supervisor'] :data}
          //data={this.state.voucherDetail?.DocumentType =="LCV" ||this.state.voucherDetail.TotalAmount>10000 ?data.filter((item)=>item =="Supervisor") :data}

          extraData={this.state}
          renderItem={(item) => this.renderListView(item, parameter)} //Onsite?rop
          ItemSeparatorComponent={() => (
            <View
              style={{
                backgroundColor: appConfig.DARK_BLUISH_COLOR,
                height: moderateScale(1),
                width: '100%',
              }}
            />
          )}
        />
      </View>
    );
  }

  renderRequestorOptionList() {
    //check once for top space
    if (this.state.requestorOptionList) {
      return this.renderList('requestorOptionList');
    }
  }

  // to show 2nd selected list item chosen from 1st list output dropdown list
  
  displaySelectedRequestorField() {
    if (this.state.displaySupervisorList) {
      const { query } = this.state;
      
      return (
        <SearchBar
          lightTheme
          placeholder={SEARCH_PLACEHOLDER_TEXT}
          onChangeText={(text) => {
            this.state.selectedRole == 'Supervisor'
              ? this.setState({ superVisorSearchText: text })
              : this.updateSearch(text);
          }}
          value={
            this.state.selectedRole == 'Supervisor'
              ? this.state.superVisorSearchText
              : this.state.query
          }
          raised={true}
          containerStyle={styles.searchBar}
          autoCapitalize="none"
          autoCompleteType="off"
          autoCorrect={false}
        />
      );
    } else if (
      this.state.displaySelectedRequestor &&
      this.state.selectedRequestor &&
      (isComingFromVoucher
        ? this.state.selectedRequestor.EmpName
        : this.state.selectedRequestor.EmpName)
    ) {
      return (
        <TouchableOpacity
          onPress={() =>
            this.setState({
              displaySupervisorList: !this.state.displaySupervisorList,
            })
          }
          style={{
            marginTop: 5,
            borderWidth: 1,
            borderColor: appConfig.LIST_BORDER_COLOUR,
            borderRadius: moderateScale(5),
            height: moderateScale(40),
            width: '90%',
            justifyContent: 'center',
            paddingLeft: 10,
    
          }}
        >
          <Text>
            {isComingFromVoucher
              ? this.state.selectedRequestor.EmpName
              : this.state.selectedRequestor.EmpName}
          </Text>
        </TouchableOpacity>
      );
    }
  }
  renderRequestorList() {
    if (
      this.state.displaySupervisorList &&
      this.state.supervisorList &&
      this.state.supervisorList.length > 0
    ) {
      return (
        <View style={{ height: '60%', width: '90%', marginTop: 5 }}>
          {this.renderList('supervisorList')}
        </View>
      );
    }
  }
  showDialogBox() {
    let message = '';
    let heading = '';
    if (this.state.showModal) {
      if (this.state.messageType == 0) {
        // console.log("111111 test")
        message = 'Your request has been ';
        message =
          this.props.navigation.state.params.action != undefined
            ? message + this.props.navigation.state.params.action.toLowerCase()
            : '';
        heading = 'successful';
      } else if (this.state.messageType == 2) {
        message = this.state.error_msg;
        heading = 'Error';
      } else if (this.state.messageType == 3) {
        message = this.state.error_msg;
        heading = 'Pending Info';
      } else {
        message = constant.SLOW_RESPONSE;
        heading = 'sorry';
      }
      return (
        <UserMessage
          heading={heading}
          message={message}
          okAction={() => {
            this.setState({ showModal: false });
            this.state.messageType == 0 || this.state.messageType == 1 || this.state.messageType == 2 || this.state.messageType == 3
              ? this.backNavigate()
              : this.handleLogoutConfirm();
          }}
        />
      );
    }
  }
  showUserDetails() {
    if (isComingFromVoucher) {
      return null;
    } else {
      return (
        <View style={{ marginTop: moderateScale(6) }}>
          <View style={style.cardBackground} resizeMode="cover">
            <View
              style={{
                marginHorizontal: moderateScale(6),
                paddingTop: moderateScale(2),
              }}
            >
              <View style={{ flexDirection: 'row' }}>
                <Text
                  style={[
                    globalFontStyle.imageBackgroundLayout,
                    style.displayItemTextTwo,
                  ]}
                >
                  {'Req#'}{' '}
                </Text>
                <Text
                  style={[
                    globalFontStyle.imageBackgroundLayout,
                    style.displayItemTextTwo,
                  ]}
                >
                  {this.state.requestDetails.in_requestid}{' '}BOLD
                </Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Text
                  style={[
                    globalFontStyle.imageBackgroundLayout,
                    style.displayItemTextTwo,
                  ]}
                >
                  {constant.REQUESTER_NAME}{' '}
                </Text>
                <Text
                  style={[
                    globalFontStyle.imageBackgroundLayout,
                    style.displayItemTextTwo,
                  ]}
                >
                  {this.state.requestDetails.vc_name}{' '}
                </Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Text
                  style={[
                    globalFontStyle.imageBackgroundLayout,
                    style.displayItemTextTwo,
                  ]}
                >
                  {constant.PENDING_SINCE}{' '}
                </Text>
                <Text
                  style={[
                    globalFontStyle.imageBackgroundLayout,
                    style.displayItemTextTwo,
                  ]}
                >
                  {this.state.requestDetails.dt_updated}
                </Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Text
                  style={[
                    globalFontStyle.imageBackgroundLayout,
                    style.displayItemTextTwo,
                  ]}
                >
                  {'Pending As'}{' '}
                </Text>
                <Text
                  style={[
                    globalFontStyle.imageBackgroundLayout,
                    style.displayItemTextTwo,
                  ]}
                >
                  {this.state.requestDetails.vc_status}{' '}
                </Text>
              </View>
            </View>
            <Seperator />
          </View>
        </View>
      );
    }
  }
  handleLogoutConfirm() {
    this.setState({
      showLogoutModal: false,
    });
    this.props.navigation.navigate('Login');
  }

  activityIndicator() {
   
    if (this.state.isIndicatorVisible) {
      return <ActivityIndicatorView loader={this.state.isIndicatorVisible} />;
    } else {
      return null;
    }
  }
  handleBack() {
    writeLog('Clicked on ' + 'handleBack' + ' of ' + 'SupervisorSelection');
    this.props.navigation.pop();
  }

  render() {
    let myNewPageTitle =
      myPageTitle.search(globalConstants.VOUCHER_TEXT) === -1
        ? myPageTitle.concat(globalConstants.ACTION_TEXT)
        : myPageTitle.replace(
            globalConstants.VOUCHER_TEXT,
            globalConstants.ACTION_TEXT
          );
    let label =
      this.state.selectedRequestorOption == null
        ? 'Select'
        : this.state.selectedRequestorOption;
    let action = checkAction;
    // console.log("action mohit:::::", action)

    return (
      <DismissKeyboardView
        style={{
          flex: 1,
          backgroundColor: 'white',
          paddingVertical: 10,
        }}
      >
        <View style={{ flex: 1 }}>
          <SubHeader
            pageTitle={myNewPageTitle}
            backVisible={true}
            logoutVisible={true}
            handleBackPress={() => this.handleBack()}
            navigation={this.props.navigation}
          />
          <View
            style={{
              borderWidth: 1,
              borderColor: appConfig.APP_BORDER_COLOR,
              marginHorizontal: 10,
              borderRadius: 5,
              marginTop: 10,
            }}
          >
            {this.activityIndicator()}
            {this.showUserDetails()}
            {action === 'Approved' || action === 'Escalated' ? (
              <View
                style={{
                  alignItems: 'center',
                  // justifyContent: "center",
                  marginTop: moderateScale(15),
                  width: '100%',
                }}
              >
                <Text
                  style={{
                    width: '90%',
                    marginBottom: 5,
                    color: '#06141F',
                  }}
                >
                  Submit to:
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    console.log(
                      'this.state.requestorOptionList',
                      this.state.requestorOptionList
                    );
                    this.setState({
                      requestorOptionList: !this.state.requestorOptionList,
                    });
                  }}
                  style={{
                    borderBottomColor: appConfig.DARK_BLUISH_COLOR,
                    borderBottomWidth: 1,
                    height: moderateScale(40),
                    width: '90%',
                    paddingLeft: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text style={{ color: '#06141F' }}>{label}</Text>
                  {this.state.requestorOptionList ? (
                    <Image
                      style={{ marginRight: 10 }}
                      source={images.arrowUp}
                    />
                  ) : (
                    <Image
                      style={{ marginRight: 10 }}
                      source={images.arrowDown}
                    />
                  )}
                </TouchableOpacity>

                {this.renderRequestorOptionList()}
                {this.displaySelectedRequestorField()}
                {this.renderRequestorList()}
              </View>
            ) : null}
            {!this.state.displaySupervisorList ? (
              <View
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: appConfig.DARK_BLUISH_COLOR,
                  width: '90%',
                  alignItems: 'center',
                  alignSelf: 'center',
                  marginTop: moderateScale(10),
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <TextInput
                  multiline={true}
                  maxLength={100}
                  onChangeText={(text) => this.setState({ remarks: text })}
                  value={this.state.remarks}
                  placeholder="Remarks"
                  style={{
                    width: '90%',
                    paddingLeft: 10,
                    paddingTop: 10,
                    paddingBottom: 10,
                  }}
                />
                <Image source={images.resizeIcon} />
              </View>
            ) : null}
            <View
              style={{
                width: '40%',
                marginTop: 20,
                marginBottom:5,
                alignSelf: 'center',
              }}
            >
              <TouchableOpacity onPress={() => this.validateApprove(action)}>
                <Image
                  source={
                    action == 'Approved'
                      ? images.approveButton
                      : images.submitButton
                  }
                />
              </TouchableOpacity>
            </View>
          </View>
          {this.showDialogBox()}
        </View>
      </DismissKeyboardView>
    );
  }
}

const styles = StyleSheet.create({
  searchBar: {
    backgroundColor: '#FFFFFF',
    width: '90%',
  },
  customeSearchBar: {
    borderWidth: 1,
    borderColor: appConfig.LIST_BORDER_COLOUR,
    borderRadius: moderateScale(5),
    height: moderateScale(40),
    width: '90%',
    justifyContent: 'center',
    paddingLeft: 10,
    marginTop: 5,
  },
  textInput: {
    fontSize: 22,
    flex: 1,
  },
});

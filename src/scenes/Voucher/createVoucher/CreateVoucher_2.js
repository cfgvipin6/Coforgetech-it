/*
Author: Mohit Garg(70024)
*/

import React, { cloneElement, Component } from 'react';
import { connect } from 'react-redux';
import {
  Text,
  View,
  Image,
  ImageBackground,
  Alert,
  TouchableOpacity,
  Dimensions,
  Modal,
  FlatList,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import SubHeader from '../../../GlobalComponent/SubHeader';
import { LabelEditText } from '../../../GlobalComponent/LabelEditText/LabelEditText';
import { LabelEditTextWithBtn } from '../../../GlobalComponent/LabelEditTextWithBtn/LabelEditTextWithBtn';
import { globalFontStyle } from '../../../components/globalFontStyle';
import CustomButton from '../../../components/customButton';
import ActivityIndicatorView from '../../../GlobalComponent/myActivityIndicator';
import { styles } from './styles';
import { DatePicker } from '../../../GlobalComponent/DatePicker/DatePicker';
import { Dropdown } from '../../../GlobalComponent/DropDown/DropDown';
import UserMessage from '../../../components/userMessage';
import { HistoryView } from '../../../GlobalComponent/HistoryView/HistoryView';
import helper from '../../../utilities/helper';
import moment from 'moment';
import {
  cvFetchEmployeeData,
  cvSaveAndSubmitDetails,
  cvFetchLineItemData,
  cvSearchProject,
  cvSearchSupervisor,
  cvDeleteLineItem,
  cvDeleteVoucher,
  cvFetchMileageCommMiles,
  cvResetScreen,
  cvResetEmpData,
  cvFetchHistory,
  cvFetchExpenseType,
  cvFetchTravelLocation,
  cvFetchTravelAmount,
  cvFetchCurrencyType,
  cvValidateDetails,
  resetCvHistoryData,
  cvFetchTakeABreakBalance,
} from './cvAction';
import {
  employeeDetail,
  sectionNewTitle,
  sectionTitle,
  lineItemDetail,
  showEmpDataRowGrid,
  calculateFinancialYear,
  myModalView,
  myProjectView,
  myParticularView,
  additionalInfoView,
  ukMileageCommMileageView,
  validateDetails,
} from './cvUtility';
import {
  fetchCreateModifyStopData,
  fetchProjectList,
} from '../createGenericVoucher/utils.js';
import { showToast } from '../../../GlobalComponent/Toast';
import { Icon, SearchBar } from 'react-native-elements';
import { SubmitTo } from '../createGenericVoucher/submitTo';
import { WarningMessage } from '../../../GlobalComponent/WarningMessage/WarningMessage';
import images from '../../../images';
const { height } = Dimensions.get('window');
let constants = require('./constants');
let globalConstants = require('../../../GlobalConstants');
let previousScreenData;
let TOTAL_AMOUNT = 0;
var subCategoryData;
class CreateVoucher_2 extends Component {
  constructor(props) {
    super(props);
    previousScreenData = this.props.navigation.state.params;
    console.log('previousScreenData', previousScreenData);
    isComingFromMyVoucher = previousScreenData.isComingFromMyVoucher;
    defaultCurrencyIdValue = 'INR';
    initialAmount = '';
    initialAmountEditable = true;
    maxClaimableAmount = '';
    isDocumentSaved = true;
    console.log('isComingFromMyVoucher', isComingFromMyVoucher);
    if (isComingFromMyVoucher) {
      docDetails = previousScreenData.docDetails;
      categoryDataId = docDetails.Category;
      categoryDataDisplayText = docDetails.CategoryName;
      docStatusCode = docDetails.StatusCode;
      pendingWith = docDetails.PendingWithCode;
      if (
        docStatusCode == 0 ||
        docStatusCode == 1 ||
        docStatusCode == 5 ||
        docStatusCode == 7 ||
        docStatusCode == 12 ||
        docStatusCode == 14
      ) {
        isDocumentSaved = true;
      } else {
        isDocumentSaved = false;
      }
      this.props.fetchCVEmployeeData(
        this.props.loginData.SmCode,
        this.props.loginData.Authkey,
        docDetails.DocNo,
        () => {
          console.log('88888888zzzzzzz', this.props.cvEmployeeData[0]);
          this.checkIfModificationValid();
          if (
            categoryDataId == 1 &&
            this.props.cvEmployeeData.length > 0 &&
            this.props.cvEmployeeData[0].VoucherType == 1 &&
            isDocumentSaved
          ) {
            this.props.fetchCVTakeABreakBalance(docDetails.DocNo).then(() => {
              if (
                this.props.cvTakeABreakData[0] &&
                this.props.cvTakeABreakData[0] != undefined
              ) {
                let myTakeABreakData = this.props.cvTakeABreakData[0].Code.split(
                  ':'
                );
                maxClaimableAmount = myTakeABreakData[1];
                console.log('TAB', myTakeABreakData);
              }
            });
          }
          if (
            this.props.cvEmployeeData[0]?.VoucherType == 10 &&
            this.props.cvEmployeeData[0]?.Category == 1
          ) {
            initialAmountEditable = false;
            this.updateAmount();
          }
        }
      );
      this.props.fetchCVLineItemData(docDetails.DocNo);
      isDocumentSaved ? '' : this.props.fetchCVHistory(docDetails.DocNo);
    } else {
      categoryData = previousScreenData.categoryDetails;
      categoryDataId = categoryData.id;
      categoryDataDisplayText = categoryData.displayText;
      if (categoryDataId == 1) {
        subCategoryData = previousScreenData.subCategoryDetails;
        empWeddingDateValue = subCategoryData.weddingDate;
        if (subCategoryData.id == 8) {
          initialAmount = '10000';
          initialAmountEditable = false;
        } else if (subCategoryData.id == 9) {
          initialAmount = '5000';
          initialAmountEditable = true;
        } else if (subCategoryData.id == 1) {
          initialAmount = subCategoryData.claimableBal;
          maxClaimableAmount = subCategoryData.claimableBal;
          initialAmountEditable = true;
        } else if (subCategoryData.id == 10) {
          initialAmount = '250';
          initialAmountEditable = false;
        } else {
          initialAmount = '';
          initialAmountEditable = true;
        }
      } else if (
        categoryDataId == 2 ||
        categoryDataId == 8 ||
        categoryDataId == 9 ||
        categoryDataId == 10
      ) {
        prevScreenProjectValue = previousScreenData.myProject;
        prevScreenCostCenterValue = previousScreenData.myCostCenter;
      }
    }
    this.state = {
      particularInput: '',
      cashMemoInput: '',
      numPeople: 0,
      amountInput: !isComingFromMyVoucher ? initialAmount : '',
      exchRateMultiplierInput: 1,
      finalExchAmount: '',
      costCenterValue: '',
      projectSearchValue: '',
      costCenterArray: [],
      costCenterUserSearchArray: [],
      projectArray: [],
      projectUserSearchArray: [],
      costCenterID: '',
      isProjectAvailable: true,
      supervisorSearchValue: '',
      remarksInput: '',
      submitToValue: '',
      autoCompleteSupervisorHideResult: false,
      searchProjectDataArray: [],
      autoSearchProjectDataArray: [],
      autoSearchSupervisorDataArray: [],
      isDateCalendarVisible: false,
      isDestDateCalendarVisible: false,
      isTimeCalendarVisible: false,
      isDestTimeCalendarVisible: false,
      dateValue: moment().format('DD-MMM-YYYY'),
      destDateValue: moment().format('DD-MMM-YYYY'),
      startTimeValue: moment().format('HHmm'),
      destTimeValue: moment().format('HHmm'),
      showModal: false,
      costProjectModalVisible: false,
      costProjectModalFor: '',
      costProjectSearchQuery: '',
      messageType: '',
      popUpHeading: '',
      popUpMessage: '',
      isLineItemEditing: false,
      lineItemIdValue: '',
      fromInput: '',
      toInput: '',
      kmInput: '',
      modeOfConveyanceValue: '',
      modeOfConveyanceIdValue: '',
      modeOfConveyanceRateValue: '',
      roundTripFlagValue: false,
      corpCreditCardFlagValue: false,
      isAmountEditable: true,
      isExchRateMultiplierEditable: false,
      currencyValue: '',
      currencyIdValue: 'INR',
      docNumber: '',
      expenseTypeValue: '',
      expenseTypeIdValue: '',
      lineItemCurrencyTypeValue: '',
      lineItemCurrencyTypeIdValue: '',
      travelLocationValue: '',
      travelLocationIdValue: '',
      mileageCurrentYearStartDt: '',
      mileageCurrentYearEndDt: '',
      mileageCurrentYearCommMiles: '',
      mileagePrevYearStartDt: '',
      mileagePrevYearEndDt: '',
      mileagePrevYearCommMiles: '',
      dummyFlag: false,
      modificationStopMessage: '',
      isFreezed: false,
      responseFetched: false,
    };
    this.submitToRef = React.createRef();
    this.modeOfConveyanceRef = React.createRef();
    this.locationRef = React.createRef();
    this.currencyRef = React.createRef();
    this._panel = React.createRef();
    this.expenseTypeRef = React.createRef();
    this.currencyTypeRef = React.createRef();
    financialYearStartDate = calculateFinancialYear(this.state.dateValue);
  }

  static getDerivedStateFromProps = (nextProps, state) => {
    // console.log("getDerivedStateFromProps////////////////////////////////////", nextProps.cvEmployeeData)
    myCurrency =
      nextProps.cvEmployeeData.length > 0
        ? nextProps.cvEmployeeData[0].CURRENCY
        : 'INR';
    defaultCurrencyIdValue = myCurrency;
    return {
      cvEmployeeDataArray: nextProps.cvEmployeeData,
      cvHistoryDataArray: nextProps.cvHistoryData,
      cvSaveAndSubmitDataArray: nextProps.cvSaveAndSubmitData,
      cvLineItemDataArray: nextProps.cvLineItemData,
      currencyIdValue: myCurrency,
      docNumber: isComingFromMyVoucher
        ? state.docNumber
        : nextProps.cvLineItemData &&
          nextProps.cvLineItemData.length > 0 &&
          nextProps.cvLineItemData[0].DocNo,
      cvExpenseTypeArray: nextProps.cvExpenseTypeData,
      cvCurrencyTypeArray: nextProps.cvCurrencyTypeData,
      cvTravelLocationDataArray: nextProps.cvTravelLocationData,
    };
  };

  checkIfModificationValid = async () => {
    try {
      let response = await fetchCreateModifyStopData(categoryDataId);
      console.log('Response of fetchCreateModifyStopData :', response);
      let exceptionalCompanyCodes =
        response &&
        response.length > 0 &&
        response[0]?.ExceptionalCompanyCode?.split(',');
      let isModificationStop =
        response && response.length > 0 && response[0].IsModificationStop;
      if (
        Array.isArray(exceptionalCompanyCodes) &&
        exceptionalCompanyCodes.length > 0 &&
        this.state.cvEmployeeDataArray.length > 0
      ) {
        let isCodeMatched = exceptionalCompanyCodes.includes(
          this.state.cvEmployeeDataArray[0].CO_CODE
        );
        if (isCodeMatched && isModificationStop == 'Y') {
          this.setState({
            modificationStopMessage: response[0].ModificationStopMessage,
            isFreezed: true,
          });
        } else {
          console.log('Exceptional Company Codes : ', exceptionalCompanyCodes);
          console.log('Is Modification Stop : ', isModificationStop);
          console.log('Is code matched :', isCodeMatched);
        }
      }
      this.setState({ responseFetched: true });
    } catch (e) {
      console.log('Error in checkIfModificationValid', e);
      this.setState({ responseFetched: true });
      // if(!this.state.loading)
      // alert(e)
    }
  };

  componentDidMount() {
 
    if (this.state.cvEmployeeDataArray.length > 0) {
      let myEmpData = this.state.cvEmployeeDataArray[0];
      if (myEmpData) {
        this.setState({
          costCenterValue:
            myEmpData.CC_CODE != ''
              ? myEmpData.CC_CODE.concat('~').concat(myEmpData.CC_TXT)
              : '',
          projectSearchValue:
            myEmpData.PROJ_CODE != ''
              ? myEmpData.PROJ_CODE.concat('~').concat(myEmpData.PROJ_TXT)
              : '',
          costCenterArray: myEmpData.CostCenterCodeSelectList,
          costCenterUserSearchArray: myEmpData.CostCenterCodeSelectList,
          projectArray: myEmpData.ProjectCodeSelectList,
          projectUserSearchArray: myEmpData.ProjectCodeSelectList,
        });
      }
    }
    if (isComingFromMyVoucher) {
      console.log('8888888888');
      if (categoryDataId == 9 || categoryDataId == 8) {
        console.log('8888888888aaaaaa');
        this.setState({
          docNumber: previousScreenData.docDetails.DocNo,
          corpCreditCardFlagValue:
            previousScreenData.docDetails.CreditCardRem == 'Y' ? true : false,
        });
      } else {
        console.log('8888888888bbbbbbb');
        this.setState({ docNumber: previousScreenData.docDetails.DocNo });
      }
    }

    if (categoryDataId == 8) {
      this.props.fetchCVExpenseType('Travel');
      this.props.fetchCVTravelLocation();
      this.props.fetchCVCurrencyType();
    } else if (categoryDataId == 9) {
      this.props.fetchCVExpenseType('Expense');
      this.props.fetchCVCurrencyType();
    } else if (categoryDataId == 10) {
      this.props.fetchCVMileageCommMiles(this.state.docNumber).then(() => {
        // false input need to check
        if (this.props.cvMileageCommMilesData.length > 0) {
          let myCommMilesData = this.props.cvMileageCommMilesData[0];
          this.setState(
            {
              mileageCurrentYearStartDt: myCommMilesData.CurrYear_StartDt,
              mileageCurrentYearEndDt: myCommMilesData.CurrYear_EndDt,
              mileageCurrentYearCommMiles: myCommMilesData.CurrYear_UsedMiles,
              mileagePrevYearStartDt: myCommMilesData.PrevYear_StartDt,
              mileagePrevYearEndDt: myCommMilesData.PrevYear_EndDt,
              mileagePrevYearCommMiles: myCommMilesData.PrevYear_UsedMiles,
            },
            () => {
              console.log(
                'mileageCurrentYearStartDt0000000',
                this.state.mileageCurrentYearStartDt
              );
            }
          );
        }
      });
    }
  }
  updateAmount = () => {
    let claimableAmount = this.props.cvEmployeeData[0].CovidClaimBalance;
    let amount = parseInt(claimableAmount) - parseInt(TOTAL_AMOUNT);
    console.log('I found here', claimableAmount);
    console.log('I found here', amount);
    this.setState({ amountInput: '' + amount }, () => {
      console.log('Amount input set to ', this.state.amountInput);
    });
  };

 
  componentDidUpdate() {
     
    // console.log("componentDidUpdate.........................................")
    let saveOrSubmitData = this.state.cvSaveAndSubmitDataArray[0];
    let saveOrSubmitStatus =
      saveOrSubmitData && saveOrSubmitData != undefined
        ? saveOrSubmitData.status
        : '';
    let saveOrSubmitMsg =
      saveOrSubmitData && saveOrSubmitData != undefined
        ? saveOrSubmitData.message
        : '';
    let docNumber =
      saveOrSubmitData && saveOrSubmitData != undefined
        ? saveOrSubmitData.DocumentNo
        : '';
    let heading, msg;
    if (this.state.cvEmployeeDataArray.length > 0 && !this.state.dummyFlag) {
      this.setState(
        {
          dummyFlag: true,
        },
        () => {
          let myEmpData = this.state.cvEmployeeDataArray[0];
          if (myEmpData) {
            this.setState({
              costCenterValue:
                myEmpData.CC_CODE != ''
                  ? myEmpData.CC_CODE.concat('~').concat(myEmpData.CC_TXT)
                  : '',
              projectSearchValue:
                myEmpData.PROJ_CODE != ''
                  ? myEmpData.PROJ_CODE.concat('~').concat(myEmpData.PROJ_TXT)
                  : '',
              costCenterArray: myEmpData.CostCenterCodeSelectList,
              costCenterUserSearchArray: myEmpData.CostCenterCodeSelectList,
              projectArray: myEmpData.ProjectCodeSelectList,
              projectUserSearchArray: myEmpData.ProjectCodeSelectList,
            });
          }
        }
      );
    }
    if (
      this.props.cvLoading === false &&
      this.state.popUpMessage === '' &&
      this.props.cvLineItemError &&
      this.props.cvLineItemError.length > 0
    ) {
      heading = 'Error!';
      msg = this.props.cvLineItemError;
      myModalView(this, true, heading, msg, 500);
    }
    if (
      this.props.cvLoading === false &&
      this.state.popUpMessage === '' &&
      saveOrSubmitStatus === 'success' &&
      saveOrSubmitMsg === 'Request submitted successfully.'
    ) {
      heading = 'Data Submitted!';
      msg = constants.DATA_SUBMIT_MSG + docNumber;
      myModalView(this, true, heading, msg, 500);
    } else if (
      this.props.cvLoading === false &&
      this.state.popUpMessage === '' &&
      saveOrSubmitStatus === 'error'
    ) {
      heading = globalConstants.ATTENTION_HEADING_TEXT;
      msg = saveOrSubmitMsg;
      myModalView(this, true, heading, msg, 500);
    } else if (
      this.props.cvDeleteVoucherData &&
      this.props.cvDeleteVoucherData[0] &&
      this.props.cvDeleteVoucherData[0].message !== undefined &&
      this.state.popUpMessage === ''
    ) {
      console.log('kkkkkkk', docNumber);
      heading = 'Data Deleted!';
      msg = constants.DATA_DELETE_MSG + this.getDocNumber();
      myModalView(this, true, heading, msg, 500);
    }
  }

  componentWillUnmount = () => {
    if (isComingFromMyVoucher) {
      this.props.resetCVEmpData();
    }
    this.props.resetCVScreen();
    this.props.resetHistory();
  };

  onBack = () => {
    this.props.navigation.pop();
  };

  handleBack = () => {
    console.log('Handeling Back ');
    setTimeout(() => {
      this.props.navigation.navigate('VoucherDashBoard');
    }, 500);
  };

  getDocNumber = () => {
    let docNumber = '';
    if (isComingFromMyVoucher) {
      docNumber = docDetails.DocNo;
    } else {
      docNumber =
        this.state.cvSaveAndSubmitDataArray[0] &&
        this.state.cvSaveAndSubmitDataArray[0] != undefined
          ? this.state.cvSaveAndSubmitDataArray[0].DocumentNo
          : '';
    }
    return docNumber;
  };

  getLineItemDataCallBack = () => {
    let docNumber,
      isLineItemCostProject = true,
      myEmpData = this.state.cvEmployeeDataArray[0];
    if (isComingFromMyVoucher) {
      docNumber = docDetails.DocNo;
    } else {
      docNumber =
        this.state.cvSaveAndSubmitDataArray[0] &&
        this.state.cvSaveAndSubmitDataArray[0] != undefined
          ? this.state.cvSaveAndSubmitDataArray[0].DocumentNo
          : '';
    }
    this.props.fetchCVLineItemData(docNumber).then(() => {
      if (categoryDataId == 2) {
        this.modeOfConveyanceRef.current.select(-1);
      }
      if (categoryDataId == 9) {
        this.currencyTypeRef.current.select(
          this.state.cvCurrencyTypeArray.filter(
            (value) => value.DisplayText == defaultCurrencyIdValue
          )[0].DisplayText
        );
        this.expenseTypeRef.current.select(-1);
      }
      if (categoryDataId == 8) {
        if (
          this.state.expenseTypeIdValue == 1 ||
          this.state.expenseTypeIdValue == 3 ||
          this.state.expenseTypeIdValue == 6 ||
          this.state.expenseTypeIdValue == ''
        ) {
          this.modeOfConveyanceRef.current.select(-1);
        }
        if (myEmpData.TravelLocationFlag == 'YES') {
          this.locationRef.current.select(-1);
        }
        if (myEmpData.CO_CODE == 'N054') {
          if (
            this.state.expenseTypeIdValue != 2 &&
            this.state.expenseTypeIdValue != 4 &&
            this.state.expenseTypeIdValue != 5 &&
            this.state.expenseTypeIdValue != 7
          ) {
            this.currencyTypeRef.current.select(
              this.state.cvCurrencyTypeArray.filter(
                (value) => value.DisplayText == defaultCurrencyIdValue
              )[0].DisplayText
            );
          }
        } else {
          this.currencyTypeRef.current.select(
            this.state.cvCurrencyTypeArray.filter(
              (value) => value.DisplayText == defaultCurrencyIdValue
            )[0].DisplayText
          );
        }
        this.expenseTypeRef.current.select(-1);
      }
      if (
        categoryDataId == 2 ||
        ((categoryDataId == 8 || categoryDataId == 9 || categoryDataId == 10) &&
          myEmpData.ProjectCodeFlag != 'YES')
      ) {
        console.log('reset state after edit', myEmpData);
        isLineItemCostProject = false;
      }
      if (isLineItemCostProject) {
        if (myEmpData) {
          this.setState({
            costCenterValue:
              myEmpData.CC_CODE != ''
                ? myEmpData.CC_CODE.concat('~').concat(myEmpData.CC_TXT)
                : '',
            projectSearchValue:
              myEmpData.PROJ_CODE != ''
                ? myEmpData.PROJ_CODE.concat('~').concat(myEmpData.PROJ_TXT)
                : '',
            costCenterID: '',
          });
        }
      }
      this.setState({
        isLineItemEditing: false,
        lineItemIdValue: '',
        particularInput: '',
        cashMemoInput: '',
        numPeople: 0,
        amountInput:
          categoryDataId == 1 && subCategoryData.id == 10
            ? '' + parseInt(myEmpData.CovidClaimBalance - TOTAL_AMOUNT)
            : '',
        costCenterArray: myEmpData.CostCenterCodeSelectList,
        costCenterUserSearchArray: myEmpData.CostCenterCodeSelectList,
        projectArray: myEmpData.ProjectCodeSelectList,
        projectUserSearchArray: myEmpData.ProjectCodeSelectList,
        isProjectAvailable: true,
        remarksInput: '',
        searchProjectDataArray: [],
        autoSearchProjectDataArray: [],
        dateValue: moment().format('DD-MMM-YYYY'),
        destDateValue: moment().format('DD-MMM-YYYY'),
        startTimeValue: moment().format('HHmm'),
        destTimeValue: moment().format('HHmm'),
        fromInput: '',
        toInput: '',
        kmInput: '',
        modeOfConveyanceValue: '',
        modeOfConveyanceIdValue: '',
        modeOfConveyanceRateValue: '',
        roundTripFlagValue: false,
        currencyValue: '',
        modalVisible: false,
        // currencyIdValue: "INR",
        expenseTypeValue: '',
        expenseTypeIdValue: '',
        finalExchAmount: '',
        isExchRateMultiplierEditable: false,
        exchRateMultiplierInput: 1,
        lineItemCurrencyTypeValue: defaultCurrencyIdValue,
        lineItemCurrencyTypeIdValue: defaultCurrencyIdValue,
        travelLocationValue: '',
        travelLocationIdValue: '',
      });
    });
  };

  onParticularChanged = (text) => {
    this.setState({
      particularInput: text,
    });
  };

  // childAmountCal = (intAmount) => {
  //   let maxAmount = 5000
  //   if(maxAmount - intAmount >= 0) {
  //     this.setState({
  //       amountInput: text,
  //     })
  //   } else {

  //   }
  // }

  onExchRateMultiplierChanged = (text) => {
    this.setState(
      {
        exchRateMultiplierInput: text,
      },
      () => {
        let myFixAmountInLocal =
          this.state.amountInput * this.state.exchRateMultiplierInput;
        this.setState({
          finalExchAmount: parseFloat(myFixAmountInLocal.toString()).toFixed(2),
        });
      }
    );
  };

  onAmountChanged = (text) => {
    console.log("amount",text)
    let subCategoryId = '';
    if (isComingFromMyVoucher) {
      subCategoryId =
        this.state.cvEmployeeDataArray.length > 0
          ? this.state.cvEmployeeDataArray[0].VoucherType
          : '';
    } else {
      if (categoryDataId == 1) {
        subCategoryId = subCategoryData.id;
      }
    }

    if (categoryDataId == 1 && subCategoryId == 1) {
      if (
        this.state.cvLineItemDataArray &&
        this.state.cvLineItemDataArray.length > 0
      ) {
        let res = this.state.cvLineItemDataArray
          .filter((record) => {
            if (this.state.isLineItemEditing) {
              return record.RowId != this.state.lineItemIdValue;
            } else {
              return record;
            }
          })
          .reduce((initial, current) => initial + current.Amount, 0);
        console.log('claim balance taken', res);
        if (parseInt(text) > maxClaimableAmount - res) {
          return this.showAlert(
            "You can't claim more than " +
              maxClaimableAmount +
              ' for selected voucher type.'
          );
        }
      }
    }

    if (
      (categoryDataId == 1 && subCategoryId == 9 && parseInt(text) > 5000) ||
      (categoryDataId == 1 &&
        subCategoryId == 1 &&
        parseInt(text) > maxClaimableAmount)
    ) {
      // this.childAmountCal(parseInt(text))
      // let myChildAmountRemain = 5000 - parseInt(text)
      // console.log("myChildAmountRemain",myChildAmountRemain)
    } else {
      this.setState(
        {
          amountInput: text,
        },
        () => {
          if (categoryDataId == 9 || categoryDataId == 8) {
            let myFixAmountInLocal =
              this.state.amountInput * this.state.exchRateMultiplierInput;
            this.setState({
              finalExchAmount: parseFloat(
                myFixAmountInLocal.toString()
              ).toFixed(2),
            });
          }
        }
      );
    }
  };

  onCashMemoChanged = (text) => {
    this.setState({
      cashMemoInput: text,
    });
  };

  onNumberOfPeople = (text) => {
    this.setState({
      numPeople: text,
    });
  };

  onFromLocationChanged = (text) => {
    this.setState({
      fromInput: text,
    });
  };

  onToLocationChanged = (text) => {
    this.setState({
      toInput: text,
    });
  };

  onKMChanged = (text) => {
    this.setState(
      {
        kmInput: text,
      },
      () => {
        console.log(
          'this.state.modeOfConveyanceIdValue',
          this.state.modeOfConveyanceIdValue
        );
        if (
          this.state.modeOfConveyanceRateValue != 0 ||
          this.state.modeOfConveyanceRateValue != 0.0
        ) {
          let myFixAmount =
            parseFloat(this.state.kmInput) *
            this.state.modeOfConveyanceRateValue;
          this.setState({
            amountInput: myFixAmount.toString(),
          });
        }
      }
    );
  };

  onModeOfConveyanceSelection = (i, value) => {
    console.log(this.state.cvEmployeeDataArray[0].ModeOfConveyance[i]);
    let myModeOfConveyanceId = this.state.cvEmployeeDataArray[0]?.ModeOfConveyance[
      i
    ]?.ID?.split('~');
    let myModeOfConveyanceIdValue = myModeOfConveyanceId[0];
    let myModeOfConveyanceRateValue = myModeOfConveyanceId[1];
    this.setState(
      {
        modeOfConveyanceValue: value,
        modeOfConveyanceIdValue: myModeOfConveyanceIdValue,
        modeOfConveyanceRateValue: myModeOfConveyanceRateValue,
      },
      () => {
        if (
          this.state.modeOfConveyanceRateValue != 0 ||
          this.state.modeOfConveyanceRateValue != 0.0
        ) {
          let myFixAmount =
            this.state.kmInput * this.state.modeOfConveyanceRateValue;
          this.setState({
            amountInput: myFixAmount.toString(),
          });
        }
      }
    );
  };

  onTravelModeSelection = (i, value) => {
    let myModeOfConveyanceIdValue = this.state.cvEmployeeDataArray[0]?.ModeOfConveyance[
      i
    ]?.ID?.split('~')[0];
    this.setState({
      modeOfConveyanceValue: value,
      modeOfConveyanceIdValue: myModeOfConveyanceIdValue,
    });
  };

  onTravelLocationSelection = (i, value) => {
    let myTravelLocationId =
      this.state.cvTravelLocationDataArray.length > 0 &&
      this.state.cvTravelLocationDataArray[i].ID;
    this.setState(
      {
        travelLocationValue: value,
        travelLocationIdValue: myTravelLocationId,
      },
      () => {}
    );
  };

  onExpenseTypeSelection = (i, value) => {
    let myExpenseTypeId =
      this.state.cvExpenseTypeArray.length > 0 &&
      this.state.cvExpenseTypeArray[i].ID;
    this.setState(
      {
        expenseTypeValue: value,
        expenseTypeIdValue: myExpenseTypeId,
      },
      () => {
        console.log(
          'this.state.expenseTypeIdValue',
          this.state.expenseTypeIdValue
        );
        if (
          categoryDataId == 8 &&
          (this.state.expenseTypeIdValue != 1 ||
            this.state.expenseTypeIdValue != 3 ||
            this.state.expenseTypeIdValue != 6)
        ) {
          this.setState({
            modeOfConveyanceValue: '',
            modeOfConveyanceIdValue: '',
          });
        }
        if (
          categoryDataId == 8 &&
          this.state.cvEmployeeDataArray[0].CO_CODE == 'N054'
        ) {
          this.calculateAmtWithAllow(
            this.state.expenseTypeIdValue,
            this.state.dateValue,
            this.state.destDateValue
          );
        }
        // if(categoryDataId == 8 && this.state.expenseTypeIdValue == 14) { // need to handle if req
        //   let startDestHourDiff = moment(this.state.destTimeValue, "HHmm").diff(moment(this.state.startTimeValue, "HHmm"), "hours")
        //   console.log("startDestHourDiff",startDestHourDiff)
        // }
        if (
          categoryDataId == 9 &&
          (this.state.expenseTypeIdValue == 8 ||
            this.state.expenseTypeIdValue == 10 ||
            this.state.expenseTypeIdValue == 13)
        ) {
          setTimeout(() => {
            Alert.alert(
              constants.NOTE_TEXT,
              constants.EXPENSE_TYPE_COND_POPUP_MSG,
              [{ text: 'OK', onPress: () => {} }]
            );
          }, 1000);
        }
      }
    );
  };

  onCurrencyTypeSelection = (i, value) => {
    let myCurrencyTypeId =
      this.state.cvCurrencyTypeArray.length > 0 &&
      this.state.cvCurrencyTypeArray[i].ID;
    if (defaultCurrencyIdValue != myCurrencyTypeId) {
      this.setState({
        isExchRateMultiplierEditable: true,
      });
    } else {
      this.setState({
        isExchRateMultiplierEditable: false,
        exchRateMultiplierInput: 1,
        finalExchAmount: parseFloat(this.state.amountInput).toFixed(2),
      });
    }
    console.log('myCurrencyTypeId', myCurrencyTypeId);
    this.setState({
      lineItemCurrencyTypeValue: value,
      lineItemCurrencyTypeIdValue: myCurrencyTypeId,
    });
  };

  onCurrencySelection = (i, value) => {
    console.log(constants.CURRENCY_TYPES[i].ID);
    let myCurrencyId = constants.CURRENCY_TYPES[i].ID;
    this.setState({
      currencyValue: value,
      currencyIdValue: myCurrencyId,
    });
  };
  showAlert = (msg) => {
    
    if (this.props.cvLoading == false) {
      console.log("this.props.cvLoading",this.props.cvLoading)
      setTimeout(() => {
        alert(msg);
      }, 1000);
    }
  };
  addLineItem = (action) => {
    console.log('Cat Data ID : ', categoryDataId);
    console.log('SUB CAT Data ID : ', subCategoryData?.id);
    console.log('My Emp Data  : ', this.state.cvEmployeeDataArray[0]);
    // Add amount check here
    // if (this.state.cvEmployeeDataArray[0]?.Amount < this.state.amountInput){
    //   return alert(constants.INSUFFICIENT_AMOUNT);
    // }
    {if (
      categoryDataId == 1 &&
      this.state.cvEmployeeDataArray[0]?.VoucherType == '7' &&
      this.state.cvEmployeeDataArray[0]?.IsDataCardEntitlement == 'YES'
    ) {
      return alert(constants.NOT_ELIGIBLE_CLAIM_DATA_CARD);
    }}
    if (subCategoryData?.id == 8 && this.state.cvLineItemDataArray.length > 0) {
      return alert('You can add only one voucher for Wedding.');
    }
    if (subCategoryData?.id == 9 && this.state.cvLineItemDataArray.length > 0) {
      return alert('You can add only one voucher for Children.');
    }
    let childBirthClaimDuration,
      childBirthdayClaimDuration,
      empWedDateDiff,
      projectValue,
      costCenterValue,
      myEmpData = this.state.cvEmployeeDataArray;
    if (categoryDataId == 1) {
      let docNumber,
        categoryId,
        subCategoryId,
        childName = '',
        childDobOriginal = '',
        claimForId = '',
        investmentPlanId = '',
        firstClaimTill = '',
        secondClaimTill = '',
        weddingDate = '';
      let myParticularInput = this.state.particularInput.trim();
      let myCashMemoInput = this.state.cashMemoInput.trim();
      let myAmountInput = this.state.amountInput.trim();
      let myProjectSearchValue = this.state.projectSearchValue.trim();
      let empDOJDiff = moment(myEmpData[0].DOJ, 'YYYYMMDD').diff(
        moment(this.state.dateValue, 'DD-MMM-YYYY'),
        'days'
      );
      let isCashMemoNoPresent = false;
      let serverValidationApiCall = false;
      let CashMemoRecord = this.state.cvLineItemDataArray.map((item) => {
        if (
          item.MemoNo.localeCompare(this.state.cashMemoInput) == 0 &&
          item.RowId != this.state.lineItemIdValue
        ) {
          isCashMemoNoPresent = true;
        }
        return item.MemoNo;
      });
      if (!isComingFromMyVoucher) {
        if (
          subCategoryData.id == 7 ||
          subCategoryData.id == 8 ||
          subCategoryData.id == 9 ||
          subCategoryData.id == 13
        ) {
          serverValidationApiCall = true;
        }
        if (
          subCategoryData.id == 9 &&
          subCategoryData.firstClaimTill != '' &&
          subCategoryData.claimForId == 1
        ) {
          childBirthClaimDuration = moment(
            subCategoryData.firstClaimTill,
            'YYYYMMDD'
          ).diff(moment(this.state.dateValue, 'DD-MMM-YYYY'), 'days');
        }
        if (
          subCategoryData.id == 9 &&
          subCategoryData.secondClaimTill != '' &&
          subCategoryData.claimForId == 2
        ) {
          childBirthdayClaimDuration = moment(
            subCategoryData.secondClaimTill,
            'YYYYMMDD'
          ).diff(moment(this.state.dateValue, 'DD-MMM-YYYY'), 'days');
        }
        if (subCategoryData.id == 8) {
          empWedDateDiff = moment(
            subCategoryData.weddingDate,
            'DD-MMM-YYYY'
          ).diff(moment(this.state.dateValue, 'DD-MMM-YYYY'), 'days');
        }

        docNumber =
          this.state.cvSaveAndSubmitDataArray[0] &&
          this.state.cvSaveAndSubmitDataArray[0] != undefined
            ? this.state.cvSaveAndSubmitDataArray[0].DocumentNo
            : '';
        categoryId = categoryDataId;
        subCategoryId = subCategoryData.id;
        childName = subCategoryData.childName;
        childDobOriginal = subCategoryData.childDobOriginal;
        claimForId = subCategoryData.claimForId;
        investmentPlanId = subCategoryData.investmentPlanId;
        firstClaimTill = subCategoryData.firstClaimTill;
        secondClaimTill = subCategoryData.secondClaimTill;
        weddingDate = subCategoryData.weddingDate;
      } else {
        docNumber = docDetails.DocNo;
        categoryId = myEmpData[0].Category;
        subCategoryId = myEmpData[0].VoucherType;
        if (
          this.state.cvLineItemDataArray &&
          this.state.cvLineItemDataArray.length > 0
        ) {
          let lineItemFirstRecord = this.state.cvLineItemDataArray[0];
          if (subCategoryId == 7 || subCategoryId == 8 || subCategoryId == 9 || subCategoryId == 13) {
            serverValidationApiCall = true;
          }
          if (
            subCategoryId == 9 &&
            lineItemFirstRecord.FirstClaimTill != '' &&
            lineItemFirstRecord.ClaimFor == 1
          ) {
            childBirthClaimDuration = moment(
              lineItemFirstRecord.FirstClaimTill,
              'YYYYMMDD'
            ).diff(moment(this.state.dateValue, 'DD-MMM-YYYY'), 'days');
          }
          if (
            subCategoryId == 9 &&
            lineItemFirstRecord.SecondClaimTill != '' &&
            lineItemFirstRecord.ClaimFor == 2
          ) {
            childBirthdayClaimDuration = moment(
              lineItemFirstRecord.SecondClaimTill,
              'YYYYMMDD'
            ).diff(moment(this.state.dateValue, 'DD-MMM-YYYY'), 'days');
          }
          if (subCategoryId == 8) {
            empWedDateDiff = moment(
              lineItemFirstRecord.WeddingDate,
              'DD-MMM-YYYY'
            ).diff(moment(this.state.dateValue, 'DD-MMM-YYYY'), 'days');
          }
          childName = lineItemFirstRecord.ChildName;
          childDobOriginal = lineItemFirstRecord.Childbdate;
          claimForId = lineItemFirstRecord.ClaimFor;
          investmentPlanId = lineItemFirstRecord.InvestmentPlan;
          firstClaimTill = lineItemFirstRecord.FirstClaimTill;
          secondClaimTill = lineItemFirstRecord.SecondClaimTill;
          weddingDate = lineItemFirstRecord.WeddingDate;
          console.log('mohit000000', this.state.cvLineItemDataArray);
        }
      }
      console.log('CashMemoRecord', CashMemoRecord);
      console.log('empWedDateDiff', empWedDateDiff);
      console.log('myProjectSearchValue', myProjectSearchValue);
      if (myProjectSearchValue === '') {
        return this.showAlert(constants.PROJECT_ERR_MSG);
      } else if (myParticularInput === '') {
        return this.showAlert(constants.PARTICULAR_ERR_MSG);
      } else if (myCashMemoInput === '') {
        return this.showAlert(constants.CASH_MEMO_ERR_MSG);
      } else if (myAmountInput === '' || myAmountInput <= 0) {
        return this.showAlert(constants.AMOUNT_BILL_ERR_MSG);
      } else if (this.state.numPeople == 0 && subCategoryId == 14) {
        return this.showAlert(constants.PEOPLE_ERROR_MSG);
      } else if (empDOJDiff > 0) {
        return this.showAlert(constants.DOJ_ERR_MSG);
      } else if (
        this.state.cvLineItemDataArray &&
        this.state.cvLineItemDataArray.length > 0 &&
        isCashMemoNoPresent
      ) {
        return this.showAlert(constants.DUPLICATE_CASH_MEMO_ERR_MSG);
      } else if (childBirthClaimDuration <= 0) {
        return this.showAlert(constants.CHILD_BIRTH_ERR_MSG);
      } else if (childBirthdayClaimDuration <= 0) {
        return this.showAlert(constants.CHILD_BIRTHDAY_ERR_MSG);
      } else if (empWedDateDiff >= 0) {
        return this.showAlert(constants.WED_DATE_ERR_MSG);
        //"you cannot claim for wedding allowance as your wedding date" + empWeddingDateValue + "has passed."  ==> cover up in financial year calender freezing
      } else {
        if (serverValidationApiCall) {
          this.props
            .validateCVDetails(
              myEmpData[0],
              docNumber,
              'CSH',
              this.state.cashMemoInput,
              this.state.dateValue,
              this.state.projectSearchValue,
              this.state.costCenterValue,
              categoryId,
              subCategoryId,
              this.state.lineItemIdValue,
              weddingDate,
              childName,
              claimForId
            )
            .then(() => {
              if (this.props.cvValidationData[0].MsgTxt != '') {
                console.log('111111111');
                this.showAlert(this.props.cvValidationData[0].MsgTxt);
              } else {
                this.props.saveAndSubmitCVDetails(
                  myEmpData[0],
                  docNumber,
                  'CSH',
                  this.state.particularInput,
                  this.state.cashMemoInput,
                  this.state.dateValue,
                  '',
                  this.state.currencyIdValue,
                  this.state.amountInput,
                  this.state.amountInput,
                  this.state.amountInput,
                  1,
                  categoryId,
                  subCategoryId,
                  childName,
                  childDobOriginal,
                  claimForId,
                  investmentPlanId,
                  firstClaimTill,
                  secondClaimTill,
                  weddingDate,
                  '',
                  0,
                  0,
                  '',
                  this.props.loginData.SmCode,
                  this.state.lineItemIdValue,
                  this.state.projectSearchValue,
                  this.state.costCenterValue,
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  this.getLineItemDataCallBack,
                  this.state.numPeople
                );
              }
            });
        } else {
          this.props.saveAndSubmitCVDetails(
            myEmpData[0],
            docNumber,
            'CSH',
            this.state.particularInput,
            this.state.cashMemoInput,
            this.state.dateValue,
            '',
            this.state.currencyIdValue,
            this.state.amountInput,
            this.state.amountInput,
            this.state.amountInput,
            1,
            categoryId,
            subCategoryId,
            childName,
            childDobOriginal,
            claimForId,
            investmentPlanId,
            firstClaimTill,
            secondClaimTill,
            weddingDate,
            '',
            0,
            0,
            '',
            this.props.loginData.SmCode,
            this.state.lineItemIdValue,
            this.state.projectSearchValue,
            this.state.costCenterValue,
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            this.getLineItemDataCallBack,
            this.state.numPeople
          );
        }
      }
    } else if (categoryDataId == 2) {
      let myParticularInput = this.state.particularInput.trim();
      let myFromInput = this.state.fromInput.trim();
      let myToInput = this.state.toInput.trim();
      let myAmountInput = this.state.amountInput.trim();
      let myKMInput = this.state.kmInput.trim();
      let empDOJDiff = moment(myEmpData[0].DOJ, 'YYYYMMDD').diff(
        moment(this.state.dateValue, 'DD-MMM-YYYY'),
        'days'
      );
      let myProjectSearchValue = this.state.projectSearchValue.trim();
      if (myProjectSearchValue === '') {
        return this.showAlert(constants.PROJECT_ERR_MSG);
      } else if (myFromInput === '') {
        return this.showAlert(constants.FROM_ERR_MSG);
      } else if (myToInput === '') {
        return this.showAlert(constants.TO_ERR_MSG);
      } else if (myParticularInput === '') {
        return this.showAlert(constants.PARTICULAR_ERR_MSG);
      } else if (this.state.modeOfConveyanceValue === '') {
        return this.showAlert(constants.MODE_OF_CONVEY_ERR_MSG);
      } else if (
        (this.state.modeOfConveyanceRateValue != 0 ||
          this.state.modeOfConveyanceRateValue != 0.0) &&
        (myKMInput === '' || myKMInput <= 0)
      ) {
        return this.showAlert(constants.KM_ERR_MSG);
      } else if (
        myEmpData[0].CO_CODE == 'N009' &&
        this.state.currencyValue === ''
      ) {
        return this.showAlert(constants.CURRENCY_ERR_MSG);
      } else if (myAmountInput === '' || myAmountInput <= 0) {
        return this.showAlert(constants.AMOUNT_BILL_ERR_MSG);
      } else if (empDOJDiff > 0) {
        return this.showAlert(constants.DOJ_ERR_MSG);
      } else {
        let docNumber,
          categoryId,
          subCategoryId = '',
          childName = '',
          childDobOriginal = '',
          claimForId = '',
          investmentPlanId = '',
          firstClaimTill = '',
          secondClaimTill = '',
          weddingDate = '';
        if (isComingFromMyVoucher) {
          docNumber = docDetails.DocNo;
          categoryId = myEmpData[0].Category;
        } else {
          docNumber =
            this.state.cvSaveAndSubmitDataArray[0] &&
            this.state.cvSaveAndSubmitDataArray[0] != undefined
              ? this.state.cvSaveAndSubmitDataArray[0].DocumentNo
              : '';
          categoryId = categoryDataId;
          // projectValue = prevScreenProjectValue  // == 9
          // costCenterValue = prevScreenCostCenterValue
        }
        projectValue = this.state.projectSearchValue;
        costCenterValue = this.state.costCenterValue;
        this.props.saveAndSubmitCVDetails(
          myEmpData[0],
          docNumber,
          'LCV',
          this.state.particularInput,
          this.state.cashMemoInput,
          this.state.dateValue,
          '',
          this.state.currencyIdValue,
          this.state.amountInput,
          this.state.amountInput,
          this.state.amountInput,
          1,
          categoryId,
          subCategoryId,
          childName,
          childDobOriginal,
          claimForId,
          investmentPlanId,
          firstClaimTill,
          secondClaimTill,
          weddingDate,
          '',
          0,
          0,
          '',
          this.props.loginData.SmCode,
          this.state.lineItemIdValue,
          projectValue,
          costCenterValue,
          this.state.fromInput,
          this.state.toInput,
          this.state.modeOfConveyanceIdValue,
          this.state.kmInput,
          this.state.roundTripFlagValue ? 'Y' : 'N',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          this.getLineItemDataCallBack,
          this.state.numPeople
        );
      }
    } else if (categoryDataId == 9) {
      let myParticularInput = this.state.particularInput.trim();
      let myAmountInput = this.state.amountInput.trim();
      let myExchRateMultiplierInput = this.state.exchRateMultiplierInput;
      let myProjectSearchValue = this.state.projectSearchValue.trim();
      let empDOJDiff = moment(myEmpData[0].DOJ, 'YYYYMMDD').diff(
        moment(this.state.dateValue, 'DD-MMM-YYYY'),
        'days'
      );

      if (myProjectSearchValue === '') {
        return this.showAlert(constants.PROJECT_ERR_MSG);
      } else if (this.state.expenseTypeValue === '') {
        return this.showAlert(constants.EXPENSE_TYPE_ERR_MSG);
      } else if (myParticularInput === '') {
        return this.showAlert(constants.PARTICULAR_ERR_MSG);
      } else if (myAmountInput === '' || myAmountInput <= 0) {
        return this.showAlert(constants.AMOUNT_ERR_MSG);
      } else if (
        myExchRateMultiplierInput === '' ||
        myExchRateMultiplierInput <= 0
      ) {
        return this.showAlert(constants.EXCH_RATE_ERR_MSG);
      } else if (empDOJDiff > 0) {
        return this.showAlert(constants.DOJ_ERR_MSG);
      } else {
        let docNumber,
          categoryId,
          subCategoryId = '',
          childName = '',
          childDobOriginal = '',
          claimForId = '',
          investmentPlanId = '',
          firstClaimTill = '',
          secondClaimTill = '',
          weddingDate = '',
          lineItemProjectCode = '',
          lineItemCostCenterCode = '';
        if (isComingFromMyVoucher) {
          docNumber = docDetails.DocNo;
          categoryId = myEmpData[0].Category;
          // projectValue = myEmpData[0].PROJ_CODE.trim() + "~" + myEmpData[0].PROJ_TXT.trim()
          // costCenterValue = myEmpData[0].CC_CODE.trim() + "~" + myEmpData[0].CC_TXT.trim()
        } else {
          docNumber =
            this.state.cvSaveAndSubmitDataArray[0] &&
            this.state.cvSaveAndSubmitDataArray[0] != undefined
              ? this.state.cvSaveAndSubmitDataArray[0].DocumentNo
              : '';
          categoryId = categoryDataId;
        }
        projectValue = this.state.projectSearchValue;
        costCenterValue = this.state.costCenterValue;

        if (myEmpData[0].ProjectCodeFlag == 'YES') {
          lineItemProjectCode = this.state.projectSearchValue?.split('~')[0];
          lineItemCostCenterCode = this.state.costCenterValue?.split('~')[0];
          projectValue = '';
          costCenterValue = this.state.costCenterValue;
        }
        this.props.saveAndSubmitCVDetails(
          myEmpData[0],
          docNumber,
          'EXP',
          this.state.particularInput,
          '',
          this.state.dateValue,
          '',
          this.state.currencyIdValue,
          this.state.amountInput,
          this.state.finalExchAmount,
          '',
          1,
          categoryId,
          subCategoryId,
          childName,
          childDobOriginal,
          claimForId,
          investmentPlanId,
          firstClaimTill,
          secondClaimTill,
          weddingDate,
          '',
          0,
          0,
          '',
          this.props.loginData.SmCode,
          this.state.lineItemIdValue,
          projectValue,
          costCenterValue,
          '',
          '',
          '',
          this.state.exchRateMultiplierInput,
          this.state.roundTripFlagValue ? 'Y' : 'N',
          this.state.corpCreditCardFlagValue ? 'Y' : 'N',
          this.state.expenseTypeIdValue,
          this.state.lineItemCurrencyTypeIdValue == ''
            ? myEmpData[0].CURRENCY
            : this.state.lineItemCurrencyTypeIdValue,
          lineItemProjectCode,
          lineItemCostCenterCode,
          '',
          '',
          '',
          this.getLineItemDataCallBack,
          this.state.numPeople
        );
      }
    } else if (categoryDataId == 8) {
      let myFromInput = this.state.fromInput.trim();
      let myToInput = this.state.toInput.trim();
      let myParticularInput = this.state.particularInput.trim();
      let myAmountInput = this.state.amountInput.trim();
      let myExchRateMultiplierInput = this.state.exchRateMultiplierInput;
      let myProjectSearchValue = this.state.projectSearchValue.trim();
      let empDOJDiff = moment(myEmpData[0].DOJ, 'YYYYMMDD').diff(
        moment(this.state.dateValue, 'DD-MMM-YYYY'),
        'days'
      );
      let startDestDateDiff = moment(this.state.dateValue, 'DD-MMM-YYYY').diff(
        moment(this.state.destDateValue, 'DD-MMM-YYYY'),
        'days'
      );
      let startDestTimeDiff = moment(this.state.destTimeValue, 'HHmm').diff(
        moment(this.state.startTimeValue, 'HHmm'),
        'minutes'
      );
      console.log('startDestTimeDiff', startDestTimeDiff);
      if (myProjectSearchValue === '') {
        return this.showAlert(constants.PROJECT_ERR_MSG);
      } else if (this.state.expenseTypeValue === '') {
        return this.showAlert(constants.EXPENSE_TYPE_ERR_MSG);
      } else if (myFromInput === '') {
        return this.showAlert(constants.START_PLACE_ERR_MSG);
      } else if (myToInput === '') {
        return this.showAlert(constants.DESTINATION_ERR_MSG);
      } else if (startDestDateDiff > 0) {
        return this.showAlert(constants.DEST_DATE_ERR_MSG);
      } else if (
        startDestDateDiff == 0 &&
        this.state.cvEmployeeDataArray[0].TravelTimeFlag == 'YES' &&
        startDestTimeDiff <= 0
      ) {
        return this.showAlert(constants.DEST_TIME_ERR_MSG);
      } else if (myParticularInput === '') {
        return this.showAlert(constants.PARTICULAR_ERR_MSG);
      } else if (
        this.state.modeOfConveyanceValue === '' &&
        (this.state.expenseTypeIdValue == 1 ||
          this.state.expenseTypeIdValue == 3 ||
          this.state.expenseTypeIdValue == 6 ||
          this.state.expenseTypeIdValue == '')
      ) {
        return this.showAlert(constants.MODE_OF_CONVEY_ERR_MSG);
      } else if (
        this.state.travelLocationValue === '' &&
        myEmpData[0].TravelLocationFlag == 'YES'
      ) {
        return this.showAlert(constants.LOCATION_ERR_MSG);
      } else if (myAmountInput === '' || myAmountInput <= 0) {
        return this.showAlert(constants.AMOUNT_ERR_MSG);
      } else if (
        myExchRateMultiplierInput === '' ||
        myExchRateMultiplierInput <= 0
      ) {
        return this.showAlert(constants.EXCH_RATE_ERR_MSG);
      } else if (empDOJDiff > 0) {
        return this.showAlert(constants.DOJ_ERR_MSG);
      } else {
        let docNumber,
          categoryId,
          subCategoryId = '',
          childName = '',
          childDobOriginal = '',
          claimForId = '',
          investmentPlanId = '',
          firstClaimTill = '',
          secondClaimTill = '',
          weddingDate = '',
          lineItemProjectCode = '',
          lineItemCostCenterCode = '';
        if (isComingFromMyVoucher) {
          docNumber = docDetails.DocNo;
          categoryId = myEmpData[0].Category;
          // projectValue = myEmpData[0].PROJ_CODE.trim() + "~" + myEmpData[0].PROJ_TXT.trim()
          // costCenterValue = myEmpData[0].CC_CODE.trim() + "~" + myEmpData[0].CC_TXT.trim()
        } else {
          docNumber =
            this.state.cvSaveAndSubmitDataArray[0] &&
            this.state.cvSaveAndSubmitDataArray[0] != undefined
              ? this.state.cvSaveAndSubmitDataArray[0].DocumentNo
              : '';
          categoryId = categoryDataId;
        }
        projectValue = this.state.projectSearchValue; // == 9
        costCenterValue = this.state.costCenterValue;

        if (myEmpData[0].ProjectCodeFlag == 'YES') {
          lineItemProjectCode = this.state.projectSearchValue?.split('~')[0];
          lineItemCostCenterCode = this.state.costCenterValue?.split('~')[0];
          projectValue = '';
          costCenterValue = this.state.costCenterValue;
        }
        this.props.saveAndSubmitCVDetails(
          myEmpData[0],
          docNumber,
          'CNV',
          this.state.particularInput,
          '',
          this.state.dateValue,
          this.state.destDateValue,
          this.state.currencyIdValue,
          this.state.amountInput,
          this.state.finalExchAmount,
          '',
          1,
          categoryId,
          subCategoryId,
          childName,
          childDobOriginal,
          claimForId,
          investmentPlanId,
          firstClaimTill,
          secondClaimTill,
          weddingDate,
          '',
          0,
          0,
          '',
          this.props.loginData.SmCode,
          this.state.lineItemIdValue,
          projectValue,
          costCenterValue,
          this.state.fromInput,
          this.state.toInput,
          this.state.modeOfConveyanceIdValue,
          this.state.exchRateMultiplierInput,
          this.state.roundTripFlagValue ? 'Y' : 'N',
          this.state.corpCreditCardFlagValue ? 'Y' : 'N',
          this.state.expenseTypeIdValue,
          this.state.lineItemCurrencyTypeIdValue == ''
            ? myEmpData[0].CURRENCY
            : this.state.lineItemCurrencyTypeIdValue,
          lineItemProjectCode,
          lineItemCostCenterCode,
          myEmpData[0].TravelTimeFlag == 'YES' ? this.state.startTimeValue : '',
          myEmpData[0].TravelTimeFlag == 'YES' ? this.state.destTimeValue : '',
          this.state.travelLocationIdValue,
          this.getLineItemDataCallBack,
          this.state.numPeople
        );
      }
    } else if (categoryDataId == 10) {
      let myFromInput = this.state.fromInput.trim();
      let myToInput = this.state.toInput.trim();
      let myParticularInput = this.state.particularInput.trim();
      let myKMInput = this.state.kmInput.trim();
      let myAmountInput = this.state.amountInput.trim();
      let myProjectSearchValue = this.state.projectSearchValue.trim();
      let empDOJDiff = moment(myEmpData[0].DOJ, 'YYYYMMDD').diff(
        moment(this.state.dateValue, 'DD-MMM-YYYY'),
        'days'
      );

      if (myProjectSearchValue === '') {
        return this.showAlert(constants.PROJECT_ERR_MSG);
      } else if (myFromInput === '') {
        return this.showAlert(constants.FROM_ERR_MSG);
      } else if (myToInput === '') {
        return this.showAlert(constants.TO_ERR_MSG);
      } else if (myParticularInput === '') {
        return this.showAlert(constants.PERSON_VISIT_PURPOSE_ERR_MSG);
      } else if (myKMInput === '' || myKMInput <= 0) {
        return this.showAlert(
          myEmpData[0].UKMileageKMFlag != 'YES'
            ? constants.MILES_ERR_MSG
            : constants.KM_ERR_MSG
        );
      } else if (
        myEmpData[0].UKMileageAmountFlag == 'YES' &&
        (myAmountInput === '' || myAmountInput <= 0)
      ) {
        return this.showAlert(constants.AMOUNT_ERR_MSG);
      } else if (empDOJDiff > 0) {
        return this.showAlert(constants.DOJ_ERR_MSG);
      } else {
        let docNumber,
          categoryId,
          subCategoryId = '',
          childName = '',
          childDobOriginal = '',
          claimForId = '',
          investmentPlanId = '',
          firstClaimTill = '',
          secondClaimTill = '',
          weddingDate = '',
          lineItemProjectCode = '',
          lineItemCostCenterCode = '';
        if (isComingFromMyVoucher) {
          docNumber = docDetails.DocNo;
          categoryId = myEmpData[0].Category;
          // projectValue = myEmpData[0].PROJ_CODE.trim() + "~" + myEmpData[0].PROJ_TXT.trim()
          // costCenterValue = myEmpData[0].CC_CODE.trim() + "~" + myEmpData[0].CC_TXT.trim()
        } else {
          docNumber =
            this.state.cvSaveAndSubmitDataArray[0] &&
            this.state.cvSaveAndSubmitDataArray[0] != undefined
              ? this.state.cvSaveAndSubmitDataArray[0].DocumentNo
              : '';
          categoryId = categoryDataId;
        }
        projectValue = this.state.projectSearchValue; // == 9
        costCenterValue = this.state.costCenterValue;

        if (myEmpData[0].ProjectCodeFlag == 'YES') {
          lineItemProjectCode = this.state.projectSearchValue?.split('~')[0];
          lineItemCostCenterCode = this.state.costCenterValue?.split('~')[0];
          projectValue = '';
        }
        this.props.saveAndSubmitCVDetails(
          myEmpData[0],
          docNumber,
          'MLG',
          this.state.particularInput,
          '',
          this.state.dateValue,
          '',
          this.state.currencyIdValue,
          this.state.amountInput,
          '',
          '',
          1,
          categoryId,
          subCategoryId,
          childName,
          childDobOriginal,
          claimForId,
          investmentPlanId,
          firstClaimTill,
          secondClaimTill,
          weddingDate,
          '',
          0,
          0,
          '',
          this.props.loginData.SmCode,
          this.state.lineItemIdValue,
          projectValue,
          costCenterValue,
          this.state.fromInput,
          this.state.toInput,
          '',
          this.state.kmInput,
          this.state.roundTripFlagValue ? 'Y' : 'N',
          this.state.corpCreditCardFlagValue ? 'Y' : 'N',
          this.state.expenseTypeIdValue,
          this.state.lineItemCurrencyTypeIdValue == ''
            ? myEmpData[0].CURRENCY
            : this.state.lineItemCurrencyTypeIdValue,
          lineItemProjectCode,
          lineItemCostCenterCode,
          '',
          '',
          '',
          this.getLineItemDataCallBack,
          this.state.numPeople
        );
      }
    }
  };

  showDateCalendar = () => {
    this.setState({
      isDateCalendarVisible: true,
    });
  };
  hideDateCalendar = () => {
    this.setState({
      isDateCalendarVisible: false,
    });
  };

  showDestDateCalendar = () => {
    this.setState({
      isDestDateCalendarVisible: true,
    });
  };
  hideDestDateCalendar = () => {
    this.setState({
      isDestDateCalendarVisible: false,
    });
  };

  showTimeCalendar = () => {
    this.setState({
      isTimeCalendarVisible: true,
    });
  };
  hideTimeCalendar = () => {
    this.setState({
      isTimeCalendarVisible: false,
    });
  };

  showDestTimeCalendar = () => {
    this.setState({
      isDestTimeCalendarVisible: true,
    });
  };
  hideDestTimeCalendar = () => {
    this.setState({
      isDestTimeCalendarVisible: false,
    });
  };

  calculateAmtForExp14 = (startDt, startTime, destDt, destTime) => {
    let myDate1 = moment(this.state.dateValue)
      .add(this.state.startTimeValue)
      .format('DD-MMM-YYYY HHmm');
    let myDate2 = moment(this.state.destDateValue)
      .add(this.state.destTimeValue)
      .format('DD-MMM-YYYY HHmm');
    let isStartTimeEarly = moment(myDate1, 'DD-MMM-YYYY HHmm').isBefore(
      moment(myDate2, 'DD-MMM-YYYY HHmm'),
      'h'
    );
    if (isStartTimeEarly) {
      let apiFormatStartDt = moment(startDt).format('YYYY/MM/DD');
      let apiFormatDestDt = moment(destDt).format('YYYY/MM/DD');
      let startHr = moment(startTime, 'HHmm').hours();
      let destHr = moment(destTime, 'HHmm').hours();
      let finalAmt = '';
      this.props
        .fetchCVTravelAmount(apiFormatStartDt, startHr, apiFormatDestDt, destHr)
        .then(() => {
          finalAmt = this.props.cvTravelAmountData[0].Amount;
          this.setState({
            amountInput: finalAmt.toString(),
            finalExchAmount: finalAmt.toString(),
          });
        });
    } else {
      return this.showAlert(constants.DEST_DATE_TIME_ERR_MSG);
    }
  };

  calculateAmtWithAllow = (expenseType, startDate, destDate) => {
    let startDestDateDuration =
      moment(destDate, 'DD-MMM-YYYY').diff(
        moment(startDate, 'DD-MMM-YYYY'),
        'days'
      ) + 1;
    let finalAmt = '';
    console.log('startDestDateDuration', startDestDateDuration);
    if (expenseType == 2) {
      finalAmt =
        this.state.cvEmployeeDataArray[0].AllowanceAmount1 *
        startDestDateDuration;
    } else if (expenseType == 4) {
      finalAmt =
        this.state.cvEmployeeDataArray[0].AllowanceAmount2 *
        startDestDateDuration;
    } else if (expenseType == 5) {
      finalAmt =
        this.state.cvEmployeeDataArray[0].AllowanceAmount3 *
        startDestDateDuration;
    }
    if (expenseType == 7) {
      finalAmt =
        this.state.cvEmployeeDataArray[0].AllowanceAmount4 *
        startDestDateDuration;
    }

    if (finalAmt != '' && finalAmt != undefined) {
      this.setState({
        isAmountEditable: false,
        lineItemCurrencyTypeValue: defaultCurrencyIdValue,
        lineItemCurrencyTypeIdValue: defaultCurrencyIdValue,
        isExchRateMultiplierEditable: false,
        exchRateMultiplierInput: 1,
        amountInput: finalAmt.toString(),
        finalExchAmount: finalAmt.toString(),
      });
    } else {
      this.setState({
        isAmountEditable: true,
        amountInput: '',
        finalExchAmount: '',
      });
    }
  };

  dateConfirm = (date) => {
    this.hideDateCalendar();
    let dateSelected = moment(date, 'DD-MMM-YYYY').format('DD-MMM-YYYY');
    console.log('my date : ', dateSelected);
    console.log('Date : ', date);
    this.setState(
      {
        dateValue: dateSelected,
      },
      () => {
        if (
          categoryDataId == 8 &&
          this.state.cvEmployeeDataArray[0].CO_CODE == 'N054'
        ) {
          this.calculateAmtWithAllow(
            this.state.expenseTypeIdValue,
            this.state.dateValue,
            this.state.destDateValue
          );
        }
        if (categoryDataId == 8 && this.state.expenseTypeIdValue == 14) {
          this.calculateAmtForExp14(
            this.state.dateValue,
            this.state.startTimeValue,
            this.state.destDateValue,
            this.state.destTimeValue
          );
        }
      }
    );
  };

  destDateConfirm = (date) => {
    this.hideDestDateCalendar();
    let dateSelected = moment(date, 'DD-MMM-YYYY').format('DD-MMM-YYYY');
    console.log('my dest date : ', dateSelected);
    console.log('Date : ', date);
    this.setState(
      {
        destDateValue: dateSelected,
      },
      () => {
        if (
          categoryDataId == 8 &&
          this.state.cvEmployeeDataArray[0].CO_CODE == 'N054'
        ) {
          this.calculateAmtWithAllow(
            this.state.expenseTypeIdValue,
            this.state.dateValue,
            this.state.destDateValue
          );
        }
        if (categoryDataId == 8 && this.state.expenseTypeIdValue == 14) {
          this.calculateAmtForExp14(
            this.state.dateValue,
            this.state.startTimeValue,
            this.state.destDateValue,
            this.state.destTimeValue
          );
        }
      }
    );
  };

  startTimeConfirm = (date) => {
    this.hideTimeCalendar();
    let timeSelected = moment(date, 'HHmm').format('HHmm');
    console.log('my start time : ', timeSelected);
    console.log('Date : ', date);
    this.setState(
      {
        startTimeValue: timeSelected,
      },
      () => {
        if (categoryDataId == 8 && this.state.expenseTypeIdValue == 14) {
          this.calculateAmtForExp14(
            this.state.dateValue,
            this.state.startTimeValue,
            this.state.destDateValue,
            this.state.destTimeValue
          );
        }
      }
    );
  };

  destTimeConfirm = (date) => {
    this.hideDestTimeCalendar();
    let timeSelected = moment(date, 'HHmm').format('HHmm');
    console.log('my dest time : ', timeSelected);
    console.log('Date : ', date);
    this.setState(
      {
        destTimeValue: timeSelected,
      },
      () => {
        if (categoryDataId == 8 && this.state.expenseTypeIdValue == 14) {
          this.calculateAmtForExp14(
            this.state.dateValue,
            this.state.startTimeValue,
            this.state.destDateValue,
            this.state.destTimeValue
          );
          // let myDate1 = moment(this.state.dateValue).add(this.state.startTimeValue).format("DD-MMM-YYYY HHmm")
          // let myDate2 = moment(this.state.destDateValue).add(this.state.destTimeValue).format("DD-MMM-YYYY HHmm")
          // let result = moment.duration(moment(myDate1, "DD-MMM-YYYY HHmm").diff(moment(myDate2, "DD-MMM-YYYY HHmm")))
          // moment().startOf('day')
          //     console.log("result",result);
          // console.log("myDate1",myDate1.toString())
          // console.log("myDate2",myDate2.toString())
          // let isStartTimeEarly = moment(myDate1, "DD-MMM-YYYY HHmm").isBefore(moment(myDate2, "DD-MMM-YYYY HHmm"), 'h')
          // console.log("isStartTimeEarly",isStartTimeEarly)
          // let result = 0
          //   if(isStartTimeEarly) {
          //     result = moment.duration(moment(myDate2, "DD-MMM-YYYY HHmm").diff(moment(myDate1, "DD-MMM-YYYY HHmm"))).asHours()
          //     console.log("result",result);
          //     console.log("result",Math.floor(result));
          //   } else {
          //     let myDate2Start = moment(myDate2).startOf('day').format("DD-MMM-YYYY HHmm")
          //     console.log("myDate2Start",myDate2Start)
          //     result = moment.duration(moment(myDate2, "DD-MMM-YYYY HHmm").diff(moment(myDate1, "DD-MMM-YYYY HHmm"))).hours()
          //     console.log("result",Math.floor(result));
          //   }

          // let startDestTimeDiff = moment(this.state.startTimeValue, "HHmm").diff(moment(this.state.destTimeValue, "HHmm"))
          // console.log("ooooooooooooooo",startDestTimeDiff)
          // let x = moment.duration(startDestTimeDiff)
          // console.log("ooooooooooooooo",x)
          // let y = Math.floor(x.asHours())
          // console.log("ooooooooooooooo",y)
        }
      }
    );
  };

  onAutoCompleteProjectChangeText = (text) => {
    if (text.length > 1) {
      console.log('7777777', text);
      this.setState({ projectSearchValue: text }, () => {
        this.props
          .searchCVProject(
            this.state.projectSearchValue,
            this.state.cvEmployeeDataArray[0].CO_CODE
          )
          .then(() => {
            this.setState(
              {
                searchProjectDataArray: this.props.cvSearchProjectData,
                autoSearchProjectDataArray: this.props.cvSearchProjectData.map(
                  (item) => item.Key
                ),
              },
              () => {
                console.log(
                  'searchProjectDataArray',
                  this.state.searchProjectDataArray
                );
                console.log(
                  'autoSearchProjectDataArray',
                  this.state.searchProjectDataArray.map((item) => item.Key)
                );
              }
            );
          });
      });
    } else {
      console.log('88888888', text);
      this.setState({
        projectSearchValue: '',
        costCenterValue: '',
        searchProjectDataArray: [],
        autoSearchProjectDataArray: [],
      });
    }
  };

  renderAutoCompleteProjectResult = (item, i) => {
    console.log('item', item);
    return (
      <View>
        <TouchableOpacity
          onPress={() =>
            this.setState({ projectSearchValue: item }, () => {
              let myCCCode = this.state.searchProjectDataArray
                .filter((data) => data.Key === item)
                .map((data) => data.CCCode.concat('~').concat(data.CCText));
              this.setState({
                costCenterValue: myCCCode[0],
              });
              console.log('myCCCode', myCCCode[0]);
            })
          }
        >
          <Text>{item}</Text>
        </TouchableOpacity>
        <View style={{ height: 1, backgroundColor: 'white' }} />
      </View>
    );
  };

  onAutoCompleteSupervisorChangeText = (text) => {
    let docNumber =
      this.state.cvSaveAndSubmitDataArray[0] &&
      this.state.cvSaveAndSubmitDataArray[0] != undefined
        ? this.state.cvSaveAndSubmitDataArray[0].DocumentNo
        : '';
    if (text.length > 1) {
      console.log('7777777', text);
      this.setState(
        {
          autoCompleteSupervisorHideResult: false,
          supervisorSearchValue: text,
        },
        () => {
          this.props
            .searchCVSupervisor(docNumber, this.state.supervisorSearchValue)
            .then(() => {
              console.log(
                'this.props.cvSearchSupervisorData',
                this.props.cvSearchSupervisorData
              );
              this.setState(
                {
                  // searchProjectDataArray: this.props.cvSearchSupervisorData,
                  autoSearchSupervisorDataArray: this.props.cvSearchSupervisorData.map(
                    (item) => item.Key
                  ),
                },
                () => {
                  // console.log("searchProjectDataArray",this.state.searchProjectDataArray)
                  console.log(
                    'autoSearchSupervisorDataArray',
                    this.props.cvSearchSupervisorData.map((item) => item.Key)
                  );
                }
              );
            });
        }
      );
    } else {
      console.log('88888888', text);
      this.setState({
        supervisorSearchValue: '',
        // searchProjectDataArray: [],
        autoSearchSupervisorDataArray: [],
      });
    }
  };

  renderAutoCompleteSupervisorResult = (item, i) => {
    console.log('item', item);
    return (
      <View>
        <TouchableOpacity
          onPress={() =>
            this.setState({
              autoCompleteSupervisorHideResult: true,
              supervisorSearchValue: item,
            })
          }
        >
          <Text>{item}</Text>
        </TouchableOpacity>
        <View style={{ height: 1, backgroundColor: 'white' }} />
      </View>
    );
  };

  submitAction = () => {
    let attachmentRequired = false;
    let isSubCatEssential = false;
    let isLineItemCostProject = true;
    let docType;
    if (categoryDataId == 1) {
      docType = 'CSH';
    } else if (categoryDataId == 2) {
      docType = 'LCV';
    } else if (categoryDataId == 9) {
      docType = 'EXP';
    } else if (categoryDataId == 8) {
      docType = 'CNV';
    } else if (categoryDataId == 10) {
      docType = 'MLG';
    }

    if (
      categoryDataId == 2 ||
      ((categoryDataId == 8 || categoryDataId == 9 || categoryDataId == 10) &&
        this.state.cvEmployeeDataArray[0].ProjectCodeFlag != 'YES')
    ) {
      isLineItemCostProject = false;
    }

    if (isComingFromMyVoucher) {
      if (categoryDataId == 1) {
        let voucherType =
          this.state.cvEmployeeDataArray.length > 0
            ? this.state.cvEmployeeDataArray[0].VoucherType
            : '';
        if (
          voucherType == 7 ||
          voucherType == 8 ||
          voucherType == 9 ||
          voucherType == 10
        ) {
          isSubCatEssential = true;
        }
      } else if (categoryDataId == 2) {
        let companyCode = this.state.cvEmployeeDataArray[0].CO_CODE;
        if (
          companyCode == 'N008' ||
          companyCode == 'N009' ||
          companyCode == 'N012' ||
          companyCode == 'N076'
        ) {
          isSubCatEssential = true;
        }
      }
    } else {
      if (categoryDataId == 1) {
        let subCategoryId = subCategoryData.id;
        if (
          subCategoryId == 7 ||
          subCategoryId == 8 ||
          subCategoryId == 9 ||
          subCategoryId == 10 ||
          subCategoryId == 14
        ) {
          isSubCatEssential = true;
        }
      } else if (categoryDataId == 2) {
        let companyCode = this.state.cvEmployeeDataArray[0].CO_CODE;
        if (
          companyCode == 'N008' ||
          companyCode == 'N009' ||
          companyCode == 'N012' ||
          companyCode == 'N076'
        ) {
          isSubCatEssential = true;
        }
      }
    }
    this.state.cvLineItemDataArray.map((item, index) => {
      console.log('Item ', item);
      if (item.LstUploadFiles.length < 1) {
        attachmentRequired = true;
      }
    });
    if (attachmentRequired == true) {
      showToast(constants.ATTACHMENT_MANDATORY_ERR_MSG);
      return;
    }
    let myRemarks = this.state.remarksInput.trim();
    let mySupervisorSearchValue = this.state.supervisorSearchValue.trim();
    let myProjectSearchValue = this.state.projectSearchValue.trim();
    if (!isLineItemCostProject && myProjectSearchValue === '') {
      return this.showAlert(constants.PROJECT_ERR_MSG);
    } else if (this.state.submitToValue === '') {
      return this.showAlert(constants.SUBMIT_TO_ERR_MSG);
    } else if (
      this.state.submitToValue === 'Supervisor' &&
      mySupervisorSearchValue === ''
    ) {
      return this.showAlert(constants.SUPERVISOR_MANDATORY_ERR_MSG);
    } else if (myRemarks === '') {
      return this.showAlert(constants.REMARKS_ERR_MSG);
    } else {
      // i
      let docNumber,
        categoryId,
        subCategoryId,
        myStatus,
        myForwardTo,
        myEmpTo,
        childName = '',
        childDobOriginal = '',
        claimForId = '',
        investmentPlanId = '',
        firstClaimTill = '',
        secondClaimTill = '',
        weddingDate = '';
      if (isComingFromMyVoucher) {
        docNumber = docDetails.DocNo;
        categoryId = this.state.cvEmployeeDataArray[0].Category;
        subCategoryId = this.state.cvEmployeeDataArray[0].VoucherType;
        if (
          this.state.cvLineItemDataArray &&
          this.state.cvLineItemDataArray.length > 0
        ) {
          let lineItemFirstRecord = this.state.cvLineItemDataArray[0];
          childName = lineItemFirstRecord.ChildName;
          childDobOriginal = lineItemFirstRecord.Childbdate;
          claimForId = lineItemFirstRecord.ClaimFor;
          investmentPlanId = lineItemFirstRecord.InvestmentPlan;
          firstClaimTill = lineItemFirstRecord.FirstClaimTill;
          secondClaimTill = lineItemFirstRecord.SecondClaimTill;
          weddingDate = lineItemFirstRecord.WeddingDate;
          console.log('mohit000000', this.state.cvLineItemDataArray);
        }
      } else {
        docNumber =
          this.state.cvSaveAndSubmitDataArray[0] &&
          this.state.cvSaveAndSubmitDataArray[0] != undefined
            ? this.state.cvSaveAndSubmitDataArray[0].DocumentNo
            : '';
        categoryId = categoryDataId;
        if (categoryDataId == 1) {
          subCategoryId = subCategoryData.id;
          childName = subCategoryData.childName;
          childDobOriginal = subCategoryData.childDobOriginal;
          claimForId = subCategoryData.claimForId;
          investmentPlanId = subCategoryData.investmentPlanId;
          firstClaimTill = subCategoryData.firstClaimTill;
          secondClaimTill = subCategoryData.secondClaimTill;
          weddingDate = subCategoryData.weddingDate;
        }
      }
      if (this.state.submitToValue === 'Supervisor') {
        myStatus = 2;
        myForwardTo = 'S';
        myEmpTo = this.state.supervisorSearchValue?.split('~')[0];
      } else if(this.state.submitToValue === 'HR'){
        myStatus = 11;
        myForwardTo = 'H';
        myEmpTo = '';
      }
      else {
        myStatus = 3;
        myForwardTo = 'F';
        myEmpTo = '';
      }
      this.props.saveAndSubmitCVDetails(
        this.state.cvEmployeeDataArray[0],
        docNumber,
        docType,
        this.state.particularInput,
        this.state.cashMemoInput,
        this.state.dateValue,
        '',
        this.state.currencyIdValue,
        this.state.amountInput,
        this.state.amountInput,
        '',
        1,
        categoryId,
        subCategoryId,
        childName,
        childDobOriginal,
        claimForId,
        investmentPlanId,
        firstClaimTill,
        secondClaimTill,
        weddingDate,
        this.state.remarksInput,
        1,
        myStatus,
        myForwardTo,
        myEmpTo,
        '',
        !isLineItemCostProject ? this.state.projectSearchValue : '',
        !isLineItemCostProject ? this.state.costCenterValue : '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        () => {},
        this.state.numPeople
      ); //need to confirm from anil
    }
  };

  setLineItemArray = (data) => {
    console.log('Set line item array in call Back of container : ', data);
    this.setState({ cvLineItemDataArray: data });
  };

  checkTypeOfData = () => {
    if (this.state.costProjectModalFor === globalConstants.PROJECT_TEXT) {
      return this.state.projectUserSearchArray;
    } else {
      return this.state.costCenterUserSearchArray;
    }
  };

  onProjectFocus = () => {
    this.setState({
      costProjectModalVisible: true,
      costProjectModalFor: globalConstants.PROJECT_TEXT,
    });
  };

  onCostCenterFocus = () => {
    this.setState({
      costProjectModalVisible: true,
      costProjectModalFor: globalConstants.COST_CENTER_TEXT,
    });
  };

  updateSearch = (searchText) => {
    this.setState({ costProjectSearchQuery: searchText }, () => {
      const filteredData = this.checkTypeOfData().filter((element) => {
        let str1 = element.ID.trim();
        let str2 = element.DisplayText.trim();
        let searchedText = str1.concat(str2);
        let elementSearched = searchedText.toString().toLowerCase();
        let queryLowerCase = this.state.costProjectSearchQuery
          .toString()
          .toLowerCase();
        return elementSearched.indexOf(queryLowerCase) > -1;
      });
      if (this.state.costProjectModalFor === globalConstants.PROJECT_TEXT) {
        this.setState({ projectArray: filteredData });
      } else {
        this.setState({ costCenterArray: filteredData });
      }
    });
  };

  renderListItem = (item, index) => {
    return (
      <TouchableOpacity
        onPress={() => {
          if (this.state.costProjectModalFor === globalConstants.PROJECT_TEXT) {
            this.setState({
              projectSearchValue: item.DisplayText,
            });
          } else {
            this.setState(
              {
                projectSearchValue: '',
                costCenterValue: item.DisplayText,
                costCenterID: item.ID,
              },
              () => {
                fetchProjectList(
                  this.state.cvEmployeeDataArray[0].CO_CODE,
                  this.state.costCenterID
                ).then((res) => {
                  if (res.length > 0) {
                    this.setState({
                      projectArray: res,
                      projectUserSearchArray: res,
                      isProjectAvailable: true,
                    });
                  } else {
                    this.setState({
                      projectArray: [],
                      projectUserSearchArray: [],
                      isProjectAvailable: false,
                    });
                    return this.showAlert('No project available!');
                  }
                });
              }
            );
          }
          this.setState({
            costProjectModalVisible: false,
            costProjectModalFor: '',
            costProjectSearchQuery: '',
          });
        }}
        style={styles.listItem}
      >
        <Text>{item.DisplayText}</Text>
        <View style={styles.supervisorSeparator} />
      </TouchableOpacity>
    );
  };

  showRequestsView = () => {
    let data =
      this.state.costProjectModalFor != ''
        ? this.state.costProjectModalFor === globalConstants.PROJECT_TEXT
          ? this.state.projectArray
          : this.state.costCenterArray
        : [];
    if (data.length > 0) {
      return (
        <FlatList
          contentContainerStyle={styles.listContentStyle}
          data={data}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => this.renderListItem(item, index)}
        />
      );
    } else {
      return null;
    }
  };

  modalSearchView = () => {
    return (
      <View>
        <Modal
          visible={this.state.costProjectModalVisible}
          animationType="slide"
          transparent={false}
        >
          <View style={styles.modalContainer}>
            <View style={styles.searchHolder}>
              <SearchBar
                lightTheme
                placeholder="Search project"
                onChangeText={this.updateSearch}
                value={this.state.costProjectSearchQuery}
                raised={true}
                containerStyle={styles.searchBarSkills}
                autoCapitalize="none"
                autoCompleteType="off"
                autoCorrect={false}
                s
              />
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    costProjectModalVisible: false,
                    costProjectModalFor: '',
                    costProjectSearchQuery: '',
                  });
                }}
              >
                <Icon name="close" size={35} color="blue" />
              </TouchableOpacity>
            </View>
            {this.showRequestsView()}
          </View>
        </Modal>
      </View>
    );
  };

  costCenterProjectSelection = () => {
    let editCondition = isComingFromMyVoucher
      ? !this.state.isFreezed
      : this.state.isProjectAvailable;
    return (
      <View>
        <LabelEditTextWithBtn
          heading={
            globalConstants.COST_CENTER_TEXT + globalConstants.ASTERISK_SYMBOL
          }
          placeHolder={'Search Cost Center..'}
          onFocusView={this.onCostCenterFocus}
          myNumberOfLines={2}
          isMultiline={true}
          myValue={this.state.costCenterValue}
          isSmallFont={true}
          isEditable={!this.state.isFreezed}
        />
        <LabelEditTextWithBtn
          heading={
            globalConstants.PROJECT_TEXT + globalConstants.ASTERISK_SYMBOL
          }
          placeHolder={'Search Project..'}
          onFocusView={this.onProjectFocus}
          myNumberOfLines={2}
          isMultiline={true}
          myValue={this.state.projectSearchValue}
          isSmallFont={true}
          isEditable={editCondition}
        />
        {this.modalSearchView()}
      </View>
    );
  };

  expenseDetailsInputFieldsView = () => {
    let myEmpData = this.state.cvEmployeeDataArray;
    if (isDocumentSaved) {
      if (categoryDataId == 1) {
        return (
          <View>
            {this.costCenterProjectSelection()}
            {myParticularView(this)}
            <LabelEditText
              heading={
                constants.CASH_MEMO_NO_TEXT + globalConstants.ASTERISK_SYMBOL
              }
              placeHolder="Max 20 characters"
              myMaxLength={20}
              onTextChanged={this.onCashMemoChanged}
              myValue={this.state.cashMemoInput}
              isSmallFont={true}
              isEditable={!this.state.isFreezed}
            />
            {subCategoryData?.id == 14 ||
            this.state.cvEmployeeDataArray[0]?.VoucherType == 14 ? (
              <LabelEditText
                heading={constants.NUM_PEOPLE + globalConstants.ASTERISK_SYMBOL}
                placeHolder="Number of people"
                onTextChanged={this.onNumberOfPeople}
                myKeyboardType="numeric"
                myValue={this.state.numPeople}
                isSmallFont={true}
                isEditable={!this.state.isFreezed}
              />
            ) : null}

            <DatePicker
              heading={
                globalConstants.DATE_TEXT + globalConstants.ASTERISK_SYMBOL
              }
              myDatePickerVisible={this.state.isDateCalendarVisible}
              myMaxDate={moment().toDate()}
              myMinDate={moment(financialYearStartDate, 'DD-MMM-YYYY').toDate()}
              myCalenderSelectedDate={moment(
                this.state.dateValue,
                'DD-MMM-YYYY'
              ).toDate()}
              myDateValue={this.state.dateValue}
              showMyCalendar={this.showDateCalendar}
              handleConfirm={(date) => this.dateConfirm(date)}
              hideDatePicker={this.hideDateCalendar}
              isFreezed={this.state.isFreezed}
            />
            <LabelEditText
              heading={
                globalConstants.AMOUNT_TEXT + globalConstants.ASTERISK_SYMBOL
              }
              onTextChanged={this.onAmountChanged}
              myValue={this.state.amountInput}
              isSmallFont={true}
              isEditable={
                (!isComingFromMyVoucher && !initialAmountEditable) ||
                this.state.isFreezed ||
                !initialAmountEditable
                  ? false
                  : true
              }
              myKeyboardType="numeric"
            />
            <View style={styles.addItemButtonView}>
              <CustomButton
                isFreezed={this.state.isFreezed}
                label={
                  this.state.isLineItemEditing
                    ? constants.UPDATE_TEXT
                    : constants.ADD_ITEM_TEXT
                }
                positive={true}
                performAction={() =>
                  this.addLineItem(
                    this.state.isLineItemEditing
                      ? constants.UPDATE_TEXT
                      : constants.ADD_ITEM_TEXT
                  )
                }
              />
            </View>
          </View>
        );
      } else if (categoryDataId == 2) {
        return (
          <View>
            <LabelEditText
              heading={constants.FROM_TEXT + globalConstants.ASTERISK_SYMBOL}
              onTextChanged={this.onFromLocationChanged}
              myValue={this.state.fromInput}
              isSmallFont={true}
              isEditable={!this.state.isFreezed}
            />
            <LabelEditText
              heading={constants.TO_TEXT + globalConstants.ASTERISK_SYMBOL}
              onTextChanged={this.onToLocationChanged}
              myValue={this.state.toInput}
              isSmallFont={true}
              isEditable={!this.state.isFreezed}
            />
            {myParticularView(this)}
            <DatePicker
              heading={
                globalConstants.DATE_TEXT + globalConstants.ASTERISK_SYMBOL
              }
              myDatePickerVisible={this.state.isDateCalendarVisible}
              myMaxDate={moment().toDate()}
              myMinDate={moment(financialYearStartDate, 'DD-MMM-YYYY').toDate()}
              myCalenderSelectedDate={moment(
                this.state.dateValue,
                'DD-MMM-YYYY'
              ).toDate()}
              myDateValue={this.state.dateValue}
              showMyCalendar={this.showDateCalendar}
              handleConfirm={(date) => this.dateConfirm(date)}
              hideDatePicker={this.hideDateCalendar}
              isFreezed={this.state.isFreezed}
            />
            <Dropdown
              title={
                constants.MODE_OF_CONVEYANCE_TEXT +
                globalConstants.ASTERISK_SYMBOL
              }
              disabled={this.state.isFreezed}
              forwardedRef={this.modeOfConveyanceRef}
              dropDownData={
                this.state.cvEmployeeDataArray.length > 0
                  ? this.state.cvEmployeeDataArray[0].ModeOfConveyance.map(
                      (value) => value.DisplayText
                    )
                  : null
              }
              dropDownCallBack={(index, value) =>
                this.onModeOfConveyanceSelection(index, value)
              }
              isSmallFont={true}
            />
            <LabelEditText
              heading={
                constants.KM_TEXT +
                (this.state.modeOfConveyanceRateValue != '' &&
                (this.state.modeOfConveyanceRateValue != 0 ||
                  this.state.modeOfConveyanceRateValue != 0.0)
                  ? globalConstants.ASTERISK_SYMBOL
                  : '')
              }
              onTextChanged={this.onKMChanged}
              myValue={this.state.kmInput}
              isSmallFont={true}
              myKeyboardType="numeric"
              isEditable={!this.state.isFreezed}
            />
            {this.state.cvEmployeeDataArray.length > 0 &&
            this.state.cvEmployeeDataArray[0].CO_CODE == 'N009' ? (
              <Dropdown
                title={
                  globalConstants.CURRENCY_TEXT +
                  globalConstants.ASTERISK_SYMBOL
                }
                disabled={this.state.isFreezed}
                forwardedRef={this.currencyRef}
                dropDownData={constants.CURRENCY_TYPES.map(
                  (value) => value.DisplayText
                )}
                dropDownCallBack={(index, value) =>
                  this.onCurrencySelection(index, value)
                }
                isSmallFont={true}
              />
            ) : null}
            <LabelEditText
              heading={
                globalConstants.AMOUNT_TEXT + globalConstants.ASTERISK_SYMBOL
              }
              onTextChanged={this.onAmountChanged}
              myValue={this.state.amountInput}
              isSmallFont={true}
              isEditable={
                this.state.modeOfConveyanceRateValue != '' &&
                (this.state.modeOfConveyanceRateValue != 0 ||
                  this.state.modeOfConveyanceRateValue != 0.0)
                  ? false
                  : true
              }
              myKeyboardType="numeric"
              // isEditable={!this.state.isFreezed}
            />
            <View style={styles.autocompleteParentView}>
              <Text style={styles.leftTextStyle}>
                {constants.ROUND_TRIP_TEXT}
              </Text>
              <View style={styles.checkUnCheckIconView}>
                <TouchableOpacity
                  disabled={this.state.isFreezed}
                  onPress={() =>
                    this.setState({
                      roundTripFlagValue: !this.state.roundTripFlagValue,
                    })
                  }
                >
                  <Image
                    style={globalFontStyle.checkUncheckedGlobal}
                    source={
                      this.state.roundTripFlagValue
                        ? globalConstants.CHECKED_ICON
                        : globalConstants.UNCHECKED_ICON
                    }
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.addItemButtonView}>
              <CustomButton
                isFreezed={this.state.isFreezed}
                label={
                  this.state.isLineItemEditing
                    ? constants.UPDATE_TEXT
                    : constants.ADD_ITEM_TEXT
                }
                positive={true}
                performAction={() =>
                  this.addLineItem(
                    this.state.isLineItemEditing
                      ? constants.UPDATE_TEXT
                      : constants.ADD_ITEM_TEXT
                  )
                }
              />
            </View>
          </View>
        );
      } else if (categoryDataId == 9) {
        return (
          <View>
            {this.state.cvEmployeeDataArray.length > 0 &&
            this.state.cvEmployeeDataArray[0].ProjectCodeFlag == 'YES'
              ? this.costCenterProjectSelection()
              : null}
            {/* {this.state.cvEmployeeDataArray.length>0 && this.state.cvEmployeeDataArray[0].ProjectCodeFlag == "YES" ?
            <LabelEditText
              heading={constants.COST_CENTER_CODE_TEXT + globalConstants.ASTERISK_SYMBOL}
              isEditable={false}
              myNumberOfLines={2}
              isMultiline={true}
              myValue={this.state.costCenterValue}
              isSmallFont={true}
            /> : null} */}
            <Dropdown
              title={
                constants.EXPENSE_TYPE_TEXT + globalConstants.ASTERISK_SYMBOL
              }
              disabled={this.state.isFreezed}
              forwardedRef={this.expenseTypeRef}
              dropDownData={
                this.state.cvExpenseTypeArray.length > 0
                  ? this.state.cvExpenseTypeArray.map(
                      (value) => value.DisplayText
                    )
                  : null
              }
              dropDownCallBack={(index, value) =>
                this.onExpenseTypeSelection(index, value)
              }
              isSmallFont={true}
            />
            <DatePicker
              heading={
                globalConstants.DATE_TEXT + globalConstants.ASTERISK_SYMBOL
              }
              myDatePickerVisible={this.state.isDateCalendarVisible}
              myMaxDate={moment().toDate()}
              myMinDate={moment(financialYearStartDate, 'DD-MMM-YYYY').toDate()}
              myCalenderSelectedDate={moment(
                this.state.dateValue,
                'DD-MMM-YYYY'
              ).toDate()}
              myDateValue={this.state.dateValue}
              showMyCalendar={this.showDateCalendar}
              handleConfirm={(date) => this.dateConfirm(date)}
              hideDatePicker={this.hideDateCalendar}
              isFreezed={this.state.isFreezed}
            />
            {myParticularView(this)}
            <Dropdown
              title={
                globalConstants.CURRENCY_TEXT + globalConstants.ASTERISK_SYMBOL
              }
              myDefaultValue={defaultCurrencyIdValue}
              disabled={this.state.isFreezed}
              forwardedRef={this.currencyTypeRef}
              dropDownData={
                this.state.cvCurrencyTypeArray.length > 0
                  ? this.state.cvCurrencyTypeArray.map(
                      (value) => value.DisplayText
                    )
                  : null
              }
              dropDownCallBack={(index, value) =>
                this.onCurrencyTypeSelection(index, value)
              }
              isSmallFont={true}
            />
            <LabelEditText
              heading={
                globalConstants.AMOUNT_TEXT + globalConstants.ASTERISK_SYMBOL
              }
              onTextChanged={this.onAmountChanged}
              myValue={this.state.amountInput}
              isSmallFont={true}
              myKeyboardType="numeric"
              isEditable={!this.state.isFreezed}
            />
            {this.state.cvEmployeeDataArray.length > 0 &&
            this.state.cvEmployeeDataArray[0].ExchangeRateFlag == 'YES' ? (
              <LabelEditText
                heading={
                  constants.EXCH_RATE_MUL_TO_TEXT + defaultCurrencyIdValue
                }
                onTextChanged={this.onExchRateMultiplierChanged}
                myValue={this.state.exchRateMultiplierInput.toString()}
                isSmallFont={true}
                isEditable={
                  isComingFromMyVoucher
                    ? !this.state.isFreezed
                    : this.state.isExchRateMultiplierEditable
                }
                myKeyboardType="numeric"
              />
            ) : null}
            <LabelEditText
              heading={
                constants.AMOUNT_IN_TEXT +
                defaultCurrencyIdValue +
                globalConstants.ASTERISK_SYMBOL
              }
              myValue={this.state.finalExchAmount}
              isSmallFont={true}
              isEditable={!this.state.isFreezed}
              myKeyboardType="numeric"
            />
            <View style={styles.addItemButtonView}>
              <CustomButton
                isFreezed={this.state.isFreezed}
                label={
                  this.state.isLineItemEditing
                    ? constants.UPDATE_TEXT
                    : constants.ADD_ITEM_TEXT
                }
                positive={true}
                performAction={() =>
                  this.addLineItem(
                    this.state.isLineItemEditing
                      ? constants.UPDATE_TEXT
                      : constants.ADD_ITEM_TEXT
                  )
                }
              />
            </View>
          </View>
        );
      } else if (categoryDataId == 8) {
        return (
          <View>
            {this.state.cvEmployeeDataArray.length > 0 &&
            this.state.cvEmployeeDataArray[0].ProjectCodeFlag == 'YES'
              ? this.costCenterProjectSelection()
              : null}
            <Dropdown
              title={
                constants.EXPENSE_TYPE_TEXT + globalConstants.ASTERISK_SYMBOL
              }
              disabled={this.state.isFreezed}
              forwardedRef={this.expenseTypeRef}
              dropDownData={
                this.state.cvExpenseTypeArray.length > 0
                  ? this.state.cvExpenseTypeArray.map(
                      (value) => value.DisplayText
                    )
                  : null
              }
              dropDownCallBack={(index, value) =>
                this.onExpenseTypeSelection(index, value)
              }
              isSmallFont={true}
            />
            <LabelEditText
              heading={
                globalConstants.START_PLACE_TEXT +
                globalConstants.ASTERISK_SYMBOL
              }
              onTextChanged={this.onFromLocationChanged}
              myValue={this.state.fromInput}
              isSmallFont={true}
              isEditable={!this.state.isFreezed}
            />
            <DatePicker
              heading={
                globalConstants.START_DATE_TEXT +
                globalConstants.ASTERISK_SYMBOL
              }
              myDatePickerVisible={this.state.isDateCalendarVisible}
              myMaxDate={moment().toDate()}
              myMinDate={moment(financialYearStartDate, 'DD-MMM-YYYY').toDate()}
              myCalenderSelectedDate={moment(
                this.state.dateValue,
                'DD-MMM-YYYY'
              ).toDate()}
              myDateValue={this.state.dateValue}
              showMyCalendar={this.showDateCalendar}
              handleConfirm={(date) => this.dateConfirm(date)}
              hideDatePicker={this.hideDateCalendar}
              isFreezed={this.state.isFreezed}
            />
            {this.state.cvEmployeeDataArray.length > 0 &&
            this.state.cvEmployeeDataArray[0].TravelTimeFlag == 'YES' ? (
              <DatePicker
                heading={
                  globalConstants.START_TIME_TEXT +
                  globalConstants.ASTERISK_SYMBOL
                }
                myDatePickerVisible={this.state.isTimeCalendarVisible}
                myMaxDate={moment().toDate()}
                myMinDate={moment(
                  financialYearStartDate,
                  'DD-MMM-YYYY'
                ).toDate()}
                myCalenderSelectedDate={moment(
                  this.state.startTimeValue,
                  'HHmm'
                ).toDate()}
                myDateValue={this.state.startTimeValue}
                showMyCalendar={this.showTimeCalendar}
                handleConfirm={(date) => this.startTimeConfirm(date)}
                hideDatePicker={this.hideTimeCalendar}
                myMode="time"
                isTime={true}
                isFreezed={this.state.isFreezed}
              />
            ) : null}
            <LabelEditText
              heading={
                globalConstants.DESTINATION_PLACE_TEXT +
                globalConstants.ASTERISK_SYMBOL
              }
              onTextChanged={this.onToLocationChanged}
              myValue={this.state.toInput}
              isSmallFont={true}
              isEditable={!this.state.isFreezed}
            />
            <DatePicker
              heading={
                globalConstants.DESTINATION_DATE_TEXT +
                globalConstants.ASTERISK_SYMBOL
              }
              myDatePickerVisible={this.state.isDestDateCalendarVisible}
              myMaxDate={moment().toDate()}
              myMinDate={moment(financialYearStartDate, 'DD-MMM-YYYY').toDate()}
              myCalenderSelectedDate={moment(
                this.state.destDateValue,
                'DD-MMM-YYYY'
              ).toDate()}
              myDateValue={this.state.destDateValue}
              showMyCalendar={this.showDestDateCalendar}
              handleConfirm={(date) => this.destDateConfirm(date)}
              hideDatePicker={this.hideDestDateCalendar}
              isFreezed={this.state.isFreezed}
            />
            {this.state.cvEmployeeDataArray.length > 0 &&
            this.state.cvEmployeeDataArray[0].TravelTimeFlag == 'YES' ? (
              <DatePicker
                heading={
                  globalConstants.DESTINATION_TIME_TEXT +
                  globalConstants.ASTERISK_SYMBOL
                }
                myDatePickerVisible={this.state.isDestTimeCalendarVisible}
                myMaxDate={moment().toDate()}
                myMinDate={moment(
                  financialYearStartDate,
                  'DD-MMM-YYYY'
                ).toDate()}
                myCalenderSelectedDate={moment(
                  this.state.destTimeValue,
                  'HHmm'
                ).toDate()}
                myDateValue={this.state.destTimeValue}
                showMyCalendar={this.showDestTimeCalendar}
                handleConfirm={(date) => this.destTimeConfirm(date)}
                hideDatePicker={this.hideDestTimeCalendar}
                myMode="time"
                isTime={true}
                isFreezed={this.state.isFreezed}
              />
            ) : null}
            {myParticularView(this)}
            {this.state.expenseTypeIdValue == 1 ||
            this.state.expenseTypeIdValue == 3 ||
            this.state.expenseTypeIdValue == 6 ||
            this.state.expenseTypeIdValue == '' ? (
              <Dropdown
                title={constants.MODE_TEXT + globalConstants.ASTERISK_SYMBOL}
                disabled={this.state.isFreezed}
                forwardedRef={this.modeOfConveyanceRef}
                dropDownData={
                  this.state.cvEmployeeDataArray.length > 0
                    ? this.state.cvEmployeeDataArray[0].ModeOfConveyance.map(
                        (value) => value.DisplayText
                      )
                    : null
                }
                dropDownCallBack={(index, value) =>
                  this.onTravelModeSelection(index, value)
                }
                isSmallFont={true}
              />
            ) : null}
            {this.state.cvEmployeeDataArray.length > 0 &&
            this.state.cvEmployeeDataArray[0].TravelLocationFlag == 'YES' ? (
              <Dropdown
                title={
                  globalConstants.LOCATION_TEXT +
                  globalConstants.ASTERISK_SYMBOL
                }
                disabled={this.state.isFreezed}
                forwardedRef={this.locationRef}
                dropDownData={
                  this.state.cvTravelLocationDataArray.length > 0
                    ? this.state.cvTravelLocationDataArray.map(
                        (value) => value.DisplayText
                      )
                    : null
                }
                dropDownCallBack={(index, value) =>
                  this.onTravelLocationSelection(index, value)
                }
                isSmallFont={true}
              />
            ) : null}
            {this.state.cvEmployeeDataArray.length > 0 &&
            this.state.cvEmployeeDataArray[0].CO_CODE == 'N054' &&
            (this.state.expenseTypeIdValue == 2 ||
              this.state.expenseTypeIdValue == 4 ||
              this.state.expenseTypeIdValue == 5 ||
              this.state.expenseTypeIdValue == 7) ? null : (
              <Dropdown
                title={
                  globalConstants.CURRENCY_TEXT +
                  globalConstants.ASTERISK_SYMBOL
                }
                myDefaultValue={defaultCurrencyIdValue}
                ddisabled={this.state.isFreezed}
                forwardedRef={this.currencyTypeRef}
                dropDownData={
                  this.state.cvCurrencyTypeArray.length > 0
                    ? this.state.cvCurrencyTypeArray.map(
                        (value) => value.DisplayText
                      )
                    : null
                }
                dropDownCallBack={(index, value) =>
                  this.onCurrencyTypeSelection(index, value)
                }
                isSmallFont={true}
              />
            )}
            <LabelEditText
              heading={
                globalConstants.AMOUNT_TEXT + globalConstants.ASTERISK_SYMBOL
              }
              onTextChanged={this.onAmountChanged}
              myValue={this.state.amountInput}
              isSmallFont={true}
              isEditable={
                isComingFromMyVoucher
                  ? !this.state.isFreezed
                  : this.state.isAmountEditable
              }
              myKeyboardType="numeric"
            />
            {(this.state.cvEmployeeDataArray.length > 0 &&
              this.state.cvEmployeeDataArray[0].ExchangeRateFlag != 'YES') ||
            (this.state.cvEmployeeDataArray.length > 0 &&
              this.state.cvEmployeeDataArray[0].CO_CODE == 'N054' &&
              (this.state.expenseTypeIdValue == 2 ||
                this.state.expenseTypeIdValue == 4 ||
                this.state.expenseTypeIdValue == 5 ||
                this.state.expenseTypeIdValue == 7)) ? null : (
              <LabelEditText
                heading={
                  constants.EXCH_RATE_MUL_TO_TEXT + defaultCurrencyIdValue
                }
                onTextChanged={this.onExchRateMultiplierChanged}
                myValue={this.state.exchRateMultiplierInput.toString()}
                isSmallFont={true}
                isEditable={
                  isComingFromMyVoucher
                    ? !this.state.isFreezed
                    : this.state.isExchRateMultiplierEditable
                }
                myKeyboardType="numeric"
              />
            )}
            <LabelEditText
              heading={
                constants.AMOUNT_IN_TEXT +
                defaultCurrencyIdValue +
                globalConstants.ASTERISK_SYMBOL
              }
              myValue={this.state.finalExchAmount}
              isSmallFont={true}
              isEditable={!this.state.isFreezed}
              myKeyboardType="numeric"
            />
            <View style={styles.addItemButtonView}>
              <CustomButton
                isFreezed={this.state.isFreezed}
                label={
                  this.state.isLineItemEditing
                    ? constants.UPDATE_TEXT
                    : constants.ADD_ITEM_TEXT
                }
                positive={true}
                performAction={() =>
                  this.addLineItem(
                    this.state.isLineItemEditing
                      ? constants.UPDATE_TEXT
                      : constants.ADD_ITEM_TEXT
                  )
                }
              />
            </View>
          </View>
        );
      } else if (categoryDataId == 10) {
        return (
          <View>
            {this.state.cvEmployeeDataArray.length > 0 &&
            this.state.cvEmployeeDataArray[0].ProjectCodeFlag == 'YES'
              ? this.costCenterProjectSelection()
              : null}
            <LabelEditText
              heading={constants.FROM_TEXT + globalConstants.ASTERISK_SYMBOL}
              onTextChanged={this.onFromLocationChanged}
              myValue={this.state.fromInput}
              isSmallFont={true}
              isEditable={!this.state.isFreezed}
            />
            <LabelEditText
              heading={constants.TO_TEXT + globalConstants.ASTERISK_SYMBOL}
              onTextChanged={this.onToLocationChanged}
              myValue={this.state.toInput}
              isSmallFont={true}
              isEditable={!this.state.isFreezed}
            />
            <DatePicker
              heading={
                globalConstants.DATE_TEXT + globalConstants.ASTERISK_SYMBOL
              }
              myDatePickerVisible={this.state.isDateCalendarVisible}
              myMaxDate={moment().toDate()}
              myMinDate={moment(financialYearStartDate, 'DD-MMM-YYYY').toDate()}
              myCalenderSelectedDate={moment(
                this.state.dateValue,
                'DD-MMM-YYYY'
              ).toDate()}
              myDateValue={this.state.dateValue}
              showMyCalendar={this.showDateCalendar}
              handleConfirm={(date) => this.dateConfirm(date)}
              hideDatePicker={this.hideDateCalendar}
              isFreezed={this.state.isFreezed}
            />
            <LabelEditText
              heading={
                constants.PERSON_VISIT_AND_PURPOSE_TEXT +
                globalConstants.ASTERISK_SYMBOL
              }
              onTextChanged={this.onParticularChanged}
              myValue={this.state.particularInput}
              isSmallFont={true}
              isEditable={!this.state.isFreezed}
            />
            <LabelEditText
              heading={
                (this.state.cvEmployeeDataArray.length > 0 &&
                this.state.cvEmployeeDataArray[0].UKMileageKMFlag != 'YES'
                  ? constants.MILES_TEXT
                  : constants.KM_TEXT) + globalConstants.ASTERISK_SYMBOL
              }
              onTextChanged={this.onKMChanged}
              myValue={this.state.kmInput}
              isSmallFont={true}
              myKeyboardType="numeric"
              isEditable={!this.state.isFreezed}
            />
            {this.state.cvEmployeeDataArray.length > 0 &&
            this.state.cvEmployeeDataArray[0].UKMileageAmountFlag == 'YES' ? (
              <LabelEditText
                heading={
                  globalConstants.AMOUNT_TEXT + globalConstants.ASTERISK_SYMBOL
                }
                onTextChanged={this.onAmountChanged}
                myValue={this.state.amountInput}
                isSmallFont={true}
                myKeyboardType="numeric"
                isEditable={!this.state.isFreezed}
              />
            ) : null}
            <View style={styles.addItemButtonView}>
              <CustomButton
                isFreezed={this.state.isFreezed}
                label={
                  this.state.isLineItemEditing
                    ? constants.UPDATE_TEXT
                    : constants.ADD_ITEM_TEXT
                }
                positive={true}
                performAction={() =>
                  this.addLineItem(
                    this.state.isLineItemEditing
                      ? constants.UPDATE_TEXT
                      : constants.ADD_ITEM_TEXT
                  )
                }
              />
            </View>
          </View>
        );
      }
    } else {
      return null;
    }
  };

  ukCorpCreditCardCheckView = () => {
    return (
      <View
        style={
          this.state.cvLineItemDataArray &&
          this.state.cvLineItemDataArray.length > 0
            ? styles.autocompleteParentDisableView
            : styles.autocompleteParentView
        }
      >
        <Text style={styles.leftNewTextStyle}>
          {constants.CORP_CREDIT_CARD_REIMBURSE_TEXT}
        </Text>
        <View style={styles.checkUnCheckNewIconView}>
          {this.state.cvLineItemDataArray &&
          this.state.cvLineItemDataArray.length > 0 ? (
            <Image
              style={globalFontStyle.checkUncheckedGlobal}
              source={
                this.state.corpCreditCardFlagValue
                  ? globalConstants.CHECKED_ICON
                  : globalConstants.UNCHECKED_ICON
              }
            />
          ) : (
            <TouchableOpacity
              disabled={this.state.isFreezed}
              onPress={() =>
                this.setState({
                  corpCreditCardFlagValue: !this.state.corpCreditCardFlagValue,
                })
              }
            >
              <Image
                style={globalFontStyle.checkUncheckedGlobal}
                source={
                  this.state.corpCreditCardFlagValue
                    ? globalConstants.CHECKED_ICON
                    : globalConstants.UNCHECKED_ICON
                }
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  expenseDetailsView = () => {
    return (
      <View style={styles.userInfoView}>
        {this.state.cvEmployeeDataArray.length > 0 &&
        this.state.cvEmployeeDataArray[0].CorpCreditCardFlag == 'YES' &&
        (categoryDataId == 9 || categoryDataId == 8)
          ? this.ukCorpCreditCardCheckView()
          : null}
        <ImageBackground style={styles.cardBackground} resizeMode="cover">
          {sectionTitle(
            isDocumentSaved
              ? constants.ENTER_EXPENSE_DETAILS_TEXT
              : constants.EXPENSE_DETAILS_TEXT
          )}
          <View style={styles.cardStyle}>
            {this.expenseDetailsInputFieldsView()}
            {this.lineItemDetailsView()}
          </View>
        </ImageBackground>
      </View>
    );
  };

  voucherInfoView = () => {
    let docNumber,
      categoryValue,
      subCategoryValue,
      childNameValue,
      childDobValue,
      claimForValue,
      investmentPlanValue,
      weddingDateValue,
      wefDateValue,
      tillDateValue,
      claimableBalValue,
      projectValue,
      costCenterValue,
      isLineItemCostProject = true,
      myEmpData = this.state.cvEmployeeDataArray;
    if (isComingFromMyVoucher) {
      docNumber = docDetails.DocNo;
      categoryValue = myEmpData.length > 0 ? myEmpData[0].CategoryName : '';
      if (myEmpData.length > 0 && myEmpData[0].Category == 1) {
        subCategoryValue =
          myEmpData.length > 0 ? myEmpData[0].VoucherTypeName : '';
        if (
          this.state.cvLineItemDataArray &&
          this.state.cvLineItemDataArray.length > 0
        ) {
          let lineItemFirstRecord = this.state.cvLineItemDataArray[0];
          childNameValue = lineItemFirstRecord.ChildName;
          childDobValue = lineItemFirstRecord.Childbdate;
          claimForValue = lineItemFirstRecord.ClaimForTxt;
          investmentPlanValue = lineItemFirstRecord.InvestmentPlanTxt;
          firstClaimTill = lineItemFirstRecord.FirstClaimTill;
          secondClaimTill = lineItemFirstRecord.SecondClaimTill;
          weddingDateValue = lineItemFirstRecord.WeddingDate;
        }
      } else if (
        myEmpData.length > 0 &&
        (myEmpData[0].Category == 2 ||
          myEmpData[0].Category == 8 ||
          myEmpData[0].Category == 9 ||
          myEmpData[0].Category == 10)
      ) {
        if (
          (myEmpData[0].Category == 8 ||
            myEmpData[0].Category == 9 ||
            myEmpData[0].Category == 10) &&
          myEmpData[0].ProjectCodeFlag == 'YES'
        ) {
          projectValue = '';
          costCenterValue = '';
        } else {
          if (myEmpData[0]) {
            projectValue =
              myEmpData[0].PROJ_CODE.trim() +
              '~' +
              myEmpData[0].PROJ_TXT.trim();
            costCenterValue =
              myEmpData[0].CC_CODE.trim() + '~' + myEmpData[0].CC_TXT.trim();
          }
        }
      }
    } else {
      docNumber =
        this.state.cvSaveAndSubmitDataArray[0] &&
        this.state.cvSaveAndSubmitDataArray[0] != undefined
          ? this.state.cvSaveAndSubmitDataArray[0].DocumentNo
          : '';
      categoryValue = categoryDataDisplayText;
      if (categoryDataId == 1) {
        console.log('subcategoryData', subCategoryData);
        subCategoryValue = subCategoryData.displayText;
        childNameValue = subCategoryData.childName;
        childDobValue = subCategoryData.childDob;
        claimForValue = subCategoryData.claimFor;
        investmentPlanValue = subCategoryData.investmentPlan;
        weddingDateValue = empWeddingDateValue;
        wefDateValue = subCategoryData.wefDate;
        tillDateValue = subCategoryData.tillDate;
        claimableBalValue = subCategoryData.claimableBal;
      } else if (
        categoryDataId == 2 ||
        categoryDataId == 8 ||
        categoryDataId == 9 ||
        categoryDataId == 10
      ) {
        if (
          (categoryDataId == 8 ||
            categoryDataId == 9 ||
            categoryDataId == 10) &&
          (myEmpData.length > 0 && myEmpData[0].ProjectCodeFlag == 'YES')
        ) {
          projectValue = '';
          costCenterValue = '';
        } else {
          projectValue = prevScreenProjectValue;
          costCenterValue = prevScreenCostCenterValue;
        }
      }
    }

    if (
      isDocumentSaved &&
      (categoryDataId == 2 ||
        ((categoryDataId == 8 || categoryDataId == 9 || categoryDataId == 10) &&
          (myEmpData.length > 0 && myEmpData[0].ProjectCodeFlag != 'YES')))
    ) {
      isLineItemCostProject = false;
    }
    return (
      <View style={styles.userInfoView}>
        <ImageBackground style={styles.cardBackground} resizeMode="cover">
          {sectionTitle(constants.VOUCHER_INFO_TEXT)}
          <View style={styles.cardStyle}>
            {showEmpDataRowGrid(
              globalConstants.DOCUMENT_NUMBER_TEXT,
              docNumber
            )}
            {showEmpDataRowGrid(constants.CATEGORY_TEXT, categoryValue)}
            {!isDocumentSaved
              ? showEmpDataRowGrid(
                  globalConstants.COST_CENTER_TEXT,
                  costCenterValue
                )
              : null}
            {!isDocumentSaved
              ? showEmpDataRowGrid(globalConstants.PROJECT_TEXT, projectValue)
              : null}
            {showEmpDataRowGrid(constants.SUB_CATEGORY_TEXT, subCategoryValue)}
            {showEmpDataRowGrid(constants.CHILD_NAME_TEXT, childNameValue)}
            {showEmpDataRowGrid(constants.CHILD_DOB_TEXT, childDobValue)}
            {showEmpDataRowGrid(constants.CLAIM_FOR_TEXT, claimForValue)}
            {showEmpDataRowGrid(
              constants.INVESTMENT_PLAN_TEXT,
              investmentPlanValue
            )}
            {showEmpDataRowGrid(
              constants.DATE_OF_WEDDING_TEXT,
              weddingDateValue
            )}
            {showEmpDataRowGrid(constants.WEF_DATE_TEXT, wefDateValue)}
            {showEmpDataRowGrid(constants.TILL_DATE_TEXT, tillDateValue)}
            {showEmpDataRowGrid(
              constants.CLAIMABLE_BAL_TEXT,
              claimableBalValue
            )}
            {!isLineItemCostProject ? this.costCenterProjectSelection() : null}
          </View>
        </ImageBackground>
      </View>
    );
  };

  lineItemEdit = (itemId) => {
    this.state.cvLineItemDataArray.map((record, i) => {
      if (record.RowId === itemId) {
        let isLineItemCostProject = true;
        console.log('edit record', record);
        if (categoryDataId == 2) {
          let modeIndex = this.state.cvEmployeeDataArray[0].ModeOfConveyance.findIndex(
            (element) => element.DisplayText == record.LCVModeText
          );
          this.modeOfConveyanceRef.current.select(modeIndex);
        }
        if (categoryDataId == 9) {
          let expIndex = this.state.cvExpenseTypeArray.findIndex(
            (element) => element.DisplayText == record.vc_VoucherText
          );
          let currencyIndex = this.state.cvCurrencyTypeArray.findIndex(
            (element) => element.DisplayText == record.vc_Currency
          );
          this.expenseTypeRef.current.select(expIndex);
          this.currencyTypeRef.current.select(currencyIndex);
        }
        if (categoryDataId == 8) {
          let expIndex = this.state.cvExpenseTypeArray.findIndex(
            (element) => element.DisplayText == record.vc_VoucherText
          );
          this.expenseTypeRef.current.select(expIndex);
          if (record.LCVMode != '') {
            this.setState(
              {
                expenseTypeIdValue: record.vc_VoucherType,
                expenseTypeValue: record.vc_VoucherText,
              },
              () => {
                if (
                  this.state.expenseTypeIdValue == 1 ||
                  this.state.expenseTypeIdValue == 3 ||
                  this.state.expenseTypeIdValue == 6
                ) {
                  let modeIndex = this.state.cvEmployeeDataArray[0].ModeOfConveyance.findIndex(
                    (element) => element.DisplayText == record.LCVModeText
                  );
                  this.modeOfConveyanceRef.current.select(modeIndex);
                }
              }
            );
          }
          if (this.state.cvEmployeeDataArray[0].CO_CODE == 'N054') {
            this.setState(
              {
                expenseTypeIdValue: record.vc_VoucherType,
                expenseTypeValue: record.vc_VoucherText,
              },
              () => {
                if (
                  this.state.expenseTypeIdValue != 2 &&
                  this.state.expenseTypeIdValue != 4 &&
                  this.state.expenseTypeIdValue != 5 &&
                  this.state.expenseTypeIdValue != 7
                ) {
                  let currencyIndex = this.state.cvCurrencyTypeArray.findIndex(
                    (element) => element.DisplayText == record.vc_Currency
                  );
                  this.currencyTypeRef.current.select(currencyIndex);
                  this.setState({ isAmountEditable: true });
                } else {
                  this.setState({ isAmountEditable: false });
                }
              }
            );
          } else {
            let currencyIndex = this.state.cvCurrencyTypeArray.findIndex(
              (element) => element.DisplayText == record.vc_Currency
            );
            this.currencyTypeRef.current.select(currencyIndex);
          }
          if (record.Location != '') {
            let locIndex = this.state.cvTravelLocationDataArray.findIndex(
              (element) => element.DisplayText == record.LocationText
            );
            this.locationRef.current.select(locIndex);
          }
        }
        if (
          categoryDataId == 2 ||
          ((categoryDataId == 8 ||
            categoryDataId == 9 ||
            categoryDataId == 10) &&
            this.state.cvEmployeeDataArray[0].ProjectCodeFlag != 'YES')
        ) {
          isLineItemCostProject = false;
        }
        this.setState(
          {
            isLineItemEditing: true,
            lineItemIdValue: itemId,
            particularInput: record.Particulars,
            cashMemoInput: record.MemoNo,
            amountInput: record.Amount.toString(),
            dateValue: record.SMemoDate,
            destDateValue: record.MemoDate2,
            startTimeValue: record.FromTime,
            numPeople:record.People,
            destTimeValue: record.ToTime,
            fromInput: record.LCVFrom,
            toInput: record.LCVTo,
            kmInput: record.LCVKM,
            exchRateMultiplierInput: record.LCVKM,
            modeOfConveyanceIdValue: record.LCVMode,
            modeOfConveyanceRateValue: record.LCVModeRate,
            modeOfConveyanceValue: record.LCVModeText,
            roundTripFlagValue: record.LCVRoundtrip == 'Y' ? true : false,
            expenseTypeIdValue: record.vc_VoucherType,
            expenseTypeValue: record.vc_VoucherText,
            lineItemCurrencyTypeIdValue: record.vc_Currency,
            lineItemCurrencyTypeValue: record.vc_Currency,
            finalExchAmount: parseFloat(record.ApprovedAmt.toString()).toFixed(
              2
            ),
            isExchRateMultiplierEditable:
              defaultCurrencyIdValue == record.vc_Currency ? false : true,
            travelLocationIdValue: record.Location,
            travelLocationValue: record.LocationText,
          },
          () => {
            if (isLineItemCostProject) {
              this.setState(
                {
                  projectSearchValue: record.ProjectCode,
                  costCenterValue: record.CostCode,
                  costCenterID: record?.CostCode?.split('~')[0],
                },
                () => {
                  fetchProjectList(
                    this.state.cvEmployeeDataArray[0].CO_CODE,
                    this.state.costCenterID
                  ).then((res) => {
                    if (res.length > 0) {
                      this.setState({
                        projectArray: res,
                        projectUserSearchArray: res,
                        isProjectAvailable: true,
                      });
                    } else {
                      this.setState({
                        projectArray: [],
                        projectUserSearchArray: [],
                        isProjectAvailable: false,
                      });
                      return this.showAlert('No project available!');
                    }
                  });
                }
              );
            }
          }
        );
      }
    });
  };

  lineItemDelete = (itemId) => {
    setTimeout(() => {
      Alert.alert(
        'Delete Record!',
        'Are you sure you want to delete this record?',
        [
          {
            text: 'Yes',
            onPress: () =>
              this.props.deleteCVLineItem(itemId).then(() => {
                if (
                  this.props.cvDeleteLineItemData[0].message ===
                  'line Item Deleted successfully.'
                ) {
                  this.getLineItemDataCallBack();
                }
              }),
          },
          { text: 'No', onPress: () => {} },
        ]
      );
    }, 1000);
  };

  lineItemDetailsView = () => {
    console.log("this.state.cvEmployeeDataArray",this.state.cvEmployeeDataArray)
    // console.log("Band",this.state.cvEmployeeDataArray[0].BAND)
    // console.log("CategoryName",this.state.cvEmployeeDataArray[0].CategoryName)
    // console.log("IsIndianCompany",this.state.cvEmployeeDataArray[0].IsIndianCompany)
   
    let categoryId,
      subCategoryId,
      totalAmount = 0;
    if (isComingFromMyVoucher) {
      categoryId =
        this.state.cvEmployeeDataArray.length > 0
          ? this.state.cvEmployeeDataArray[0].Category
          : '';
      subCategoryId =
        this.state.cvEmployeeDataArray.length > 0
          ? this.state.cvEmployeeDataArray[0].VoucherType
          : '';
    } else {
      categoryId = categoryDataId;
      if (categoryDataId == 1) {
        subCategoryId = subCategoryData.id;
      } else if (categoryDataId == 2) {
      }
    }
    if (
      this.state.cvLineItemDataArray &&
      this.state.cvLineItemDataArray.length > 0
    ) {
      // get data
      {
        this.state.cvEmployeeDataArray.map((item)=>{
          console.log("Band",item.BAND)
          console.log("CategoryName",item.CategoryName)
          console.log("IsIndianCompany",item.IsIndianCompany)
          console.log("totalAmount",TOTAL_AMOUNT)
        })
      }
      return (
        <View>
          <View style={styles.recordSeparatorLine} />
          {this.state.cvLineItemDataArray.map((record, i) => {
            let myIndex = i + 1;
            if (categoryDataId == 9 || categoryDataId == 8) {
              finalAmt = record.ApprovedAmt;
            } else {
              finalAmt = record.Amount;
            }
            totalAmount = totalAmount + parseFloat(finalAmt);
            TOTAL_AMOUNT = totalAmount;
            if (this.state.responseFetched || !isComingFromMyVoucher) {
              return lineItemDetail(
                record,
                myIndex,
                record.RowId,
                this,
                isDocumentSaved,
                i,
                categoryId,
                subCategoryId,
                defaultCurrencyIdValue,
                this.state.cvLineItemDataArray,
                this.setLineItemArray,
                this.state.isFreezed,
                previousScreenData.isFileRequired
              );
            }
          })}
          <View style={styles.recordSeparatorLine} />
          <View style={styles.totalAmountView}>
            <Text style={styles.totalAmountText}>
              {globalConstants.TOTAL_AMOUNT_TEXT}
            </Text>
            <Text style={styles.totalAmountValue}>
              {parseFloat(totalAmount).toFixed(2) +
                ' (' +
                defaultCurrencyIdValue +
                ')'}
            </Text>
          </View>
          <View style={styles.recordSeparatorLine} />
        </View>
      );
    } else {
      return null;
    }
  };

  dialogueModalView = () => {
    return (
      <UserMessage
        modalVisible={true}
        heading={this.state.popUpHeading}
        message={this.state.popUpMessage}
        okAction={() => {
          this.setState({ showModal: false }, () => {
            if (this.state.popUpHeading.includes('Error')) {
              helper.onOkAfterError(this);
            }
            // else if(this.state.popUpHeading.includes("Attention")) {

            // }
            else {
              this.handleBack();
            }
          });
        }}
      />
    );
  };

  historyView = () => {
    return (
      <View style={styles.historyStyle}>
        <TouchableOpacity
          onPress={() => {
            this.setState({ modalVisible: true });
          }}
        >
          <Text style={globalFontStyle.hyperlinkText}>
            {globalConstants.HISTORY_TEXT}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
  receiveSupervisor = (supervisor) => {
    this.setState({ supervisorSearchValue: supervisor.Key });
  };
  deleteVoucher = () => {
    this.props.deleteCVVoucher(this.getDocNumber()).then(() => {});
  };
  submitDetails = async (submitTo, remarks) => {
    if (
      categoryDataId == 1 &&
      this.state.cvEmployeeDataArray[0]?.VoucherType == '7' &&
      this.state.cvEmployeeDataArray[0]?.IsDataCardEntitlement == 'YES'
    ) {
      return alert(constants.NOT_ELIGIBLE_CLAIM_DATA_CARD);
    }
    this.setState({ submitToValue: submitTo, remarksInput: remarks }, () => {
      this.submitAction();
    });
  };
  onHistoryClose = () => {
    this.setState({ modalVisible: false }, () => {});
  };

  render() {
    console.log("cvLineItemDataArray",this.state.cvLineItemDataArray)
    return (
      <ImageBackground
        source={images.loginBackground}
        style={globalFontStyle.container}
      >
        <View style={globalFontStyle.subHeaderViewGlobal}>
          <SubHeader
            pageTitle={
              isComingFromMyVoucher
                ? globalConstants.UPDATE_VOUCHER_TITLE
                : globalConstants.CREATE_REQUEST_IT_TITLE
            }
            backVisible={true}
            logoutVisible={true}
            handleBackPress={() => this.onBack()}
            navigation={this.props.navigation}
          />
        </View>
        <KeyboardAwareScrollView keyboardShouldPersistTaps="never">
          {isComingFromMyVoucher && this.state.cvHistoryDataArray.length > 0
            ? this.historyView()
            : null}
          {this.state.modificationStopMessage !== '' && (
            <WarningMessage message={this.state.modificationStopMessage} />
          )}
          {isComingFromMyVoucher
            ? employeeDetail(this.state.cvEmployeeDataArray[0])
            : null}
          {this.voucherInfoView()}
          {this.state.cvEmployeeDataArray.length > 0 &&
          categoryDataId == 10 &&
          this.state.cvEmployeeDataArray[0].UKMileageCommMilesFlag == 'YES'
            ? ukMileageCommMileageView(this)
            : null}
          {isDocumentSaved && this.state.cvEmployeeDataArray.length > 0
            ? additionalInfoView(this, categoryDataId)
            : null}
          {this.expenseDetailsView()}
          {this.state.cvLineItemDataArray &&
          this.state.cvLineItemDataArray.length > 0 &&
          isDocumentSaved &&
          this.state.docNumber &&
          this.state.docNumber !== '' &&
          this.state.cvEmployeeDataArray.length > 0 &&
          this.state.modificationStopMessage == '' ? (
            <SubmitTo
              subCategoryId={this.state.cvLineItemDataArray[0].VoucherType}
              documentNumber={this.state.docNumber}
              myEmpData={this.state.cvEmployeeDataArray}
              categoryDataId={categoryDataId}
              setSupervisor={this.receiveSupervisor}
              submitDetails={this.submitDetails}
              deleteVoucher={this.deleteVoucher}
              totalAmount ={TOTAL_AMOUNT}
            />
          ) : null}
          {isComingFromMyVoucher && this.state.cvHistoryDataArray.length > 0 ? (
            <HistoryView
              historyData={this.props.cvHistoryData}
              forwardedRef={this._panel}
              isComingFromVoucher={true}
              visibility={this.state.modalVisible}
              onClose={() => this.onHistoryClose()}
            />
          ) : null}
        </KeyboardAwareScrollView>
        {this.state.showModal === true ? this.dialogueModalView() : null}
        <ActivityIndicatorView loader={this.props.cvLoading} />
      </ImageBackground>
    );
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    resetCVEmpData: () => dispatch(cvResetEmpData()),
    resetCVScreen: () => dispatch(cvResetScreen()),
    fetchCVEmployeeData: (empCode, authToken, docNumber, getCategoryCallBack) =>
      dispatch(
        cvFetchEmployeeData(empCode, authToken, docNumber, getCategoryCallBack)
      ),
    saveAndSubmitCVDetails: (
      empDetailsData,
      docNo,
      docType,
      particular,
      cashMemo,
      date,
      date2,
      currency,
      amount,
      approvedAmt,
      totalApprovedAmt,
      catType,
      catId,
      subCatId,
      childName,
      childDobOriginal,
      claimForId,
      investmentPlanId,
      firstClaimTill,
      secondClaimTill,
      weddingDate,
      remarks,
      saveOrSubmit,
      status,
      forwardTo,
      empTo,
      lineItemId,
      project,
      costCenter,
      lcvFrom,
      lcvTo,
      lcvMode,
      lcvKM,
      lcvRoundTrip,
      ukCreditCardFlag,
      ukExpenseType,
      lineItemCurrency,
      lineItemProjectCode,
      lineItemCostCenterCode,
      fromTime,
      toTime,
      location,
      getLineItemDataCallBack,
      numPeople
    ) =>
      dispatch(
        cvSaveAndSubmitDetails(
          empDetailsData,
          docNo,
          docType,
          particular,
          cashMemo,
          date,
          date2,
          currency,
          amount,
          approvedAmt,
          totalApprovedAmt,
          catType,
          catId,
          subCatId,
          childName,
          childDobOriginal,
          claimForId,
          investmentPlanId,
          firstClaimTill,
          secondClaimTill,
          weddingDate,
          remarks,
          saveOrSubmit,
          status,
          forwardTo,
          empTo,
          lineItemId,
          project,
          costCenter,
          lcvFrom,
          lcvTo,
          lcvMode,
          lcvKM,
          lcvRoundTrip,
          ukCreditCardFlag,
          ukExpenseType,
          lineItemCurrency,
          lineItemProjectCode,
          lineItemCostCenterCode,
          fromTime,
          toTime,
          location,
          getLineItemDataCallBack,
          numPeople
        )
      ),
    fetchCVLineItemData: (docNo) => dispatch(cvFetchLineItemData(docNo)),
    searchCVProject: (term, compCode) =>
      dispatch(cvSearchProject(term, compCode)),
    searchCVSupervisor: (docNo, term) =>
      dispatch(cvSearchSupervisor(docNo, term)),
    deleteCVLineItem: (itemId) => dispatch(cvDeleteLineItem(itemId)),
    deleteCVVoucher: (docNo) => dispatch(cvDeleteVoucher(docNo)),
    resetHistory: () => dispatch(resetCvHistoryData()),
    fetchCVMileageCommMiles: (docNo) =>
      dispatch(cvFetchMileageCommMiles(docNo)),
    fetchCVHistory: (docNo) => dispatch(cvFetchHistory(docNo)),
    fetchCVExpenseType: (catType) => dispatch(cvFetchExpenseType(catType)),
    fetchCVCurrencyType: () => dispatch(cvFetchCurrencyType()),
    fetchCVTravelLocation: () => dispatch(cvFetchTravelLocation()),
    fetchCVTakeABreakBalance: (docNo) =>
      dispatch(cvFetchTakeABreakBalance(docNo)),
    fetchCVTravelAmount: (startDate, startHour, endDate, endHour) =>
      dispatch(cvFetchTravelAmount(startDate, startHour, endDate, endHour)),
    validateCVDetails: (
      empDetailsData,
      docNo,
      docType,
      cashMemo,
      date,
      project,
      costCenter,
      catId,
      subCatId,
      lineItemId,
      weddingDate,
      childName,
      claimForId
    ) =>
      dispatch(
        cvValidateDetails(
          empDetailsData,
          docNo,
          docType,
          cashMemo,
          date,
          project,
          costCenter,
          catId,
          subCatId,
          lineItemId,
          weddingDate,
          childName,
          claimForId
        )
      ),
  };
};

const mapStateToProps = (state) => {
  console.log('screen 2 global state', state.cvReducer);
  return {
    loginData: state.loginReducer && state.loginReducer.loginData,
    cvLoading: state.cvReducer && state.cvReducer.cvLoader,
    cvEmployeeData: state.cvReducer && state.cvReducer.cvEmployeeData,
    cvSaveAndSubmitData: state.cvReducer && state.cvReducer.cvSaveAndSubmitData,
    cvLineItemData: state.cvReducer && state.cvReducer.cvLineItemData,
    cvSearchProjectData: state.cvReducer && state.cvReducer.cvSearchProjectData,
    cvSearchSupervisorData:
      state.cvReducer && state.cvReducer.cvSearchSupervisorData,
    cvDeleteLineItemData:
      state.cvReducer && state.cvReducer.cvDeleteLineItemData,
    cvDeleteVoucherData: state.cvReducer && state.cvReducer.cvDeleteVoucherData,
    cvHistoryData: state.cvReducer && state.cvReducer.cvHistoryData,
    cvLineItemError: state.cvReducer && state.cvReducer.cvLineItemError,
    cvExpenseTypeData: state.cvReducer && state.cvReducer.cvExpenseTypeData,
    cvCurrencyTypeData: state.cvReducer && state.cvReducer.cvCurrencyTypeData,
    cvValidationData: state.cvReducer && state.cvReducer.cvValidationData,
    cvTravelLocationData:
      state.cvReducer && state.cvReducer.cvTravelLocationData,
    cvTravelAmountData: state.cvReducer && state.cvReducer.cvTravelAmountData,
    cvMileageCommMilesData:
      state.cvReducer && state.cvReducer.cvMileageCommMilesData,
    cvTakeABreakData:
      state && state.cvReducer && state.cvReducer.cvTakeABreakData,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateVoucher_2);

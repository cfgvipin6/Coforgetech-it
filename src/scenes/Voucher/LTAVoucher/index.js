import React, { Component } from 'react';
import { BackHandler, Dimensions, ImageBackground, Modal, ScrollView, Text, TextInput, View } from 'react-native';
import { connect } from 'react-redux';
import { globalFontStyle } from '../../../components/globalFontStyle';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import SubHeader from '../../../GlobalComponent/SubHeader';
import { EmpDetail } from './empDetail';
import { uploadData, getLineItems, deleteFile, validateDetails, removeVoucher, fetchBalance, validateLTA } from './utils';
import { deleteLogFile } from '../../../utilities/logger';
import { showToast } from '../../../GlobalComponent/Toast';
import ActivityIndicatorView from '../../../GlobalComponent/myActivityIndicator';
import { LabelEditText } from '../../../GlobalComponent/LabelEditText/LabelEditText';
import { SubmitTo } from './submitTo';
import { cvFetchEmployeeData, cvFetchHistory, resetCvHistoryData } from '../createVoucher/cvAction';
import UserMessage from '../../../components/userMessage';
import { HistoryView } from '../../../GlobalComponent/HistoryView/HistoryView';
import { moderateScale } from '../../../components/fontScaling';
import { TouchableOpacity } from 'react-native';
import { styles } from '../../../GlobalComponent/LabelText/styles';
import properties from '../../../resource/properties';
import { RadioForms } from '../../eExit/ExitHelper';
import { LabelTextDashValue } from '../../../GlobalComponent/LabelText/LabelText';
import moment from 'moment';
import { DatePicker } from '../../../GlobalComponent/DatePicker/DatePicker';
import { ExpenseDetail } from '../createGenericVoucher/expenseDetail';
import { ExpenseDetailLTA, getLtaExpenseItem } from './expenseDetailsLTA';
import LTADependents, { getDependents } from './ltaDependents/ltaDependents';
import CostCalculation, { getCostData } from './CostCalculation/costCalculation';
import { CertifyView } from './certifyView';
import { LTARadioForms } from './ltaRadio';
import { WarningMessage } from '../../../GlobalComponent/WarningMessage/WarningMessage';
import { fetchCreateModifyStopData } from '../createGenericVoucher/utils';
import images from '../../../images';
let constants = require('./constants');
let globalConstants = require('../../../GlobalConstants');
let projData, expData, docStatus, isComingFromMyVoucher,costCenterData;
let ltaBalance;
let isRadioSet = false;
let fileArray = [];
const { height } = Dimensions.get('window');
class CreateLtaVoucher extends Component {
  constructor(props) {
    super(props);
    this._panel = React.createRef();
    this.billTypeRef = React.createRef();
    previousScreenData = this.props.navigation.state.params;
    isComingFromMyVoucher = previousScreenData.isComingFromMyVoucher;
    this.state = {
      catID: this.props.navigation.state.params.CatID,
      title: this.props.navigation.state.params.Title,
      remarks: '',
      documentNumber: isComingFromMyVoucher ? previousScreenData.docDetails.DocNo : '',
      editableFile: undefined,
      resetExpense: undefined,
      editExpense: undefined,
      editCase: false,
      superVisorCode: '',
      loading: false,
      historyToggle: false,
      balanceAmount: '',
      reimburseAmount: '',
      modalVisible: false,
      withoutBillFlag: 0,
      visitedPlace: '',
      fromDateCalendarVisible: false,
      toDateCalendarVisible: false,
      updatedDependents: [],
      expenseDetailObj: undefined,
      modeOfTravel: [],
      selectedMode: '',
      isRadioSet: false,
      modificationStopMessage:'',
			isFreezed:false,
    };
  }
  onBack = () => {
    this.props.navigation.pop();
  }
  handleBackButtonClick = () => {
    this.onBack();
    return true;
  }
  onHistoryLoaded = async () => {
    let expenseDetailObj = await getLineItems(docDetails.DocNo);
    this.setState({ expenseDetailObj: expenseDetailObj[0] }, () => {
      console.log('Bill Type Ref : ', this.billTypeRef);
      amountWithoutBill = this.props.empData[0].LtaBalanceLBN;
      amountWithBill = this.props.empData[0].LtaBalanceLBY;
      this.setState(
        {
          balanceAmount: amountWithBill,
          reimburseAmount: amountWithoutBill,
          selectedMode: this.state.expenseDetailObj.ModeOfTravelText,
        },
        () => {
          if (!this.state.isRadioSet) {
            this.setState({ isRadioSet: true }, () => {
              this.billTypeRef.current.updateIsActiveIndex(this.state.expenseDetailObj.IsTaxable ? 1 : 0);
              this.billTypeRef.current.props.onPress(this.state.expenseDetailObj.IsTaxable ? 1 : 0);
              this.setState({ loading: false });
            });
          }
        }
      );
    });
  }
  async componentDidMount() {
    let amountWithoutBill, amountWithBill;
    this.setState({ loading: true });
    ltaBalance = await fetchBalance(properties.fetchLtaBalance, this.state.catID);
    this.setState({ modeOfTravel: ltaBalance.ModeofTravel });
    if (isComingFromMyVoucher) {
      previousScreenData = this.props.navigation.state.params;
      isComingFromMyVoucher = previousScreenData.isComingFromMyVoucher;
      docDetails = previousScreenData.docDetails;
      docStatus = docDetails.StatusCode;
      console.log('previous screen doc details : ', docDetails);
      this.props.fetchCVEmployeeData(this.props.loginData.SmCode, this.props.loginData.Authkey, docDetails.DocNo, async () => {
        this.updateProjectData();
        this.checkIfModificationValid();
        this.props.historyCV(docDetails.DocNo, this.onHistoryLoaded);
      });
    } else {
      this.props.fetchCVEmployeeData(this.props.loginData.SmCode, this.props.loginData.Authkey, '', async () => {
        this.updateProjectData();
        this.setState({
          loading: false,
          balanceAmount: ltaBalance.LtaBalanceLBY,
          reimburseAmount: ltaBalance.LtaBalanceLBN,
          selectedMode: '',
        });
      });
    }
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }
  checkIfModificationValid = async() =>{
		try {
		let response = await fetchCreateModifyStopData(this.state.catID);
		console.log('Response of fetchCreateModifyStopData :', response);
		let exceptionalCompanyCodes = response && response.length > 0 && response[0].ExceptionalCompanyCode.split(',');
		let isModificationStop = response && response.length > 0 && response[0].IsModificationStop;
			if (Array.isArray(exceptionalCompanyCodes) && exceptionalCompanyCodes.length > 0){
				let isCodeMatched =  exceptionalCompanyCodes.includes(this.props.empData[0].CO_CODE);
				if (isCodeMatched &&  isModificationStop == 'Y'){
					this.setState({modificationStopMessage:response[0].ModificationStopMessage,isFreezed:true});
				} else {
        console.log('Exceptional Company Codes : ', exceptionalCompanyCodes);
				 console.log('Is Modification Stop : ', isModificationStop);
				 console.log('Is code matched :', isCodeMatched);
				}
			}
		} catch (e){
			if (!this.state.loading)
			{alert(e);}
		}
	}
  updateProjectData=()=>{
		if (this.props.empData && this.props.empData.length > 0 && this.props.empData[0].PROJ_CODE && this.props.empData[0].PROJ_CODE !== '') {
			let emp = this.props.empData[0];
			let projItem = {};
			projItem.CCCode = emp.CC_CODE;
			projItem.CCText = emp.CC_TXT;
			projItem.ProjectCode = emp.PROJ_CODE;
			projItem.ProjectText = emp.PROJ_TXT;
			projItem.Value = emp.PROJ_CODE;
			projData = projItem;
		}
	}
  componentWillUnmount() {
    this.props.resetHistory();
    projData = undefined;
    expData = undefined;
    docStatus = undefined;
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  validates = async (expenseData) => {
    let validityStatus = false;
    console.log('expense data : ', expenseData);
    console.log('projData', projData);
    let toMoment = moment(expenseData.toDateValue);
    let fromMoment = moment(expenseData.fromDateValue);
    let diffDays = toMoment.diff(fromMoment, 'days');
    let costItem = getCostData();
    let dependentsItem = getDependents();
    let selectedPersons = dependentsItem.dependents.filter((item, index) => item.IsChecked);
    console.log('Selected persons : ', selectedPersons.length);
    console.log('cost Data : ', costItem);
    console.log('dependents : ', dependentsItem);
    if (projData == undefined || projData == '' || projData == null) {
      showToast(constants.PROJECT_REQUIRED);
    } else if (expenseData.placesVisited == '' && !this.state.withoutBillFlag) {
      showToast(constants.PLACES_VISITED_REQUIRED);
    } else if (
      this.state.balanceAmount < 0 ||
      (!this.state.withoutBillFlag
        ? parseFloat(costItem.totalCost) > parseFloat(this.state.balanceAmount)
        : parseFloat(costItem.totalCost) > parseFloat(this.state.reimburseAmount))
    ) {
      showToast(constants.BAL_NOT_SUFFICIENT);
    } else if (!this.state.withoutBillFlag && dependentsItem.mode == '') {
      showToast(constants.TRAVEL_MODE);
    } else if (costItem.totalCost == 0) {
      showToast(constants.ZERO_COST);
    } else if (!this.state.withoutBillFlag && diffDays <= 1) {
      showToast(constants.DAY_DIFF);
    } else if (
      parseInt(costItem.majorPersons) + parseInt(costItem.minorPersons) !== selectedPersons.length + 1 &&
      !this.state.withoutBillFlag
    ) {
      showToast(constants.PERSON_DIFF);
    } else {
      let claimDate = this.state.withoutBillFlag ? moment().format('DD-MMM-YYYY') : expenseData.fromDateValue;
      let validateResponse = await validateLTA(this.props.empData[0], projData, expenseData, this.state.catID, claimDate);
      let responseFlag = validateResponse[0].MsgTxt;
      // validityStatus = true // for validations skipping.
      if (responseFlag !== '') {
        showToast(responseFlag);
      } else {
        validityStatus = true;
      }
    }
    return validityStatus;
  }
  deleteVoucher = async () => {}
  submitDetails = async (submitTo, remarks) => {
    let ltaExpenseItem = getLtaExpenseItem();
    let ltaCostItem = getCostData();
    let ltaDependents = getDependents();
    let flag = await this.validates(ltaExpenseItem);
    console.log('Validation flag is : ', flag);
    if (!flag) {return;}
    if (submitTo == '') {
      showToast('Please select to whom you want to submit');
      return;
    } else if (remarks == '') {
      showToast('Please enter the remarks before submit.');
      return;
    } else if (submitTo == 'FSO') {
      console.log('Submitting to FSO');
      projData.files = this.state.expenseDetailObj?.LstUploadFiles ? this.state.expenseDetailObj.LstUploadFiles : [];
      if (this.state.withoutBillFlag == 0 && this.state.expenseDetailObj?.LstUploadFiles == undefined){
        return alert('Attachment is mandatory!');
      }
      {this.setState({ loading: true });}
      let response = await uploadData(
        projData,
        this.props.empData[0],
        remarks,
        1,
        this.state.documentNumber,
        this.state.withoutBillFlag,
        this.state.editCase,
        '',
        this.state.catID,
        ltaExpenseItem,
        ltaCostItem,
        ltaDependents
      );
      console.log('Final submit response for FSO :', response);
      this.setState({ loading: false }, () => {
        setTimeout(() => {
          this.success(response);
        }, 500);
      });
    }
  }
  success = (response) => {
    if (response?.message.includes('successfully')) {
      this.setState({ requestStatus: 0 }, () => {
        showToast(response.message);
        this.props.navigation.navigate('VoucherDashBoard');
      });
    } else {
      this.setState({ requestStatus: 0 }, () => {
        showToast(response);
      });
    }
  }
  // receiveProjectData = (projectData) => {
  //   projData = projectData
  // }

  receiveProjectData = (projectData) => {
		console.log('Project  data : ',projData);
		let emp = this.props.empData[0];
			let projItem = {};

			projItem.CCCode = costCenterData !== undefined ? costCenterData.ID : emp.CC_CODE;
			projItem.CCText = costCenterData !== undefined ? costCenterData.DisplayText.split('~')[1] : emp.CC_TXT;
			projItem.ProjectCode = projectData.ID;
			projItem.ProjectText = projectData.DisplayText.split('~')[1];
			projItem.Value = projectData.DisplayText.split('~')[1];
			projData = projItem;
      console.log('Proj data is now : ', projData);
	}
	receiveCostCenterData = (costData) => {
		costCenterData = costData;
    projData = undefined;
	}
  receiveSupervisor = (supervisor) => {
    this.setState({ superVisorCode: supervisor.Value });
  }

  historyView = () => {
    return (
      <View
        style={{
          alignItems: 'flex-end',
          marginRight: moderateScale(6),
          marginVertical: moderateScale(3),
        }}
      >
        <TouchableOpacity
          onPress={() => {
            this.setState({ modalVisible: true });
          }}
        >
          <Text style={globalFontStyle.hyperlinkText}>{globalConstants.HISTORY_TEXT}</Text>
        </TouchableOpacity>
      </View>
    );
  }
  onHistoryClose = () => {
    console.log('On history close called : ');
    this.setState({ modalVisible: false }, () => {
      // this.props.resetHistory();
    });
  }
  setPlace = (text) => {
    console.log('Place Value :', text);
    this.setState({ visitedPlace: text });
  }
  setFromDate = (text) => {
    console.log('From Date :', text);
    this.setState({ fromDate: text });
  }
  setToDate = (text) => {
    console.log('To Date :', text);
    this.setState({ toDate: text });
  }
  toggleWithoutBill = (val) => {
    console.log('Radio button val :', val);
    this.setState({ withoutBillFlag: val });
  }

  updatedDependents = (dependents) => {
    this.setState({ updatedDependents: dependents }, () => {
      console.log('Dependents updated : ', this.state.updatedDependents);
    });
  }

  updateExpenseDetailObject=(data)=>{
    this.setState({expenseDetailObj:data});
  }
  updateFileObject=(file)=>{
    console.log('File to be updated is : ', file);
    fileArray.push(...file);
    let dataObject = {};
    dataObject.LstUploadFiles = [...fileArray];
    this.setState({expenseDetailObj:dataObject},()=>{
      console.log('Expense detail object after file add : ', this.state.expenseDetailObj);
    });
  }
  render() {
    let loader = this.state.loading;
    const { balanceAmount, reimburseAmount } = this.state;
    console.log('Status Code :', docStatus);
    let disable =
      docStatus == undefined ||
      docStatus == 0 ||
      docStatus == 1 ||
      docStatus == 5 ||
      docStatus == 7 ||
      docStatus == 12 ||
      docStatus == 14
        ? false
        : true;
    return (
      <ImageBackground
      style={{flex:1}}
      source={images.loginBackground}
    >
      <KeyboardAwareScrollView>
        <SubHeader
          pageTitle={this.state.title}
          backVisible={true}
          logoutVisible={true}
          handleBackPress={() => this.onBack()}
          navigation={this.props.navigation}
        />
        <ActivityIndicatorView loader={loader} />
        {isComingFromMyVoucher && this.props.cvHistoryData.length > 0 ? this.historyView() : null}
        {this.state.modificationStopMessage !== '' && <WarningMessage message = {this.state.modificationStopMessage}/>}
        {this.props.empData && this.props.empData.length > 0 && (
          <EmpDetail docNubmer={this.state.documentNumber} emp={this.props.empData} setProjectData={this.receiveProjectData} setCostCenterData={this.receiveCostCenterData} requestStatus={docStatus} />
        )}
        {(isComingFromMyVoucher && this.state.isRadioSet) || !isComingFromMyVoucher ? (
          <ImageBackground style={styles.cardBackground} resizeMode="cover">
            <LTARadioForms
              docStatus={docStatus}
              balanceAmount={this.state.balanceAmount}
              isComingFromMyVoucher={isComingFromMyVoucher}
              forwardedRef={this.billTypeRef}
              disabled={isComingFromMyVoucher}
              selectedVal={this.state.withoutBillFlag}
              onValueSelection={(val) => this.toggleWithoutBill(val)}
              labelHorizontal={true}
              options={constants.REIMBURSE_OPTIONS}
            />
            {this.props.empData[0] && (
              <LabelTextDashValue
                heading="Date Of Joining"
                description={moment(this.props.empData[0].DOJ, 'YYYY-MM-DD').format('DD-MMM-YYYY')}
              />
            )}
            <LabelTextDashValue
              heading="Balance Amount"
              description={this.state.withoutBillFlag ? reimburseAmount : balanceAmount}
            />
          </ImageBackground>
        ) : null}
        {!this.state.withoutBillFlag && this.props.empData[0] && this.state.balanceAmount != '' ? (
          <ExpenseDetailLTA
            docStatus={docStatus}
            isComingFromMyVoucher={isComingFromMyVoucher}
            details={this.state.expenseDetailObj}
            emp={this.props.empData}
          />
        ) : null}
        {this.state.balanceAmount != '' && !this.state.withoutBillFlag && this.props.empData[0] ? (
          <LTADependents
            docStatus={docStatus}
            updatedDependents={this.updatedDependents}
            dependents={isComingFromMyVoucher ? this.props.empData[0]?.Relations : ltaBalance.Relations}
            isComingFromMyVoucher={isComingFromMyVoucher}
            travelModes={this.state.modeOfTravel}
            selectedMode={this.state.selectedMode}
          />
        ) : null}
        {this.state.balanceAmount != '' && (
          <CostCalculation
            docStatus={docStatus}
            isComingFromMyVoucher={isComingFromMyVoucher}
            withoutBill={this.state.withoutBillFlag}
            dependents={isComingFromMyVoucher ? this.props.empData[0].Relations : this.state.updatedDependents}
            costData={this.state.expenseDetailObj}
            updateDataForFiles={(data)=>this.updateExpenseDetailObject(data)}
            updateFileSystem={(files)=>this.updateFileObject(files)}
          />
        )}
        {this.state.balanceAmount != '' && <CertifyView />}
        {this.state.balanceAmount != '' && !disable && (
          <SubmitTo
            documentNumber={this.state.documentNumber !== '' ? this.state.documentNumber : 'LTA0001'}
            setSupervisor={this.receiveSupervisor}
            submitDetails={this.submitDetails}
            deleteVoucher={this.deleteVoucher}
          />
        )}
        {this.props.cvHistoryData && (
          <HistoryView
            historyData={this.props.cvHistoryData}
            forwardedRef={this._panel}
            isComingFromVoucher={true}
            visibility={this.state.modalVisible}
            onClose={() => this.onHistoryClose()}
          />
        )}
      </KeyboardAwareScrollView>
      </ImageBackground>
    );
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    fetchCVEmployeeData: (empCode, authToken, docNumber, getCategoryCallBack) =>
      dispatch(cvFetchEmployeeData(empCode, authToken, docNumber, getCategoryCallBack)),
    historyCV: (docNo, callBack) => dispatch(cvFetchHistory(docNo, callBack)),
    resetHistory: () => dispatch(resetCvHistoryData()),
  };
};

const mapStateToProps = (state) => {
  return {
    loginData: state && state.loginReducer && state.loginReducer.loginData,
    empData: state.cvReducer.cvEmployeeData,
    reducerLoading: state.cvReducer.cvLoader,
    cvHistoryData: state && state.cvReducer && state.cvReducer.cvHistoryData,
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateLtaVoucher);

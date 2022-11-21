import React, { Component } from 'react';
import { BackHandler, Text,View } from 'react-native';
import { connect } from 'react-redux';
import { globalFontStyle } from '../../../components/globalFontStyle';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import SubHeader from '../../../GlobalComponent/SubHeader';
import { EmpDetail } from './empDetail';
import { ExpenseDetail } from './expenseDetail';
import { uploadData, getLineItems, deleteFile, validateDetails, removeVoucher, fetchBalance,fetchCreateModifyStopData } from './utils';
import { LineItemDetails } from './lineItemDetails';

import { showToast } from '../../../GlobalComponent/Toast';
import ActivityIndicatorView from '../../../GlobalComponent/myActivityIndicator';

import { SubmitTo } from './submitTo';
import { cvFetchEmployeeData, cvFetchHistory, resetCvHistoryData } from '../createVoucher/cvAction';

import { HistoryView } from '../../../GlobalComponent/HistoryView/HistoryView';
import { moderateScale } from '../../../components/fontScaling';
import { TouchableOpacity } from 'react-native';

import { styles } from '../../../GlobalComponent/LabelText/styles';

import { BalanceView } from './balanceDetail';
import properties from '../../../resource/properties';
import { WarningMessage } from '../../../GlobalComponent/WarningMessage/WarningMessage';
let constants = require('./constants');
let globalConstants = require('../../../GlobalConstants');
let projData,costCenterData,expData, docStatus, isComingFromMyVoucher;
class CreateGenericVouchers extends Component {
	constructor(props) {
		super(props);
		previousScreenData = this.props.navigation.state.params;
		isComingFromMyVoucher = previousScreenData.isComingFromMyVoucher;
		this.state = {
			catID: this.props.navigation.state.params.CatID,
			title: this.props.navigation.state.params.Title,
			remarks: '',
			cvLineItemDataArray: [],
			documentNumber: isComingFromMyVoucher ? previousScreenData.docDetails.DocNo : '',
			editableFile: undefined,
			resetExpense: undefined,
			editExpense: undefined,
			editCase: false,
			superVisorCode: '',
			requestStatus: docStatus !== undefined && isComingFromMyVoucher ? docStatus : 0,
			loading: false,
			historyToggle: false,
			balanceAmount: '',
			reimburseAmount:'',
			modalVisible: false,
			modificationStopMessage:'',
			isFreezed:false,
			renderView:true,
		};
		this._panel = React.createRef();
	}
	onBack = () => {
		this.setState({ requestStatus: 0 }, () => {
			this.props.navigation.pop();
		});
	}
	handleBackButtonClick = () => {
		this.onBack();
		return true;
	}

	async componentDidMount() {
		let amount,reimburseAmountVal;
		if (isComingFromMyVoucher) {
			previousScreenData = this.props.navigation.state.params;
			isComingFromMyVoucher = previousScreenData.isComingFromMyVoucher;
			docDetails = previousScreenData.docDetails;
			docStatus = docDetails.StatusCode;
			this.setState({ requestStatus: docStatus }, () => {
				console.log('previous screen doc details : ', docDetails);
				this.props.fetchCVEmployeeData(this.props.loginData.SmCode, this.props.loginData.Authkey, docDetails.DocNo, () => {
					this.getLineItemDetails(docDetails.DocNo);
					this.props.historyCV(docDetails.DocNo);
					this.checkIfModificationValid();
					switch (this.state.catID) {
						case '6':
							amount = this.props.empData[0].MobileBalanceKitty;
							reimburseAmountVal = this.props.empData[0].IsDataCard == 'Y' ? this.props.empData[0].MobileReimbursement : undefined;
							console.log('reimburseAmountVal in if condition  : ', reimburseAmountVal);
							break;
						case '5':
							amount = this.props.empData[0].PetBalance;
							break;
						case '4':
							amount = this.props.empData[0].DrvBalance;
							break;
						case '7':
							amount = this.props.empData[0].MedBalance;
							break;
					}
					this.setState({ balanceAmount: amount,reimburseAmount:reimburseAmountVal},()=>{
						this.updateProjectData();
					});
				});
			});
		} else {
			this.props.fetchCVEmployeeData(this.props.loginData.SmCode, this.props.loginData.Authkey, '', async () => {
				this.setState({ loading: true });
				switch (this.state.catID) {
					case '6':
						let combinedBalance = await fetchBalance(properties.fetchMobileBalance, this.state.catID);
						let vals = combinedBalance.split(':');
						console.log('Splitted vals  : ', vals);
						amount = vals[0];
						reimburseAmountVal = vals[2] == 'Y' ? vals[1] : undefined;
						console.log('reimburseAmountVal in else condition  : ', reimburseAmountVal);
						break;
					case '5':
						amount = await fetchBalance(properties.fetchPetrolBalance, this.state.catID);
						break;
					case '4':
						amount = await fetchBalance(properties.fetchDriverBalance, this.state.catID);
						break;
					case '7':
						amount = await fetchBalance(properties.fetchMedicalBalance, this.state.catID);
						break;
				}
				this.setState({ loading: false, balanceAmount: amount ,reimburseAmount:reimburseAmountVal},()=>{
					this.updateProjectData();
				});
			});
		}
		BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
	}

	updateProjectData=()=>{
		if (this.props.empData && this.props.empData.length > 0 && this.props.empData[0].PROJ_CODE !== '') {
			let emp = this.props.empData[0];
			let projItem = {};
			projItem.CCCode = emp.CC_CODE;
			projItem.CCText = emp.CC_TXT;
			projItem.ProjectCode = emp.PROJ_CODE;
			projItem.ProjectText = emp.PROJ_TXT;
			projItem.Value = emp.PROJ_CODE;
			projData = projItem;
			this.setState({loading:false});
		}
	}
	componentWillUnmount() {
		this.props.resetHistory();
		projData = undefined;
		expData = undefined;
		docStatus = undefined;
		BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
	}

	lineItemEdit = (idx) => {
		let file = this.state.cvLineItemDataArray[idx];
		console.log('Line item is editing :', file);
		if (file == undefined) {return;}
		this.setState({ editableFile: file, editCase: true }, () => {
			let editLineItem = this.state.editExpense;
			console.log('Line item edit function is :', editLineItem);
			if (editLineItem !== undefined) {
				editLineItem(file);
			}
		});
	}

	lineItemDelete = async (idx) => {
		let file = this.state.cvLineItemDataArray[idx];
		if (file == undefined) {return;}
		this.setState({ loading: true });
		let deleteResponse = await deleteFile(file.RowId);
		this.setState({ loading: false });
		if (deleteResponse.status && deleteResponse.status == 'success') {
			this.getLineItemDetails(this.state.documentNumber);
		}
	}

	getLineItemDetails = async (documentNumber) => {
		if (documentNumber !== '' || documentNumber !== null || documentNumber !== undefined) {
			this.setState({ loading: true });
			let newLineItems = await getLineItems(documentNumber);
			this.setState({ loading: false });
			console.log('Updated line items : ', newLineItems);
			this.setState({ cvLineItemDataArray: newLineItems }, () => {
				let resetFunction = this.state.resetExpense;
				if (resetFunction !== undefined) {resetFunction();}
			});
		}
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

	validates = async (expenseData) => {
		let validityStatus = false;
		let lineItems = this.state.cvLineItemDataArray.map((item) => item.MemoNo);
		if (projData == undefined || projData == '' || projData == null) {
			showToast(constants.PROJECT_REQUIRED);
		} else if (expenseData.billNumber == '') {
			switch (this.state.catID) {
				case '6':
					showToast(constants.BILL_REQUIRED);
				case '5':
					showToast(constants.CASH_MEMO_REQUIRED);
				case '7':
					showToast(constants.CASH_MEMO_REQUIRED);
			}
		} else if (lineItems.indexOf(expenseData.billNumber) > -1 && !this.state.editCase) {
			showToast(constants.BILL_MATCHED);
		} else if (expenseData.phoneNumber == '' && this.state.catID == '6') {
			showToast(constants.PHONE_REQUIRED);
		} else if (JSON.stringify(expenseData.purpose) === '{}' && this.state.catID == '6') {
			showToast(constants.PURPOSE_REQUIRED);
		} else if (expenseData.particulars == '') {
			showToast(constants.PARTICULAR_REQUIRED);
		} else if (expenseData.amount == '') {
			showToast(constants.AMOUNT_REQUIRED);
		} else if (isNaN(expenseData.amount) || parseInt(expenseData.amount) < 1) {
			showToast(constants.AMOUNT_NOT_VALID);
		} else if (this.state.balanceAmount < 0 || parseInt(expenseData.amount) > parseInt(this.state.balanceAmount)) {
			showToast(constants.BAL_NOT_SUFFICIENT);
		} else {
			let validateResponse = await validateDetails(this.state.documentNumber, this.props.empData[0], projData, expenseData, this.state.editableFile, this.state.catID);
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
	deleteVoucher = async () => {
		this.setState({ loading: true });
		let response = await removeVoucher(this.state.documentNumber);
		console.log('Delete voucher response is :', response.message);
		this.setState({ loading: false }, () => {
			setTimeout(() => {
				// showToast(response.message);
				this.success(response);
			}, 500);
		});
	}
	submitDetails = async (submitTo, remarks) => {
		previousScreenData = this.props.navigation.state.params;
		console.log('Submit To : ', submitTo);
		console.log('CAT ID : ', this.state.catID);
		let filesAttached = [].concat.apply([], this.state.cvLineItemDataArray.map((item) => item?.LstUploadFiles));
		let response;

		if (previousScreenData?.isFileRequired == 'YES' && filesAttached?.length < 1){
			if (this.state.catID == 4){
				return showToast('Please upload Driver Driving Licence and invoice for the month at each row.');
			}
			else {
				return showToast('Please attach at least one supporting document with each expense line item.');
			}
		}
		else if (submitTo == '') {
			showToast('Please select to whom you want to submit');
			return;
		} else if (remarks == '') {
			showToast('Please enter the remarks before submit.');
			return;
		} else if (submitTo == 'Supervisor') {
			if (this.state.superVisorCode == '') {
				showToast('Please select the supervisor.');
				return;
			} else {
				this.setState({ loading: true });
				try {
					response = await uploadData(expData, projData, this.props.empData[0], remarks, 1, this.state.documentNumber, this.state.editableFile, this.state.editCase, this.state.superVisorCode, this.state.catID,this.state.balanceAmount,this.state.reimburseAmount);
					this.setState({ loading: false });
				} catch (error){
					this.setState({ loading: false },()=>{
						setTimeout(()=>{
							alert(error);
						},1000);
					});
				}
				this.setState({ loading: false }, () => {
					setTimeout(() => {
						this.success(response);
					}, 500);
				});
			}
		} else if (submitTo == 'FSO') {
			let response;
			console.log('Submitting to FSO');
			if (this.state.catID == '4') {
				let isDlPrersent = filesAttached.some( file => file?.DocumentType == 'DL');
				let isInvoicePresent = this.state.cvLineItemDataArray.map((item) => {
					return item.LstUploadFiles.some( file => file.DocumentType == 'Invoice');
				});
				console.log('Is InvoicePresent : ', isInvoicePresent);
				if (!isDlPrersent){
					return showToast('Please submit at least one supporting document for DL.');
				}
				if (isInvoicePresent.some(isPresent => isPresent == false)){
					return showToast('Please submit the supporting document for Invoice for each record.');
				}
			}
			this.setState({ loading: true });
			try {
				response = await uploadData(expData, projData, this.props.empData[0], remarks, 1, this.state.documentNumber, this.state.editableFile, this.state.editCase, '', this.state.catID,this.state.balanceAmount,this.state.reimburseAmount);
				this.setState({ loading: false });
			} catch (error){
				this.setState({ loading: false },()=>{
					setTimeout(()=>{
						alert(error);
					},1000);
				});
			}
			console.log('Final submit response for FSO :', response);
			this.setState({ loading: false }, () => {
				setTimeout(() => {
					this.success(response);
				}, 500);
			});
		}
	}
	success = (response) => {
		if (response && response.message && response.message.includes('successfully')) {
			this.setState({ requestStatus: 0 }, () => {
				showToast(response.message);
				this.props.navigation.navigate('VoucherDashBoard');
			});
		}
	}
	receiveExpenseData = async (expenseData) => {
		let response;
		const { documentNumber } = this.state;
		let flag = await this.validates(expenseData);
		console.log('Validation flag is : ', flag);
		if (!flag) {return;}
		expData = expenseData;
		this.setState({ loading: true });
		try {
			response = await uploadData(expenseData, projData, this.props.empData[0], this.state.remarks, 0, documentNumber, this.state.editableFile, this.state.editCase, '', this.state.catID, this.state.balanceAmount,this.state.reimburseAmount);
			this.setState({ loading: false });
		} catch (error){
			this.setState({ loading: false },()=>{
				setTimeout(()=>{
					alert(error);
				},1000);

			});
		}
		console.log('Response of upload is : ', response);
		if (response && response.status && response.DocumentNo !== undefined) {
			this.setState({ documentNumber: response.DocumentNo, editCase: false }, () => {
				this.getLineItemDetails(response.DocumentNo);
			});
		}
	}

	receiveProjectData = (projectData) => {
		console.log('Project  data : ',projData);
		console.log('Cost center data : ',costCenterData);
		let emp = this.props.empData[0];
			let projItem = {};
			projItem.CCCode = costCenterData !== undefined ? costCenterData.ID : emp.CC_CODE;
			projItem.CCText = costCenterData !== undefined ? costCenterData.DisplayText.split('~')[1] : emp.CC_TXT;
			projItem.ProjectCode = projectData.ID;
			projItem.ProjectText = projectData.DisplayText.split('~')[1];
			projItem.Value = projectData.DisplayText.split('~')[1];
			projData = projItem;
	}
	receiveCostCenterData = (costData) => {
		costCenterData = costData;
		projData = undefined;
		// console.log("Cost center data : ",costCenterData)
	}
	receiveSupervisor = (supervisor) => {
		this.setState({ superVisorCode: supervisor.Value });
	}
	setEditDeleteCallBacks = (resetCallBack, editCallBack) => {
		this.setState({ resetExpense: resetCallBack, editExpense: editCallBack });
	}
	setLineItemArray = (data) => {
		this.setState({ cvLineItemDataArray: data},()=>{
			console.log('CV Line Item Array updated : ', this.state.cvLineItemDataArray);

		});
	}
	historyView = () => {
		return (
			<View
				style={{
					alignItems: 'flex-end',
					marginRight: moderateScale(6),
					marginVertical: moderateScale(3),
				}}>
				<TouchableOpacity
					onPress={() => {
						this.setState({ modalVisible: true });
					}}>
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
	getTotalAmount=()=>{
		let amount = 0;
		if (this.state.cvLineItemDataArray.length > 0){
			this.state.cvLineItemDataArray.map(item=>{
              amount = amount + item.Amount;
			});
		}
		return amount;
	}

	render() {
		let loader = this.props.reducerLoading || this.state.loading;
		let disableVal = (this.state.requestStatus == undefined || this.state.requestStatus == null || this.state.requestStatus == 0 || this.state.requestStatus == 1 ||  this.state.requestStatus == 5 || this.state.requestStatus == 7 ) ? false : true;
		const { balanceAmount,reimburseAmount } = this.state;
		return (
			<KeyboardAwareScrollView>
				<ActivityIndicatorView loader={loader} />
				<SubHeader pageTitle={this.state.title} backVisible={true} logoutVisible={true} handleBackPress={() => this.onBack()} navigation={this.props.navigation} />
				{isComingFromMyVoucher && this.props.cvHistoryData.length > 0 ? this.historyView() : null}
				{this.state.modificationStopMessage !== '' && <WarningMessage message = {this.state.modificationStopMessage}/>}
				{this.props.empData.length > 0 && <EmpDetail isFreezed={this.state.isFreezed} docNubmer = {this.state.documentNumber} emp={this.props.empData} setProjectData={this.receiveProjectData} setCostCenterData={this.receiveCostCenterData} isEdit={this.state.cvLineItemDataArray.length > 0} requestStatus={this.state.requestStatus}/>}
				{this.props.empData.length > 0 && <BalanceView lineItems={this.state.cvLineItemDataArray} emp={this.props.empData} catID={this.state.catID} heading={'Mobile Balance - Kitty : '} balanceAmount={balanceAmount} reimburseAmount={reimburseAmount} />}
				{this.props.empData.length > 0 && (this.state.requestStatus == 0 || this.state.requestStatus == 1 || this.state.requestStatus == 5 || this.state.requestStatus == 7 || this.state.requestStatus == 12 || this.state.requestStatus == 14) && <ExpenseDetail isFreezed={this.state.isFreezed} emp={this.props.empData} setExpenseDetails={this.receiveExpenseData} editableFile={this.state.editableFile} editCase={this.state.editCase} setEditDeleteCallBacks={this.setEditDeleteCallBacks} catID={this.state.catID} />}
				{this.state.cvLineItemDataArray.length > 0 ? <LineItemDetails isFileRequired={previousScreenData?.isFileRequired} isFreezed={this.state.isFreezed} lineItems={this.state.cvLineItemDataArray} lineItemArrayCallBack={this.setLineItemArray} lineItemDelete={this.lineItemDelete} lineItemEdit={this.lineItemEdit} catID={this.state.catID} disableProp={disableVal} /> : null}
				{
					this.state.cvLineItemDataArray.length > 0 &&
					<><View style={styles.recordSeparatorLine} /><View style={styles.totalAmountView}>
						<Text style={styles.totalAmountText}>{globalConstants.TOTAL_AMOUNT_TEXT}</Text>
						<Text style={styles.totalAmountValue}>{this.getTotalAmount() + ' (' + 'INR' + ')'}</Text>
					</View><View style={styles.recordSeparatorLine} /></>
	            }
				{this.state.documentNumber !== undefined && this.state.documentNumber !== null && this.state.documentNumber !== '' && this.state.cvLineItemDataArray.length > 0 && (this.state.requestStatus == 0 ||  this.state.requestStatus == 1 || this.state.requestStatus == 5 || this.state.requestStatus == 7) && this.state.modificationStopMessage == ''  && <SubmitTo documentNumber={this.state.documentNumber} setSupervisor={this.receiveSupervisor} submitDetails={this.submitDetails} deleteVoucher={this.deleteVoucher} myEmpData={this.props.empData} />}
				<HistoryView historyData={this.props.cvHistoryData} forwardedRef={this._panel} isComingFromVoucher={true} visibility={this.state.modalVisible} onClose={() => this.onHistoryClose()} />
			</KeyboardAwareScrollView>
		);
	}
}
const mapDispatchToProps = (dispatch) => {
	return {
		fetchCVEmployeeData: (empCode, authToken, docNumber, getCategoryCallBack) => dispatch(cvFetchEmployeeData(empCode, authToken, docNumber, getCategoryCallBack)),
		historyCV: (docNo) => dispatch(cvFetchHistory(docNo)),
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
)(CreateGenericVouchers);

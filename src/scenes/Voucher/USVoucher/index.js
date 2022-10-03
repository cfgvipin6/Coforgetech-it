/*
Author: Mohit Garg(70024)
*/

import React, { Component } from 'react';
import { View, Text, ImageBackground } from 'react-native';
import { employeeDetail} from '../createVoucher/cvUtility';
import { cvFetchEmployeeData, cvFetchHistory, resetCvHistoryData } from '../createVoucher/cvAction';
import ActivityIndicatorView from '../../../GlobalComponent/myActivityIndicator';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import { globalFontStyle } from '../../../components/globalFontStyle';
import SubHeader from '../../../GlobalComponent/SubHeader';
import { VoucherInfoView } from './voucherInfoView';
import { connect } from 'react-redux';
import _ from 'lodash';
import { ExpenseDetailOneUS } from './expenseDetailOne/expenseDetailOneUS';
import { UsExpenseDetailTwo } from './expenseDetailTwo/UsExpenseDetailTwo';
import { deleteFile, getExpenseTypes, getLineItems, removeVoucher, uploadData } from './utils';
import { ExpenseTypes } from './ExpenseType';
import UserMessage from '../../../components/userMessage';
import helper from '../../../utilities/helper';
import { LineItemDetails } from './lineItemDetails';
import { getFiles, MultiAttachmentView } from '../../../GlobalComponent/MultiAttachments/MultiAttachmentView';
import { SubmitTo } from '../createGenericVoucher/submitTo';
import { showToast } from '../../../GlobalComponent/Toast';
import { moderateScale } from '../../../components/fontScaling';
import { TouchableOpacity } from 'react-native';
import { HistoryView } from '../../../GlobalComponent/HistoryView/HistoryView';
import images from '../../../images';
let globalConstants = require('../../../GlobalConstants');
let projData = {},
  expData,
  docStatus,
  isComingFromMyVoucher;
let categoryDataId;
let expenseTypeDataValue;
let usAdditionalData = {};
export class CreateUSVoucherScreen extends Component {
  constructor(props) {
    super(props);
    previousScreenData = this.props.navigation.state.params;
    docDetails = previousScreenData.docDetails;
    isComingFromMyVoucher = previousScreenData.isComingFromMyVoucher;
    usAdditional = previousScreenData.usAdditionalDetails;

    categoryData = previousScreenData.categoryDetails;
    prevScreenProjectValue = previousScreenData.myProject;
    prevScreenCostCenterValue = previousScreenData.myCostCenter;
    this.state = {
      expenseTypes: [],
      expenseType: {},
      expenseDetail: {},
      cvLineItemDataArray: [],
      documentNumber: isComingFromMyVoucher ? previousScreenData.docDetails.DocNo : '',
      editableFile: undefined,
      resetExpense: undefined,
      resetExpenseType: undefined,
      editExpense: undefined,
      updateExpenseType: undefined,
      editCase: false,
      superVisorCode: '',
      // requestStatus:docStatus !== undefined && isComingFromMyVoucher ? docStatus : 0,
      requestStatus: docStatus !== undefined && isComingFromMyVoucher ? previousScreenData.docDetails.StatusCode : 0,
      loading: false,
      historyToggle: false,
      balanceAmount: '',
      reimburseAmount: '',
      modalVisible: false,
      catID: isComingFromMyVoucher ? previousScreenData.CatID : previousScreenData.categoryDetails.id,
      remarks: '',
      empData: undefined,
      showModal: false,
      isLogoutError: false,
      popUpHeading: '',
      popUpMessage: '',
      shouldFormVisible: false,
    };
    this._panel = React.createRef();
  }

  getCategoryCallBack = (docNumber) => {
      this.props.fetchCVEmployeeData(
        this.props.loginData.SmCode,
        this.props.loginData.Authkey,
        docNumber,
        () => {
          console.log('this.isDocumentSaved()',this.isDocumentSaved());
          console.log('usAdditional',usAdditional);
          let empData = this.props.empData[0];
          if (empData){
            usAdditionalData.billableToClientIdValue = this.isDocumentSaved() == true  ? usAdditional.billableToClientIdValue :  empData.Billable;
            usAdditionalData.contractIdValue = this.isDocumentSaved() == true  ? usAdditional.contractIdValue :   empData.ContractId;
            usAdditionalData.relocationFromToValue = this.isDocumentSaved() == true ? usAdditional.relocationFromToValue :  empData.TripName;
            usAdditionalData.purposeValue = this.isDocumentSaved() == true ? usAdditional.purposeValue :  empData.UsPurpose;
            usAdditionalData.accompaniedByValue = this.isDocumentSaved() == true ? usAdditional.accompaniedByValue :  empData.AccompaniedBy;
            usAdditionalData.transferTypeValue = this.isDocumentSaved() == true ? usAdditional.transferTypeValue :  empData.TravelType;
            usAdditionalData.billableToClientValue = this.isDocumentSaved() == true ? usAdditional.billableToClientValue :  empData.Billable == 2 ? 'No' : 'Yes';
            usAdditionalData.clientIdValue = this.isDocumentSaved() == true ? usAdditional.clientIdId :   empData.ClientName;
            usAdditionalData.clientIdId = this.isDocumentSaved() == true ? usAdditional.clientIdId :   empData.ClientName;
            usAdditionalData.clientIdDisplayText  = this.isDocumentSaved() == true ? usAdditional.clientIdValue :   empData.ClientNameText;
            categoryDataId = empData.Category;
            categoryDataDisplayText = empData.CategoryName;
            prevScreenProjectValue = this.isDocumentSaved() == true ? previousScreenData.myProject : empData.PROJ_CODE + '~' + empData.PROJ_TXT;
            prevScreenCostCenterValue = this.isDocumentSaved() == true ? previousScreenData.myCostCenter : empData.CC_CODE + '~' + empData.CC_TXT;
            this.setState({ empData: this.props.empData[0],loading:false }, () => {
              this.getLineItemDetails(docDetails.DocNo);
              this.props.historyCV(docDetails.DocNo);
            });
          }
        }
      );
  }
  componentDidMount = async () => {
    let result;
    console.log('Previous Screen data : ', previousScreenData);
    categoryData = previousScreenData.categoryDetails;
    categoryDataId = isComingFromMyVoucher ? this.state.catID : categoryData.id;
    try {
      this.setState({loading:true});
      result = await getExpenseTypes(categoryDataId);
      this.setState({loading:false});
    } catch (error){
      this.setState({loading:false},()=>{
        alert(error);
      });
    }
    this.setState({ expenseTypes: result });
    if (isComingFromMyVoucher) {
      let expenseTypeObj = {};
      expenseTypeObj.ID = 0;
      expenseTypeObj.DisplayText = 'Select';
      this.setState({ requestStatus: previousScreenData.docDetails.StatusCode, expenseType: expenseTypeObj }, () => {
        categoryDataId = docDetails.Category;
        if (docDetails.DocNo){
          this.setState({loading:true});
          this.getCategoryCallBack(docDetails.DocNo);
        } else {
          this.getCategoryCallBack('');
        }
      });
    } else {
      usAdditionalData = previousScreenData.usAdditionalDetails;
      usAdditionalData.clientIdDisplayText = usAdditionalData.clientIdValue;
      console.log('US additional data : ', usAdditionalData);
      contractId = usAdditionalData.contractIdValue;
      relocationFromTo = usAdditionalData.relocationFromToValue;
      purpose = usAdditionalData.purposeValue;
      accompaniedBy = usAdditionalData.accompaniedByValue;
      relocationType = usAdditionalData.transferTypeValue;
      billableToClient = usAdditionalData.billableToClientValue;
      clientId = usAdditionalData.clientIdValue;
      clientIdId = usAdditionalData.clientIdId;
      categoryDataDisplayText = categoryData.displayText;
      prevScreenProjectValue = previousScreenData.myProject;
      prevScreenCostCenterValue = previousScreenData.myCostCenter;
      this.setState({ empData: this.props.empData[0] });
    }
  }

  onBack = () => {
    this.props.navigation.pop();
  }

  handleBack = () => {
    setTimeout(() => {
      this.props.navigation.navigate('VoucherDashBoard');
    }, 200);
  }

  checkError = (apiResponse) => {
    if (
      Array.isArray(apiResponse) &&
      apiResponse.length == 1 &&
      apiResponse[0].hasOwnProperty('StatusCode') &&
      apiResponse[0].hasOwnProperty('Exception')
    ) {
      if (apiResponse[0].StatusCode == 404) {
        this.setState({
          showModal: true,
          isLogoutError: true,
          popUpHeading: 'Error!',
          popUpMessage: apiResponse[0].Exception,
        });
      } else {
        this.setState({
          showModal: true,
          isLogoutError: false,
          popUpHeading: globalConstants.ATTENTION_HEADING_TEXT,
          popUpMessage: apiResponse[0].Exception,
        });
      }
    }
  }

  setExpenseTypeCallBacks = (updateCallBack, resetExpenseType) => {
    this.setState({ updateExpenseType: updateCallBack, resetExpenseType: resetExpenseType });
  }
  setEditDeleteCallBacks = (resetCallBack, editCallBack) => {
    this.setState({ resetExpense: resetCallBack, editExpense: editCallBack });
  }
  getExpense = (data) => {
    expenseTypeDataValue = data;
    this.setState({ expenseType: {}, shouldFormVisible: true }, () => {
      this.setState({ expenseType: data }, () => {
      });
    });
  }

  getLineItemDetails = async (documentNumber) => {
    if (documentNumber !== '' || documentNumber !== null || documentNumber !== undefined) {
      this.setState({ loading: true });
      let newLineItems = await getLineItems(documentNumber);
      this.setState({ loading: false });
      this.checkError(newLineItems);
      this.setState({ cvLineItemDataArray: newLineItems, shouldFormVisible: false }, () => {
        let resetFunction = this.state.resetExpense;
        let resetExpenseTypeFunction = this.state.resetExpenseType;
        if (resetFunction !== undefined && newLineItems.length > 0) {
          resetFunction(newLineItems[newLineItems.length - 1]);
        }
        if (resetExpenseTypeFunction !== undefined) {
          resetExpenseTypeFunction();
          // let expenseTypeData = this.state.expenseType;
          // expenseTypeData.DisplayText = "Select";
          this.setState({ expenseType: expenseTypeDataValue });
        }
      });
    }
  }

  deleteVoucher = async () => {
    this.setState({ loading: true });
    let response = await removeVoucher(this.state.documentNumber);
    this.setState({ loading: false }, () => {
      this.checkError(response);
      if (response.status && response.status === 'success') {
        setTimeout(() => {
          this.success(response);
        }, 200);
      }
    });
  }

  dialogueModalView = () => {
    return (
      <UserMessage
        modalVisible={this.state.showModal}
        heading={this.state.popUpHeading}
        message={this.state.popUpMessage}
        okAction={() => {
          this.setState(
            {
              showModal: false,
              popUpHeading: '',
              popUpMessage: '',
            },
            () => {
              if (this.state.isLogoutError) {
                helper.onOkAfterError(this);
              } else {
                this.handleBack();
              }
            }
          );
        }}
      />
    );
  }

  getExpenseDetails = async (data) => {
    let expenseType = {};
    if (data.expenseId !== undefined) {
      expenseType.ID = data.expenseId;
    } else {
      expenseType = this.state.expenseType;
    }
    projData.CCCode =
      previousScreenData !== undefined && previousScreenData.myCostCenter
        ? previousScreenData.myCostCenter.split('~')[0]
        : this.props.empData[0].CC_CODE;
    projData.CCText =
      previousScreenData !== undefined && previousScreenData.myCostCenter
        ? previousScreenData.myCostCenter.split('~')[1]
        : this.props.empData[0].CC_TXT;
    projData.ProjectCode =
      previousScreenData !== undefined && previousScreenData.myProject
        ? previousScreenData.myProject.split('~')[0]
        : this.props.empData[0].PROJ_CODE;
    const { documentNumber } = this.state;
    // let flag = await this.validates(expenseType)
    // console.log("Validation flag is : ", flag)
    // if (!flag) return
    expData = data;
    this.setState({ loading: true });
    let response = await uploadData(
      expData,
      projData,
      this.props.empData[0],
      this.state.remarks,
      0,
      documentNumber,
      this.state.editableFile,
      this.state.editCase,
      '',
      this.state.catID,
      this.state.balanceAmount,
      this.state.reimburseAmount,
      usAdditionalData,
      expenseType
    );
    this.setState({ loading: false });
    this.checkError(response);
    if (response.status && response.status === 'success' && response.DocumentNo !== undefined) {
      this.setState({ documentNumber: response.DocumentNo, editCase: false }, () => {
        this.getLineItemDetails(response.DocumentNo);
      });
    }
  }

  lineItemEdit = (file) => {
    if (file == undefined) {return;}
    let expenseTypeData = {};
    expenseTypeData.ID = file.TypeofExpense;
    expenseTypeData.DisplayText = file.ExpenseTypeHeaderText;
    this.setState({ expenseType: expenseTypeData }, () => {
      this.setState({ editableFile: file, editCase: true, shouldFormVisible: true }, () => {
        setTimeout(() => {
          let editLineItem = this.state.editExpense;
          let reset = this.state.resetExpense;
          if (editLineItem !== undefined) {
            let updateItem = this.state.updateExpenseType;
            let reset = this.state.resetExpense;
            if (updateItem !== undefined) {updateItem(file);}
            // if (reset !== undefined) reset()
            editLineItem(file);
          }
        }, 1000);
      });
    });
  }

  lineItemDelete = async (file) => {
    if (file == undefined) {return;}
    this.setState({ loading: true });
    let deleteResponse = await deleteFile(file.RowId);
    this.setState({ loading: false });
	  this.checkError(deleteResponse);
    if (deleteResponse.status && deleteResponse.status === 'success') {
      this.getLineItemDetails(this.state.documentNumber);
    }
  }
  setLineItemArray = (data) => {
    this.setState({ cvLineItemDataArray: data });
  }
  setAttachmentArray = (data) => {
    this.setState({ cvLineItemDataArray: data }, () => {
      console.log('Data in setAttachmentArray call back : ', this.state.cvLineItemDataArray);
    });
  }
  receiveSupervisor = (supervisor) => {
    this.setState({ superVisorCode: supervisor.Value });
  }
  submitDetails = async (submitTo, remarks) => {
    if (this.state.cvLineItemDataArray[0]?.LstUploadFiles?.length < 1 || this.state.cvLineItemDataArray[0]?.LstUploadFiles == null) {
      return showToast('Please attach at least one supporting document.');
    } else if (submitTo == '') {
     return showToast('Please select to whom you want to submit');
    } else if (remarks == '') {
     return showToast('Please enter the remarks before submit.');
    } else if (submitTo == 'Supervisor') {
      if (this.state.superVisorCode == '') {
        showToast('Please select the supervisor.');
        return;
      } else {
        projData.CCCode =
      previousScreenData !== undefined && previousScreenData.myCostCenter
        ? previousScreenData.myCostCenter.split('~')[0]
        : this.props.empData[0].CC_CODE;
    projData.CCText =
      previousScreenData !== undefined && previousScreenData.myCostCenter
        ? previousScreenData.myCostCenter.split('~')[1]
        : this.props.empData[0].CC_TXT;
    projData.ProjectCode =
      previousScreenData !== undefined && previousScreenData.myProject
        ? previousScreenData.myProject.split('~')[0]
        : this.props.empData[0].PROJ_CODE;
        this.setState({ loading: true });
        let response = await uploadData(
          expData,
          projData,
          this.props.empData[0],
          remarks,
          1,
          this.state.documentNumber,
          this.state.editableFile,
          this.state.editCase,
          this.state.superVisorCode,
          this.state.catID,
          this.state.balanceAmount,
          this.state.reimburseAmount,
          usAdditionalData,
          this.state.expenseType
        );
        // let response = await uploadData(expData, projData, this.props.empData[0], remarks, 1, this.state.documentNumber, this.state.editableFile, this.state.editCase, this.state.superVisorCode, this.state.catID, this.state.balanceAmount, this.state.reimburseAmount)
        console.log('Final submit response for Supervisor :', response);
        this.setState({ loading: false }, () => {
			this.checkError(response);
			if (response.status && response.status === 'success') {
				setTimeout(() => {
					this.success(response);
			  	}, 200);
			}
        });
      }
    } else if (submitTo == 'FSO') {
      projData.CCCode =
      previousScreenData !== undefined && previousScreenData.myCostCenter
        ? previousScreenData.myCostCenter.split('~')[0]
        : this.props.empData[0].CC_CODE;
    projData.CCText =
      previousScreenData !== undefined && previousScreenData.myCostCenter
        ? previousScreenData.myCostCenter.split('~')[1]
        : this.props.empData[0].CC_TXT;
    projData.ProjectCode =
      previousScreenData !== undefined && previousScreenData.myProject
        ? previousScreenData.myProject.split('~')[0]
        : this.props.empData[0].PROJ_CODE;
      this.setState({ loading: true });
      let response = await uploadData(
        expData,
        projData,
        this.props.empData[0],
        remarks,
        1,
        this.state.documentNumber,
        this.state.editableFile,
        this.state.editCase,
        '',
        this.state.catID,
        this.state.balanceAmount,
        this.state.reimburseAmount,
        usAdditionalData,
        this.state.expenseType
      );
      this.setState({ loading: false }, () => {
		this.checkError(response);
		if (response.status && response.status === 'success') {
        	setTimeout(() => {
            	this.success(response);
        	}, 200);
		}
      });
    }
  }

  success = (response) => {
    if (response.message.includes('successfully')) {
      showToast(response.message);
      this.props.navigation.navigate('VoucherDashBoard');
    }
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
  isDocumentSaved=()=>{
    if (this.state.requestStatus == 0 ||
      this.state.requestStatus == 1 ||
      this.state.requestStatus == 5 ||
      this.state.requestStatus == 7 ||
      this.state.requestStatus == 12 ||
      this.state.requestStatus == 14){
        return true;
      } else {
        return false;
      }
  }
  onHistoryClose = () => {
		this.setState({ modalVisible: false }, () => {
		});
	}
  render() {
    console.log('Document number : ', this.state.documentNumber);
    console.log('previous screen  data : ',previousScreenData);
    console.log('CV line item array : ', this.state.cvLineItemDataArray);
    let loader = this.props.reducerLoading || this.state.loading;
    let editableDoc =
      this.state.requestStatus == undefined ||
      this.state.requestStatus == null ||
      this.isDocumentSaved()
        ? false
        : true;
    return (
      <ImageBackground
       source={images.loginBackground}
       style={globalFontStyle.container}>
        <View style={globalFontStyle.subHeaderViewGlobal}>
          <SubHeader
            pageTitle={
              isComingFromMyVoucher ? globalConstants.UPDATE_VOUCHER_TITLE : globalConstants.CREATE_REQUEST_IT_TITLE
            }
            backVisible={true}
            logoutVisible={true}
            handleBackPress={() => this.onBack()}
            navigation={this.props.navigation}
          />
        </View>
        {isComingFromMyVoucher && this.props.cvHistoryData.length > 0 && !this.state.loading ? this.historyView() : null}
        <KeyboardAwareScrollView keyboardShouldPersistTaps="never">
        {/* {isComingFromMyVoucher && this.state.empData != undefined ? employeeDetail(this.props.empData[0]) : null} */}
          {editableDoc && this.state.empData != undefined
            ? employeeDetail(this.props.empData[0])
            : null}
          {this.state.empData != undefined && (
            <VoucherInfoView
              myEmpData={this.props.empData}
              myCategoryId={categoryDataId}
              myCategoryDisplayText={categoryDataDisplayText}
              myProjectValue={prevScreenProjectValue}
              myCostCenterValue={prevScreenCostCenterValue}
              usAdditionalData={usAdditionalData}
              docNumber={this.state.documentNumber}
              requestStatus={this.isDocumentSaved()}
              // myLineItemData={this.state.cvLineItemDataArray}
              // mySaveAndSubmitData={this.state.cvSaveAndSubmitDataArray}
            />
          )}
          {this.state.expenseTypes?.length > 0 && this.isDocumentSaved() && !this.state.loading && (
            <ExpenseTypes
              emp={this.props.empData}
              expenseTypes={this.state.expenseTypes}
              getExpenseData={(data) => this.getExpense(data)}
              expenseTypeCallBack={this.setExpenseTypeCallBacks}
              editCase={this.state.editCase}
            />
          )}
          {!_.isEmpty(this.state.expenseType) &&
          this.props.empData.length > 0 &&
          !this.state.loading &&
          this.isDocumentSaved() &&
          this.state.shouldFormVisible == true ? (
            <ExpenseDetailOneUS
              myExpenseTypeId={this.state.expenseType.ID}
              myEmpData={this.props.empData}
              myCategoryId={this.state.catID}
              isComingFromMyVoucher={isComingFromMyVoucher}
              setExpenseInputData={(data) => {
                this.getExpenseDetails(data);
              }}
              editableFile={this.state.editableFile}
              editCase={this.state.editCase}
              setEditDeleteCallBacks={this.setEditDeleteCallBacks}
              checkError={this.checkError}
            />
          ) : null}
          {this.state.cvLineItemDataArray.length > 0 ? (
            <LineItemDetails
              myEmpData={this.props.empData}
              lineItems={this.state.cvLineItemDataArray}
              lineItemArrayCallBack={this.setLineItemArray}
              lineItemDelete={this.lineItemDelete}
              lineItemEdit={this.lineItemEdit}
              catID={this.state.catID}
              disableProp={editableDoc}
              myExpenseTypeId={this.state.expenseType.ID}
            />
          ) : null}
          {this.state.cvLineItemDataArray.length > 0 && this.state.documentNumber && previousScreenData?.isFileRequired == 'YES' ? (
            <MultiAttachmentView
              heading={globalConstants.ATTACHMENTS_TEXT}
              docNumber={this.state.documentNumber}
              rowId={0}
              files={this.state.cvLineItemDataArray[0]?.LstUploadFiles}
              lineItemArrayCallBack={this.setAttachmentArray}
              lineItems={this.state.cvLineItemDataArray}
              itemIndex={0}
              disable={editableDoc}
            />
          ) : null}
          {this.state.documentNumber !== undefined &&
            this.state.documentNumber !== null &&
            this.state.documentNumber !== '' &&
            this.state.cvLineItemDataArray.length > 0 &&
            this.isDocumentSaved()  &&
            (
              <SubmitTo
                documentNumber={this.state.documentNumber}
                setSupervisor={this.receiveSupervisor}
                submitDetails={this.submitDetails}
                deleteVoucher={this.deleteVoucher}
                categoryDataId={this.state.catID}
                myEmpData={this.props.empData}
              />
            )}
            <HistoryView historyData={this.props.cvHistoryData} forwardedRef={this._panel} isComingFromVoucher={true} visibility={this.state.modalVisible} onClose={() => this.onHistoryClose()} />
        </KeyboardAwareScrollView>
        <ActivityIndicatorView loader={this.state.loading} />
        {this.state.showModal ? this.dialogueModalView() : null}
        {/* <ActivityIndicatorView loader={this.props.cvLoading} />  emp details fetch loader pending */}
      </ImageBackground>
    );
  }
}

const mapStateToProps = (state) => ({
  fetchCVEmployeeData: (empCode, authToken, docNumber, getCategoryCallBack) =>
    dispatch(cvFetchEmployeeData(empCode, authToken, docNumber, getCategoryCallBack)),
  loginData: state && state.loginReducer && state.loginReducer.loginData,
  cvLoading: state.cvReducer && state.cvReducer.cvLoader,
  empData: state.cvReducer.cvEmployeeData,
  cvHistoryData: state && state.cvReducer && state.cvReducer.cvHistoryData,
});

const mapDispatchToProps = (dispatch) => {
  return {
    fetchCVEmployeeData: (empCode, authToken, docNumber, getCategoryCallBack) =>
      dispatch(cvFetchEmployeeData(empCode, authToken, docNumber, getCategoryCallBack)),
    historyCV: (docNo) => dispatch(cvFetchHistory(docNo)),
    resetHistory: () => dispatch(resetCvHistoryData()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateUSVoucherScreen);

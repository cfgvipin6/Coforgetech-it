import React, { Component } from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  TextInput,
  Alert,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { styles } from './styles.js';
import { globalFontStyle } from '../../../components/globalFontStyle';
import { LabelTextNoValue } from '../../../GlobalComponent/LabelText/LabelText';
import { LabelEditText } from '../../../GlobalComponent/LabelEditText/LabelEditText';
import { netInfo } from '../../../utilities/NetworkInfo';
import { fetchPOSTMethod } from '../../../utilities/fetchService';
import { AppStore } from '../../../../AppStore';
import Autocomplete from 'react-native-autocomplete-input';
import { Table, Row, Col, TableWrapper, Rows } from 'react-native-table-component';
import moment from 'moment';
import { MultiAttachmentView } from '../../../GlobalComponent/MultiAttachments/MultiAttachmentView.js';
let constants = require('./constants');
let globalConstants = require('../../../GlobalConstants');
let appConfig = require('../../../../appconfig');
let fileData = [];
export const employeeDetail = (empData) => {
    if (empData && empData != undefined) {
    let docDate = (empData.DocDate === undefined) ? '' : empData.DocDate.replace(/-/g, ' ');
    return (
            <View style={styles.userInfoView}>
              <ImageBackground style={styles.cardBackground} resizeMode="cover">
                {sectionTitle('Employee Personal Details')}
                <View style={styles.cardStyle}>
                <LabelTextNoValue heading={globalConstants.EMPLOYEE_TEXT} description={empData.EMPNO.trim() + ' : ' + empData.NAME.trim()} />
                <LabelTextNoValue heading={constants.CATEGORY_TEXT} description={empData.CategoryName} />
                <LabelTextNoValue heading={constants.PERSONNEL_AREA_TEXT} description={empData.PA.trim() + ' : ' + empData.PATXT.trim()} />
                <LabelTextNoValue heading={globalConstants.COMPANY_CODE_TEXT} description={empData.CO_CODE.trim() + ' : ' + empData.CO_TXT.trim()} />
                <LabelTextNoValue heading={globalConstants.CURRENCY_TEXT} description={empData.CURRENCY} />
                <LabelTextNoValue heading={constants.DOCUMENT_DATE_TEXT} description={docDate} />
                <LabelTextNoValue heading={constants.PLAN_GRADE_TEXT} description={empData.PLAN1} />
                <LabelTextNoValue heading={constants.PERSONNEL_SUB_AREA_TEXT} description={empData.PSA.trim() + ' : ' + empData.PSATXT.trim()} />
                <LabelTextNoValue heading={globalConstants.DOCUMENT_NUMBER_TEXT} description={empData.DocumentNo} />
                <LabelTextNoValue heading={constants.ORGANISATION_UNIT_TEXT} description={empData.OU.trim() + ' : ' + empData.OUTXT.trim()} />
                </View>
              </ImageBackground>
            </View>
    );
  } else {return null;}
  };

  export const myModalView = (myCompThis, showFlag, heading, msg, time) => {
    setTimeout(() => {
      myCompThis.setState({
        showModal: showFlag,
        popUpMessage: msg,
        popUpHeading: heading,
      });
    }, time);
  };

  export const myProjectView = (myCompThis) => {
    return (
      <Autocomplete
        placeholder={'Search Project..'}
        data={myCompThis.state.autoSearchProjectDataArray}
        defaultValue={myCompThis.state.projectSearchValue}
        containerStyle={styles.autocompleteStyle}
        inputContainerStyle={styles.autocompleteInputStyle}
        listStyle={styles.autocompleteListStyle}
        selectTextOnFocus={true}
        hideResults={myCompThis.state.autoCompleteProjectHideResult}
        onChangeText={(text) => myCompThis.onAutoCompleteProjectChangeText(text)}
        renderItem={({ item, i }) => myCompThis.renderAutoCompleteProjectResult(item, i)}
      />
    );
  };

  export const myParticularView = (myCompThis) => {
    return (
      <LabelEditText
        heading={constants.PARTICULAR_TEXT + globalConstants.ASTERISK_SYMBOL}
        placeHolder="Max 50 characters"
        myMaxLength={50}
        myNumberOfLines={2}
        isMultiline={true}
        onTextChanged={myCompThis.onParticularChanged}
        myValue={myCompThis.state.particularInput}
        isSmallFont={true}
        isEditable = {!myCompThis.state.isFreezed}
      />
    );
  };

  export const showEmpDataRowGrid = (itemName, itemValue) => {
    if ((itemValue != '' && itemValue != undefined && itemValue != null)) {
      return (
        <View style={{ flexDirection: 'row' }}>
          <Text style={[styles.textOne,globalFontStyle.imageBackgroundLayout]}>{itemName}</Text>
          <Text style={[styles.textTwo,globalFontStyle.imageBackgroundLayout]}>{itemValue}</Text>
        </View>
      );
    } else {return null;}
  };

  export const sectionTitle = (heading) => {
    return (
      <View style={{backgroundColor: appConfig.VALID_BUTTON_COLOR, flex: 0}}>
        <Text style={{color: appConfig.BLACK_COLOR, fontSize: 18}}>{heading}</Text>
      </View>
    );
  };
  export const sectionSubTitle = (heading) => {
    return (
      <View style={{backgroundColor: appConfig.LOGIN_FIELDS_BACKGROUND_COLOR, flex: 0}}>
        <Text style={{color: appConfig.WHITE_COLOR, fontSize: 14}}>{heading}</Text>
      </View>
    );
  };
  export const sectionTitleWithActionBtn = (heading, itemId, props, isDocumentSaved,freezVal) => {
    return (
      <View style={{backgroundColor: appConfig.DARK_BLUISH_COLOR, flexDirection: 'row', justifyContent: 'space-between', flex: 0}}>
        <Text style={{color: appConfig.WHITE_COLOR}}>{heading}</Text>
        {isDocumentSaved ? <View style={{flexDirection: 'row'}}>
          <TouchableOpacity disabled={freezVal !== undefined ? freezVal : false} onPress={() => {props.lineItemEdit(itemId);}}>
            <Icon name="edit" size={20} color="white"/>
          </TouchableOpacity>
          <TouchableOpacity disabled={freezVal !== undefined ? freezVal : false} onPress={() => {props.lineItemDelete(itemId);}}>
            <Icon name="delete" size={20} color="white"/>
          </TouchableOpacity>
        </View> : null}
      </View>
    );
  };

  export const sectionNewTitle = (heading) => {
    return (
      <View style={{backgroundColor: appConfig.DARK_BLUISH_COLOR, flex: 0}}>
        <Text style={{color: appConfig.WHITE_COLOR, fontSize: 22}}>{heading}</Text>
      </View>
    );
  };

  export const lineItemDetail = (lineItemData, myIndex, itemId, props, isDocumentSaved, index, catId, subCatId, defaultCurrencyIdValue, linItemArray, callBack,freezVal, isFileRequired) => {
    let employeeDetailsData = props.state.cvEmployeeDataArray.length > 0 ? props.state.cvEmployeeDataArray[0] : '';
    console.log('Freezed Val in LineItemDetail : ', lineItemData);
    console.log('Required index : ', 0);
    console.log('Required data : ', lineItemData?.LstUploadFiles[0]);
    if (lineItemData?.LstUploadFiles[0] !== undefined){
       let picData = lineItemData.LstUploadFiles[0];
      let data =  fileData.find((item)=>item.uri == picData.uri);
      console.log('Pic data found : ', data);
      if (data == undefined){
        console.log('Adding pic data : ', picData);
        fileData.push(picData);
      }
    }
   console.log('File Data : ', fileData);
    if (lineItemData && lineItemData != undefined) {
      return (
        <View style={styles.lineItemView}>
          <ImageBackground style={styles.cardBackground} resizeMode="cover">
            {sectionTitleWithActionBtn('Record ' + myIndex, itemId, props, isDocumentSaved,freezVal)}
            <View style={styles.cardStyle}>
              {(catId == 1 || ((catId == 9 || catId == 8 || catId == 10) && employeeDetailsData.ProjectCodeFlag == 'YES')) ?
              showEmpDataRowGrid(globalConstants.COST_CENTER_TEXT, lineItemData.CostCode) : null}
              {(catId == 1 || ((catId == 9 || catId == 8 || catId == 10) && employeeDetailsData.ProjectCodeFlag == 'YES')) ?
              showEmpDataRowGrid(globalConstants.PROJECT_TEXT, lineItemData.ProjectCode) : null}
              {showEmpDataRowGrid((catId == 8) ? globalConstants.START_PLACE_TEXT : constants.FROM_TEXT, lineItemData.LCVFrom)}
              {showEmpDataRowGrid((catId == 8) ? globalConstants.DESTINATION_PLACE_TEXT : constants.TO_TEXT, lineItemData.LCVTo)}
              {showEmpDataRowGrid(constants.EXPENSE_TYPE_TEXT, lineItemData.vc_VoucherText)}
              {showEmpDataRowGrid((catId == 10) ? constants.PERSON_VISIT_AND_PURPOSE_TEXT : constants.PARTICULAR_TEXT, lineItemData.Particulars)}
              {showEmpDataRowGrid(constants.CASH_MEMO_NO_TEXT, lineItemData.MemoNo)}
              {showEmpDataRowGrid((catId == 8) ? globalConstants.START_DATE_TEXT : globalConstants.DATE_TEXT, lineItemData.SMemoDate)}
              {showEmpDataRowGrid(globalConstants.DESTINATION_DATE_TEXT, lineItemData.MemoDate2)}
              {showEmpDataRowGrid(globalConstants.START_TIME_TEXT, lineItemData.FromTime)}
              {showEmpDataRowGrid(globalConstants.DESTINATION_TIME_TEXT, lineItemData.ToTime)}
              {showEmpDataRowGrid(globalConstants.CURRENCY_TEXT, lineItemData.vc_Currency)}
              {showEmpDataRowGrid(constants.MODE_OF_CONVEYANCE_TEXT, lineItemData.LCVModeText)}
              {(catId == 8) ? showEmpDataRowGrid(globalConstants.LOCATION_TEXT, lineItemData.LocationText) : null}
              {showEmpDataRowGrid((catId == 9 || catId == 8) ? constants.EXCH_RATE_TEXT :
                catId == 10 && employeeDetailsData.UKMileageKMFlag != 'YES' ? constants.MILES_TEXT : constants.KM_TEXT, lineItemData.LCVKM != '' ? parseFloat(lineItemData.LCVKM).toFixed(2) : null)}
              {(catId == 2) ? showEmpDataRowGrid(constants.ROUND_TRIP_TEXT, lineItemData.LCVRoundtrip) : null}
              {(catId == 10 && employeeDetailsData.UKMileageCommMilesFlag == 'YES') ? showEmpDataRowGrid(constants.COMM_MILES_TEXT, lineItemData.CummMiles) : null}
              {showEmpDataRowGrid(globalConstants.AMOUNT_TEXT, parseFloat(lineItemData.Amount).toFixed(2) + ' (' + lineItemData.Currency + ')')}
              {(catId == 9 || catId == 8) ? showEmpDataRowGrid('Exch ' + globalConstants.AMOUNT_TEXT, parseFloat(lineItemData.ApprovedAmt).toFixed(2) + ' (' + defaultCurrencyIdValue + ')') : null}
            </View>
            {isFileRequired == 'NO' ? null
             : <MultiAttachmentView heading="Attachments" docNumber={lineItemData.DocNo} rowId={lineItemData.RowId} files={fileData} lineItemArrayCallBack={callBack}  lineItems={linItemArray} itemIndex={index} disable={!isDocumentSaved} isFreezed = {freezVal} />}
          </ImageBackground>
        </View>
      );
    } else {return null;}
  };

  export const categoryDetails = (props) => {
      let myCategoryDetails = {};
      myCategoryDetails.id = props.categoryIdValue;
      myCategoryDetails.displayText = props.categoryTextValue;
      return myCategoryDetails;
  };

  export const subCategoryDetails = (props) => {
      let mySubCategoryDetails = {};
      mySubCategoryDetails.id = props.subCategoryIdValue;
      mySubCategoryDetails.displayText = props.subCategoryTextValue;
      mySubCategoryDetails.childName = props.childNameValue;
      mySubCategoryDetails.childDob = props.childDobValue;
      mySubCategoryDetails.childDobOriginal = props.childDobOriginalValue;
      mySubCategoryDetails.claimFor = props.claimForValue;
      mySubCategoryDetails.claimForId = props.claimForIdValue;
      mySubCategoryDetails.investmentPlan = props.investmentPlanValue;
      mySubCategoryDetails.investmentPlanId = props.investmentPlanIdValue;
      mySubCategoryDetails.firstClaimTill = props.childBirthClaimLastDate;
      mySubCategoryDetails.secondClaimTill = props.childBirthdayClaimLastDate;
      mySubCategoryDetails.weddingDate = props.weddingDateValue;
      mySubCategoryDetails.wefDate = props.wefDateValue;
      mySubCategoryDetails.tillDate = props.tillDateValue;
      mySubCategoryDetails.claimableBal = props.claimableBalValue;
      return mySubCategoryDetails;
  };

  export const usAdditionalDetails = (props) => {
    let myUSAdditionalDetails = {};
    myUSAdditionalDetails.contractIdValue = props.contractIdValue;
    myUSAdditionalDetails.relocationFromToValue = props.relocationFromToValue;
    myUSAdditionalDetails.purposeValue = props.purposeValue;
    myUSAdditionalDetails.accompaniedByValue = props.accompaniedByValue;
    myUSAdditionalDetails.transferTypeValue = props.transferTypeValue;
    myUSAdditionalDetails.billableToClientValue = props.billableToClientValue;
    myUSAdditionalDetails.billableToClientIdValue = props.billableToClientIdValue;
    myUSAdditionalDetails.clientIdValue = props.clientIdValue;
    myUSAdditionalDetails.clientIdId = props.clientIdId;
    return myUSAdditionalDetails;
  };

  export const calculateDaysDiff = (date1, date2) => {
    return moment(date1, 'DD-MMM-YYYY').diff(moment(date2, 'DD-MMM-YYYY'), 'days');
  };


  export const calculateFinancialYear = (dateValue) => {
    let month = moment(dateValue, 'DD-MMM-YYYY').month();
    let financialYear = moment(dateValue, 'DD-MMM-YYYY').year();
    console.log('date month',month);
    if (month != 0 && month != 1 && month != 2) { //0-11 index i.e 0-jan,1-feb ...
      console.log('financial year1',financialYear);
      let startFinancialYear = moment(financialYear.toString().concat('04').concat('01'),'YYYYMMDD').format('DD-MMM-YYYY');
      return startFinancialYear;
      // console.log(moment(startFinancialYear,"DD-MMM-YYYY").fromNow())
    } else {
      financialYear = financialYear - 1;
      console.log('financial year2',financialYear);
      let startFinancialYear = moment(financialYear.toString().concat('04').concat('01'),'YYYYMMDD').format('DD-MMM-YYYY');
      return startFinancialYear;
    }
  };

  additionTextRowGrid = (itemNo, textMsg) => {
    return (
      <View>
        <Text style={styles.noteLineTextStyle}>{itemNo + '. ' + textMsg}</Text>
      </View>
    );
  };

  export const ukMileageCommMileageView = (myCompThis) => {
    let mileOrKmText = constants.KM_TEXT;
    if (myCompThis.state.cvEmployeeDataArray[0].UKMileageKMFlag != 'YES') {
      mileOrKmText = constants.MILES_TEXT;
    }
    return (
      <View style={styles.userInfoView}>
        <ImageBackground style={styles.cardBackground} resizeMode="cover">
        {sectionTitle(constants.UK_MILEAGE_TABLE_SECTION_TEXT)}
        <Table borderStyle={{ borderWidth: 2, borderColor: '#c8e1ff' }}>
          <Row data={constants.COMM_MILES_TABLE_HEAD} style={styles.tableHead} flexArr={[1, 0.9, 0.9, 0.7]} textStyle={styles.tableText} />
          <TableWrapper style={{flexDirection: 'row'}}>
          <Col data={constants.COMM_MILES_TABLE_TITLE} style={styles.tableTitle} heightArr={[54, 54, 54]} textStyle={styles.tableText} />
          <Rows flexArr={[0.9, 0.9, 0.7]} style={styles.tableRows} textStyle={styles.tableText} data={[
            [myCompThis.state.mileageCurrentYearStartDt, myCompThis.state.mileageCurrentYearEndDt, myCompThis.state.mileageCurrentYearCommMiles],
            [myCompThis.state.mileagePrevYearStartDt, myCompThis.state.mileagePrevYearEndDt, myCompThis.state.mileagePrevYearCommMiles],
            ]} />
          </TableWrapper>
        </Table>
        </ImageBackground>
      </View>
    );
  };

  export const additionalInfoView = (myCompThis, catId) => {
    if (catId == 9 || catId == 8) {
    if (myCompThis.state.cvEmployeeDataArray[0].CO_CODE == 'N071') {
      return (
        <View style={styles.userInfoView}>
          <ImageBackground style={styles.cardBackground} resizeMode="cover">
          {sectionTitle(constants.IMPORTANT_NOTE_TEXT)}
          <View style={styles.cardStyle}>
          {this.additionTextRowGrid(1, constants.ADDITIONAL_TEXT_MSG1)}
          {this.additionTextRowGrid(2, constants.ADDITIONAL_TEXT_MSG2)}
          {this.additionTextRowGrid(3, constants.ADDITIONAL_TEXT_MSG3)}
          </View>
          </ImageBackground>
        </View>
      );
    } else if (myCompThis.state.cvEmployeeDataArray[0].CO_CODE == 'N039') {
      return (
        <View style={styles.userInfoView}>
          <ImageBackground style={styles.cardBackground} resizeMode="cover">
          {sectionTitle(constants.IMPORTANT_NOTE_TEXT)}
          <View style={styles.cardStyle}>
          {this.additionTextRowGrid(1, constants.ADDITIONAL_TEXT_MSG4)}
          {this.additionTextRowGrid(2, constants.ADDITIONAL_TEXT_MSG1)}
          {this.additionTextRowGrid(3, constants.ADDITIONAL_TEXT_MSG2)}
          {this.additionTextRowGrid(4, constants.ADDITIONAL_TEXT_MSG5)}
          </View>
          </ImageBackground>
        </View>
      );
    } else {
      return (
        <View style={styles.userInfoView}>
          <ImageBackground style={styles.cardBackground} resizeMode="cover">
          {sectionTitle(constants.IMPORTANT_NOTE_TEXT)}
          <View style={styles.cardStyle}>
          {this.additionTextRowGrid(1, constants.ADDITIONAL_TEXT_MSG4)}
          {this.additionTextRowGrid(2, constants.ADDITIONAL_TEXT_MSG1)}
          {this.additionTextRowGrid(3, constants.ADDITIONAL_TEXT_MSG2)}
          {this.additionTextRowGrid(4, constants.ADDITIONAL_TEXT_MSG3)}
          </View>
          </ImageBackground>
        </View>
      );
    }
  } else if (catId == 10) {
    let mileOrKmText = constants.KM_TEXT;
    let mileOrKmRateText = constants.UK_MILEAGE_RATE_EURO_TEXT;
    if (myCompThis.state.cvEmployeeDataArray[0].UKMileageKMFlag != 'YES') {
      mileOrKmText = constants.MILES_TEXT;
    }
    if (myCompThis.state.cvEmployeeDataArray[0].UKMileageAmountInEuroFlag != 'YES') {
      mileOrKmRateText = constants.UK_MILEAGE_RATE_POUND_TEXT;
    }
    return (
    <View style={styles.userInfoView}>
      <ImageBackground style={styles.cardBackground} resizeMode="cover">
      {sectionTitle(constants.IMPORTANT_NOTE_TEXT)}
      <View style={styles.cardStyle}>
      {myCompThis.state.cvEmployeeDataArray[0].UKMileageAmountFlag != 'YES' ? <Text style={styles.noteLineTextStyle}>
        <Text>1. </Text>
        <Text style={{fontWeight: 'bold'}}>{constants.RATE_SLASH_TEXT + mileOrKmText + ': '}</Text>
        <Text>{mileOrKmRateText}</Text>
        </Text>
      : null}
      {this.additionTextRowGrid(myCompThis.state.cvEmployeeDataArray[0].UKMileageAmountFlag != 'YES' ? 2 : 1, constants.ADDITIONAL_TEXT_MSG2)}
      {myCompThis.state.cvEmployeeDataArray[0].CO_CODE != 'N039' ? this.additionTextRowGrid(myCompThis.state.cvEmployeeDataArray[0].UKMileageAmountFlag != 'YES' ? 3 : 2, constants.ADDITIONAL_TEXT_MSG3) : null}
      </View>
      </ImageBackground>
    </View>
    );
  } else {return null;}
  };

  //(not used now) can be used later
  export const validateDetails = async(documentNumber,empData,projData,expData)=>{
    let isNetwork = await netInfo();
    if (isNetwork) {
      console.log('docNumber: ', documentNumber);
      console.log('empData: ', empData);
      console.log('projData: ', projData);
      console.log('expData: ', expData);
      let formData = new FormData();
      const loginData = AppStore.getState().loginReducer.loginData;
      formData.append('ECSerp',  loginData.SmCode);
      formData.append('AuthKey', loginData.Authkey);
      formData.append('Type', 1);
      formData.append('CatId', '');
      formData.append('DocNo', '');
      formData.append('DocType', '');
      formData.append('CompanyCode', '');
      formData.append('ClaimDate', '');
      formData.append('ProjectCode', '');
      formData.append('CostCode', '');
      formData.append('VoucherType', '');
      formData.append('MemoNo', '');
      formData.append('LineItemId', '');
      formData.append('DocumentNo', '');
      formData.append('Purpose', '');
      let url = properties.cvValidationUrl;
      let response = await fetchPOSTMethod(url, formData);
      console.log('cv validation response=======>',response);
      if (response !== undefined) {
        return response;
      } else if (response.length === undefined || response.length === 0 || response === null || response === undefined) {
        throw (globalConstants.UNDEFINED_MESSAGE);
      }
    } else {
      throw (globalConstants.NO_INTERNET);
    }
  };

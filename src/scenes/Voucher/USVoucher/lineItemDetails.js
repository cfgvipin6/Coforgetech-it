import React, { useState, useEffect } from 'react';
import { ImageBackground, StyleSheet, Text, View, TouchableOpacity, Alert, SectionList, FlatList } from 'react-native';
import { moderateScale } from '../../../components/fontScaling.js';
import { LabelTextNoValue } from '../../../GlobalComponent/LabelText/LabelText';
import { sectionTitle, calculateFinancialYear, sectionTitleWithActionBtn } from '../createVoucher/cvUtility.js';
import { LabelEditText } from '../../../GlobalComponent/LabelEditText/LabelEditText.js';
import { DatePicker } from '../../../GlobalComponent/DatePicker/DatePicker.js';
import CustomButton from '../../../components/customButton.js';
import moment from 'moment';
import { Dropdown } from '../../../GlobalComponent/DropDown/DropDown.js';
import { MultiAttachmentView } from '../../../GlobalComponent/MultiAttachments/MultiAttachmentView.js';
import { Icon } from 'react-native-elements';
import _ from 'lodash';
import UserMessage from '../../../components/userMessage.js';
import { deleteFile } from './utils.js';
import { styles as generalStyles } from '../createVoucher/styles';
let appConfig = require('../../../../appconfig');
let constants = require('../createVoucher/constants');
let globalConstants = require('../../../GlobalConstants');

export const LineItemDetails = (props) => {
  console.log('Line Items props here...', props);
  let expenseTypeId = props.myExpenseTypeId;
  let recordsData = props.lineItems;
  let empData = props.myEmpData[0];
  let defaultCurrencyIdValue = empData.CURRENCY !== '' ? empData.CURRENCY : 'INR';
  let expenseTypeRecordData = [];
  let totalAmount = 0;
  let myTitle = '';
  recordsToFilter = (expTypeId) => {
    return recordsData.filter((item) => item.TypeofExpense == expTypeId);
  };

  let travelRecordsData = recordsToFilter(1);
  let tempLivingRecordsData = recordsToFilter(2);
  let lcvRecordsData = recordsToFilter(3);
  let movementOfGoodsRecordsData = recordsToFilter(4);
  let costOfRentalRecordsData = recordsToFilter(5);
  let incidentRecordsData = recordsToFilter(6);
  let lodgingRecordsData = recordsToFilter(7);
  let mealsAndIncidentRecordsData = recordsToFilter(8);
  let telecomRecordsData = recordsToFilter(9);
  let businessPromotionRecordsData = recordsToFilter(10);
  let subscriptionRecordsData = recordsToFilter(11);
  let othersRecordsData = recordsToFilter(12);

  console.log('11111111111111 travelRecordsData', travelRecordsData);
  console.log('11111111111111 tempLivingRecordsData', tempLivingRecordsData);
  console.log('11111111111111 lcvRecordsData', lcvRecordsData);
  console.log('11111111111111 movementOfGoodsRecordsData', movementOfGoodsRecordsData);
  console.log('11111111111111 costOfRentalRecordsData', costOfRentalRecordsData);
  console.log('11111111111111 incidentRecordsData', incidentRecordsData);
  console.log('11111111111111 lodgingRecordsData', lodgingRecordsData);
  console.log('11111111111111 mealsAndIncidentRecordsData', mealsAndIncidentRecordsData);
  console.log('11111111111111 telecomRecordsData', telecomRecordsData);
  console.log('11111111111111 businessPromotionRecordsData', businessPromotionRecordsData);
  console.log('11111111111111 subscriptionRecordsData', subscriptionRecordsData);
  console.log('11111111111111 othersRecordsData', othersRecordsData);
  if (!_.isEmpty(travelRecordsData)) {
    expenseTypeRecordData.push({
      title: travelRecordsData[0].ExpenseTypeHeaderText,
      data: travelRecordsData,
    });
  }
  if (!_.isEmpty(tempLivingRecordsData)) {
    expenseTypeRecordData.push({
      title: tempLivingRecordsData[0].ExpenseTypeHeaderText,
      data: tempLivingRecordsData,
    });
  }
  if (!_.isEmpty(lcvRecordsData)) {
    expenseTypeRecordData.push({
      title: lcvRecordsData[0].ExpenseTypeHeaderText,
      data: lcvRecordsData,
    });
  }
  if (!_.isEmpty(movementOfGoodsRecordsData)) {
    expenseTypeRecordData.push({
      title: movementOfGoodsRecordsData[0].ExpenseTypeHeaderText,
      data: movementOfGoodsRecordsData,
    });
  }
  if (!_.isEmpty(costOfRentalRecordsData)) {
    expenseTypeRecordData.push({
      title: costOfRentalRecordsData[0].ExpenseTypeHeaderText,
      data: costOfRentalRecordsData,
    });
  }
  if (!_.isEmpty(incidentRecordsData)) {
    expenseTypeRecordData.push({
      title: incidentRecordsData[0].ExpenseTypeHeaderText,
      data: incidentRecordsData,
    });
  }
  if (!_.isEmpty(lodgingRecordsData)) {
    expenseTypeRecordData.push({
      title: lodgingRecordsData[0].ExpenseTypeHeaderText,
      data: lodgingRecordsData,
    });
  }
  if (!_.isEmpty(mealsAndIncidentRecordsData)) {
    expenseTypeRecordData.push({
      title: mealsAndIncidentRecordsData[0].ExpenseTypeHeaderText,
      data: mealsAndIncidentRecordsData,
    });
  }
  if (!_.isEmpty(telecomRecordsData)) {
    expenseTypeRecordData.push({
      title: telecomRecordsData[0].ExpenseTypeHeaderText,
      data: telecomRecordsData,
    });
  }
  if (!_.isEmpty(businessPromotionRecordsData)) {
    expenseTypeRecordData.push({
      title: businessPromotionRecordsData[0].ExpenseTypeHeaderText,
      data: businessPromotionRecordsData,
    });
  }
  if (!_.isEmpty(subscriptionRecordsData)) {
    expenseTypeRecordData.push({
      title: subscriptionRecordsData[0].ExpenseTypeHeaderText,
      data: subscriptionRecordsData,
    });
  }
  if (!_.isEmpty(othersRecordsData)) {
    expenseTypeRecordData.push({
      title: othersRecordsData[0].ExpenseTypeHeaderText,
      data: othersRecordsData,
    });
  }
  console.log('444444expenseTypeRecordData', expenseTypeRecordData.map((item) => item.title));
  expenseTypeRecordData.map((item) => {
    myTitle = item.title;
  });
  recordsData.map((item) => {
    totalAmount = totalAmount + parseFloat(item.AmountInDollar);
  });
  console.log('444444totalAmount', totalAmount);
  const [showDialog, setDialog] = useState(false);
  let catID = props.catID;

 const deleteAction = (item) => {
    Alert.alert('Delete Document!', 'Are you sure you want to delete this Document?', [
      {
        text: 'Yes',
        onPress: () => {
          props.lineItemDelete(item);
        },
      },
      { text: 'No', onPress: () => {} },
    ]);
  };

  const renderListItem = (item, index) => {
    let indexToShow = index + 1;
    console.log('Expense type id in line item : ', expenseTypeId);
    return (
      <View style={generalStyles.cardStyle}>
        <View>
          <View style={styles.headingContainer}>
            <Text style={styles.headingText}>{'Record ' + indexToShow}</Text>
            {!props.disableProp ? <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity
                disabled={props.disableProp}
                onPress={() => {
                  props.lineItemEdit(item);
                }}
              >
                <Icon name="edit" size={20} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                disabled={props.disableProp}
                onPress={() => {
                  deleteAction(item);
                }}
              >
                <Icon name="delete" size={20} color="white" />
              </TouchableOpacity>
            </View> : null}
          </View>
          <ImageBackground style={styles.cardBackground} resizeMode="cover">
            <LabelTextNoValue
              heading={item.TypeofExpense == 1 ? globalConstants.BOOKING_DATE_TEXT : globalConstants.DATE_TEXT}
              description={item.SMemoDate}
            />
            <LabelTextNoValue
              heading={item.TypeofExpense == 2 || item.TypeofExpense == 7 ? constants.CHECK_IN_TEXT : globalConstants.START_DATE_TEXT}
              description={item.JourneyFromDate}
            />
            <LabelTextNoValue
              heading={item.TypeofExpense == 2 || item.TypeofExpense == 7 ? constants.CHECK_OUT_TEXT : globalConstants.END_DATE_TEXT}
              description={item.JourneyToDate}
            />
            <LabelTextNoValue
              heading={globalConstants.FROM_TEXT}
              description={item.TypeofExpense == 3 ? item.LCVFrom : item.DestFrom}
            />
            <LabelTextNoValue heading={globalConstants.TO_TEXT} description={item.TypeofExpense == 3 ? item.LCVTo : item.DestTo} />
            <LabelTextNoValue
              heading={constants.MODE_OF_CONVEYANCE_TEXT}
              description={item.TypeofExpense == 3 ? item.LCVUsModeText : item.ModeOfTravelText}
            />
            <LabelTextNoValue heading={constants.CARRIER_TEXT} description={item.Carrier} />
            <LabelTextNoValue heading={constants.HOTEL_TEXT} description={item.HotelName} />
            <LabelTextNoValue heading={globalConstants.LOCATION_TEXT} description={item.UsLocation} />
            <LabelTextNoValue heading={constants.MILES_TEXT} description={item.LCVKM} />
            {item.TypeofExpenseText != '' && (
              <LabelTextNoValue heading={globalConstants.TYPE_TEXT} description={item.TypeofExpenseText} />
            )}
            <LabelTextNoValue heading={constants.DESCRIPTION_TEXT} description={item.Particulars} />
            <LabelTextNoValue heading={constants.GUEST_TEXT} description={item.Guest} />
            <LabelTextNoValue heading={constants.VALID_TILL_TEXT} description={item.ValidTill} />
            <LabelTextNoValue heading={constants.S_AT_THE_RATE_TEXT} description={item.ExpenseProofAttached} />
            <LabelTextNoValue heading={constants.R_AT_THE_RATE_TEXT} description={item.PayReceiptAttached} />
            <LabelTextNoValue heading={constants.PAY_TYPE_TEXT} description={item.PayTypeText} />
            <LabelTextNoValue heading={globalConstants.CURRENCY_TEXT} description={item.Currency} />
            <LabelTextNoValue heading={globalConstants.AMOUNT_TEXT} description={item.UsAmount} />
            <LabelTextNoValue heading={constants.EXCH_RATE_TEXT} description={item.ExchRate} />
            <LabelTextNoValue heading={constants.AMOUNT_IN_TEXT + defaultCurrencyIdValue} description={item.AmountInDollar} />
            {/* <MultiAttachmentView
              heading={globalConstants.ATTACHMENTS_TEXT}
              docNumber={item.DocNo}
              rowId={item.RowId}
              files={item.LstUploadFiles}
              lineItemArrayCallBack={props.lineItemArrayCallBack}
              lineItems={props.lineItems}
              itemIndex={index}
              disable={props.disableProp}
            /> */}
          </ImageBackground>
        </View>
      </View>
    );
  };

  renderListFooter = () => {
    return (
      <View>
        <View style={generalStyles.recordSeparatorLine} />
        <View style={generalStyles.totalAmountView}>
          <Text style={generalStyles.totalAmountText}>{globalConstants.TOTAL_AMOUNT_TEXT}</Text>
          <Text style={generalStyles.totalAmountValue}>
            {parseFloat(totalAmount).toFixed(2) + ' (' + defaultCurrencyIdValue + ')'}
          </Text>
        </View>
        <View style={generalStyles.recordSeparatorLine} />
      </View>
    );
  };

  return (
    <View style={generalStyles.userInfoView}>
      <ImageBackground style={generalStyles.cardBackground} resizeMode="cover">
        <SectionList
          sections={expenseTypeRecordData}
          renderItem={({ item, index }) => renderListItem(item, index)}
          renderSectionHeader={({ section: { title } }) => sectionTitle(title)}
          ListFooterComponent={() => renderListFooter()}
        />
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 5,
  },
  headingContainer: {
    backgroundColor: appConfig.DARK_BLUISH_COLOR,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 0,
  },
  headingText: { color: appConfig.WHITE_COLOR },
  cardBackground: {
    borderWidth: 2,
    flex: 0,
    borderColor: appConfig.FIELD_BORDER_COLOR,
    borderRadius: 5,
    shadowOffset: { width: 10, height: 10 },
    shadowColor: 'black',
    padding: 5,
  },
  autocompleteStyle: {
    flex: 1,
    marginTop: moderateScale(2),
  },
  autocompleteInputStyle: {
    borderColor: 'grey',
    borderWidth: 1,
  },
  autocompleteListStyle: {
    position: 'relative',
    backgroundColor: appConfig.CARD_BACKGROUND_COLOR,
  },
  addItemButtonView: {
    width: '25%',
    flex: 0,
    alignSelf: 'flex-end',
    marginTop: moderateScale(6),
  },
});

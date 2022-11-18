/* eslint-disable eqeqeq */
/* eslint-disable quotes */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  Dimensions,
} from 'react-native';
let globalConstants = require('../../GlobalConstants');
import { globalFontStyle } from '../../components/globalFontStyle.js';
import { styles } from './styles';
import { Card } from 'react-native-elements';
import { FlatList } from 'react-native';
import images from '../../images';
let constants = require('./constants');
let appConfig = require('../../../appconfig');
export const HistoryView = (props) => {
  console.log('history props : ', props);
  console.log('Visibiblity : ', props.visibility);
  return (
    <Modal
      visible={props.visibility == undefined ? false : props.visibility}
      animationType="slide"
      transparent={true}
      onRequestClose={props.onClose}
    >
      <View style={styles.panelNewContainer}>
        <View style={{ width: '100%' }}>
          <TouchableOpacity
            style={{ alignSelf: 'flex-end', marginTop: 10, marginRight: 10 }}
            onPress={() => onClosure(props)}
          >
            <Image source={images.crossButton} />
          </TouchableOpacity>
        </View>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingBottom:
              props.historyData && props.historyData.length > 0
                ? props.historyData.length * 35
                : 0,
          }}
        >
          <View style={{ marginBottom: 10 }}>
            {props.historyData && props.historyData.length > 0 ? (
              <FlatList
                data={props.historyData}
                contentContainerStyle={{
                  paddingBottom: Dimensions.get('window').height * 0.1,
                }}
                renderItem={({ item, index }) => (
                  <View
                    key={index?.toString()}
                    style={globalFontStyle.panelContainer}
                  >
                    <View
                      style={{
                        flexDirection: 'row',
                        alignSelf: 'center',
                        borderColor: 'light-grey',
                        borderBottomWidth: 0.25,
                        width: '96%',
                        paddingVertical: 5,
                        marginLeft: 5,
                        zIndex: 10,
                        borderBottomColor: 'light-grey',
                      }}
                    >
                      <Image source={images.rightCircleArrow} />
                      <Text
                        style={{
                          color: appConfig.BLUISH_COLOR,
                          marginLeft: 10,
                        }}
                      >
                        {globalConstants.HISTORY_RECORD_HEADING_TEXT +
                          `${index + 1}`}
                      </Text>
                    </View>
                    <View style={{ marginVertical: 10 }}>
                      {renderCardItem(item, props)}
                    </View>
                  </View>
                )}
              />
            ) : (
              <Text>No Records found !</Text>
            )}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};
const onClosure = (props) => {
  console.log('onClosure : ', props.onClose);
  if (props.onClose !== undefined) {
    props.onClose();
  }
  // props.forwardedRef.current.hide();
};
const renderCardItem = (data, props) => {
  console.log('history data:::', data);

  if (props.isComingFromVoucher) {
    var toFb =
      data.FromEmpBand.trim() != 'B'
        ? ' - BAND ' + data.FromEmpBand
        : ' - ORGKEY ' + data.FromEmpBand;
    //  var fromBand = data.FROMEMPName.trim() != "" ? data.FromStatus.trim() != "3" ? toFb : '' : '';
    var toB =
      data.ToEmpBand.trim() != 'B'
        ? ' - BAND ' + data.ToEmpBand
        : ' - ORGKEY ' + data.ToEmpBand;
    // var  toBand = data.ToEmpName.trim() !=  "" ? data.ToStatus.trim() != "3" ? toB : '' : "";
    return (
      <View>
        {renderRowData(
          constants.FROM_EMP_TEXT,
          data.EmpFrom.concat(' : ')
            .concat(data.FROMEMPName.trim())
            .concat(toFb ? toFb : toB)
          //.concat(" ",data.FromEmpBand !="B" ? ' - BAND '+ data.FromEmpBand : '- ORGKEY ' + data.FromEmpBand)
        )}
        {renderRowData(
          constants.TO_EMP_TEXT,
          data.EmpTo.concat(' : ').concat(data.ToEmpName.trim())
        )}
        {renderRowData(constants.STATUS_TEXT, data.Status)}
        {renderRowData(constants.ACTED_ON_TEXT, data.ActedOn)}
        {renderRowData(constants.REMARK_TEXT, data.Remarks)}
      </View>
    );
  } else if (props.isComingFromHr) {
    return (
      <View>
        <Text style={styles.heading}>{data.EmployeeName}</Text>
        {renderRowData(constants.ACTION_TAKEN_TEXT, data.ActionDate)}
        {renderRowData(constants.ACTION_TAKEN_BY, data.EmployeeName)}
        {renderRowData(constants.STATE, data.CurrentStageDesc)}
        {renderRowData(constants.STATUS, data.ToStatus)}
        {renderRowData(constants.CATEGORY, data.CategoryDesc)}
        {renderRowData(constants.REQUESTOR, data.EmployeeName)}
        {renderRowData(constants.REQUEST_TYPE, 'Assist')}
        {renderRowData(constants.SUBCATEGORY, data.SubcategoryDesc)}
        {renderRowData(constants.REMARK_TEXT, data.Remarks)}
      </View>
    );
  } else {
    return (
      <View>
        {renderRowData(
          constants.FROM_EMP_TEXT,
          data.pendingFrom || data.FromEmployee
        )}
        {renderRowData(
          constants.TO_EMP_TEXT,
          data.pendingTo || data.ToEmployee
        )}
        {renderRowData(constants.FROM_STATUS_TEXT, data.FromStatus)}
        {renderRowData(constants.TO_STATUS_TEXT, data.ToStatus)}
        {renderRowData(constants.ACTION_TAKEN_ON_TEXT, data.ActionTakenDate)}
        {renderRowData(constants.REMARK_TEXT, data.Remarks)}
      </View>
    );
  }
};

const renderRowData = (key, value) => {
  return (
    <View style={styles.historyCardView}>
      <Text style={globalFontStyle.cardLeftText}>{key}</Text>
      <Text style={globalFontStyle.cardRightText}>
        {value === '' || value === null || value === undefined ? '-' : value}
      </Text>
    </View>
  );
};

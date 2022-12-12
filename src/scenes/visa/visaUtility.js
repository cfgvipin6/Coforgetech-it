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
import { styles } from './styles.js';
import { SearchBar, Image } from 'react-native-elements';
let constants = require('./constants');
import { globalFontStyle } from '../../components/globalFontStyle';
import { isValidString } from '../../utilities/validation';

export const userDetail = (empData, action) => {
  let startDate =
    empData.TravelStartDate === undefined
      ? ''
      : empData.TravelStartDate.replace(/-/g, ' ');
  let endDate =
    empData.TravelEndDate === undefined
      ? ''
      : empData.TravelEndDate.replace(/-/g, ' ');
  return (
    <View style={styles.userInfoView}>
      <ImageBackground style={styles.cardBackground} resizeMode="cover">
        <View style={styles.cardStyle}>
          {this.showVisaRowGrid(
            constants.DOCUMENT_NUMBER_TEXT,
            empData.VisaID.trim()
          )}
          {this.showVisaRowGrid(
            constants.EMPLOYEE_TEXT,
            empData.EmpName.trim()
          )}
          {this.showVisaRowGrid(constants.STATE_TEXT, empData.StateDesc)}
          {this.showVisaRowGrid(constants.COUNTRY_TEXT, empData.Country.trim())}
          {this.showVisaRowGrid(
            constants.VISA_TYPE_TEXT,
            empData.VisaType.trim()
          )}
          {this.showVisaRowGrid(
            constants.VISA_SUB_TYPE_TEXT,
            empData.VisaSubType.trim()
          )}
          {this.showVisaRowGrid(constants.TRAVEL_START_DATE_TEXT, startDate)}
          {this.showVisaRowGrid(constants.TRAVEL_END_DATE_TEXT, endDate)}
          {this.showVisaRowGrid(
            constants.PROCESSING_TYPE_TEXT,
            empData.ProcessingType
          )}
          {this.showVisaRowGrid(constants.TRAVEL_TYPE_TEXT, empData.TravelType)}
          {this.showVisaRowGrid(
            constants.IS_OTHER_PROJECT_TEXT,
            empData.IsOtherProject
          )}
          {this.showVisaRowGrid(
            empData.IsOtherProject === 'Yes'
              ? constants.ALTERNATE_COST_CENTER_TEXT
              : constants.COST_CENTER_TEXT,
            empData.CostCode
          )}
          {this.showVisaRowGrid(
            empData.IsOtherProject === 'Yes'
              ? constants.ALTERNATE_PROJECT_TEXT
              : constants.PROJECT_TEXT,
            empData.ProjectName
          )}
          {this.showVisaRowGrid(constants.CLIENT_NAME_TEXT, empData.ClientName)}
          {this.showVisaRowGrid(
            constants.DURATION_OF_TRAVEL_TEXT,
            empData.DurationOfTravel
          )}
          {this.showVisaRowGrid(
            constants.PURPOSE_OF_TRAVEL_TEXT,
            empData.PurposeOfTravel
          )}
          {this.showVisaRowGrid(
            constants.REPORTING_MANAGER_TEXT,
            empData.ReportingManager
          )}
          {this.approverInfoView(empData, action)}
        </View>
      </ImageBackground>
    </View>
  );
};

showVisaRowGrid = (itemName, itemValue) => {
  if (itemValue != '' && itemValue != undefined && itemValue != null) {
    return (
      <View style={{ flexDirection: 'row' }}>
        <Text style={[styles.textOne, globalFontStyle.imageBackgroundLayout]}>
          {itemName}
        </Text>
        <Text style={[styles.textTwo, globalFontStyle.imageBackgroundLayout]}>
          {itemValue}
        </Text>
      </View>
    );
  } else {
    return null;
  }
};

approverInfoView = (empData, action) => {
  if (
    action === constants.APPROVED_TEXT &&
    isValidString(empData.ApprovingAuthority) &&
    isValidString(empData.ExceptionalApprovingAuthority)
  ) {
    return (
      <View style={styles.approverInfoView}>
        <View style={{ height: 1, backgroundColor: 'grey' }} />
        <View style={styles.keyValueTextView}>
          <View style={styles.keyValueInnerTextView}>
            <Text style={styles.keyText}>
              {constants.APPROVING_AUTHORITY_TEXT}
            </Text>
            <Text style={styles.valueText}>{empData.ApprovingAuthority}</Text>
          </View>
          <View style={styles.keyValueInnerTextView}>
            <Text style={styles.keyText}>
              {constants.EXCEP_APPROVING_AUTHORITY_TEXT}
            </Text>
            <Text style={styles.valueText}>
              {empData.ExceptionalApprovingAuthority}
            </Text>
          </View>
        </View>
      </View>
    );
  } else {
    return null;
  }
};

export const submitToAction = (
  action,
  defaultApproverValue,
  updateRequestorOptionList,
  nextStage,
  refs
) => {
  let label =
    refs.state.selectedSupervisorValue === null
      ? defaultApproverValue
      : refs.state.selectedSupervisorValue;
  let changeDoneLabel =
    !refs.state.supervisorList.length > 0
      ? constants.CHANGE_TEXT
      : constants.CANCEL_TEXT;
  if (action === 'Approved') {
    return (
      <View style={styles.actionButton}>
        <Text style={styles.actionText}>{constants.SUBMIT_TO_TEXT}</Text>
        <View style={styles.authorityBoxView}>
          <Text style={styles.authorityTextValue}>{label}</Text>
          {nextStage != 5 ? (
            <TouchableOpacity
              onPress={() => {
                updateRequestorOptionList();
              }}
            >
              <Text style={styles.changeText}>{changeDoneLabel}</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    );
  } else {
    return null;
  }
};

export const renderRemarksView = (refs) => {
  if (!refs.state.displaySupervisorList) {
    return (
      <View style={styles.remarksParent}>
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          autoCompleteType="off"
          multiline={true}
          maxLength={200}
          onChangeText={(text) => refs.setState({ remarks: text })}
          value={refs.state.remarks}
          placeholder="Remarks"
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
};

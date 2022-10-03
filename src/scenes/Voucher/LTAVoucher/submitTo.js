import React, { useState, useEffect } from 'react';
import { ImageBackground, StyleSheet, Text, View, TouchableOpacity, ProgressBarAndroidComponent, Alert } from 'react-native';
import { moderateScale } from '../../../components/fontScaling.js';
import { LabelText } from '../../../GlobalComponent/LabelText/LabelText.js';
import { sectionTitle, calculateFinancialYear } from '../createVoucher/cvUtility.js';
import { LabelEditText } from '../../../GlobalComponent/LabelEditText/LabelEditText.js';
import { DatePicker } from '../../../GlobalComponent/DatePicker/DatePicker.js';
import CustomButton from '../../../components/customButton.js';
let appConfig = require('../../../../appconfig');
import moment from 'moment';
import { Dropdown } from '../../../GlobalComponent/DropDown/DropDown.js';
import { showToast } from '../../../GlobalComponent/Toast.js';
import Autocomplete from 'react-native-autocomplete-input';
let constants = require('./constants');
let globalConstants = require('../../../GlobalConstants');
import { searchSupervisors } from './utils.js';
export const SubmitTo = (props) => {
  console.log('Document number :', props.documentNumber);
  this.submitToRef = React.createRef();
  const [submitToValue, submitTo] = useState('');
  const [autoSearchSupervisorDataArray, setSupervisorDataArray] = useState([]);
  const [supervisorSearchValue, setSupervisorSearchVal] = useState('');
  const [autoCompleteSupervisorHideResult, setHideResult] = useState(false);
  const [remarksInput, onRemarksChanged] = useState('');
  const onSubmitToSelection = (i, value) => {
    console.log('submit to value', value);
    submitTo(value);
  };
  const renderAutoCompleteSupervisorResult = (item, i) => {
    console.log('Item found ', item);
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            setHideResult(true);
            setSupervisorSearchVal(item.Key);
            props.setSupervisor(item);
          }}
        >
          <Text>{item.Key}</Text>
        </TouchableOpacity>
        <View style={{ height: 1, backgroundColor: 'white' }} />
      </View>
    );
  };
  const submitAction = () => {
    console.log('Submit to value : ', submitToValue);
    props.submitDetails(submitToValue, remarksInput);
  };
  const deleteAction = () => {
    Alert.alert('Delete Document!', 'Are you sure you want to delete this Voucher?', [
      {
        text: 'Yes',
        onPress: () => {
          props.deleteVoucher();
        },
      },
      { text: 'No', onPress: () => {} },
    ]);
  };
  const onAutoCompleteSupervisorChangeText = async (text) => {
    if (text.length > 1) {
      setHideResult(false);
      try {
        setSupervisorSearchVal(text);
        let searchVal = await searchSupervisors(text, props.documentNumber);
        setSupervisorDataArray(searchVal);
        console.log('Searched supervisor is: ', searchVal);
      } catch (error) {
        console.log('Error in searching supervisor is : ', error);
      }
    } else {
      setSupervisorSearchVal('');
      setSupervisorDataArray([]);
      // props.setProjectData(undefined);
    }
  };
  const submitToSupervisorView = () => {
    if (submitToValue === 'Supervisor') {
      return (
        <Autocomplete
          placeholder={'Search Supervisors..'}
          data={autoSearchSupervisorDataArray}
          defaultValue={supervisorSearchValue}
          containerStyle={styles.autocompleteStyle}
          inputContainerStyle={styles.autocompleteInputStyle}
          listStyle={styles.autocompleteListStyle}
          selectTextOnFocus={true}
          hideResults={autoCompleteSupervisorHideResult}
          onChangeText={(text) => onAutoCompleteSupervisorChangeText(text)}
          renderItem={({ item, i }) => renderAutoCompleteSupervisorResult(item, i)}
        />
      );
    } else {return null;}
  };
  const fsoView = () => {
    return (
      <LabelEditText
        heading={'Forward To :'}
        isEditable={false}
        myNumberOfLines={2}
        isMultiline={true}
        myValue={'FSO'}
        isSmallFont={true}
      />
    );
  };
  useEffect(() => {
    let documentNumber = props.documentNumber;
    if (
      documentNumber.includes('MBL') ||
      documentNumber.includes('PET') ||
      documentNumber.includes('DRV') ||
      documentNumber.includes('MED') ||
      documentNumber.includes('LTA')
    ) {
      if (this.submitToRef.current !== null) {
        this.submitToRef.current.select(1);
      }
      submitTo('FSO');
    }
  }, [props.documentNumber]);
  return (
    <View style={styles.userInfoView}>
      <ImageBackground style={styles.cardBackground} resizeMode="cover">
        {sectionTitle('Forward To')}
        <View style={styles.cardStyle}>
          {props.documentNumber.includes('MBL') ||
          props.documentNumber.includes('DRV') ||
          props.documentNumber.includes('PET') ||
          props.documentNumber.includes('MED') ||
          props.documentNumber.includes('LTA') ? (
            fsoView()
          ) : (
            <View>
              <Dropdown
                title={globalConstants.SUBMIT_TO_TEXT}
                forwardedRef={this.submitToRef}
                dropDownData={constants.SUBMIT_TO_TYPES}
                dropDownCallBack={(index, value) => onSubmitToSelection(index, value)}
              />
              {submitToSupervisorView()}
            </View>
          )}

          <LabelEditText
            heading="Remarks*"
            placeHolder="Max 500 characters"
            myMaxLength={500}
            // isMultiline={true}
            onTextChanged={onRemarksChanged}
            myValue={remarksInput}
            isSmallFont={true}
          />
          <View style={{ flexDirection: 'row', alignSelf: 'flex-end' }}>
            <View style={styles.addItemButtonView}>
              <CustomButton label={globalConstants.SUBMIT_TEXT} positive={true} performAction={() => submitAction()} />
            </View>
            <View style={styles.addItemButtonView}>
              {!props.documentNumber.includes('LTA') ? (
                <CustomButton label={globalConstants.DELETE_TEXT} positive={false} performAction={() => deleteAction()} />
              ) : null}
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  userInfoView: {
    margin: moderateScale(6),
  },
  cardBackground: {
    borderWidth: 2,
    flex: 0,
    borderColor: appConfig.FIELD_BORDER_COLOR,
    borderRadius: 5,
    shadowOffset: { width: 10, height: 10 },
    shadowColor: 'black',
  },
  cardStyle: {
    flex: 0,
    marginHorizontal: moderateScale(6),
    paddingVertical: moderateScale(4),
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

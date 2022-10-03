import React, { Component } from 'react';
import { View, TextInput, Text, TouchableOpacity } from 'react-native';
import { styles } from './styles';
import moment from 'moment';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
let appConfig = require('../../../appconfig');

export const DatePicker = (props) => {
  return (
    <View style={styles.rowHolder}>
      <Text style={styles.heading}>{props.heading}</Text>
      <View style={styles.description}>
        <TouchableOpacity disabled={props.isFreezed ? props.isFreezed : false} style={styles.calendarView} onPress={() => props.showMyCalendar()}>
          <Text style={styles.calendarText}>{props.myDateValue}</Text>
          <Icon name={(props.isTime !== undefined && props.isTime) ? 'calendar-clock' : 'calendar-month-outline'} size={26} color={appConfig.DARK_BLUISH_COLOR} />
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={props.myDatePickerVisible}
          mode={props.myMode !== undefined ? props.myMode : 'date'}
          locale="en_GB"
          is24Hour={true}
          date={props.myCalenderSelectedDate}
          minimumDate={props.myMinDate}
          maximumDate={props.myMaxDate}
          onConfirm={(date) => props.handleConfirm(date)}
          onCancel={() => props.hideDatePicker()}
        />
      </View>
    </View>
  );
};

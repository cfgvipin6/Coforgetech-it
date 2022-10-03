import React, { Component } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import moment from "moment";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { styles } from "./styles";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
let date = new Date();
class DatePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      selectedDate: "",
    };
  }
  setDate = (event, dateValue) => {
    if (dateValue !== undefined && dateValue !== null) {
      date = dateValue;
    } else {
      date;
    }
  };
  hideDatePicker = () => {
    this.setState({
      show: false,
    });
  };
  showCalendar = () => {
    this.setState({
      show: true,
    });
  };
  handleConfirm = (dateVal) => {
    // console.log("date ", dateVal);
    this.hideDatePicker();
    date = dateVal;
    let dateSelected = moment(dateVal, "DD-MMM-YYYY").format("DD-MMM-YYYY");
    this.setState({ selectedDate: dateSelected }, () => {
      this.props.callBack(dateSelected);
    });
  };
  getDate = (format) => {
    return moment(date, format).format(format);
  };
  render() {
    return (
      <View>
        <TouchableOpacity
          style={styles.container}
          onPress={() => (this.props.disabled ? null : this.showCalendar())}
        >
          <Text style={styles.calendarText}>{this.props.title}</Text>
          <Icon name="calendar-month-outline" size={30} color="grey" />
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={this.state.show}
          mode="date"
          onConfirm={this.handleConfirm}
          onCancel={this.hideDatePicker}
        />
      </View>
    );
  }
}

export default DatePicker;

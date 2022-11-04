import React, { Component } from "react";
import {
  Text,
  View,
  ScrollView,
  BackHandler,
  ImageBackground,
} from "react-native";
import { connect } from "react-redux";
import { styles } from "./styles";
import { Icon } from "react-native-elements";
import { DATE, DAY, HOLIDAY_NAME } from "./constants";
import { writeLog } from "../../utilities/logger";
import {
  leaveYearLocation,
  holidayActionCreator,
  resetLeave,
  resetNoLeaves,
} from "./holidayActionCreator";
import { Table, Row, Cols, Rows } from "react-native-table-component";
import ActivityIndicatorView from "../../GlobalComponent/myActivityIndicator";
import SubHeader from "../../GlobalComponent/SubHeader";
import { Dropdown } from "../../GlobalComponent/DropDown/DropDown";
import CustomButton from "../../components/customButton";
import images from "../../images";
let globalConstants = require("../../GlobalConstants");
const tableHead = [DATE, DAY, HOLIDAY_NAME];
class HolidayScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      yearValue: "Select",
      countryCode: "Select",
      locationValue: "Select",
      errorPopUp: false,
      isError: "",
      noHoliday: "",
      locationData: [],
      yearData: [],
      loading: false,
      holidayData: [],
    };
    this.locationRef = React.createRef();
    this.yearRef = React.createRef();
  }
  componentDidMount() {
    this.props.navigation.addListener("willFocus", this.onFocus);
    BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
  }
  holidaySuccessCallBack = (holidayData) => {
    console.log("holidayData : ", holidayData);
    this.setState({ holidayData }, () => {
      if (holidayData.length == 0) {
        this.setState({
          errorPopUp: true,
          noHoliday: "No holiday found for this location & year.",
        });
      }
    });
  };
  successCallBack = (data) => {
    console.log("Year n location data : ", data);
    let locationValues = data?.Location.map((el) => {
      return el;
    });
    let yearValues = data?.Year.map((el) => {
      return el.Year;
    });
    this.setState(
      {
        locationData: locationValues,
        yearData: yearValues,
        yearValue: yearValues[0],
      },
      () => {
        this.yearRef?.current?.select(0);
      }
    );
  };

  errorCallBack = (error) => {
    setTimeout(() => {
      this.setState({ errorPopUp: true, isError: error });
    }, 1000);
  };
  onFocus = () => {
    writeLog("Landed on " + "HolidayScreen");
    // this.locationRef.current.select(-1);
    this.props.fetchYearLocation(
      this.props.loginData.SmCode,
      this.props.loginData.Authkey,
      this.successCallBack,
      this.errorCallBack
    );
  };

  componentWillUnmount() {
    BackHandler.removeEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
    this.setState({
      yearValue: "Select",
      countryCode: "Select",
      locationValue: "Select",
    });
    this.props.resetLeave();
  }
  showLeaveData = () => {
    // console.log("Show leaves button clicked ! ")
    console.log("Year Value : ", this.state.yearValue);
    console.log("Country code : ", this.state.countryCode);
    console.log("Location value : ", this.state.locationValue);
    if (
      this.state.yearValue === "Select" ||
      this.state.countryCode === "Select" ||
      this.state.locationValue === "Select"
    ) {
      return alert("Please select year and location!");
    }
    this.props.showLeaves(
      this.state.yearValue,
      this.state.countryCode,
      this.holidaySuccessCallBack,
      this.errorCallBack
    );
  };
  handleBackButtonClick = () => {
    this.handleBack();
    return true;
  };
  handleBack = () => {
    writeLog("Clicked on " + "handleBack" + " of " + "HolidayScreen");
    // this.props.navigation.navigate("DashBoardNew")
    this.props.navigation.pop();
  };
  showCurrentYear = () => {
    if (this.props.yearData.length > 0) {
      // console.log("year data : ", this.props.yearData[0].Year)
      return this.props.yearData[0].Year;
    }
  };
  showDropDown = () => {
    return (
      <View>
        <View
          style={{
            flexDirection: "row",
            marginHorizontal: 10,
            justifyContent: "space-between",
            height: 35,
            marginTop: 20,
          }}
        >
          <Text style={{ marginTop: 5, fontWeight: "bold" }}>Year</Text>
          <Dropdown
            dropDownWidth={"80%"}
            forwardedRef={this.yearRef}
            dropDownData={this.state.yearData}
            dropDownCallBack={(index, value) => this.yearSelected(index, value)}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            marginHorizontal: 10,
            marginTop: 10,
            justifyContent: "space-between",
            height: 35,
          }}
        >
          <Text style={{ marginTop: 5, fontWeight: "bold" }}>Place</Text>
          <Dropdown
            dropDownWidth={"82%"}
            dropDownData={this.state.locationData.map((el) => el.LocationDesc)}
            dropDownCallBack={(index, value) =>
              this.locationSelected(index, value)
            }
          />
        </View>
      </View>
    );
  };
  yearSelected = (index, value) => {
    this.setState({
      yearValue: value,
    });
  };
  locationSelected = (index, value) => {
    let locationId = this.state.locationData[index].LocationID;
    console.log("Location data : ", this.state.locationData);
    this.setState({
      countryCode: locationId,
      locationValue: value,
    });
  };

  shouldPopup = () => {
    if (this.state.isError.length > 0) {
      return this.showPopUp("Error", this.state.isError);
    } else if (this.state.noHoliday.length > 0) {
      return this.showPopUp("Info", this.state.noHoliday);
    } else {
      return null;
    }
  };
  showPopUp = (heading, message) => {
    return (
      <UserMessage
        modalVisible={true}
        heading={heading}
        message={message}
        okAction={() => {
          if (this.state.isError.length > 0) {
            this.onOkClick();
          } else if (this.state.noHoliday.length > 0) {
            this.onHolidayOkClick();
          }
        }}
      />
    );
  };
  onOkClick = () => {
    writeLog("Clicked on " + "onOkClick" + " of " + "Holiday Screen");
    this.props.resetLeave();
    this.setState({ errorPopUp: false, isError: "" }, () => {});
  };
  onHolidayOkClick = () => {
    this.props.resetNoLeave();
    this.setState({ errorPopUp: false, noHoliday: "" });
  };

  tableView() {
    if (this.state.holidayData && this.state.holidayData.length > 0) {
      let dates = this.state.holidayData.map((el) => {
        return [el.Date.Value];
      });
      let day = this.state.holidayData.map((el) => {
        return [el.Day.Value];
      });
      let holidays = this.state.holidayData.map((el) => {
        return [el.HolidayDesc.Value];
      });

      let reQ = [];
      for (let i = 0; i < holidays.length; i++) {
        reQ[i] = new Array(dates[i], day[i], holidays[i]);
      }
      return (
        <Table borderStyle={{ borderWidth: 2, borderColor: "#c8e1ff" }}>
          <Row
            data={tableHead}
            style={styles.tableHead}
            flexArr={[1.2, 0.7, 2.1]}
            textStyle={styles.tableText}
          />
          <Rows
            data={reQ}
            flexArr={[1.2, 0.7, 2.1]}
            textStyle={styles.tableText}
          />
        </Table>
      );
    } else if (
      this.state.holidayData.length == 0 &&
      this.state.countryCode != "Select" &&
      this.state.isNoLeaves === true
    ) {
      return this.shouldPopup();
    }
  }
  render() {
    return (
      <ImageBackground style={{ flex: 1 }} source={images.loginBackground}>
        <View>
          <SubHeader
            pageTitle={globalConstants.HOLIDAY_LIST_TITLE}
            backVisible={true}
            logoutVisible={true}
            handleBackPress={() => this.handleBack()}
            navigation={this.props.navigation}
          />
          {this.showDropDown()}
          <ActivityIndicatorView loader={this.state.loading} />
          <View style={{ width: "35%", marginTop: "2%", alignSelf: "center" }}>
            <CustomButton
              label={"Get Holidays"}
              positive={true}
              performAction={() => this.showLeaveData()}
            />
          </View>

          <ScrollView
            keyboardShouldPersistTaps="handled"
            style={styles.scrollViewStyle}
            showsVerticalScrollIndicator={false}
          >
            {this.tableView()}
          </ScrollView>
          <View style={{ marginTop: 10, width: "35%", alignSelf: "center" }} />
          {this.state.errorPopUp === true ? this.shouldPopup() : null}
        </View>
      </ImageBackground>
    );
  }
}

mapDispatchToProps = (dispatch) => {
  return {
    fetchYearLocation: (loginId, authKey, successCallBack, errorCallBack) =>
      dispatch(
        leaveYearLocation(loginId, authKey, successCallBack, errorCallBack)
      ),
    showLeaves: (
      yearValue,
      countryCode,
      holidaySuccessCallBack,
      errorCallBack
    ) =>
      dispatch(
        holidayActionCreator(
          yearValue,
          countryCode,
          holidaySuccessCallBack,
          errorCallBack
        )
      ),
    resetLeave: () => dispatch(resetLeave()),
    resetNoLeave: () => dispatch(resetNoLeaves()),
  };
};
mapStateToProps = (state) => {
  return {
    loginData: state && state.loginReducer && state.loginReducer.loginData,
    yearData: state.holidayReducer.yearData,
    locationData: state.holidayReducer.locationData,
    leaveLoading: state.holidayReducer.holidayLoading,
    holidayData: state.holidayReducer.holidayData,
    holidayError: state.holidayReducer.holidayError,
    isNoLeaves: state.holidayReducer.isNoLeaves,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HolidayScreen);

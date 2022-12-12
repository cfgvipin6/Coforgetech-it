/*
Author: Mohit Garg(70024)
*/

import React, { Component, createRef } from 'react';
import {
  View,
  Text,
  FlatList,
  Modal,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import SubHeader from '../../../GlobalComponent/SubHeader';
import NestedListView, { NestedRow } from 'react-native-nested-listview';
import { Dropdown } from '../../../GlobalComponent/DropDown/DropDown';
import CustomButton from '../../../components/customButton';
import { Icon as IconElement, Button, SearchBar } from 'react-native-elements';
import { connect } from 'react-redux';
import moment, { weekdays } from 'moment';
import { DatePicker } from '../../../GlobalComponent/DatePicker/DatePicker';
import ActivityIndicatorView from '../../..//GlobalComponent/myActivityIndicator';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles } from './styles';
import { globalFontStyle } from '../../../components/globalFontStyle';
import { LabelTextNoValue } from '../../../GlobalComponent/LabelText/LabelText';
import {
  fetchTimesheetWeek,
  fetchEmpDetails,
  getLineItemHistory,
  fetchSupervisors,
} from './service/timeSheetService';
import { HistoryView } from '../../../GlobalComponent/HistoryView/HistoryView';
import { moderateScale } from '../../../components/fontScaling';
import images from '../../../images';
let globalConstants = require('../../../GlobalConstants');
let constants = require('./constants');
let appConfig = require('../../../../appconfig');
const yearData = [
  String(new Date().getFullYear()),
  String(new Date().getFullYear() - 1),
  String(new Date().getFullYear() - 2),
];
export class MyTimesheetScreen4 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeSections: [],
      recordsArray: [],
      hoursInputArr: [],
      yearValue: '2021',
      weekArray: [],
      lastThreeWeekArray: [],
      historyData: [],
      selectedWeek: '',
      isWeekChanged: false,
      empDetailsArray: [],
      isLoading: false,
      modalVisible: false,
      tId: 0,

      searchText: '',
      filteredData: [],
      getSupervisors: [],
      selectedApprover: '',
    };
    this.weekCalenderRef = createRef();
    this.yearRef = createRef();
    this._panel = createRef();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.yearValue !== this.state.yearValue) {
      this.callWeekApi();
    }
    // if (prevState.selectedWeek !== this.state.selectedWeek) {
    //   this.callEmpDetailsApi();
    // }
  }
  onFocus = () => {
    this.callWeekApi();
    this.callLastThreeWeek();

    this.setState({
      recordsArray: constants.dummyListData,
    });
  };
  componentDidMount() {
    if (this.yearRef.current) {
      this.yearRef.current.select(0);
      this.setState({ yearValue: yearData[0] });
    }
    this.props.navigation.addListener('willFocus', this.onFocus);
  }

  callLastThreeWeek = () => {
    this.setState(
      {
        // isLoading: true,
      },
      () => {
        fetchTimesheetWeek(
          undefined,
          9,
          '',
          '',
          this.props.loginData.SmCode
        ).then((resWeek) => {
          //handle hard coded empCode here
          console.log('fffffff', resWeek);
          this.setState({ isLoading: false });
          if (resWeek.Result && resWeek.Result.length > 0) {
            const lastThreeWeekData = resWeek.Result.filter(
              (it) => it.Selected === 'N'
            );
            this.setState({
              lastThreeWeekArray: lastThreeWeekData,
            });
          }
        });
      }
    );
  };

  fetchHistory = async (rec) => {
    let TID = rec?.TID;
    if (TID) {
      this.setState({
        // isLoading: true,
      });
      await getLineItemHistory(
        this.props.loginData,
        TID,
        this.onHistoryResponse,
        this.onResponseFailure
      );
    }
  };

  onHistoryResponse = async (data) => {
    this.setState({
      isLoading: false,
    });
    console.log('History data is : ', data);
    if (Array.isArray(data)) {
      this.setState({
        historyData: data,
        modalVisible: true,
      });
    }
  };

  onResponseFailure = (errorMessage) => {
    this.setState({
      isLoading: false,
    });
    console.log('Response failure : ', errorMessage);
    setTimeout(() => {
      alert(errorMessage[0].Exception);
    }, 1000);
  };

  callEmpDetailsApi = () => {
    console.log('selected week', this.state.selectedWeek);
    const startDt = this.state.selectedWeek?.split(' - ')[0];
    const endDt = this.state.selectedWeek?.split(' - ')[1];

    this.setState(
      {
        // isLoading: true,
      },
      () => {
        fetchEmpDetails(startDt, endDt)
          .then((resEmp) => {
            //console.log("fetchEmpDetails",resEmp)
            if (resEmp.Result) {
              this.setState(
                {
                  isLoading: false,
                  empDetailsArray: resEmp.Result,
                },
                () => {
                  if (
                    this.state.isWeekChanged &&
                    this.weekCalenderRef?.current
                  ) {
                    // this.weekCalenderRef.current.select(this.state.weekArray.findIndex(element => element === this.state.selectedWeek));
                  }
                }
              );
            } else {
              this.setState({ isLoading: false });
            }
          })
          .catch((err) => {
            console.log('Error found is :', err);
            this.setState({
              isLoading: false,
            });
          });
      }
    );
  };

  // callSupervisoreApi

  callSupervisoreApi = () => {
    console.log('selected week super', this.state.selectedWeek);
    const startDt = this.state.selectedWeek?.split(' - ')[0];

    const endDt = this.state.selectedWeek?.split(' - ')[1];

    this.setState(
      {
        // isLoading: true,
      },
      () => {
        fetchSupervisors(startDt, endDt)
          .then((resEmp) => {
            console.log('fetchSupervisors', resEmp);
            if (resEmp) {
              this.setState(
                {
                  isLoading: false,
                  getSupervisors: resEmp,
                },
                () => {
                  if (
                    this.state.isWeekChanged &&
                    this.weekCalenderRef?.current
                  ) {
                    // this.weekCalenderRef.current.select(this.state.weekArray.findIndex(element => element === this.state.selectedWeek));
                  }
                }
              );
            } else {
              this.setState({ isLoading: false });
            }
          })
          .catch((err) => {
            console.log('Error found is :', err);
            this.setState({
              isLoading: false,
            });
          });
      }
    );
  };

  callWeekApi() {
    this.setState(
      {
        isLoading: true,
      },
      () => {
        fetchTimesheetWeek(
          this.state.yearValue,
          1,
          undefined,
          undefined,
          undefined
        )
          .then((resWeek) => {
            if (resWeek.Result && resWeek.Result.length > 0) {
              const defaultWeek = resWeek.Result.filter(
                (it, idx) => it.Selected === 'Y'
              ).map((it) => it.Display);
              this.setState(
                {
                  weekArray: resWeek.Result,
                  selectedWeek:
                    defaultWeek.length > 0
                      ? defaultWeek[0]
                      : resWeek.Result[0].Value,
                },
                () => {
                  if (this.weekCalenderRef?.current) {
                    this.setState({
                      selectedWeek: resWeek.Result[0].Value,
                      isWeekChanged: false,
                    });
                    this.weekCalenderRef.current.select(0);
                  }
                  this.callEmpDetailsApi();
                  this.callSupervisoreApi();
                }
              );
            } else {
              alert(resWeek.Message);
            }
          })
          .catch((err) => {
            this.setState({
              isLoading: false,
            });
          });
      }
    );
  }

  handleBack = () => {
    this.props.navigation.pop();
  };

  employeeDetailsView = () => {
    const { empDetailsArray } = this.state;
    // console.log("empDetailsArray",empDetailsArray)
    if (empDetailsArray.length > 0) {
      const empName =
        empDetailsArray[0].EmpCode + ' : ' + empDetailsArray[0].EmpName;
      const approveName =
        empDetailsArray[0].SupervisorCode +
        ' : ' +
        empDetailsArray[0].SupervisorName;
      const compName =
        empDetailsArray[0].CompanyCode + ' : ' + empDetailsArray[0].CompanyName;
      const statusDesc = empDetailsArray[0].StatusDesc;
      // console.log("check",this.state.empDetailsArray[0].IsMultipleSupv)
      return (
        <View style={{ flex: 0 }}>
          <LabelTextNoValue
            heading={globalConstants.EMPLOYEE_TEXT}
            description={empName}
          />

          {empDetailsArray[0].IsMultipleSupv ? null : (
            <LabelTextNoValue
              heading={globalConstants.APPROVER_TEXT}
              description={approveName}
            />
          )}

          <LabelTextNoValue
            heading={globalConstants.COMPANY_CODE_TEXT}
            description={compName}
          />
          <LabelTextNoValue
            heading={globalConstants.STATUS_TEXT}
            description={statusDesc}
          />
        </View>
      );
    }

    return null;
  };

  onYearSelection = (idx, value) => {
    this.setState({
      yearValue: value,
      isWeekChanged: false,
    });
  };

  onWeekSelection = (idx, value) => {
    this.setState(
      {
        selectedWeek: value,
        isWeekChanged: true,
      },
      () => {
        this.callEmpDetailsApi();
        this.callSupervisoreApi();
      }
    );
  };

  calenderView = () => {
    const { weekArray } = this.state;
    return (
      <View style={styles.topViewStyle1}>
        <View
          style={{
            flex: 0,
            flexDirection: 'row',
            paddingHorizontal: 1,
            marginTop: 4,
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              borderWidth: 1,
              borderColor: appConfig.FIELD_BORDER_COLOR,
            }}
          >
            <Icon
              style={{ flex: 0 }}
              name={'calendar-month-outline'}
              size={30}
              color={appConfig.BLUISH_COLOR}
            />
            <Dropdown
              forwardedRef={this.yearRef}
              dropDownData={yearData}
              dropDownCallBack={(index, value) =>
                this.onYearSelection(index, value)
              }
            />
          </View>
        </View>
        <View
          style={{
            flex: 0,
            flexDirection: 'row',
            marginRight: 2,
            marginTop: 2,
            borderWidth: 1,
            borderColor: appConfig.FIELD_BORDER_COLOR,
          }}
        >
          <Icon
            style={{ flex: 0 }}
            name={'calendar-clock'}
            size={30}
            color={appConfig.BLUISH_COLOR}
          />
          <Dropdown
            forwardedRef={this.weekCalenderRef}
            dropDownData={weekArray.map((it) => it.Display)}
            dropDownCallBack={(index, value) =>
              this.onWeekSelection(index, value)
            }
          />
        </View>
      </View>
    );
  };

  updateSearch = (text) => {
    // Check if searched text is not blank
    if (text) {
      // Update FilteredDataSource
      const newData = this.state.getSupervisors.filter(function(item) {
        const itemData = item.SupervisorName
          ? item.SupervisorName.toUpperCase() || item.SupervisorCode
          : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });

      this.setState({ filteredData: newData });
      this.setState({ searchText: text });
    } else {
      this.setState({ filteredData: this.state.getSupervisors });
      this.setState({ searchText: text });
    }
  };

  approverSearch = () => {
    return (
      <Modal
        visible={this.state.modalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => {
          this.setState({ modalVisible: false });
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.searchHolder}>
            <SearchBar
              lightTheme
              placeholder="Enter Emp Code or Name to search"
              value={this.state.getSupervisors}
              onChangeText={this.updateSearch}
              round={true}
              containerStyle={styles.searchBarSkills}
              autoCapitalize="none"
              autoCompleteType="off"
              autoCorrect={false}
            />
            <TouchableOpacity
              onPress={() => {
                this.setState({ modalVisible: false });
              }}
            >
              <IconElement name="close" size={35} color="blue" />
            </TouchableOpacity>
          </View>

          <FlatList
            contentContainerStyle={styles.listContentStyle}
            data={
              this.state.filteredData && this.state.filteredData.length > 0
                ? this.state.filteredData
                : this.state.getSupervisors
            }
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => {
              console.log('flatlist', item);
              return (
                <TouchableOpacity
                  onPress={() => {
                    this.setState({ selectedApprover: item.SupervisorName });
                    this.setState({ modalVisible: false });
                  }}
                  style={styles.listItem}
                >
                  <Text>{item.SupervisorName}</Text>
                  <View style={styles.supervisorSeparator} />
                </TouchableOpacity>
              );
            }}
            keyExtractor={(item, index) => item.SupervisorName.toString()}
          />
        </View>
      </Modal>
    );
  };

  approverList = (key) => {
    return (
      <View key={key}>
        <TouchableOpacity onPress={() => this.setState({ modalVisible: true })}>
          <Text style={[styles.textInputStyle, { paddingLeft: 5 }]}>
            {this.state.selectedApprover
              ? this.state.selectedApprover
              : 'Select Approver'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  proceedButtonView = () => {
    return (
      <View style={{ alignItems: 'flex-end', marginTop: 4 }}>
        <View style={{ width: '50%' }}>
          <CustomButton
            label={globalConstants.PROCEED_TEXT}
            positive={true}
            performAction={() => {
              if (this.state.selectedWeek.length < 1) {
                return alert('Please select week.');
              }
              if (this.state.empDetailsArray.length < 1) {
                return alert(
                  'Could not fetched emp data from server, please try again after some time.'
                );
              }
              if (!this.state.empDetailsArray[0].IsMultipleSupv) {
                return this.props.navigation.navigate('MyTimesheet5', {
                  empData: this.state.empDetailsArray,
                  selectedWeek: this.state.selectedWeek,
                });
              }
              if (this.state.selectedApprover == '') {
                return alert('Please select Approver');
              }
              this.props.navigation.navigate('MyTimesheet5', {
                empData: this.state.empDetailsArray,
                selectedWeek: this.state.selectedWeek,
                selectedSupervisor: this.state.selectedApprover,
              });
            }}
          />
        </View>
      </View>
    );
  };

  onHistoryClose = () => {
    // console.log('On history close called : ');
    this.setState({ modalVisible: false }, () => {
      // this.props.resetHistory();
    });
  };

  weekStatusView = (heading1, heading2, myColor, item) => {
    return (
      <View
        style={{
          backgroundColor: '#F6FAFD',
          paddingLeft: 8,
          paddingTop: 3,
          paddingBottom: 3,
          marginVertical: 7,
          justifyContent: 'space-between',
          fontWeight: 'bold',
          borderRadius: 5,
          elevation: 2,
          marginLeft: moderateScale(10),
          marginRight: moderateScale(1),
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: 1,
          borderColor: '#C9C9C9',
        }}
      >
        <View
          style={{
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 6,
            flexDirection: 'row',
          }}
        >
          <Text style={{ fontSize: 16 }}>
            {heading1}
            {'\n'}
            <Text style={{ fontSize: 14, color: myColor, fontWeight: '700' }}>
              {heading2}
            </Text>
          </Text>
          <View
            style={{
              marginLeft: 2,
              flexDirection: 'row',
              marginRight: 6,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {item?.TID ? (
              <View
                style={{ borderLeftWidth: 1, marginLeft: 6, paddingLeft: 6 }}
              >
                <TouchableOpacity onPress={() => this.fetchHistory(item)}>
                  <Icon
                    style={{ flex: 0 }}
                    name="history"
                    size={30}
                    color={appConfig.DARK_BLUISH_COLOR}
                  />
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        </View>
      </View>
    );
  };

  statusColor = (status) => {
    if (status == 1) {
      //pending with staff
      return 'rgb(96, 130, 182)';
    }
    if (status == 2) {
      //pending with approver
      return 'rgb(216,0,12)';
    }
    if (status == 8) {
      //completed
      return '#ABEBC6';
    }
    return 'rgb(96, 130, 182)'; // not filled
  };

  //changes
  lastThreeWeekStatusView = () => {
    const checkMultiSup = this.state.empDetailsArray.map(
      (item, key) => item.IsMultipleSupv
    );
    //  console.log("getdta",checkMultiSup[0])
    if (this.state.lastThreeWeekArray.length > 0) {
      return (
        <View>
          {this.state.lastThreeWeekArray.map((it, idx) => {
            console.log('Required item : ', it);

            return (
              <TouchableOpacity
                key={'prevWeek_' + idx}
                onPress={() => {
                  if (checkMultiSup[0]) {
                    if (this.state.selectedApprover) {
                      this.props.navigation.navigate('MyTimesheet5', {
                        empData: this.state.empDetailsArray,
                        selectedWeek: it.Display,
                        selectedSupervisor: this.state.selectedApprover,
                      });
                    } else {
                      alert('Please select Approver');
                    }
                  } else {
                    this.props.navigation.navigate('MyTimesheet5', {
                      empData: this.state.empDetailsArray,
                      selectedWeek: it.Display,
                    });
                  }
                }}
              >
                {this.weekStatusView(
                  it.Display,
                  it.StatusDesc,
                  this.statusColor(it.Status),
                  it
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      );
    }
    return null;
  };

  topView = () => {
    return (
      <View
        style={{
          flex: 0,
          borderWidth: 2,
          borderColor: 'grey',
          marginVertical: 3,
          padding: 3,
        }}
      >
        {this.employeeDetailsView()}
        {this.calenderView()}
        {this.state.empDetailsArray.map((item, key) =>
          item.IsMultipleSupv ? this.approverList(key) : null
        )}
        {this.approverSearch()}
        {this.proceedButtonView()}
        {this.lastThreeWeekStatusView()}
      </View>
    );
  };

  render() {
    return (
      <ImageBackground style={{ flex: 1 }} source={images.loginBackground}>
        <View style={{ flex: 1 }}>
          <SubHeader
            pageTitle={globalConstants.MY_TIMESHEET_TITLE}
            backVisible={true}
            logoutVisible={true}
            handleBackPress={() => this.handleBack()}
            navigation={this.props.navigation}
          />
          <View style={styles.containerInnerView}>{this.topView()}</View>
          <ActivityIndicatorView loader={this.state.isLoading} />
          {/* <HistoryView historyData={this.state.historyData} forwardedRef={this._panel} isComingFromVoucher={false} visibility={this.state.modalVisible} onClose={() => this.onHistoryClose()} /> */}
        </View>
      </ImageBackground>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loginData: state && state.loginReducer && state.loginReducer.loginData,
  };
};

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyTimesheetScreen4);

/* eslint-disable prettier/prettier */
import React, { Component, PureComponent } from 'react';
import { connect } from 'react-redux';
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  BackHandler,
  RefreshControl,
  AppState,
  Platform,
  ImageBackground,
  ScrollView,
  Image,
} from 'react-native';
import { styles } from './styles';
import {
  checkingForAttendance,
  resetDashboardCreator,
  checkingForEligibility,
  loading,
  clearAttendance,
  pendingActionCreator,
  resetErrors,
} from './PendingAction';
import {
  callLocation,
  currentTime,
  GridDataViewAttendance,
} from './DashboardUtility2';
import ActivityIndicatorView from '../../GlobalComponent/myActivityIndicator';
import { AppStore } from '../../../AppStore';
import { enableLocation } from '../attendance/AttendanceUtils';
import {
  LOCATION_NOT_FOUND,
  OUT_OF_CAMPUS,
  WELCOME,
  COUNTRY_CODE,
} from './Constants';
import Header from '../../GlobalComponent/Header';
import { writeLog } from '../../utilities/logger';
import UserMessage from '../../components/userMessage';
import DialogModal from '../../components/dialogBox';
import moment from 'moment';
import { showToast } from '../../GlobalComponent/Toast';
import { getAttendanceDay, setAttendanceDay } from '../auth/AuthUtility';
// import { fcmService } from '../../GlobalComponent/pushNotification/FCMService';
// import { localNotificationService } from '../../GlobalComponent/pushNotification/LocalNotificationService';
import images from '../../images';
import LinearGradient from 'react-native-linear-gradient';
import { AppStyle } from '../commonStyle';
import { DEVICE_ID, DEVICE_VERSION } from '../../components/DeviceInfoFile';
import PrivacyFile from './PrivacyFile';
import { getData } from '../../utilities/asyncStorage';

const GH = 120;
let constants = require('./Constants');
let isAlert;
let distance;
let eligibilityStartTime, eligibilityEndTime;

const defaultState = {
  totalCount: 0,
  numColumns: 3,
  isRefreshing: false,
  isMessageToShow: false,
  inCampus: false,
  distance: 0,
  message: '',
  isMessageShown: '',
  statusCode: 0,
  showModal: false,
  isAcceptPrivacyPolicy: false,
  modalNode: null,
  backButtonPressed: false,
};
class DashboardNew2 extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      ...defaultState,
      // images: [
      //   require('../../assets/bg01.jpg'),
      //   require('../../assets/bg_03.jpg'),
      // ],
    };
  }

  attendanceSuccessCallBack = (response) => {
    if (response && response[0] && response[0]?.attendaceMarked) {
      setTimeout(() => {
        this.setState({
          showModal: true,
          isMessageShown: 'Your attendance has been marked successfully.',
        });
      }, 1000);
    }
  };

  errorCallBack = (response) => {
    console.log('errorCallBack +++++++++', response);
    this.setState({
      showModal: true,
      statusCode: response?.split(':')[1],
      isMessageShown: response?.split(':')[0],
    });
  };

  errorCallBackDashBoard = (response) => {
    console.log('errorCallBackDashBoard +++++++++', response);
    this.setState({ showModal: true, isMessageShown: response });
  };

  componentDidMount() {
    this.getPrivacyPolicy();
    if (AppStore.getState().loginReducer.loginData !== undefined) {
      let emp = AppStore.getState().loginReducer.loginData.SmCode;
      isAlert = emp === '00076250';
    }
    if (Platform.OS === 'android') {
      enableLocation();
    }
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick
    );
    this.props.navigation.addListener('willFocus', this.onFocus);
    // fcmService.registerAppWithFcm();
    // fcmService.register(onRegister, onNotification, onOpenNotification);
    // localNotificationService.configure(onOpenNotification);

    // async function onRegister(token) {
    //   console.log('[App] onRegister : ', token);
    //   let data = {};
    //   data.registration_token = token;
    //   data.device_id = DEVICE_ID;
    //   console.log('Data to send on server is  :', data);
    // }

    // function onNotification(notify) {
    //   console.log('[App] onNotification : ', notify);
    //   const options = {
    //     soundName: 'default',
    //     playSound: true,
    //     bigPictureUrl: 'https://picsum.photos/200',
    //   };
    //   localNotificationService.showNotification(
    //     0,
    //     notify.title,
    //     notify.body,
    //     notify,
    //     options
    //   );
    // }

    // function onOpenNotification(notify) {
    //   console.log('[App] onOpenNotification3 :', notify);
    // }
  }

  checkToHitEligibility = async () => {
    let isAttendanceSaved = await getAttendanceDay();
    if (
      isAttendanceSaved == null ||
      isAttendanceSaved !== this.props.loginData.TodayDate
    ) {
      this.props.checkEligibility(
        currentTime,
        this.props.loginData.SmCode,
        this.props.loginData.Authkey,
        this.hitForAttendance
      );
    }
  };
  handleAppStateChange = async (nextAppState) => {
    console.log('App state change is called', nextAppState);
    if (
      nextAppState == 'active' &&
      this.props.loginData &&
      this.props.loginData.SmCode
    ) {
      this.checkToHitEligibility();
    }
  };
  saveDateForAttendance = async () => {
    setAttendanceDay(this.props.loginData.TodayDate);
  };
  callAttendanceService = (currentTime, position) => {
    console.log('Calling attendance service.');
    this.props.checkAttendance(
      currentTime,
      this.props.loginData.SmCode,
      this.props.loginData.Authkey,
      position.coords.latitude,
      position.coords.longitude,
      this.attendanceSuccessCallBack,
      this.errorCallBackDashBoard
    );
  };
  welcomeCallBack = (distance) => {
    this.distance = distance;
    console.log('welcome call back invoked distance....', distance);
    this.setState({ isMessageToShow: true });
    setTimeout(() => {
      this.setState({
        isMessageToShow: false,
        inCampus: false,
        distance: 0,
        message: '',
      });
    }, 3500);
    if (distance === null) {
      this.setState({ message: LOCATION_NOT_FOUND });
    } else if (distance > 200) {
      this.setState({ inCampus: false, distance: distance });
      this.setState({ message: OUT_OF_CAMPUS });
    } else {
      this.setState({ inCampus: true, distance: distance });
      this.setState({ message: WELCOME });
    }
  };
  hideLoader = () => {
    this.props.hideLoader();
  };
  hitForAttendance = async () => {
    eligibilityEndTime = new Date().getTime();
    let diff = eligibilityEndTime - eligibilityStartTime;
    console.log(
      'Check eligibility service Time : ',
      moment.duration(diff, 'milliseconds').asSeconds()
    );
    if (
      this.props.eligibilityData &&
      this.props.eligibilityData.length > 0 &&
      this.props.eligibilityData[0].attendaceMarked === 'N' &&
      this.props.eligibilityData[0].wasEligibile === 'Y' &&
      this.props.eligibilityData[0].Withinshift === 'Y'
    ) {
      console.log(
        'Getting location after eligibility service response if attendance not marked'
      );
      callLocation(
        this.callAttendanceService,
        this.welcomeCallBack,
        this.hideLoader
      );
    } else if (
      this.props.eligibilityData &&
      this.props.eligibilityData.length > 0 &&
      isAlert
    ) {
      console.log(
        'Getting location after eligibility service response if attendance marked'
      );
      callLocation(null, this.welcomeCallBack, this.hideLoader);
      this.props.hideLoader();
      await setAttendanceDay(this.props.loginData.TodayDate);
    } else {
      await setAttendanceDay(this.props.loginData.TodayDate);
      this.props.hideLoader();
    }
  };
  onFocus = async () => {
    AppState.addEventListener('change', this.handleAppStateChange);
    if (AppStore.getState().loginReducer.loginData !== undefined) {
      let emp = AppStore.getState().loginReducer.loginData.SmCode;
      writeLog(emp + ' Landed on ' + 'DashboardNew');
      this.props.getPendingCounts(
        this.props.loginData,
        false,
        this.errorCallBack
      );
      eligibilityStartTime = new Date().getTime();
      this.checkToHitEligibility();
    }
  };

  resetState = () => {
    this.setState({ ...defaultState });
  };

  componentWillUnmount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick
    );
    AppState.removeEventListener('change', this.handleAppStateChange);
    // this.props.reset();
    this.resetState();
  }

  handleBackButtonClick = () => {
    this.setState({
      isMessageShown: 'Do you want to quit the app?',
      backButtonPressed: true,
    });
    return true;
  };
  static getDerivedStateFromProps(nextProps, state) {
    if (nextProps.pendingData && nextProps.pendingData.length > 0) {
      const data = nextProps.pendingData;
      console.log('Pending data +++++++++++++++++: ', data);
      let total = data.reduce((acc, ele) => {
        acc += parseInt(ele.Count);
        return acc;
      }, 0);
      console.log('Pending total : +++++++++++++++++ ', total);
      return {
        totalCount: total,
      };
    } else {
      return null;
    }
  }
  onItemClick = (item) => {
    if (item.key === 'My Approvals') {
      if (this.state.totalCount > 0) {
        this.props.navigation.push('DashBoard', {
          loginApiResponse: this.props.loginData,
        });
      } else {
        return showToast(constants.NO_APPROVALS_TO_APPROVE);
      }
    }
    writeLog('Clicked on ' + item.key + ' of ' + 'DashboardNew');
    AppState.removeEventListener('change', this.handleAppStateChange);
    this.props.navigation.navigate(item.screenToNavigate);
  };

  renderItem = ({ item, index }) => {
    if (item?.empty == true) {
      return <View style={[styles.gridItemInvisible, styles.itemInvisible]} />;
    }
    return (
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        colors={['#F9F6EE', '#D3E5FC']}
        style={[styles.gridItem, { height: GH / 1.3, width: GH }]}
      >
        <TouchableOpacity
          onPress={() => {
            this.onItemClick(item);
          }}
        >
          <Image
            style={{ alignSelf: 'center', justifyContent: 'center' }}
            source={item.navOptionThumb}
          />
          <Text style={styles.gridItemText}>{item.key}</Text>
          <Text style={styles.gridItemText}>
            {item.key === 'My Approvals' ? `(${this.state.totalCount})` : ''}
          </Text>
        </TouchableOpacity>
      </LinearGradient>
    );
  };

  formatRow = (data, numColumns) => {
    if (data != undefined) {
      const numberOfFullRows = Math.floor(data.length / numColumns);
      let numberOfElementsLastRow = data.length - numberOfFullRows * numColumns;

      while (
        numberOfElementsLastRow !== numColumns &&
        numberOfElementsLastRow !== 0
      ) {
        data.push({ key: `blank-${numberOfElementsLastRow}`, empty: true });
        numberOfElementsLastRow++;
      }
      return data;
    }
  };

  showPopUp = () => {
    let heading;
    if (
      this.props.attendanceData &&
      this.props.attendanceData.length > 0 &&
      this.props.attendanceData[0] &&
      this.props.attendanceData[0].attendaceMarked !== null &&
      this.props.attendanceData[0].attendaceMarked === 'Y'
    ) {
      heading = 'Attendance';
    } else if (this.state.backButtonPressed === true) {
      heading = 'Confirm Exit';
    } else if (this.state.statusCode == 404 || this.state.statusCode == 402) {
      heading = 'Error';
    } else {
      heading = 'Info';
    }
    return (
      <UserMessage
        modalVisible={true}
        heading={heading}
        message={this.state.isMessageShown}
        okAction={this.onOkClick}
      />
    );
  };
  renderLogoutPopUp = () => {
    return (
      <DialogModal
        isVisible={this.state.backButtonPressed}
        headerText="Exit App ?"
        messageText={
          <Text style={{ textAlign: 'center' }}>
            {this.state.isMessageShown}
          </Text>
        }
        cancelButtonText={'CANCEL'}
        handleCancel={this.handleCancel}
        confirmButtonText={'OK'}
        handleConfirm={this.handleConfirm}
      />
    );
  };
  handleConfirm = () => {
    this.setState({ backButtonPressed: false });
    BackHandler.exitApp();
  };
  handleCancel = () => {
    this.setState({ backButtonPressed: false });
  };
  onOkClick = () => {
    if (this.state.backButtonPressed === true) {
      this.setState({ backButtonPressed: false }, () => {
        BackHandler.exitApp();
      });
    }
    this.props.resetError();
    this.props.clearAttendance();
    this.setState({ showModal: false, isMessageShown: '' }, () => {
      if (this.state.statusCode === 404) {
        this.props.navigation.navigate('Login');
      }
    });
  };
  onRefresh = () => {
    this.checkToHitEligibility();
    this.setState({ isRefreshing: true });
    this.wait(1000).then(() => this.setState({ isRefreshing: false }));
  };
  wait(timeout) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, timeout);
    });
  }
  renderWelcomeMessage = () => {
    if (this.state.isMessageToShow) {
      let backGroundColor = 'green';
      if (this.state.inCampus) {
        backGroundColor = 'green';
      } else {
        backGroundColor = 'red';
      }
      return (
        <View
          style={[styles.welcomeView, { backgroundColor: backGroundColor }]}
        >
          <Text style={styles.welcomeText}>{this.state.message}</Text>
          <Text style={styles.welcomeText}>
            {this.state.distance ? ' Distance: ' + this.state.distance : null}
          </Text>
        </View>
      );
    } else {
      return null;
    }
  };

  prodGridVisible = (gridData) => {
    if (
      this.props.loginData &&
      this.props.loginData.IsVoucherVisible &&
      this.props.loginData.IsVoucherVisible == 'Y'
    ) {
      return gridData.filter((item) => item.key !== 'CoWIN');
    } else {
      return gridData.filter(
        (item) => item.key !== 'Voucher' && item.key !== 'CoWIN'
      );
    }
  };

  getPrivacyPolicy = async () => {
    try {
      let privacyPolicyData = await getData('privacyPolicyData');
      const { SmCode } = this.props.loginData;
      // console.log(
      //   '=== parsedData',
      //   privacyPolicyData?.checkVisible &&
      //     privacyPolicyData?.userSmCode === SmCode,
      //   privacyPolicyData?.userSmCode,
      //   privacyPolicyData?.checkVisible,
      //   SmCode
      // );
      if (
        privacyPolicyData?.checkVisible &&
        privacyPolicyData?.userSmCode === SmCode
      ) {
        this.setState({
          isAcceptPrivacyPolicy: privacyPolicyData.checkVisible,
          modalNode: null,
        });
      } else {
        this.setState({
          modalNode: (
            <PrivacyFile
              navigation={this.props.navigation}
              privacyModalFunc={this.handlePrivacyPolicyModal}
              loginUser={this.props.loginData}
            />
          ),
        });
      }
    } catch (error) {
      console.log('fetch data from async storage', error);
    }
  };

  handlePrivacyPolicyModal = (cb = () => {}) => {
    const { isPrivacyPolicyOpen } = this.state;
    this.setState(
      {
        isPrivacyPolicyOpen: !isPrivacyPolicyOpen,
        modalNode: null,
      },
      () => cb()
    );
  };

  filteredData = (arr, key) => {
    const gridData = arr.filter((item) => item.key !== key);
    console.log('filteredData +++++++ ', key, arr, gridData);
    return gridData;
  };

  render() {
    const { modalNode, isAcceptPrivacyPolicy } = this.state;
    const { loginData, eligibilityData } = this.props;
    let data = GridDataViewAttendance;
    // const restrictedCompanies = COUNTRY_CODE.includes(loginData?.CO_CODE);
    // console.log(
    //   'this.props.loginData +++++++ ',
    //   loginData,
    //   restrictedCompanies
    // );

    // if (eligibilityData && eligibilityData.length > 0) {
    //   if (eligibilityData[0].wasEligibile === 'X') {
    //     data = this.filteredData(data, 'View Attendance');
    //   }
    // } else {
    //   if (restrictedCompanies) {
    //     data = this.filteredData(data, 'View Attendance');
    //   }
    // }
    // data = properties.isDevEnvironment ? data : this.prodGridVisible(data);
    // if (loginData?.IsVoucherVisible === 'N') {
    //   data = this.filteredData(data, 'Voucher');
    // }
    // if (loginData?.PolicyID === 0) {
    //   data = data.filter((item) => item.key !== 'Scheme & Policies');
    // }
    // if (loginData?.IsCommunicationAccount === 'N') {
    //   data = this.filteredData(data, 'My Info');
    // }
    // if (loginData?.IsCommunicationAccount === 'N') {
    //   data = this.filteredData(data, 'Balances');
    // }
    if (loginData?.IsICard === '0') {
      data = this.filteredData(GridDataViewAttendance, 'ID Card');
    }
    // if (loginData?.IsHRAssist === 'N') {
    //   data = this.filteredData(data, 'HR Assist');
    // }
    // if (loginData?.IsLeave === 'N') {
    //   data = this.filteredData(data, 'Apply Leave');
    // }
    // if (loginData?.IsHoliday === 'N') {
    //   data = this.filteredData(data, 'Holiday List');
    // }
    // if (loginData?.IsITServiceDesk === 'N') {
    //   data = this.filteredData(data, 'IT-Desk');
    // }

    return (
      <View style={{ flex: 1 }}>
        <ImageBackground
          style={styles.backGroundView}
          source={images.loginBackground}
        >
          <Header props={this.props} />
          <Text style={styles.versionTextStyle}>
            {'App Ver : ' + DEVICE_VERSION}
          </Text>
          <LinearGradient
            colors={['#053E6D', '#0569B9']}
            style={{
              width: '95%',
              alignSelf: 'center',
              borderWidth: 1,
              borderColor: 'orange',
              borderRadius: 8,
            }}
          >
            <Text
              style={[
                AppStyle.font.fontMediumBold,
                { alignSelf: 'center', color: '#fff', marginVertical: '2%' },
              ]}
            >
              {'Hi ' + this.props.loginData?.SmFirstname}
            </Text>
          </LinearGradient>
          <View style={{ flex: 1, marginTop: '2%' }}>
            {isAlert || distance === null ? this.renderWelcomeMessage() : null}
            <ScrollView
              keyboardShouldPersistTaps="handled"
              style={styles.gridParent}
              refreshControl={
                <RefreshControl
                  onRefresh={this.onRefresh}
                  refreshing={this.state.isRefreshing}
                />
              }
            >
              <FlatList
                data={this.formatRow(data, this.state.numColumns)}
                extraData={this.state}
                renderItem={this.renderItem}
                numColumns={this.state.numColumns}
                keyExtractor={(item, index) => index}
              />
            </ScrollView>
            {this.state.showModal === true ? this.showPopUp() : null}
            {this.renderLogoutPopUp()}
          </View>
          {isAcceptPrivacyPolicy ? (
            <ActivityIndicatorView loader={this.props.loading} />
          ) : null}
        </ImageBackground>
        {!isAcceptPrivacyPolicy && modalNode}
      </View>
    );
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    getPendingCounts: (user, val, errorCallBack) =>
      dispatch(pendingActionCreator(user, val, errorCallBack)),
    checkEligibility: (time, empCode, authKey, attendanceCallBack) =>
      dispatch(
        checkingForEligibility(time, empCode, authKey, attendanceCallBack)
      ),
    checkAttendance: (
      currentTime,
      empCode,
      authKey,
      lat,
      lng,
      attendanceSuccessCallBack,
      errorCallBackDashBoard
    ) =>
      dispatch(
        checkingForAttendance(
          currentTime,
          empCode,
          authKey,
          lat,
          lng,
          attendanceSuccessCallBack,
          errorCallBackDashBoard
        )
      ),
    reset: () => dispatch(resetDashboardCreator()),
    hideLoader: () => dispatch(loading(false)),
    resetError: () => dispatch(resetErrors()),
    clearAttendance: () => dispatch(clearAttendance()),
  };
};
const mapStateToProps = (state) => {
  return {
    loginData: state?.loginReducer?.loginData,
    pendingData: state?.pendingReducer?.pendingData,
    loading: state?.pendingReducer?.loading_pending,
    pendingError: state?.pendingReducer?.pendingError,
    attendanceData: state?.pendingReducer?.attendanceData,
    attendanceError: state?.pendingReducer?.attendanceError,
    eligibilityData: state?.pendingReducer?.eligibilityData,
    viewAttendanceError: state?.pendingReducer?.viewAttendanceError,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardNew2);

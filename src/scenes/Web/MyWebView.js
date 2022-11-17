import React, { Component } from 'react';
import { WebView } from 'react-native-webview';
import SubHeader from '../../GlobalComponent/SubHeader';
import {
  View,
  BackHandler,
  Alert,
  Text,
  Modal,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import ActivityIndicatorView from '../../GlobalComponent/myActivityIndicator';
import { TEMP_URI } from '../auth/constants';
import { connect } from 'react-redux';
import {
  loginWithAdAction,
  againLoginWithAdAction,
  clearData,
  removeLoader,
} from './WebViewAction';
import { loginAction } from '../login/LoginAction';
import {
  setUserName,
  setToken,
  setSknToken,
  getUserName,
} from '../auth/AuthUtility';
import { styles } from './styles';
import { LOGIN_WITH_HEADING } from './constants';
import { pendingActionCreator } from '../Dashboard/PendingAction';
import { Image } from 'react-native-elements';
import { writeLog } from '../../utilities/logger';
import { showToast } from '../../GlobalComponent/Toast';
import { DEVICE_VERSION } from '../../components/DeviceInfoFile';
const backgroundImage = require('../../assets/iniitian_splash.png');
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
let URI, webState;
class MyWebView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      dialogShown: false,
      isLoginAgain: false,
      TKN: '',
      SKN: '',
      modalVisible: false,
      modalShown: false,
    };
    this.WEBVIEW_REF = React.createRef();
    this._panel = React.createRef();
  }
  hideSpinner = () => {
    this.setState({ loading: false });
  };
  showSpinner = () => {
    this.setState({ loading: true });
  };
  handleBack = () => {
    if (this.state.canGoBack && this.state.title !== 'Working') {
      // console.log("Can go back")
      if (this.WEBVIEW_REF.current) {
        this.WEBVIEW_REF.current.goBack();
      }
    } else {
      // console.log("Can't go back")
      this.props.navigation.pop();
    }
    return true;
  };
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBack);
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBack);
  }

  backHandler = () => {
    this.handleBack();
  };

  openPanel = () => {
    this.setState({ loading: false, modalVisible: true });
  };
  closeModal = (user) => {
    this.props.clearData();
    this.setState({ modalVisible: false, isLoginAgain: false }, () => {
      this.props.againLoginWithAd(
        this.state.TKN,
        this.state.SKN,
        user,
        DEVICE_VERSION,
        this.goForward
      );
    });
  };
  onNavigationStateChange = (navState) => {
    webState = navState;
    console.log(
      'Landed on ' + 'MyWebView' + ' with url ' + JSON.stringify(navState)
    );
    writeLog('Landed on ' + 'MyWebView' + ' with url ' + navState.url);
    if (navState.url.includes('Tkn=')) {
      let token = navState.url.substring(
        navState.url.indexOf('Tkn=') + 4,
        navState.url.indexOf('&Skn=')
      );
      let skn = navState.url.substring(navState.url.indexOf('&Skn=') + 5);
      console.log('Token found');
      console.log('SKN found');
      this.setState({ TKN: token, SKN: skn }, () => {
        this.props.loginWithAd(
          this.state.TKN,
          this.state.SKN,
          DEVICE_VERSION,
          this.goForward
        );
      });
    } else if (
      navState.title.includes('Sign out') &&
      navState.loading === true
    ) {
      this.props.navigation.replace('Login');
    } else if (
      navState.title.includes('iNIITian Production Webserver Error Report') &&
      navState.loading === false
    ) {
      showToast('AD Token not found!');
      this.props.navigation.replace('Login');
    }
    this.setState({
      canGoBack: navState.canGoBack,
    });
  };
  goForward = () => {
    if (
      this.props.firstAdData &&
      this.props.firstAdData.length > 0 &&
      this.state.isLoginAgain !== true
    ) {
      if (this.props.firstAdData.length > 1) {
        this.setState({ isLoginAgain: true });
        // console.log("Web state ", webState.loading)
        this.setState({ loading: false }, () => {
          setTimeout(() => {
            this.openPanel();
          }, 500);
        });
      } else {
        this.setState({ isLoginAgain: true });
        let user = this.props.firstAdData[0];
        this.props.updateLoginData(user);
        setUserName(user).then(() => {
          console.log('User name is set :', user.SmCode);
          if (
            user !== undefined &&
            user.SmCode !== undefined &&
            user.SmCode !== '' &&
            user.SmCode !== null
          ) {
            this.props.navigation.replace('DashBoardNew2');
          }
        });
      }
    } else {
      console.log('Going back to AdLogin due to local service faliure');
      this.props.navigation.replace('Login');
    }
  };
  againLogin = (user) => {
    this.props.againLoginWithAd(
      this.state.TKN,
      this.state.SKN,
      user,
      DEVICE_VERSION,
      this.goForward
    );
  };
  sectionItem = (item) => {
    // console.log("employee data is :", item)
    return (
      <View>
        <TouchableOpacity
          style={{ marginTop: 10 }}
          onPress={() => this.closeModal(item)}
        >
          <Text style={{ color: 'white', fontSize: 16 }}>{item.EmpCode}</Text>
        </TouchableOpacity>
        <View style={styles.line} />
      </View>
    );
  };
  showModal = () => {
    return (
      <View>
        <Modal
          visible={this.state.modalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => {
            this.closeModal();
          }}
        >
          <View style={styles.modalContainer}>
            <View>
              <Text style={styles.modalHeading}>{LOGIN_WITH_HEADING}</Text>
            </View>
            <FlatList
              data={this.props.firstAdData}
              keyExtractor={(item, index) => item + index}
              renderItem={({ item }) => this.sectionItem(item)}
            />
          </View>
        </Modal>
      </View>
    );
  };
  onOkClick = () => {
    writeLog('Clicked on ' + 'onOkClick' + ' of ' + 'MyWebView');
    this.props.navigation.navigate('Login');
  };

  showAlert = () => {
    if (this.props.firstAdData && this.props.firstAdData.length > 0) {
      if (
        this.props.firstAdData[0].EmpCode === null &&
        this.state.dialogShown !== true &&
        this.state.loading !== true
      ) {
        this.setState({ dialogShown: true });
        setTimeout(() => {
          writeLog(
            'Dialog is open with Ad Login : message is => ' +
              this.props.firstAdData[0].Message +
              ' on ' +
              'MyWebView'
          );
          return Alert.alert(
            'Ad Login',
            this.props.firstAdData[0].Message,
            [{ text: 'OK', onPress: () => this.onOkClick() }],
            { cancelable: false }
          );
        }, 1000);
      }
    }
  };

  render() {
    let opacityN = this.state.TKN === '' ? 1 : 1;
    let isWeb = this.state.TKN === '' ? true : false;
    let url =
      this.props.navigation.state.params &&
      this.props.navigation.state.params.URL;
    return (
      <View style={{ flex: 1 }}>
        {isWeb === true ? (
          <WebView
            source={{ uri: url }}
            onLoadStart={() => this.showSpinner()}
            onLoad={() => this.hideSpinner()}
            onLoadEnd={() => this.hideSpinner()}
            style={{ marginTop: 20, opacity: opacityN }}
            ref={this.WEBVIEW_REF}
            onNavigationStateChange={this.onNavigationStateChange.bind(this)}
          />
        ) : (
          <Image
            style={{
              width: screenWidth,
              height: screenHeight,
            }}
            source={backgroundImage}
          />
        )}
        {this.showAlert()}
        {this.showModal()}
        <ActivityIndicatorView loader={this.state.loading} />
        <ActivityIndicatorView loader={this.props.adLoading} />
      </View>
    );
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    clearData: () => dispatch(clearData()),
    removeLoader: () => dispatch(removeLoader()),
    loginWithAd: (adToken, skn, version, forwardCallBack) =>
      dispatch(loginWithAdAction(adToken, skn, version, forwardCallBack)),
    againLoginWithAd: (adTokn, skn, user, version, forwardCallBack) =>
      dispatch(
        againLoginWithAdAction(adTokn, skn, user, version, forwardCallBack)
      ),
    updateLoginData: (user) => dispatch(loginAction(user)),
    getPendingCounts: (user, val) => dispatch(pendingActionCreator(user, val)),
  };
};
const mapStateToProps = (state) => {
  return {
    loginData: state && state.loginReducer && state.loginReducer.loginData,
    firstAdData: state.webReducer.firstAdData,
    adLoading: state.webReducer.adLoading,
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyWebView);

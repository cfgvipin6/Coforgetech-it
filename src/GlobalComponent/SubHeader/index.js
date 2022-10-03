import React, { Component } from 'react';
import {
    View,
    Image,
    Text,
    TouchableOpacity,
    Modal,
} from 'react-native';
import style, { styles } from './style';
import DialogModal from '../../components/dialogBox';
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements';
import {removeUserName, removePassword, getLoginType, removeLoginType } from '../../scenes/auth/AuthUtility';
import { loginDataClear } from '../../scenes/login/LoginAction';
import { AD_LOGIN, APP_LOGIN } from '../../scenes/login/constants';
import { TEMP_URI } from '../../scenes/auth/constants';
import properties from '../../resource/properties';
import images from '../../images';
import { AppStyle } from '../../scenes/commonStyle';
import OrangeBar from '../../components/orangeBar';
// import { rootReducer, AppReducer } from '../../../AppReducer';

let constant = require('./constants');
let globalConstants = require('../../GlobalConstants');
let name , surName;
class SubHeaderView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showLogoutModal: false,
      modalVisible: false,
      heading : 'Logout',
      message: 'Are you sure to logout ?',
    };
    name = (this.props.loginData && this.props.loginData.SmFirstname === undefined) ? 'iEngage' : (this.props.loginData && this.props.loginData.SmFirstname);
    surName = (this.props.loginData &&  this.props.loginData.SmLastName === undefined) ? '' : (this.props.loginData && this.props.loginData.SmLastName);
  }

  handleLogout() {
    this.setState({
        modalVisible: true,
    });
  }
  handleLogoutConfirm() {
    this.setState({
        modalVisible: false,
    },()=>{
      removeUserName();
      removePassword();
      this.props.navigation.replace('Login');
    });
  }
  showLogoutDialog() {
    if (this.state.showLogoutModal) {
      let headerTitleMsg = constant.LOGOUT_TEXT;
      return (
        <DialogModal
          isVisible={this.state.showLogoutModal}
          headerText="Confirm Logout"
          messageText={
            <Text style={{ textAlign: 'center', fontSize: 16 }}>
              {headerTitleMsg}
            </Text>
          }
          cancelButtonText={'CANCEL'}
          handleCancel={() => this.setState({ showLogoutModal: false })}
          confirmButtonText={'OK'}
          handleConfirm={() => this.handleLogoutConfirm()}
        />
      );
    }
  }

  drawerItemClicked = () => {
    this.props.navigation.toggleDrawer();
  };
  showModal=()=>{
    return (   <Modal
            visible={this.state.modalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => {
                this.setState({ modalVisible: false });
            }}>
            <View style={styles.modalOuterView}>
                <View color={'#D3E5FC'} style={styles.optionsOuterView}>
                    <View style={styles.messageView}>
                    <View style={styles.rowHolder2}>
                    <View style={styles.innerLogoutView}>
                    <TouchableOpacity onPress={() =>  this.setState({ modalVisible: false })} style={styles.closeButton}>
                    <Image source={images.crossButton}/>
                    </TouchableOpacity>
                    </View>
                    </View>

                    <Image source={images.logoutLogo}/>
                    <Text style={styles.modalFirstHeading}>{this.state.message}</Text>
                    </View>
                    {/* <View style={styles.horizontalLine} /> */}
                    <View style={[styles.optionsView]}>
                       <View style={styles.rowHolder2}>
                       <TouchableOpacity onPress={() =>  this.handleLogoutConfirm()} style={styles.modalOptionTouchable} underlayColor={'transparent'}>
                            <Image source= {images.logoutYesBtn} />
                            {/* <Text accessibilityLabel={'Yes'} style={styles.modalOptions}>{'Yes'}</Text> */}
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() =>  this.setState({ modalVisible: false })} style={styles.modalOptionTouchable2} underlayColor={'transparent'}>
                        <Image source= {images.logoutNoBtn} />
                            {/* <Text accessibilityLabel={'Cancel'} style={styles.modalOptions}>{'Cancel'}</Text> */}
                        </TouchableOpacity>
                       </View>
                    </View>
                </View>
            </View>
    </Modal> );
  }
  render() {
    return (
        <View style={styles.containerView}>
            <View style={styles.rowHolder}>
            {this.props.backVisible ? (
        <TouchableOpacity style={styles.backbutton} onPress={() => this.doBack()}>
        <Icon name="navigate-before" color= {AppStyle.color.iengageTheme} size={40}/>
        </TouchableOpacity>
      ) : null}
            <Text style={[styles.titleLogo]}>{this.props.pageTitle}</Text>
            { !this.props.isLoginScreen &&
                <TouchableOpacity
          style={styles.logoutBox}
          onPress={() => this.handleLogout()}
        >
          <Icon
            name="power-settings-new"
            color= "#f68a23" size={37} />
        </TouchableOpacity>
            }
            </View>
           <OrangeBar/>
           {this.showModal()}
        </View>
    );
}

  onBackPress = (ref) => {
    ref.props.navigation.pop();
  }

  doBack() {
    this.props.handleBackPress();
  }
}
const mapStateToProps = state => {
    return {
      loginData: state && state.loginReducer &&  state.loginReducer.loginData,
    };
  };

  const mapDispatchToProps = dispatch => {
    return {
    };
  };
  export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(SubHeaderView);

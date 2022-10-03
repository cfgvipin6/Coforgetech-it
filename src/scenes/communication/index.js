import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Text, View, Alert, BackHandler, ImageBackground } from 'react-native';
import { Card } from 'react-native-elements';
import SubHeader from '../../GlobalComponent/SubHeader';
import { communicationAction, resetCommData } from './communicationAction';
import ActivityIndicatorView from '../../GlobalComponent/myActivityIndicator';
import helper from '../../utilities/helper';
import { styles } from './styles';
import { globalFontStyle } from '../../components/globalFontStyle';
import { writeLog } from '../../utilities/logger';
import UserMessage from '../../components/userMessage';
import BoxContainer from '../../components/boxContainer.js';
import images from '../../images';
let constants = require('./constants');
let globalConstants = require('../../GlobalConstants');
let appConfig = require('../../../appconfig');
class CommunicationScreen extends Component {
  constructor(props){
    super(props);
    this.state = {
      errorPopUp:false,
      isError:'',
    };
  }
  componentDidUpdate(){
    if (this.props.comm_error && this.props.comm_error.length > 0 && this.state.isError === ''){
      setTimeout(()=>{
        this.setState({errorPopUp:true,isError:this.props.comm_error});
      },1000);
    }
  }
  componentDidMount() {
    writeLog('Landed on ' + 'CommunicationScreen');
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    this.getCommunicationData();
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }
  getCommunicationData() {
    if (this.props.loginData && this.props.loginData.SmCode){
      this.props.getCommunicationDetails(this.props.loginData.SmCode, this.props.loginData.Authkey);
    }
  }
  onOkClick = () => {
    writeLog('Clicked on ' + 'onOkClick' + ' of ' + 'CommunicationScreen');
    this.props.resetCommunicationPage();
    this.setState({errorPopUp:false,isError:''},()=>{
      helper.onOkAfterError(this);
    });
  }

  showError = () => {
    // console.log("error of communication screen.")
    return (
      <UserMessage
        modalVisible={true}
        heading="Error"
        message={this.props.comm_error}
        okAction={() => {
            this.onOkClick();
        }}
      />
    );
  }
  showCommData = data => {
    if (data.hasOwnProperty('InternetEmail')) {
      return (
        <BoxContainer style={{margin:10}}>
        <Text style={{fontWeight:'bold',fontSize:20,alignSelf:'center',backgroundColor:appConfig.APP_SKY,width:'100%',textAlign:'center',color:appConfig.BLUISH_COLOR}}>{constants.COMMUNICATION_HEADING}</Text>
          {data.Fax.IsActive ? (
            <View style={styles.displayItemsView}>
              <Text style={globalFontStyle.cardLeftText}>{data.Fax.Key}</Text>
              <Text style={globalFontStyle.cardRightText}>{data.Fax.Value}</Text>
            </View>
          ) : null}
          {data.DiOfficeNO.IsActive ? (
            <View style={styles.displayItemsView}>
              <Text style={globalFontStyle.cardLeftText}>{data.DiOfficeNO.Key}</Text>
              <Text style={globalFontStyle.cardRightText}>{data.DiOfficeNO.Value}</Text>
            </View>
          ) : null}
          {data.InternetEmail.IsActive ? (
            <View style={styles.displayItemsView}>
              <Text style={globalFontStyle.cardLeftText}>{data.InternetEmail.Key.trim()}</Text>
              <Text style={globalFontStyle.cardRightText}>{data.InternetEmail.Value}</Text>
            </View>
          ) : null}
          {data.EmailAdd.IsActive ? (
            <View style={styles.displayItemsView}>
              <Text style={globalFontStyle.cardLeftText}>{data.EmailAdd.Key}</Text>
              <Text style={globalFontStyle.cardRightText}>{data.EmailAdd.Value}</Text>
            </View>
          ) : null}
          {data.OtherOfficeNo.IsActive ? (
            <View style={styles.displayItemsView}>
              <Text style={globalFontStyle.cardLeftText}>{data.OtherOfficeNo.Key}</Text>
              <Text style={globalFontStyle.cardRightText}>{data.OtherOfficeNo.Value}</Text>
            </View>
          ) : null}
          {data.MobPhoneNo.IsActive ? (
            <View style={styles.displayItemsView}>
              <Text style={globalFontStyle.cardLeftText}>{data.MobPhoneNo.Key}</Text>
              <Text style={globalFontStyle.cardRightText}>{data.MobPhoneNo.Value}</Text>
            </View>
          ) : null}
        </BoxContainer>
      );
    } else {
      return null;
    }
  }
  handleBackButtonClick = () => {
    this.handleBack();
    return true;
  }
  handleBack() {
    this.props.resetCommunicationPage();
    writeLog('Clicked on ' + 'handleBack' + ' of ' + 'CommunicationScreen');
    this.props.navigation.navigate('DashBoardNew2');
  }

  render() {
    return (
      <ImageBackground
      style={{flex:1}}
      source={images.loginBackground}
    >
      <View style={styles.container}>
        <ActivityIndicatorView loader={this.props.comm_pending} />
        <SubHeader
          pageTitle={globalConstants.COMMUNICATION_TITLE}
          backVisible={true}
          logoutVisible={true}
          handleBackPress={() => this.handleBack()}
          navigation={this.props.navigation}
        />
        {this.showCommData(this.props.communicationData)}
        {/* {this.props.comm_error !== "" ? this.showError() : null} */}
        {this.state.errorPopUp === true ? this.showError() : null}
      </View>
      </ImageBackground>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getCommunicationDetails: (empCode, AuthKey) => dispatch(communicationAction(empCode, AuthKey)),
    resetCommunicationPage: () => dispatch(resetCommData()),
  };
};

const mapStateToProps = state => {
  // console.log("8888888",state.communicationReducer)
  return {
    loginData: state && state.loginReducer && state.loginReducer.loginData,
    communicationData: state.communicationReducer.communicationData,
    comm_pending: state.communicationReducer.comm_pending,
    comm_error: state.communicationReducer.comm_error,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(CommunicationScreen);

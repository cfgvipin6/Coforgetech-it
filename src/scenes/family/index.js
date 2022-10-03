import React, { Component } from 'react';
import { Text, View, Alert, BackHandler, ImageBackground } from 'react-native';
import { Card } from 'react-native-elements';
import { connect } from 'react-redux';
import { familyActionCreator, resetFamily } from './familyActionCreator';
import { ScrollView } from 'react-native-gesture-handler';
import { styles } from './styles';
import ActivityIndicatorView from '../../GlobalComponent/myActivityIndicator';
import SubHeader from '../../GlobalComponent/SubHeader';
import { globalFontStyle } from '../../components/globalFontStyle';
import helper from '../../utilities/helper';
import { NO_FAMILY } from './constants';
import { writeLog } from '../../utilities/logger';
import UserMessage from '../../components/userMessage';
import BoxContainer from '../../components/boxContainer.js';
import images from '../../images';
let appConfig = require('../../../appconfig');
let globalConstants = require('../../GlobalConstants');
class FamilyScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorPopUp:false,
      isError:'',
      noFamily:'',
    };
  }
  componentDidUpdate(){
    if (this.props.familyError && this.props.familyError.length > 0 && this.state.isError === ''){
      setTimeout(()=>{
        this.setState({errorPopUp:true,isError:this.props.familyError});
      },1000);
    }
    else if (this.props.familyData.length === 0 && this.props.noFamily && this.props.familyError.length === 0 && this.state.noFamily === ''){
      setTimeout(()=>{
        this.setState({errorPopUp:true,noFamily:NO_FAMILY});
      },1000);
    }
  }
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    this.props.navigation.addListener('willFocus', this.onFocus);
  }
  onFocus = () => {
    writeLog('Landed on ' + 'FamilyScreen');
    this.props.loadFamily(this.props.loginData.SmCode, this.props.loginData.Authkey);
  }
  renderCardItem = data => {
    let keys = [];
    for (let key in data) {
      if (key != 'Relationship') {keys.push(key);}
    }
    // console.log("keys : ", keys)
    return keys.map(key => {
      // console.log("Key : ", data[key].Key)
      // console.log("Value : ", data[key].Value)
      if (data[key].IsActive) {
        return (
          <View style={styles.cardView}>
            <Text style={globalFontStyle.cardLeftText}>{data[key].Key}</Text>
            <Text style={globalFontStyle.cardRightText}>
              {data[key].Value === '' ? '-' : data[key].Value}
            </Text>
          </View>
        );
      }
    });
  }
  renderFamilyData = () => {
    return this.props.familyData.map(data => {
      return <BoxContainer style={{margin:10}}>
      <Text style={{fontWeight:'bold',fontSize:20,alignSelf:'center',backgroundColor:appConfig.APP_SKY,width:'100%',textAlign:'center',color:appConfig.BLUISH_COLOR}}>{data.Relationship.Value}</Text>
      {this.renderCardItem(data)}
         </BoxContainer>;
    });
  }
  handleBack = () => {
    writeLog('Clicked on ' + 'handleBack' + ' of ' + 'FamilyScreen');
    // this.props.navigation.navigate("DashBoardNew")
    this.props.navigation.pop();
  }
  onOkNoFamily = () => {
    this.props.resetFamily();
    this.setState({errorPopUp:false,noFamily:''},()=>{
      this.handleBack();
    });
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    this.props.resetFamily();
  }

  handleBackButtonClick = () => {
    this.handleBack();
    return true;
  }
  shouldPopup = () => {
    // console.log("In side show error of Family screen.")
    if (this.state.isError.length > 0){
      return this.showPopUp('Error',this.props.familyError);
    } else if (this.state.noFamily.length > 0){
      return this.showPopUp('Info', this.state.noFamily);
    } else {
      return null;
    }
  }
  showPopUp=(heading,message)=>{
    return (
      <UserMessage
        modalVisible={true}
        heading={heading}
        message={message}
        okAction={() => {
            if (this.state.isError.length > 0){
              this.onOkClick();
            } else if (this.state.noFamily.length > 0){
              this.onOkNoFamily();
            }
        }}
      />
    );
  }

  onOkClick = () => {
    writeLog('Clicked on ' + 'onOkClick' + ' of ' + 'Family Screen');
    this.props.resetFamily();
    this.setState({errorPopUp:false,isError:''},()=>{
      helper.onOkAfterError(this);
    });
  }
  render() {
    return (
      <ImageBackground
      style={{flex:1}}
      source={images.loginBackground}
    >
      <View style={styles.container}>
        <SubHeader
          pageTitle={globalConstants.FAMILY_TITLE}
          backVisible={true}
          logoutVisible={true}
          handleBackPress={() => this.handleBack()}
          navigation={this.props.navigation} />
        <ActivityIndicatorView loader={this.props.familyLoading} />
        <ScrollView
        	keyboardShouldPersistTaps='handled'
        >
          {this.props.familyData.length > 0 ? this.renderFamilyData() : null}
        </ScrollView>
        {this.state.errorPopUp === true ? this.shouldPopup() : null}
      </View>
      </ImageBackground>
    );
  }
}

mapDispatchToProps = dispatch => {
  return {
    loadFamily: (userId, authKey) => dispatch(familyActionCreator(userId, authKey)),
    resetFamily: () => dispatch(resetFamily()),
  };
};
mapStateToProps = state => {
  // console.log("Family data from family reducer is : ", state.familyReducer.familyData)
  return {
    loginData: state && state.loginReducer &&  state.loginReducer.loginData,
    familyData: state.familyReducer.familyData,
    familyLoading: state.familyReducer.familyLoading,
    familyError: state.familyReducer.familyError,
    noFamily: state.familyReducer.blankData,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(FamilyScreen);

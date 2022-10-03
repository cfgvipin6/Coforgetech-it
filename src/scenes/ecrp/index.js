/*
Author: Mohit Garg(70024)
*/

import React, { Component } from 'react';
import {
  Text,
  View,
  FlatList,
  RefreshControl,
  ImageBackground,
  Alert,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import SubHeader from '../../GlobalComponent/SubHeader';
import { connect } from 'react-redux';
import { styles } from './styles';
import { SearchBar, Card } from 'react-native-elements';
import CustomButton from '../../components/customButton';
import { globalFontStyle } from '../../components/globalFontStyle';
import { ecrpFetchData, resetEcrpStore, ecrpFetchHistory } from './ecrpAction';
import ActivityIndicatorView from '../../GlobalComponent/myActivityIndicator';
import SlidingUpPanel from 'rn-sliding-up-panel';
import helper from '../../utilities/helper';
import { writeLog } from '../../utilities/logger';
import UserMessage from '../../components/userMessage';
import BoxContainer from '../../components/boxContainer.js/index.js';
import Seperator from '../../components/Seperator.js';
import images from '../../images';
let globalConstants = require('../../GlobalConstants');
let constants = require('./constants');
const {height} = Dimensions.get('window');

class ECRPScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isRefreshing: false,
      query: '',
      localEcrpData: [],
      localEcrpBandNotData: [],
      localEcrpSearchData: [],
      localEcrpBandNotSearchData: [],
      showModal:false,
      errorMessage:'',
    };
    isPullToRefreshActive = false;
  }

  componentDidUpdate(){
    if (this.props.ecrpError && this.props.ecrpError.length > 0 && this.state.errorMessage === ''){
      setTimeout(()=>{
        this.setState({showModal:true,errorMessage:this.props.ecrpError});
      },1000);
    }
  }
  componentDidMount() {
    writeLog('Landed on ' + 'ECRPScreen');
    this.props.fetchEcrpData(this.props.empCode, this.props.accessToken, isPullToRefreshActive);
  }

  static getDerivedStateFromProps(nextProps, state) {
    // console.log("next props::::::", nextProps)
    if (nextProps.ecrpData[0] && nextProps.ecrpData.length > 0 && !state.query.length > 0) {
      return {
        localEcrpData: nextProps.ecrpData[0].SupPendingList,
        localEcrpBandNotData: nextProps.ecrpData[0].BandNotCommunicatedPendingList,
        localEcrpSearchData: nextProps.ecrpData[0].SupPendingList,
        localEcrpBandNotSearchData: nextProps.ecrpData[0].BandNotCommunicatedPendingList,
      };
    } else {
      return null;
    }
  }

  onOkClick = () => {
    this.props.resetEcrpHome();
    this.setState({showModal:false,errorMessage:''},()=>{
      this.props.navigation.navigate('DashBoard');
    });
  }

  showError = () => {
    // console.log("In side show error of ecrp screen.")
    return (
      <UserMessage
        modalVisible={true}
        heading="Error"
        message={this.props.ecrpError}
        okAction={() => {
            this.onOkClick();
        }}
      />
    );

  }

  resetEcrpState = () => {
    this.props.resetEcrpHome();
    this.props.fetchEcrpData(this.props.empCode, this.props.accessToken, isPullToRefreshActive);
  }

  wait(timeout) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(this.resetEcrpState());
      }, timeout);
    });
  }

  onRefresh = () => {
    this.setState({ isRefreshing: true });
    isPullToRefreshActive = true;
    this.wait(2000).then(() => this.setState({ isRefreshing: false }));
  }

  ecrpRequestAction = (action, item) => {
    this.props.navigation.navigate('EcrpApproveReject', {
      employeeDetails: item,
      action: action,
    });
  }

  showEcrpRowGrid = (itemName, itemValue) => {
    if (itemValue != '' && itemValue != null && itemValue != undefined) {
      return (
        <View style={styles.rowStyle}>
          <Text style={[globalFontStyle.imageBackgroundLayout, styles.textOne]}>{itemName}</Text>
          <Text style={[globalFontStyle.imageBackgroundLayout, styles.textTwo]}>{itemValue}</Text>
        </View>
      );
    } else {
      return null;
    }
  }

  bottomButtonView = item => {
    return (
      <View style={styles.buttonView}>
        <View style={styles.buttonOuterView}>
          <CustomButton
            label={constants.RELEASE_TEXT}
            positive={true}
            performAction={() => this.ecrpRequestAction(globalConstants.APPROVED_TEXT, item)}
          />
        </View>
        <View style={styles.buttonOuterView}>
          <CustomButton
            label={constants.SEND_BACK_TEXT}
            positive={false}
            performAction={() => this.ecrpRequestAction(globalConstants.REJECTED_TEXT, item)}
          />
        </View>
      </View>
    );
  }

  renderLetter = item => {
    // console.log("view letter click")
    this.props.navigation.navigate('EcrpLetter', {
      employeeDetails: item,
      // action: action
    });
  }

  renderEcrpRequest = (item, i) => {
    let wefValue = item.WEF.replace(/-/g, ' ');
    return (
          <BoxContainer>
          <View style={styles.view_One}>
            {this.showEcrpRowGrid(constants.EMPLOYEE_TEXT, item.SMName.trim())}
            {this.showEcrpRowGrid(constants.WEF_TEXT, wefValue)}
            {this.showEcrpRowGrid(constants.STATUS_TEXT, item.EmpStatus)}
            {item.FirstLevelSup.Value != ':'
              ? this.showEcrpRowGrid(constants.FIRST_LEVEL_SUP_TEXT, item.FirstLevelSup.Value)
              : null}
          </View>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity onPress={() => this.renderLetter(item)}>
              <Text style={styles.viewLetterStyle}>{constants.VIEW_LETTER_TEXT}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.openNewPanel(item.LetterSNo)}>
              <Text style={styles.viewLetterStyle}>{globalConstants.HISTORY_TEXT}</Text>
            </TouchableOpacity>
          </View>
          {this.bottomButtonView(item)}
          </BoxContainer>
    );
  }

  renderEcrpBandNotRequest = (item, i) => {
    let wefValue = item.WEF.replace(/-/g, ' ');
    return (
      <View>
        <ImageBackground style={styles.cardBackground} resizeMode="cover">
          <View style={styles.view_One}>
            {this.showEcrpRowGrid(constants.EMPLOYEE_TEXT, item.SMName.trim())}
            {this.showEcrpRowGrid(constants.WEF_TEXT, wefValue)}
            {this.showEcrpRowGrid(constants.STATUS_TEXT, item.EmpStatus)}
          </View>
          <TouchableOpacity onPress={() => this.renderLetter()}>
            <Text style={styles.viewLetterStyle}>{constants.VIEW_LETTER_TEXT}</Text>
          </TouchableOpacity>
        </ImageBackground>
      </View>
    );
  }

  showRequestsView = () => {
    return (
      <View style={globalFontStyle.listContentViewGlobal}>
        <ScrollView
        	keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl onRefresh={this.onRefresh} refreshing={this.state.isRefreshing} />
          }>
          <FlatList
            contentContainerStyle={globalFontStyle.listContentGlobal}
            data={this.state.localEcrpData}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => this.renderEcrpRequest(item, index)}
            keyExtractor={(item, index) => 'pendingRequest_' + index.toString()}
            ItemSeparatorComponent={() => <View style={globalFontStyle.listContentSeparatorGlobal} />}
          />
          {this.state.localEcrpBandNotData.length === 0 ? null : <View><View style={styles.bandNotUpperLine}/>
            <Text style={styles.bandNotHeading}>{constants.BAND_NOT_HEADING_TEXT}</Text>
          <View style={styles.bandNotBottomLine}/></View>}

          <FlatList
            contentContainerStyle={globalFontStyle.listContentGlobal}
            data={this.state.localEcrpBandNotData}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => this.renderEcrpBandNotRequest(item, index)}
            keyExtractor={(item, index) => 'pendingRequest_' + index.toString()}
            ItemSeparatorComponent={() => <View style={globalFontStyle.listContentSeparatorGlobal} />}
          />
        </ScrollView>
      </View>
    );
  }

  updateSearch = searchText => {
    this.setState(
      {
        query: searchText,
      },
      () => {
        // console.log(this.state.localEcrpSearchData)
        const filteredData = this.state.localEcrpSearchData.filter(element => {
          let str1 = element.SMName;
          let str2 = element.SMCode;
          let searchedText = str1.concat(str2);
          let elementSearched = searchedText.toString().toLowerCase();
          let queryLowerCase = this.state.query.toString().toLowerCase();
          return elementSearched.indexOf(queryLowerCase) > -1;
        });
        const filteredData1 = this.state.localEcrpBandNotSearchData.filter(element => {
          let str1 = element.SMName;
          let str2 = element.SMCode;
          let searchedText = str1.concat(str2);
          let elementSearched = searchedText.toString().toLowerCase();
          let queryLowerCase = this.state.query.toString().toLowerCase();
          return elementSearched.indexOf(queryLowerCase) > -1;
        });
        this.setState({
          localEcrpData: filteredData,
          localEcrpBandNotData: filteredData1,
        });
      }
    );
  }

  handleBack = () => {
    writeLog('Clicked on ' + 'handleBack' + ' of ' + 'ECRPScreen');
    this.props.resetEcrpHome();
    this.props.navigation.pop();
  }

  openNewPanel = (docNumber) => {
    writeLog('Clicked on ' + 'openNewPanel' + ' of ' + 'ECRPScreen' + ' for ' + docNumber);
    this._panel.show(height / 1.3);
    {this.props.fetchEcrpHistory(docNumber);}
  }

  renderCardItem=(data)=>{
    // console.log("final card Data::::",data)
    let keys = [];
    for (let key in data){
      if (data[key] != null) {
        keys.push(key);
      }
    }
    return keys.map((key)=>{
      if (data[key].IsActive){
        return (
          <View style={globalFontStyle.cardDirection}>
          <Text style={globalFontStyle.cardLeftText}>{data[key].Key}</Text>
          <Text style={globalFontStyle.cardRightText}>{data[key].Value === '' ? '-' : data[key].Value}</Text>
          </View>
         );
      }
    });
   }

  renderEcrpHistory = () => {
    return this.props.ecrpHistory.map((data, index)=>{
      let myIndex = index + 1;
      return (
        <View style={globalFontStyle.panelContainer}>
         <Card title = {globalConstants.HISTORY_RECORD_HEADING_TEXT + myIndex}>
          {this.renderCardItem(data)}
        </Card>
        </View>
      );
     });
  }

  renderHistory = () => {
    return (
      <SlidingUpPanel ref={c => (this._panel = c)}
          draggableRange={{top: height / 1.3, bottom: 0}}
          height={height}
          onMomentumDragStart={height => {height;}}
          onMomentumDragEnd={0}
        >
          {dragHandler => (
            <View style={globalFontStyle.panelNewContainer}>
              <View style={globalFontStyle.dragHandler} {...dragHandler}>
                <TouchableOpacity onPress={() => this._panel.hide()}>
                  <Image
							      source={globalConstants.DOWN_ICON}
							      style={globalFontStyle.downArrowStyle}
						      />
                </TouchableOpacity>
              </View>
              <ScrollView
              	keyboardShouldPersistTaps="handled"
              style={{flex:1, marginBottom: (height - height / 1.3)}}>
                <View style={{marginBottom: 10}}>
                  {this.renderEcrpHistory()}
                </View>
              </ScrollView>
            </View>
          )}
      </SlidingUpPanel>
    );
  }

  render() {
    const { query } = this.state;
    return (
      <ImageBackground
      style={{flex:1}}
      source={images.loginBackground}
    >
      <View style={styles.container}>
       <ActivityIndicatorView loader={this.props.ecrpLoading}/>
       <View style={globalFontStyle.subHeaderViewGlobal}>
        <SubHeader
          pageTitle={globalConstants.ECRP_TITLE}
          backVisible={true}
          logoutVisible={true}
          handleBackPress={() => this.handleBack()}
          navigation={this.props.navigation}
        />
        </View>
        <View style={globalFontStyle.searchViewGlobal}>
        <SearchBar
            lightTheme
            placeholder={'Search by document number'}
            onChangeText={this.updateSearch}
            value={query}
            round={true}
            containerStyle={globalFontStyle.searchGlobal}
            autoCapitalize="none"
            autoCompleteType="off"
            autoCorrect={false}
          />
          </View>
        <View style={globalFontStyle.contentViewGlobal}>{this.showRequestsView()}</View>
        {this.renderHistory()}
        {this.state.showModal === true ? this.showError() : null}
      </View>
      </ImageBackground>
    );
  }
}

mapStateToProps = state => {
  return {
    empCode: state.loginReducer.loginData !== undefined ? state.loginReducer.loginData.SmCode : '',
    accessToken: state.loginReducer.loginData !== undefined ? state.loginReducer.loginData.Authkey : '',
    ecrpData: state.ecrpReducer.ecrpData,
    ecrpLoading: state.ecrpReducer.ecrpLoader,
    ecrpError: state.ecrpReducer.ecrpError,
    ecrpHistory: state.ecrpReducer.ecrpHistory,
  };
};

mapDispatchToProps = dispatch => {
  return {
    resetEcrpHome: () => dispatch(resetEcrpStore()),
    fetchEcrpData: (empCode, authToken, isPullToRefreshActive) =>
      dispatch(ecrpFetchData(empCode, authToken, isPullToRefreshActive)),
    fetchEcrpHistory: (docNumber) => dispatch(ecrpFetchHistory(docNumber)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ECRPScreen);

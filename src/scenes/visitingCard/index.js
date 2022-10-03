/*
Author: Mohit Garg(70024)
*/

import React, { Component } from 'react';
import { Text, View, FlatList, RefreshControl, ImageBackground, ScrollView, Dimensions, Alert, TouchableOpacity, Image } from 'react-native';
import { connect } from 'react-redux';
import { styles } from './styles';
import SubHeader from '../../GlobalComponent/SubHeader';
import { visitingFetchData, resetVisitingStore, visitingFetchHistory } from './visitingCardAction';
import { globalFontStyle } from '../../components/globalFontStyle';
import CustomButton from '../../components/customButton';
import ActivityIndicatorView from '../../GlobalComponent/myActivityIndicator';
import { SearchBar, Card } from 'react-native-elements';
import SlidingUpPanel from 'rn-sliding-up-panel';
import helper from '../../utilities/helper';
import { writeLog } from '../../utilities/logger';
import UserMessage from '../../components/userMessage';
import images from '../../images';
let constants = require('./constants');
let globalConstants = require('../../GlobalConstants');
const {height} = Dimensions.get('window');
let appConfig = require('../../../appconfig');
class VisitingScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isRefreshing: false,
      localVisitingData: [],
      localVisitingSearchData: [],
      query: '',
      errorPopUp:false,
      isError:'',
    };
    isPullToRefreshActive = false;
  }
  componentDidUpdate(){
    if (this.props.visitingError && this.props.visitingError.length > 0 && this.state.isError === ''){
      setTimeout(()=>{
        this.setState({errorPopUp:true,isError:this.props.visitingError});
      },1000);
    }
  }
  componentDidMount() {
    writeLog('Landed on ' + 'VisitingScreen');
    this.props.fetchVisitingData(this.props.empCode, this.props.accessToken, isPullToRefreshActive);
  }

  static getDerivedStateFromProps(nextProps, state) {
    // console.log("next props::::::", nextProps)
    if (nextProps.visitingData[0] && nextProps.visitingData.length > 0 && !state.query.length > 0) {
      return {
        localVisitingData: nextProps.visitingData,
        localVisitingSearchData: nextProps.visitingData,
      };
    } else {
      return null;
    }
  }

  onRefresh = () => {
    this.setState({ isRefreshing: true });
    isPullToRefreshActive = true;
    this.wait(2000).then(() => this.setState({ isRefreshing: false }));
  }

  wait(timeout) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(this.resetVisitingState());
      }, timeout);
    });
  }

  resetVisitingState = () => {
    this.props.resetVisitingHome();
    this.props.fetchVisitingData(this.props.empCode, this.props.accessToken, isPullToRefreshActive);
  }

  visitingRequestAction = (action, item) => {
    writeLog('Invoked ' + 'visitingRequestAction' + ' of ' + 'VisitingScreen' + ' for ' + action);
    this.props.navigation.navigate('VisitingApproveReject', {
      employeeDetails: item,
      action: action,
    });
  }

  showVisitingRowGrid = (itemName, itemValue) => {
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

  renderVisitingRequest = (item, i) => {
    return (
      <View>
        <ImageBackground style={styles.cardBackground} resizeMode="cover">
          <View style={styles.view_One}>
            {this.showVisitingRowGrid(
              constants.DOCUMENT_NUMBER_TEXT,
              item.in_request_no.Value.trim()
            )}
            {this.showVisitingRowGrid(constants.EMPLOYEE_TEXT, item.NAME.Value.trim())}
            {this.showVisitingRowGrid(constants.DESIGNATION_TEXT, item.vc_designation.Value.trim())}
            {this.showVisitingRowGrid(globalConstants.EMAIL_TEXT, item.vc_mail.Value.trim())}
            {this.showVisitingRowGrid(globalConstants.MOBILE_TEXT, item.vc_mobile_no.Value)}
            {this.showVisitingRowGrid(constants.DIRECT_NO_TEXT, item.vc_direct_no.Value)}
            {this.showVisitingRowGrid(constants.FAX_TEXT, item.vc_fax_no.Value)}
            {this.showVisitingRowGrid(constants.ADDRESS_TEXT, item.in_address_no.Value.trim())}
            {this.showVisitingRowGrid(constants.QUANTITY_TEXT, item.in_quantity.Value)}
          </View>
          <View style={styles.historyViewStyle}>
            <TouchableOpacity onPress={() => this.openNewPanel(item.in_request_no.Value.trim())}>
              <Text style={globalFontStyle.hyperlinkText}>
                {globalConstants.HISTORY_TEXT}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonView}>
            <View style={styles.buttonOuterView}>
              <CustomButton
                label={globalConstants.APPROVE_CAPS_TEXT}
                positive={true}
                performAction={() =>
                  this.visitingRequestAction(globalConstants.APPROVED_TEXT, item)
                }
              />
            </View>
            <View style={styles.buttonOuterView}>
              <CustomButton
                label={globalConstants.REJECT_CAPS_TEXT}
                positive={false}
                performAction={() =>
                  this.visitingRequestAction(globalConstants.REJECTED_TEXT, item)
                }
              />
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  }

  showRequestsView = () => {
    return (
      <View style={globalFontStyle.listContentViewGlobal}>
        <FlatList
          contentContainerStyle={globalFontStyle.listContentGlobal}
          data={this.state.localVisitingData}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => this.renderVisitingRequest(item, index)}
          keyExtractor={(item, index) => 'pendingRequest_' + index.toString()}
          ItemSeparatorComponent={() => <View style={globalFontStyle.listContentSeparatorGlobal} />}
          refreshControl={
            <RefreshControl onRefresh={this.onRefresh} refreshing={this.state.isRefreshing} />
          }
        />
      </View>
    );
  }

  handleBack = () => {
    writeLog('Clicked on ' + 'handleBack' + ' of ' + 'VisitingScreen');
    this.props.resetVisitingHome();
    this.props.navigation.pop();
  }

  updateSearch = searchText => {
    this.setState(
      {
        query: searchText,
      },
      () => {
        const filteredData = this.state.localVisitingSearchData.filter(element => {
          let str1 = element.in_request_no.Value;
          let str2 = element.ch_empcode.Value.trim();
          let str3 = element.NAME.Value.trim();
          let searchedText = str1.concat(str2).concat(str3);
          let elementSearched = searchedText.toString().toLowerCase();
          let queryLowerCase = this.state.query.toString().toLowerCase();
          return elementSearched.indexOf(queryLowerCase) > -1;
        });
        this.setState({
          localVisitingData: filteredData,
        });
      }
    );
  }

  onOkClick = () => {
    writeLog('Clicked on ' + 'onOkClick' + ' of ' + 'Visiting Card Screen');
    this.props.resetVisitingHome();
    this.setState({errorPopUp:false,isError:''},()=>{
      helper.onOkAfterError(this);
    });
  }

  showError = () => {
    // console.log("In side show error of Visiting screen.")
    writeLog('Dialog is open with exception ' + this.props.visitingError + ' on ' + 'VisitingScreen');
    return (
      <UserMessage
        modalVisible={true}
        heading="Error"
        message={this.props.visitingError}
        okAction={() => {
            this.onOkClick();
        }}
      />
    );
  }

  openNewPanel = (docNumber) => {
    this._panel.show(height / 1.3);
    {this.props.fetchVisitingHistory(docNumber);}
  }

  renderCardItem=(data)=>{
    // console.log("final card Data::::",data)
    let keys = [];
    for (let key in data){
        keys.push(key);
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

  renderVisitingHistory = () => {
    return this.props.visitingHistory.map((data, index)=>{
      let myIndex = index + 1;
      return (
        <View key={index.toString()} style={globalFontStyle.panelContainer}>
         <View style={{flexDirection:'row',alignSelf:'center',borderColor:'light-grey',borderBottomWidth:0.25,width:'96%',paddingVertical:5,marginLeft:5,zIndex:10,borderBottomColor:'light-grey'}}>
          <Image source={images.rightCircleArrow}/>
          <Text style={{color:appConfig.BLUISH_COLOR,marginLeft:10}}>{globalConstants.HISTORY_RECORD_HEADING_TEXT + myIndex}</Text>
         </View>
          <View style={{marginVertical:10}}>
            {this.renderCardItem(data)}
          </View>
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
              <TouchableOpacity style={{marginTop:10}} onPress={() => this._panel.hide()}>
                <Image
                  source={images.crossButton}
                />
              </TouchableOpacity>
              </View>
              <ScrollView
              	keyboardShouldPersistTaps="handled"
              style={{flex:1, marginBottom: (height - height / 1.3)}}>
                <View style={{marginBottom: 10}}>
                  {this.renderVisitingHistory()}
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
       source={images.loginBackground}
       style={styles.container}>
        <View style={globalFontStyle.subHeaderViewGlobal}>
          <SubHeader
            pageTitle={globalConstants.VISITING_CARD_TITLE}
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
            raised={true}
            containerStyle={globalFontStyle.searchGlobal}
            autoCapitalize="none"
            autoCompleteType="off"
            autoCorrect={false}
          />
        </View>
          <View style={globalFontStyle.contentViewGlobal}>{this.showRequestsView()}</View>
          {this.renderHistory()}
        {/* </View> */}
        {/* {this.props.visitingError.length > 0 ? this.showError() : null} */}
        {this.state.errorPopUp === true ? this.showError() : null}
        <ActivityIndicatorView loader={this.props.visitingLoading} />
      </ImageBackground>
    );
  }
}

mapStateToProps = state => {
  return {
    empCode: state.loginReducer.loginData !== undefined ? state.loginReducer.loginData.SmCode : '',
    accessToken: state.loginReducer.loginData !== undefined ? state.loginReducer.loginData.Authkey : '',
    visitingData: state.visitingReducer.visitingData,
    visitingLoading: state.visitingReducer.visitingLoader,
    visitingError: state.visitingReducer.visitingError,
    visitingHistory: state.visitingReducer.visitingHistory,
  };
};

mapDispatchToProps = dispatch => {
  return {
    resetVisitingHome: () => dispatch(resetVisitingStore()),
    fetchVisitingData: (empCode, authToken, isPullToRefreshActive) =>
      dispatch(visitingFetchData(empCode, authToken, isPullToRefreshActive)),
    fetchVisitingHistory: (docNumber) => dispatch(visitingFetchHistory(docNumber)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(VisitingScreen);

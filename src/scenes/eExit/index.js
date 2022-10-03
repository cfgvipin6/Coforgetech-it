/*
Author: Mohit Garg(70024)
*/

import React, { Component } from 'react';
import { View, Text, FlatList, RefreshControl, ImageBackground, Alert, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import ActivityIndicatorView from '../../GlobalComponent/myActivityIndicator';
import { SearchBar, Card } from 'react-native-elements';
import { exitFetchData, resetExitHome, exitFetchHistory } from './exitAction';
import CustomButton from '../../components/customButton';
import SlidingUpPanel from 'rn-sliding-up-panel';
import { globalFontStyle } from '../../components/globalFontStyle';
import { styles } from './styles';
import SubHeader from '../../GlobalComponent/SubHeader';
import helper from '../../utilities/helper';
import { writeLog } from '../../utilities/logger';
import UserMessage from '../../components/userMessage';
import LinearGradient from 'react-native-linear-gradient';
import { moderateScale } from '../../components/fontScaling';
import BoxContainer from '../../components/boxContainer.js/index.js';
import Seperator from '../../components/Seperator.js';
let appConfig = require('../../../appconfig');
import images from '../../images';
let globalConstants = require('../../GlobalConstants');
let constants = require('./constants');
const {height} = Dimensions.get('window');

export class ExitScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isRefreshing: false,
      localExitData: [],
      localExitSearchData: [],
      query: '',
      errorMessage:'',
      showModal:false,
    };
    isPullToRefreshActive = false;
  }
  componentDidUpdate(){
    if (this.props.exitError && this.props.exitError.length > 0 && this.state.errorMessage === ''){
      setTimeout(()=>{
        this.setState({showModal:true,errorMessage:this.props.exitError});
      },1000);
    }
  }
  componentDidMount() {
    writeLog('Landed on ' + 'ExitScreen');
    this.props.fetchExitData(this.props.empCode, this.props.accessToken, isPullToRefreshActive);
  }

  static getDerivedStateFromProps(nextProps, state) {
    if (nextProps.exitData && nextProps.exitData.length > 0 && !state.query.length > 0) {
      return {
        localExitData: nextProps.exitData,
        localExitSearchData: nextProps.exitData,
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
        resolve(this.resetExitState());
      }, timeout);
    });
  }

  resetExitState = () => {
    writeLog('Invoked' + 'resetExitState' + ' of ' + 'ExitScreen');
    this.props.resetExitHomeStore();
    this.props.fetchExitData(this.props.empCode, this.props.accessToken, isPullToRefreshActive);
  }

  handleBack = () => {
    writeLog('Clicked on ' + 'handleBack' + ' of ' + 'ExitScreen');
    this.props.resetExitHomeStore();
    this.props.navigation.pop();
  }

  updateSearch = searchText => {
    // console.log("Text " ,searchText);
    this.setState(
      {
        query: searchText,
      },
      () => {
        const filteredData = this.state.localExitSearchData.filter(element => {
          let str1 = element.in_ecc_no;
          let str2 = element.EMPNO.trim();
          let str3 = element.NAME.trim();
          let searchedText = str2.concat(str3);
          let elementSearched = searchedText.toString().toLowerCase();
          let queryLowerCase = this.state.query.toString().toLowerCase();
          return elementSearched.indexOf(queryLowerCase) > -1;
        });
        this.setState({
          localExitData: filteredData,
        });
      }
    );
  }

  cdsDetails = item => {
    writeLog('Clicked on ' + 'cdsDetails' + ' of ' + 'ExitScreen');
    this.props.navigation.navigate('ExitDetails', { docDetails: item });
  }

  showExitRowGrid = (itemName, itemValue) => {
    if (itemValue != '' && itemValue != null && itemValue != undefined && itemValue != ' : ') {
      return (
        <View style={styles.rowStyle}>
          <Text style={[globalFontStyle.imageBackgroundLayout, styles.textTwo]}>{itemName}</Text>
          <Text style={[globalFontStyle.imageBackgroundLayout, styles.textTwo]}>{itemValue}</Text>
        </View>
      );
    } else {
      return null;
    }
  }

  renderExitRequest = (item, i) => {
    return (
      <BoxContainer>
          <View style={styles.view_One}>
            {this.showExitRowGrid(
              globalConstants.DOCUMENT_NUMBER_TEXT,
              item.in_ecc_no
            )}
            {this.showExitRowGrid(globalConstants.EMPLOYEE_TEXT, item.NAME)}
            {this.showExitRowGrid(
              globalConstants.EMAIL_TEXT,
              item.vc_mail.trim()
            )}
            {this.showExitRowGrid(
              globalConstants.MOBILE_TEXT,
              item.vc_mobile_no
            )}
            {this.showExitRowGrid(
              constants.DATE_OF_RESIGNATION_TEXT,
              item.dt_resignation
            )}
            {this.showExitRowGrid(
              constants.REQUIRED_LWD_TEXT,
              item.dt_requested_lwd
            )}
            {this.showExitRowGrid(
              constants.SCHEDULE_LWD_TEXT,
              item.dt_scheduled_lwd === '01-Jan-1900'
                ? '-'
                : item.dt_scheduled_lwd
            )}
          </View>
          <Seperator/>
          <View style={styles.historyViewStyle}>
            <TouchableOpacity
              onPress={() => this.openNewPanel(item.in_ecc_no)}
              style={{ alignItems: 'center' }}
            >
              <Image source={images.historyButton} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.cdsDetails(item)}
              style={{ alignItems: 'center' }}
            >
              <Image source={images.proceedButton} />
            </TouchableOpacity>
          </View>
     </BoxContainer>
    );
  }

  showRequestsView = () => {
    return (
      <View style={globalFontStyle.listContentViewGlobal}>
        <FlatList
          contentContainerStyle={globalFontStyle.listContentGlobal}
          data={this.state.localExitData}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => this.renderExitRequest(item, index)}
          keyExtractor={(item, index) => 'pendingRequest_' + index.toString()}
          ItemSeparatorComponent={() => <View style={globalFontStyle.listContentSeparatorGlobal} />}
          refreshControl={
            <RefreshControl onRefresh={this.onRefresh} refreshing={this.state.isRefreshing} />
          }
        />
      </View>
    );
  }

  onOkClick = () => {
    this.props.resetExitHomeStore();
    this.setState({showModal:false,errorMessage:''},()=>{
      this.props.navigation.pop();
    });
  }

  showError = () => {
    // console.log("In side show error of Exit screen.")
    writeLog('Dialog is open with exception ' + this.props.exitError + ' on ' + 'ExitScreen');
    return (
      <UserMessage
        modalVisible={true}
        heading="Error"
        message={this.props.exitError}
        okAction={() => {
            this.onOkClick();
        }}
      />
    );
  }

  openNewPanel = (docNumber) => {
    this._panel.show(height / 1.3);
    {this.props.fetchExitHistory(docNumber);}
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

  renderExitHistory = () => {
    return this.props.exitHistory.map((data, index)=>{
      let myIndex = index + 1;
      return (
        <View style={globalFontStyle.panelContainer}>
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
              <TouchableOpacity style={{marginTop:10,marginRight:10}} onPress={() => this._panel.hide()}>
                <Image
                  source={images.crossButton}
                />
              </TouchableOpacity>
              </View>
              <ScrollView
              	keyboardShouldPersistTaps="handled"
              style={{flex:1, marginBottom: (height - height / 1.3)}}>
                <View style={{marginBottom: 10}}>
                  {this.renderExitHistory()}
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
        <ActivityIndicatorView loader={this.props.exitLoading} />
        {/* <View style={styles.innerContainer}> */}
        <View style={globalFontStyle.subHeaderViewGlobal}>
          <SubHeader
            pageTitle={globalConstants.EXIT_TITLE}
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
        {this.state.showModal === true ? this.showError() : null}
      </View>
      </ImageBackground>
    );
  }
}

const mapStateToProps = state => {
  return {
    empCode: state.loginReducer.loginData !== undefined ? state.loginReducer.loginData.SmCode : '',
    accessToken: state.loginReducer.loginData !== undefined ? state.loginReducer.loginData.Authkey : '',
    exitData: state.exitReducer.exitData,
    exitError: state.exitReducer.exitError,
    exitLoading: state.exitReducer.exitLoader,
    exitHistory: state.exitReducer.exitHistory,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    resetExitHomeStore: () => dispatch(resetExitHome()),
    fetchExitData: (empCode, authToken, isPullToRefreshActive) =>
      dispatch(exitFetchData(empCode, authToken, isPullToRefreshActive)),
    fetchExitHistory: (docNumber) => dispatch(exitFetchHistory(docNumber)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ExitScreen);

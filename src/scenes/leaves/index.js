import React, { Component } from 'react';
import {
  Text,
  View,
  Alert,
  BackHandler,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  ImageBackground,
  LayoutAnimation,
} from 'react-native';
import { connect } from 'react-redux';
import { styles } from './styles';
import { Card, SearchBar } from 'react-native-elements';
import {
  leaveActionCreator,
  resetLeave,
  leaveFetchHistory,
  leaveActionCreator2,
  fetchLeaveHistory,
} from './leaveActionCreator';
import {
  APPROVE,
  REJECT,
  NO_LEAVES_FOUND,
  APPROVE_BTN,
  REJECT_BTN,
  REVERSAL_HISTORY_TEXT,
  LEAVE_HISTORY_TEXT,
} from './constants';
import SlidingUpPanel from 'rn-sliding-up-panel';
import ActivityIndicatorView from '../../GlobalComponent/myActivityIndicator';
import SubHeader from '../../GlobalComponent/SubHeader';
import helper from '../../utilities/helper';
import { globalFontStyle } from '../../components/globalFontStyle';
let globalConstants = require('../../GlobalConstants');
import { writeLog } from '../../utilities/logger';
import UserMessage from '../../components/userMessage';
import { FlatList } from 'react-native';
import Header from '../../GlobalComponent/Header';
const { height } = Dimensions.get('window');
import LinearGradient from 'react-native-linear-gradient';
import images from '../../images';
import BoxContainer from '../../components/boxContainer.js';
import Seperator from '../../components/Seperator';
let appConfig = require('../../../appconfig');
class LeaveScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      localLeaveData: [],
      localLeaveSearchList: [],
      isRefreshing: false,
      query: '',
      errorPopUp: false,
      isError: '',
      noLeaves: '',
      updatedHeight: 0,
      expand: false,
      active_index: -1,
      loading:false,
      leaveHistory:[],
      reversalHistory:[],
    };
  }
  successCallBack=(data)=>{
   console.log('On success call back', data);
   this.setState({
    localLeaveData: data,
    localLeaveSearchList: data,
    loading:false,
   });
  }

  errorCallBack=(data)=>{
    console.log('On Error call back');
    if (data[0]?.hasOwnProperty('Exception')){
      this.setState({loading:false});
      setTimeout(() => {
        this.setState({ errorPopUp: true, isError: data[0].Exception});
      }, 1000);
    }
  }
  onFocus = () => {
    writeLog('Landed on ' + 'LeaveScreen');
    this.setState({loading:true});
    leaveActionCreator2(this.props.loginData.SmCode,this.props.loginData.Authkey,this.successCallBack, this.errorCallBack);
  };

  componentDidMount() {
    this.props.navigation.addListener('willFocus', this.onFocus);
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick
    );
  }
  expand_collapse_Function = (i) => {
    LayoutAnimation.configureNext({
      duration: 300,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      update: { type: LayoutAnimation.Types.easeInEaseOut },
    });
    if (i == this.state.active_index) {
      this.setState(
        {
          active_index: -1,
        },
        () => {
          this.setState({
            updatedHeight: 0,
            expand: false,
          });
        }
      );
    } else {
      this.setState(
        {
          active_index: i,
        },
        () => {
          this.setState({
            updatedHeight: 150,
            expand: true,
          });
        }
      );
    }
  };
  componentWillUnmount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick
    );
    this.setState({
      localLeaveData: [],
      localLeaveSearchList: [],
      isRefreshing: false,
      query: '',
      errorPopUp: false,
      isError: '',
      noLeaves: '',
      updatedHeight: 0,
      expand: false,
      active_index: -1,
      loading:false,
      leaveHistory:[],
      reversalHistory:[],
    });
  }
  handleBackButtonClick = () => {
    this.handleBack();
    return true;
  };
  handleBack = () => {
    writeLog('Clicked on ' + 'handleBack' + ' of ' + 'LeaveScreen');
    this.props.navigation.navigate('DashBoard');
  };

  updateSearch = searchText => {
    writeLog('Invoked ' + 'updateSearch' + ' of ' + 'LeaveScreen');
    this.setState(
      {
        query: searchText,
      },
      () => {
        const filteredData = this.state.localLeaveSearchList.filter(element => {
          let str1 = element.vc_docno.Value;
          let str2 = element.vc_empname.Value.trim();
          let str3 = element.dt_startdate.Value.trim();
          let searchedText = str1.concat(str2).concat(str3);
          let elementSearched = searchedText.toString().toLowerCase();
          let queryLowerCase = this.state.query.toString().toLowerCase();
          return elementSearched.indexOf(queryLowerCase) > -1;
        });
        this.setState({
          localLeaveData: filteredData,
        });
      }
    );
  };

  onOkClick = () => {
    writeLog('Clicked on ' + 'onOkClick' + ' of ' + 'Leave Screen');
    this.setState({ errorPopUp: false, isError: '', noLeaves: '' }, () => {
      this.props.navigation.navigate('DashBoard');
    });
  };

  renderSubItem = (item,index) => {
    let vals = [];
    for (key in item) {
      vals.push(item[key]);
    }
    return (
      <FlatList
        data={vals}
        keyExtractor={(item, index) => index.toString()}
        renderItem={item => {
          let e = item.item;
          if (e.IsActive) {
            return (
              <View key={Math.random().toString()} style={styles.textContainer}>
                <Text style={globalFontStyle.cardLeftText}>{e.Key}</Text>
                <Text style={globalFontStyle.cardRightText}>{e.Value}</Text>
              </View>
            );
          }
           else {
            return null;
          }
        }}
      />
    );
  };
  onItemClick = (action, item) => {
    writeLog('Clicked on ' + 'onItemClick' + ' of ' + 'LeaveScreen');
    this.props.navigation.navigate('LeaveAction', {
      leaveItem: item,
      leaveAction: action,
    });
  };

  showLeaveData = () => {
    if (this.state.localLeaveData && this.state.localLeaveData.length > 0) {
      const { localLeaveData } = this.state;
      return (
        <FlatList
          data={localLeaveData}
          keyExtractor={(item, index) =>
                'pendingRequest_' + index.toString()
              }
          renderItem={({ item, index })=> {
            let element = item;
            return (
              <BoxContainer style={{margin:10}}>
                {this.renderSubItem(element,index)}
                <Seperator/>
                <View
            style={styles.bottomButtonContainer}
          >
                <TouchableOpacity
              onPress={() => this.openNewPanel(element.vc_docno.Value)}
              style={{ alignItems: 'center' }}
            >
              <Image source={images.historyButton} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => this.onItemClick(APPROVE, element)}
              style={{ alignItems: 'center' }}
            >
              <Image source={images.approveButton} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => this.onItemClick(REJECT, element)}
              style={{ alignItems: 'center' }}
            >
              <Image source={images.rejectButton} />
            </TouchableOpacity>
           </View>
           </BoxContainer>
            );
          }}
          keyExtractor={(item, index) => index.toString()}
        />
      );
    }
  };
  onHistoryData=(data)=>{
    if (data?.Leave?.length > 0 || data?.ReversalLeave?.length > 0){
      this.setState({leaveHistory: data?.Leave.length > 0 ? data.Leave : [], reversalHistory: data?.ReversalLeave?.length > 0 ? data.ReversalLeave : [] },()=>{
        setTimeout(() => {
          if (this._panel){
            this._panel.show(height / 1.3);
          }
        },500);
      });
    }
  }
  onHistoryException=(exception )=>{
    this.setState({isError:exception},()=>{
      this.setState({errorPopUp:true});
    });
  }

  openNewPanel = docNumber => {
    if (docNumber){
      fetchLeaveHistory(docNumber,this.onHistoryData, this.onHistoryException);
    }
  };

  renderCardItem = data => {
    // console.log("final card Data::::",data)
    let keys = [];
    for (let key in data) {
      keys.push(key);
    }
    return keys.map((key, index) => {
      if (data[key].IsActive) {
        return (
          <View key={index.toString()} style={globalFontStyle.cardDirection}>
            <Text style={globalFontStyle.cardLeftText}>{data[key].Key}</Text>
            <Text style={globalFontStyle.cardRightText}>
              {data[key].Value === '' ? '-' : data[key].Value}
            </Text>
          </View>
        );
      }
    });
  };

  renderLeaveHistory = () => {
    return this.state.leaveHistory.map((data, index) => {
      let myIndex = index + 1;
      return (
        <View key={index.toString()} style={globalFontStyle.panelContainer}>
         <View style={{flexDirection:'row',alignSelf:'center',borderColor:'light-grey',borderBottomWidth:0.25,width:'96%',paddingVertical:5,marginLeft:5,zIndex:10,borderBottomColor:'light-grey'}}>
          <Image source={images.rightCircleArrow}/>
          <Text style={{color:appConfig.BLUISH_COLOR,marginLeft:10}}>{LEAVE_HISTORY_TEXT + myIndex}</Text>
         </View>
          <View style={{marginVertical:10}}>
            {this.renderCardItem(data)}
          </View>
        </View>
      );
    });
  };

  renderLeaveReversalHistory = () => {
    return this.state.reversalHistory.map((data, index) => {
      let myIndex = index + 1;
      return (
        <View key={index.toString()} style={globalFontStyle.panelContainer}>
         <View style={{flexDirection:'row',alignSelf:'center',borderColor:'light-grey',borderBottomWidth:0.25,width:'96%',paddingVertical:5,marginLeft:5,zIndex:10,borderBottomColor:'light-grey'}}>
          <Image source={images.rightCircleArrow}/>
          <Text style={{color:appConfig.BLUISH_COLOR,marginLeft:10}}>{REVERSAL_HISTORY_TEXT + myIndex}</Text>
         </View>
          <View style={{marginVertical:10}}>
            {this.renderCardItem(data)}
          </View>
        </View>
      );
    });
  };

  renderHistory = () => {
    return (
      <SlidingUpPanel
        ref={c => (this._panel = c)}
        draggableRange={{ top: height / 1.3, bottom: 0 }}
        height={height}
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
              style={{ flex: 1, marginBottom: height - height / 1.3 }}
            >
              <View style={{ marginBottom: 10 }}>
                {this.renderLeaveHistory()}
                {this.renderLeaveReversalHistory()}
              </View>
            </ScrollView>
          </View>
        )}
      </SlidingUpPanel>
    );
  };
  shouldPopup = () => {
    if (this.state.isError.length > 0) {
      return this.showPopUp('Error', this.state.isError);
    } else if (this.state.noLeaves.length > 0) {
      return this.showPopUp('Sorry', this.state.noLeaves);
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
          this.onOkClick();
        }}
      />
    );
  };
  render() {
    const { query } = this.state;
    return (
      <View style={styles.container}>
        <Header backVisible={true} handleBackPress={() => this.handleBack()} props={this.props} />
        <SearchBar
          lightTheme
          placeholder={'Search by document number'}
          onChangeText={this.updateSearch}
          value={query}
          raised={true}
          containerStyle={styles.searchBar}
          autoCapitalize="none"
            autoCompleteType="off"
            autoCorrect={false}
        />
        <ActivityIndicatorView loader={this.state.loading} />
        {this.showLeaveData()}
        { this.state.leaveHistory.length > 0 && this.renderHistory()}
        {this.state.errorPopUp === true ? this.shouldPopup() : null}
      </View>
    );
  }
}


mapStateToProps = state => {
  // console.log('leave reducer data is : ' ,state.leaveReducer.leaveData);
  return {
    loginData: state && state.loginReducer && state.loginReducer.loginData,
    leaveLoading: state.leaveReducer.leaveLoading,
    leaveData: state.leaveReducer.leaveData,
    leaveError: state.leaveReducer.leaveError,
    noLeaves: state.leaveReducer.blankData,
    leaveHistory: state.leaveReducer.leaveHistory,
    leaveReversalHistory: state.leaveReducer.leaveReversalHistory,
  };
};

export default connect(
  mapStateToProps,
  null
)(LeaveScreen);

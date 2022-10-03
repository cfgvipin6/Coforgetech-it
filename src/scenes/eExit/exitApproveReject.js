import React, { Component } from 'react';
import { View, Text, ImageBackground, Image, TextInput, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import ModalDropdown from 'react-native-modal-dropdown';
import { Icon, SearchBar } from 'react-native-elements';
import { fetchSupervisorData, exitActionTaken, resetSupervisor } from './exitAction';
import SubHeader from '../../GlobalComponent/SubHeader';
import { styles } from './styles';
import { globalFontStyle } from '../../components/globalFontStyle';
import helper from '../../utilities/helper';
import UserMessage from '../../components/userMessage';
let globalConstants = require('../../GlobalConstants');
let constants = require('./constants');
import { writeLog } from '../../utilities/logger';
import ActivityIndicatorView from '../../GlobalComponent/myActivityIndicator';
import { WHITE_COLOR } from '../../../appconfig';
import LinearGradient from 'react-native-linear-gradient';
import images from '../../images';
import { Dropdown } from '../../GlobalComponent/DropDown/DropDown';

export class ExitApproveReject extends Component {
  constructor(props) {
    super(props),
    (previousScreenData = this.props.navigation.state.params.documentDetailData),
    (this.state = {
      localSuperVisorData: [],
      localSuperVisorSearchList: [],
      submitTo: 'Select',
      superVisorEmpName: '',
      superVisorEmpId: '',
      query: '',
      showModal: false,
      messageType: null,
      resultModalVisible:false,
      searchText:'',
      previousScreenData : this.props.navigation.state.params.documentDetailData,
    });
  }

  componentWillUnmount() {
    this.props.resetSupervisor();
  }

 supervisorCallBack=(data)=>{
   console.log('Data in supervisor call back : ',data);
   this.setState({
    localSuperVisorData: data,
    localSuperVisorSearchList: data,
   });
 }
 componentDidMount(){
  writeLog('Landed on ' + 'ExitApproveReject');
 }
 componentDidUpdate(prevState,prevProps){
  console.log('QueryLength : ',prevProps.query.length);
  console.log('QueryLength current : ',this.state.query.length);
  if (prevProps.query != this.state.query){
    if (this.state.query.length > 2){
      this.props.fetchSuperVisorData(this.supervisorCallBack,this.state.query);
    }
  }
  if (this.state.query.length < 1 && this.state.localSuperVisorData.length != 0){
    this.setState({
      localSuperVisorData:[],
      localSuperVisorSearchList:[],
    });
  }
   if (this.state.resultModalVisible !== true && this.props.exitActionResponse === 'SUCCESS'){
     setTimeout(()=>{
       this.setState({resultModalVisible: true ,showModal:true,messageType:0});
     },1000);
   } else if (this.state.resultModalVisible !== true && this.props.exitActionError.length > 0){
    setTimeout(()=>{
      this.setState({resultModalVisible: true ,showModal:true,messageType:1});
    },1000);
   }
 }
  handleBack = () => {
    // this.props.resetCdsDetails();
    writeLog('Clicked on ' + 'handleBack' + ' of ' + 'ExitApproveReject');
    this.props.navigation.pop();
  };

  showExitRowGrid = (itemName, itemValue) => {
    if (itemValue != '' && itemValue != null && itemValue != undefined && itemValue != ' : ') {
      return (
        <View style={styles.rowStyle}>
          <Text style={[globalFontStyle.imageBackgroundLayout, styles.textOne]}>
            {itemName}
          </Text>
          <Text style={[globalFontStyle.imageBackgroundLayout, styles.textTwo]}>
            {itemValue}
          </Text>
        </View>
      );
    } else {
      return null;
    }
  };

  showExitUserDetails = () => {
    let item = this.props.exitData[0];
    // console.log("my item:::::::",item)
    if (this.state.submitTo === 'Supervisor' && this.state.superVisorEmpName === '') {
      return null;
    } else {
    return (
      <View>
        <ImageBackground style={styles.cardBackground} resizeMode="cover">
          <View style={styles.view_One}>
          {this.showExitRowGrid(
              globalConstants.DOCUMENT_NUMBER_TEXT,
              item?.in_ecc_no
            )}
            {this.showExitRowGrid(
              globalConstants.EMPLOYEE_TEXT,
              item?.NAME
            )}
            {this.showExitRowGrid(
              globalConstants.EMAIL_TEXT,
              item?.vc_mail.trim()
            )}
            {this.showExitRowGrid(
              globalConstants.MOBILE_TEXT,
              item?.vc_mobile_no
            )}
            {this.showExitRowGrid(
              constants.DATE_OF_RESIGNATION_TEXT,
              item?.dt_resignation
            )}
            {this.showExitRowGrid(
              constants.REQUIRED_LWD_TEXT,
              item?.dt_requested_lwd
            )}
            {this.showExitRowGrid(
              constants.SCHEDULE_LWD_TEXT,
              (item?.dt_scheduled_lwd === '01-Jan-1900' ? '-' : item?.dt_scheduled_lwd)
            )}
          </View>
        </ImageBackground>
      </View>
    );
  }
  };

  onApproverSelection = approver => {
    if (approver === 'Supervisor') {
      // this.props.fetchSuperVisorData(this.supervisorCallBack);
    } else {
      this.props.resetSupervisor();
    }
  };

  onSelection = (index, value) => {
    writeLog('Invoked ' + 'onSelection' + ' of ' + 'ExitApproveReject' + ' for ' + value);
    this.setState({
        submitTo: value,
        superVisorEmpName: '',
      },() => {
        this.onApproverSelection(value);
    });
  };

  showPicker = () => {
    let selectors = [];
    if (this.props?.exitData[0]?.CheckRoleType === 'Y') {
      selectors = ['Supervisor', 'LHR'];
    } else {
      selectors = ['Supervisor'];
    }
    return (
      <View style={styles.dropDownContainer}>
        <Text>{constants.SUBMIT_TO_TEXT}</Text>
            <Dropdown
      title={''}
      forwardedRef={this.submitRef}
      dropDownData={selectors}
      dropDownCallBack={(index, value) => this.onSelection(index, value)}
    />
      </View>
    );
  };

  updateSearch = searchText => {
    this.setState({
        query: searchText,
    }, () => {
        const filteredData = this.state.localSuperVisorSearchList.filter(
          element => {
            let elementSearched =  element?.EmpCode?.toLowerCase();
            let queryLowerCase = this.state.query.toLowerCase();
            return elementSearched.indexOf(queryLowerCase) > -1;
          }
        );
        this.setState({
          localSuperVisorData: filteredData,
        });
      }
    );
  };

  renderSearch = () => {
    if (this.state.submitTo === 'Supervisor' && this.state.superVisorEmpName === '') {
      const { query } = this.state;
      return (
        <SearchBar
          lightTheme
          placeholder={'Enter Emp Code or Name to search'}
          onChangeText={this.updateSearch}
          value={query}
          raised={true}
          containerStyle={styles.searchBar}
          autoCapitalize="none"
            autoCompleteType="off"
            autoCorrect={false}
        />
      );
    }
    else {return null;}
  };

  onSupervisorSelection = supervisor => {
    this.props.resetSupervisor();
    this.setState({
      superVisorEmpName: supervisor.EmpName.split(':')[1],
      superVisorEmpId: supervisor.EmpCode,
      query: '',
    });
  };

  renderSuperVisors = (item, index) => {
    return (
      <TouchableOpacity
        onPress={() => this.onSupervisorSelection(item)}
        style={styles.listItem} //use this supervisor UI
      >
        <Text>{item.EmpName}</Text>
        <View style={styles.supervisorSeparator} />
      </TouchableOpacity>
    );
  };

  showRequests = () => {
    if (this.state.localSuperVisorData.length > 0) {
      let data = this.state.localSuperVisorData.sort((a, b) => a.EmployeeId - b.EmployeeId);
      return (
        <FlatList
        shouldItemUpdate={(props,nextProps)=>
       {
         return props.item !== nextProps.item;

}  }
          data={data}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => this.renderSuperVisors(item, index)}
          keyExtractor={(item, index) =>
            'supervisorRequest_' + index.toString()
          }
        />
      );
    }
    else {return null;}
  }
  submitRequest = () => {
    console.log('Exit data : ', this.props.exitData[0]);
    console.log('Previous screen data : ', previousScreenData);
    writeLog('Invoked ' + 'submitRequest' + ' of ' + 'ExitApproveReject' + ' for ' + this.state.submitTo);
    if (this.state.submitTo === 'LHR') {
      this.props.completeRequest(
        this.props.exitData[0],
        3,
        '',
        3,
        2,
        previousScreenData
      );
    } else {
      this.props.completeRequest(
        this.props.exitData[0],
        2,
        this.state.superVisorEmpId,
        2,
        1,
        previousScreenData
      );
    }
  }

  displaySupervisorName=()=>{
    if (this.state.submitTo != 'Select' && (this.state.submitTo === 'LHR' ||
        (this.state.submitTo === 'Supervisor' && this.state.superVisorEmpName !== ''))){
        return (
          <View>
            {this.state.submitTo === 'LHR' ? null : <View style={styles.viewSupervisor}>
              <Text style={styles.textSupervisor}>
                {this.state.superVisorEmpName}
              </Text>
            </View>}
            <TouchableOpacity style={styles.submitButton} onPress={()=>this.submitRequest()}>
              <Text style={styles.btnSupervisorText}>
                {constants.SUBMIT_TEXT}
              </Text>
            </TouchableOpacity>
          </View>
        );
    }
  }

  backNavigate() {
    writeLog('Clicked on ' + 'backNavigate' + ' of ' + 'ExitApproveReject');
    this.props.navigation.navigate('DashBoard');
  }

  showDialogBox = () => {
    let message = '';
    let heading = '';
    if (this.state.showModal) {
      if (this.state.messageType === 0) {
        message = 'Your request has been Submitted';
        heading = 'Successful';
        writeLog('In side Successful alert of exit action taken');
        return (
          <UserMessage
            heading={heading}
            message={message}
            okAction={() => {
              this.setState({ showModal: false },()=>{
                this.backNavigate();
              });
            }}
          />
        );
      } else {
        writeLog('In side show Error of Exit Action taken screen ',this.props.exitActionError);
        return (<UserMessage
          heading="Error"
          message={this.props.exitActionError}
          okAction={() => {
            this.setState({ showModal: false },()=>{
              this.backNavigate();
            });
          }}
        />
      );
      }
    }
  }

  render() {
    return (
      <ImageBackground
      style={{flex:1}}
      source={images.loginBackground}
    >
      <View style={styles.container}>
        <SubHeader
          pageTitle={globalConstants.EXIT_ACTION_TITLE}
          backVisible={true}
          logoutVisible={true}
          handleBackPress={() => this.handleBack()}
          navigation={this.props.navigation}
        />
         <ActivityIndicatorView loader={this.props.exitLoader} />
        {this.showExitUserDetails()}
        {this.showPicker()}
        {this.renderSearch()}
        <ScrollView
        	keyboardShouldPersistTaps="handled"
          style={styles.scrollViewStyle}
          showsVerticalScrollIndicator={false}>
          {this.showRequests()}
          {this.displaySupervisorName()}
        </ScrollView>
        {this.state.showModal ? this.showDialogBox() : null}
      </View>
      </ImageBackground>
    );
  }
}

const mapStateToProps = state => {
  return {
    exitData: state.exitReducer.exitData,
    exitSupervisorData: state.exitReducer.exitSupervisorData,
    exitActionResponse: state.exitReducer.exitActionResponse,
    exitActionError : state.exitReducer.exitActionError,
    exitLoader: state.exitReducer.exitLoader,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    resetSupervisor: () => dispatch(resetSupervisor()),
    fetchSuperVisorData: (supervisorCallBack,query) => dispatch(fetchSupervisorData(supervisorCallBack,query)),
    completeRequest: (docData, pendingRole, pendingWith, toRole, submitTo, previousScreenData) => dispatch(exitActionTaken(docData, pendingRole, pendingWith, toRole, submitTo ,previousScreenData)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ExitApproveReject);

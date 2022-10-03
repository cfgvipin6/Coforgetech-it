import React, { Component } from 'react';
import {
  View,
  Text,
  BackHandler,
  FlatList,
  Image,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import SubHeader from '../../GlobalComponent/SubHeader';
import { styles } from './styles';
import CustomButton from '../../components/customButton';
import ActivityIndicatorView from '../../GlobalComponent/myActivityIndicator';
import { eesFetchData, eesSaveAndSubmit, resetEESHome } from './eesAction';
import { connect } from 'react-redux';
import { optionIndexToValue, optionValueToIndex } from './utils';
import helper from '../../utilities/helper';
import _ from 'lodash';
import UserMessage from '../../components/userMessage';
import images from '../../images';
let globalConstants = require('../../GlobalConstants');
let constants = require('./constants');
let appConfig = require('../../../appconfig');

export class EESQuestionScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questionArray: [],
      selectedOptionArray: [], // 1 to 5 like rank i.e 1 = strongly disagree ..... 5= strongly agree
      questionIndex: 0,   // 0 to no. of question i.e 0= first ques, 1= second ques .... 29= 30th ques(last ques)
      optionIndex: '',   // 0 to 4 i.e 0= strongly agree .... 4= strongly disagree
      isAllRecordFilled: true,
      isSubmitRecord: false,
      showModal:false,
      popUpMessage:'',
      currentSelectedIndex: '',
    };
    selectedOptionArr = [];
    jsonRecord = [];
  }

  static getDerivedStateFromProps = (props, state) => {
    return {
      questionArray: props.eesData,
    };
  }

  componentDidUpdate(){
    if (this.props.eesError && this.props.eesError.length > 0 && this.state.popUpMessage === ''){
      setTimeout(()=>{
        this.setState({questionArray:this.props.eesError,showModal:true,popUpMessage:this.props.eesError});
      }, 200);
    }
    else  if (this.props.eesSaveError && this.props.eesSaveError.length > 0 && this.state.popUpMessage === ''){
      setTimeout(()=>{
        this.setState({questionArray:this.props.eesSaveError,showModal:true,popUpMessage:this.props.eesSaveError});
      }, 200);
    }
  }

  componentDidMount() {
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick
    );
    this.props.fetchEESData(this.props.empCode, this.props.accessToken).then(() => {
      if (!_.isEmpty(this.state.questionArray) && !_.isEmpty(this.state.questionArray[this.state.questionIndex])) {
        let myIndex = optionValueToIndex(this.state.questionArray[this.state.questionIndex].in_answer);
        selectedOptionArr = this.state.questionArray.map(item => item.in_answer);
        this.setState({
          optionIndex: myIndex,
          selectedOptionArray: selectedOptionArr,
        });
      }
    });
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick
    );
    this.setState({
      isSubmitRecord: false,
    });
  }

  handleBackButtonClick = () => {
    this.handleBack(constants.BACK_ONE);
    return true;
  };

  handleBack = (type) => {
    this.props.resetEESHome();
    this.setState({isSubmitRecord:false,showModal:false},()=>{
      if (type === constants.BACK_TWO) {
        this.props.navigation.navigate('DashBoardNew2');
      } else if (type === constants.BACK_ONE) {
        this.props.navigation.pop();
      }
    });
  };

  optionClick(item, i) {
    let myOptionValue = optionIndexToValue(i);
    selectedOptionArr[this.state.questionIndex] = item.value;
    this.setState({
      selectedOptionArray: selectedOptionArr,
      optionIndex: i,
      currentSelectedIndex: myOptionValue,
    });
  }

  renderOptionView = (item, i) => {
    let myIndex = optionValueToIndex(this.state.currentSelectedIndex);
    return (
      <TouchableOpacity onPress={() => this.optionClick(item, i)}>
        <View
          style={[
            styles.item,
            {
            backgroundColor: (i === this.state.optionIndex) ?
            appConfig.DARK_BLUISH_COLOR : appConfig.LOGIN_FIELDS_BACKGROUND_COLOR },
          ]}
        >
          <Text> {item.title} </Text>
          {i === 0 || i === 4 ? (
            <View style={styles.buttonsContainer}>
              <Image source={item.image} />
              <Image source={item.image} />
            </View>
          ) : (
            <Image source={item.image} />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  changeQuestion = (buttonType) => {
    if (buttonType === constants.NEXT_TEXT || buttonType === constants.SUBMIT_TEXT) {
      if (this.state.selectedOptionArray[this.state.questionIndex] == 0) {
        return alert(constants.SELECT_QUESTION_MSG);
      } else {
      let in_surveyNo = this.state.questionArray[this.state.questionIndex].in_surveyNo;
      let in_questionNo = this.state.questionArray[this.state.questionIndex].in_questionNo;
      let in_answerNo = this.state.selectedOptionArray[this.state.questionIndex];
      jsonRecord[this.state.questionIndex] = {
        in_questionNo: in_questionNo,
        in_answer: in_answerNo,
        in_surveyNo: in_surveyNo,
      };
      if (this.state.isAllRecordFilled) {
        for (i = this.state.questionIndex + 1; i < this.state.questionArray.length; i++){
          jsonRecord.push({
            in_questionNo: this.state.questionArray[i].in_questionNo,
            in_answer: this.state.selectedOptionArray[i],
            in_surveyNo: in_surveyNo,
          });
          this.setState({
            isAllRecordFilled: false,
          });
        }
      }
      this.props.saveAndSubmitEES((buttonType != constants.SUBMIT_TEXT ) ? globalConstants.SAVE_TEXT : globalConstants.SUBMIT_TEXT, jsonRecord);
      if (buttonType === constants.SUBMIT_TEXT) {
        console.log('submit button clicked');
        this.setState({isSubmitRecord : true});
      }
        this.setState({
          questionIndex: this.state.questionIndex + 1,
        }, () => {
          let myIndex = this.state.selectedOptionArray[this.state.questionIndex] != 0 ?
           optionValueToIndex(this.state.selectedOptionArray[this.state.questionIndex]) : '';
            this.setState({
              optionIndex: myIndex,
            });
        });
    }
    } else if (buttonType === constants.PREVIOUS_TEXT) {
      if (this.state.questionIndex != 0) {
        this.setState({
          questionIndex: this.state.questionIndex - 1,
        }, () => {
          jsonRecord.map((val, index) => {
            if (this.state.questionIndex === index) {
              let myOptIndex = optionValueToIndex(val.in_answer);
              this.setState({
                optionIndex: myOptIndex,
              });
            }
          });
        });
      } else if (this.state.questionIndex === 0) {
      }
    }
  };

  bottomView = () => {
    let myIndex = this.state.questionIndex + 1;
    if (this.state.questionArray && this.state.questionArray.length == 1 &&
      this.state.questionArray[0].vc_questionDesc && this.state.questionArray[0].vc_questionDesc.includes('has been closed')) {
        return null;
    } else {
    return (
      <View style={styles.innerView}>
        <View style={styles.cardBackground}>
          <FlatList
            data={constants.optionsArray}
            keyExtractor={(item, index) => 'Option_' + index.toString()}
            renderItem={({ item, index }) => this.renderOptionView(item, index)}
            ItemSeparatorComponent={() => <View style={styles.cardSeparator} />}
          />
          <View style={styles.buttonsContainer}>
            <View style={[styles.button, {opacity: this.state.questionIndex === 0 ? 0.6 : 1 }]}>
              <CustomButton
                label={constants.PREVIOUS_TEXT}
                positive={true}
                performAction={() =>
                  this.changeQuestion(constants.PREVIOUS_TEXT)
                }
              />
            </View>
            <View style={styles.button}>
              <CustomButton
                label={(myIndex === this.state.questionArray.length) ? constants.SUBMIT_TEXT : constants.NEXT_TEXT}
                positive={true}
                performAction={() =>
                  this.changeQuestion((myIndex === this.state.questionArray.length) ? constants.SUBMIT_TEXT : constants.NEXT_TEXT)
                }
              />
            </View>
          </View>
        </View>
      </View>
    );
    }
  };

  questionView = () => {
    let myIndex = this.state.questionIndex + 1;
    if (this.state.questionArray && this.state.questionArray.length > 0) {
      if (this.state.isSubmitRecord && !this.props.eesLoading) {
        return (
          <UserMessage
            modalVisible={true}
            heading={globalConstants.ATTENTION_HEADING_TEXT}
            message={constants.SURVEY_SUBMIT_MSG}
            okAction={() => {
              this.handleBack(constants.BACK_TWO);
            }}
          />
        );
      } else if (this.state.questionArray[this.state.questionIndex] && this.state.questionArray[this.state.questionIndex].vc_questionDesc && this.state.questionArray[this.state.questionIndex].vc_questionDesc === 'Done') {
        return (
          <UserMessage
            modalVisible={true}
            heading={globalConstants.ATTENTION_HEADING_TEXT}
            message={constants.DONE_FEEDBACK_MSG}
            okAction={() => {
              this.handleBack(constants.BACK_TWO);
            }}
          />
        );
      } else if (this.state.questionArray[this.state.questionIndex] && this.state.questionArray[this.state.questionIndex].vc_questionDesc && this.state.questionArray[this.state.questionIndex].vc_questionDesc === 'Invalid User') {
        return (
          <UserMessage
            modalVisible={true}
            heading={globalConstants.ATTENTION_HEADING_TEXT}
            message={constants.INVALID_USER_MSG}
            okAction={() => {
              this.handleBack(constants.BACK_TWO);
            }}
          />
        );
      } else if (this.state.questionArray[this.state.questionIndex] && this.state.questionArray[this.state.questionIndex].vc_questionDesc){
        return (
          <View style={styles.cardBackground}>
            <Text style={styles.hyperlinkText}>
              {'Question: ' + myIndex + '/' + this.state.questionArray.length}
            </Text>
            <Text style={styles.questionText}>
              {this.state.questionArray[this.state.questionIndex].vc_questionDesc.trim()}
            </Text>
          </View>
        );
      } else {
        return null;
      }
    } else {return null;}
  };

  upperView = () => {
    return (
      <View style={styles.innerView}>
        {this.questionView()}
      </View>
    );
  };

  onOkClick = () => {
    this.props.resetEESHome();
    this.setState({showModal:false,popUpMessage:''},()=>{
      this.props.navigation.navigate('DashBoardNew2');
    });
  }

  showError = (error) => {
    // console.log("In side show error of EES screen.")
    return (
      <UserMessage
        modalVisible={true}
        heading="Error"
        message={error}
        okAction={() => {
            this.onOkClick();
        }}
      />
    );
  }

  render() {
    return (
      <ImageBackground
      style={{flex:1}}
      source={images.loginBackground}
    >
      <View style={styles.container}>
        <ActivityIndicatorView loader={this.props.eesLoading} />
        <SubHeader
          pageTitle={globalConstants.EES_QUESTION_TITLE}
          backVisible={true}
          logoutVisible={true}
          handleBackPress={() => this.handleBack(constants.BACK_ONE)}
          navigation={this.props.navigation}
        />
        {this.upperView()}
        {this.bottomView()}
        {this.state.showModal === true ? this.showError(this.props.eesError) : null}
        {this.state.showModal === true ? this.showError(this.props.eesSaveError) : null}
      </View>
      </ImageBackground>
    );
  }
}

const mapStateToProps = state => {
  return {
    empCode: state.loginReducer.loginData !== undefined ? state.loginReducer.loginData.SmCode : '',
    accessToken: state.loginReducer.loginData !== undefined ? state.loginReducer.loginData.Authkey : '',
    eesData: state.eesReducer.eesData,
    eesLoading: state.eesReducer.eesLoader,
    eesError: state.eesReducer.eesError,
    eesSaveError: state.eesReducer.eesSaveError,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    resetEESHome: () => dispatch(resetEESHome()),
    fetchEESData: (empCode, authToken) => dispatch(eesFetchData(empCode, authToken)),
    saveAndSubmitEES: (type, record) => dispatch(eesSaveAndSubmit(type, record)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EESQuestionScreen);

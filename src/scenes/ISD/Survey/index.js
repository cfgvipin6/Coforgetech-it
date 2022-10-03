import {
  BackHandler,
  FlatList,
  Image,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { PureComponent } from 'react';
import images from '../../../images';
import { globalFontStyle } from '../../../components/globalFontStyle';
import SubHeader from '../../../GlobalComponent/SubHeader';
import { styles } from './styles';
import {
  getHRSurveyQuestions,
  getSurveyQuestions,
  submitSuveryQuestions,
} from './surveyRequests';
import { connect } from 'react-redux';
import UserMessage from '../../../components/userMessage';
import {
  BACK_ONE,
  BACK_TWO,
  DONE_FEEDBACK_MSG,
  INVALID_USER_MSG,
  NEXT_TEXT,
  PREVIOUS_TEXT,
  SUBMIT_TEXT,
  SURVEY_SUBMIT_MSG,
} from './constants';
import CustomButton from '../../../components/customButton';
import { getIcon, optionIndexToValue, optionValueToIndex } from './utils';
import ActivityIndicatorView from './../../../GlobalComponent/myActivityIndicator';
import { AirbnbRating } from 'react-native-ratings';
import { submitHrSurvey } from '../../hrassist/utils';
let globalConstants = require('../../../GlobalConstants');
let constants = require('./constants');
let appConfig = require('../../../../appconfig');
let selectedOptionArr = [];
let jsonRecord = [];
class SurveyITDesk extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      surveyItem: this.props.navigation.state.params.dataToUpdate,
      optionsArray: [],
      questionArray: [],
      questionIndex: 0,
      optionIndex: '',
      isAllRecordFilled: true,
      isSubmitRecord: false,
      showModal: false,
      popUpMessage: '',
      currentSelectedIndex: '',
      selectedOptionArray: [],
      loading: false,
      heading: '',
      isComingFrom: this.props.navigation.state.params?.isComingFrom,
      ratingCount:5,
    };
  }

  successCallBack = (response) => {
    this.setState({ loading: false });
    console.log('Questionare Data : ', response);
    if (response == 'Success' || response[0]?.message == 'Success') {
      this.setState({
        showModal: true,
        heading: 'Success',
        popUpMessage: 'You have submitted your survey successfully.',
      });
      return;
    }
    this.setState(
      {
        optionsArray: response?.Answer,
        questionArray: response?.Question,
      },
      () => {
        console.log('Question Array : ', this.state.questionArray),
          console.log('Option Array : ', this.state.optionsArray);
      }
    );
  };

  errorCallBack = (error) => {
    this.setState({ loading: false }, () => {
      this.setState({ showModal: true, heading: 'Error', popUpMessage: error });
    });
    console.log('Questionare error : ', error);
  };
  onOkClick = () => {
    this.setState({ showModal: false }, () => {
      this.props.navigation.navigate('DashBoardNew2');
    });
  };

  showError = (error) => {
    return (
      <UserMessage
        modalVisible={true}
        heading={this.state.heading}
        message={this.state.popUpMessage}
        okAction={() => {
          this.onOkClick();
        }}
      />
    );
  };
  componentDidMount() {
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick
    );
    console.log('Data to update : ', this.state.surveyItem);
    this.setState({ loading: true });
    if (this.state.isComingFrom == 'HR') {
      getHRSurveyQuestions(
        this.props.loginData.SmCode,
        this.props.loginData.Authkey,
        this.successCallBack,
        this.errorCallBack
      );
    } else {
      getSurveyQuestions(
        this.props.loginData.SmCode,
        this.props.loginData.Authkey,
        this.successCallBack,
        this.errorCallBack
      );
    }
  }
  questionView = () => {
    let myIndex = this.state.questionIndex + 1;
    if (this.state.questionArray?.length > 0) {
      if (this.state.isSubmitRecord) {
        return (
          <UserMessage
            modalVisible={true}
            heading={globalConstants.ATTENTION_HEADING_TEXT}
            message={SURVEY_SUBMIT_MSG}
            okAction={() => {
              this.handleBack(BACK_TWO);
            }}
          />
        );
      } else if (
        this.state.questionArray[this.state.questionIndex] &&
        this.state.questionArray[this.state.questionIndex].vc_questionDesc &&
        this.state.questionArray[this.state.questionIndex].vc_questionDesc ===
          'Done'
      ) {
        return (
          <UserMessage
            modalVisible={true}
            heading={globalConstants.ATTENTION_HEADING_TEXT}
            message={DONE_FEEDBACK_MSG}
            okAction={() => {
              this.handleBack(BACK_TWO);
            }}
          />
        );
      } else if (
        this.state.questionArray[this.state.questionIndex] &&
        this.state.questionArray[this.state.questionIndex].vc_questionDesc &&
        this.state.questionArray[this.state.questionIndex].vc_questionDesc ===
          'Invalid User'
      ) {
        return (
          <UserMessage
            modalVisible={true}
            heading={globalConstants.ATTENTION_HEADING_TEXT}
            message={INVALID_USER_MSG}
            okAction={() => {
              this.handleBack(BACK_TWO);
            }}
          />
        );
      } else if (
        this.state.questionArray[this.state.questionIndex] &&
        this.state.questionArray[this.state.questionIndex].QuestionDesc
      ) {
        return (
          <View style={styles.cardBackground}>
            <Text style={styles.hyperlinkText}>
              {'Question: ' + myIndex + '/' + this.state.questionArray.length}
            </Text>
            <Text style={styles.questionText}>
              {this.state.questionArray[
                this.state.questionIndex
              ].QuestionDesc.trim()}
            </Text>
          </View>
        );
      } else {
        return null;
      }
    } else {
      return null;
    }
  };
  upperView = () => {
    return <View style={styles.innerView}>{this.questionView()}</View>;
  };

  changeQuestion = (buttonType) => {
    console.log('Survey Item : ', this.state.surveyItem);
    console.log('Rating : ', this.state.ratingCount);
    if (
      buttonType === constants.NEXT_TEXT ||
      buttonType === constants.SUBMIT_TEXT
    ) {
      if (
        this.state.selectedOptionArray[this.state.questionIndex] == undefined && this.state.isComingFrom !== 'HR'
      ) {
        return alert(constants.SELECT_QUESTION_MSG);
      } else {
        let questId = this.state.questionArray[this.state.questionIndex].QuestionID;
        let in_answerNo = this.state.isComingFrom == 'HR' ?
         this.state.ratingCount :
         this.state.selectedOptionArray[
          this.state.questionIndex
        ];
        jsonRecord[this.state.questionIndex] = {
          QuestionID: questId,
          answerId: in_answerNo,
          RequestId: this.state.isComingFrom == 'HR' ? this.state.surveyItem.QueryId : this.state.surveyItem.RequestID,
        };

        if (this.state.isAllRecordFilled) {
          for (
            let i = this.state.questionIndex + 1;
            i < this.state.questionArray.length;
            i++
          ) {
            jsonRecord.push({
              QuestionID: questId,
              answerId: this.state.selectedOptionArray[i],
              RequestId: this.state.surveyItem.RequestID,
            });
            this.setState({
              isAllRecordFilled: false,
            });
          }
        }
        //   this.props.saveAndSubmitEES((buttonType != constants.SUBMIT_TEXT ) ? globalConstants.SAVE_TEXT : globalConstants.SUBMIT_TEXT, jsonRecord);
        if (buttonType === constants.SUBMIT_TEXT) {
          console.log('submit button clicked');
          console.log('submit data', jsonRecord);
          if (this.state.isComingFrom == 'HR'){
            submitHrSurvey(
              jsonRecord,
              this.successCallBack,
              this.errorCallBack,
            );
          } else {
            this.setState({ loading: true });
            submitSuveryQuestions(
              this.props.loginData.SmCode,
              this.props.loginData.Authkey,
              this.successCallBack,
              this.errorCallBack,
              { lstQuestionAnswers: jsonRecord }
            );
          }

        }
        this.setState(
          {
            questionIndex: this.state.questionIndex + 1,
          },
          () => {
            let myIndex =
              this.state.selectedOptionArray[this.state.questionIndex] != 0
                ? optionValueToIndex(
                    this.state.selectedOptionArray[this.state.questionIndex]
                  )
                : '';
            this.setState({
              optionIndex: myIndex,
            });
          }
        );
      }
    } else if (buttonType === constants.PREVIOUS_TEXT) {
      if (this.state.questionIndex != 0) {
        this.setState(
          {
            questionIndex: this.state.questionIndex - 1,
          },
          () => {
            jsonRecord.map((val, index) => {
              if (this.state.questionIndex === index) {
                let myOptIndex = optionValueToIndex(val.in_answer);
                this.setState({
                  optionIndex: myOptIndex,
                });
              }
            });
          }
        );
      } else if (this.state.questionIndex === 0) {
      }
    }
  };
  optionClick(item, i) {
    console.log('Option click : ', item);
    console.log(
      'this.state.selectedOptionArray : ',
      this.state.selectedOptionArray
    );
    selectedOptionArr[this.state.questionIndex] = item.Value;
    this.setState(
      {
        selectedOptionArray: selectedOptionArr,
        optionIndex: i,
        currentSelectedIndex: item.value,
      },
      () => {
        console.log('Question Index : ', this.state.questionIndex);
        this.renderOptionView(item, i);
        // this.state.selectedOptionArray.map((option)=>{
        //    this.renderOptionView(item,i);
        // });
      }
    );
  }
  renderOptionView = (item, i) => {
    return (
      <TouchableOpacity onPress={() => this.optionClick(item, i)}>
        <View
          style={[
            styles.item,
            {
              backgroundColor:
                item.Value ===
                this.state.selectedOptionArray[this.state.questionIndex]
                  ? appConfig.DARK_BLUISH_COLOR
                  : appConfig.LOGIN_FIELDS_BACKGROUND_COLOR,
            },
          ]}
        >
          <Text> {item.Display} </Text>
          {i === 0 || i === 4 ? (
            <View style={styles.buttonsContainer}>
              <Image source={getIcon(item)} />
              <Image source={getIcon(item)} />
              <Image source={getIcon(item)} />
            </View>
          ) : i == 1 ? (
            <View style={styles.buttonsContainer}>
              <Image source={getIcon(item)} />
              <Image source={getIcon(item)} />
            </View>
          ) : (
            <Image source={getIcon(item)} />
          )}
        </View>
      </TouchableOpacity>
    );
  };
  componentWillUnmount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick
    );
    this.setState({
      isSubmitRecord: false,
    });
  }

  ratingCompleted =(rating)=>{
    this.setState({ratingCount:rating});
    console.log('Rating is: ' + rating);
  }
  bottomView = () => {
    let myIndex = this.state.questionIndex + 1;
    return (
      <View style={styles.innerView}>
        <View style={styles.cardBackground}>
          {this.state.isComingFrom == 'HR' ? (
            <AirbnbRating
              type="star"
              count={5}
              size={50}
              defaultRating={5}
              showRating
              onFinishRating={this.ratingCompleted}
              starContainerStyle={{paddingVertical: 50}}
            />
          ) : (
            <FlatList
              data={this.state.optionsArray}
              keyExtractor={(item, index) => 'Option_' + index.toString()}
              renderItem={({ item, index }) =>
                this.renderOptionView(item, index)
              }
              ItemSeparatorComponent={() => (
                <View style={styles.cardSeparator} />
              )}
            />
          )}
          <View style={styles.buttonsContainer}>
            <View
              style={[
                styles.button,
                { opacity: this.state.questionIndex === 0 ? 0.6 : 1 },
              ]}
            >
              <CustomButton
                label={PREVIOUS_TEXT}
                positive={true}
                performAction={() => this.changeQuestion(PREVIOUS_TEXT)}
              />
            </View>
            <View style={styles.button}>
              <CustomButton
                label={
                  myIndex === this.state.questionArray?.length
                    ? SUBMIT_TEXT
                    : NEXT_TEXT
                }
                positive={true}
                performAction={() =>
                  this.changeQuestion(
                    myIndex === this.state.questionArray?.length
                      ? SUBMIT_TEXT
                      : NEXT_TEXT
                  )
                }
              />
            </View>
          </View>
        </View>
      </View>
    );
  };
  handleBack = (type) => {
    this.setState({ isSubmitRecord: false, showModal: false }, () => {
      if (type === BACK_TWO) {
        this.props.navigation.navigate('DashBoardNew2');
      } else {
        this.props.navigation.pop();
      }
    });
  };
  render() {
    return (
      <ImageBackground style={{ flex: 1 }} source={images.loginBackground}>
        <ActivityIndicatorView loader={this.state.loading} />
        <View style={styles.container}>
          <View style={globalFontStyle.subHeaderViewGlobal}>
            <SubHeader
              pageTitle={
                this.state.isComingFrom == 'HR'
                  ? globalConstants.HR_DESK_SURVEY
                  : globalConstants.IT_DESK_SURVEY
              }
              backVisible={true}
              logoutVisible={true}
              handleBackPress={() => this.handleBack()}
              navigation={this.props.navigation}
            />
          </View>
          {this.upperView()}
          {this.bottomView()}
          {this.state.showModal === true
            ? this.showError(this.state.surveyError)
            : null}
        </View>
      </ImageBackground>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loginData: state && state.loginReducer && state.loginReducer.loginData,
    myRequestData:
      state &&
      state.itDeskMyRequestReducer &&
      state.itDeskMyRequestReducer.myRequestData,
    myRequestLoading:
      state &&
      state.itDeskMyRequestReducer &&
      state.itDeskMyRequestReducer.myRequestLoading,
    myRequestError:
      state &&
      state.itDeskMyRequestReducer &&
      state.itDeskMyRequestReducer.myRequestError,
  };
};

export default connect(
  mapStateToProps,
  null
)(SurveyITDesk);

/* eslint-disable no-lone-blocks */
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  BackHandler,
} from "react-native";
import React, { Component } from "react";
import BoxContainer from "../../components/boxContainer.js";
import { styles } from "./styles";
let appConfig = require("../../../appconfig");
import { Dropdown } from "../../GlobalComponent/DropDown/DropDown";
import SubHeader from "../../GlobalComponent/SubHeader";
import { LabelEditText } from "../../GlobalComponent/LabelEditText/LabelEditText";
import images from "../../images";
import { AttachmentView, getISDFiles } from "../ISD/Attachment/AttachmentView";
let globalConstants = require("../../GlobalConstants");
import CustomButton from "../../components/customButton";
import { moderateScale } from "../../components/fontScaling.js";
import {
  CAT_REQUIRED,
  DESC_REQUIRED,
  getHrActivityDetail,
  getHRCategory,
  getHREmpDetails,
  getHrFiles,
  getHrSlaDetail,
  getHRSubCategory,
  getMyRequestDetail,
  MOB_REQUIRED,
  REMARK_REQUIRED,
  SUBJECT_REQUIRED,
  submitData,
  submitDataByHR,
  SUB_CAT_REQUIRED,
  uploadHrFiles,
} from "./utils.js";
import ActivityIndicatorView from "../../GlobalComponent/myActivityIndicator/index.js";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import _ from "lodash";
import { LabelTextDashValue } from "../../GlobalComponent/LabelText/LabelText.js";
import { HistoryView } from "../../GlobalComponent/HistoryView/HistoryView.js";
import UserMessage from "../../components/userMessage.js";
import { showToast } from "../../GlobalComponent/Toast.js";
class HRAssistCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      descriptionInput: "",
      questInput: "",
      mobileNumber: "",
      empData: {},
      slaData: {},
      category: [],
      subCategory: [],
      hrActivity: [],
      files: [],
      modalVisible: false,
      alertVisible: false,
      alertHeading: "",
      alertMessage: "",
      catID: "",
      subCatId: "",
      loading: false,
      isComingFromMyRequest: this.props.navigation.state.params
        ?.isComingFromMyRequest,
      previousScreenItem: this.props.navigation.state.params?.dataToUpdate,
      remark: "",
    };
    this.categoryRef = React.createRef();
    this.subCategoryRef = React.createRef();
    this._panel = React.createRef();
  }
  onHistoryClose = () => {
    this.setState({ modalVisible: false });
  };
  filesSuccessCallBack = (data) => {
    this.setState({ files: data[0]?.lstDt });
    console.log("Data in files success call back : ", data);
  };
  activitySuccessCallBack = (data) => {
    this.setState({ loading: false, hrActivity: data }, () => {
      let qID = this.state.empData?.QueryID;
      getHrFiles(qID, this.filesSuccessCallBack, this.errorCallBack);
    });
  };
  slaSuccessCallBack = (data) => {
    this.setState({ slaData: data[0] }, () => {
      this.setState({ loading: true });
      let encId = this.state.previousScreenItem?.encQueryID;
      getHrActivityDetail(
        encId,
        this.activitySuccessCallBack,
        this.errorCallBack
      );
    });
  };
  myTicketDetailSuccessCallBack = (data) => {
    console.log("HR myTicketDetailSuccessCallBack", data[0]?.reslstHRAssist[0]);
    this.setState(
      {
        empData: data[0]?.reslstHRAssist[0],
        mobileNumber: data[0]?.reslstHRAssist[0].Mobile,
        loading: false,
      },
      () => {
        let catIdx = this.state.category.findIndex(
          (item) => item.Value == this.state.empData.Category
        );
        let catItem = this.state.category[catIdx];
        if (this.categoryRef.current !== null) {
          this.categoryRef.current.select(catIdx);
          this.setState({ catID: catItem.Value }, () => {
            getHRSubCategory(
              this.state.catID,
              this.successSubCategoryCallBack,
              this.errorCallBack
            );
          });
        }
      }
    );
  };
  successCallBack = (data) => {
    this.setState({
      empData: data[0],
      mobileNumber: data[0].Mobile,
      loading: false,
    });
    console.log("HR data success call back", data);
  };
  successCategoryCallBack = (data) => {
    this.setState({ category: data, loading: false }, () => {
      if (this.state.isComingFromMyRequest) {
        this.setState({ loading: true });
        let encId = this.state.previousScreenItem?.encQueryID;
        getMyRequestDetail(
          encId,
          this.myTicketDetailSuccessCallBack,
          this.errorCallBack
        );
      } else {
        this.setState({ loading: true });
        getHREmpDetails(this.successCallBack, this.errorCallBack);
        BackHandler.addEventListener(
          "hardwareBackPress",
          this.handleBackButtonClick
        );
      }
    });
  };

  componentDidCatch() {
    this.setState({ loading: false });
  }

  successSubCategoryCallBack = (data) => {
    this.setState({ subCategory: data }, () => {
      setTimeout(() => {
        this.setState({ loading: false }, () => {
          if (this.state.isComingFromMyRequest) {
            let subCatIdx = this.state.subCategory.findIndex(
              (item) => item.Value == this.state.empData.Subcategoryid
            );
            let subCatItem = this.state.subCategory[subCatIdx];
            console.log("Sub Cat item : ", subCatItem);
            if (this.subCategoryRef.current !== null) {
              this.subCategoryRef.current.select(subCatIdx);
              this.setState({ subCatId: subCatItem?.Value });
            }
            this.setState({
              descriptionInput: this.state.empData.SubjectLine,
              questInput: this.state.empData.Question,
            });
            getHrSlaDetail(
              this.state.empData.QueryID,
              this.slaSuccessCallBack,
              this.errorCallBack
            );
          }
        });
      }, 500);
    });
    console.log("HR successSubCategoryCallBack", data);
  };

  errorCallBack = (error) => {
    console.log("Error in error call back", error);
    this.setState({ loading: false }, () => {
      this.setState(
        {
          loading: false,
          alertHeading: "Error",
          alertMessage:
            "There is an issue, hence the workflow/s could not be processed. Please try again.",
        },
        () =>
          setTimeout(() => {
            this.setState({ alertVisible: true });
          }, 1000)
      );
    });
  };

  componentDidMount() {
    getHRCategory(this.successCategoryCallBack, this.errorCallBack);
  }

  handleBackButtonClick = () => {
    this.handleBack();
    return true;
  };

  handleBack = () => {
    this.props.navigation.pop();
  };
  onMobileChanged = (text) => {
    this.setState({
      mobileNumber: text,
    });
    console.log(text + "mobile text written");
  };
  onMobileFocus = () => {
    console.log("mobile is focused");
  };
  onSubjectLineChanged = (text) => {
    this.setState({
      descriptionInput: text,
    });
  };

  onQuestionChanged = (text) => {
    this.setState({
      questInput: text,
    });
  };

  onCategorySelection = (i, value) => {
    this.setState({ catID: this.state.category[i]?.Value }, () => {
      if (this.subCategoryRef?.current !== null) {
        this.setState({ subCatId: "" });
        this.subCategoryRef.current.select(-1);
      }
      this.setState({ loading: true });
      getHRSubCategory(
        this.state.catID,
        this.successSubCategoryCallBack,
        this.errorCallBack
      );
    });
  };
  onSubCategorySelection = (i, value) => {
    this.setState({ subCatId: this.state.subCategory[i]?.Value });
  };
  onDescriptionFocus = () => {
    console.log("description is focused");
  };
  showHistory = () => {
    this.setState({ modalVisible: true });
  };
  fileUploadSuccess = (index, response) => {
    console.log("Index : ", index, response);
    let files = getISDFiles();
    if (index == files.length - 1 && response[0].OUTPUT == "success") {
      this.setState({ loading: false }, () => {
        this.setState(
          {
            loading: false,
            alertHeading: "Success",
            alertMessage: "Your query has been submitted.",
          },
          () =>
            setTimeout(() => {
              this.setState({ alertVisible: true });
            }, 1000)
        );
      });
    }
  };
  submitByHrSuccessCallBack = (data) => {
    if (data[0].OUTPUT?.includes("_HRASSIST")) {
      this.setState({ loading: false }, () => {
        this.setState(
          {
            loading: false,
            alertHeading: "Success",
            alertMessage: "Your ticket has been updated successfully.",
          },
          () =>
            setTimeout(() => {
              this.setState({ alertVisible: true });
            }, 1000)
        );
      });
    }
  };
  submitSuccessCallBack = (data) => {
    if (data[0].OUTPUT?.includes("_")) {
      {
        let files = getISDFiles();
        console.log("Files : ", files);
        if (files.length > 0) {
          files.map((item, index) => {
            let fileData = {
              uri: item.FileUri,
              name: item.FileName,
              filename: item.FileName,
              type: item.FileType,
            };
            uploadHrFiles(
              index,
              data[0].OUTPUT.split("_")[0],
              fileData,
              this.fileUploadSuccess,
              this.errorCallBack
            );
          });
        } else {
          this.setState({ loading: false }, () => {
            this.setState(
              {
                loading: false,
                alertHeading: "Success",
                alertMessage: "Your ticket has been raised successfully.",
              },
              () =>
                setTimeout(() => {
                  this.setState({ alertVisible: true });
                }, 1000)
            );
          });
        }
      }
    }
  };
  onSubmit = async (action) => {
    if (this.state.mobileNumber == "") {
      return alert(MOB_REQUIRED);
    } else if (this.state.catID == "") {
      return alert(CAT_REQUIRED);
    } else if (this.state.subCatId == "") {
      return alert(SUB_CAT_REQUIRED);
    } else if (this.state.descriptionInput == "") {
      return alert(SUBJECT_REQUIRED);
    } else if (this.state.questInput == "") {
      return alert(DESC_REQUIRED);
    }
    // else if (getISDFiles().length < 1){
    //   return alert();
    // }
    else if (this.state.isComingFromMyRequest) {
      if (this.state.remark.length < 1) {
        return alert(REMARK_REQUIRED);
      } else {
        let data = {};
        data.QueryID = this.state.empData.QueryID;
        data.Response = this.state.remark;
        data.SMAction = action == "Close" ? 2 : 1;
        data.type = 1;
        this.setState({ loading: true });
        submitDataByHR(
          data,
          this.submitByHrSuccessCallBack,
          this.errorCallBack
        );
      }
    } else {
      let data = {};
      data.CategoryId = this.state.catID;
      data.SubCategoryId = this.state.subCatId;
      data.SubjectLine = this.state.descriptionInput;
      data.Description = this.state.questInput;
      data.Mobile = this.state.mobileNumber;
      data.SMAction = 1;
      this.setState({ loading: true });
      submitData(data, this.submitSuccessCallBack, this.errorCallBack);
    }
  };
  processSurvey = (item) => {
    console.log("Survery item", item);
    this.props.navigation.navigate("SurveyITDesk", {
      dataToUpdate: item,
      isComingFrom: "HR",
    });
  };
  onRemarks = (remarks) => {
    this.setState({ remark: remarks });
  };
  render() {
    return (
      <ImageBackground style={{ flex: 1 }} source={images.loginBackground}>
        <ActivityIndicatorView loader={this.state.loading} />
        <SubHeader
          pageTitle={
            this.state.isComingFromMyRequest
              ? globalConstants.MY_REQUEST_HR_ASSIST
              : globalConstants.CREATE_REQUEST_HR_ASSIST
          }
          backVisible={true}
          logoutVisible={true}
          handleBackPress={() => this.handleBack()}
          navigation={this.props.navigation}
        />
        <KeyboardAwareScrollView keyboardShouldPersistTaps="never">
          <View style={{ marginLeft: 150 }}>
            {this.state.hrActivity.length > 0 && (
              <LabelTextDashValue
                hyperLink={true}
                onHyperLinkClick={() => this.showHistory()}
                heading=""
                description="View Activity"
              />
            )}
          </View>

          <BoxContainer style={{ marginTop: 10 }}>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 15,
                alignSelf: "center",
                backgroundColor: appConfig.APP_SKY,
                width: "100%",
                color: appConfig.BLUISH_COLOR,
              }}
            >
              {this.state.isComingFromMyRequest
                ? this.state?.empData?.QueryNumber !== undefined
                  ? "Query : " + this.state.empData.QueryNumber
                  : "Query :"
                : "Raise My Query"}
            </Text>
            <View style={styles.cardLayout}>
              <LabelEditText
                heading="Requester*"
                isEditable={false}
                myNumberOfLines={2}
                isMultiline={true}
                myValue={
                  this.state.isComingFromMyRequest
                    ? this.state.empData.EmployeeName
                    : this.state.empData.EmpName
                }
              />
              <LabelEditText
                heading="Mobile*"
                isEditable={!this.state.isComingFromMyRequest}
                myKeyboardType={"numeric"}
                myValue={this.state.mobileNumber}
                onTextChanged={this.onMobileChanged}
                onFocusView={this.onMobileFocus}
              />
              <LabelEditText
                heading="Project*"
                isEditable={false}
                myNumberOfLines={2}
                isMultiline={true}
                myValue={
                  this.state.isComingFromMyRequest
                    ? this.state.empData.Project
                    : this.state.empData.ProjectDetails
                }
              />
            </View>
          </BoxContainer>
          <BoxContainer style={{ marginTop: 10 }}>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 15,
                alignSelf: "center",
                backgroundColor: appConfig.APP_SKY,
                width: "100%",
                color: appConfig.BLUISH_COLOR,
              }}
            >
              {"Query Details"}
            </Text>
            <View style={styles.cardLayout}>
              <View style={{ height: moderateScale(32) }}>
                <Dropdown
                  title="Category*"
                  disabled={this.state.isComingFromMyRequest}
                  forwardedRef={this.categoryRef}
                  dropDownData={this.state.category.map(
                    (value) => value.Display
                  )}
                  dropDownCallBack={(index, value) =>
                    this.onCategorySelection(index, value)
                  }
                />
              </View>
              <View style={{ height: moderateScale(32) }}>
                <Dropdown
                  title="Sub Category*"
                  disabled={this.state.isComingFromMyRequest}
                  forwardedRef={this.subCategoryRef}
                  dropDownData={this.state.subCategory.map(
                    (value) => value.Display
                  )}
                  dropDownCallBack={(index, value) =>
                    this.onSubCategorySelection(index, value)
                  }
                />
              </View>

              <LabelEditText
                isEditable={!this.state.isComingFromMyRequest}
                heading="Subject Line"
                myMaxLength={4000}
                myNumberOfLines={1}
                myValue={this.state.descriptionInput}
                isMultiline={true}
                onTextChanged={this.onSubjectLineChanged}
              />

              <LabelEditText
                isEditable={!this.state.isComingFromMyRequest}
                heading="Question"
                myMaxLength={4000}
                myNumberOfLines={3}
                myValue={this.state.questInput}
                isMultiline={true}
                onTextChanged={this.onQuestionChanged}
              />
            </View>
          </BoxContainer>
          {!_.isEmpty(this.state.slaData) && (
            <BoxContainer style={{ marginTop: 10 }}>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 15,
                  alignSelf: "center",
                  backgroundColor: appConfig.APP_SKY,
                  width: "100%",
                  color: appConfig.BLUISH_COLOR,
                }}
              >
                {"Task SLA"}
              </Text>
              <View style={styles.cardLayout}>
                <LabelTextDashValue
                  heading="Stage"
                  isEditable={false}
                  myNumberOfLines={2}
                  isMultiline={true}
                  description={this.state.slaData.Stage}
                />
                <LabelTextDashValue
                  heading="Start Time"
                  isEditable={false}
                  myNumberOfLines={2}
                  isMultiline={true}
                  description={this.state.slaData.StartTime}
                />

                <LabelTextDashValue
                  heading="Breach Time"
                  isEditable={false}
                  myNumberOfLines={2}
                  isMultiline={true}
                  description={this.state.slaData.Breachtime}
                />

                <LabelTextDashValue
                  heading="Business Time Left(HH:MM)"
                  isEditable={false}
                  myNumberOfLines={2}
                  isMultiline={true}
                  description={this.state.slaData.BusinesstimeLeft}
                />

                <LabelTextDashValue
                  heading="Business Elapsed Time(HH:MM)"
                  isEditable={false}
                  myNumberOfLines={2}
                  isMultiline={true}
                  description={this.state.slaData.BusinessElapedTime}
                />
              </View>
            </BoxContainer>
          )}
          <BoxContainer style={{ marginTop: 10 }}>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 15,
                alignSelf: "center",
                backgroundColor: appConfig.APP_SKY,
                width: "100%",
                color: appConfig.BLUISH_COLOR,
              }}
            >
              {"File Details"}
            </Text>
            <View style={styles.cardLayout}>
              <View style={{ minHeight: moderateScale(40) }}>
                <AttachmentView
                  heading="File Upload"
                  files={this.state.files}
                  isComingFrom="HR"
                  disable={this.state.isComingFromMyRequest}
                />
              </View>
            </View>
            {this.state.isComingFromMyRequest &&
              this.state.empData.IsSurveyAvailable == 1 && (
                <LabelTextDashValue
                  item={this.state.previousScreenItem}
                  hyperLink={true}
                  onHyperLinkClick={(item) => this.processSurvey(item)}
                  heading=""
                  description={"Complete Suvery"}
                />
              )}
          </BoxContainer>
          {this.state.isComingFromMyRequest &&
            this.state.empData?.IsSurveyAvailable !== 1 &&
            this.state.empData.IsFinalClosed !== 1 && (
              <View style={styles.remarkContainer}>
                <LabelEditText
                  heading="Remarks"
                  placeHolder="Input your remarks if any ."
                  myNumberOfLines={3}
                  isMultiline={true}
                  onTextChanged={this.onRemarks}
                />
              </View>
            )}
          {this.state.empData.IsSurveyAvailable !== 1 &&
            this.state.empData.IsFinalClosed !== 1 && (
              <View style={styles.bottomButtonView}>
                <View style={styles.bottomButtonInnerView}>
                  <CustomButton
                    label={
                      this.state.isComingFromMyRequest &&
                      this.state.empData?.Stage == 3
                        ? "Reopen"
                        : "Submit"
                    }
                    positive={true}
                    performAction={() =>
                      this.onSubmit(
                        this.state.isComingFromMyRequest ? "Reopen" : "Submit"
                      )
                    }
                  />
                </View>
                {this.state.empData?.Stage == 3 && (
                  <View style={styles.bottomButtonInnerView}>
                    <CustomButton
                      label={"Close"}
                      positive={true}
                      performAction={() => this.onSubmit("Close")}
                    />
                  </View>
                )}
              </View>
            )}

          {this.state.alertVisible && (
            <UserMessage
              modalVisible={this.state.alertVisible}
              heading={this.state.alertHeading}
              message={this.state.alertMessage}
              okAction={() => {
                this.setState({ alertVisible: false }, () => {
                  if (this.state.isComingFromMyRequest) {
                    this.props.navigation.pop();
                  } else {
                    this.props.navigation.pop();
                    this.props.navigation.navigate("Hrassistmyrequest");
                  }
                });
              }}
            />
          )}
          <HistoryView
            historyData={this.state.hrActivity}
            forwardedRef={this._panel}
            isComingFromHr={true}
            visibility={this.state.modalVisible}
            onClose={() => this.onHistoryClose()}
          />
        </KeyboardAwareScrollView>
      </ImageBackground>
    );
  }
}

export default HRAssistCreate;

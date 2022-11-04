import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  BackHandler,
  Alert,
  ImageBackground,
} from "react-native";
import UserMessage from "../../components/userMessage";
import { connect } from "react-redux";
import { styles } from "./styles";
import SubHeader from "../../GlobalComponent/SubHeader";
import { writeLog } from "../../utilities/logger";
import {
  ResignationDetails,
  RadioForms,
  Skills,
  SkillSearchView,
  EditTextWithHeading,
  TreatmentRadioForms,
} from "./ExitHelper";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import {
  RESIGNATION_TYPE,
  RESIGNATION_OPTIONS,
  RP_RESIGNED,
  YES_NO_OPTIONS,
  PREVENT_EMAILS,
  DENY_INTERNET,
  PLANNED_SEPARATION,
  STATUS_OPTIONS,
  STATUS,
  SCHEDULED_LWD,
  NP_TREATMENT_OPTIONS,
  NP_TREATMENT,
  REASON_TITLE,
  REMARKS_NP_RECC,
  WAIVER_TITLE,
} from "./constants";
import {
  fetchExitDetails,
  fetchNoticeDetails,
  resetDetails,
  exitActionTaken,
} from "./exitAction";
import DatePicker from "../createLeave/dateTimePicker/DateTimePicker";
import images from "../../images";
import { Dropdown } from "../../GlobalComponent/DropDown/DropDown";
let globalConstants = require("../../GlobalConstants");
let constants = require("./constants");
let reasonArrayData;
export class ExitDetails extends Component {
  constructor(props) {
    super(props);
    this.reasonTypeRef = React.createRef();
    this.reasonRef = React.createRef();
    this.state = {
      exitItem: this.props.navigation.state.params.docDetails,
      skillData: [],
      localSkillData: [],
      query: "",
      modalVisible: false,
      selectedSkill: this.props.navigation.state.params.docDetails.Skills,
      resignationType: this.props.navigation.state.params.docDetails
        .in_rsg_type,
      reasonType: this.props.navigation.state.params.docDetails.vc_rsg_rsn_hr,
      rpType: -1, //this.props.navigation.state.params.docDetails.ch_resig_bench,
      mailType: -1, //this.props.navigation.state.params.docDetails.ch_prevent_email,
      internetType: -1, //this.props.navigation.state.params.docDetails.ch_internet_access,
      separationType: this.props.navigation.state.params.docDetails
        .ch_plannedseparation,
      resignationDate: this.props.navigation.state.params.docDetails
        .dt_resignation,
      statusType: 1,
      lwd:
        this.props.navigation.state.params.docDetails.dt_scheduled_lwd ===
        "01-Jan-1900"
          ? "-"
          : this.props.navigation.state.params.docDetails.dt_scheduled_lwd,
      rlwd: this.props.navigation.state.params.docDetails.dt_requested_lwd,
      requestorId: this.props.navigation.state.params.docDetails.ch_initiatedby,
      npTreatMent: parseInt(
        this.props.navigation.state.params.docDetails.in_treatment
      ),
      reasonRemarks: "",
      resignationReason: "",
      waiverRemarks: "",
      shortPeriod: this.props.navigation.state.params.docDetails
        .in_notice_short,
      supRecomm: this.props.navigation.state.params.docDetails
        .Sup_NP_Recommendation,
      isNSSEMP: this.props.navigation.state.params.docDetails.ISNSSEMP,
      IsSkillApplicable: this.props.navigation.state.params.docDetails
        .IsSkillApplicable,
      showModal: false,
      messageType: null,
      resultModalVisible: false,
      reasonTypeArray: [],
      reasonArray: [],
    };
  }

  handleBack = () => {
    this.props.navigation.pop();
  };
  handleBackButtonClick = () => {
    this.handleBack();
    return true;
  };
  static getDerivedStateFromProps(nextProps, state) {
    if (
      nextProps.detailData &&
      nextProps.detailData &&
      nextProps.detailData.length > 0 &&
      !state.query.length > 0
    ) {
      return {
        skillData: nextProps.detailData[0].skill,
        localSkillData: nextProps.detailData[0].skill,
      };
    } else if (
      nextProps.noticePeriod !== "" &&
      nextProps.noticePeriod.npshort &&
      parseInt(nextProps.noticePeriod.npshort) <= 0
    ) {
      // console.log("condition matched:")
      return {
        npTreatMent: 0,
      };
    } else {
      return null;
    }
  }

  reasonArrayCallBack = (response) => {
    console.log("Component call back called", response);
    reasonArrayData = response[0].ReasonType.filter(
      (item) => item.Type == "Reason"
    );
    this.setState(
      {
        reasonTypeArray: response[0]?.ReasonType.filter(
          (item) => item.Type == "ReasonType"
        ),
      },
      () => {
        console.log("Reason Type Data : ", this.state.reasonTypeArray);
        console.log("Reason  Data : ", this.state.reasonArray);
        if (this.reasonTypeRef.current !== null) {
          let reasonTypeIndex = this.state.reasonTypeArray.findIndex(
            (item) => this.state.resignationType == item.ID
          );
          let reasonTypeData = this.state.reasonTypeArray[reasonTypeIndex];
          this.reasonTypeRef.current.select(reasonTypeIndex);
          let reasonFilteredArray = reasonArrayData?.filter(
            (item) => item?.ReasonTypeID == reasonTypeData?.ID
          );
          this.setState({ reasonArray: reasonFilteredArray }, () => {
            let reasonIndex = this.state.reasonArray?.findIndex(
              (item) => this.state.reasonType == item.ID
            );
            this.reasonRef.current.select(reasonIndex);
          });
        }
      }
    );
  };
  onFocus = () => {
    this.props.fetchDetails(
      this.props.empCode,
      this.props.accessToken,
      this.state.exitItem.in_ecc_no,
      this.reasonArrayCallBack
    );
  };
  componentDidUpdate(prevState, prevProps) {
    if (
      this.state.resultModalVisible !== true &&
      this.props.exitActionError.length > 0
    ) {
      setTimeout(() => {
        this.setState({
          resultModalVisible: true,
          showModal: true,
          messageType: 1,
        });
      }, 1000);
    }
  }
  componentDidMount() {
    writeLog("Landed on " + "ExitDetails");
    this.props.navigation.addListener("willFocus", this.onFocus);
    BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
  }
  onSkillSearch = () => {
    writeLog("Invoked " + "onSkillSearch" + " of " + "ExitDetails");
    this.setState({ modalVisible: true });
  };
  modalClose = () => {
    writeLog("Invoked " + "modalClose" + " of " + "ExitDetails");
    this.setState({ modalVisible: false });
  };
  updateSearch = (searchText) => {
    this.setState(
      {
        query: searchText,
      },
      () => {
        const filteredData = this.state.localSkillData.filter((element) => {
          let str1 = element.ID.trim();
          let str2 = element.SkillName.trim();
          let searchedText = str1.concat(str2);
          let elementSearched = searchedText.toString().toLowerCase();
          let queryLowerCase = this.state.query.toString().toLowerCase();
          return elementSearched.indexOf(queryLowerCase) > -1;
        });
        this.setState({
          localSkillData: filteredData,
        });
      }
    );
  };
  pickSkill = (skillData) => {
    writeLog(
      "Invoked " +
        "pickSkill" +
        " of " +
        "ExitDetails" +
        " for skill " +
        skillData.ID
    );
    this.modalClose();
    // console.log("picked skill", skillData);
    let lwdFinal = this.state.lwd === "-" ? this.state.rlwd : this.state.lwd;
    this.setState(
      {
        selectedSkill: skillData.ID,
      },
      () => {
        setTimeout(() => {
          this.props.fetchNoticePeriod(
            this.props.empCode,
            this.props.accessToken,
            this.state.resignationDate,
            this.state.rpType,
            this.state.selectedSkill,
            lwdFinal,
            this.state.resignationType,
            this.state.requestorId
          );
        }, 1000);
      }
    );
  };

  rp_Resignation = (val) => {
    // console.log("RP resignation is:",val);
    let lwdFinal = this.state.lwd === "-" ? this.state.rlwd : this.state.lwd;
    this.setState({ rpType: val }, () => {
      this.props.fetchNoticePeriod(
        this.props.empCode,
        this.props.accessToken,
        this.state.resignationDate,
        this.state.rpType,
        this.state.selectedSkill,
        lwdFinal,
        this.state.resignationType,
        this.state.requestorId
      );
    });
  };
  preventMail = (val) => {
    // console.log("prevent mail is:",val);
    this.setState({ mailType: val });
  };
  denyInternet = (val) => {
    // console.log("Deny internet is:",val);
    this.setState({ internetType: val });
  };
  plannedSeparation = (val) => {
    // console.log("Planned separation is:",val);
    this.setState({ separationType: val });
  };
  setStatus = (val) => {
    // console.log("Status is:",val);
    this.setState({ statusType: val });
  };
  setNpTreatment = (val) => {
    // console.log("NP treatment is:",val);
    if (val === 0 || val === 4 || val === 5) {
      this.setState({ waiverRemarks: "" });
    }
    this.setState({ npTreatMent: val });
  };
  resignationReason = (val) => {
    this.setState({ resignationReason: val });
  };
  waiverRemarks = (val) => {
    this.setState({ waiverRemarks: val });
  };
  reasonRemarks = (val) => {
    this.setState({ reasonRemarks: val });
  };
  lwdChanged = (date) => {
    // let lwdFinal = (this.state.lwd==="01-Jan-1900") ? this.state.rlwd:this.state.lwd;
    // console.log("RP type is ", this.state.rpType);
    this.setState({ lwd: date }, () => {
      this.props.fetchNoticePeriod(
        this.props.empCode,
        this.props.accessToken,
        this.state.resignationDate,
        this.state.rpType,
        this.state.selectedSkill,
        this.state.lwd,
        this.state.resignationType,
        this.state.requestorId
      );
    });
  };
  renderDateRow = () => {
    return (
      <View style={styles.halfHolder}>
        <Text style={styles.heading}>{SCHEDULED_LWD}</Text>
        <DatePicker
          disabled={true}
          callBack={this.lwdChanged}
          title={this.state.lwd}
          ref={this.startCalendar}
        />
      </View>
    );
  };
  backNavigate() {
    this.setState(
      {
        exitItem: this.props.navigation.state.params.docDetails,
        skillData: [],
        localSkillData: [],
        query: "",
        modalVisible: false,
        selectedSkill: this.props.navigation.state.params.docDetails.Skills,
        resignationType: this.props.navigation.state.params.docDetails
          .in_rsg_type,
        rpType: -1, //this.props.navigation.state.params.docDetails.ch_resig_bench,
        mailType: -1, //this.props.navigation.state.params.docDetails.ch_prevent_email,
        internetType: -1, //this.props.navigation.state.params.docDetails.ch_internet_access,
        separationType: this.props.navigation.state.params.docDetails
          .ch_plannedseparation,
        resignationDate: this.props.navigation.state.params.docDetails
          .dt_resignation,
        statusType: 1,
        lwd:
          this.props.navigation.state.params.docDetails.dt_scheduled_lwd ===
          "01-Jan-1900"
            ? "-".dt_requested_lwd
            : this.props.navigation.state.params.docDetails.dt_scheduled_lwd,
        rlwd: this.props.navigation.state.params.docDetails.dt_requested_lwd,
        requestorId: this.props.navigation.state.params.docDetails
          .ch_initiatedby,
        npTreatMent: this.props.navigation.state.params.docDetails.in_treatment,
        reasonRemarks: "",
        resignationReason: "",
        waiverRemarks: "",
        shortPeriod: this.props.navigation.state.params.docDetails
          .in_notice_short,
        supRecomm: this.props.navigation.state.params.docDetails
          .Sup_NP_Recommendation,
        isNSSEMP: this.props.navigation.state.params.docDetails.ISNSSEMP,
        IsSkillApplicable: this.props.navigation.state.params.docDetails
          .IsSkillApplicable,
        showModal: false,
        messageType: null,
      },
      () => {
        this.props.resetData();
        this.props.navigation.navigate("DashBoard");
      }
    );
  }

  onReasonTypeSelection = (i, val) => {
    let indexFound = this.state.reasonTypeArray?.findIndex(
      (item) => item.ReasonText == val
    );
    this.setState(
      { resignationType: this.state.reasonTypeArray[indexFound].ID },
      () => {
        let reasonTypeIndex = this.state.reasonTypeArray?.findIndex(
          (item) => this.state.resignationType == item.ID
        );
        let reasonTypeData = this.state.reasonTypeArray[reasonTypeIndex];
        let reasonFilteredArray = reasonArrayData?.filter(
          (item) => item.ReasonTypeID == reasonTypeData.ID
        );
        this.setState(
          { reasonArray: reasonFilteredArray, reasonType: "" },
          () => {
            this.reasonRef.current.select(-1);
          }
        );
      }
    );
  };

  onReasonSelection = (i, val) => {
    console.log("Reason value : ", val);
    console.log("Reason index : ", i);
    console.log("Reason Array : ", this.state.reasonArray);
    let indexFound = this.state.reasonArray.findIndex(
      (item) => item.ReasonText == val
    );
    this.setState({ reasonType: this.state.reasonArray[indexFound].ID }, () => {
      console.log("Reason updated : ", this.state.reasonType);
    });
  };
  //pending role -2
  // pending= loginempd
  goAhead = () => {
    writeLog("Clicked on " + "goAhead" + " of " + "ExitDetails");
    let NP =
      this.props.noticePeriod.npshort === undefined
        ? this.state.shortPeriod
        : this.props.noticePeriod.npshort;
    let data = {};
    data.treatment = this.state.npTreatMent + 1;
    data.RegDate = this.state.resignationDate;
    data.SLWD = this.state.lwd;
    data.npReq =
      this.props.noticePeriod === ""
        ? this.state.exitItem.in_notice_reqd
        : this.props.noticePeriod.strNPreqd;
    data.supComment = this.state.reasonRemarks;
    data.resFromPool = this.state.rpType === 0 ? "Y" : "N";
    data.resType = this.state.resignationType;
    data.skillCode = this.state.selectedSkill;
    data.preventEmail = this.state.mailType === 0 ? "Y" : "N";
    data.internetAccess = this.state.internetType === 0 ? "Y" : "N";
    data.waiverRemarks = this.state.waiverRemarks;
    data.resStatus = this.state.statusType + 1;
    data.ReasonTypeID = this.state.resignationType;
    data.ReasonId = this.state.reasonType;
    if (
      this.state.reasonType == "" ||
      this.state.reasonType == undefined ||
      this.state.reasonType == null
    ) {
      return alert(constants.REASON_REQ);
    }
    {
      if (this.state.rpType === -1) {
        return alert(constants.ERROR_TITLE + constants.RP_RESIGNED);
      } else if (this.state.mailType === -1) {
        return alert(constants.ERROR_TITLE + constants.PREVENT_EMAILS);
      } else if (this.state.internetType === -1) {
        return alert(constants.ERROR_TITLE + constants.DENY_INTERNET);
      } else if (this.state.statusType === 1 && this.state.lwd === "-") {
        return alert(constants.PLEASE_TEXT + constants.SCHEDULED_LWD);
      } else if (
        this.state.statusType === 1 &&
        (this.state.npTreatMent === 1 ||
          this.state.npTreatMent === 2 ||
          this.state.npTreatMent === 3) &&
        NP !== "0" &&
        this.state.waiverRemarks === ""
      ) {
        return alert(constants.WAIVER_REMARKS);
      } else if (
        this.state.statusType === 1 &&
        this.state.reasonRemarks === ""
      ) {
        return alert(constants.SUPERVISOR_REMARKS);
      }
    }
    // console.log("Document data is: ",data);
    if (this.state.statusType === 0) {
      this.props.completeRequest(
        this.props.docData[0],
        2,
        this.props.empCode,
        "",
        "",
        data
      );
    } else {
      this.props.navigation.navigate("ExitApproveReject", {
        documentDetailData: data,
      });
    }
  };
  showDialogBox = () => {
    let message = "";
    let heading = "";
    if (this.state.showModal) {
      return (
        <UserMessage
          heading="Error"
          message={this.props.exitActionError}
          okAction={() => {
            this.setState({ showModal: false }, () => {
              this.backNavigate();
            });
          }}
        />
      );
    }
  };
  render() {
    let NP =
      this.props.noticePeriod.npshort === undefined
        ? this.state.shortPeriod
        : this.props.noticePeriod.npshort;
    return (
      <ImageBackground style={{ flex: 1 }} source={images.loginBackground}>
        {/* {this.activityIndicator()} */}
        <SubHeader
          pageTitle={globalConstants.EXIT_DETAILS_TITLE}
          backVisible={true}
          logoutVisible={true}
          handleBackPress={() => this.handleBack()}
          navigation={this.props.navigation}
        />
        <KeyboardAwareScrollView
          style={styles.container}
          keyboardShouldPersistTaps="never"
        >
          <ResignationDetails
            noticePeriod={this.props.noticePeriod}
            exitItem={this.state.exitItem}
            lwd={this.state.lwd}
          />
          <View style={{ marginHorizontal: 15, alignItems: "center" }}>
            <Dropdown
              title={"Resignation Type"}
              forwardedRef={this.reasonTypeRef}
              dropDownData={this.state.reasonTypeArray.map(
                (item) => item.ReasonText
              )}
              dropDownCallBack={(index, value) =>
                this.onReasonTypeSelection(index, value)
              }
            />

            <Dropdown
              title={"Reason for Resignation"}
              forwardedRef={this.reasonRef}
              dropDownData={this.state.reasonArray.map(
                (item) => item.ReasonText
              )}
              dropDownCallBack={(index, value) =>
                this.onReasonSelection(index, value)
              }
            />
          </View>
          {/* <RadioForms selectedVal = {this.state.resignationType} onValueSelection={(val)=>this.resignationTypeSelection(val)} labelHorizontal= {false} title={RESIGNATION_TYPE} options = {RESIGNATION_OPTIONS}/> */}
          {this.state.IsSkillApplicable === "Y" ? (
            <Skills
              skillData={this.state.skillData}
              skillSelected={this.state.selectedSkill}
              searchCallBack={() => {
                this.onSkillSearch();
              }}
            />
          ) : null}
          {this.state.skillData && this.state.skillData.length > 0 ? (
            <SkillSearchView
              query={this.state.query}
              visibility={this.state.modalVisible}
              closeCallBack={() => {
                this.modalClose();
              }}
              search={() => this.updateSearch}
              skillData={this.state.localSkillData}
              pickSkill={(skillData) => {
                this.pickSkill(skillData);
              }}
            />
          ) : null}
          <RadioForms
            selectedVal={this.state.rpType}
            onValueSelection={(val) => this.rp_Resignation(val)}
            labelHorizontal={true}
            title={RP_RESIGNED}
            options={YES_NO_OPTIONS}
          />
          <RadioForms
            selectedVal={this.state.mailType}
            onValueSelection={(val) => this.preventMail(val)}
            labelHorizontal={true}
            title={PREVENT_EMAILS}
            options={YES_NO_OPTIONS}
          />
          <RadioForms
            selectedVal={this.state.internetType}
            onValueSelection={(val) => this.denyInternet(val)}
            labelHorizontal={true}
            title={DENY_INTERNET}
            options={YES_NO_OPTIONS}
          />
          <RadioForms
            exitItem={this.state.exitItem}
            selectedVal={this.state.separationType}
            onValueSelection={(val) => this.plannedSeparation(val)}
            labelHorizontal={true}
            title={PLANNED_SEPARATION}
            options={YES_NO_OPTIONS}
          />
          <RadioForms
            selectedVal={this.state.statusType}
            onValueSelection={(val) => this.setStatus(val)}
            labelHorizontal={false}
            title={STATUS}
            options={STATUS_OPTIONS}
          />
          {this.state.statusType === 1 ? this.renderDateRow() : null}

          {(this.state.statusType === 1 && NP !== "0") ||
          (this.state.Sup_NP_Recommendation === "N" &&
            this.state.isNSSEMP == "Y") ? (
            <TreatmentRadioForms
              selectedVal={this.state.npTreatMent}
              onValueSelection={(val) => this.setNpTreatment(val)}
              labelHorizontal={true}
              title={NP_TREATMENT}
              options={NP_TREATMENT_OPTIONS}
            />
          ) : null}

          {(this.state.npTreatMent === 1 ||
            this.state.npTreatMent === 2 ||
            this.state.npTreatMent === 3) &&
          NP !== "0" ? (
            <EditTextWithHeading
              title={WAIVER_TITLE}
              reasonRemarks={(remarks) => this.waiverRemarks(remarks)}
            />
          ) : null}
          <EditTextWithHeading
            title={REMARKS_NP_RECC}
            reasonRemarks={(reasonRemarks) => this.reasonRemarks(reasonRemarks)}
          />
          <TouchableOpacity
            style={styles.submitButton}
            onPress={() => this.goAhead()}
          >
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
          {this.state.showModal ? this.showDialogBox() : null}
        </KeyboardAwareScrollView>
      </ImageBackground>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    empCode:
      state.loginReducer.loginData !== undefined
        ? state.loginReducer.loginData.SmCode
        : "",
    accessToken:
      state.loginReducer.loginData !== undefined
        ? state.loginReducer.loginData.Authkey
        : "",
    detailData: state.exitReducer.detailData,
    noticePeriod: state.exitReducer.noticePeriod,
    docData: state.exitReducer.exitData,
    exitActionResponse: state.exitReducer.exitActionResponse,
    exitActionError: state.exitReducer.exitDetailError,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    resetData: () => dispatch(resetDetails()),
    fetchDetails: (empCode, authToken, eccNo, callBack) =>
      dispatch(fetchExitDetails(empCode, authToken, eccNo, callBack)),
    fetchNoticePeriod: (
      empCode,
      authToken,
      rn_date,
      rp_type,
      skillCode,
      lwd,
      resignationCode,
      requestorId
    ) =>
      dispatch(
        fetchNoticeDetails(
          empCode,
          authToken,
          rn_date,
          rp_type,
          skillCode,
          lwd,
          resignationCode,
          requestorId
        )
      ),
    completeRequest: (
      docData,
      pendingRole,
      pendingWith,
      toRole,
      submitTo,
      previousScreenData
    ) =>
      dispatch(
        exitActionTaken(
          docData,
          pendingRole,
          pendingWith,
          toRole,
          submitTo,
          previousScreenData
        )
      ),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExitDetails);

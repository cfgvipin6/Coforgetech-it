/* eslint-disable no-trailing-spaces */
/* eslint-disable eqeqeq */
/* eslint-disable no-alert */
/* eslint-disable semi */
/* eslint-disable quotes */
/* eslint-disable no-undef */
/* eslint-disable keyword-spacing */
/* eslint-disable prettier/prettier */
/*
Author: Mohit Garg(70024)
*/

import React, { Component } from "react";
import { connect } from "react-redux";
import { Text, View, ImageBackground, Alert } from "react-native";
import SubHeader from "../../../GlobalComponent/SubHeader";
import { globalFontStyle } from "../../../components/globalFontStyle";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import { LabelEditText } from "../../../GlobalComponent/LabelEditText/LabelEditText";
import { Dropdown } from "../../../GlobalComponent/DropDown/DropDown";
import CustomButton from "../../../components/customButton";
import moment from "moment";
import ActivityIndicatorView from "../../../GlobalComponent/myActivityIndicator";
import { CostCenterProjectSelection } from "../createGenericVoucher/costCenterProjectSelect.js";
import { fetchCreateModifyStopData } from "../createGenericVoucher/utils";
import {
  cvFetchEmployeeData,
  cvFetchCategory,
  cvFetchSubCategory,
  cvFetchChildDetails,
  cvFetchClaimFor,
  cvFetchInvestmentPlan,
  cvFetchWeddingDate,
  cvFetchTakeABreakBalance,
  cvSearchProject,
  cvResetEmpData,
} from "./cvAction";
import {
  employeeDetail,
  sectionTitle,
  categoryDetails,
  subCategoryDetails,
  myProjectView,
  usAdditionalDetails,
} from "./cvUtility";
import { styles } from "./styles";
import { fetchBalanceData } from "../createGenericVoucher/utils";
import properties from "../../../resource/properties";
import { showToast } from "../../../GlobalComponent/Toast";
import images from "../../../images";
let constants = require("./constants");
let globalConstants = require("../../../GlobalConstants");

class CreateVoucher extends Component {
  constructor(props) {
    super(props);
    previousScreenData = this.props.navigation.state.params;
    isComingFromMyVoucher =
      previousScreenData !== undefined
        ? previousScreenData.isComingFromMyVoucher
        : false;
    this.state = {
      cvEmployeeDataArray: [],
      cvCategoryDataArray: [],
      cvSubCategoryDataArray: [],
      cvChildDataArray: [],
      cvClaimForDataArray: [],
      cvInvestmentPlanDataArray: [],
      cvTakeABreakDataArray: [],
      weddingDateValue: "",
      categoryIdValue: "",
      categoryTextValue: "",
      subCategoryIdValue: "",
      subCategoryTextValue: "",
      voucherTypeErrorFlag: false,
      childAllowanceErrorFlag: false,
      childNameValue: "",
      childDobOriginalValue: "",
      childDobValue: "",
      childBirthClaimLastDate: "",
      childBirthdayClaimLastDate: "",
      claimForValue: "",
      claimForIdValue: "",
      investmentPlanValue: "",
      investmentPlanIdValue: "",
      claimableBalValue: 0,
      wefDateValue: "",
      tillDateValue: "",
      isChildBirthClaimTaken: 0,
      isChildBirthdayClaimTaken: 0,
      isWeddingClaimTaken: 0,
      costCenterValue: "",
      autoCompleteProjectHideResult: false,
      projectSearchValue: "",
      searchProjectDataArray: [],
      autoSearchProjectDataArray: [],
      loader: false,
      contractIdValue: "",
      relocationFromToValue: "",
      purposeValue: "",
      accompaniedByValue: "",
      transferTypeValue: "",
      billableToClientIdValue: "",
      billableToClientValue: "",
      clientIdValue: "",
      clientIdId: "",
      // showErrorFlag: false,  //will handle later
    };
    // claimableBalValue = 0
    (isMandatoryFieldBlank = false), (this.categoryRef = React.createRef());
    this.subCategoryRef = React.createRef();
    this.childNameRef = React.createRef();
    this.claimForRef = React.createRef();
    this.investmentPlanRef = React.createRef();
    this.transferTypeRef = React.createRef();
    this.billableToClientRef = React.createRef();
    this.clientIdRef = React.createRef();
  }

  static getDerivedStateFromProps = (nextProps, state) => {
    // if(nextProps.cvEmployeeData && nextProps.cvEmployeeData.length > 0) {
    return {
      cvEmployeeDataArray: nextProps.cvEmployeeData,
      cvCategoryDataArray: nextProps.cvCategoryData,
      // cvSubCategoryDataArray: nextProps.cvSubCategoryData.filter((item)=>item.DisplayText !== "Staff Welfare" && item.DisplayText !== "Covid-vaccination" && item.DisplayText !== "Staff Welfare-VDH"),
      cvSubCategoryDataArray: nextProps.cvSubCategoryData.filter(
        (item) => item.DisplayText !== "Covid-vaccination"
      ),
      // cvSubCategoryDataArray:nextProps.cvSubCategoryData,
      cvChildDataArray: nextProps.cvChildData,
      cvClaimForDataArray: nextProps.cvClaimForData,
      cvInvestmentPlanDataArray: nextProps.cvInvestmentPlanData,
      weddingDateValue:
        state.subCategoryIdValue == 8 &&
        nextProps.cvWeddingDateData[0] &&
        nextProps.cvWeddingDateData[0] != undefined
          ? nextProps.cvWeddingDateData[0].WedDate
          : "",
      isWeddingClaimTaken:
        state.subCategoryIdValue == 8 &&
        nextProps.cvWeddingDateData[0] &&
        nextProps.cvWeddingDateData[0] != undefined
          ? nextProps.cvWeddingDateData[0].IsWeddingAllowanceTaken
          : 0,
      cvTakeABreakDataArray:
        state.subCategoryIdValue == 1 &&
        nextProps.cvTakeABreakData[0] &&
        nextProps.cvTakeABreakData[0] != undefined
          ? nextProps.cvTakeABreakData
          : [],
    };
    // }
    // return null
  };

  componentDidMount() {
    let myDocNo = "";
    if (isComingFromMyVoucher) {
      myDocNo = previousScreenData.docDetails.DocNo;
    }
    this.setState({ loader: true });
    this.props.fetchCVEmployeeData(
      this.props.loginData.SmCode,
      this.props.loginData.Authkey,
      myDocNo,
      this.getCategoryCallBack
    );
  }

  componentWillUnmount = () => {
    this.props.resetCVEmpData();
  };

  onBack = () => {
    this.props.navigation.pop();
  };

  
  getCategoryCallBack = () => {
    this.setState({ loader: false });
    let myEmpData = this.state.cvEmployeeDataArray[0];
    console.log("EMP DATA : ", myEmpData);
    if (myEmpData) {
      this.setState({
        projectSearchValue:
          myEmpData.PROJ_CODE.trim() + "~" + myEmpData.PROJ_TXT,
        costCenterValue: myEmpData.CC_CODE.trim() + "~" + myEmpData.CC_TXT,
      });
    }
    if (isComingFromMyVoucher) {
      let myDocDetails = previousScreenData.docDetails;
      let categoryIndex = myEmpData.VoucherCategory.findIndex(
        (el) => el.ID == myDocDetails.Category
      );
      let clientIdIndex = myEmpData.UsClientList.findIndex(
        (el) => el.ID == myEmpData.ClientName
      );
      console.log("Client id index: ", clientIdIndex);
      let billableToClientIndex = myEmpData.UsVoucherBillableByClients.findIndex(
        (el) => el.ID == myEmpData.Billable
      );
      let transferTypeIndex = myEmpData.UsVoucherTravelRelocationTypes.findIndex(
        (el) => el.ID == myEmpData.TravelType
      );
      let billableToClientId = myEmpData.Billable;
      let billableToClientVal = myEmpData.BillableText;
      let clientIdIdVal = myEmpData.ClientName;
      let clientIdVal = myEmpData.ClientNameText;
      let transferTypeText =
        myDocDetails.Category == 12 || myDocDetails.Category == 11
          ? myEmpData.TravelTypeText
          : "";
      this.setState(
        {
          autoCompleteProjectHideResult: true,
          categoryIdValue: myDocDetails.Category,
          categoryTextValue: myDocDetails.CategoryName,
          billableToClientIdValue: billableToClientId,
          billableToClientValue: billableToClientVal,
          clientIdId: clientIdIdVal,
          clientIdValue: clientIdVal,
          contractIdValue: myEmpData.ContractId,
          transferTypeValue: transferTypeText,
          relocationFromToValue: myEmpData.TripName,
          purposeValue: myEmpData.UsPurpose,
          accompaniedByValue: myEmpData.AccompaniedBy,
        },
        () => {
          setTimeout(() => {
            if (this.categoryRef.current !== null) {
              this.categoryRef.current.select(categoryIndex);
              this.billableToClientRef.current.select(billableToClientIndex);
              this.clientIdRef.current.select(clientIdIndex);
              if (myDocDetails.Category == 12 || myDocDetails.Category == 11) {
                this.transferTypeRef.current.select(transferTypeIndex);
              }
            } else {
              return alert("Not found");
            }
          }, 700);
        }
      );
    }
    this.props.fetchCVCategory();
  };

  onCategorySelection = (i, value) => {
    console.log("On category selection");
    let index = value === undefined ? i - 1 : i;
    let myCategoryId =
      this.state.cvCategoryDataArray.length > 0 &&
      this.state.cvCategoryDataArray[index].ID;
    this.setState(
      {
        categoryIdValue: myCategoryId,
        categoryTextValue: value,
      },
      () => {
        if (
          this.state.categoryIdValue == 1 ||
          this.state.categoryIdValue == 2 ||
          this.state.categoryIdValue == 3 ||
          this.state.categoryIdValue == 4 ||
          this.state.categoryIdValue == 5 ||
          this.state.categoryIdValue == 6 ||
          this.state.categoryIdValue == 7
        ) {
          fetchCreateModifyStopData(this.state.categoryIdValue).then((res) => {
            let myRes = res[0];

            console.log(
              "Condition : ",
              !myRes.ExceptionalCompanyCode.includes(
                this.state.cvEmployeeDataArray[0].CO_CODE
              )
            );
            console.log("myRes.IsCreateStop : ", myRes.IsCreateStop);

            if (
              myRes.IsCreateStop == "Y" &&
              !myRes.ExceptionalCompanyCode.includes(
                this.state.cvEmployeeDataArray[0].CO_CODE
              )
            ) {
              return Alert.alert(
                globalConstants.ATTENTION_HEADING_TEXT,
                myRes.CreateStopMessage,
                [
                  {
                    text: "OK",
                    onPress: () => {
                      this.onBack();
                    },
                  },
                ]
              );
            }
          });
        }
        if (this.state.categoryIdValue == 1) {
          this.props.fetchCVSubCategory(this.state.categoryIdValue);
        } else {
     
          this.setState({
            subCategoryIdValue: "",
            subCategoryTextValue: "",
          });
          if (
            this.state.categoryIdValue == 2 ||
            this.state.categoryIdValue == 8 ||
            this.state.categoryIdValue == 9 ||
            this.state.categoryIdValue == 10
          ) {
            if (
              ((this.state.categoryIdValue == 8 ||
                this.state.categoryIdValue == 9 ||
                this.state.categoryIdValue == 10) &&
                this.state.cvEmployeeDataArray[0].ProjectCodeFlag == "YES") ||
              this.state.categoryIdValue == 2
            ) {
              this.setState({
                voucherTypeErrorFlag: false,
              });
            }
          } else if (
            this.state.categoryIdValue == 12 ||
            this.state.categoryIdValue == 11 ||
            this.state.categoryIdValue == 13
          ) {
            if (this.state.categoryIdValue == 13) {
              this.setState({
                accompaniedByValue: "",
                transferTypeValue: "",
              });
            }
          }
        }
      }
    );
  };
  showGeneralAlert = (msg) => {
    setTimeout(() => {
      return alert(msg);
    }, 500);
  };
  onSubCategorySelection = (i, value) => {
    let index = value === undefined ? i - 1 : i;
    let mySubCategoryId =
      this.state.cvSubCategoryDataArray.length > 0 &&
      this.state.cvSubCategoryDataArray[index].ID;
    this.setState(
      {
        subCategoryIdValue: mySubCategoryId,
        subCategoryTextValue: value,
        voucherTypeErrorFlag: false,
        childDobValue: "",
        childDobOriginalValue: "",
        childNameValue: "",
        claimForValue: "",
        claimForIdValue: "",
        investmentPlanValue: "",
        investmentPlanIdValue: "",
        childAllowanceErrorFlag: false,
        claimableBalValue: 0,
        wefDateValue: "",
        tillDateValue: "",
      },
      () => {
        if (this.state.subCategoryIdValue == 9) {
          this.props.fetchCVChildDetails();
          this.props.fetchCVClaimFor();
          this.props.fetchCVInvestmentPlan();
        } else if (this.state.subCategoryIdValue == 8) {
          this.props.fetchCVWeddingDate();
        } else if (this.state.subCategoryIdValue == 1) {
          this.props.fetchCVTakeABreakBalance("").then(() => {
            if (
              this.state.cvTakeABreakDataArray[0] &&
              this.state.cvTakeABreakDataArray[0] != undefined
            ) {
              let myTakeABreakData = this.state.cvTakeABreakDataArray[0].Code.split(
                ":"
              );
              this.setState({
                claimableBalValue: myTakeABreakData[1],
                wefDateValue: myTakeABreakData[2],
                tillDateValue: myTakeABreakData[3],
              });
            }
          });
        }
      }
    );
  };

  onChildSelection = (i, value) => {
    let index = value === undefined ? i - 1 : i;
    let myChildIdArray =
      this.state.cvChildDataArray.length > 0 &&
      this.state.cvChildDataArray[index].ID.split("$");
    this.setState(
      {
        childNameValue: value,
        childDobValue: moment(myChildIdArray[1], "YYYYMMDD").format(
          "DD-MMM-YYYY"
        ),
        childDobOriginalValue: myChildIdArray[1],
        childBirthClaimLastDate: myChildIdArray[2],
        childBirthdayClaimLastDate: myChildIdArray[3],
        isChildBirthClaimTaken: myChildIdArray[4],
        isChildBirthdayClaimTaken: myChildIdArray[5],
        // childBirthClaimLastDate: moment(myChildIdArray[2],"YYYYMMDD").format("DD-MMM-YYYY"),
        // childBirthdayClaimLastDate: moment(myChildIdArray[3],"YYYYMMDD").format("DD-MMM-YYYY"),
      },
      () => {
        if (
          this.state.claimForValue !== "" &&
          this.state.investmentPlanValue !== ""
        ) {
          this.setState({
            childAllowanceErrorFlag: false,
          });
        }
      }
    );
  };

  onClaimForSelection = (i, value) => {
    let myClaimForId =
      this.state.cvClaimForDataArray.length > 0 &&
      this.state.cvClaimForDataArray[i].ID;
    this.setState(
      {
        claimForValue: value,
        claimForIdValue: myClaimForId,
      },
      () => {
        if (
          this.state.childNameValue !== "" &&
          this.state.investmentPlanValue !== ""
        ) {
          this.setState({
            childAllowanceErrorFlag: false,
          });
        }
      }
    );
  };

  onInvestmentPlanSelection = (i, value) => {
    let myInvestmentPlanId =
      this.state.cvInvestmentPlanDataArray.length > 0 &&
      this.state.cvInvestmentPlanDataArray[i].ID;
    this.setState(
      {
        investmentPlanValue: value,
        investmentPlanIdValue: myInvestmentPlanId,
      },
      () => {
        if (
          this.state.childNameValue !== "" &&
          this.state.claimForValue !== ""
        ) {
          this.setState({
            childAllowanceErrorFlag: false,
          });
        }
      }
    );
  };

  userErrorMessage = (flag) => {
    if (flag) {
      return (
        <Text style={{ color: "red" }}>
          {constants.MANDATORY_FIELD_ERROR_MSG}
        </Text>
      );
    } else {
      return null;
    }
  };

  onTransferTypeSelection = (i, val) => {
    this.setState({
      transferTypeValue: val,
    });
  };

  onBillableToClientSelection = (i, val) => {
    let myBillableToClientId = this.state.cvEmployeeDataArray[0]
      .UsVoucherBillableByClients[i].ID;
    this.setState({
      billableToClientValue: val,
      billableToClientIdValue: myBillableToClientId,
    });
  };

  onClientIdSelection = (i, val) => {
    let myClientIdId = this.state.cvEmployeeDataArray[0].UsClientList[i].ID;
    this.setState({
      clientIdValue: val,
      clientIdId: myClientIdId,
    });
  };

  checkUSAdditionalField = (flag) => {
    isMandatoryFieldBlank = flag;
  };

  onProjectItem = (projectItem) => {
    console.log("On project Item : ", projectItem);
    this.setState({
      projectSearchValue:
        projectItem.ID.trim() + "~" + projectItem.DisplayText.split("~")[1],
    });
  };
  onCostCenterItem = (costCenterItem) => {
    console.log("On cost center Item : ", costCenterItem);
    this.setState({
      costCenterValue: costCenterItem.DisplayText,
      projectSearchValue: "",
    });
  };
  voucherTypeConditionalView = () => {
    if (this.state.categoryIdValue == 1) {
      return (
        <Dropdown
          title={constants.SUB_CATEGORY_TEXT}
          disabled={false}
          forwardedRef={this.subCategoryRef}
          dropDownData={this.state.cvSubCategoryDataArray.map(
            (value) => value.DisplayText
          )}
          dropDownCallBack={(index, value) =>
            this.onSubCategorySelection(index, value)
          }
        />
      );
    } else if (
      this.state.categoryIdValue == 12 ||
      this.state.categoryIdValue == 11 ||
      this.state.categoryIdValue == 13
    ) {
      let transferTypeLbl = "",
        relocationFromToLbl = "",
        transferTypeVisible = true,
        accompaniedByVisible = true;
      if (this.state.categoryIdValue == 11) {
        transferTypeLbl = constants.TRAVEL_TYPE_TEXT;
        relocationFromToLbl = constants.TRIP_NAME_TEXT;
      } else if (this.state.categoryIdValue == 12) {
        transferTypeLbl = constants.TRANSFER_TYPE_TEXT;
        relocationFromToLbl = constants.RELOCATION_FROM_TO_TEXT;
      } else if (this.state.categoryIdValue == 13) {
        transferTypeVisible = false;
        relocationFromToLbl = constants.NAME_TEXT;
        accompaniedByVisible = false;
      }
      return (
        <View>
          {this.state.cvEmployeeDataArray &&
            this.state.cvEmployeeDataArray.length > 0 && (
              <CostCenterProjectSelection
                myEmpData={this.state.cvEmployeeDataArray}
                projectVal={(projItem) => this.onProjectItem(projItem)}
                costCenterVal={(costCenterItem) =>
                  this.onCostCenterItem(costCenterItem)
                }
              />
            )}
          <Dropdown
            title={
              constants.BILLABLE_TO_CLIENT_TEXT +
              globalConstants.ASTERISK_SYMBOL
            }
            disabled={false}
            forwardedRef={this.billableToClientRef}
            dropDownData={
              this.state.cvEmployeeDataArray.length > 0 &&
              this.state.cvEmployeeDataArray[0].UsVoucherBillableByClients.map(
                (value) => value.DisplayText
              )
            }
            dropDownCallBack={(index, value) =>
              this.onBillableToClientSelection(index, value)
            }
          />
          <Dropdown
            title={
              constants.CLIENT_ID_TEXT +
              (this.state.billableToClientValue === "Yes"
                ? globalConstants.ASTERISK_SYMBOL
                : "")
            }
            disabled={false}
            forwardedRef={this.clientIdRef}
            dropDownData={
              this.state.cvEmployeeDataArray.length > 0 &&
              this.state.cvEmployeeDataArray[0].UsClientList.map(
                (value) => value.DisplayText
              )
            }
            dropDownCallBack={(index, value) =>
              this.onClientIdSelection(index, value)
            }
          />
          <LabelEditText
            heading={
              constants.CONTRACT_ID_TEXT +
              (this.state.billableToClientValue === "Yes"
                ? globalConstants.ASTERISK_SYMBOL
                : "")
            }
            isEditable={true}
            onTextChanged={(text) => this.setState({ contractIdValue: text })}
            myValue={this.state.contractIdValue}
            isSmallFont={true}
          />
          {transferTypeVisible ? (
            <Dropdown
              title={transferTypeLbl + globalConstants.ASTERISK_SYMBOL}
              disabled={false}
              forwardedRef={this.transferTypeRef}
              dropDownData={
                this.state.cvEmployeeDataArray.length > 0 &&
                this.state.cvEmployeeDataArray[0].UsVoucherTravelRelocationTypes.map(
                  (value) => value.DisplayText
                )
              }
              dropDownCallBack={(index, value) =>
                this.onTransferTypeSelection(index, value)
              }
            />
          ) : null}
          <LabelEditText
            heading={relocationFromToLbl + globalConstants.ASTERISK_SYMBOL}
            isEditable={true}
            onTextChanged={(text) =>
              this.setState({ relocationFromToValue: text })
            }
            myValue={this.state.relocationFromToValue}
            isSmallFont={true}
          />
          <LabelEditText
            heading={constants.PURPOSE_TEXT + globalConstants.ASTERISK_SYMBOL}
            isEditable={true}
            onTextChanged={(text) => this.setState({ purposeValue: text })}
            myValue={this.state.purposeValue}
            isSmallFont={true}
          />
          {accompaniedByVisible ? (
            <LabelEditText
              heading={constants.ACCOMPANIED_BY_TEXT}
              isEditable={true}
              onTextChanged={(text) =>
                this.setState({ accompaniedByValue: text })
              }
              myValue={this.state.accompaniedByValue}
              isSmallFont={true}
            />
          ) : null}
        </View>
      );
    }
  };

  voucherTypeView = () => {
    return (
      <View style={styles.userInfoView}>
        <ImageBackground style={styles.cardBackground} resizeMode="cover">
          {sectionTitle(constants.VOUCHER_TYPE_TEXT)}
          <View style={styles.cardStyle}>
            {this.userErrorMessage(this.state.voucherTypeErrorFlag)}
            <Dropdown
              title={constants.CATEGORY_TEXT}
              disabled={isComingFromMyVoucher ? true : false}
              forwardedRef={this.categoryRef}
              dropDownData={this.state.cvCategoryDataArray.map(
                (value) => value.DisplayText
              )}
              dropDownCallBack={(index, value) =>
                this.onCategorySelection(index, value)
              }
            />
            {this.voucherTypeConditionalView()}
          </View>
        </ImageBackground>
      </View>
    );
  };

  additionalExpenseDetailsView = () => {
 
    if (this.state.subCategoryIdValue == 9) {
      let {ResignationDate} = this.state.cvEmployeeDataArray[0];
      console.log("ResignationDate",ResignationDate)
      return (
        <View style={styles.userInfoView}>
          <ImageBackground style={styles.cardBackground} resizeMode="cover">
            {sectionTitle(constants.ENTER_EXPENSE_DETAILS_TEXT)}
            <View style={styles.cardStyle}>
              {this.userErrorMessage(this.state.childAllowanceErrorFlag)}
              <Dropdown
                title={
                  constants.CHILD_NAME_TEXT + globalConstants.ASTERISK_SYMBOL
                }
                disabled={false}
                forwardedRef={this.childNameRef}
                dropDownData={this.state.cvChildDataArray.map(
                  (value) => value.DisplayText
                )}
                dropDownCallBack={(index, value) =>
                  this.onChildSelection(index, value)
                }
              />
              <LabelEditText
                heading={
                  constants.CHILD_DOB_TEXT + globalConstants.ASTERISK_SYMBOL
                }
                isEditable={false}
                myValue={this.state.childDobValue}
              />
              <Dropdown
                title={
                  constants.CLAIM_FOR_TEXT + globalConstants.ASTERISK_SYMBOL
                }
                disabled={false}
                forwardedRef={this.claimForRef}
                dropDownData={this.state.cvClaimForDataArray.map(
                  (value) => value.DisplayText
                )}
                dropDownCallBack={(index, value) =>
                  this.onClaimForSelection(index, value)
                }
              />
              <Dropdown
                title={
                  constants.INVESTMENT_PLAN_TEXT +
                  globalConstants.ASTERISK_SYMBOL
                }
                disabled={false}
                forwardedRef={this.investmentPlanRef}
                dropDownData={this.state.cvInvestmentPlanDataArray.map(
                  (value) => value.DisplayText
                )}
                dropDownCallBack={(index, value) =>
                  this.onInvestmentPlanSelection(index, value)
                }
              />
               {
                  ResignationDate ?
                  <LabelEditText
                  heading={constants.DATE_OF_RESIGNATION_TEXT}
                  isEditable={false}
                  myValue={ResignationDate}
                />
                :
                null
                 }
            </View>
          </ImageBackground>
        </View>
      );
    } else if (this.state.subCategoryIdValue == 1) {
      let {ResignationDate} = this.state.cvEmployeeDataArray[0];
         
          return (
            <View style={styles.userInfoView}>
              <ImageBackground style={styles.cardBackground} resizeMode="cover">
                {sectionTitle(constants.BALANCE_TEXT)}
                <View style={styles.cardStyle}>
                  <LabelEditText
                    heading={constants.WEF_DATE_TEXT}
                    isEditable={false}
                    myValue={this.state.wefDateValue}
                  />
                  <LabelEditText
                    heading={constants.TILL_DATE_TEXT}
                    isEditable={false}
                    myValue={this.state.tillDateValue}
                  />
                  <LabelEditText
                    heading={constants.CLAIMABLE_BAL_TEXT}
                    isEditable={false}
                    myValue={this.state.claimableBalValue}
                  />
                 {
                  ResignationDate ?
                  <LabelEditText
                  heading={constants.DATE_OF_RESIGNATION_TEXT}
                  isEditable={false}
                  myValue={ResignationDate}
                />
                :
                null
                 }
            
                </View>
              </ImageBackground>
            </View>
          );
         
        //  else{
        //   return alert ("Not Claimable Take a break")
        //  }
      
    } else if (this.state.subCategoryIdValue == 8) {
      //wedding
      let {ResignationDate} = this.state.cvEmployeeDataArray[0];
      return (
        <View style={styles.userInfoView}>
          <ImageBackground style={styles.cardBackground} resizeMode="cover">
            {sectionTitle(constants.WEDDING_DETAILS_TEXT)}
            <View style={styles.cardStyle}>
              <LabelEditText
                heading={constants.DATE_OF_WEDDING_TEXT}
                isEditable={false}
                myValue={this.state.weddingDateValue}
              />
             {
                  ResignationDate ?
                  <LabelEditText
                  heading={constants.DATE_OF_RESIGNATION_TEXT}
                  isEditable={false}
                  myValue={ResignationDate}
                />
                :
                null
                 }
            </View>
          </ImageBackground>
        </View>
      );
    } 
 
    
    else {
      return null;
    }
  };

  nextNavigateAction = async () => {
    let {ResignationDate} = this.state.cvEmployeeDataArray[0];
    let categoryData = this.props.cvCategoryData;
    let file = categoryData.find(
      (item) => this.state.categoryIdValue == item.ID
    );
    console.log("Category Value : ", file);
    if (
      this.state.subCategoryIdValue == 7 &&
      this.state.categoryIdValue == 1 &&
      this.state.cvEmployeeDataArray[0].IsDataCardEntitlement == "YES"
    ) {
      return alert(constants.NOT_ELIGIBLE_CLAIM_DATA_CARD);
    }
    if (this.state.categoryIdValue == 6) {
      this.props.navigation.navigate("CreateGenericVoucher", {
        Title: globalConstants.CREATE_MOBILE_VOUCHER,
        CatID: this.state.categoryIdValue,
        isFileRequired: file.FileRequired,
      });
      return;
    }
    if (
      this.state.categoryIdValue == 1 &&
      this.state.subCategoryIdValue == 10
    ) {
      let empData = this.props.cvEmployeeData[0];
      if (empData.CovidClaimBalance == 0 || empData.CovidClaimBalance == "") {
        return this.showGeneralAlert(constants.COVID_NIL_BALANCE);
      } else if (empData.IsRestrictedEmpCode == "YES") {
        return this.showGeneralAlert(constants.COVID_NOT_AUTHORISED);
      }
    }
    if (this.state.categoryIdValue == 3) {
      this.setState({ loader: true });
      let ltaBalance = await fetchBalanceData(
        properties.fetchLtaBalance,
        this.state.categoryIdValue
      );
      this.setState({ loader: false });
      if (
        ltaBalance.EnableLta == "N" ||
        ltaBalance.EnableLta == null ||
        ltaBalance.EnableLta == "" ||
        ltaBalance.EnableLta == 0 ||
        ltaBalance.EnableLta == "" ||
        ltaBalance.EnableLta == null
      ) {
        setTimeout(() => {
          return alert(
            "LTA voucher is not applicable for you. Either you are not eligible as per policy or you have already claimed."
          );
        }, 1000);
      } else {
        this.props.navigation.navigate("CreateLtaVoucher", {
          Title: globalConstants.CREATE_LTA_VOUCHER,
          CatID: this.state.categoryIdValue,
          isFileRequired: file.FileRequired,
        });
      }
      return;
    }
    if (this.state.categoryIdValue == 7) {
      this.setState({ loader: true });
      let healthBalanceResponse = await fetchBalanceData(
        properties.fetchMedicalBalance,
        this.state.categoryIdValue
      );
      this.setState({ loader: false });
      if (
        healthBalanceResponse.EHenableFlag == "N" ||
        healthBalanceResponse.EHenableFlag == null ||
        healthBalanceResponse.MedBalance == "" ||
        healthBalanceResponse.MedBalance == 0 ||
        healthBalanceResponse.MedBalance == "" ||
        healthBalanceResponse.MedBalance == null
      ) {
        setTimeout(() => {
          return alert(
            "Executive health check-up voucher is not applicable for you. Either you are not eligible as per policy or you have already claimed."
          );
        }, 1000);
      } else {
        this.props.navigation.navigate("CreateGenericVoucher", {
          Title: globalConstants.CREATE_HEALTH_VOUCHER,
          CatID: this.state.categoryIdValue,
          isFileRequired: file.FileRequired,
        });
      }
      return;
    }
    if (this.state.categoryIdValue == 4) {
      this.setState({ loader: true });
      let driverVoucherResponse = await fetchBalanceData(
        properties.fetchDriverBalance,
        this.state.categoryIdValue
      );
      this.setState({ loader: false });
      console.log("Driver voucher balance response :", driverVoucherResponse);
      if (driverVoucherResponse.IsDriverVoucher == "N") {
        setTimeout(() => {
          return alert("You are not eligible to raise this voucher");
        }, 1000);
      } else {
        this.props.navigation.navigate("CreateGenericVoucher", {
          Title: globalConstants.CREATE_DRIVER_VOUCHER,
          CatID: this.state.categoryIdValue,
          isFileRequired: file.FileRequired,
        });
      }
      return;
    }
    if (this.state.categoryIdValue == 5) {
      this.props.navigation.navigate("CreateGenericVoucher", {
        Title: globalConstants.CREATE_PETROL_VOUCHER,
        CatID: this.state.categoryIdValue,
        isFileRequired: file.FileRequired,
      });
      return;
    }
    if (this.state.categoryIdValue === "") {
      this.setState({ voucherTypeErrorFlag: true });
    } else if (this.state.categoryIdValue == 1) {
      if (this.state.subCategoryIdValue === "") {
        this.setState({ voucherTypeErrorFlag: true });
      } else if (
        this.state.subCategoryIdValue == 8 &&
        this.state.weddingDateValue == ""
      ) {
        //wedding validation
        return alert(constants.FILL_WED_DETAIL_ERR_MSG);
      } 
      else if (
        this.state.subCategoryIdValue == 8 &&
        ResignationDate != ""
      ) {
        return Alert.alert("As you have resigned, so you cannot claim this voucher.");
      }
      else if (
        this.state.subCategoryIdValue == 8 &&
        this.state.isWeddingClaimTaken != 0
      ) {
        return alert(constants.WED_CLAIM_TAKEN_ERR_MSG);
      }

      else if (
        this.state.subCategoryIdValue == 1 &&
        ResignationDate != ""
      ) {
        return Alert.alert("As you have resigned, so you cannot claim this voucher.");
      }
       else if (
        this.state.subCategoryIdValue == 1 &&
        this.state.claimableBalValue == 0
      ) {
        return alert(constants.INSUFFICIENT_BAL_ERR_MSG);
      }

      else if (
        this.state.subCategoryIdValue == 9 &&
        ResignationDate != ""
      ) {
        return Alert.alert("As you have resigned, so you cannot claim this voucher.");
      }
       else if (
        this.state.subCategoryIdValue == 9 &&
        (this.state.childNameValue === "" ||
          this.state.claimForValue === "" ||
          this.state.investmentPlanValue === "")
      ) {
        //child validation
        this.setState({ childAllowanceErrorFlag: true });
      } else if (
        (this.state.subCategoryIdValue == 9 &&
          this.state.claimForIdValue == 1 &&
          this.state.isChildBirthClaimTaken != 0) ||
        (this.state.subCategoryIdValue == 9 &&
          this.state.claimForIdValue == 2 &&
          this.state.isChildBirthdayClaimTaken != 0)
      ) {
        return alert(constants.CHILD_CLAIM_TAKEN_ERR_MSG);
      } else {
        let myCategoryDetails = categoryDetails(this.state);
        let mySubCategoryDetails = subCategoryDetails(this.state);
        this.props.navigation.navigate("CreateVoucher2", {
          categoryDetails: myCategoryDetails,
          subCategoryDetails: mySubCategoryDetails,
          isComingFromMyVoucher: false,
          isFileRequired: file.FileRequired,
        });
        setTimeout(() => {
          this.subCategoryRef.current.select(-1);
          this.setState({
            subCategoryIdValue: "",
            subCategoryTextValue: "",
          });
        }, 500);
      }
    } else if (
      this.state.categoryIdValue == 2 ||
      this.state.categoryIdValue == 8 ||
      this.state.categoryIdValue == 9 ||
      this.state.categoryIdValue == 10
    ) {
      let myCategoryDetails = categoryDetails(this.state);
      if (
        (this.state.categoryIdValue == 8 ||
          this.state.categoryIdValue == 9 ||
          this.state.categoryIdValue == 10) &&
        this.state.cvEmployeeDataArray[0].ProjectCodeFlag == "YES"
      ) {
        this.props.navigation.navigate("CreateVoucher2", {
          categoryDetails: myCategoryDetails,
          isComingFromMyVoucher: false,
          isFileRequired: file.FileRequired,
        });
      } else {
        if (
          this.state.categoryIdValue == 2 &&
          this.state.cvEmployeeDataArray[0].CONTY != 6
        ) {
          return alert(constants.NOT_ELIGIBLE_LCV_ERR_MSG);
        } else if (
          this.state.categoryIdValue == 10 &&
          this.state.cvEmployeeDataArray[0].IsMileagePending == "YES"
        ) {
          return alert(constants.NOT_ELIGIBLE_MLG_ERR_MSG);
        } else {
          this.props.navigation.navigate("CreateVoucher2", {
            categoryDetails: myCategoryDetails,
            myProject: this.state.projectSearchValue,
            myCostCenter: this.state.costCenterValue,
            isComingFromMyVoucher: false,
            isFileRequired: file.FileRequired,
          });
        }
      }
    } else if (
      this.state.categoryIdValue == 12 ||
      this.state.categoryIdValue == 11 ||
      this.state.categoryIdValue == 13
    ) {
      let myProjectSearchValue = this.state.projectSearchValue.trim();
      if (
        myProjectSearchValue === "" ||
        this.state.relocationFromToValue === "" ||
        this.state.purposeValue === "" ||
        (this.state.transferTypeValue === "" &&
          (this.state.categoryIdValue == 12 ||
            this.state.categoryIdValue == 11)) ||
        this.state.billableToClientValue === "" ||
        (this.state.billableToClientValue === "Yes" &&
          (this.state.contractIdValue === "" ||
            this.state.clientIdValue === ""))
      ) {
        this.setState({ voucherTypeErrorFlag: true });
      } else {
        let myCategoryDetails = categoryDetails(this.state);
        let myUSAdditionalDetails = usAdditionalDetails(this.state);
        this.setState({ voucherTypeErrorFlag: false });
        console.log(
          "Sending data CreateUSVoucher : ",
          this.state.projectSearchValue
        );
        this.props.navigation.navigate("CreateUSVoucher", {
          categoryDetails: myCategoryDetails,
          myProject: this.state.projectSearchValue,
          myCostCenter: this.state.costCenterValue,
          usAdditionalDetails: myUSAdditionalDetails,
          isComingFromMyVoucher: isComingFromMyVoucher,
          docDetails: isComingFromMyVoucher
            ? previousScreenData.docDetails
            : "",
          CatID: isComingFromMyVoucher
            ? previousScreenData.docDetails.Category
            : "",
          isFileRequired: file.FileRequired,
        });
      }
    }
  };

  nextButtonView = () => {
    return (
      <View style={styles.nextButtonView}>
        <CustomButton
          label={constants.NEXT_TEXT}
          positive={true}
          performAction={() => this.nextNavigateAction()}
        />
      </View>
    );
  };

  render() {
    return (
      <ImageBackground
        source={images.loginBackground}
        style={globalFontStyle.container}
      >
        <View style={globalFontStyle.subHeaderViewGlobal}>
          <SubHeader
            pageTitle={
              isComingFromMyVoucher
                ? globalConstants.UPDATE_VOUCHER_TITLE
                : globalConstants.CREATE_REQUEST_IT_TITLE
            }
            backVisible={true}
            logoutVisible={true}
            handleBackPress={() => this.onBack()}
            navigation={this.props.navigation}
          />
        </View>
        <KeyboardAwareScrollView keyboardShouldPersistTaps="never">
          {employeeDetail(this.state.cvEmployeeDataArray[0])}
          {this.voucherTypeView()}
          {this.additionalExpenseDetailsView()}
          {this.nextButtonView()}
          <ActivityIndicatorView loader={this.state.loader} />
        </KeyboardAwareScrollView>
      </ImageBackground>
    );
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    resetCVEmpData: () => dispatch(cvResetEmpData()),
    fetchCVEmployeeData: (empCode, authToken, docNumber, getCategoryCallBack) =>
      dispatch(
        cvFetchEmployeeData(empCode, authToken, docNumber, getCategoryCallBack)
      ),
    fetchCVCategory: () => dispatch(cvFetchCategory()),
    fetchCVSubCategory: (catId) => dispatch(cvFetchSubCategory(catId)),
    fetchCVChildDetails: () => dispatch(cvFetchChildDetails()),
    fetchCVClaimFor: () => dispatch(cvFetchClaimFor()),
    fetchCVInvestmentPlan: () => dispatch(cvFetchInvestmentPlan()),
    fetchCVWeddingDate: () => dispatch(cvFetchWeddingDate()),
    fetchCVTakeABreakBalance: (docNo) =>
      dispatch(cvFetchTakeABreakBalance(docNo)),
    searchCVProject: (term, compCode) =>
      dispatch(cvSearchProject(term, compCode)),
  };
};

const mapStateToProps = (state) => {
  return {
    loginData: state && state.loginReducer && state.loginReducer.loginData,
    cvLoading: state && state.cvReducer && state.cvReducer.cvLoader,
    cvEmployeeData: state && state.cvReducer && state.cvReducer.cvEmployeeData,
    cvCategoryData: state && state.cvReducer && state.cvReducer.cvCategoryData,
    cvSubCategoryData:
      state && state.cvReducer && state.cvReducer.cvSubCategoryData,
    cvSubCategoryError:
      state && state.cvReducer && state.cvReducer.cvSubCategoryError,
    cvChildData: state && state.cvReducer && state.cvReducer.cvChildData,
    cvClaimForData: state && state.cvReducer && state.cvReducer.cvClaimForData,
    cvInvestmentPlanData:
      state && state.cvReducer && state.cvReducer.cvInvestmentPlanData,
    cvWeddingDateData:
      state && state.cvReducer && state.cvReducer.cvWeddingDateData,
    cvTakeABreakData:
      state && state.cvReducer && state.cvReducer.cvTakeABreakData,
    cvSearchProjectData:
      state && state.cvReducer && state.cvReducer.cvSearchProjectData,
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateVoucher);

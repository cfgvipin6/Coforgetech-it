import React, { Component } from "react";
import {
  View,
  Text,
  ImageBackground,
  TouchableHighlight,
  FlatList,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
  Image,
  TextInput,
  RefreshControl,
  BackHandler,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  StyleSheet,
  LayoutAnimation,
  UIManager,
  Platform /* Added */,
  Alert,
} from "react-native";
import SlidingUpPanel from "rn-sliding-up-panel";
import { Card } from "react-native-elements";
import { SearchBar } from "react-native-elements";
import { globalFontStyle } from "../../components/globalFontStyle.js";
import { moderateScale, verticalScale } from "../../components/fontScaling.js";
import { fetchGETMethod, fetchPOSTMethod } from "../../utilities/fetchService";
import { netInfo } from "../../utilities/NetworkInfo";
import SubHeader from "../../GlobalComponent/SubHeader";
import style from "./style.js";
import properties from "../../resource/properties";
import UserMessage from "../../components/userMessage";
import CustomButton from "../../components/customButton";
import ActivityIndicatorView from "../../GlobalComponent/myActivityIndicator";
import DialogModal from "../../components/dialogBox";
let globalConstants = require("../../GlobalConstants");
let constant = require("./constants");
let appConfig = require("../../../appconfig");
const { height } = Dimensions.get("window");
import { connect } from "react-redux";
import { writeLog } from "../../utilities/logger";
import LinearGradient from "react-native-linear-gradient";
import images from "../../images.js";
import BoxContainer from "../../components/boxContainer.js/index.js";
import Seperator from "../../components/Seperator.js";
import { fetchVDHBalance } from "./utils.js";
class HomeScreen extends Component {
  constructor(props) {
    super(props);
    if (Platform.OS === "android") {
      /* Added */ UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    this.state = {
      loggedInDetails: this.props.loginData,
      userServiceType: this.props.navigation.state.params.serviceType,
      pendingRequest: [],
      voucherRequest: [],
      subLineItemData: [],
      showOtherExceptionModal: false,
      showErrorModal: false,
      showTokenErrorModal: false,
      showSessionErrorModal: false,
      showNoRRModal: false,
      noVoucherPresent: false,
      isIndicatorVisible: false,
      isRefreshing: false,
      error_msg: "",
      textLayoutHeight: 0 /* Added */,
      updatedHeight: 0,
      expand: false,
      active_index: -1,
      temp_index: -1,
      moretext: "more",
      showLogoutModal: false,
    };
    this.getPendingRequests = this.getPendingRequests.bind(this);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.performAction = this.performAction.bind(this);
    isVoucherService = false;
    isRRService = false;
    myPageTitle = this.props.navigation.state.params.pageTitle;
  }

  componentDidMount() {
    writeLog("Landed on " + "HomeScreen");
    const { navigation } = this.props;
    this.focusListener = navigation.addListener("didFocus", () => {
      this.getPendingRequests();
    });
    BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
    this.focusListener.remove();
  }

  handleBackButtonClick() {
    writeLog("Clicked on " + "handleBackButtonClick" + " of " + "HomeScreen");
    isRRService = false;
    isVoucherService = false;
    this.props.navigation.goBack(null);
    return true;
  }
  onRefresh() {
    this.setState({ isRefreshing: true }); // true isRefreshing flag for enable pull to refresh indicator
    // console.log("home pull refresh", this.state.isRefreshing)
    this.getPendingRequests(); // to fetch data again
  }
  async getPendingRequests() {
    let isNetwork = await netInfo();
    if (isNetwork) {
      try {
        // console.log("88888", this.state.isRefreshing)
        {
          this.state.isRefreshing == true
            ? null
            : this.setState({ isIndicatorVisible: true });
        }
        let getEmployeeId = this.state.loggedInDetails.SmCode;
        let authenticationKey = this.state.loggedInDetails.Authkey;
        let form = new FormData();
        form.append("ECSerp", getEmployeeId);
        form.append("AuthKey", authenticationKey);
        this.checkServiceType();
        if (isRRService) {
          let response = await fetchPOSTMethod(
            properties.pendingRequestPostURL,
            form
          );
          // console.log("properties.pendingRequestPostURL",properties.pendingRequestPostURL)
          // console.log("response from  RR pending request", response)
          if (
            response.hasOwnProperty("Exception") &&
            (response.StatusCode == 404 || response.StatusCode == 402)
          ) {
            this.setState(
              {
                isIndicatorVisible: false,
                isRefreshing: false,
              },
              () => {
                setTimeout(() => {
                  this.setState({
                    error_msg: response.Exception,
                    showSessionErrorModal: true,
                  });
                }, 1000);
              }
            );
          }
          // Session Expire
          else if (response.hasOwnProperty("Exception")) {
            this.setState(
              {
                isIndicatorVisible: false,
                isRefreshing: false,
              },
              () => {
                setTimeout(() => {
                  this.setState({
                    error_msg: response.Exception,
                    showOtherExceptionModal: true,
                  });
                }, 500);
              }
            );
          } else if (response.length > 0) {
            this.setState(
              {
                isRefreshing: false,
                isIndicatorVisible: false,
              },
              () => {
                setTimeout(() => {
                  this.setState({
                    pendingRequest: response,
                    responseList: response,
                  });
                }, 500);
              }
            );
          } else if (response == 0) {
            this.setState(
              {
                isRefreshing: false,
                isIndicatorVisible: false,
              },
              () => {
                setTimeout(() => {
                  this.setState({
                    showNoRRModal: true,
                  });
                }, 1000);
              }
            );
          }
          // not valid response
          else {
            this.setState(
              {
                isIndicatorVisible: false,
                isRefreshing: false,
              },
              () => {
                setTimeout(() => {
                  this.setState({
                    showErrorModal: true,
                  });
                }, 1000);
              }
            );
          }
        } else if (isVoucherService) {
          let localVoucher = [];
          let cashVoucher = [];
          let ukTravel = [];
          let ukExpense = [];
          let ukMileage = [];
          let usVoucher = [];
          // console.log("URL is :", properties.pendingVoucherPostURL)
          let response = await fetchPOSTMethod(
            properties.pendingVoucherPostURL,
            form
          );
          // console.log(cashVoucher.length,localVoucher.length,ukTravel.length,ukExpense.length,ukMileage.length,usVoucher.length)
          console.log("voucher response from server is :", response);
          if (response.length > 0) {
            let type = response.map((data) => {
              if (data.DocumentType == "CSH") {
                cashVoucher.push(data);
              } else if (data.DocumentType == "LCV") {
                localVoucher.push(data);
              } else if (data.DocumentType == "CNV") {
                ukTravel.push(data);
              } else if (data.DocumentType == "EXP") {
                ukExpense.push(data);
              } else if (data.DocumentType == "MLG") {
                ukMileage.push(data);
              } else if (
                data.DocumentType == "Relocation" ||
                data.DocumentType == "Travel" ||
                data.DocumentType == "Other"
              ) {
                usVoucher.push(data);
              }
              // console.log("User service type: ", this.state.userServiceType)
              return data.DocumentType;
              // alert(type)
            });
            // console.log("after",cashVoucher.length,localVoucher.length,ukTravel.length,ukExpense.length,ukMileage.length,usVoucher.length)
            if (
              this.state.userServiceType == "Cash Voucher Service" &&
              cashVoucher.length !== 0
            ) {
              // console.log("Cash Voucher Service", response)
              this.setState(
                {
                  isRefreshing: false,
                  isIndicatorVisible: false,
                },
                () => {
                  setTimeout(() => {
                    this.setState({
                      voucherRequest: cashVoucher,
                      voucherList: cashVoucher,
                    });
                  }, 500);
                }
              );
            } else if (
              this.state.userServiceType == "Local Voucher Service" &&
              localVoucher.length !== 0
            ) {
              // console.log("Local Voucher Service", response)
              this.setState(
                {
                  isRefreshing: false,
                  isIndicatorVisible: false,
                },
                () => {
                  setTimeout(() => {
                    this.setState({
                      voucherRequest: localVoucher,
                      voucherList: localVoucher,
                    });
                  }, 500);
                }
              );
            } else if (
              this.state.userServiceType == "UK_Travel" &&
              ukTravel.length !== 0
            ) {
              // console.log("UK_Travel", response)
              this.setState(
                {
                  isRefreshing: false,
                  isIndicatorVisible: false,
                },
                () => {
                  setTimeout(() => {
                    this.setState({
                      voucherRequest: ukTravel,
                      voucherList: ukTravel,
                    });
                  }, 500);
                }
              );
            } else if (
              this.state.userServiceType == "UK_Expense" &&
              ukExpense.length !== 0
            ) {
              // console.log("UK_Expense", response)
              this.setState(
                {
                  isRefreshing: false,
                  isIndicatorVisible: false,
                },
                () => {
                  setTimeout(() => {
                    this.setState({
                      voucherRequest: ukExpense,
                      voucherList: ukExpense,
                    });
                  }, 500);
                }
              );
            } else if (
              this.state.userServiceType == "UK_Mileage" &&
              ukMileage.length !== 0
            ) {
              // console.log("UK_Mileage", response)
              this.setState(
                {
                  isRefreshing: false,
                  isIndicatorVisible: false,
                },
                () => {
                  setTimeout(() => {
                    this.setState({
                      voucherRequest: ukMileage,
                      voucherList: ukMileage,
                    });
                  }, 500);
                }
              );
            } else if (
              this.state.userServiceType == "US_Expense" &&
              usVoucher.length !== 0
            ) {
              // console.log("US_Expense", response)
              this.setState(
                {
                  isRefreshing: false,
                  isIndicatorVisible: false,
                },
                () => {
                  setTimeout(() => {
                    this.setState({
                      voucherRequest: usVoucher,
                      voucherList: usVoucher,
                    });
                  }, 500);
                }
              );
            } else if (
              response[0].hasOwnProperty("Exception") &&
              (response[0].StatusCode == 402 || response[0].StatusCode == 404)
            ) {
              // Logout Errors
              this.setState(
                {
                  isIndicatorVisible: false,
                  isRefreshing: false,
                  error_msg: response[0].Exception,
                },
                () => {
                  setTimeout(() => {
                    this.setState({
                      showSessionErrorModal: true,
                    });
                  }, 500);
                }
              );
            } // Other Exception
            else if (response[0].hasOwnProperty("Exception")) {
              this.setState(
                {
                  isIndicatorVisible: false,
                  isRefreshing: false,
                  error_msg: response[0].Exception,
                },
                () => {
                  setTimeout(() => {
                    this.setState({
                      showOtherExceptionModal: true,
                    });
                  }, 1000);
                }
              );
            } else if (
              cashVoucher.length === 0 ||
              localVoucher.length === 0 ||
              ukTravel.length === 0 ||
              ukExpense.length === 0 ||
              ukMileage.length === 0 ||
              usVoucher.length === 0
            ) {
              // console.log("length zero", response)
              this.setState(
                {
                  voucherRequest: [],
                  voucherList: [],
                  isIndicatorVisible: false,
                  isRefreshing: false,
                },
                () => {
                  setTimeout(() => {
                    this.setState({
                      noVoucherPresent: true,
                    });
                  }, 500);
                }
              );
            }
          } else {
            // console.log("last error block", response)
            this.setState(
              {
                isRefreshing: false,
                isIndicatorVisible: false,
              },
              () => {
                setTimeout(() => {
                  this.setState({
                    showErrorModal: true,
                  });
                }, 1000);
              }
            );
          }
        }
      } catch (error) {
        // console.log("In side error :", error)
        this.setState(
          {
            isRefreshing: false,
            isIndicatorVisible: false,
          },
          () => {
            setTimeout(() => {
              this.setState({
                showErrorModal: true,
              });
            }, 1000);
          }
        );
      }
    } else {
      return alert(globalConstants.NO_INTERNET);
    }
  }

  async getRequesterList(item) {
    let isOnsite = item.OnsiteRR == "Y" ? true : false;
    let requestPosition = item.in_position;
    let resourceCategory = item.in_resource_cat;
    let requesterListArray = [];
    let vdhApprovalFLag = item.VDHApprvalFlag;
    if (
      !isOnsite &&
      requestPosition == 1 &&
      (resourceCategory == 1 || resourceCategory == 2 || resourceCategory == 3)
    ) {
      requesterListArray = ["Supervisor", "Finance Controller"];
    } else if (isOnsite && requestPosition == 1 && resourceCategory == 1) {
      requesterListArray = ["Supervisor", "Onsite RMG"];
    } else if (
      requestPosition == 2 &&
      resourceCategory == 1 &&
      vdhApprovalFLag == "N"
    ) {
      requesterListArray = ["Supervisor", "RDG"];
    } else if (
      requestPosition == 2 &&
      resourceCategory == 1 &&
      vdhApprovalFLag == "Y"
    ) {
      requesterListArray = ["Supervisor", "VDH"];
    } else if (
      requestPosition == 2 &&
      (resourceCategory == 2 || resourceCategory == 3)
    ) {
      requesterListArray = ["Supervisor", "Finance Controller"];
    } else if (requestPosition == 3 && resourceCategory == 4) {
      requesterListArray = ["Supervisor", "Finance Controller"];
    } else if (
      ((requestPosition == 1 || requestPosition == 2 || requestPosition == 3) &&
        resourceCategory == 1) ||
      resourceCategory == 2 ||
      resourceCategory == 3
    ) {
      requesterListArray = ["Supervisor", "Finance Controller"];
    }
    this.setState({
      requesterListArray,
    });
  }

  updateSearch = (searchText) => {
    this.setState(
      {
        query: searchText,
      },
      () => {
        if (isRRService) {
          const filteredData = this.state.responseList.filter((element) => {
            let str1 = element.vc_name;
            let str2 = element.in_requestid;
            let toBeSearched = str1.concat(str2);
            let elementSearched = toBeSearched.toString().toLowerCase();
            let queryLowerCase = this.state.query.toString().toLowerCase();
            return elementSearched.indexOf(queryLowerCase) > -1;
          });
          this.setState({ pendingRequest: filteredData });
        } else if (isVoucherService) {
          const filteredData = this.state.voucherList.filter((element) => {
            let str1 = element.DocumentNo;
            let str2 = element.EmpCode.trim();
            let str3 = element.EmpName.trim();
            let toBESearched = str1.concat(str2).concat(str3);
            let elementSearched = toBESearched.toString().toLowerCase();
            let queryLowerCase = this.state.query.toString().toLowerCase();
            return elementSearched.indexOf(queryLowerCase) > -1;
          });
          this.setState({
            voucherRequest: filteredData,
          });
        }
      }
    );
  };

  performAction(item) {
    // console.log("pressed", item)
  }
  successCallBack = (item, response) => {
    console.log("Service Response : ", response);
    this.setState({ isIndicatorVisible: false }, async () => {
      this.props.navigation.navigate("VoucherDetail", {
        voucherInfo: item,
        loggedInDetails: this.state.loggedInDetails,
        pageTitle: myPageTitle,
        TotalBudget: response[0].TotalBudget,
        ConsumedBudget: response[0].ConsumedBudget,
        Quarter: response[0].Quarter,
        RemainingBudget: response[0].RemainingBudget,
        BU: response[0].BU,
      });
    });
  };
  voucherDetail = async (item) => {
    writeLog("Clicked on " + "voucherDetail" + " of " + "HomeScreen");
    this.setState({ isIndicatorVisible: true }, async () => {
      await fetchVDHBalance(item, this.successCallBack);
    });
  };

  requestAction(action, item) {
    this.props.navigation.navigate("SupervisorSelection", {
      employeeDetails: item,
      action: action,
      loggedInDetails: this.state.loggedInDetails,
      pageTitle: myPageTitle,
    });
  }

  checkServiceType() {
    writeLog(
      "Invoked " +
        "checkServiceType" +
        " of " +
        "HomeScreen" +
        " & service type is " +
        this.state.userServiceType
    );
    // console.log("User service type : ", this.state.userServiceType)
    if (
      this.state.userServiceType != "" &&
      this.state.userServiceType != null &&
      this.state.userServiceType != undefined &&
      this.state.userServiceType != " "
    ) {
      if (this.state.userServiceType == "RR Service") {
        isRRService = true;
      } else if (
        this.state.userServiceType == "Local Voucher Service" ||
        this.state.userServiceType == "Cash Voucher Service" ||
        this.state.userServiceType == "UK_Travel" ||
        this.state.userServiceType == "UK_Expense" ||
        this.state.userServiceType == "UK_Mileage" ||
        this.state.userServiceType == "US_Expense"
      ) {
        isVoucherService = true;
      }
    }
  }

  renderVoucherSubView(item) {
    let projectFlag = false;
    let projectValue = "";
    let remarksFlag = false;
    let remarksValue = "";
    let date = item.DocumentDate.replace(/-/g, " ");

    if (
      item.ProjectDesc != "" &&
      item.ProjectDesc != null &&
      item.ProjectDesc != undefined
    ) {
      projectValue =
        item.ProjectDesc === "NA"
          ? "NA"
          : item.ProjectCode.trim() + " : " + item.ProjectDesc.trim();
      projectFlag = true;
    }

    if (
      item.Remarks != "" &&
      item.Remarks != null &&
      item.Remarks != undefined
    ) {
      remarksValue = item.Remarks.trim();
      remarksFlag = true;
    }

    return (
      <View>
        <View style={{ flexDirection: "row" }}>
          <Text
            style={[
              globalFontStyle.imageBackgroundLayout,
              style.displayItemsTextOne,
            ]}
          >
            {"Company Code"}
          </Text>
          <Text
            style={[
              globalFontStyle.imageBackgroundLayout,
              style.displayItemsTextTwo,
            ]}
          >
            {item.CompanyCode.trim() + " : " + item.CompanyName.trim()}
          </Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text
            style={[
              globalFontStyle.imageBackgroundLayout,
              style.displayItemsTextOne,
            ]}
          >
            {"Cost Center"}
          </Text>
          <Text
            style={[
              globalFontStyle.imageBackgroundLayout,
              style.displayItemsTextTwo,
            ]}
          >
            {item.CostCenterCode.trim() + " : " + item.CostCenterDesc.trim()}
          </Text>
        </View>
        {projectFlag ? (
          <View style={{ flexDirection: "row" }}>
            <Text
              style={[
                globalFontStyle.imageBackgroundLayout,
                style.displayItemsTextOne,
              ]}
            >
              {"Project"}
            </Text>
            <Text
              style={[
                globalFontStyle.imageBackgroundLayout,
                style.displayItemsTextTwo,
              ]}
            >
              {projectValue}
            </Text>
          </View>
        ) : null}
        {remarksFlag ? (
          <View style={{ flexDirection: "row" }}>
            <Text
              style={[
                globalFontStyle.imageBackgroundLayout,
                style.displayItemsTextOne,
              ]}
            >
              {"Remarks"}
            </Text>
            <Text
              style={[
                globalFontStyle.imageBackgroundLayout,
                style.displayItemsTextTwo,
              ]}
            >
              {remarksValue}
            </Text>
          </View>
        ) : null}
        <View style={{ flexDirection: "row" }}>
          <Text
            style={[
              globalFontStyle.imageBackgroundLayout,
              style.displayItemsTextOne,
            ]}
          >
            {"Document Date"}
          </Text>
          <Text
            style={[
              globalFontStyle.imageBackgroundLayout,
              style.displayItemsTextTwo,
            ]}
          >
            {date}
          </Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text
            style={[
              globalFontStyle.imageBackgroundLayout,
              style.displayItemsTextOne,
            ]}
          >
            {"Voucher Type"}
          </Text>
          <Text
            style={[
              globalFontStyle.imageBackgroundLayout,
              style.displayItemsTextTwo,
            ]}
          >
            {item.VoucherType}
          </Text>
        </View>
      </View>
    );
  }

  renderSubView(item) {
    // alert(JSON.stringify(item))
    let roleFlag = false;
    let roleValue = "";
    let customerflag = false;
    let customerValue = "";
    let geographyValue = "India";

    if (item.Role != null && item.Role != undefined && item.Role != "") {
      let roleSeparate = item.Role.split(":");
      let roleSeparated = roleSeparate[1].split("~");
      roleValue = roleSeparated[0].trim();
      roleFlag = true;
    }

    if (item.Client != null && item.Client != undefined && item.Client != "") {
      let customerSeparate = item.Client.split(":");
      customerValue = customerSeparate[0].trim();
      customerflag = true;
    }

    if (
      item.Geography != null &&
      item.Geography != "" &&
      item.Geography != undefined &&
      item.Geography != " "
    ) {
      geographyValue = item.Geography;
    }

    // for position

    if (item.in_position == 1) {
      resourceCategory = "New";
    } else if (item.in_position == 2) {
      resourceCategory = "Replacement";
    } else {
      resourceCategory = "Extension";
    }

    // for category
    if (item.in_resource_cat == 1) {
      requestPosition = "Direct";
    } else if (item.in_resource_cat == 2) {
      requestPosition = "Indirect";
    } else if (item.in_resource_cat == 3) {
      requestPosition = "Sales";
    } else {
      requestPosition = "Contractor";
    }
    return (
      <View>
        <View style={{ flexDirection: "row" }}>
          {roleFlag ? (
            <Text
              style={[
                globalFontStyle.imageBackgroundLayout,
                style.displayItemsTextOne,
              ]}
            >
              {constant.ROLE}{" "}
            </Text>
          ) : null}
          {roleFlag ? (
            <Text
              style={[
                globalFontStyle.imageBackgroundLayout,
                style.displayItemsTextTwo,
              ]}
            >
              {roleValue}
            </Text>
          ) : null}
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text
            style={[
              globalFontStyle.imageBackgroundLayout,
              style.displayItemsTextOne,
            ]}
          >
            {constant.POSITION}
          </Text>
          <Text
            style={[
              globalFontStyle.imageBackgroundLayout,
              style.displayItemsTextTwo,
            ]}
          >
            {resourceCategory + "(" + requestPosition + ")"}
          </Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text
            style={[
              globalFontStyle.imageBackgroundLayout,
              style.displayItemsTextOne,
            ]}
          >
            {constant.GEOGRAPHY}
          </Text>
          <Text
            style={[
              globalFontStyle.imageBackgroundLayout,
              style.displayItemsTextTwo,
            ]}
          >
            {geographyValue}
          </Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text
            style={[
              globalFontStyle.imageBackgroundLayout,
              style.displayItemsTextOne,
            ]}
          >
            {constant.PROJECT_DESC}
          </Text>
          <Text
            style={[
              globalFontStyle.imageBackgroundLayout,
              style.displayItemsTextTwo,
            ]}
          >
            {item.vc_projectdesc}
          </Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text
            style={[
              globalFontStyle.imageBackgroundLayout,
              style.displayItemsTextOne,
            ]}
          >
            {constant.NO_RESOURCE}
          </Text>
          <Text
            style={[
              globalFontStyle.imageBackgroundLayout,
              style.displayItemsTextTwo,
            ]}
          >
            {item.in_number}
          </Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          {customerflag ? (
            <Text
              style={[
                globalFontStyle.imageBackgroundLayout,
                style.displayItemsTextOne,
              ]}
            >
              {constant.CUSTOMER}
            </Text>
          ) : null}
          {customerflag ? (
            <Text
              style={[
                globalFontStyle.imageBackgroundLayout,
                style.displayItemsTextTwo,
              ]}
            >
              {customerValue}
            </Text>
          ) : null}
        </View>
      </View>
    );
  }

  showDialogBox() {
    if (this.state.showErrorModal) {
      let errorMessage = constant.SLOW_RESPONSE;
      return (
        <UserMessage
          heading={"Sorry"}
          message={errorMessage}
          okAction={() => {
            this.setState({ showErrorModal: false });
            this.backNavigate();
          }}
        />
      );
    } else if (this.state.noVoucherPresent) {
      let errorMessage = constant.NO_VOUCHER_ERROR_MODAL_TEXT;
      return (
        <UserMessage
          heading={"Pending Info"}
          message={errorMessage}
          okAction={() => {
            this.setState({ noVoucherPresent: false });
            this.backNavigate();
          }}
        />
      );
    } else if (this.state.showNoRRModal) {
      let errorMessage = constant.NO_RR_ERROR_MODAL_TEXT;
      return (
        <UserMessage
          heading={"Pending Info"}
          message={errorMessage}
          okAction={() => {
            this.setState({ showNoRRModal: false });
            this.backNavigate();
          }}
        />
      );
    } else if (this.state.showTokenErrorModal) {
      let errorMessage = this.state.error_msg;
      return (
        <UserMessage
          heading={"Access Denied"}
          message={errorMessage}
          okAction={() => {
            this.setState({ showTokenErrorModal: false });
            this.handleLogoutConfirm();
          }}
        />
      );
    } else if (this.state.showSessionErrorModal) {
      let errorMessage = this.state.error_msg;
      return (
        <UserMessage
          heading={"Access Denied"}
          message={errorMessage}
          okAction={() => {
            this.setState({ showSessionErrorModal: false });
            this.handleLogoutConfirm();
          }}
        />
      );
    } else if (this.state.showOtherExceptionModal) {
      let errorMessage = this.state.error_msg;
      return (
        <UserMessage
          heading={"Pending Info"}
          message={errorMessage}
          okAction={() => {
            this.setState({ showOtherExceptionModal: false });
            this.backNavigate();
          }}
        />
      );
    }
  }

  backNavigate() {
    writeLog("Clicked on " + "backNavigate" + " of " + "HomeScreen");
    this.props.navigation.pop();
    isRRService = false;
    isVoucherService = false;
  }

  renderVoucherRequest(item, index) {
    return (
      <BoxContainer>
        <View style={{ flexDirection: "row" }}>
          <Text
            style={[
              globalFontStyle.imageBackgroundLayout,
              style.displayItemsTextOne,
            ]}
          >
            {"Document#"}{" "}
          </Text>
          <Text
            style={[
              globalFontStyle.imageBackgroundLayout,
              style.displayItemsTextTwo,
            ]}
          >
            {item.DocumentNo.trim()}{" "}
          </Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text
            style={[
              globalFontStyle.imageBackgroundLayout,
              style.displayItemsTextOne,
            ]}
          >
            {"Employee"}{" "}
          </Text>
          <Text
            style={[
              globalFontStyle.imageBackgroundLayout,
              style.displayItemsTextTwo,
            ]}
          >
            {item.EmpCode.trim() + " : " + item.EmpName.trim()}{" "}
          </Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text
            style={[
              globalFontStyle.imageBackgroundLayout,
              style.displayItemsTextOne,
            ]}
          >
            {"Total Amount"}{" "}
          </Text>
          <Text
            style={[
              globalFontStyle.imageBackgroundLayout,
              style.displayItemsTextTwo,
            ]}
          >
            {parseFloat(item.TotalAmount).toFixed(2)}
          </Text>
        </View>

        <View>
          {this.state.active_index === index ? (
            this.renderVoucherSubView(item)
          ) : (
            <View />
          )}
        </View>
        <Seperator />
        <View style={style.bottomButtonContainer}>
          {this.state.active_index === index ? (
            <TouchableOpacity
              onPress={() => this.expand_collapse_Function(index)}
              style={{ alignItems: "center" }}
            >
              <Image source={images.lessButton} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => this.expand_collapse_Function(index)}
              style={{ alignItems: "center" }}
            >
              <Image source={images.moreButton} />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={() => this.openNewPanel(item.DocumentNo.trim())}
            style={{ alignItems: "center" }}
          >
            <Image source={images.historyButton} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => this.voucherDetail(item)}
            style={{ alignItems: "center" }}
          >
            <Image source={images.proceedButton} />
          </TouchableOpacity>
        </View>
      </BoxContainer>
    );
  }

  renderPendingRequest(item, index) {
    return (
      <BoxContainer>
        <View style={{ flexDirection: "row" }}>
          <Text
            style={[
              globalFontStyle.imageBackgroundLayout,
              style.displayItemsTextTwo,
            ]}
          >
            {"Req#"}{" "}
          </Text>
          <Text
            style={[
              globalFontStyle.imageBackgroundLayout,
              style.displayItemsTextTwo,
            ]}
          >
            {item.in_requestid}{" "}
          </Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text
            style={[
              globalFontStyle.imageBackgroundLayout,
              style.displayItemsTextTwo,
            ]}
          >
            {constant.REQUESTER_NAME}{" "}
          </Text>
          <Text
            style={[
              globalFontStyle.imageBackgroundLayout,
              style.displayItemsTextTwo,
            ]}
          >
            {item.vc_name}{" "}
          </Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text
            style={[
              globalFontStyle.imageBackgroundLayout,
              style.displayItemsTextTwo,
            ]}
          >
            {constant.PENDING_SINCE}{" "}
          </Text>
          <Text
            style={[
              globalFontStyle.imageBackgroundLayout,
              style.displayItemsTextTwo,
            ]}
          >
            {item.dt_updated}
          </Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text
            style={[
              globalFontStyle.imageBackgroundLayout,
              style.displayItemsTextTwo,
            ]}
          >
            {"Pending As"}{" "}
          </Text>
          <Text
            style={[
              globalFontStyle.imageBackgroundLayout,
              style.displayItemsTextTwo,
            ]}
          >
            {item.vc_status}{" "}
          </Text>
        </View>
        {this.state.active_index === index ? (
          this.renderSubView(item)
        ) : (
          <View />
        )}
        <Seperator />
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-around",
            marginTop: 5,
          }}
        >
          {this.state.active_index === index ? (
            <TouchableOpacity
              onPress={() => this.expand_collapse_Function(index)}
              style={{ alignItems: "center" }}
            >
              <Image source={images.lessButton} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => this.expand_collapse_Function(index)}
              style={{ alignItems: "center" }}
            >
              <Image source={images.moreButton} />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={() => this.openNewPanel(item.in_requestid)}
            style={{ alignItems: "center" }}
          >
            <Image source={images.historyButton} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => this.requestAction("Approved", item)}
            style={{ alignItems: "center" }}
          >
            <Image source={images.approveButton} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => this.requestAction("Rejected", item)}
            style={{ alignItems: "center" }}
          >
            <Image source={images.rejectButton} />
          </TouchableOpacity>
        </View>
      </BoxContainer>
    );
  }

  renderListView(item, parameter) {
    let dataToDisplay = null;
    if (parameter == "requesterOptionList") {
      dataToDisplay = item.item;
    } else if (parameter == "supervisorList") {
      dataToDisplay = item.item.Code;
    }
    return (
      <View
        style={{
          backgroundColor: "white",
          width: "100%",
          height: moderateScale(40),
          justifyContent: "center",
          borderRadius: moderateScale(5),
        }}
      >
        <TouchableOpacity
          onPress={() => this.getData(item, parameter)}
          style={{ paddingLeft: 10, justifyContent: "center" }}
        >
          <Text>{dataToDisplay}</Text>
        </TouchableOpacity>
      </View>
    );
  }
  renderList(parameter) {
    let data = [];
    if (parameter == "requesterOptionList") {
      data = this.state.requesterListArray;
    } else if (parameter == "supervisorList") {
      data = this.state.supervisorList;
    }
    return (
      <View
        style={{
          width: "90%",
          borderWidth: moderateScale(1),
          borderColor: appConfig.LIST_BORDER_COLOUR,
          overflow: "hidden",
          borderRadius: moderateScale(5),
        }}
      >
        <FlatList
          contentContainerStyle={{ flex: 0, width: "100%" }}
          data={data}
          extraData={this.state}
          renderItem={(item) => this.renderListView(item, parameter)}
          ItemSeparatorComponent={() => (
            <Image
              source={require("../../assets/divHorizontal.png")}
              style={{
                tintColor: appConfig.BORDER_GREY_COLOR,
                height: moderateScale(1),
                width: "100%",
              }}
            />
          )}
        />
      </View>
    );
  }
  renderRequesterOptionList() {
    if (this.state.requesterOptionList) {
      return this.renderList("requesterOptionList");
    }
  }
  displaySelectedRequesterField() {
    if (
      this.state.displaySelectedRequester &&
      this.state.selectedRequester &&
      this.state.selectedRequester.Code
    ) {
      return (
        <TouchableOpacity
          onPress={() =>
            this.setState({
              displaySupervisorList: !this.state.displaySupervisorList,
            })
          }
          style={{
            marginTop: 5,
            borderWidth: 1,
            borderColor: appConfig.LIST_BORDER_COLOUR,
            borderRadius: moderateScale(5),
            height: moderateScale(40),
            width: "90%",
            justifyContent: "center",
            paddingLeft: 10,
          }}
        >
          <Text>{this.state.selectedRequester.Code}</Text>
        </TouchableOpacity>
      );
    }
  }
  renderRequesterList() {
    if (
      this.state.displaySupervisorList &&
      this.state.supervisorList &&
      this.state.supervisorList.length > 0
    ) {
      return (
        <View style={{ height: "70%", marginTop: 5 }}>
          {this.renderList("supervisorList")}
        </View>
      );
    }
  }
  renderApprovalRejectDialogBox() {
    if (this.state.displayApprovalRejectDialogBox) {
      let label =
        this.state.selectedRequesterOption == null
          ? "select"
          : this.state.selectedRequesterOption;
      return (
        <Modal
          visible={this.state.displayApprovalRejectDialogBox}
          onRequestClose={() =>
            this.setState({ displayApprovalRejectDialogBox: false })
          }
        >
          <KeyboardAvoidingView />
        </Modal>
      );
    }
  }

  showRequests() {
    let data = "";
    if (isRRService) {
      data = this.state.pendingRequest;
      // console.log("RR request to approve is", data)
      if (data.length > 0) {
        return (
          <View style={globalFontStyle.listContentViewGlobal}>
            <FlatList
              contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
              data={data}
              showsVerticalScrollIndicator={false}
              renderItem={({ item, index }) =>
                this.renderPendingRequest(item, index)
              }
              keyExtractor={(item, index) =>
                "pendingRequest_" + index.toString()
              }
              ItemSeparatorComponent={() => (
                <View style={globalFontStyle.listContentSeparatorGlobal} />
              )}
              refreshControl={
                <RefreshControl
                  onRefresh={this.onRefresh.bind(this)}
                  refreshing={this.state.isRefreshing}
                />
              }
            />
          </View>
        );
      } else {
        return null;
      }
    } else if (isVoucherService) {
      data = this.state.voucherRequest;
      if (data.length > 0) {
        return (
          <View style={globalFontStyle.listContentViewGlobal}>
            <FlatList
              contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
              data={data}
              showsVerticalScrollIndicator={false}
              renderItem={({ item, index }) =>
                this.renderVoucherRequest(item, index)
              }
              keyExtractor={(item, index) =>
                "VoucherRequest_" + index.toString()
              }
              ItemSeparatorComponent={() => (
                <View style={globalFontStyle.listContentSeparatorGlobal} />
              )}
              refreshControl={
                <RefreshControl
                  onRefresh={this.onRefresh.bind(this)}
                  refreshing={this.state.isRefreshing}
                />
              }
            />
          </View>
        );
      } else {
        return null;
      }
    }
  }

  handleLogout() {
    this.setState({
      showLogoutModal: true,
    });
  }

  handleLogoutConfirm() {
    writeLog("Invoked " + "handleLogoutConfirm" + " of " + "HomeScreen");
    this.setState({
      showLogoutModal: false,
    });
    this.props.navigation.navigate("Login");
  }

  showLogoutDialog() {
    if (this.state.showLogoutModal) {
      let headerTitleMsg = constant.LOGOUT_TEXT;
      return (
        <DialogModal
          isVisible={this.state.showLogoutModal}
          headerText="Confirm Logout"
          messageText={
            <Text style={{ textAlign: "center", fontSize: 18 }}>
              {headerTitleMsg}
            </Text>
          }
          cancelButtonText={"CANCEL"}
          handleCancel={() => this.setState({ showLogoutModal: false })}
          confirmButtonText={"OK"}
          handleConfirm={() => this.handleLogoutConfirm()}
        />
      );
    }
  }
  handleBack() {
    writeLog("Clicked on " + "handleBack" + " of " + "HomeScreen");
    isRRService = false;
    isVoucherService = false;
    this.props.navigation.pop();
  }

  async getHistoryData(docNumber) {
    writeLog("Invoked " + "getHistoryData" + " of " + "HomeScreen");
    let isNetwork = await netInfo();
    if (isNetwork) {
      // console.log("docNumber", docNumber)
      {
        this.state.isRefreshing == true
          ? null
          : this.setState({ isIndicatorVisible: true });
      }
      let getEmployeeId = this.state.loggedInDetails.SmCode;
      let authenticationKey = this.state.loggedInDetails.Authkey;
      let form = new FormData();
      form.append("ECSerp", getEmployeeId);
      form.append("AuthKey", authenticationKey);
      let myResponse;
      if (isVoucherService) {
        form.append("DocumentNo", docNumber);
        myResponse = await fetchPOSTMethod(properties.voucherHistoryUrl, form);
      } else if (isRRService) {
        form.append("RequestID", docNumber);
        myResponse = await fetchPOSTMethod(properties.RRHistoryUrl, form);
      }
      let response = myResponse[0];
      // console.log("==============", myResponse)
      if (myResponse.length != undefined && myResponse.length != 0) {
        if (
          response.hasOwnProperty("Exception") &&
          (response.StatusCode == 402 || response.StatusCode == 404)
        ) {
          this.setState(
            {
              isIndicatorVisible: false,
              isRefreshing: false,
              error_msg: response.Exception,
            },
            () => {
              setTimeout(() => {
                this.setState({
                  showSessionErrorModal: true,
                });
              }, 500);
              this._panel.hide();
            }
          );
        } else if (response.hasOwnProperty("Exception")) {
          // console.log("Other Exception")
          this.setState(
            {
              isIndicatorVisible: false,
              isRefreshing: false,
              error_msg: response.Exception,
            },
            () => {
              setTimeout(() => {
                this.setState({
                  showOtherExceptionModal: true,
                });
              }, 500);
              this._panel.hide();
            }
          );
        } else {
          this.setState(
            {
              isIndicatorVisible: false,
              isRefreshing: false,
            },
            () => {
              setTimeout(() => {
                this.setState({
                  subLineItemData: myResponse,
                });
              }, 500);
            }
          );
        }
      } else {
        this.setState(
          {
            isIndicatorVisible: false,
            isRefreshing: false,
          },
          () => {
            Alert.alert(
              "Info",
              globalConstants.NO_DATA_FROM_SERVER,
              [
                {
                  text: "OK",
                  onPress: () =>
                    setTimeout(() => {
                      this._panel.hide();
                    }, 1000),
                },
              ],
              { cancelable: false }
            );
          }
        );
      }
    } else {
      this.setState(
        {
          isIndicatorVisible: false,
          isRefreshing: false,
        },
        () => {
          Alert.alert(
            "Info",
            globalConstants.NO_INTERNET,
            [
              {
                text: "OK",
                onPress: () =>
                  setTimeout(() => {
                    this._panel.hide();
                  }, 1000),
              },
            ],
            { cancelable: false }
          );
        }
      );
    }
  }

  openNewPanel = (docNumber) => {
    this._panel.show(height / 1.3);
    this.getHistoryData(docNumber);
  };

  renderPanelData = (record) => {
    let keys = [];
    for (let key in record) {
      keys.push(key);
    }
    return keys.map((key) => {
      if (record[key].IsActive) {
        return (
          <View style={style.cardInnerView}>
            <Text style={globalFontStyle.cardLeftText}>{record[key].Key}</Text>
            <Text style={globalFontStyle.cardRightText}>
              {record[key].Value === "" ? "-" : record[key].Value}
            </Text>
          </View>
        );
      }
    });
  };

  renderHistory = (subLineItem) => {
    return subLineItem.map((record, index) => {
      let myIndex = index + 1;
      return (
        <View style={style.panelContainer}>
          <View
            style={{
              flexDirection: "row",
              alignSelf: "center",
              borderColor: "light-grey",
              borderBottomWidth: 0.25,
              width: "96%",
              paddingVertical: 5,
              marginLeft: 5,
              zIndex: 10,
              borderBottomColor: "light-grey",
            }}
          >
            <Image source={images.rightCircleArrow} />
            <Text style={{ color: appConfig.BLUISH_COLOR, marginLeft: 10 }}>
              {globalConstants.HISTORY_RECORD_HEADING_TEXT + myIndex}
            </Text>
          </View>
          <View style={{ marginVertical: 10 }}>
            {this.renderPanelData(record)}
          </View>
        </View>
      );
    });
  };

  renderHistoryView = () => {
    return (
      <SlidingUpPanel
        ref={(c) => (this._panel = c)}
        draggableRange={{ top: height / 1.3, bottom: 0 }}
        height={height}
        onMomentumDragStart={(height) => {
          height;
        }} //height of panel here : height/1.3
        onMomentumDragEnd={0}
      >
        {(dragHandler) => (
          <View style={style.panelNewContainer}>
            <View style={style.dragHandler} {...dragHandler}>
              <TouchableOpacity
                style={{ marginTop: 10 }}
                onPress={() => this._panel.hide()}
              >
                <Image source={images.crossButton} />
              </TouchableOpacity>
            </View>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              style={{ flex: 1, marginBottom: height - height / 1.3 }}
            >
              <View style={{ marginBottom: 10 }}>
                {this.renderHistory(this.state.subLineItemData)}
              </View>
            </ScrollView>
          </View>
        )}
      </SlidingUpPanel>
    );
  };

  render() {
    const { query } = this.state;
    return (
      <ImageBackground style={{ flex: 1 }} source={images.loginBackground}>
        <View style={style.container}>
          {/* <View style={{ paddingVertical: moderateScale(12) }}>   */}
          <View style={globalFontStyle.subHeaderViewGlobal}>
            <SubHeader
              pageTitle={myPageTitle}
              backVisible={true}
              logoutVisible={true}
              handleBackPress={() => this.handleBack()}
              navigation={this.props.navigation}
            />
          </View>
          <View style={globalFontStyle.searchViewGlobal}>
            <SearchBar
              lightTheme
              raised={true}
              style={{ backgroundColor: "red" }}
              placeholder={"Search by document number"}
              onChangeText={this.updateSearch}
              value={query}
              containerStyle={globalFontStyle.searchGlobal}
              autoCapitalize="none"
              autoCompleteType="off"
              autoCorrect={false}
            />
          </View>

          <View style={globalFontStyle.contentViewGlobal}>
            {this.showRequests()}
          </View>
          {this.showDialogBox()}
          {this.showLogoutDialog()}
          <ActivityIndicatorView loader={this.state.isIndicatorVisible} />
          {this.renderHistoryView()}
          {/* </View> */}
        </View>
      </ImageBackground>
    );
  }

  /* Added */
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
}
const mapStateToProps = (state) => {
  return {
    loginData: state.loginReducer.loginData,
  };
};
export default connect(
  mapStateToProps,
  null
)(HomeScreen);

import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
// import { Dimensions } from "react-native";
import LoginScreen from "./src/scenes/login";
import HomeScreen from "./src/scenes/home";
import SupervisorSelectionScreen from "./src/scenes/supervisorSelection";
import TokenScreen from "./src/scenes/token";
import DashBoardScreen from "./src/scenes/Dashboard";
import HRAssist from "./src/scenes/hrassist";
import MyInfoScreen from "./src/scenes/MyInfo";
import VoucherDetailScreen from "./src/scenes/voucherDetails";
import TravelScreen from "./src/scenes/travel";
import TravelActionScreen from "./src/scenes/travel/TravelActionScreen";
import VisaScreen from "./src/scenes/visa";
import VisaApproveRejectScreen from "./src/scenes/visa/visaApproveReject";
import VisitingCardScreen from "./src/scenes/visitingCard";
import VisitingApproveRejectScreen from "./src/scenes/visitingCard/visitingApproveReject";
import ECRPScreen from "./src/scenes/ecrp";
import ECRPApproveReject from "./src/scenes/ecrp/ecrpApproveReject";
import ECRPLetter from "./src/scenes/ecrp/ecrpLetter";
import CDSScreen from "./src/scenes/cds";
import CDSDetails from "./src/scenes/cds/cdsDetails";
import CDSApproveReject from "./src/scenes/cds/cdsApproveReject";
import ExitScreen from "./src/scenes/eExit";
import ExitDetails from "./src/scenes/eExit/exitDetails";
import ExitApproveReject from "./src/scenes/eExit/exitApproveReject";
import AddressScreen from "./src/scenes/address";
import GratuityScreen from "./src/scenes/gratuity/index";
import CommunicationScreen from "./src/scenes/communication/index";
import FamilyScreen from "./src/scenes/family";
import HolidayScreen from "./src/scenes/holiday";
import LeaveScreen from "./src/scenes/leaves/index";
import LeaveActionsScreen from "./src/scenes/leaves/LeaveActionsScreen";
import MyWebView from "./src/scenes/Web/MyWebView";
import AttendanceScreen from "./src/scenes/attendance/AttendanceScreen";
import createLeave from "./src/scenes/createLeave";
import AuthScreen from "./src/scenes/auth/AuthScreen";
import AdLoginScreen from "./src/scenes/login/AdLogin";
import TravelAdvanceScreen from "./src/scenes/travelAdvance";
import TravelAdvanceApproveRejectScreen from "./src/scenes/travelAdvance/travelAdvanceApproveReject";
import EESScreen from "./src/scenes/EES";
import EESQuestionScreen from "./src/scenes/EES/eesQuestionScreen";
import PendingRequestScreen from "./src/scenes/ISD/pendingRequest";
import ITPendingDetails from "./src/scenes/ISD/pendingRequest/pendingRequestDetails";
import ITDeskDashboard from "./src/scenes/ISD/ITDeskDashboard";
import CreateRequestScreen from "./src/scenes/ISD/createRequest";
import MyRequestScreen from "./src/scenes/ISD/myRequest/MyRequestScreen";
import VoucherDashBoard from "./src/scenes/Voucher/VoucherDashBoard";
import CreateVoucher from "./src/scenes/Voucher/createVoucher/index";
import CreateVoucher2 from "./src/scenes/Voucher/createVoucher/CreateVoucher_2";
import MyVoucherScreen from "./src/scenes/Voucher/MyVoucher/MyVoucherScreen";
import CreateGenericVouchers from "./src/scenes/Voucher/createGenericVoucher/index";
import CreateLtaVoucher from "./src/scenes/Voucher/LTAVoucher/index";
import CreateUSVoucherScreen from "./src/scenes/Voucher/USVoucher";
import SchemeAndPolicyScreen from "./src/scenes/schemeAndPolicy/index";
// import { SideMenu } from "./src/components/SideMenu";
import SchemsDetails from "./src/scenes/schemeAndPolicy/SchemsDetails";
import schemePDFView from "./src/scenes/schemeAndPolicy/schemePDFView";
import TimesheetDashboardScreen from "./src/scenes/timesheet/timesheetDashboard";
import MyTimesheetScreen4 from "./src/scenes/timesheet/myTimesheet/index4";
import MyTimesheetScreen5 from "./src/scenes/timesheet/myTimesheet/index5";
import covidScreen from "./src/scenes/covid/index";
import covidWebScreen from "./src/scenes/covid/webViewCovid";
import covidVerifyOTPScreen from "./src/scenes/covid/verifyOTP";
import { TimeSheetApprovals } from "./src/scenes/timesheet/timesheetDashboard/timesheetApprovals";
import LoginScreen2 from "./src/scenes/login/LoginScreen2";
import DashboardNew2 from "./src/scenes/Dashboard/DashboardNew2";
import IdCardScreen from "./src/scenes/IDCard/IdCardScreen";
import SurveyITDesk from "./src/scenes/ISD/Survey";
import HrassistMyrequest from "./src/scenes/hrassist/hrassistmyrequest";
import HRAssistCreate from "./src/scenes/hrassist/hrassistcreate";

const LeaveStack = createStackNavigator({
  Leave: {
    screen: LeaveScreen,
    navigationOptions: {
      header: null,
    },
  },
  LeaveAction: {
    screen: LeaveActionsScreen,
    navigationOptions: {
      header: null,
    },
  },
});
const AppNavigator = createStackNavigator(
  {
    Auth: {
      screen: AuthScreen,
      navigationOptions: {
        header: null,
      },
    },
    Login: {
      screen: LoginScreen,
      navigationOptions: {
        header: null,
      },
    },
    Login2: {
      screen: LoginScreen2,
      navigationOptions: {
        header: null,
      },
    },
    AdLogin: {
      screen: AdLoginScreen,
      navigationOptions: {
        header: null,
      },
    },
    DashBoardNew2: {
      screen: DashboardNew2,
      navigationOptions: {
        header: null,
      },
    },
    Attendance: {
      screen: AttendanceScreen,
      navigationOptions: {
        header: null,
      },
    },
    Home: {
      screen: HomeScreen,
      navigationOptions: {
        header: null,
      },
    },
    MyInfo: {
      screen: MyInfoScreen,
      navigationOptions: {
        header: null,
      },
    },
    SupervisorSelection: {
      screen: SupervisorSelectionScreen,
      navigationOptions: {
        header: null,
      },
    },
    Token: {
      screen: TokenScreen,
      navigationOptions: {
        header: null,
      },
    },
    Gratuity: {
      screen: GratuityScreen,
      navigationOptions: {
        header: null,
      },
    },
    Communication: {
      screen: CommunicationScreen,
      navigationOptions: {
        header: null,
      },
    },
    DashBoard: {
      screen: DashBoardScreen,
      navigationOptions: {
        header: null,
      },
    },
    VoucherDetail: {
      screen: VoucherDetailScreen,
      navigationOptions: {
        header: null,
      },
    },
    Travel: {
      screen: TravelScreen,
      navigationOptions: {
        header: null,
      },
    },
    TravelAction: {
      screen: TravelActionScreen,
      navigationOptions: {
        header: null,
      },
    },
    TravelAdvance: {
      screen: TravelAdvanceScreen,
      navigationOptions: {
        header: null,
      },
    },
    TravelAdvanceApproveReject: {
      screen: TravelAdvanceApproveRejectScreen,
      navigationOptions: {
        header: null,
      },
    },
    Visa: {
      screen: VisaScreen,
      navigationOptions: {
        header: null,
      },
    },
    VisaApproveReject: {
      screen: VisaApproveRejectScreen,
      navigationOptions: {
        header: null,
      },
    },
    VisitingCard: {
      screen: VisitingCardScreen,
      navigationOptions: {
        header: null,
      },
    },
    VisitingApproveReject: {
      screen: VisitingApproveRejectScreen,
      navigationOptions: {
        header: null,
      },
    },
    Ecrp: {
      screen: ECRPScreen,
      navigationOptions: {
        header: null,
      },
    },
    EcrpApproveReject: {
      screen: ECRPApproveReject,
      navigationOptions: {
        header: null,
      },
    },
    EcrpLetter: {
      screen: ECRPLetter,
      navigationOptions: {
        header: null,
      },
    },
    Cds: {
      screen: CDSScreen,
      navigationOptions: {
        header: null,
      },
    },
    CdsDetails: {
      screen: CDSDetails,
      navigationOptions: {
        header: null,
      },
    },
    CdsApproveReject: {
      screen: CDSApproveReject,
      navigationOptions: {
        header: null,
      },
    },
    Exit: {
      screen: ExitScreen,
      navigationOptions: {
        header: null,
      },
    },
    ExitDetails: {
      screen: ExitDetails,
      navigationOptions: {
        header: null,
      },
    },
    ExitApproveReject: {
      screen: ExitApproveReject,
      navigationOptions: {
        header: null,
      },
    },
    Address: {
      screen: AddressScreen,
      navigationOptions: {
        header: null,
      },
    },
    LeaveRoute: {
      screen: LeaveStack,
      navigationOptions: {
        header: null,
      },
    },
    FamilyRoute: {
      screen: FamilyScreen,
      navigationOptions: {
        header: null,
      },
    },
    HolidayRoute: {
      screen: HolidayScreen,
      navigationOptions: {
        header: null,
      },
    },
    WebRoute: {
      screen: MyWebView,
      navigationOptions: {
        header: null,
      },
    },
    ApplyLeaveRoute: {
      screen: createLeave,
      navigationOptions: {
        header: null,
      },
    },
    Ees: {
      screen: EESScreen,
      navigationOptions: {
        header: null,
      },
    },
    EesQuestion: {
      screen: EESQuestionScreen,
      navigationOptions: {
        header: null,
      },
    },
    CreateRequestISD: {
      screen: CreateRequestScreen,
      navigationOptions: {
        header: null,
      },
    },
    PendingRequestIT: {
      screen: PendingRequestScreen,
      navigationOptions: {
        header: null,
      },
    },
    PendingRequestDetail: {
      screen: ITPendingDetails,
      navigationOptions: {
        header: null,
      },
    },
    ITDeskDashBoard: {
      screen: ITDeskDashboard,
      navigationOptions: {
        header: null,
      },
    },
    ITDeskMyRequests: {
      screen: MyRequestScreen,
      navigationOptions: {
        header: null,
      },
    },
    VoucherDashBoard: {
      screen: VoucherDashBoard,
      navigationOptions: {
        header: null,
      },
    },
    CreateVoucher: {
      screen: CreateVoucher,
      navigationOptions: {
        header: null,
      },
    },
    CreateVoucher2: {
      screen: CreateVoucher2,
      navigationOptions: {
        header: null,
      },
    },
    MyVouchers: {
      screen: MyVoucherScreen,
      navigationOptions: {
        header: null,
      },
    },
    CreateGenericVoucher: {
      screen: CreateGenericVouchers,
      navigationOptions: {
        header: null,
      },
    },
    CreateLtaVoucher: {
      screen: CreateLtaVoucher,
      navigationOptions: {
        header: null,
      },
    },
    CreateUSVoucher: {
      screen: CreateUSVoucherScreen,
      navigationOptions: {
        header: null,
      },
    },
    SchemeAndPolicy: {
      screen: SchemeAndPolicyScreen,
      navigationOptions: {
        header: null,
      },
    },
    SchemeDetails: {
      screen: SchemsDetails,
      navigationOptions: {
        header: null,
      },
    },
    SchemePDF: {
      screen: schemePDFView,
      navigationOptions: {
        header: null,
      },
    },
    TimesheetDashboard: {
      screen: TimesheetDashboardScreen,
      navigationOptions: {
        header: null,
      },
    },
    TimeSheetApproval: {
      screen: TimeSheetApprovals,
      navigationOptions: {
        header: null,
      },
    },
    MyTimesheet4: {
      screen: MyTimesheetScreen4,
      navigationOptions: {
        header: null,
      },
    },
    MyTimesheet5: {
      screen: MyTimesheetScreen5,
      navigationOptions: {
        header: null,
      },
    },
    Covid: {
      screen: covidScreen,
      navigationOptions: {
        header: null,
      },
    },
    CovidVerifyOTP: {
      screen: covidVerifyOTPScreen,
      navigationOptions: {
        header: null,
      },
    },
    CovidWeb: {
      screen: covidWebScreen,
      navigationOptions: {
        header: null,
      },
    },
    IdCard: {
      screen: IdCardScreen,
      navigationOptions: {
        header: null,
      },
    },
    SurveyITDesk: {
      screen: SurveyITDesk,
      navigationOptions: {
        header: null,
      },
    },
    HRAssist: {
      screen: HRAssist,
      navigationOptions: {
        header: null,
      },
    },
    Hrassistmyrequest: {
      screen: HrassistMyrequest,
      navigationOptions: {
        header: null,
      },
    },
    HRAssistCreate: {
      screen: HRAssistCreate,
      navigationOptions: {
        header: null,
      },
    },
  },
  {
    initialRouteName: "Auth",
  }
);

export default createAppContainer(AppNavigator);

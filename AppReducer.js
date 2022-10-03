import LoginReducer from "./src/scenes/login/LoginReducer"
import { combineReducers } from "redux"
import { PendingReducer } from "./src/scenes/Dashboard/PendingReducer";
import { TravelReducer } from "./src/scenes/travel/travelReducer";
import { CommunicationReducer } from './src/scenes/communication/communicationReducer'
import { GratuityReducer } from "./src/scenes/gratuity/gratuityReducer";
import { AddressReducer } from './src/scenes/address/addressReducer'
import { FamilyReducer } from "./src/scenes/family/familyReducer";
import { HolidayReducer } from "./src/scenes/holiday/holidayReducer";
import { LeaveReducer } from "./src/scenes/leaves/leaveReducer";
import { VoucherReducer } from "./src/scenes/voucherDetails/voucherReducer";
import { VisaReducer } from './src/scenes/visa/visaReducer';
import { VisitingCardReducer } from './src/scenes/visitingCard/visitingCardReducer';
import { leaveApplyReducer } from "./src/scenes/createLeave/leaveApplyReducer";
import { AuthReducer } from "./src/scenes/auth/AuthReducer";
import { ECRPReducer } from './src/scenes/ecrp/ecrpReducer';
import { CDSReducer } from './src/scenes/cds/cdsReducer';
import { ExitReducer } from './src/scenes/eExit/exitReducer';
import { WebReducer } from "./src/scenes/Web/WebViewReducer";
import { TravelAdvanceReducer } from './src/scenes/travelAdvance/travelAdvanceReducer';
import { EESReducer} from './src/scenes/EES/eesReducer';
import { ITDeskPendingReducer } from "./src/scenes/ISD/pendingRequest/pendingRequestReducer";
import { ISDCreateRequestReducer } from './src/scenes/ISD/createRequest/createRequestReducer';
import { ITDeskMyRequestReducer } from "./src/scenes/ISD/myRequest/myRequestReducer";
import { MyVoucherReducer } from "./src/scenes/Voucher/MyVoucher/myVoucherReducer";
import { CVReducer } from './src/scenes/Voucher/createVoucher/cvReducer';

export const AppReducer = combineReducers({
   authReducer: AuthReducer,
   loginReducer: LoginReducer,
   pendingReducer: PendingReducer,
   travelReducer: TravelReducer,
   travelAdvanceReducer: TravelAdvanceReducer,
   visaReducer: VisaReducer,
   communicationReducer: CommunicationReducer,
   gratuityReducer: GratuityReducer,
   addressReducer: AddressReducer,
   familyReducer: FamilyReducer,
   holidayReducer:HolidayReducer,
   leaveReducer:LeaveReducer,
   voucherReducer:VoucherReducer,
   visitingReducer: VisitingCardReducer,
   leaveApplyReducer:leaveApplyReducer,
   ecrpReducer: ECRPReducer,
   cdsReducer: CDSReducer,
   exitReducer: ExitReducer,
   webReducer:WebReducer,
   eesReducer: EESReducer,
   itDeskPendingReducer:ITDeskPendingReducer,
   isdCreateRequestReducer: ISDCreateRequestReducer,
   itDeskMyRequestReducer: ITDeskMyRequestReducer,
   myVoucherReducer:MyVoucherReducer,
   cvReducer: CVReducer,
});




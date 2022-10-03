import {
  PENDING_MODAL,
  LOADING_PENDING,
  STORE_PENDING_ACTION,
  STORE_PENDING_ERROR,
  RESET_DASHBOARD,
  STORE_ATTENDANCE,
  STORE_ATTENDANCE_ERROR,
  STORE_ELIGIBILITY,
  STORE_VIEW_ATTENDANCE_ERROR,
  RESET_ELIGIBILITY,
  CLEAR_ATTENDANCE,
  RESET_ERRORS,
  STORE_DASHBOARD_ERROR,
} from './Constants';
let initialState = {
  pendingData: [],
  loading_pending: false,
  pendingError: '',
  attendanceData: [],
  attendanceError: '',
  eligibilityData: [],
  viewAttendanceError: '',
};
export const PendingReducer = (state = initialState, action) => {
  switch (action.type) {
    case CLEAR_ATTENDANCE:
      return {
        ...state,
        attendanceData: [],
        loading_pending: false,
        pendingError: '',
        attendanceError: '',
        viewAttendanceError: '',
      };
    case RESET_ELIGIBILITY:
      return {
        ...state,
        attendanceData: [],
        loading_pending: false,
        pendingData: [],
        loading_pending: false,
        pendingError: '',
        attendanceError: '',
        viewAttendanceError: '',
        eligibilityData: [],
      };
    case RESET_DASHBOARD:
      return {
        ...state,
        attendanceData: [],
        eligibilityData: [],
        loading_pending: false,
        pendingError: '',
        attendanceError: '',
        viewAttendanceError: '',
      };
      case RESET_ERRORS:
      return {
        ...state,
        loading_pending: false,
        pendingError: '',
        attendanceError: '',
        viewAttendanceError: '',
      };
    case STORE_ELIGIBILITY:
      return { ...state, eligibilityData: action.payload, loading_pending: true};
    case STORE_ATTENDANCE:
      return { ...state, attendanceData: action.payload, loading_pending: false};
    case LOADING_PENDING:
      return { ...state, loading_pending: action.payload};
    case STORE_PENDING_ACTION:
      return { ...state, pendingData: action.payload, loading_pending: false};
    case STORE_DASHBOARD_ERROR:
      return { ...state, pendingError: action.payload, loading_pending: false, pendingData: [] };
    case STORE_ATTENDANCE_ERROR:
      return {
        ...state,
        attendanceError: action.payload,
        loading_pending: false,
        attendanceData: [],
      };
    case STORE_VIEW_ATTENDANCE_ERROR:
      return {
        ...state,
        viewAttendanceError: action.payload,
        loading_pending: false,
        eligibilityData: [],
      };
    default:
      return state;
  }
};

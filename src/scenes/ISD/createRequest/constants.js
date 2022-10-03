export const ISD_LOADING = "isd_loading";
export const ISD_DEFAULT_DATA = "isd_default_data";
export const ISD_UPDATE_DATA = "isd_data_to_update";
export const ISD_DEFAULT_ERROR = "isd_default_error";
export const ISD_SERVICE_TYPE_DATA = "isd_service_type_data";
export const ISD_SERVICE_TYPE_ERROR = "isd_service_type_error";
export const ISD_RESET_STORE = "isd_reset_store";
export const ISD_SAVE_DATA = "isd_save_data";
export const ISD_SAVE_ERROR = "isd_save_error";
export const ISD_FILE_RESPONSE_DATA = "isd_file_response_data";
export const ISD_FILE_RESPONSE_ERROR = "isd_file_response_error";
export const ISD_SEARCH_EMPLOYEE_DATA = "isd_search_employee_data";
export const ISD_SEARCH_EMPLOYEE_ERROR = "isd_search_employee_error";
export const ADDITIONAL_REMARKS="isd_additional_remarks";
export const DELETE_FILE="delete_isd_file";
export const DOWNLOAD_FILE="download_isd_file";

export const SAVE_TEXT = "Save"
export const SUBMIT_REMARKS = "Submit Remarks"
export const REOPEN = "Reopen"
export const SUBMIT_TEXT = "Submit"
export const SUBMIT = "SUBMIT"
export const ASTERISK_SYMBOL = "*"
export const DURATION_TEXT = "Duration"
export const ASSET_CODE_TEXT = "Asset Code"
export const SEAT_NUMBER_TEXT = "Seat Number"
export const IP_TEXT = "IP"

export const SERVICE_TYPES = [
    { label: "Incident", value: 0 },
    { label: "Service Request", value: 1 },
    { label: "Security Incident", value: 2 }
]

export const REQUESTOR_TYPES = [
  { label: "Self", value: 0 },
  { label: "On Behalf", value: 1 }
]

export const DURATION_TYPES = [
  { label: "Permanent", value: 0 },
  { label: "Temporary", value: 1 }
]
    
export const MANAGER_ON_LEAVE_TYPES = [
    { label: "No", value: 0 },
    { label: "Yes", value: 1 }
  ]

  export let optionsArray = [
    {
        title: "Excellent",
        image: require("../../../assets/agreeimage.png"),
        value: 5,
        myOptionIndex: 0
    },
    {
        title: "Very Good",
        image: require("../../../assets/agreeimage.png"),
        value: 4,
        myOptionIndex: 1
    },
    {
        title: "Good",
        image: require("../../../assets/neutralface.png"),
        value: 3,
        myOptionIndex: 2
    },
    {
        title: "Average",
        image: require("../../../assets/neutralface.png"),
        value: 2,
        myOptionIndex: 3
    },
    {
        title: "Poor",
        image: require("../../../assets/disagree.png"),
        value: 1,
        myOptionIndex: 4
    },
]

export const PREVIOUS_TEXT = "PREVIOUS"
export const NEXT_TEXT = "NEXT"
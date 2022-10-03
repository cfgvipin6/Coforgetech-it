export const EES_LOADING = "ees_loading";
export const EES_DATA = "ees_data";
export const EES_ERROR = "ees_error";
export const EES_RESET_STORE = "ees_reset_store";
export const EES_SAVE_DATA = "ees_save_data";
export const EES_SAVE_ERROR = "ees_save_error";

export const BACK_ONE = "Prev Screen"
export const BACK_TWO = "Dashboard Screen"
export const PREVIOUS_TEXT = "PREVIOUS"
export const NEXT_TEXT = "NEXT"
export const SUBMIT_TEXT = "SUBMIT"
export const EES_HEADING = "EES"
export const DONE_FEEDBACK_MSG = "You have already submitted your response for Employee Engagement Survey. Thank you for your feedback."
export const INVALID_USER_MSG = "You are not eligible for Employee Engagement Survey."
export const SELECT_QUESTION_MSG = "Please select at least one option."
export const SURVEY_SUBMIT_MSG ="You have successfully submitted your response for Employee Engagement Survey. Thank you for your feedback."

export let optionsArray = [
    {
        title: "Strongly Agree",
        image: require("../../assets/agreeimage.png"),
        value: 5,
        myOptionIndex: 0
    },
    {
        title: "Agree",
        image: require("../../assets/agreeimage.png"),
        value: 4,
        myOptionIndex: 1
    },
    {
        title: "Neutral",
        image: require("../../assets/neutralface.png"),
        value: 3,
        myOptionIndex: 2
    },
    {
        title: "Disagree",
        image: require("../../assets/disagree.png"),
        value: 2,
        myOptionIndex: 3
    },
    {
        title: "Strongly Disagree",
        image: require("../../assets/disagree.png"),
        value: 1,
        myOptionIndex: 4
    },
]

export const BULLET_IMAGE = require('../../assets/dot_image.png');
export const START_TEXT = "START"
export const DEAR_NIITIAN_TEXT = "Dear member of Team Coforge,"
export const WELCOME_TO_ESS_TEXT = "Welcome to the Employee Engagement Survey(EES)!"
export const PARA_ONE_TEXT = "EES is an opportunity for us to share our opinions on organizational policies and practices. "
                            + "This feedback is then used to identify action areas for improvement."
export const PARA_TWO_TEXT = "It will take you less than fifteen minutes to take this survey. Please note that your responses will remain completely confidential."
export const PARA_TWO_SPLIT_TEXT = "Please complete the survey latest by 11:00 AM IST, 12th March 2021."
export const PARA_THREE_TEXT = "You may keep in mind the following points while doing this exercise:"
export const PARA_FOUR_TEXT = "Click on the <b>Start</b> button to initiate the survey"
export const PARA_FIVE_TEXT = "For each statement, click on the response that best matches your opinion"
export const PARA_SIX_TEXT = "Your feedback should be based on experiences of the entire previous year"
export const PARA_SEVEN_TEXT = "Please use the box provided at the end of the questionnaire for sharing subjective feedback, if any"
export const PARA_EIGHT_TEXT = "Thank you for your participation."
export const PARA_NINE_TEXT = `Regards,
Human Resources`



// old landing page text

// export const DEAR_NIITIAN_TEXT = "Dear Coforgeian,"
// export const WELCOME_TO_ESS_TEXT = "Welcome to the Employee Engagement Survey(EES) - 2020"
// export const PARA_ONE_TEXT = "EES is an opportunity for us to share our opinions on organisational policies and practices. "
//                             + "This feedback is then used to identify and work on those areas."
// export const PARA_TWO_TEXT = "It will take fifteen minutes to complete this exercise. Please note that your responses will remain completely "
//                             + "confidential and we look forward to your feedback. Please complete the survey latest by 26th Feb 2021. 11:00 AM IST."
// export const PARA_THREE_TEXT = "You may keep in mind the following points while doing this exercise:"
// export const PARA_FOUR_TEXT = "Click on the 'Start' button to Initiate the survey."
// export const PARA_FIVE_TEXT = "For each statement, click on the response that best matches your opinion."
// export const PARA_SIX_TEXT = "Your feedback should be based on experiences of the entire previous year."
// export const PARA_SEVEN_TEXT = "For any subjective feedback please use the box provided at the end of the questionnaire."
// export const PARA_EIGHT_TEXT = "Thank you for your participation."
// export const PARA_NINE_TEXT = `Regards,
// Human Resources`
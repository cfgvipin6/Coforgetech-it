import { NO_INTERNET, UNDEFINED_MESSAGE } from "../../GlobalConstants";
import {
  FAMILY_LOADING,
  STORE_FAMILY_DATA,
  FAMILY_ERROR,
  RESET_FAMILY
} from "./constants";
import properties from "../../resource/properties";
import { netInfo } from "../../utilities/NetworkInfo";
import { fetchPOSTMethod } from "../../utilities/fetchService";

const loading = data => {
  return {
    type: FAMILY_LOADING,
    payload: data
  };
};

const familyError = data => {
  return {
    type: FAMILY_ERROR,
    payload: data
  };
};

const storeFamilyData = data => {
  return {
    type: STORE_FAMILY_DATA,
    payload: data
  };
};

export const resetFamily = () => {
  return {
    type: RESET_FAMILY
  };
};

export const familyActionCreator = (userId, authKey) => {
  return async dispatch => {
    let isNetwork = await netInfo();
    if (isNetwork) {
      try {
        dispatch(loading(true));
        let url = properties.getFamily;
        // console.log("Family url is : ", url);
        let form = new FormData();
        form.append("ECSerp", userId);
        form.append("AuthKey", authKey);
        // console.log("Attached form data for family : " + JSON.stringify(form));
        let response = await fetchPOSTMethod(url, form);
        if (response.length != undefined) {
          if (
            response.length === 1 &&
            response[0].hasOwnProperty("Exception")
          ) {
            // console.log("Family api exception while fetching family list from server is : ",response);
            dispatch(familyError(response[0].Exception));
          } else {
            // console.log("Family respopnse from server is : ", response);
            dispatch(storeFamilyData(response));
          }
        } else if (
          response.length === undefined ||
          response.length === 0 ||
          response === null ||
          response === undefined
        ) {
          dispatch(loading(false));
          dispatch(familyError(UNDEFINED_MESSAGE));
        }
      } catch (error) {
        // console.log("Inside catch error of family screen")
        dispatch(loading(false));
        dispatch(familyError(UNDEFINED_MESSAGE));
      }
    } else {
      return alert(NO_INTERNET);
    }
  };
};

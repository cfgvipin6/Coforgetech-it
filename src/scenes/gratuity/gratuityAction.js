import { RESET_GRATUITY_STORE,GRATUITY_PENDING, STORE_GRATUITY_ACTION, STORE_GRATUITY_ERROR } from './constants';
import { fetchPOSTMethod } from '../../utilities/fetchService';
import properties from '../../resource/properties';
import { netInfo } from '../../utilities/NetworkInfo';
import { NO_INTERNET, UNDEFINED_MESSAGE } from '../../GlobalConstants';


const loading = () => {
    return {
        type: GRATUITY_PENDING,
    };
};
const storeGratuityData = (data)=> {
    return {
        type: STORE_GRATUITY_ACTION,
        payload: data,
    };
};

const gratuityException = (data)=>{
    return {
        type: STORE_GRATUITY_ERROR,
        payload:data,
    };
};
 const resetGratuityStoreData = () =>{
     return {
         type: RESET_GRATUITY_STORE,
     };
 };

export const resetGratuityData = () => {
    return async (dispatch) =>
    {
        dispatch(resetGratuityStoreData());
    };
};

export const gratuityAction = (empCode,AuthKey) => {
    return async (dispatch) =>
    {
        let isNetwork = await netInfo();
     if (isNetwork){
        try {
        let form = new FormData();
        form.append('ECSerp', empCode);
        form.append('AuthKey', AuthKey);
        let url = properties.getGratuityDetails;
        // console.log("Form to post is : "+JSON.stringify(form));
        dispatch(loading());
        let gratuityResponse = await fetchPOSTMethod(url, form);
        console.log('Gratuity response from server is ',gratuityResponse);
            if (gratuityResponse != undefined){
                // console.log('response for gratuity Screen : ' ,gratuityResponse);
                  if (gratuityResponse.length == 1 && gratuityResponse[0].hasOwnProperty('Exception')){
                    // console.log('gratuity exception :',gratuityResponse);
                    dispatch(gratuityException(gratuityResponse[0].Exception));
                  } else {
                    // console.log('gratuity valid response :',gratuityResponse);
                    dispatch(storeGratuityData(gratuityResponse));
                  }
              }
        } catch (error) {
            // console.log("Inside error block of gratuity action : ",error);
            dispatch(gratuityException(UNDEFINED_MESSAGE));
        }
     }
     else {
         return alert(NO_INTERNET);
     }
    };
};

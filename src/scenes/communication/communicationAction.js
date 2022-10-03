import { RESET_COMM_STORE,COMM_PENDING, STORE_COMMUNICATION_ACTION, STORE_PENDING_ERROR } from "./constants"
import { fetchPOSTMethod } from "../../utilities/fetchService"
import properties from '../../resource/properties'
import { netInfo } from "../../utilities/NetworkInfo"
import { NO_INTERNET, UNDEFINED_MESSAGE } from "../../GlobalConstants"


const loading = () => {
    return {
        type: COMM_PENDING,
    }
}
const storeCommunicationData = (data)=> {
    return{
        type: STORE_COMMUNICATION_ACTION,
        payload: data
    }
}

const communicationException = (data)=>{
    return{
        type: STORE_PENDING_ERROR,
        payload:data,
    }
}
 const resetCommStoreData = () =>{
     return{
         type: RESET_COMM_STORE 
     }
 }

export const resetCommData = () => {
    return async (dispatch) =>
    {
        dispatch(resetCommStoreData())
    }
}

export const communicationAction = (empCode,AuthKey) => {
    return async (dispatch) =>
    {
        let isNetwork = await netInfo();
     if(isNetwork){
        try {  
        let form = new FormData();
        form.append("ECSerp", empCode);
        form.append("AuthKey", AuthKey);
        let url = properties.getHRCommunication;
        // console.log("Form to post is : "+JSON.stringify(form));
        dispatch(loading())
        let communicationResponse = await fetchPOSTMethod(url, form);   
            if(communicationResponse!= undefined){
                // console.log('response for Communication Screen : ' ,communicationResponse);
                  if(communicationResponse.length == 1 && communicationResponse[0].hasOwnProperty("Exception")){
                    // console.log('communication exception :',communicationResponse);
                    dispatch(communicationException(communicationResponse[0].Exception))
                  } else{
                    // console.log('communication valid response for comm screen :',communicationResponse);
                    dispatch(storeCommunicationData(communicationResponse));
                  }
              }
        } catch (error) {
            // console.log("Inside error block of communication action : ",error);
            if(communicationResponse === undefined || communicationResponse === null ){
                dispatch(communicationException(UNDEFINED_MESSAGE));
        }
      }
     }
     else {
         return alert(NO_INTERNET);
     }
    } 
}
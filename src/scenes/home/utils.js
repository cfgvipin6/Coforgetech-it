import { netInfo } from '../../utilities/NetworkInfo';
import properties from '../../resource/properties';
import { fetchPOSTMethod } from '../../utilities/fetchService';
import { connect } from 'react-redux';
let globalConstants = require('../../GlobalConstants');
import { AppStore } from '../../../AppStore';
import { RecyclerViewBackedScrollViewBase } from 'react-native';

export const fetchVDHBalance = async(item,successCallBack)=>{
    let isNetwork = await netInfo();
    if (isNetwork) {
      console.log('Voucher number to delete is : ', item.DocumentNo);
      let formData = new FormData();
      const loginData = AppStore.getState().loginReducer.loginData;
      formData.append('ECSerp',  loginData.SmCode);
      formData.append('AuthKey', loginData.Authkey);

    //   formData.append('CompanyCode',  loginData.SmCode);
    //   formData.append('AuthKey', loginData.Authkey);
    //   formData.append('ECSerp',  loginData.SmCode);

      formData.append('DocNo', item.DocumentNo.trim());
      let url = properties.cvFetchVDHBalance;
      let response = await fetchPOSTMethod(url, formData);
      console.log('Data from server for vdh =======>',response);
      if (response) {
          successCallBack(item,response);
            return response;
      } else if (response.length === undefined || response.length === 0 || response === null || response === undefined) {
        throw (globalConstants.UNDEFINED_MESSAGE);
      }
    } else {
      throw (globalConstants.NO_INTERNET);
    }
  };

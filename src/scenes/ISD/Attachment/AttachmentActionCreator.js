import { netInfo } from '../../../utilities/NetworkInfo';
import properties from '../../../resource/properties';
import { fetchPOSTMethod, fetchGETMethod } from '../../../utilities/fetchService';
let globalConstants = require('../../../GlobalConstants');
import {showToast} from '../../../GlobalComponent/Toast';
import { useState } from 'react';

export const actionOnFile = async(loginData,fileId,action,setData,index,files,openDownloadedFile,setLoading)=>{
        let isNetwork = await netInfo();
        if (isNetwork) {
          try {
            setLoading(true);
            this.empCode = loginData.empCode === undefined ? loginData.SmCode : loginData.empCode;
            this.authToken = loginData.authToken === undefined ? loginData.Authkey : loginData.authToken;
            let formData = new FormData();
            formData.append('ECSerp', empCode);
            formData.append('AuthKey', authToken);
            formData.append('FileId', fileId);
            formData.append('MobileRequest', 2);
            let url = action === 'delete' ?  properties.deleteISDFile : properties.downloadISDFile;
            console.log('Form data is :', formData);
            let response = await fetchPOSTMethod(url, formData);
            console.log('File ' + action + ' ',response);
            if (response.length != undefined) {
                setLoading(false);
              if (response.length === 1 && response[0].hasOwnProperty('Exception')) {
                showToast((response[0].Exception));

              } else {
                if (action === 'delete'){
                    files.splice(index,1);
                    setData(files=>[...files]);
                }
                if (openDownloadedFile !== undefined){
                    openDownloadedFile(response[0].FileType,response[0].FileName);
                }
              }
            } else if (response.length === undefined || response.length === 0 || response === null || response === undefined) {
            showToast(globalConstants.UNDEFINED_MESSAGE);
            setLoading(false);
            }
          } catch (error){
            setLoading(false);
            showToast(JSON.stringify(error));
          }
        } else {
            showToast(globalConstants.NO_INTERNET);
        }
    };


    export const downloadHrFile = async(loginData,fileId,action,setData,index,files,openDownloadedFile,setLoading)=>{
      let isNetwork = await netInfo();
      if (isNetwork) {
        try {
          setLoading(true);
          this.empCode = loginData.empCode === undefined ? loginData.SmCode : loginData.empCode;
          this.authToken = loginData.authToken === undefined ? loginData.Authkey : loginData.authToken;
          let formData = new FormData();
          formData.append('ECSerp', empCode);
          formData.append('AuthKey', authToken);
          formData.append('FileId', fileId);
          formData.append('MobileRequest', 2);
          let response = await fetchPOSTMethod(
						properties.downloadHrFile ,formData
					);
          console.log('HR file download response : ', response);
          if (response.length != undefined) {
              setLoading(false);
            if (response.length === 1 && response[0].hasOwnProperty('Exception')) {
              showToast((response[0].Exception));

            } else {
              if (action === 'delete'){
                  files.splice(index,1);
                  setData(files=>[...files]);
              }
              if (openDownloadedFile !== undefined){
                  openDownloadedFile(response[0].FileType,response[0].FileName);
              }
            }
          } else if (response.length === undefined || response.length === 0 || response === null || response === undefined) {
          showToast(globalConstants.UNDEFINED_MESSAGE);
          setLoading(false);
          }
        } catch (error){
          setLoading(false);
          showToast(JSON.stringify(error));
        }
      } else {
          showToast(globalConstants.NO_INTERNET);
      }
  };


export const uploadIsdAttachment = async(loginData,requestID,data,fileName)=>{
        let isNetwork = await netInfo();
        if (isNetwork) {
          try {
            this.empCode = loginData.empCode === undefined ? loginData.SmCode : loginData.empCode;
            this.authToken = loginData.authToken === undefined ? loginData.Authkey : loginData.authToken;
            let formData = new FormData();
          formData.append('ECSerp', this.empCode);
          formData.append('AuthKey', this.authToken);
          formData.append('RequestID', requestID);
          formData.append('data', data);
          formData.append('FileName', fileName);
          let url = properties.isdFileUploadUrl;
          let response = await fetchPOSTMethod(url, formData);
          console.log('isd file upload data response',response);
            console.log('Voucher attachment upload response is :',response);
            if (response.length != undefined) {
              if (response.length === 1 && response[0].hasOwnProperty('Exception')) {
                showToast((response[0].Exception));
              } else {
              }
            } else if (response.length === undefined || response.length === 0 || response === null || response === undefined) {
            showToast(globalConstants.UNDEFINED_MESSAGE);
            }
          } catch (error){
            showToast(JSON.stringify(error));
          }
        } else {
            showToast(globalConstants.NO_INTERNET);
        }
    };

import { netInfo } from '../../utilities/NetworkInfo';
import properties from '../../resource/properties';
import { fetchPOSTMethod } from '../../utilities/fetchService';
let globalConstants = require('../../GlobalConstants');
let constants = require('./constants');
import { showToast } from '../../GlobalComponent/Toast';

export const deleteAttachment = (
  loginData,
  docNumber,
  rowId,
  setLoading,
  updateFiles,
  file
) => {
  return async (dispatch) => {
    let isNetwork = await netInfo();
    if (isNetwork) {
      try {
        setLoading(true);
        this.empCode =
          loginData.empCode === undefined
            ? loginData.SmCode
            : loginData.empCode;
        this.authToken =
          loginData.authToken === undefined
            ? loginData.Authkey
            : loginData.authToken;
        let formData = new FormData();
        formData.append('ECSerp', empCode);
        formData.append('AuthKey', authToken);
        formData.append('DocNo', docNumber);
        formData.append('RowId', rowId);
        formData.append('ItemID', 0);
        console.log('Row ID  to delete file is :', rowId);
        let url = properties.deleteVoucherAttachment;
        let response = await fetchPOSTMethod(url, formData);
        console.log('Voucher attachment delete response is :', response);
        if (response.length != undefined) {
          if (
            response.length === 1 &&
            response[0].hasOwnProperty('Exception')
          ) {
            showToast(response[0].Exception);
            setLoading(false);
          } else {
            setLoading(false);
            updateFiles(file);
          }
        } else if (
          response.length === undefined ||
          response.length === 0 ||
          response === null ||
          response === undefined
        ) {
          showToast(globalConstants.UNDEFINED_MESSAGE);
          setLoading(false);
        }
      } catch (error) {
        showToast(JSON.stringify(error));
        setLoading(false);
      }
    } else {
      showToast(globalConstants.NO_INTERNET);
    }
  };
};

export const downloadAttachment = (
  loginData,
  ErowId,
  setLoading,
  openDownloadedFile
) => {
  return async (dispatch) => {
    let isNetwork = await netInfo();
    if (isNetwork) {
      try {
        if (setLoading) {
          setLoading(true);
        }

        this.empCode =
          loginData.empCode === undefined
            ? loginData.SmCode
            : loginData.empCode;
        this.authToken =
          loginData.authToken === undefined
            ? loginData.Authkey
            : loginData.authToken;
        let formData = new FormData();
        formData.append('ECSerp', empCode);
        formData.append('AuthKey', authToken);
        formData.append('DocumentId', ErowId);
        console.log('ErowId to download file is :', ErowId);
        let url = properties.downloadVoucherAttachment;
        let response = await fetchPOSTMethod(url, formData);
        console.log('Voucher attachment download response is :', response);
        if (response.length !== undefined) {
          if (
            response.length === 1 &&
            response[0].hasOwnProperty('Exception')
          ) {
            showToast(response[0].Exception);
            if (setLoading) {
              setLoading(false);
            }
          } else {
            if (setLoading) {
              setLoading(false);
            }
            openDownloadedFile(response[0].FileBase64, response[0].FileName);
          }
        } else if (
          response.length === undefined ||
          response.length === 0 ||
          response === null ||
          response === undefined
        ) {
          showToast(globalConstants.UNDEFINED_MESSAGE);
          if (setLoading) {
            setLoading(false);
          }
        }
      } catch (error) {
        showToast(JSON.stringify(error));
        if (setLoading) {
          setLoading(false);
        }
      }
    } else {
      showToast(globalConstants.NO_INTERNET);
    }
  };
};

export const AttachmentUpload = (
  loginData,
  docNumber,
  ItemID,
  File,
  setData,
  res,
  setLoading,
  updateFiles,
  docType
) => {
  return async (dispatch) => {
    let isNetwork = await netInfo();
    if (isNetwork) {
      try {
        setLoading(true);
        this.empCode =
          loginData.empCode === undefined
            ? loginData.SmCode
            : loginData.empCode;
        this.authToken =
          loginData.authToken === undefined
            ? loginData.Authkey
            : loginData.authToken;
        let formData = new FormData();
        formData.append('ECSerp', empCode);
        formData.append('AuthKey', authToken);
        formData.append('DocNo', docNumber);
        formData.append('ItemID', ItemID);
        formData.append('File', File);
        formData.append('DocumentType', docType == 'DL' ? 2 : 1);
        let url = properties.uploadVoucherAttachment;
        console.log('Voucher attachment upload payload is :', formData);
        let response = await fetchPOSTMethod(url, formData);
        console.log('Voucher attachment upload response is :', response);
        if (response.length !== undefined) {
          if (
            response.length === 1 &&
            response[0].hasOwnProperty('Exception')
          ) {
            showToast(response[0].Exception);
            setLoading(false);
          } else {
            let fileData = {};
            fileData.FileName = res?.name;
            fileData.type = res?.type;
            fileData.uri = res?.uri;
            fileData.RowId = response[0]?.RowId;
            fileData.DocumentType = docType;
            setLoading(false);
            try {
              setData((files) => {
                if (files !== null) {
                  return [...files, fileData];
                } else {
                  return [fileData];
                }
              });
            } catch (error) {
              console.log('Error in setData is : ', error);
            }
            updateFiles([fileData]);
          }
        } else if (
          response.length === undefined ||
          response.length === 0 ||
          response === null ||
          response === undefined
        ) {
          showToast(globalConstants.UNDEFINED_MESSAGE);
          setLoading(false);
        }
      } catch (error) {
        showToast('Error found ' + JSON.stringify(error));
        setLoading(false);
      }
    } else {
      showToast(globalConstants.NO_INTERNET);
    }
  };
};

export const AttachmentUploadLTA = (
  loginData,
  docNumber,
  File,
  setData,
  res,
  setLoading,
  updateFiles
) => {
  return async (dispatch) => {
    let isNetwork = await netInfo();
    if (isNetwork) {
      try {
        setLoading(true);
        this.empCode =
          loginData.empCode === undefined
            ? loginData.SmCode
            : loginData.empCode;
        this.authToken =
          loginData.authToken === undefined
            ? loginData.Authkey
            : loginData.authToken;
        let formData = new FormData();
        formData.append('ECSerp', empCode);
        formData.append('AuthKey', authToken);
        formData.append('DocNo', docNumber);
        formData.append('File', File);
        let url = properties.uploadVoucherAttachmentLTA;
        console.log('Voucher attachment upload payload is :', formData);
        let response = await fetchPOSTMethod(url, formData);
        console.log('Voucher attachment upload response is :', response);
        if (response.length !== undefined) {
          if (
            response.length === 1 &&
            response[0].hasOwnProperty('Exception')
          ) {
            showToast(response[0].Exception);
            setLoading(false);
          } else {
            let fileData = {};
            fileData.FileName = res.name;
            fileData.type = res.type;
            fileData.uri = res.uri;
            fileData.RowId = response[0].RowId;
            console.log('Set data is being called : ', fileData);
            setLoading(false);
            try {
              setData((files) => {
                console.log('FILES in Method : ', files);
                if (files !== null) {
                  return [...files, fileData];
                } else {
                  return [fileData];
                }
              });
            } catch (error) {
              console.log('Error in setData is : ', error);
            }
            console.log('Update data is being called : ', fileData);
            updateFiles(fileData);
          }
        } else if (
          response.length === undefined ||
          response.length === 0 ||
          response === null ||
          response === undefined
        ) {
          showToast(globalConstants.UNDEFINED_MESSAGE);
          setLoading(false);
        }
      } catch (error) {
        showToast('Error found ' + JSON.stringify(error));
        setLoading(false);
      }
    } else {
      showToast(globalConstants.NO_INTERNET);
    }
  };
};

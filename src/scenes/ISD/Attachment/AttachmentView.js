import React, { useState, useEffect } from 'react';
import { styles } from './styles';
import { Icon } from 'react-native-elements';
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  FlatList,
  Platform,
} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import DocumentPicker from 'react-native-document-picker';
import { useSelector, useDispatch } from 'react-redux';
// import { AttachmentUpload, deleteAttachment } from './AttachmentActionCreator';
var appConfig = require('../../../../appconfig');
import { showToast } from '../../../GlobalComponent/Toast';
import ActivityIndicatorView from '../../../GlobalComponent/myActivityIndicator';
import FileViewer from 'react-native-file-viewer';
import ImagePicker from 'react-native-image-picker';
import {
  uploadIsdAttachment,
  actionOnFile,
  downloadHrFile,
} from './AttachmentActionCreator';
import ImageResizer from 'react-native-image-resizer';
import { deleteHrFile } from '../../hrassist/utils';
var RNFS = require('react-native-fs');
let fileData = [];
let loginData;
const filePicker = async (
  setData,
  files,
  appState,
  dispatch,
  setLoading,
  documentNumber,
  rowID
) => {
  try {
    const res = await DocumentPicker.pick({
      type: [
        DocumentPicker.types.images,
        DocumentPicker.types.pdf,
        DocumentPicker.types.plainText,
        DocumentPicker.types.zip,
      ],
    });
    console.log('URI : ' + res.uri);
    console.log('Type : ' + res.type);
    console.log('File Name : ' + res.name);
    console.log('File Size : ' + res.size);

    let docNumber = documentNumber;
    let ItemID = rowID;
    let File = {
      uri: res.uri,
      name: res.name,
      filename: res.name,
      type: res.type,
    };
    let tempData = {};
    tempData.FileSize = res.size;
    tempData.FileName = res.name;
    tempData.FileType = res.type;
    tempData.FileUri = res.uri;
    tempData.FileId = null;
    setData((files) => [...files, tempData]);
    // dispatch(AttachmentUpload(loginData,docNumber,ItemID,File,setData,res,setLoading))
  } catch (err) {
    if (DocumentPicker.isCancel(err)) {
      console.log('File picking aborted');
    } else {
      throw err;
    }
  }
};
export const getISDFiles = () => {
  return fileData;
};
export const base64File = async (file) => {
  let promise = new Promise((resolve, reject) => {
    let data = RNFetchBlob.fs
      .readStream(file.FileUri, 'base64', 4095)
      .then((ifStream) => {
        ifStream.open();
        ifStream.onData((chunk) => {
          data += chunk;
        });
        ifStream.onError((error) => {
          console.log('Oops error is :', error);
          reject(error);
        });
        ifStream.onEnd(() => {
          let dataToSave = data.replace('[object Object]', '');
          resolve(dataToSave);
        });
      });
  });
  return promise;
};

export const uploadIsdFiles = (requestId) => {
  fileData.map(async (file, index) => {
    if (file.FileUri !== undefined) {
      // let data = await base64File(file);
      let data = {
        uri: file.FileUri,
        name: file.FileName,
        filename: file.FileName,
        type: file.FileType,
      };
      uploadIsdAttachment(loginData, requestId, data, file.FileName);
    }
  });
};

export const AttachmentView = (props) => {
  let fileArray = props.files !== undefined ? props.files : [];
  const [files, setData] = useState(fileArray);
  const [loading, setLoading] = useState(false);
  const [anyAction, setAction] = useState(false);
  const appState = useSelector((state) => state);
  loginData = appState.loginReducer.loginData;
  const dispatch = useDispatch();
  console.log('Props files : ', fileArray);
  console.log('original files : ', files);
  if (
    fileArray !== undefined &&
    fileArray.length > 0 &&
    files.length === 0 &&
    !anyAction
  ) {
    setTimeout(() => {
      setData(fileArray);
    }, 1000);
  }
  useEffect(() => {
    console.log('File data is : ', files);
    fileData = files;
  });

  const deleteFile = (index, file) => {
    let loginData = appState.loginReducer.loginData;
    let fileId = file.FileId;
    console.log('File to delete is :', file);
    setAction(true);
    if (fileId !== undefined && fileId !== null) {
      if (props?.isComingFrom == 'HR') {
        deleteHrFile(
          fileId,
          (successData) => {
            if (successData[0]?.message === 'success') {
              files.splice(index, 1);
              setData((files) => [...files]);
            }
          },
          (err) => {
            showToast(err);
          }
        );
      } else {
        actionOnFile(
          loginData,
          fileId,
          'delete',
          setData,
          index,
          files,
          undefined,
          setLoading
        );
      }
    } else {
      files.splice(index, 1);
      setData((files) => [...files]);
    }
  };

  const downLoadFile = (index, file) => {
    setAction(true);
    let loginData = appState.loginReducer.loginData;
    let fileId = file.FileId;
    console.log('File to download is :', file);
    if (
      fileId !== undefined &&
      fileId !== null &&
      props?.isComingFrom !== 'HR'
    ) {
      actionOnFile(
        loginData,
        fileId,
        'download',
        setData,
        index,
        files,
        openDownloadedFile,
        setLoading
      );
    }
    if (
      fileId !== undefined &&
      fileId !== null &&
      props?.isComingFrom === 'HR'
    ) {
      downloadHrFile(
        loginData,
        fileId,
        'download',
        setData,
        index,
        files,
        openDownloadedFile,
        setLoading
      );
    }
  };

  const openDownloadedFile = (data, fileName) => {
    console.log('Opening file:', data);
    const DocumentDir =
      Platform.OS === 'ios'
        ? RNFS.DocumentDirectoryPath
        : RNFS.ExternalDirectoryPath;
    let filePath = DocumentDir + '/' + fileName.trim();
    RNFetchBlob.fs
      .writeFile(filePath, data, 'base64')
      .then(() => {
        showToast('File is downloaded at ' + filePath);
        openFile(filePath);
      })
      .catch((error) => {
        showToast('Error in opening file : ', error);
      });
  };
  const openFile = (filePath) => {
    setAction(true);
    FileViewer.open(filePath)
      .then(() => {})
      .catch((error) => {
        showToast('unable to open attachment file due to ' + error);
        console.log('unable to open attachment file due to ' + error);
      });
  };

  const handleCamera = (props) => {
    setAction(true);
    const options = {
      title: 'Click picture',
      storageOptions: { skipBackup: true, path: 'images' },
    };
    ImagePicker.launchCamera(options, (response) => {
      console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        cameraCallBackFromCameraScreen(response, props.docNumber, props.rowId);
      }
    });
  };

  const cameraCallBackFromCameraScreen = (data, documentNumber, rowID) => {
    console.log('Camera Data : ', data);
    let fileName =
      data.fileName === undefined
        ? data.uri.substring(data.uri.lastIndexOf('-') + 1, data.uri.length)
        : data.fileName;
    console.log('File name is : ' + fileName);
    ImageResizer.createResizedImage(data.uri, 100, 100, 'JPEG', 10).then(
      (response2) => {
        console.log('Camera response 2', response2);
        let tempData = {};
        tempData.FileSize = response2.size;
        tempData.FileName = fileName;
        tempData.FileType = data.type;
        tempData.FileUri = data.uri;
        tempData.FileId = null;
        setData((files) => [...files, tempData]);
      }
    );
  };

  return (
    <View style={styles.container}>
      <ActivityIndicatorView loader={loading} />
      <View style={styles.headerContainer}>
        <Text style={styles.attachText}>{props.heading}</Text>
        <View style={styles.buttonConainer}>
          <TouchableOpacity
            style={styles.attachIcon}
            onPress={() => {
              if (props.disable) {
                showToast('You can not attach file on submitted record.');
              } else {
                filePicker(
                  setData,
                  files,
                  appState,
                  dispatch,
                  setLoading,
                  props.docNumber,
                  props.rowId
                );
              }
            }}
          >
            <Icon name="attachment" size={25} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.camera}
            onPress={() => {
              console.log(props.disable);
              if (props.disable) {
                showToast('You can not capture image on submitted record.');
              } else {
                handleCamera(props);
              }
            }}
          >
            <Icon name="add-a-photo" size={25} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
      {files.length > 0 ? (
        <View style={{ flex: 1 }}>
          {files.map((file, index) => {
            return (
              <View
                key={file.FileUri ?? `${file?.FileId}_${file?.FileName}`}
                style={styles.fileItem}
              >
                <TouchableOpacity
                  style={styles.fileName}
                  onPress={() => {
                    console.log('Opening file..... : ', file);
                    if (file.FileUri !== undefined) {
                      openFile(file.FileUri);
                    } else {
                      downLoadFile(index, file);
                    }
                  }}
                >
                  <Text style={styles.fileHeadingStyle}>{file.FileName}</Text>
                </TouchableOpacity>
                <View style={styles.deleteIcon}>
                  <TouchableOpacity
                    onPress={() => {
                      if (props.disable === true) {
                        showToast(
                          'You can not delete file of submitted record.'
                        );
                      } else {
                        deleteFile(index, file);
                      }
                    }}
                  >
                    <Icon
                      name="delete"
                      size={23}
                      color={appConfig.INVALID_BORDER_COLOR}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>
      ) : null}
    </View>
  );
};

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
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
import { RNCamera } from 'react-native-camera';
import { useSelector, useDispatch } from 'react-redux';
import {
  AttachmentUpload,
  AttachmentUploadLTA,
  deleteAttachment,
  downloadAttachment,
} from './AttachmentActionCreator';
var appConfig = require('../../../appconfig');
import { showToast } from '../../GlobalComponent/Toast';
import ActivityIndicatorView from '../myActivityIndicator';
import FileViewer from 'react-native-file-viewer';
import ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
let fileArray;
var RNFS = require('react-native-fs');
const filePicker = async (
  setData,
  files,
  appState,
  dispatch,
  setLoading,
  documentNumber,
  rowID,
  updateFiles
) => {
  try {
    const res = await DocumentPicker.pick({
      type: [DocumentPicker.types.images,DocumentPicker.types.pdf,DocumentPicker.types.plainText],
    });
    if (res.type.includes('video') || res.type.includes('audio') || res.type.includes('mp3') || res.type.includes('mp4')){
      return alert('Sorry , you can not add this file.');
    }
    console.log('Files is  :',fileArray);
    console.log('Picked file is :',res);
    let duplicateFound = fileArray.find((file)=>file.uri == res.uri);
    console.log('Duplicate found is  :',duplicateFound);
    if (duplicateFound != undefined){
      return alert('Duplicate file can not be added.');
    }
    let loginData = appState.loginReducer.loginData;
    let docNumber = documentNumber;
    let ItemID = rowID;
    let File = {
      uri: res.uri,
      name: res.name,
      filename: res.name,
      type: res.type,
    };
    updateFiles(File);
    // dispatch(
    //   AttachmentUpload(
    //     loginData,
    //     docNumber,
    //     ItemID,
    //     File,
    //     setData,
    //     res,
    //     setLoading,
    //     updateFiles
    //   )
    // );
  } catch (err) {
    if (DocumentPicker.isCancel(err)) {
      console.log('File picking aborted');
    } else {
      throw err;
    }
  }
};
export const getFiles = (props)=>{
  return props?.files;
};
let fileArrayTemp = [];
export const MultiAttachmentLTA = props => {
  console.log('Props in multi attachment LTA view : ', props);
  fileArray = props.files !== undefined ? props.files : [];
  const [files, setData] = useState(fileArray);
  const [loading, setLoading] = useState(false);
  const [anyAction, setAction] = useState(false);
  const appState = useSelector(state => state);
  const [fileData, setFileData] = useState([]);
  const dispatch = useDispatch();
  if (
    fileArray !== undefined &&
    fileArray !== null &&
    fileArray.length > 0 &&
    !anyAction
  ) {
    setTimeout(() => {
      setData(fileArray);
    }, 1000);
  }
  const updateFiles = file => {
    props.files.push(file);
    props.addFilesCallBack(props.files);
  };
  const updateFilesAfterDelete = (index,deletedFile) => {
      let removeIndex =  props.files.findIndex((item)=>item?.uri == deletedFile.uri);
      props.files.splice(removeIndex,1);
      setLoading(false);
      setTimeout(()=>{
        props.lineItemArrayCallBack(props.files);
      },1000);
  };
  useEffect(() => {
    fileArray = files;
  });
  const deleteFile = (index, file) => {
       updateFilesAfterDelete(index,file);
  };
  const openDownloadedFile = (data, fileName) => {
    const DocumentDir =
      Platform.OS === 'ios'
        ? RNFS.DocumentDirectoryPath
        : RNFS.ExternalDirectoryPath;
    let filePath = DocumentDir + '/' + fileName.trim();
    RNFetchBlob.fs
      .writeFile(filePath, data, 'base64')
      .then(() => {
        openFile(filePath);
      })
      .catch(error => {
      });
  };
  const openFile = filePath => {
    FileViewer.open(filePath)
      .then(() => {
        showToast('File is opening from path ' + filePath);
      })
      .catch(error => {
        showToast('unable to open attachment file due to ' + error);
      });
  };
  const downLoadFile = (file) => {
    setAction(true);
    let loginData = appState.loginReducer.loginData;
    let ERowId = file.ERowId;
    dispatch(
      downloadAttachment(loginData, ERowId, setLoading, openDownloadedFile)
    );
  };
  const handleCamera = props => {
    const options = {
      title: 'Click picture',
      storageOptions: { skipBackup: true, path: 'images' },
    };
    ImagePicker.launchCamera(options, response => {
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
    let fileName =
      data.fileName === undefined
        ? data.uri.substring(data.uri.lastIndexOf('-') + 1, data.uri.length)
        : data.fileName;
    ImageResizer.createResizedImage(data.uri, 200, 200, 'JPEG', 80).then(
      response2 => {
        let tempData = {};
        tempData.size = response2.size;
        tempData.FileName = fileName;
        tempData.type = data.type;
        tempData.uri = data.uri;
        let loginData = appState.loginReducer.loginData;
        let docNumber = documentNumber;
        let ItemID = rowID;
        let File = {
          uri: tempData.uri,
          name: tempData.FileName,
          filename: tempData.FileName,
          type: tempData.type,
        };
        updateFiles(File);
      }
    );
  };

  return (
    <View style={styles.container}>
      <ActivityIndicatorView loader={loading} />
      <View style={styles.headerContainer}>
        <Text style={styles.attachText}>{props.heading}</Text>
        <View style={styles.buttonConainer}>
          {!props.disable ? (
            <TouchableOpacity
              disabled={
                props.disable !== undefined
                  ? props.disable
                  : props.isFreezed !== undefined
                  ? props.isFreezed
                  : false
              }
              style={styles.attachIcon}
              onPress={() => {
                filePicker(
                  setData,
                  files,
                  appState,
                  dispatch,
                  setLoading,
                  props.docNumber,
                  props.rowId,
                  updateFiles
                );
              }}
            >
              <Icon name="attachment" size={25} color="#fff" />
            </TouchableOpacity>
          ) : null}
          {!props.disable ? (
            <TouchableOpacity
              disabled={
                props.disable !== undefined
                  ? props.disable
                  : props.isFreezed !== undefined
                  ? props.isFreezed
                  : false
              }
              style={styles.camera}
              onPress={() => {
                handleCamera(props);
              }}
            >
              <Icon name="add-a-photo" size={25} color="#fff" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
      {
        props?.files?.map((imageItem,picIndex)=>{
         return <View style={{ flex: 1 }}>
          <View style={styles.fileItem} key={imageItem?.RowID}>
                <TouchableOpacity
                  style={styles.fileName}
                  onPress={() => {
                    if (imageItem?.uri !== undefined) {
                      openFile(imageItem?.uri);
                    } else {
                      downLoadFile(imageItem);
                    }
                  }}
                >
                  <Text style={styles.fileHeadingStyle}>{imageItem?.FileName ? imageItem?.FileName : imageItem.name}</Text>
                </TouchableOpacity>
                {!props.disable ? (
                  <View style={styles.deleteIcon}>
                    <TouchableOpacity
                      disabled={
                        props.disable !== undefined
                          ? props.disable
                          : props.isFreezed !== undefined
                          ? props.isFreezed
                          : false
                      }
                      onPress={() => {
                        deleteFile(picIndex, imageItem);
                      }}
                    >
                      <Icon
                        name="delete"
                        size={23}
                        color={appConfig.INVALID_BORDER_COLOR}
                      />
                    </TouchableOpacity>
                  </View>
                ) : null}
              </View>
        </View>;
        })
       }
    </View>
  );
};

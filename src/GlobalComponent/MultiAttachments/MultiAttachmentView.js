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
  Modal,
  Image,
} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import DocumentPicker from 'react-native-document-picker';
import { useSelector, useDispatch } from 'react-redux';
import {
  AttachmentUpload,
  deleteAttachment,
  downloadAttachment,
} from './AttachmentActionCreator';
var appConfig = require('../../../appconfig');
import { showToast } from '../../GlobalComponent/Toast';
import ActivityIndicatorView from '../myActivityIndicator';
import FileViewer from 'react-native-file-viewer';
import ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import { Dropdown } from '../DropDown/DropDown';
import images from '../../images';
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
  updateFiles,
  docType
) => {
  try {
    const res = await DocumentPicker.pick({
      type: [
        DocumentPicker.types.images,
        DocumentPicker.types.pdf,
        DocumentPicker.types.plainText,
      ],
    });
    console.log('Res : ', res);
    if (
      res.type.includes('video') ||
      res.type.includes('audio') ||
      res.type.includes('mp3') ||
      res.type.includes('mp4')
    ) {
      return alert('Sorry , you can not add this file.');
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
    dispatch(
      AttachmentUpload(
        loginData,
        docNumber,
        ItemID,
        File,
        setData,
        res,
        setLoading,
        updateFiles,
        docType
      )
    );
  } catch (err) {
    if (DocumentPicker.isCancel(err)) {
      console.log('File picking aborted');
    } else {
      throw err;
    }
  }
};
export const getFiles = (props) => {
  let lineItems = props.lineItems;
  let files = [];
  if (lineItems && lineItems.length > 0) {
    files = lineItems.map((item) => {
      if (item.LstUploadFiles[0]) {
        files.push(item.LstUploadFiles[0]);
      }
    });
  }
  return files;
};
let fileArrayTemp = [];
export const MultiAttachmentView = (props) => {
  console.log('Props in multi attachment view : ', props);
  this.childNameRef = React.createRef();
  fileArray = props.files !== undefined ? props.files : [];
  const [docTypeArray, setDocTypeArray] = useState([
    { DisplayText: 'Invoice', Value: 1 },
    { DisplayText: 'DL', Value: 2 },
  ]);
  const [files, setData] = useState(fileArray);
  const [loading, setLoading] = useState(false);
  const [anyAction, setAction] = useState(false);
  const appState = useSelector((state) => state);
  const [fileData, setFileData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [hardWareType, setHardwareType] = useState('');
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

  const updateFiles = (updatedFiles) => {
    fileArrayTemp.push(updatedFiles);
    let lineItemArray = props?.lineItems;
    itemFileArray = updatedFiles;
    if (lineItemArray[props.itemIndex]?.LstUploadFiles) {
      lineItemArray[props.itemIndex].LstUploadFiles.push(...updatedFiles);
    } else {
      lineItemArray[0].LstUploadFiles = [];
      lineItemArray[0].LstUploadFiles.push(...updatedFiles);
    }
    props.lineItemArrayCallBack(lineItemArray);
  };
  const updateFilesAfterDelete = (deletedFile) => {
    let lineItemArray = props.lineItems;
    let removeIndex = lineItemArray[props.itemIndex].LstUploadFiles.findIndex(
      (item) => item?.RowId == deletedFile.RowId
    );
    lineItemArray[props.itemIndex].LstUploadFiles.splice(removeIndex, 1);
    console.log('Line Item Array after delete : ', lineItemArray);
    setLoading(false);
    setTimeout(() => {
      props.lineItemArrayCallBack(lineItemArray);
    }, 1000);
  };
  useEffect(() => {
    fileArray = files;
  });
  const deleteFile = (index, file, documentNumber, rowID) => {
    let loginData = appState.loginReducer.loginData;
    let docNumber = documentNumber;
    let rowId = file.RowId;
    if (rowId !== undefined && rowId !== null && rowId !== '') {
      dispatch(
        deleteAttachment(
          loginData,
          docNumber,
          rowId,
          setLoading,
          updateFilesAfterDelete,
          file
        )
      );
    }
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
      .catch((error) => {});
  };
  const openFile = (filePath) => {
    FileViewer.open(filePath)
      .then(() => {
        showToast('File is opening from path ' + filePath);
      })
      .catch((error) => {
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
  const handleCamera = (props, type) => {
    const options = {
      title: 'Click picture',
      storageOptions: { skipBackup: true, path: 'images' },
    };
    ImagePicker.launchCamera(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        cameraCallBackFromCameraScreen(
          response,
          props.docNumber,
          props.rowId,
          type
        );
      }
    });
  };

  const cameraCallBackFromCameraScreen = (
    data,
    documentNumber,
    rowID,
    type
  ) => {
    let fileName =
      data.fileName === undefined
        ? data.uri.substring(data.uri.lastIndexOf('-') + 1, data.uri.length)
        : data.fileName;
    ImageResizer.createResizedImage(data.uri, 200, 200, 'JPEG', 80).then(
      (response2) => {
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
        dispatch(
          AttachmentUpload(
            loginData,
            docNumber,
            ItemID,
            File,
            setData,
            File,
            setLoading,
            updateFiles,
            type
          )
        );
      }
    );
  };

  useEffect(() => {
    setFileData(props.lineItems[props.itemIndex]?.LstUploadFiles);
  });

  const onDocTypeSelection = (type) => {
    if (
      type == 'DL' &&
      fileData.filter((file) => file.DocumentType == 'DL').length > 0
    ) {
      return alert(
        'You have already uploaded the DL. If you want to update the DL, please delete the existing DL from the below list and upload the new one.'
      );
    }
    setModalVisible(false);
    switch (hardWareType) {
      case 'Camera':
        setTimeout(() => handleCamera(props, type), 600);
        break;
      case 'FilePicker':
        setTimeout(
          () =>
            filePicker(
              setData,
              files,
              appState,
              dispatch,
              setLoading,
              props.docNumber,
              props.rowId,
              updateFiles,
              type
            ),
          600
        );
        break;
    }
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
                if (props?.catID == '4') {
                  setHardwareType('FilePicker');
                  setModalVisible(true);
                } else {
                  filePicker(
                    setData,
                    files,
                    appState,
                    dispatch,
                    setLoading,
                    props.docNumber,
                    props.rowId,
                    updateFiles,
                    undefined
                  );
                }
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
                if (props?.catID == '4') {
                  setHardwareType('Camera');
                  setModalVisible(true);
                } else {
                  handleCamera(props);
                }
              }}
            >
              <Icon name="add-a-photo" size={25} color="#fff" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
      {fileData?.map((imageItem) => {
        return (
          <View key={imageItem?.FileName} style={{ flex: 1 }}>
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
                <Text style={styles.fileHeadingStyle}>
                  {imageItem?.DocumentType
                    ? imageItem?.FileName + '(' + imageItem.DocumentType + ')'
                    : imageItem?.FileName}
                </Text>
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
                      deleteFile(
                        props.itemIndex,
                        imageItem,
                        props.docNumber,
                        props.rowId
                      );
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
          </View>
        );
      })}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalView}>
          <View style={styles.modalContainer}>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
            >
              <Image source={images.crossButton} />
            </TouchableOpacity>
            <Text style={{ alignSelf: 'center' }}>
              Please select the document type.
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => onDocTypeSelection('DL')}
            >
              <Text>Driving License</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => onDocTypeSelection('Invoice')}
            >
              <Text>Invoice</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

/* eslint-disable no-undef */
import React, { useState, useEffect } from "react";
import { styles } from "./styles";
import { Icon } from "react-native-elements";
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  FlatList,
  Platform,
} from "react-native";
import RNFetchBlob from "rn-fetch-blob";
import DocumentPicker from "react-native-document-picker";
import { useSelector, useDispatch } from "react-redux";
import {
  AttachmentUpload,
  deleteAttachment,
  downloadAttachment,
} from "./AttachmentActionCreator";
var appConfig = require("../../../appconfig");
import { showToast } from "../../GlobalComponent/Toast";
import ActivityIndicatorView from "../myActivityIndicator";
import FileViewer from "react-native-file-viewer";
import ImagePicker from "react-native-image-picker";
import ImageResizer from "react-native-image-resizer";
let fileArray;
var RNFS = require("react-native-fs");
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
      type: [
        DocumentPicker.types.images,
        DocumentPicker.types.pdf,
        DocumentPicker.types.plainText,
        DocumentPicker.types.zip,
      ],
    });
    console.log("URI : " + res.uri);
    console.log("Type : " + res.type);
    console.log("File Name : " + res.name);
    console.log("File Size : " + res.size);
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
        updateFiles
      )
    );
  } catch (err) {
    if (DocumentPicker.isCancel(err)) {
      console.log("File picking aborted");
    } else {
      throw err;
    }
  }
};
export const getFiles = () => {
  let lineItems = props.lineItems;
  let files = [];
  if (lineItems.length > 0) {
    files = lineItems.map((item) => {
      if (item.LstUploadFiles[0]) {
        files.push(item.LstUploadFiles[0]);
      }
    });
  }
  return files;
};
let fileArrayTemp = [];
export const MultiAttachmentGenericView = (props) => {
  console.log("Props in multi attachment Generic view : ", props);
  fileArray = props.files !== undefined ? props.files : [];
  const [files, setData] = useState(fileArray);
  const [loading, setLoading] = useState(false);
  const [anyAction, setAction] = useState(false);
  const appState = useSelector((state) => state);
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
    fileArrayTemp.push(updateFiles);
    console.log("File update is called", updatedFiles);
    let lineItemArray = props.lineItems;
    console.log("Line Item Array : ", lineItemArray);
    let itemFileArray = lineItemArray[props.itemIndex].LstUploadFiles;
    console.log("Item File Array 1 : ", itemFileArray);
    itemFileArray = updatedFiles;
    console.log("Item File Array 2 : ", itemFileArray);
    lineItemArray[props.itemIndex].LstUploadFiles.push(...updatedFiles);
    console.log("Item File Array Final : ", lineItemArray);
    props.lineItemArrayCallBack(lineItemArray);
  };
  const updateFilesAfterDelete = (deletedFile) => {
    console.log("File deleted is called", deletedFile);
    let lineItemArray = props.lineItems;
    console.log("Line Item Array : ", lineItemArray);
    console.log("Item index : ", props.itemIndex);
    let removeIndex = lineItemArray[props.itemIndex].LstUploadFiles.findIndex(
      (item) => item?.RowId == deletedFile.RowId
    );
    console.log("Removable index : ", removeIndex);
    lineItemArray[props.itemIndex].LstUploadFiles.splice(removeIndex, 1);
    console.log("Updated lineItems  : ", lineItemArray);
    props.lineItemArrayCallBack(lineItemArray);
  };
  useEffect(() => {
    fileArray = files;
    console.log("File data is : ", files);
  });
  const deleteFile = (index, file, documentNumber, rowID) => {
    let loginData = appState.loginReducer.loginData;
    let docNumber = documentNumber;
    let rowId = file.RowId;
    console.log("Delete index is :", index);
    console.log("Delete file is :", file);
    console.log("File Row ID is :", rowId);
    console.log("props Row ID is :", rowID);
    if (rowId !== undefined && rowId !== null && rowId !== "") {
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
      Platform.OS === "ios"
        ? RNFS.DocumentDirectoryPath
        : RNFS.ExternalDirectoryPath;
    let filePath = DocumentDir + "/" + fileName.trim();
    RNFetchBlob.fs
      .writeFile(filePath, data, "base64")
      .then(() => {
        openFile(filePath);
      })
      .catch((error) => {
        console.log("Error in opening file : " + error);
      });
  };
  const openFile = (filePath) => {
    FileViewer.open(filePath)
      .then(() => {
        showToast("File is opening from path " + filePath);
      })
      .catch((error) => {
        showToast("unable to open attachment file due to " + error);
        console.log("unable to open attachment file due to " + error);
      });
  };
  const downLoadFile = (file) => {
    setAction(true);
    let loginData = appState.loginReducer.loginData;
    let ERowId = file.ERowId;
    console.log("File to download is :", file);
    dispatch(
      downloadAttachment(loginData, ERowId, setLoading, openDownloadedFile)
    );
  };
  const handleCamera = (props) => {
    const options = {
      title: "Click picture",
      storageOptions: { skipBackup: true, path: "images" },
    };
    ImagePicker.launchCamera(options, (response) => {
      console.log("Response = ", response);
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
      } else {
        cameraCallBackFromCameraScreen(response, props.docNumber, props.rowId);
      }
    });
  };

  const cameraCallBackFromCameraScreen = (data, documentNumber, rowID) => {
    console.log("Camera Data : ", data);
    let fileName =
      data.fileName === undefined
        ? data.uri.substring(data.uri.lastIndexOf("-") + 1, data.uri.length)
        : data.fileName;
    console.log("File name is : " + fileName);
    ImageResizer.createResizedImage(data.uri, 200, 200, "JPEG", 80).then(
      (response2) => {
        console.log("Camera response 2");
        let tempData = {};
        tempData.size = response2.size;
        tempData.FileName = fileName;
        tempData.type = data.type;
        tempData.uri = data.uri;
        console.log("File Item :", tempData);
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
            updateFiles
          )
        );
      }
    );
  };

  useEffect(() => {
    console.log(
      "image file is : ",
      props.lineItems[props.itemIndex]?.LstUploadFiles
    );
  });
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
      {props.lineItems[props.itemIndex]?.LstUploadFiles.length > 0
        ? props.lineItems[props.itemIndex].LstUploadFiles.map(
            (imageItem, imageIndex) => {
              return (
                <View style={{ flex: 1 }}>
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
                        {imageItem?.FileName}
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
            }
          )
        : null}
    </View>
  );
};

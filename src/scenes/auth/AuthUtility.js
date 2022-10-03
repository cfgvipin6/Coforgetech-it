/* eslint-disable prettier/prettier */
import AsyncStorage from "@react-native-community/async-storage";
import { NativeModules, Platform } from "react-native";
import RNFetchBlob from "rn-fetch-blob";
var Aes = NativeModules.Aes;
var RNFS = require("react-native-fs");

let helperKey;
const encryptInfo = (text, key) => {
  return Aes.randomKey(16).then((iv) => {
    return Aes.encrypt(text, key, iv).then((cipher) => ({
      cipher,
      iv,
    }));
  });
};
const decryptInfo = async (cipher, key, iv) => {
  try {
    var text = await Aes.decrypt(cipher, key, iv);
    // console.log(text)
    return text;
  } catch (e) {
    console.error(e);
  }
};
export const getUserName = async () => {
  let value;
  try {
    let key = await getEncryptionKey();
    // console.log("Generated key : getUserName : ",key );
    let helperKey = await AsyncStorage.getItem("@HelperUserName");
    let encryptedData = await AsyncStorage.getItem("@UserName");
    if (helperKey !== null) {
      // console.log("encryptedData",encryptedData)
      // console.log("key",key)
      // console.log("helperKey", helperKey);
      value = await decryptInfo(encryptedData, key, helperKey);
      //console.log("Decrypted value : ", value);
    }
  } catch (error) {
    console.log("Error retrieving User Name " + error);
  }
  if (value !== undefined) {
    return JSON.parse(value);
  }
};

export const setUserName = async (value) => {
  try {
    let key = await getEncryptionKey();
    console.log("Generated key : setUserName : ", key);
    let encryptedData = await encryptInfo(JSON.stringify(value), key);
    let data = await encryptedData.cipher;
    await AsyncStorage.setItem("@HelperUserName", encryptedData.iv);
    await AsyncStorage.setItem("@UserName", data);
  } catch (error) {
    console.log("Error saving User Name" + error);
  }
};
export const setAuthKey = async (value) => {
  try {
    let key = await getEncryptionKey();
    console.log("Generated key : setAuthKey : ", key);
    let encryptedData = await encryptInfo(JSON.stringify(value), key);
    let data = await encryptedData.cipher;
    await AsyncStorage.setItem("@HelperAuthKey", encryptedData.iv);
    await AsyncStorage.setItem("@AuthKey", data);
  } catch (error) {
    console.log("Error saving User Name" + error);
  }
};
export const getAuthKey = async () => {
  let value;
  try {
    let key = await getEncryptionKey();
    console.log("Generated key : getAuthKey : ", key);
    let helperKey = await AsyncStorage.getItem("@HelperAuthKey");
    let encryptedData = await AsyncStorage.getItem("@AuthKey");
    if (helperKey !== null) {
      value = await decryptInfo(encryptedData, key, helperKey);
    }
  } catch (error) {
    console.log("Error retrieving password " + error);
  }
  return value;
};

export const setPassword = async (value) => {
  try {
    let key = await getEncryptionKey();
    console.log("Generated key : setPassword : ", key);
    let encryptedData = await encryptInfo(value, key);
    let data = await encryptedData.cipher;
    await AsyncStorage.setItem("@HelperPassword", encryptedData.iv);
    await AsyncStorage.setItem("@Password", data);
  } catch (error) {
    // console.log("Error saving password" + error);
  }
};

export const getToken = async () => {
  let value;
  try {
    let key = await getEncryptionKey();
    console.log("Generated key : getToken : ", key);
    let helperKey = await AsyncStorage.getItem("@HelperToken");
    let encryptedData = await AsyncStorage.getItem("@Token");
    if (helperKey !== null) {
      value = await decryptInfo(encryptedData, key, helperKey);
    }
  } catch (error) {
    // console.log("Error retrieving Token " + error);
  }
  return value;
};

export const getSknToken = async () => {
  let value;
  try {
    let key = await getEncryptionKey();
    console.log("Generated key : getSknToken : ", key);
    let helperKey = await AsyncStorage.getItem("@HelperSknToken");
    let encryptedData = await AsyncStorage.getItem("@SknToken");
    if (helperKey !== null) {
      value = await decryptInfo(encryptedData, key, helperKey);
    }
  } catch (error) {
    // console.log("Error retrieving sknToken " + error);
  }
  return value;
};

export const setToken = async (value) => {
  try {
    let key = await getEncryptionKey();
    console.log("Generated key : setToken : ", key);
    let encryptedData = await encryptInfo(value, key);
    let data = await encryptedData.cipher;
    await AsyncStorage.setItem("@HelperToken", encryptedData.iv);
    await AsyncStorage.setItem("@Token", data);
  } catch (error) {
    // console.log("Error saving Token" + error);
  }
};
export const setSknToken = async (value) => {
  try {
    let key = await getEncryptionKey();
    console.log("Generated key : setSknToken : ", key);
    let encryptedData = await encryptInfo(value, key);
    let data = await encryptedData.cipher;
    await AsyncStorage.setItem("@HelperSknToken", encryptedData.iv);
    await AsyncStorage.setItem("@SknToken", data);
  } catch (error) {
    // console.log("Error saving sknToken" + error);
  }
};
export const setLoginType = async (value) => {
  try {
    await AsyncStorage.setItem("@LoginType", value);
  } catch (error) {
    // console.log("Error saving login type" + error);
  }
};

export const getLoginType = async () => {
  let value;
  try {
    value = await AsyncStorage.getItem("@LoginType");
  } catch (error) {
    // console.log("Error retrieving login type " + error);
  }
  return value;
};

export const setEncryptionKey = async (value) => {
  // console.log("Setting encryption key value is :", value);
  try {
    await AsyncStorage.setItem("@EncryptionKey", value);
  } catch (error) {}
};

export const setAttendanceDay = async (value) => {
  try {
    await AsyncStorage.setItem("@AttendanceDay", value);
    console.log("Attendance Date saved to : ", value);
  } catch (error) {}
};

export const getAttendanceDay = async (value) => {
  let val;
  try {
    val = await AsyncStorage.getItem("@AttendanceDay");
  } catch (error) {}
  return val;
};
export const removeAttendanceDay = async () => {
  try {
    await AsyncStorage.removeItem("@AttendanceDay");
    // console.log("Login type is removed.")
    return true;
  } catch (exception) {
    return false;
  }
};
export const getEncryptionKey = async () => {
  let value;
  try {
    value = await AsyncStorage.getItem("@EncryptionKey");
  } catch (error) {}
  return value;
};

export const removeLoginType = async () => {
  try {
    await AsyncStorage.removeItem("@LoginType");
    // console.log("Login type is removed.")
    return true;
  } catch (exception) {
    return false;
  }
};

export const removeUserName = async () => {
  try {
    await AsyncStorage.removeItem("@UserName");
    await AsyncStorage.removeItem("@HelperUserName");
    await AsyncStorage.removeItem("@HelperPassword");
    await AsyncStorage.removeItem("@HelperToken");
    await AsyncStorage.removeItem("@HelperSknToken");
    await AsyncStorage.removeItem("@AttendanceDay");
    // console.log("User is removed.")
    return true;
  } catch (exception) {
    return false;
  }
};

export const removePassword = async () => {
  try {
    await AsyncStorage.removeItem("@Password");
    return true;
  } catch (exception) {
    return false;
  }
};

export const downloadCertificate = async () => {
  var certificatePath =
    Platform.OS === "ios"
      ? RNFS.DocumentDirectoryPath + "/CoforgeCertificate.cer"
      : RNFS.ExternalDirectoryPath + "/CoforgeCertificate.cer";
  try {
    let response = await RNFetchBlob.config({
      fileCache: true,
      appendExt: "cer",
      path: certificatePath,
    }).fetch(
      "GET",
      "https://iengagedev.coforge.com/ess2/Misc/CommonHandler/GetCertificate"
    );
    if (response.respInfo.status == 200) {
      return response.path();
    }
  } catch (exception) {
    console.log("Exception in downloading certificate : ", exception);
  }
};

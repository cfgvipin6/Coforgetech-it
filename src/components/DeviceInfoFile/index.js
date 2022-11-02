 // Rajneesh Kumar
 
 import {
    getVersion,
    getDeviceId,
    getDeviceName,
    getBrand,
    getSystemName,
    getSystemVersion,
   } from "react-native-device-info";

 export const DEVICE_VERSION =  getVersion();
 export const DEVICE_ID    =    getDeviceId();
 export const DEVICE_NAME  =    getDeviceName();
 export const DEVICE_MODEL =    getBrand();
 export const DEVICE_OS  =     getSystemName()
 export const DEVICE_OS_VERSION = getSystemVersion()


 // Rajneesh Kumar
 
import DeviceInfo from 'react-native-device-info';

 export const DEVICE_VERSION =  DeviceInfo.getVersion();
 export const DEVICE_ID    =    DeviceInfo.getDeviceId();
 export const DEVICE_NAME  =    DeviceInfo.getDeviceName();
 export const DEVICE_MODEL =    DeviceInfo.getBrand();
 export const DEVICE_OS  = DeviceInfo.getSystemName()
 export const DEVICE_OS_VERSION = DeviceInfo.getSystemVersion()


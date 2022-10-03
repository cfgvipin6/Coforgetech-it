import { Platform } from 'react-native';

var RNFS = require('react-native-fs');
var path = (Platform.OS === 'ios') ? (RNFS !== undefined && RNFS.DocumentDirectoryPath) + '/iEngageAppLog.txt' : RNFS.ExternalDirectoryPath + '/iEngageAppLog.txt';

export const readIniitianLog = async()=>{
   return new Promise((resolve,reject)=>{
    return ( async () => {
        if (await RNFS.exists(path)){
            RNFS.readFile(path,'utf8').then((contents)=>{
              // console.log("File contents are :", contents);
              resolve(contents);
            })
          .catch((err) => {
              reject(err);
            // console.log(err.message, err.code);
          });
          } else {
              reject('Log file was not found');
            // console.log("Log file was not found")
          }
    })();
   });
  };
export const createLogFile = async()=>{
    RNFS.writeFile(path, '------:Coforge Limited Mobile App Logs:-------', 'utf8')
    .then((success) => {
      // console.log('FILE created at : ',path);
    })
    .catch((err) => {
      // console.log("FILE creation error :" ,err.message);
    });
};

export const writeLog = async(textToWrite)=>{
    if (await RNFS.exists(path)){
      let fileSize =  Math.round((await RNFS.stat(path)).size / 1024);
       if (fileSize > 2048){
        await deleteLogFile();
        await createLogFile();
       }
        RNFS.appendFile(path, '\n' + textToWrite, 'utf8')
        .then((success) => {
          // // console.log('Text appended   : ',textToWrite)
        })
        .catch((err) => {
          // console.log("Text appended error :" ,err.message)
        });
    } else {
        // console.log("Log file was not found")
    }

};

export const deleteLogFile = ()=>{
return RNFS.unlink(path)
  .then(() => {
    // console.log('FILE DELETED');
  })
  // `unlink` will throw an error, if the item to unlink does not exist
  .catch((err) => {
    // console.log(err.message);
  });
};

import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
export const enableLocation=()=>{
    RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({interval: 10000, fastInterval: 5000})
    .then(data => {
      if(data==="already-enabled" || data ==="enabled"){
      }
    }).catch(err => {
      alert("Please enable device's location in order to mark your attendance.");
    });
  }
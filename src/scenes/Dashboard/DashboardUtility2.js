/* eslint-disable quotes */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
import Geolocation from "@react-native-community/geolocation";
import moment from "moment";
// eslint-disable-next-line no-unused-vars
import { AppStore } from "../../../AppStore";
import images from "../../images";
import { writeLog } from "../../utilities/logger";
//{'lat':28.216565,'long':77.823506} home coordinates.
let latitude;
let longitude;
let locationStartTime, locationEndTime;

const CAMPUSES = [
  { lat: 28.41194, long: 77.51501 },
  { lat: 28.5091308, long: 77.0812362 },
];
export const GridDataViewAttendance = [
  {
    key: "My Approvals",
    navOptionThumb: images.approvalIcon,
    screenToNavigate: "DashBoard",
  },
  {
    key: "View Attendance",
    navOptionThumb: images.attendanceIcon,
    screenToNavigate: "Attendance",
  },
  // {
  //   key: "CoWIN",
  //   navOptionThumb: images.cowinIcon,
  //   screenToNavigate: "CovidWeb",
  // },
  {
    key: "Apply Leave",
    navOptionThumb: images.leaveIcon,
    screenToNavigate: "ApplyLeaveRoute",
  },
  {
    key: "My Info",
    navOptionThumb: images.myInfoIcon,
    screenToNavigate: "MyInfo",
  },
  {
    key: "Balances",
    navOptionThumb: images.balanceIcon,
    screenToNavigate: "Gratuity",
  },
  {
    key: "Holiday List",
    navOptionThumb: images.holidayIcon,
    screenToNavigate: "HolidayRoute",
  },
  {
    key: "IT-Desk",
    navOptionThumb: images.itDeskIcon,
    screenToNavigate: "ITDeskDashBoard",
  },
  {
    key: "Voucher",
    navOptionThumb: images.voucherIcon,
    screenToNavigate: "VoucherDashBoard",
  },
  {
    key: "Scheme & Policies",
    navOptionThumb: images.schemeIcon,
    screenToNavigate: "SchemeAndPolicy",
  },
  {
    key: "Coforge-TimeCard",
    navOptionThumb: images.timeCardIcon,
    screenToNavigate: "TimesheetDashboard",
  },

  {
    key: "HR Assist",
    navOptionThumb: images.timeCardIcon,
    screenToNavigate: "HRAssist",
  },
  // {
  //   key: "My Voice-EES",
  //   navOptionThumb: images.surveyIcon,
  //   screenToNavigate: "Ees",
  // },
  {
    key: "ID Card",
    navOptionThumb: images.timeCardIcon,
    screenToNavigate: "IdCard",
  },
];

getDistance = (currentLat, currentLong, campusLat, campusLong) => {
  return new Promise((resolve, reject) => {
    if (currentLat !== null && currentLong !== undefined) {
      let R = 6371; // km (change this constant to get miles)
      let dLat = ((campusLat - currentLat) * Math.PI) / 180;
      let dLon = ((campusLong - currentLong) * Math.PI) / 180;
      let a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((currentLat * Math.PI) / 180) *
          Math.cos((campusLat * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      let d = R * c;
      resolve(Math.round(d * 1000));
    } else {
      reject(undefined);
    }
  });
};

export const currentTime = moment(
  moment(new Date()),
  "DD/MM/YYYY HH:mm:ss"
).format("DD/MM/YYYY HH:mm:ss");

export const getLatitude = () => {
  return latitude;
};
export const getLongitude = () => {
  return longitude;
};
onPosition = async (
  position,
  callBack,
  welcomeCallBack,
  hideLoaderCallBack
) => {
  latitude = position.coords.latitude;
  longitude = position.coords.longitude;
  let emp = AppStore.getState().loginReducer.loginData.SmCode;
  let isAlert = emp === "00076250" || emp === "00040246";
  for (let i = 0; i < CAMPUSES.length; i++) {
    let place = CAMPUSES[i];
    await this.getDistance(latitude, longitude, place.lat, place.long)
      .then((value) => {
        let measuredScale = 100;
        switch (place.lat) {
          case 28.5091308:
            measuredScale = 60;
            break;
          case 28.41194:
            measuredScale = 200;
        }
        // console.log("Distance found", value);
        welcomeCallBack(value);
        locationEndTime = new Date().getTime();
        let timeDiff = locationEndTime - locationStartTime;
        console.log(
          "Fetching Position Time ==> ",
          moment.duration(timeDiff, "milliseconds").asSeconds()
        );
        console.log("Value distnce is : ", value);
        if (value < measuredScale || isAlert) {
          let currentTimeString = moment(
            new Date(),
            "DD/MM/YYYY HH:mm:ss"
          ).format("DD/MM/YYYY HH:mm:ss");
          if (callBack !== null) {
            return callBack(currentTimeString, position); // hitting attendance service.
          }
        } else if (value > 200) {
          // console.log("Distance is out of campus ",value);
          hideLoaderCallBack();
        }
      })
      .catch((error) => {});
  }
};

errorCallback_highAccuracy = (
  error,
  callBack,
  welcomeCallBack,
  hideLoaderCallBack
) => {
  // console.log('in side error call back ',error);
  // if (error.code == error.TIMEOUT)
  //   {
  welcomeCallBack(null);
  hideLoaderCallBack();
  // }
  locationEndTime = new Date().getTime();
  let timeDiff = locationEndTime - locationStartTime;
  let timeConsumed = moment.duration(timeDiff, "milliseconds").asSeconds();
  console.log("Fetching Position Error Time ==> ", timeConsumed);
  writeLog(
    "Location fetching time if location not found ==> " +
      timeConsumed +
      " Second"
  );
};
successCallback = (position, callBack, welcomeCallBack, hideLoaderCallBack) => {
  // console.log("in side success call back",position);
  locationEndTime = new Date().getTime();
  let timeDiff = locationEndTime - locationStartTime;
  let timeConsumed = moment.duration(timeDiff, "milliseconds").asSeconds();
  console.log("Fetching Position success Time ==> ", timeConsumed);
  writeLog(
    "Location fetching time if location found ==> " + timeConsumed + " Second"
  );
  this.onPosition(position, callBack, welcomeCallBack, hideLoaderCallBack);
};
export const callLocation = (callBack, welcomeCallBack, hideLoaderCallBack) => {
  locationStartTime = new Date().getTime();
  Geolocation.getCurrentPosition(
    (position) =>
      this.successCallback(
        position,
        callBack,
        welcomeCallBack,
        hideLoaderCallBack
      ),
    (error) =>
      this.errorCallback_highAccuracy(
        error,
        callBack,
        welcomeCallBack,
        hideLoaderCallBack
      ),
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 1000 }
  );
};

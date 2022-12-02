import moment from 'moment';
let arrayContainer = [];
export const addMoreObject = (
  previousObject,
  loginData,
  currentDate,
  startDate,
  endDate,
  dayTypes
) => {
  let pushableObject = {};
  let weekArray = [];
  let weekDays;
  if (previousObject) {
    weekDays = previousObject.lstColumns;
  } else {
    weekDays = generateWeekDays(currentDate, dayTypes);
  }
  for (let i = 0; i < weekDays.length; i++) {
    let item = weekDays[i];
    let copiedItem = {};
    copiedItem.Key = item.Key;
    copiedItem.DID = -1;
    copiedItem.ActivityCode = '0';
    copiedItem.ProjectCode = 'NO-PRJ';
    copiedItem.CategoryCode = '0';
    copiedItem.ShiftCode = '0';
    copiedItem.DateProject = null;
    copiedItem.Status = 0;
    copiedItem.TimesheetDateColumn = null;
    copiedItem.Value = 0;
    copiedItem.Remarks1 = '';
    weekArray.push(copiedItem);
  }
  pushableObject.Action = null;
  pushableObject.ActionTakenBy = null;
  pushableObject.ActionType = null;
  pushableObject.ActivityCode = '0';
  pushableObject.CategoryCode = '0';
  pushableObject.ShiftCode = '0';
  pushableObject.DID = 0;
  pushableObject.EmpCode = loginData.SmCode;
  pushableObject.EmpName = loginData.EmpName;
  pushableObject.ProjectCode = 'NO-PRJ';
  pushableObject.lstColumns = weekArray;
  pushableObject.TodayDate = currentDate;
  pushableObject.TimesheetFromDate = startDate;
  pushableObject.TimesheetToDate = endDate;

  return pushableObject;
};
const generateWeekDays = (currentDay, dayTypes) => {
  let weekArray = [];
  for (let i = 0; i < dayTypes.length; i++) {
    let weekDay = {};
    weekDay.DID = 0;
    weekDay.ActivityCode = '0';
    weekDay.ProjectCode = '0';
    weekDay.CategoryCode = 'NO-PRJ';
    weekDay.ShiftCode = '0';
    weekDay.DateProject = null;
    weekDay.DayID = null;
    weekDay.Key = moment(currentDay)
      .add(i, 'd')
      .format('DD-MMM-YYYY');
    weekDay.Status = 0;
    weekDay.TimesheetDateColumn = null;
    weekDay.Value = '';
    weekArray.push(weekDay);
  }
  return weekArray;
};

const filterDataForValidation = async (data, todayDate) => {
  let dataContainer = [];
  data.map((tile) => {
    if (
      tile.lstColumns[
        tile.lstColumns.findIndex((item) => item.Key == todayDate)
      ]?.DID == 0 ||
      (tile.TodayDate !== undefined && tile.TodayDate !== todayDate)
    ) {
    } else {
      dataContainer.push(tile);
    }
  });
  return dataContainer;
};

export const validateData2 = async (data, todayDate) => {
  let dataContainer = await filterDataForValidation(data, todayDate);
  return validateData(dataContainer, todayDate);
};

export const validateData = (
  data,
  todayDate,
  dayTypes,
  saveType,
  projectList
) => {
  let weekDays = data.lstColumns;
  let todayRecords = weekDays.find((item) => item.Key == todayDate);
  let isWorkingDay =
    dayTypes?.find((rec) => rec?.StartDate == todayRecords.Key)?.DayID == 1 ||
    dayTypes?.find((rec) => rec?.StartDate == todayRecords.Key)?.DayID == 5;
  if (
    (isWorkingDay && todayRecords.Value != 0) ||
    (isWorkingDay &&
      todayRecords.ProjectCode != 'NO-PRJ' &&
      projectList.length > 1) ||
    (isWorkingDay && todayRecords.ActivityCode != 0)
  ) {
    if (todayRecords.Value !== 0 && todayRecords.Value.trim() !== '') {
      if (todayRecords.ProjectCode !== 'NO-PRJ') {
        if (
          todayRecords.ActivityCode == 0 ||
          todayRecords.ActivityCode.trim() == ''
        ) {
          arrayContainer.push('Please select activity for date : ' + todayDate);
        }
      } else {
        if (projectList.length > 1) {
          arrayContainer.push(
            'Please select Project Code for date : ' + todayDate
          );
        }
      }
    } else {
      arrayContainer.push('Please select hours for date : ' + todayDate);
    }
  }
};

export const validateDataForSubmit = async (
  data,
  recordData,
  saveType,
  empData,
  dayTypes
) => {
  let errorArray = [];
  let dataToValidate = await prepareTimeSheetData2(data);
  if (saveType == 'Submit') {
    recordData[0].lstColumns.map((item) => {
      let isWorkingDay =
        dayTypes?.find((rec) => rec?.StartDate == item.Key)?.DayID == 1 ||
        dayTypes?.find((rec) => rec?.StartDate == item.Key)?.DayID == 5;
      let isHalfDay =
        dayTypes?.find((rec) => rec?.StartDate == item.Key)?.DayID == 5;
      let dayWiseData = dataToValidate.filter(
        (data) => data.TimesheetDate == item.Key
      );
      let hoursPerDay = dayWiseData.reduce(
        (a, b) => a + parseFloat(b.EffortHrs !== '' ? b.EffortHrs : 0),
        0
      );
      let mandatoryHours = isHalfDay
        ? empData.empData[0].MinHourHalfDay
        : empData.empData[0].MinHourFullDay;
      if (hoursPerDay < mandatoryHours && isWorkingDay) {
        errorArray.push(
          'Hours cannot be less than ' + mandatoryHours + ' on ' + item.Key
        );
      }
    });
  }
  return errorArray;
};

export const validateData4 = async (
  data,
  recordData,
  saveType,
  empData,
  dayTypes,
  currentDay,
  projectList
) => {
  let holder = [];
  let todayData = [];
  data.map((tile) => {
    holder.push(...tile.lstColumns);
  });
  // todayData.push(...holder.filter((item)=>item.Key == currentDay));
  todayData.push(...holder);
  arrayContainer = [];
  if (saveType === 'Save') {
    let todayHours = todayData.reduce(
      (a, b) => a + parseFloat(b.Value !== '' ? b.Value : 0),
      0
    );
    if (todayHours < 1) {
      arrayContainer.push('Please fill any record to save!');
    }
  }
  for (let i = 0; i < dayTypes.length; i++) {
    let day = dayTypes[i];
    let dataContainer = await filterDataForValidation(data, day.StartDate);
    let holder = [];
    for (let j = 0; j < dataContainer.length; j++) {
      let rec = dataContainer[j];
      holder.push(rec.lstColumns);
      validateData(rec, day.StartDate, dayTypes, saveType, projectList);
    }
  }
  return arrayContainer;
};

export const getTodayHours = (recordsResponse, currentDay) => {
  return prepareTimeSheetData(recordsResponse).then((rec) => {
    return rec
      .filter((item) => item.TimesheetDate == currentDay)
      .reduce(
        (a, b) => a + parseFloat(b.EffortHrs !== '' ? b.EffortHrs : 0),
        0
      );
  });
};

export const getTodayData = async (recordsResponse, currentDay) => {
  let dataContaier = [];
  let filteredTile = recordsResponse.filter(
    (item) => item?.TodayDate == currentDay
  );
  filteredTile.map((data) => {
    let datas = data.lstColumns.filter((item) => item.Key == currentDay);
    dataContaier.push(...datas);
  });
  return dataContaier;
};

export const getTodayData2 = async (recordsResponse, currentDay) => {
  let dataContaier = [];
  let filteredTile = recordsResponse.filter((item) =>
    item?.TimesheetDate?.split(',').filter((item) => item == currentDay)
  );
  console.log('Filtered title : ', filteredTile);
  filteredTile.map((data) => {
    let datas = data.lstColumns.filter((item) => item.Key == currentDay);
    dataContaier.push(...datas);
  });
  return dataContaier;
};

export const prepareTimeSheetData = (data) => {
  console.log('=== dataprepare', data);
  let records = [];
  data.forEach((item, index) => {
    let weekDays = item.lstColumns;
    for (let i = 0; i < weekDays.length; i++) {
      let week = weekDays[i];
      let record = {};
      record.TID = item.TID === undefined ? 0 : item.TID;
      record.EmpCode = item.EmpCode;
      //  record.SupervisorCode = getsupCode
      record.TimesheetFromDate = item.TimesheetFromDate
        ? item.TimesheetFromDate
        : item.TimesheetDate?.split(',')[0];
      record.TimesheetToDate = item.TimesheetToDate
        ? item.TimesheetToDate
        : item.TimesheetDate?.split(',')[
            item.TimesheetDate?.split(',').length - 1
          ];
      record.ProjectCode = week.ProjectCode;
      record.ActivityCode = week.ActivityCode;
      record.CategoryCode = week.CategoryCode;
      record.ShiftCode = week.ShiftCode;
      record.TimesheetDate = week.Key;
      record.EffortHrs = week.Value;
      record.DayID = week.DayID;
      record.DID = week.DID === -1 ? 0 : week.DID;
      record.Remarks1 = week.Remarks1 ? week.Remarks1 : '';
      records.push(record);
    }
  });
  return records;
};

export const prepareTimeSheet = async (
  data,
  empData,
  rejectionRemarks,
  supervisorCode
) => {
  let records = [];
  let emp = empData?.empData;
  const { EmpCode, IsMultipleSupv } = emp[0];
  data.map((item) => {
    let weekDays = item.lstColumns;
    console.log('weekDays', weekDays);
    for (let i = 0; i < weekDays.length; i++) {
      let week = weekDays[i];
      let record = {};
      record.TID = item.TID == undefined ? 0 : item.TID;
      record.EmpCode = emp ? EmpCode : item.EmpCode;
      record.SupervisorCode = IsMultipleSupv ? supervisorCode : '';
      record.IsMultipleSupv = IsMultipleSupv;
      record.TimesheetFromDate = item.TimesheetFromDate
        ? item.TimesheetFromDate
        : item.TimesheetDate?.split(',')[0];
      record.TimesheetToDate = item.TimesheetToDate
        ? item.TimesheetToDate
        : item.TimesheetDate?.split(',')[
            item.TimesheetDate?.split(',').length - 1
          ];
      record.ProjectCode = week.ProjectCode;
      record.ActivityCode = week.ActivityCode;
      record.CategoryCode = week.CategoryCode;
      record.ShiftCode = week.ShiftCode;
      record.TimesheetDate = week.Key;
      record.EffortHrs = week.Value;
      record.DayID = week.DayID;
      record.DID = week.DID == -1 ? 0 : week.DID;
      record.Remarks = rejectionRemarks ? rejectionRemarks : '';
      console.log('week', record);
      records.push(record);
    }
  });
  return records;
};

export const prepareTimeSheetApprove = async (data, empData) => {
  let records = [];
  let emp = empData?.empData;
  console.log('emp', emp);
  data.map((item) => {
    let weekDays = item.lstColumns;
    for (let i = 0; i < weekDays.length; i++) {
      let week = weekDays[i];
      let record = {};
      record.TID = item.TID == undefined ? 0 : item.TID;
      record.EmpCode = emp ? emp[0].EmpCode : item.EmpCode;
      record.TimesheetFromDate = item.TimesheetFromDate
        ? item.TimesheetFromDate
        : item.TimesheetDate?.split(',')[0];
      record.TimesheetToDate = item.TimesheetToDate
        ? item.TimesheetToDate
        : item.TimesheetDate?.split(',')[
            item.TimesheetDate?.split(',').length - 1
          ];
      record.ProjectCode = week.ProjectCode;
      record.ActivityCode = week.ActivityCode;
      record.CategoryCode = week.CategoryCode;
      record.ShiftCode = week.ShiftCode;
      record.TimesheetDate = week.Key;
      record.EffortHrs = week.Value;
      record.DayID = week.DayID;
      record.DID = week.DID == -1 ? 0 : week.DID;
      record.Remarks1 = '';
      records.push(record);
    }
  });
  return records;
};

export const prepareTimeSheetData2 = async (data) => {
  let records = [];
  data.map((item) => {
    let weekDays = item.lstColumns;
    for (let i = 0; i < weekDays.length; i++) {
      let week = weekDays[i];
      let record = {};
      record.TID = item.TID == undefined ? 0 : item.TID;
      record.EmpCode = item.EmpCode;
      record.TimesheetFromDate = item.TimesheetFromDate
        ? item.TimesheetFromDate
        : item.TimesheetDate?.split(',')[0];
      record.TimesheetToDate = item.TimesheetToDate
        ? item.TimesheetToDate
        : item.TimesheetDate?.split(',')[
            item.TimesheetDate?.split(',').length - 1
          ];
      record.ProjectCode = week.ProjectCode;
      record.ActivityCode = week.ActivityCode;
      record.CategoryCode = week.CategoryCode;
      record.ShiftCode = week.ShiftCode;
      record.TimesheetDate = week.Key;
      record.EffortHrs = week.Value;
      record.DayID = week.DayID;
      record.DID = week.DID == -1 ? 0 : week.DID;
      record.Remarks1 = '';
      records.push(record);
    }
  });
  return records;
};

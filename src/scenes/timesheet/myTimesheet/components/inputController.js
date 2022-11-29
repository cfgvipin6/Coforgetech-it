/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-alert */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { Image, Modal } from 'react-native';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import ActivityIndicatorView from '../../../../GlobalComponent/myActivityIndicator';
import {
  approveRejectTimeSheet,
  deleteTimeSheetRecord,
  getInputControls,
  getLineItemHistory,
  saveSubmitTimeSheet,
} from '../service/timeSheetService';
import {
  addMoreObject,
  getTodayData,
  getTodayData2,
  getTodayHours,
  prepareTimeSheet,
  prepareTimeSheetApprove,
  prepareTimeSheetData,
  validateData4,
  validateDataForSubmit,
} from '../timesheetUtils';
let appConfig = require('../../../../../appconfig');
import { styles } from './style';
import { TimeSheetSaveSubmit } from './TimeSheetSaveSubmit';
import { HistoryView } from '../../../../GlobalComponent/HistoryView/HistoryView';
import moment from 'moment';
import { showToast } from '../../../../GlobalComponent/Toast';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import CustomButton from '../../../../components/customButton';
import images from '../../../../images';
import { Dropdown } from '../../../../GlobalComponent/DropDown/DropDown';
let globalConstants = require('../../../../GlobalConstants');
let actRefs = [];
let projRefs = [];
let catRefs = [];
let shiftRefs = [];
let _panel = React.createRef();
function InputController({
  setSupervisor,
  navigation,
  currentDay,
  loginData,
  startDate,
  endDate,
  onDaySelection,
  empData,
  isComingFromApprovals,
  goBack,
  goForward,
}) {
  const [loading, setLoading] = useState(false);
  const [activityList, setActivityList] = useState([]);
  const [projectList, setProjectList] = useState([]);
  const [projectListReadOnly, setProjectListReadOnly] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [shiftList, setShiftList] = useState([]);
  const [daysColor, setColorTypes] = useState([]);
  const [dayTypes, setDayTypes] = useState([]);
  const [recordsResponse, setRecords] = useState([]);
  const [allApiDone, setApiDone] = useState(false);
  const [bgColor, setBG] = useState('#fff');
  const [projVal, setProjVal] = useState('Select Project');
  const [activityVal, setActivityVal] = useState('Select Activity');
  const [categoryVal, setCategoryVal] = useState('Select Category (Optional)');
  const [historyData, setHistoryData] = useState([]);
  const [historyModalVisible, setHistoryModalVisible] = useState(false);
  const [disable, setDisable] = useState(false);
  const [remarks, setRemarks] = useState('');
  const [todayDate, setTodayDate] = useState('');
  const [isWorkingDay, setWorkingDay] = useState(false);
  const [showRejectionModal, setRejectionModal] = useState(false);
  const [rejectionRemarks, setRejectionRemarks] = useState('');
  const [rejectionData, setRejectionData] = useState({});
  let tempProjectList = [];
  console.log('setSupervisor', setSupervisor);
  const onInputResponse = (response, type, saveSubmitType) => {
    setLoading(false);
    switch (type) {
      case 'Binding':
        setActivityList(
          response.filter(
            (data) =>
              data.SearchText === 'Activity' ||
              data.SearchText === 'ActivityAll'
          )
        );
        setProjectList(
          response.filter((data) => data.SearchText === 'Project')
        );
        setProjectListReadOnly(
          response.filter((data) => data.SearchText === 'Project')
        );
        tempProjectList = response.filter(
          (data) => data.SearchText === 'Project'
        );
        setCategoryList(
          response.filter((data) => data.SearchText === 'Category')
        );

        setShiftList(response.filter((data) => data.SearchText === 'Shift'));
        setColorTypes(response.filter((data) => data.SearchText === 'DayType'));
        fetchData('Days', saveSubmitType);
        break;
      case 'Days':
        setDayTypes(response);
        if (isComingFromApprovals) {
          fetchData('Approvals', saveSubmitType);
        } else {
          fetchData('Records', saveSubmitType);
        }
        break;
      case 'Records':
        if (response && Array.isArray(response) && response.length > 0) {
          response.map((item) => {
            let projRef = React.createRef();
            let actRef = React.createRef();
            let catRef = React.createRef();
            let shiftRef = React.createRef();
            projRefs.push(projRef);
            actRefs.push(actRef);
            catRefs.push(catRef);
            shiftRefs.push(shiftRef);
            if (projectList.length === 1) {
              item.lstColumns.map((eachDay) => {
                eachDay.ProjectCode = projectList[0].Value;
              });
            }
          });
          setRecords(response);
          onDaySelection(response);
          setApiDone(true);
          if (saveSubmitType !== '') {
            if (saveSubmitType === 'Save') {
              showToast('Your records has been saved successfully');
              navigation.pop();
            } else if (saveSubmitType === 'Submit') {
              showToast('Your records has been submitted successfully');
              navigation.pop();
            } else {
              showToast('Some error occurred');
            }
          }
        } else {
          setApiDone(true);
          setTodayDate(currentDay);
        }
        break;
      case 'Approvals':
        if (response && Array.isArray(response) && response.length > 0) {
          console.log('Approval response  : ', response);
          response.map((item) => {
            let projRef = React.createRef();
            let actRef = React.createRef();
            let catRef = React.createRef();
            let shiftRef = React.createRef();
            projRefs.push(projRef);
            actRefs.push(actRef);
            catRefs.push(catRef);
            shiftRefs.push(shiftRef);
            if (projectList.length == 1) {
              item.lstColumns.map((eachDay) => {
                eachDay.ProjectCode = projectList[0].Value;
              });
            }
          });
          setRecords(response);
          onDaySelection(response);
          setApiDone(true);
          if (saveSubmitType !== '') {
            if (saveSubmitType === 'Save') {
              showToast('Your records has been saved successfully');
            } else if (saveSubmitType == 'Submit') {
              showToast('Your records has been submitted successfully');
            } else {
              showToast('Some error occurred');
            }
          }
        } else {
          setApiDone(true);
          setTodayDate(currentDay);
        }
        break;
    }
  };

  useEffect(() => {
    if (recordsResponse.length < 1 && allApiDone) {
      if (recordsResponse.length < 1) {
        addMoreRecord(startDate);
        if (isWorkingDay) {
          addMoreRecord(startDate);
        }
      }
    } else {
      getTodayHours(recordsResponse, currentDay).then((hours) => {
        if (
          hours < 1 &&
          !recordsResponse.find((item) => item.TodayDate === currentDay) &&
          allApiDone
        ) {
          addMoreRecord(startDate);
          if (isWorkingDay) {
            addMoreRecord(startDate);
          }
        }
      });
    }
    onDaySelection(recordsResponse);
    makeDisabled();
  }, [allApiDone]);

  useEffect(() => {
    if (recordsResponse && recordsResponse.length > 0) {
      recordsResponse.map((tile, tileIndex) => {
        let weeks = tile.lstColumns;
        for (let i = 0; i < weeks.length; i++) {
          let day = weeks[i];
          if (day.Key == currentDay) {
            day.Remarks1 = remarks;
          }
          weeks[i] = day;
        }
        recordsResponse[tileIndex].lstColumns = weeks;
      });
      setRecords([...recordsResponse]);
    }
  }, [remarks]);

  const updateProject = () => {
    let projArray = [];
    projectListReadOnly.map((item) => {
      let startDate = moment(
        moment(item.Selected.split(' - ')[0], 'DD-MMM-YYYY').format(
          'DD-MMM-YYYY'
        )
      );
      let endDate = moment(
        moment(item.Selected.split(' - ')[1], 'DD-MMM-YYYY').format(
          'DD-MMM-YYYY'
        )
      );
      if (
        moment(todayDate).isBetween(startDate, endDate) ||
        moment(todayDate).isSame(startDate) ||
        moment(todayDate).isSame(endDate)
      ) {
        projArray.push(item);
      }
    });
    if (projArray?.length > 0) {
      console.log('Setting project in if condition : ', projArray);
      setProjectList(projArray);
    } else {
      setProjectList(projectListReadOnly);
      console.log('Setting project in else condition : ', projectListReadOnly);
    }
  };

  useEffect(() => {
    if (recordsResponse.length < 1 && allApiDone) {
      if (recordsResponse.length < 1) {
        addMoreRecord(startDate);
        addMoreRecord(startDate);
      }
    } else {
      getTodayHours(recordsResponse, currentDay).then((hours) => {
        if (
          hours < 1 &&
          !recordsResponse?.find((item) => item?.TodayDate === currentDay) &&
          allApiDone
        ) {
          if (isWorkingDay) {
            addMoreRecord(startDate);
            addMoreRecord(startDate);
          } else {
            addMoreRecord(startDate);
          }
        }
      });
      makeDisabled();
    }
    onDaySelection(recordsResponse);
    updateProject();
  }, [todayDate]);

  const makeDisabled = () => {
    recordsResponse.map((item) => {
      item.lstColumns.map((day) => {
        if (day?.Status > 1) {
          setDisable(true);
        }
      });
    });
  };

  const onHistoryClose = () => {
    setHistoryModalVisible(false);
  };
  const onHistoryResponse = async (data) => {
    setLoading(false);
    setApiDone(true);
    if (Array.isArray(data)) {
      setHistoryData(data);
      setHistoryModalVisible(true);
    }
  };
  const onProjectSelection = (index, projectValue, tileIndex) => {
    let datatoUpdate = recordsResponse[tileIndex];
    let day = datatoUpdate.lstColumns.find((data) => data.Key === currentDay);
    let idx = datatoUpdate.lstColumns.findIndex(
      (element) => element.Key === currentDay
    );
    let projCode = projectList.find((item) => projectValue === item.Display)
      .Value;
    day.ProjectCode = projCode;
    datatoUpdate.lstColumns[idx] = day;
    recordsResponse[tileIndex] = datatoUpdate;
    setRecords([...recordsResponse]);
  };
  const onActivitySelection = (index, activityValue, tileIndex) => {
    let datatoUpdate = recordsResponse[tileIndex];
    let day = datatoUpdate.lstColumns.find((data) => data.Key === currentDay);
    let idx = datatoUpdate.lstColumns.findIndex(
      (element) => element.Key === currentDay
    );
    let actCode = activityList.find((item) => activityValue === item.Display)
      .Value;
    let statusCode = activityList[index];
    if (day && actCode) {
      day.ActivityCode = actCode;
      day.Selected = activityList[index].Selected;
      datatoUpdate.lstColumns[idx] = day;
      recordsResponse[tileIndex] = datatoUpdate;
      setRecords([...recordsResponse]);
    }
  };

  const onCategorySelection = (index, categoryValue, tileIndex) => {
    let datatoUpdate = recordsResponse[tileIndex];
    let day = datatoUpdate.lstColumns.find((data) => data.Key === currentDay);
    let idx = datatoUpdate.lstColumns.findIndex(
      (element) => element.Key === currentDay
    );
    let catCode = categoryList.find((item) => categoryValue === item.Display)
      .Value;
    day.CategoryCode = catCode;
    datatoUpdate.lstColumns[idx] = day;
    recordsResponse[tileIndex] = datatoUpdate;
    setRecords([...recordsResponse]);
  };
  const onShiftSelection = (index, shiftValue, tileIndex) => {
    let datatoUpdate = recordsResponse[tileIndex];
    let day = datatoUpdate.lstColumns.find((data) => data.Key === currentDay);
    let idx = datatoUpdate.lstColumns.findIndex(
      (element) => element.Key === currentDay
    );
    let shiftCode = shiftList.find((item) => shiftValue === item.Display).Value;

    let restriction = false;

    recordsResponse.map((item) => {
      if (item.TodayDate) {
        getTodayData(recordsResponse, currentDay).then((todayData) => {
          todayData.map((item) => {
            if (shiftCode === '1' && item.ShiftCode === '2') {
              restriction = true;
            }
            if (shiftCode === '2' && item.ShiftCode === '1') {
              restriction = true;
            }
          });
        });
      } else {
        getTodayData2(recordsResponse, currentDay).then((todayData) => {
          todayData.map((item) => {
            if (shiftCode === '1' && item.ShiftCode === '2') {
              restriction = true;
            }
            if (shiftCode === '2' && item.ShiftCode === '1') {
              restriction = true;
            }
          });
        });
      }
    });

    setTimeout(() => {
      if (!restriction) {
        day.ShiftCode = shiftCode;
        datatoUpdate.lstColumns[idx] = day;
        recordsResponse[tileIndex] = datatoUpdate;
        setRecords([...recordsResponse]);
      } else {
        showToast('You can not have Night Shift with Odd Shift');
        shiftRef?.current?.select(-1);
        day.ShiftCode = '0';
        datatoUpdate.lstColumns[idx] = day;
        recordsResponse[tileIndex] = datatoUpdate;
        setRecords([...recordsResponse]);
      }
    }, 1000);
  };

  const updateHours = (index, text) => {
    let datatoUpdate = recordsResponse[index];
    if (datatoUpdate) {
      datatoUpdate.lstColumns.find(
        (item) => item.Key === currentDay
      ).Value = text;
      recordsResponse[index] = datatoUpdate;
      setRecords([...recordsResponse]);
      setTimeout(() => {
        onDaySelection(recordsResponse);
      }, 500);
      getTodayHours(recordsResponse, currentDay).then((hours) => {
        if (hours > empData.empData[0].MaxHourFullDay) {
          return alert(
            `You can not fill more than ${
              empData.empData[0].MaxHourFullDay
            } hours a day!`
          );
        }
      });
    }
  };

  const updateRemarks = (index, text) => {
    let datatoUpdate = recordsResponse[index];
    if (datatoUpdate) {
      datatoUpdate.lstColumns.find(
        (item) => item.Key === currentDay
      ).Remarks1 = text;
      // datatoUpdate.Remarks1 = text;
      recordsResponse[index] = datatoUpdate;
      setRecords([...recordsResponse]);
    }
  };

  const onResponseFailure = (errorMessage) => {
    setLoading(false);
    setTimeout(() => {
      alert(errorMessage[0].Exception);
    }, 1000);
  };
  const addMoreRecord = (stDate) => {
    let projRef = React.createRef();
    let actRef = React.createRef();
    let catRef = React.createRef();
    let shiftRef = React.createRef();
    projRefs.push(projRef);
    actRefs.push(actRef);
    catRefs.push(catRef);
    shiftRefs.push(shiftRef);
    let record = addMoreObject(
      recordsResponse[0],
      loginData,
      currentDay,
      stDate,
      endDate,
      dayTypes
    );
    let projList = tempProjectList.length > 0 ? tempProjectList : projectList;
    if (projList.length === 1) {
      record.lstColumns.map((item) => {
        item.ProjectCode = projList[0].Value;
      });
    }
    recordsResponse.push(record);
    setRecords([...recordsResponse]);
  };

  const deleteSuccessCallBack = (res, tileIndex) => {
    setLoading(false);
    setApiDone(true);
    recordsResponse.splice(tileIndex, 1);
    setRecords((recordsResponse) => [...recordsResponse]);
  };
  const deleteRow = (tileIndex) => {
    setLoading(true);
    setApiDone(false);
    let dataToDelete = recordsResponse[tileIndex].lstColumns.find(
      (item) => item.Key === currentDay
    );
    deleteTimeSheetRecord(
      loginData,
      dataToDelete.DID,
      deleteSuccessCallBack,
      onResponseFailure,
      tileIndex
    );
  };
  const fetchData = async (type, saveSubmitType) => {
    let data = {};
    data.Type = type === 'Binding' || type === 'Days' ? 3 : 4;
    data.StartDate = startDate;
    data.EndDate = endDate;
    data.EmpCode = empData.empData[0].EmpCode;
    setLoading(true);
    await getInputControls(
      loginData,
      data,
      onInputResponse,
      onResponseFailure,
      type,
      saveSubmitType
    );
  };

  const fetchHistory = async (rec) => {
    let TID = rec?.TID;
    if (TID) {
      setApiDone(false);
      setLoading(true);
      await getLineItemHistory(
        loginData,
        TID,
        onHistoryResponse,
        onResponseFailure
      );
    }
  };
  let shiftRef;
  useEffect(() => {
    if (dayTypes.length > 0) {
      let dayFound = dayTypes.find((day) => day.StartDate.includes(currentDay));
      if (dayFound) {
        setBG(dayFound.backGroundColor);
      }
      console.log('Test Data : ', empData.empData[0]);
      setWorkingDay(
        dayTypes?.find((item) => item?.StartDate === currentDay)?.DayID === 1 ||
          dayTypes?.find((item) => item?.StartDate === currentDay)?.DayID ===
            5 ||
          empData.empData[0]?.IsWeekEndAllow === true ||
          empData.empData[0]?.IsHolidayAllow === true
      );
    }
    if (actRefs.length > 0) {
      actRefs.map((item, i) => {
        let response = recordsResponse[i];
        let projRef = projRefs[i];
        let actRef = actRefs[i];
        let catRef = catRefs[i];
        shiftRef = shiftRefs[i];
        let currentObject = response?.lstColumns?.find(
          (item) => item.Key === currentDay
        );

        actRef?.current?.select(
          activityList.findIndex(
            (item) => item.Value === currentObject?.ActivityCode
          )
        );
        if (projRef.current !== null) {
          if (projectList?.length === 1) {
            setProjVal(projectList[0].Display);
          }
          projRef.current.select(
            projectList.findIndex(
              (item) => item.Value === currentObject?.ProjectCode
            )
          );
        }
        if (catRef.current !== null) {
          catRef.current.select(
            categoryList.findIndex(
              (item) => item.Value === currentObject?.CategoryCode
            )
          );
        }

        if (shiftRef.current !== null) {
          shiftRef.current.select(
            shiftList.findIndex(
              (item) => item.Value === currentObject?.ShiftCode
            )
          );
        }
      });
      setTodayDate(currentDay);
    }
  });

  useEffect(() => {
    if (dayTypes.length > 0) {
      dayTypes.map((item) => {
        daysColor.map((colorItem) => {
          if (item.DayID === colorItem.Value) {
            item.backGroundColor = colorItem.Selected;
          }
        });
      });
      setDayTypes(dayTypes);
    }
  }, [allApiDone]);

  const onSaveSubmitSuccess = (data, submitType) => {
    setLoading(false);
    setApiDone(true);
    fetchData('Binding', submitType);
  };
  const saveData = async (data) => {
    console.log('savedata', data);
    let records = [];
    let isRemarksRequired = false;
    let isShiftRequired = false;
    data.map((item) => {
      if (!item.IsMultipleSupv) {
        item.SupervisorName = setSupervisor;
      }
      let weekDays = item.lstColumns;
      if (weekDays) {
        for (let i = 0; i < weekDays.length; i++) {
          let day = weekDays[i];
          if (day.Value !== '' && day.Remarks1 === '' && day.Selected === 1) {
            isRemarksRequired = true;
          }
          // if (day.Value !== '' && day.ShiftCode == '0'){
          //   isShiftRequired = true;
          // }
        }
      }
    });
    if (isRemarksRequired) {
      return alert('Remarks required for selected activity.');
    }
    if (isShiftRequired === true) {
      return alert('Shift code  required for selected day.');
    }
    getTodayHours(recordsResponse, currentDay).then(async (hours) => {
      if (hours > empData.empData[0].MaxHourFullDay) {
        return alert(
          `You can not fill more than ${
            empData?.Result[0]?.MaxHourFullDay
          } hours a day.`
        );
      } else {
        let errorMessage = await validateData4(
          data,
          recordsResponse,
          'Save',
          empData,
          dayTypes,
          currentDay,
          projectList
        );
        if (errorMessage && errorMessage.length > 0) {
          return alert(errorMessage[0]);
        }
        setLoading(true);
        setApiDone(false);
        //added in formdata
        //  let supervisorCodeValue =setSupervisor
        // const [code,name]  =supervisorCodeValue.split(":");
        let recordData = await prepareTimeSheetData(data, empData);
        saveSubmitTimeSheet(
          loginData,
          recordData,
          onSaveSubmitSuccess,
          onResponseFailure,
          'Save'
        );
      }
    });
  };
  const onApprovalRejectSuccess = (data, submitType) => {
    setLoading(false);
    if (data[0].OUTPUT === 'SUCCESS') {
      showToast(data[0].OUTPUT);
      navigation.pop();
    }
  };
  const onApproveData = async (data) => {
    let saveError = await validateData4(
      data,
      recordsResponse,
      'Save',
      empData,
      dayTypes,
      currentDay,
      projectList
    );
    if (saveError.length < 1) {
      let errorMessage = await validateDataForSubmit(
        data,
        recordsResponse,
        'Submit',
        empData,
        dayTypes
      );
      if (errorMessage && errorMessage.length > 0) {
        return alert(errorMessage[0]);
      }
      setLoading(true);
      setApiDone(false);
      let recordData,
        updatedData = null;
      try {
        recordData = await prepareTimeSheet(data, empData);
        console.log('prepareTimeSheet onApproveData', recordData);
      } catch (error) {
        console.log('onApproveData', error);
      }

      try {
        updatedData = await prepareTimeSheetApprove(data, empData);
        console.log('prepareTimeSheetApprove', updatedData);
      } catch (error) {
        console.log('prepareTimeSheetApprove error', error);
      }
      approveRejectTimeSheet(
        loginData,
        recordData,
        onApprovalRejectSuccess,
        onResponseFailure,
        'Submit',
        updatedData
      );
    } else {
      return alert(saveError[0]);
    }
  };

  const onSubmitTimeSheet = async () => {
    setRejectionModal(false);
    try {
      let data = rejectionData;
      let saveError = await validateData4(
        data,
        recordsResponse,
        'Save',
        empData,
        dayTypes,
        currentDay,
        projectList
      );
      if (saveError.length < 1) {
        let errorMessage = await validateDataForSubmit(
          data,
          recordsResponse,
          'Submit',
          empData,
          dayTypes
        );
        if (errorMessage && errorMessage.length > 0) {
          return alert(errorMessage[0]);
        }
        setLoading(true);
        setApiDone(false);
        let recordData = await prepareTimeSheet(
          data,
          empData,
          rejectionRemarks
        );
        console.log('prepareTimeSheet response', recordData);
        approveRejectTimeSheet(
          loginData,
          recordData,
          onApprovalRejectSuccess,
          onResponseFailure,
          'Reject'
        );
      } else {
        return alert(saveError[0]);
      }
    } catch (error) {
      console.log('on submit timesheet', error);
    }
  };

  const showRejectionModalPopup = () => {
    return (
      <Modal
        visible={showRejectionModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setRejectionModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.innerModalContainer}>
            <TouchableOpacity
              style={{ alignSelf: 'flex-end' }}
              onPress={() => setRejectionModal(false)}
            >
              <Icon name="close" size={35} color="red" />
            </TouchableOpacity>
            <Text style={styles.remarksText2}>Rejection Remarks !</Text>
            <TouchableWithoutFeedback
              onPress={() => Keyboard.dismiss()}
              accessible={false}
            >
              <TextInput
                placeholder={'Rejection remarks!'}
                value={rejectionRemarks}
                onChangeText={(text) => setRejectionRemarks(text)}
                style={styles.remarksStyle2}
                multi
                line={true}
              />
            </TouchableWithoutFeedback>
            <View style={{ marginTop: 10 }}>
              <CustomButton
                label={globalConstants.SUBMIT_TEXT}
                positive={true}
                performAction={() => onSubmitTimeSheet()}
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  };
  const onRejectData = async (data) => {
    setRejectionData(data);
    setRejectionModal(true);
  };
  const submitData = async (data) => {
    let saveError = await validateData4(
      data,
      recordsResponse,
      'Save',
      empData,
      dayTypes,
      currentDay,
      projectList
    );
    if (saveError.length < 1) {
      let errorMessage = await validateDataForSubmit(
        data,
        recordsResponse,
        'Submit',
        empData,
        dayTypes
      );
      if (errorMessage && errorMessage.length > 0) {
        return alert(errorMessage[0]);
      }
      setLoading(true);
      setApiDone(false);
      //added in formdata
      let supervisorCodeValue = setSupervisor;
      const [supervisorCode, SupervisorName] = supervisorCodeValue
        ? supervisorCodeValue.split(':')
        : '';

      console.log(supervisorCode);

      let recordData = await prepareTimeSheet(
        data,
        empData,
        '',
        supervisorCode
      );

      saveSubmitTimeSheet(
        loginData,
        recordData,
        onSaveSubmitSuccess,
        onResponseFailure,

        'Submit'
      );
    } else {
      return alert(saveError[0]);
    }
  };
  useEffect(() => {
    fetchData('Binding', '');
  }, []);
  if (allApiDone) {
    return (
      <View style={styles.container}>
        <View style={styles.dateHolder}>
          <Text
            style={{
              fontWeight: '700',
              textDecorationLine: 'underline',
              alignSelf: 'center',
            }}
          >
            {currentDay}
          </Text>
          {recordsResponse[0]?.TID && (
            <TouchableOpacity
              style={styles.historyButton}
              onPress={() => fetchHistory(recordsResponse[0])}
            >
              <Icon
                name={'history'}
                size={40}
                color={appConfig.DARK_BLUISH_COLOR}
              />
            </TouchableOpacity>
          )}
        </View>

        <KeyboardAwareScrollView>
          {recordsResponse.map((tile, index) => {
            if (
              tile.lstColumns[
                tile.lstColumns.findIndex((item) => item.Key === currentDay)
              ]?.DID === 0 ||
              (tile.TodayDate !== undefined && tile.TodayDate !== currentDay)
            ) {
              return null;
            }
            if (isWorkingDay) {
              return (
                <View>
                  {!disable && (
                    <TouchableOpacity
                      style={{ alignSelf: 'flex-end', marginRight: 10 }}
                      disabled={disable}
                      onPress={() => {
                        deleteRow(index);
                      }}
                    >
                      <Icon name="delete" size={22} color="red" />
                    </TouchableOpacity>
                  )}
                  <View key={index} style={[styles.tileContainer]}>
                    <View style={styles.tileInnerContainer}>
                      {/* <View style={styles.rowHolder}> */}
                      <View>
                        <View style={styles.recordDropIcon1Style}>
                          <View
                            style={{
                              flex: 0.6,
                              backgroundColor: '#E5F2FD',
                              borderTopLeftRadius: 5,
                            }}
                          >
                            <Text style={styles.dropdownText}>
                              Project code
                            </Text>
                          </View>
                          <View style={styles.rowHolder}>
                            <Dropdown
                              dropDownWidth={'100%'}
                              forwardedRef={projRefs[index]}
                              dropDownData={projectList.map(
                                (project) => project.Display
                              )}
                              dropDownCallBack={(idx, value) =>
                                onProjectSelection(idx, value, index)
                              }
                            />
                          </View>
                        </View>
                        <View style={styles.recordDropIcon1Style}>
                          <View
                            style={{ flex: 0.6, backgroundColor: '#E5F2FD' }}
                          >
                            <Text style={styles.dropdownText}>Activity</Text>
                          </View>
                          <View style={styles.rowHolder}>
                            <Dropdown
                              dropDownWidth={'100%'}
                              forwardedRef={actRefs[index]}
                              dropDownData={activityList.map(
                                (activity) => activity.Display
                              )}
                              dropDownCallBack={(idx, value) =>
                                onActivitySelection(idx, value, index)
                              }
                            />
                          </View>
                        </View>
                      </View>
                      <View style={styles.recordDropIcon1Style}>
                        <View style={{ flex: 0.6, backgroundColor: '#E5F2FD' }}>
                          <Text style={styles.dropdownText}>Category</Text>
                        </View>
                        <View style={styles.rowHolder}>
                          <Dropdown
                            dropDownWidth={'100%'}
                            forwardedRef={catRefs[index]}
                            dropDownData={categoryList.map(
                              (category) => category.Display
                            )}
                            dropDownCallBack={(idx, value) =>
                              onCategorySelection(idx, value, index)
                            }
                          />
                        </View>
                      </View>

                      <View style={styles.recordDropIcon1Style}>
                        <View style={{ flex: 0.6, backgroundColor: '#E5F2FD' }}>
                          <Text style={styles.dropdownText}>Shift</Text>
                        </View>
                        <View style={styles.rowHolder}>
                          <Dropdown
                            dropDownWidth={'100%'}
                            forwardedRef={shiftRefs[index]}
                            dropDownData={shiftList.map(
                              (shift) => shift.Display
                            )}
                            onDropdownWillShow={(data) => {}}
                            dropDownCallBack={(idx, value) => {
                              return onShiftSelection(idx, value, index);
                            }}
                          />
                        </View>
                      </View>

                      <View style={styles.rowHolder}>
                        <View
                          style={{ flex: 0.65, backgroundColor: '#E5F2FD' }}
                        >
                          <Text style={styles.dropdownText}>Hours</Text>
                        </View>
                        <TextInput
                          editable={isComingFromApprovals ? true : !disable}
                          placeholder={globalConstants.HOURS_TEXT}
                          placeholderTextColor={'grey'}
                          value={
                            recordsResponse[index].lstColumns &&
                            recordsResponse[index].lstColumns.find(
                              (item) => currentDay === item.Key
                            )
                              ? recordsResponse[index].lstColumns.find(
                                  (item) => currentDay === item.Key
                                ).Value
                              : ''
                          }
                          // maxLength={2}
                          keyboardType={'numeric'}
                          onChangeText={(text) => {
                            updateHours(index, text);
                          }}
                          style={styles.hourTextStyle}
                        />
                      </View>

                      <TextInput
                        placeholder={
                          globalConstants.REMARKS_TEXT +
                          globalConstants.OPTIONAL_TEXT_WITH_BRACES
                        }
                        editable={isComingFromApprovals ? true : !disable}
                        multiline={true}
                        value={
                          recordsResponse[index]?.lstColumns?.find(
                            (item) => currentDay === item.Key
                          )?.Remarks1
                            ? recordsResponse[index].lstColumns.find(
                                (item) => currentDay === item.Key
                              ).Remarks1
                            : ''
                        }
                        maxLength={100}
                        onChangeText={(text) => {
                          updateRemarks(index, text);
                        }}
                        style={styles.remarksStyle}
                      />
                    </View>

                    <View />
                  </View>
                </View>
              );
            } else {
              return (
                <View
                  style={[
                    styles.holidayContainer,
                    { backgroundColor: bgColor },
                  ]}
                >
                  <Text style={styles.holidayText}>
                    {
                      dayTypes.find((item) => item.StartDate === currentDay)
                        .DayType
                    }
                  </Text>
                </View>
              );
            }
          })}
        </KeyboardAwareScrollView>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {isWorkingDay ? (
            <View style={styles.addButtonContainer}>
              {!disable && (
                <TouchableOpacity
                  onPress={() => {
                    let errors = [];
                    getTodayData(recordsResponse, currentDay).then(
                      (todayData) => {
                        todayData.map((item) => {
                          if (item.Value === 0) {
                            errors.push('Please fill hours in given record');
                          } else if (item.ActivityCode === 0) {
                            errors.push(
                              'Please select Activity Code in given record'
                            );
                          } else if (item.ProjectCode === 'NO-PRJ') {
                            errors.push(
                              'Please select Project code in given record'
                            );
                          }
                        });
                        if (errors.length < 1) {
                          addMoreRecord(startDate);
                        } else {
                          alert(errors[0]);
                        }
                      }
                    );
                  }}
                  style={styles.addButtonContainer2}
                >
                  <Icon
                    name="plus-circle-outline"
                    size={20}
                    color={appConfig.DARK_BLUISH_COLOR}
                  />
                  <Text style={{ color: appConfig.DARK_BLUISH_COLOR }}>
                    Add More Row
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <View style={styles.addButtonContainer} />
          )}
          <View
            style={{
              flexDirection: 'row',
              alignSelf: 'flex-end',
              marinRight: 10,
              marginBottom: 5,
            }}
          >
            <TouchableOpacity onPress={() => goBack()}>
              <Image source={images.orangeLeft} />
            </TouchableOpacity>

            <TouchableOpacity
              style={{ marginHorizontal: 5 }}
              onPress={() => goForward()}
            >
              <Image source={images.orangeRight} />
            </TouchableOpacity>
          </View>
        </View>
        <TimeSheetSaveSubmit
          recordData={recordsResponse}
          loginData={loginData}
          daysData={dayTypes}
          onSaveData={(data) => saveData(data)}
          onSubmitData={(data) => submitData(data)}
          onApproveData={(data) => onApproveData(data)}
          onRejectData={(data) => onRejectData(data)}
          disable={disable}
          isWorkingDay={isWorkingDay}
          isComingFromApprovals={isComingFromApprovals}
        />
        {historyData.length > 0 && (
          <HistoryView
            historyData={historyData}
            forwardedRef={_panel}
            isComingFromVoucher={false}
            visibility={historyModalVisible}
            onClose={() => onHistoryClose()}
          />
        )}
        {showRejectionModalPopup()}
      </View>
    );
  } else {
    return <ActivityIndicatorView loader={loading} />;
  }
}
const mapStateToProps = (state) => {
  return {
    loginData: state && state.loginReducer && state.loginReducer.loginData,
  };
};
export default connect(
  mapStateToProps,
  null
)(InputController);

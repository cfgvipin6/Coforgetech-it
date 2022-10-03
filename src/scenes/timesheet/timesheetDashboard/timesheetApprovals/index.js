import React, { useCallback, useEffect, useState } from 'react';
import { Alert, ImageBackground, Modal, RefreshControl, Text, View } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { FlatList } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-navigation';
import CustomButton from '../../../../components/customButton';
import { globalFontStyle } from '../../../../components/globalFontStyle';
import ActivityIndicatorView from '../../../../GlobalComponent/myActivityIndicator';
import SubHeader from '../../../../GlobalComponent/SubHeader';
import { showToast } from '../../../../GlobalComponent/Toast';
import images from '../../../../images';
import { writeLog } from '../../../../utilities/logger';
import { fetchEmpDetails, fetchTimeSheetApprovals } from '../../myTimesheet/service/timeSheetService';
import { EMP_CODE, EMP_NAME, WEEK_NAME } from '../constants';
import { styles } from './styles';
let globalConstants = require('../../../../GlobalConstants');

export const TimeSheetApprovals = (props) => {
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [localTimeSheetData, setLocalTimeSheetData] = useState([]);
  const [localTimeSheetSearchData, setLocalTimeSheetSearchData] = useState([]);
  const [isRefreshing, setRefreshing] = useState(false);
  const [empArray, setEmpArray] = useState([]);

  const handleBack = () => {
    writeLog('Clicked on ' + 'handleBack' + ' of ' + 'TimeSheetApprovals');
    props.navigation.pop();
  };

  const renderTimeSheetRow = (item, index) => {
    console.log('Time sheet row data : ', item);
    return (
      <ImageBackground style={styles.cardBackground} resizeMode="cover">
        <View style={styles.view_One}>
          <View style={styles.rowStyle}>
            <Text
              style={[globalFontStyle.imageBackgroundLayout, styles.textOne]}
            >
              {EMP_CODE}
            </Text>
            <Text
              style={[globalFontStyle.imageBackgroundLayout, styles.textTwo]}
            >
              {item.EmpCode == undefined ? '' : item.EmpCode}
            </Text>
          </View>

          <View style={styles.rowStyle}>
            <Text
              style={[globalFontStyle.imageBackgroundLayout, styles.textOne]}
            >
              {EMP_NAME}
            </Text>
            <Text
              style={[globalFontStyle.imageBackgroundLayout, styles.textTwo]}
            >
              {item.EmpName == undefined ? '' : item.EmpName}
            </Text>
          </View>

          <View style={styles.rowStyle}>
            <Text
              style={[globalFontStyle.imageBackgroundLayout, styles.textOne]}
            >
              {WEEK_NAME}
            </Text>
            <Text
              style={[globalFontStyle.imageBackgroundLayout, styles.textTwo]}
            >
              {item.WeekName == undefined ? '' : item.WeekName}
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <View style={styles.button}>
              <CustomButton
               label={globalConstants.PROCEED_TEXT}
               positive={true}
                performAction={() => approveAction(globalConstants.APPROVED_TEXT, item)}
              />
            </View>
          </View>
        </View>
      </ImageBackground>
    );
  };

  const approveAction = (action,item)=>{
    props.navigation.navigate('MyTimesheet5', {
      empData:[item],
      selectedWeek: item.WeekName,
      isComingFromApprovals:true,
    });
  };
  useEffect(()=>{
   const fetchEmployees =  async ()=>{
      let startDate = localTimeSheetSearchData[0].WeekName.split(' - ')[0];
      let endDate = localTimeSheetSearchData[0].WeekName.split(' - ')[1];
     let emps = await fetchEmpDetails(startDate,endDate);
     setEmpArray(emps.Result);
    };
    fetchEmployees();
  },[localTimeSheetSearchData]);

  const onRefresh = () => {
    fetchApprovals();
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const showApprovals = () => {
    if (localTimeSheetData.length > 0) {
      return (
        <View style={globalFontStyle.listContentViewGlobal}>
          <FlatList
            contentContainerStyle={globalFontStyle.listContentGlobal}
            data={localTimeSheetData}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => renderTimeSheetRow(item, index)}
            keyExtractor={(item, index) =>
              'timesheetApprovals_' + index.toString()
            }
            ItemSeparatorComponent={() => (
              <View style={globalFontStyle.listContentSeparatorGlobal} />
            )}
            refreshControl={
              <RefreshControl onRefresh={onRefresh} refreshing={isRefreshing} />
            }
          />
        </View>
      );
    }
  };

  const fetchApprovals = useCallback(async () => {
    let approvals = await fetchTimeSheetApprovals();
    if (approvals?.Result && approvals.Result.length > 0) {
      setLocalTimeSheetData(approvals.Result);
      setLocalTimeSheetSearchData(approvals.Result);
    }
    else {
      setLocalTimeSheetData([]);
      setLocalTimeSheetSearchData([]);
      Alert.alert('No Records','No Records found to approve!',[
       {
         text:'Ok',
         onPress:()=>props.navigation.pop(),
        },
      ]);
    }
  },[props.navigation]);

  useEffect(() => {
     props.navigation.addListener('didFocus', () => {
      fetchApprovals();
      console.log('Fetch approvals call');
    });
  }, [fetchApprovals, props.navigation]);
  useEffect(() => {
    console.log('Time sheet data : ', localTimeSheetSearchData);
    const filteredData = localTimeSheetSearchData.filter((element) => {
      let str1 = element.EmpCode;
      let str2 = element.EmpName.trim();
      let str3 = element.WeekName.trim();
      let searchedText = str1.concat(str2).concat(str3);
      let elementSearched = searchedText.toString().toLowerCase();
      let queryLowerCase = query.toString().toLowerCase();
      return elementSearched.indexOf(queryLowerCase) > -1;
    });
    setLocalTimeSheetData(filteredData);
  }, [localTimeSheetSearchData, query]);

  const updateSearch = (searchText) => {
    setQuery(searchText);
  };

  return (
    <ImageBackground
      style={{flex:1}}
      source={images.loginBackground}
    >
    <SafeAreaView style={styles.container}>
      <ActivityIndicatorView loader={loading} />
      <View style={globalFontStyle.subHeaderViewGlobal}>
        <SubHeader
          pageTitle={globalConstants.TIMESHEET_APPROVALS}
          backVisible={true}
          logoutVisible={true}
          handleBackPress={() => handleBack()}
          navigation={props.navigation}
        />
      </View>
      <View style={globalFontStyle.searchViewGlobal}>
        <SearchBar
          lightTheme
          placeholder={'Search by document number'}
          onChangeText={updateSearch}
          value={query}
          raised={true}
          containerStyle={globalFontStyle.searchGlobal}
          autoCapitalize="none"
            autoCompleteType="off"
            autoCorrect={false}
        />
      </View>
      <View style={globalFontStyle.contentViewGlobal}>{showApprovals()}</View>
    </SafeAreaView>
    </ImageBackground>
  );
};

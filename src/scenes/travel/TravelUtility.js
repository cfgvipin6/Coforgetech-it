import { moderateScale } from '../../components/fontScaling.js';
import { styles } from './styles.js';
import {
  DOCUMENT_NUMBER,
  EMPLOYEE_NAME,
  DEPARTURE_DATE,
  RETURN_DATE,
  VISIT_TYPE,
  TOUR_TYPE,
  ITINERARY,
} from './constants.js';
import React, { Component } from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  TextInput,
  Alert,
} from 'react-native';
import { SearchBar, Image, Icon } from 'react-native-elements';
import { globalFontStyle } from '../../components/globalFontStyle.js';
import UserMessage from '../../components/userMessage.js';
let globalConstants = require('../../GlobalConstants');
let appConfig = require('../../../appconfig');

export const userDetail = (empData) => {
  let deptDate = empData.DeptDate.replace(/-/g, ' ');
  let returnDate = empData.ReturnDate.replace(/-/g, ' ');
  return (
    <View style={{ marginTop: moderateScale(6) }}>
      <ImageBackground style={styles.cardBackground} resizeMode="cover">
        <View style={styles.cardStyle}>
          {this.userDetailGridView(DOCUMENT_NUMBER, empData.DocumentNo.trim())}
          {this.userDetailGridView(
            EMPLOYEE_NAME,
            empData.DocOwnerCode.trim() + ' : ' + empData.DocOwnerName.trim()
          )}
          {this.userDetailGridView(ITINERARY, empData.Itinerary.trim())}
          {this.userDetailGridView(DEPARTURE_DATE, deptDate)}
          {this.userDetailGridView(RETURN_DATE, returnDate)}
          {this.userDetailGridView(VISIT_TYPE, empData.VisitType)}
          {this.userDetailGridView(TOUR_TYPE, empData.TourType)}
        </View>
      </ImageBackground>
    </View>
  );
};

userDetailGridView = (itemName, itemValue) => {
  if (itemValue != '' && itemValue != undefined && itemValue != null) {
    return (
      <View style={{ flexDirection: 'row' }}>
        <Text style={[styles.textOne, globalFontStyle.imageBackgroundLayout]}>
          {itemName}
        </Text>
        <Text style={[styles.textTwo, globalFontStyle.imageBackgroundLayout]}>
          {itemValue}
        </Text>
      </View>
    );
  } else {
    return null;
  }
};

export const submitToAction = (state, updateRequestorOptionList) => {
  let label =
    state.selectedRequestorOption === null
      ? 'Select'
      : state.selectedRequestorOption;
  if (state.action === 'Approved') {
    return (
      <View style={styles.actionButton}>
        <Text style={styles.actionText}>Submit to:</Text>
        <TouchableOpacity
          style={styles.actionClick}
          onPress={() => {
            updateRequestorOptionList();
          }}
        >
          <View style={styles.rowFashion2}>
            <Text>{label}</Text>
            <Icon name="arrow-drop-down" size={30} />
          </View>
        </TouchableOpacity>
      </View>
    );
  } else {
    return null;
  }
};

export const getRequestorOptionList = (parameter, state, fetchData) => {
  let data = [];
  if (parameter === 'requestorOptionList') {
    data = state.requestorListArray;
  } else if (parameter == 'supervisorList') {
    data = state.supervisorList;
    data = data.sort((a, b) => a.EmployeeId - b.EmployeeId); // sorting data on basis of employeeid
  }
  // console.log("Requester List array : " ,data);
  let requiredWidth = parameter == 'supervisorList' ? '100%' : '90%';
  return (
    <View style={[styles.requestorListContainer, { width: requiredWidth }]}>
      <FlatList
        contentContainerStyle={{ width: '100%' }}
        data={data}
        extraData={state}
        renderItem={(item) => renderListView(item, parameter, fetchData)} //Onsite?rop
        ItemSeparatorComponent={() => (
          <Image
            style={styles.separator}
            source={require('../../assets/divHorizontal.png')}
          />
        )}
      />
    </View>
  );
};

export const getRequestorListArray = (parent, empData) => {
  let requestorListArray = [];
  if (empData.DocumentType === 'I') {
    if (empData.IsApprovingAuthority === 'Y') {
      requestorListArray.push('Supervisor');
      requestorListArray.push('Approving Authority');
      requestorListArray.push('Travel Desk');
    } else {
      requestorListArray.push('Supervisor');
      requestorListArray.push('Approving Authority');
    }
  } else if (empData.DocumentType === 'D') {
    if (empData.IsShotNotice === 'Y') {
      requestorListArray.push('Supervisor');
      requestorListArray.push('Approving Authority');
      if (empData.IsApprovingAuthority === 'Y') {
        requestorListArray.push('Travel Desk');
      }
    } else {
      requestorListArray.push('Supervisor');
      requestorListArray.push('Travel Desk');
    }
  }
  parent.setState({
    requestorListArray,
  });
};
const getData = (item, parameter, fetchData) => {
  console.log('Item : ', item);
  console.log('Parameter : ', parameter);
  console.log('FetchData : ', fetchData);
  fetchData(item, parameter);
};
const renderListView = (item, parameter, fetchData) => {
  let dataToDisplay;
  if (parameter == 'requestorOptionList') {
    dataToDisplay = item.item;
  } else if (parameter == 'supervisorList') {
    dataToDisplay = item.item.EmpName;
  }
  return (
    <View style={styles.itemList}>
      <TouchableOpacity
        onPress={() => getData(item, parameter, fetchData)}
        style={{
          paddingLeft: 10,
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: 'row',
        }}
      >
        <Text>{dataToDisplay}</Text>
        <Icon name={'chevron-right'} />
      </TouchableOpacity>
    </View>
  );
};

export const displaySelectedRequestorField = (
  state,
  toggleSuperVisor,
  updateSearch
) => {
  if (state.action === 'Approved') {
    if (state.displaySupervisorList) {
      const { query } = state;
      return (
        <SearchBar
          lightTheme
          placeholder={'Enter Emp Code or Name to search'}
          onChangeText={updateSearch}
          value={query}
          raised={true}
          containerStyle={styles.searchBar}
          autoCapitalize="none"
          autoCompleteType="off"
          autoCorrect={false}
        />
      );
    } else if (
      state.displaySelectedRequestor &&
      state.selectedRequestor.EmpName != null
    ) {
      return (
        <TouchableOpacity
          style={styles.selectedListClick}
          onPress={() => {
            toggleSuperVisor();
          }}
        >
          <View style={styles.rowFashion2}>
            <Text>{state.selectedRequestor.EmpName}</Text>
            <Icon
              style={{ marginRight: 10 }}
              size={30}
              name="arrow-drop-down"
            />
          </View>
        </TouchableOpacity>
      );
    }
  }
};

export const renderRequestorList = (state, fetchData) => {
  if (state.action === 'Approved') {
    if (
      state.displaySupervisorList &&
      state.supervisorList &&
      state.supervisorList.length > 0
    ) {
      return (
        <View style={{ height: '80%', marginTop: 5 }}>
          {this.renderList('supervisorList', state, fetchData)}
        </View>
      );
    }
  }
};

renderList = (parameter, state, fetchData) => {
  let data = [];
  let requiredLength;
  let requiredHeight;
  if (parameter == 'requestorOptionList') {
    data = state.requestorListArray;
  } else if (parameter == 'supervisorList') {
    data = state.supervisorList;
    requiredLength = data.length;
    data = data.sort((a, b) => a.EmployeeId - b.EmployeeId); // sorting data on basis of employeeid
  }
  switch (requiredLength) {
    case 1:
      requiredHeight = '10%';
      break;
    case 2:
      requiredHeight = '20%';
      break;
    default:
      requiredHeight = '35%';
      break;
  }
  return (
    <View
      style={
        parameter === 'supervisorList'
          ? { ...styles.requestorListContainer, height: requiredHeight }
          : styles.requestorListContainer
      }
    >
      <FlatList
        contentContainerStyle={{ flex: 0, width: '100%' }}
        data={data}
        extraData={state}
        renderItem={(item) => renderListView(item, parameter, fetchData)} //Onsite?rop
        ItemSeparatorComponent={() => (
          <Image
            source={require('../../assets/divHorizontal.png')}
            style={styles.pendingItem}
          />
        )}
      />
    </View>
  );
};

export const renderRemarksView = (refs) => {
  return (
    <View style={styles.remarksParent}>
      <TextInput
        multiline={true}
        maxLength={200}
        onChangeText={(text) => refs.setState({ remarks: text })}
        value={refs.state.remarks}
        placeholder="Remarks"
        style={{
          width: '100%',
          paddingLeft: 10,
          paddingTop: 10,
          paddingBottom: 10,
        }}
      />
    </View>
  );
  // if (!refs.state.displaySupervisorList ){
  //    return (
  //           <View style={styles.remarksParent}>
  // 	          <TextInput
  // 	          multiline={true}
  // 	          maxLength={200}
  // 	          onChangeText={text => refs.setState({ remarks: text })}
  // 	          value={refs.state.remarks}
  // 	          placeholder="Remarks"
  // 	          style={{ width: '100%', paddingLeft: 10 ,paddingTop:10, paddingBottom:10}}
  //         	  />
  //           </View>
  //           );
  //  } else {
  //    return null;
  // }
};

export const renderAdditionalRemarks = (refs) => {
 
  if (
    refs.state.displayAdditionalRemarks ||
    refs.state.selectedRequestorOption == '' ||
    refs.state.selectedRequestorOption == ''
  ) {
    return (
      <View style={styles.remarksParent}>
        <TextInput
          multiline={true}
          maxLength={501}
          onChangeText={(text) => refs.setState({ add_remarks: text })}
          value={refs.state.add_remarks}
          placeholder="Justification for short notice travel"
          style={{
            width: '100%',
            paddingLeft: 10,
            paddingTop: 10,
            paddingBottom: 10,
          }}
        />
      </View>
    );
  }
};

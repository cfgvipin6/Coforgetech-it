import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, Modal, FlatList } from 'react-native';
import { Icon, Button, SearchBar } from 'react-native-elements';
import { Dropdown } from '../../../GlobalComponent/DropDown/DropDown.js';
import { LabelEditTextWithBtn } from '../../../GlobalComponent/LabelEditTextWithBtn/LabelEditTextWithBtn';
import { fetchProjectList } from './utils.js';
import { voucherStyles as styles } from './styles';
let globalConstants = require('../../../GlobalConstants');
let empData;
export const CostCenterProjectSelection = (props) => {
    empData = props.myEmpData[0];
    console.log('UPDATED EMP DATA : ',empData);
    const [projUpdated, setProjUpdated] = useState(false);
    const [costCenterArray, setCostCenterArray] = useState(empData.CostCenterCodeSelectList);
    const [projArray, setProjArray] = useState(empData.ProjectCodeSelectList);
    const [costCenterSearchArray, setCostCenterSearchArray] = useState(empData.CostCenterCodeSelectList);
    const [projSearchArray, setProjSearchArray] = useState(empData.ProjectCodeSelectList);
    const [costCenter, setCostCenter] = useState(empData.CC_CODE.concat('~').concat(empData.CC_TXT));
    const [projCode, setProjCode] = useState(empData.PROJ_CODE.concat('~').concat(empData.PROJ_TXT));
    const [costCenterID, setCostCenterID] = useState(empData.CC_CODE);

  const [projID, setProjID] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalFor, setModalFor] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  //after model opens


  const updateSearch = (searchText) => {
    setSearchQuery(searchText);
  };

  const onProjectFocus = () => {
    setModalVisible(true);
    setModalFor(globalConstants.PROJECT_TEXT);
  };

  //999090, 994208, 999010
  const onCostCenterFocus = () => {
    setModalVisible(true);
    setModalFor(globalConstants.COST_CENTER_TEXT);
  };

  const renderListItem = (item, index) => {
    return (
      <TouchableOpacity
        onPress={() => {
          if (modalFor === globalConstants.PROJECT_TEXT) {
            setProjCode(item.DisplayText);
            setProjID(item.ID);
            props.projectVal(item);
          } else {
            setCostCenter(item.DisplayText);
            setCostCenterID(item.ID);
            setProjCode('');
            setProjID('');
            props.costCenterVal(item);
            //blank proj code here
          }
          setModalVisible(false);
          setModalFor('');
          setSearchQuery('');
        }}
        style={styles.listItem}
      >
        <Text>{item.DisplayText}</Text>
        <View style={styles.supervisorSeparator} />
      </TouchableOpacity>
    );
  };

  const showRequestsView = () => {
    let data = modalFor != '' ? (modalFor === globalConstants.PROJECT_TEXT ? projArray : costCenterArray) : [];
    if (data.length > 0) {
      return (
        <FlatList
          contentContainerStyle={styles.listContentStyle}
          data={data}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => renderListItem(item, index)}
        />
      );
    } else {
      return null;
    }
  };

  const modalSearchView = () => {
    return (
      <View>
        <Modal visible={modalVisible} animationType="slide" transparent={false}>
          <View style={styles.modalContainer}>
            <View style={styles.searchHolder}>
              <SearchBar
                lightTheme
                placeholder="Search projects"
                onChangeText={updateSearch}
                value={searchQuery}
                raised={true}
                containerStyle={styles.searchBarSkills}
                autoCapitalize="none"
            autoCompleteType="off"
            autoCorrect={false}
              />
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  setModalFor('');
                  setSearchQuery('');
                }}
              >
                <Icon name="close" size={35} color="blue" />
              </TouchableOpacity>
            </View>
            {showRequestsView()}
          </View>
        </Modal>
      </View>
    );
  };


  useEffect(() => {
    const checkTypeOfData = () => {
      if (modalFor === globalConstants.PROJECT_TEXT) {
        return projSearchArray;
      } else {return costCenterSearchArray;}
    };
    console.log('Search Query : ', searchQuery);
    const filteredData = checkTypeOfData().filter((element) => {
      let str1 = element.ID.trim();
      let str2 = element.DisplayText.trim();
      let searchedText = str1.concat(str2);
      let elementSearched = searchedText.toString().toLowerCase();
      let queryLowerCase = searchQuery.toString().toLowerCase();
      return elementSearched.indexOf(queryLowerCase) > -1;
    });
    if (modalFor === globalConstants.PROJECT_TEXT) {
      setProjArray(filteredData);
    } else {
      setCostCenterArray(filteredData);
    }
  }, [costCenterSearchArray, modalFor, projSearchArray, searchQuery]);

  useEffect(() => {
    if (empData && empData.DocNo.length > 0 && !projUpdated){
      console.log('EMP DOC NUMBER : ',empData.DocNo);
      setProjUpdated(true);
      setProjCode(empData.PROJ_CODE.concat('~').concat(empData.PROJ_TXT));
      setCostCenter(empData.CC_CODE.concat('~').concat(empData.CC_TXT));
    }
  }, [projUpdated]);

  useEffect(() => {
    fetchProjectList(empData.CO_CODE, costCenterID).then((res) => {
      if (res.length > 0) {
        setProjArray(res);
        setProjSearchArray(res);
      } else {
        setProjArray([]);
        setProjSearchArray([]);
        setProjCode('');
        setProjID('');
        return alert('No project available!');
      }
    });
  }, [costCenter, costCenterID]);

  return (
    <View>
      <LabelEditTextWithBtn
        heading={globalConstants.COST_CENTER_TEXT + globalConstants.ASTERISK_SYMBOL}
        onFocusView={onCostCenterFocus}
        myNumberOfLines={2}
        isMultiline={true}
        myValue={costCenter}
        isSmallFont={true}
        isEditable={props.requestStatus == 3 || props.isFreezed ? false : true}
      />
      <LabelEditTextWithBtn
        heading={globalConstants.PROJECT_TEXT + globalConstants.ASTERISK_SYMBOL}
        placeHolder={'Search Project..'}
        onFocusView={onProjectFocus}
        myNumberOfLines={2}
        isMultiline={true}
        myValue={projCode}
        isSmallFont={true}
        isEditable={props.requestStatus == 3 || props.isFreezed ? false : true}
      />
      {modalSearchView()}
    </View>
  );
};

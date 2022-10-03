import React, { useState, useEffect } from 'react';
import { FlatList } from 'react-native';
import { Modal } from 'react-native';
import { Text, View, StyleSheet,TouchableOpacity } from 'react-native';
import { Icon, SearchBar } from 'react-native-elements';
import { moderateScale } from '../../../components/fontScaling.js';
import { Dropdown } from '../../../GlobalComponent/DropDown/DropDown.js';
import { fetchProjectList } from './utils.js';
let constants = require('../createVoucher/constants');
let globalConstants = require('../../../GlobalConstants');
let appConfig = require('../../../../appconfig');
export const CostCenterProject = (props) => {
  let empData = props.myEmpData;
  let projectText = '';
  if (empData){
    projectText = empData.PROJ_CODE == '' ? 'Select Project' : empData.PROJ_CODE + '~' + empData.PROJ_TXT;
  }
  console.log('CostCenterProject EmpData', empData);
  costCenterRef = React.createRef();
  projectRef = React.createRef();
  const [isCostCenterSearch, setCostCenterSearch] = useState(false);
  const [isProjectSearch, setProjectSearch] = useState(false);
  const [CC_CODE, setCC_Code] = useState(empData.CC_CODE);
  const [CC_TEXT, setCC_Text] = useState(empData.CC_TXT);
  const [costCode, setCostCode] = useState('');
  const [projCode, setProjCode] = useState('');
  const [projText, setProjText] = useState(projectText);
  const [popupVisible, setVisible] = useState(false);
  const [query, setQuery] = useState('');
  const [costCenterData, setCostCenterData] = useState(empData.CostCenterCodeSelectList);
  const [projectData, setProjectData] = useState([]);
  const [localProjectData, setLocalProjectData] = useState([]);
  const [localCostCenterData, setLocalCostCenterData] = useState(empData.CostCenterCodeSelectList);

  const renderCostCenterListItem = (item, index) => {
    return (
      <TouchableOpacity
        onPress={() => {
          setCC_Code(item.DisplayText.split('~')[0]);
          setCC_Text(item.DisplayText.split('~')[1].split(',')[0]);
          setProjText('Select Project');
          console.log('Sending cost center data : ', item);
          props.exportCostCenterString(item);
          setVisible(false);
          setQuery('');
        }}
        style={styles.listItem}>
        <Text>{item.DisplayText}</Text>
        <View style={styles.supervisorSeparator} />
      </TouchableOpacity>
    );
  };

  const renderProjectListItem = (item, index) => {
    return (
      <TouchableOpacity
        onPress={() => {
          setProjCode(item.ID);
          setProjText(item.DisplayText);
          console.log('Sending project data : ', item);
          props.exportProjectString(item);
          setVisible(false);
          setQuery('');
        }}
        style={styles.listItem}>
        <Text>{item.DisplayText}</Text>
        <View style={styles.supervisorSeparator} />
      </TouchableOpacity>
    );
  };

  const showRequestsView = () => {
    if (isCostCenterSearch) {
      return (
        <FlatList
          contentContainerStyle={styles.listContentStyle}
          data={costCenterData}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => renderCostCenterListItem(item, index)}
          keyExtractor={(item, index) => 'pendingRequest_' + index.toString()}
        />
      );
    } else if (isProjectSearch) {
      if (projectData.length > 0) {
        return (
          <FlatList
            contentContainerStyle={styles.listContentStyle}
            data={projectData}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => renderProjectListItem(item, index)}
            keyExtractor={(item, index) => 'pendingRequest_' + index.toString()}
          />
        );
      } else {
        return <Text style={{ textAlign:'center',fontSize:17,marginTop:100}}>No Project found against given cost center code {CC_CODE + '~' + CC_TEXT}</Text>;
      }
    }
  };

  const updateSearch = (searchText) => {
    setQuery(searchText);
  };
  useEffect(() => {
    let dataToSearch = isProjectSearch ? localProjectData : localCostCenterData;
    const filteredData = dataToSearch.filter((element) => {
      let str1 = element.ID.trim();
      let str2 = element.DisplayText.trim();
      let searchedText = str1.concat(str2);
      let elementSearched = searchedText.toString().toLowerCase();
      let queryLowerCase = query.toString().toLowerCase();
      return elementSearched.indexOf(queryLowerCase) > -1;
    });
    console.log('Search Query : ', query);
    console.log('Fileterd data : ', filteredData);
    if (isProjectSearch){
        setProjectData(filteredData);
    } else {
        setCostCenterData(filteredData);
    }
  }, [isProjectSearch, localCostCenterData, localProjectData, query]);
  const getSearchView = () => {
    return (
      <View>
        <Modal
          visible={popupVisible}
          animationType="slide"
          transparent={false}
          onRequestClose={() => {
            setVisible(false);
            setQuery('');
          }}>
          <View style={styles.modalContainer}>
            <View style={styles.searchHolder}>
              <SearchBar
                lightTheme
                placeholder="Search projects"
                onChangeText={(text) => updateSearch(text)}
                value={query}
                raised={true}
                containerStyle={styles.searchBarSkills}
                autoCapitalize="none"
            autoCompleteType="off"
            autoCorrect={false}
              />
              <TouchableOpacity
                onPress={() => {
                  setVisible(false);
                  setQuery('');
                }}>
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
    fetchProjectList(empData.CO_CODE, CC_CODE).then((response) => {
      console.log('Response updated now : ', response);
      setProjectData(response);
      setLocalProjectData(response);
    });
  }, [CC_CODE, empData.CO_CODE]);

  return (
    <View>
      <View style={styles.rowContainer}>
        <Text style={styles.heading}>Cost Center</Text>
        <View style={styles.descContainer}>
          <TouchableOpacity
            onPress={() => {
              setCostCenterSearch(true);
              setProjectSearch(false);
              setVisible(true);
            }}>
            <Text style={styles.description}>{CC_CODE + '~' + CC_TEXT}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.rowContainer}>
        <Text style={styles.heading}>Project*</Text>
        <View style={styles.descContainer}>
          <TouchableOpacity
            onPress={() => {
              setProjectSearch(true);
              setCostCenterSearch(false);
              setVisible(true);
            }}>
            <Text style={styles.description}>{projText}</Text>
          </TouchableOpacity>
        </View>
      </View>
      {getSearchView()}
    </View>
  );
};

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heading: {
    fontWeight: 'bold',
    flex: 1,
    fontSize: 12,
  },
  description: {
    fontSize: 12,
    marginLeft: moderateScale(3),
    paddingVertical: moderateScale(10),
    color: 'blue',
    textDecorationLine: 'underline',
  },
  descContainer: {
    flex: 1,
    // backgroundColor:appConfig.FIELD_BORDER_COLOR,
    borderWidth: 1,
    borderColor: 'grey',
  },
  modalContainer: {
    marginTop: moderateScale(25),
    backgroundColor: '#fff',
  },
  searchHolder: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  searchBarSkills: {
    backgroundColor: '#FFFFFF',
    flex: 1,
    marginLeft: moderateScale(16),
  },
  listContentStyle: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  listItem: {
    marginLeft: moderateScale(16),
    width: '90%',
    paddingTop: 10,
    paddingBottom: 10,
  },
  supervisorSeparator: {
    marginTop: 10,
    height: 0.5,
    backgroundColor: appConfig.LIST_BORDER_COLOUR,
  },
});

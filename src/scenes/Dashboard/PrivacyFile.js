import React, { useState, useEffect } from 'react';
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-community/async-storage';

import { setHeight, setWidth } from '../../components/fontScaling';
import { text } from './PrivacyText';

const PrivacyFile = (props) => {
  console.log('===', props);
  const { privacyModalFunc, statusValue, navigation, loginUser } = props;
  //   const [modalVisible, setModalVisible] = useState(false);
  const [checkVisible, setCheckVisible] = useState(false);

  //   const handleModalVisible = (visible) => {
  //     setModalVisible(visible);
  //   };
  const onSubmitPrivacyPolicy = () => {
    console.log('======= onSubmitPrivacyPolicy');
    privacyModalFunc(storeData);
  };
  const checkStatus = () => {
    setCheckVisible(!checkVisible);
  };

  const storeData = async () => {
    console.log('===== storeData');
    const privacyPolicyObj = {
      checkVisible,
      userSmCode: loginUser.SmCode,
    };
    try {
      await AsyncStorage.setItem(
        'privacyPolicyData',
        JSON.stringify(privacyPolicyObj)
      );
      // this.setModalVisible(false);
    } catch (e) {
      // saving error
      console.log(e);
    }
  };

  const backToLogin = () => {
    navigation.navigate('Login');
  };
  const goBackScreen = () => {
    privacyModalFunc(backToLogin);
  };
  return (
    <View style={styles.centeredView}>
      <Modal animationType="slide" transparent={true} visible={true}>
        <SafeAreaView>
          <ScrollView>
            <View style={styles.modalContainer}>
              <View style={styles.modalView}>
                <Text style={{ paddingBottom: 10 }}>Privacy Policy</Text>
                <Text style={styles.modalTextStyle}>{text}</Text>
                <View style={styles.checkBoxContainer}>
                  <TouchableOpacity
                    onPress={() => checkStatus()}
                    style={styles.checkBox}
                  >
                    {checkVisible ? (
                      <Icon name="check" size={20} color="#FF7F50" />
                    ) : (
                      <Text />
                    )}
                  </TouchableOpacity>
                  <Text>I have read and understood</Text>
                </View>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    onPress={() => onSubmitPrivacyPolicy()}
                    disabled={!checkVisible}
                    style={[
                      styles.buttonStyle,
                      { backgroundColor: !checkVisible ? '#ccc' : '#FF7F50' },
                    ]}
                  >
                    <Text style={{ fontSize: 18, color: '#fff' }}>Submit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    //   onPress={() => this.displayData()}
                    onPress={() => goBackScreen()}
                    style={styles.buttonStyle}
                  >
                    <Text style={{ fontSize: 18, color: '#fff' }}>Go Back</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

export default PrivacyFile;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topCloseButton: {
    fontSize: 20,
    alignSelf: 'flex-end',
    padding: 10,
    marginRight: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  modalView: {
    flex: 1,
    alignItems: 'center',
    margin: 10,
    padding: 20,
    borderRadius: 20,
    backgroundColor: '#fff',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },

  modalTextStyle: {
    marginBottom: 20,

    color: '#000',
    // textAlign: 'center',
    fontSize: 12,
  },

  checkBoxContainer: {
    flexDirection: 'row',
    marginVertical: 20,
    alignItems: 'center',
  },

  checkBox: {
    width: 25,
    height: 25,
    borderWidth: 1,
    borderColor: '#000',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },

  buttonContainer: {
    width: setWidth(80),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonStyle: {
    // flex: 0.3,
    justifyContent: 'center',
    alignItems: 'center',
    width: setWidth(30),
    height: setHeight(5),
    backgroundColor: '#FF7F50',
    marginTop: 10,
    borderRadius: 40,
  },
});

/* eslint-disable no-undef */
import React, { useState } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { storeData } from '../../utilities/asyncStorage';
import { setHeight, setWidth } from '../../components/fontScaling';
import PrivacyText from './PrivacyText';

const PrivacyFile = (props) => {
  const { privacyModalFunc, navigation, loginUser } = props;
  const [checkVisible, setCheckVisible] = useState(false);

  const onSubmitPrivacyPolicy = () => {
    privacyModalFunc(storeAsyncData);
  };
  const checkStatus = () => {
    setCheckVisible(!checkVisible);
  };

  const storeAsyncData = () => {
    const privacyPolicyObj = {
      checkVisible,
      userSmCode: loginUser.SmCode,
    };
    storeData('privacyPolicyData', privacyPolicyObj);
  };

  const backToLogin = () => {
    navigation.navigate('Login');
  };

  const goBackScreen = () => {
    privacyModalFunc(backToLogin);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={true}
      style={styles.modalContent}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalView}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 'bold',
              paddingBottom: 18,
              textTransform: 'uppercase',
              textDecorationLine: 'underline',
            }}
          >
            Privacy Policy
          </Text>
          <PrivacyText />

          <View style={styles.checkBoxContainer}>
            <TouchableOpacity onPress={checkStatus} style={styles.checkBox}>
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
      </SafeAreaView>
    </Modal>
  );
};

export default PrivacyFile;

const styles = StyleSheet.create({
  modalContent: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    margin: 0,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
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
  renderTextViewStyle: {
    marginBottom: 15,
  },
  rendetTextStyle: {
    textAlign: 'justify',
    marginVertical: 10,
  },
});

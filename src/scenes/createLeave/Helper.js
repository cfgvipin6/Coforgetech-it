import { styles } from "./styles";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
  SafeAreaView,
  Platform,
} from "react-native";
import React, { Component } from "react";
import ModalDropdown from "react-native-modal-dropdown";
import { Icon, Button, SearchBar } from "react-native-elements";
import moment from "moment";
import DocumentPicker from "react-native-document-picker";
import RadioForm from "react-native-simple-radio-button";
import UserMessage from "../../components/userMessage";
import { moderateScale } from "../../components/fontScaling.js";
import RNFetchBlob from "rn-fetch-blob";
import LinearGradient from "react-native-linear-gradient";
let appConfig = require("../../../appconfig");
renderRows = (data) => {
  data.forEach((balance) => {
    return (
      <View style={styles.rowHolder}>
        {balance.LeaveTypeText.IsActive ? (
          <Text style={styles.heading}>{balance.LeaveTypeText.Value}</Text>
        ) : null}
        {balance.Balances.IsActive ? (
          <Text>{balance.Balances.Value}</Text>
        ) : null}
      </View>
    );
  });
};
export const HeaderView = (props) => {
  let data = props.props.Balances;
  if (data && data.length > 0) {
    return (
      <View style={styles.headerStyle}>
        <View style={styles.rowHolder}>
          <Text style={styles.headingText}>
            {data[0].LeaveTypeText.Value + ":"}
          </Text>
          <Text style={styles.headingText}>{data[0].Balances.Value}</Text>
        </View>
        {data[1] && data[1].LeaveTypeText ? (
          <View style={styles.rowHolder}>
            <Text style={styles.heading}>
              {data[1].LeaveTypeText.Value + ":"}
            </Text>
            <Text>{data[1].Balances.Value}</Text>
          </View>
        ) : null}
      </View>
    );
  } else {
    return null;
  }
};

export const Form = (props) => {
  let visible =
    props &&
    props.props &&
    props.props.LeaveType &&
    props.props.LeaveType.length > 0
      ? true
      : false;
  if (visible) {
    let Details = props.props.Details[0];
    return (
      <View>
        {Details.EmpCode.IsActive === true ? (
          <View style={styles.rowHolder}>
            <Text style={styles.heading}>Leave Application For</Text>
            <View style={styles.description}>
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                autoCompleteType={false}
                editable={false}
                multiline={false}
                style={styles.textInputStyle}
              >
                {Details.EmpCode.Value}
              </TextInput>
            </View>
          </View>
        ) : null}
        {Details.Address1.IsActive === true &&
        Details.CompanyCode.Value !== "N005" ? (
          <View style={styles.rowHolder}>
            <Text style={styles.heading}>{Details.Address1.Key}</Text>
            <View style={styles.description}>
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                autoCompleteType={false}
                onChangeText={(text) => props.address1InputHandler(text)}
                multiline={false}
                style={styles.textInputStyle}
              >
                {Details.Address1.Value}
              </TextInput>
            </View>
          </View>
        ) : null}
        {Details.Address2.IsActive === true &&
        Details.CompanyCode.Value !== "N005" ? (
          <View style={styles.rowHolder}>
            <Text style={styles.heading}>{Details.Address2.Key}</Text>
            <View style={styles.description}>
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                autoCompleteType={false}
                onChangeText={(text) => props.address2InputHandler(text)}
                multiline={false}
                style={styles.textInputStyle}
              >
                {Details.Address2.Value}
              </TextInput>
            </View>
          </View>
        ) : null}
        {Details.ContactNo.IsActive === true &&
        Details.CompanyCode.Value !== "N005" ? (
          <View style={styles.rowHolder}>
            <Text style={styles.heading}>{Details.ContactNo.Key}</Text>
            <View style={styles.description}>
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                autoCompleteType={false}
                onChangeText={(text) => {
                  props.contactNoCallBack(text);
                }}
                editable={true}
                multiline={false}
                style={styles.textInputStyle}
                placeholder="Contact Number"
                keyboardType="numeric"
              >
                {Details.ContactNo.Value}
              </TextInput>
            </View>
          </View>
        ) : null}
      </View>
    );
  } else {
    return null;
  }
};
export const Dropdown = (parent) => {
  let dropDownData;
  if (
    parent.props &&
    parent.props.length > 0 &&
    parent.title == "Select leave type : "
  ) {
    console.log("data in dropdown is :", parent.props);
    dropDownData = parent.props.map((el) => {
      parent.setLeaveCodes(el.LeaveType.Value);
      return el.LeaveTypeText.Value;
    });
  } else if (
    parent.props &&
    parent.props.length > 0 &&
    parent.title == "Reason : "
  ) {
    let reasonObject = parent.props[0];
    let reasons = [];
    for (let key in reasonObject) {
      reasons.push(reasonObject[key]);
      parent.setReasonCodes(key);
    }
    dropDownData = reasons.map((el) => {
      return el;
    });
  } else if (
    parent.props &&
    parent.props.length > 0 &&
    parent.title === "Select family member : "
  ) {
    dropDownData = parent.props.map((el) => {
      return "            " + el.Fnac2.Value + "            ";
    });
  }
  return (
    <View>
      <Text style={styles.pickerText}>{parent.title}</Text>
      <View style={styles.pickerBox}>
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={["#D3E5FC", "#F9F6EE"]}
          style={styles.dropView}
        >
          <ModalDropdown
            options={dropDownData}
            dropdownStyle={[
              styles.dropdownStyle,
              { width: parent?.props?.desiredWidth },
            ]}
            defaultValue={"Select"}
            style={styles.picker}
            textStyle={styles.pickerTextStyle}
            dropdownTextStyle={styles.dropdownTextStyle}
            showsVerticalScrollIndicator={false}
            renderSeparator={() => (
              <View style={{ height: 1, backgroundColor: "#f68a23" }} />
            )}
            onSelect={(index, value) => parent.dropDownCallBack(index, value)}
          />
          <Icon name="arrow-drop-down" size={35} color={"#000"} />
        </LinearGradient>
      </View>
    </View>
  );
};
export const DateDifferenceView = (props) => {
  if (
    props.startDate !== undefined &&
    props.startDate !== "" &&
    props.startDate !== "Start Date" &&
    props.endDate !== undefined &&
    props.endDate !== "End Date" &&
    props.endDate !== ""
  ) {
    let endMoment = moment(props.endDate, "DD/MMM/YYYY");
    let startMoment = moment(props.startDate, "DD/MMM/YYYY");
    let diff = endMoment.diff(startMoment, "days");
    if (diff == 0 || diff > 0) {
      return (
        <View style={styles.halfHolder}>
          {props.leaveCode === "100" &&
          props.data[0].CompanyCode.Value === "N052" ? (
            <Text style={styles.heading}>Number of hours:</Text>
          ) : (
            <Text style={styles.heading}>Number of days:</Text>
          )}
          <Text style={styles.textDays}>
            {props.totalLeaveApplied === "" ? "" : props.totalLeaveApplied}
          </Text>
        </View>
      );
    } else {
      return (
        <Text style={styles.warning}>
          End date can not be prior to start date.
        </Text>
      );
    }
  } else {
    return null;
  }
};

export const filePicker = async (fileCallBack) => {
  try {
    const res = await DocumentPicker.pick({
      type: [
        DocumentPicker.types.images,
        DocumentPicker.types.pdf,
        DocumentPicker.types.plainText,
        DocumentPicker.types.zip,
      ],
      readContent: true,
    });
    console.log("res ===", res);
    let data = "";
    if (res?.uri) {
      let uri =
        Platform.OS === "ios" ? res.uri.replace("file:///", "/") : res.uri;
      RNFetchBlob.fs.readStream(uri, "base64", 4095).then((ifStream) => {
        ifStream.open();
        ifStream.onData((chunk) => {
          data += chunk;
        });
        ifStream.onError((error) => {
          console.log("Oops error is :", error);
        });
        ifStream.onEnd(() => {
          let dataToSave = data.replace("[object Object]", "");
          // console.log("base64url === ", dataToSave);
          fileCallBack(dataToSave, res.name);
        });
      });
    }
  } catch (err) {
    console.log("Error in file picking is :", err);
    if (DocumentPicker.isCancel(err)) {
    } else {
      throw err;
    }
  }
};

export const Attachment = (parent) => {
  return (
    <View style={styles.halfHolder}>
      <Text style={styles.attachText}>Attachment:</Text>
      <TouchableOpacity
        style={styles.attachIcon}
        onPress={() => {
          filePicker(parent.fileCallBack);
        }}
      >
        <Icon name="attachment" size={35} color={"blue"} />
      </TouchableOpacity>
      <Text>{parent.title}</Text>
    </View>
  );
};
export const WorkRow = (props) => {
  if (props.title === "Forward to supervisor") {
    let data = props.data;
    if (data[0].NeglectSupervisor.Value === "Y" && data[0].Docno.Value === "") {
      return null;
    } else {
      return (
        <View style={styles.lineHolder}>
          <View style={styles.line} />
          <Text>{props.title}</Text>
          <View style={styles.line} />
        </View>
      );
    }
  } else {
    return (
      <View style={styles.lineHolder}>
        <View style={styles.line} />
        <Text>{props.title}</Text>
        <View style={styles.line} />
      </View>
    );
  }
};

export const Iniitian = (props) => {
  let data = props.data;
  if (props.isSupervisor && data && data[0]) {
    if (data[0].NeglectSupervisor.Value === "Y" && data[0].Docno.Value === "") {
      return null;
    } else {
      return (
        <View>
          <View style={styles.halfHolder}>
            <View style={styles.empId}>
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                autoCompleteType={false}
                editable={false}
                multiline={false}
                style={styles.textInputStyle}
              >
                {data[0].SupervisorCode.Value}
              </TextInput>
            </View>
            <View style={styles.name}>
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                autoCompleteType={false}
                editable={false}
                multiline={false}
                style={styles.textInputStyle}
              >
                {data[0].SupervisorName.Value}
              </TextInput>
            </View>
          </View>
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            autoCompleteType={false}
            placeholder="Remarks"
            multiline={false}
            style={styles.remarksStyle}
            onChangeText={(text) => {
              props.supervisorRemarks(text);
            }}
          />
        </View>
      );
    }
  } else {
    return (
      <View>
        <View>
          <View style={styles.name}>
            {props.selectedEmpName === "" ||
            props.selectedEmpName === undefined ? (
              <TouchableOpacity
                onPress={() => {
                  props.searchCallBack();
                }}
              >
                <Text multiline={false} style={styles.textOtherStyle}>
                  Employee Name
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  props.searchCallBack();
                }}
              >
                <Text multiline={false} style={styles.textOther2Style}>
                  {props.selectedEmpName.substring(
                    props.selectedEmpName.lastIndexOf(":") + 2
                  )}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          autoCompleteType={false}
          placeholder="Remarks"
          multiline={false}
          style={styles.remarksStyle}
          onChangeText={(text) => {
            props.handlerRemarks(text);
          }}
        />
      </View>
    );
  }
};

export const LineView = () => {
  return <View style={styles.line} />;
};

export const ActionButtons = (parent) => {
  return (
    <View style={styles.actionButtonHolder}>
      <TouchableOpacity
        style={styles.submitButton}
        onPress={() => parent.submitCallBack()}
      >
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};
renderEmployeeItem = (item, index, pickEmployee) => {
  return (
    // <View>
    <TouchableOpacity
      onPress={() => {
        pickEmployee(item);
      }}
      style={styles.listItem}
    >
      <Text>{item.EmpName}</Text>
      <View style={styles.supervisorSeparator} />
    </TouchableOpacity>
    // </View>
  );
};
showRequestsView = (parent) => {
  let data = parent.empData;
  if (parent.empData.length > 0) {
    return (
      // <View style={styles.listOuterView}>
      <FlatList
        contentContainerStyle={styles.listContentStyle}
        data={data}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) =>
          this.renderEmployeeItem(item, index, parent.pickEmployee)
        }
        keyExtractor={(item, index) => "pendingRequest_" + index.toString()}
        // ItemSeparatorComponent={() => (
        //   <View style={{ backgroundColor: "white" }}>
        //     <Text></Text>
        //   </View>
        // )}
      />
      // </View>
    );
  } else {
    return null;
  }
};
export const EmployeeSearchView = (parent) => {
  return (
    <Modal
      visible={parent.visibility}
      animationType="slide"
      transparent={false}
      onRequestClose={() => {
        parent.closeCallBack();
      }}
    >
      <View style={styles.modalContainer}>
        <View style={styles.searchHolder}>
          <SearchBar
            lightTheme
            placeholder="Enter Emp Code or Name to search"
            onChangeText={parent.search()}
            value={parent.query}
            round={true}
            containerStyle={styles.searchBarSkills}
            autoCapitalize="none"
            autoCompleteType="off"
            autoCorrect={false}
          />
          <TouchableOpacity
            onPress={() => {
              parent.closeCallBack();
            }}
          >
            <Icon name="close" size={35} color="blue" />
          </TouchableOpacity>
        </View>
        {this.showRequestsView(parent)}
      </View>
      {this.showRequestsView(parent)}
    </Modal>
  );
};
let radio_props = [
  { label: "1st Half", value: 0 },
  { label: "2nd Half", value: 1 },
];
export const RadioForms = (props) => {
  return (
    <View style={styles.radioGroupContainer}>
      <RadioForm
        radio_props={radio_props}
        initial={0}
        formHorizontal={true}
        buttonSize={10}
        buttonOuterSize={20}
        labelStyle={{ paddingHorizontal: 20 }}
        onPress={(value) => {
          props.onHalfDaySelection(value);
        }}
      />
    </View>
  );
};

export const OtherReason = (props) => {
  return (
    <View style={styles.otherReasonContainer}>
      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        autoCompleteType={false}
        placeholder="Other Reason"
        multiline={false}
        style={styles.textInputStyle}
        onChangeText={(text) => props.otherReasonRemarks(text)}
      />
    </View>
  );
};

export const ShowResultDialog = (parent) => {
  let messageToShow;
  let title = "";
  if (
    parent &&
    parent.submittedAction &&
    parent.submittedAction[0] &&
    parent.submittedAction[0].msgTxt !== undefined
  ) {
    title = "Success";
    messageToShow =
      "Your leave document " +
      parent.submittedAction[0].msgTxt +
      " has been submitted successfully.";
  } else if (
    parent &&
    parent.submittedAction &&
    parent.submittedAction.includes("Error Message")
  ) {
    title = "Error";
    messageToShow = parent.submittedAction.substring(
      parent.submittedAction.indexOf(":") + 1
    );
  }
  let Message = (props) => (
    <View>
      <Text
        style={{
          marginHorizontal: "4.3%",
          fontSize: moderateScale(14),
          color: appConfig.GUN_METAL_COLOR,
          letterSpacing: moderateScale(0.7),
          textAlign: "center",
        }}
      >
        {messageToShow}
      </Text>
    </View>
  );
  return (
    <UserMessage
      heading={title}
      message={<Message />}
      okAction={() => parent.closeDialogCallBack(title)}
    />
  );
};

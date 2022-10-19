import React, { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { Checkbox } from "react-native-paper";
import { Dropdown } from "../../../../GlobalComponent/DropDown/DropDown";
import { sectionTitle } from "../../createVoucher/cvUtility";
let appConfig = require("../../../../../appconfig");
this.travelModeRef = React.createRef();
let dependents = {};
export const getDependents = () => {
  return dependents;
};
const LTADependents = (props) => {
  const [theArray, setData] = useState(props.dependents);
  const [mode, setMode] = useState("");
  const [modes, setModes] = useState(props.travelModes);
  console.log("Travel Modes : ", props.travelModes);
  let disable =
    props.docStatus == undefined ||
    props.docStatus == 0 ||
    props.docStatus == 1 ||
    props.docStatus == 5 ||
    props.docStatus == 7 ||
    props.docStatus == 12 ||
    props.docStatus == 14
      ? false
      : true;
  const toggleChecked = (item, index) => {
    console.log("Item to check : ", item);
    console.log("Index to check : ", index);
    item.IsChecked = !item.IsChecked;
    props.dependents[index] = item;
    console.log("Updated dependents : ", props.dependents);
    setTimeout(() => {
      setData([]);
      props.updatedDependents(props.dependents);
    }, 10);
  };

  const setTravelMode = (index, mode) => {
    let travelMode = modes.find((el) => el.DisplayText == mode);
    if (this.travelModeRef && this.travelModeRef.current !== null) {
      setMode(travelMode.ID);
      this.travelModeRef.current.select(parseInt(travelMode.ID) - 1);
    }
  };
  useEffect(() => {
    console.log("Selected Mode : ", props.selectedMode);
    if (
      props.selectedMode !== "" &&
      props.selectedMode !== undefined &&
      props.selectedMode !== null
    ) {
      setTravelMode(0, props.selectedMode);
    }
    dependents.dependents = props.dependents;
    dependents.mode = mode;
    console.log("LTA Dependents mode : ", mode);
  });

  return (
    <View
      style={{
        borderWidth: 2,
        flex: 0,
        borderColor: appConfig.FIELD_BORDER_COLOR,
        borderRadius: 5,
        shadowOffset: { width: 10, height: 10 },
        shadowColor: "black",
        padding: 5,
      }}
    >
      {sectionTitle("Dependents undertaking the journey")}
      {props.dependents.map((item, index) => {
        console.log("Item found in render is :", item);
        return (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              borderWidth: 0.5,
              borderColor: "grey",
              flex: 1,
            }}
          >
            <Checkbox.Android
              disabled={disable ? true : false}
              color={appConfig.DARK_BLUISH_COLOR}
              uncheckedColor="grey"
              status={item.IsChecked ? "checked" : "unchecked"}
              onPress={() => toggleChecked(item, index)}
            />
            <Text>{item.Name}</Text>
          </View>
        );
      })}
      <Dropdown
        title="Mode Of Travel"
        disabled={disable ? true : false}
        forwardedRef={this.travelModeRef}
        dropDownData={modes.map((value) => value.DisplayText)}
        dropDownCallBack={(index, value) => {
          setTravelMode(index, value);
        }}
      />
    </View>
  );
};

export default LTADependents;

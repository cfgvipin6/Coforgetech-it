/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
import React, { Component } from "react";
import { View, TextInput, Text, TouchableOpacity, Image } from "react-native";
import { styles } from "./styles";
import { Card } from "react-native-elements";
const UNCHECKED_ICON = require("../../assets/unchecked_icon.jpeg");
const CHECKED_ICON = require("../../assets/checked_icon.jpeg");

export const SelectAllController = (props) => {
  console.log("Array final : ", props.checkBoxFinalArray);
  let iconToShow = false;
  if (props.checkBoxFinalArray.length > 0) {
    for (let i = 0; i < props.checkBoxFinalArray.length; i++) {
      if (props.checkBoxFinalArray[i].imageType === "unchecked") {
        iconToShow = true;
        break;
      }
    }
  }
  let icon =
    props.checkBoxFinalArray.length === 0
      ? UNCHECKED_ICON
      : iconToShow === true
      ? UNCHECKED_ICON
      : CHECKED_ICON;
  return (
    <TouchableOpacity
      onPress={() => {
        toggleAll(props);
      }}
      style={styles.selectAllContainer}
    >
      <Image source={icon} style={styles.checkUncheckedImage} />
      <Text style={styles.selectAllText}>Select All</Text>
    </TouchableOpacity>
  );
};
const toggleAll = (props) => {
  checkBoxArray = [];
  let ACTION_TOGGLE = false;
  if (props.checkBoxFinalArray.length > 0) {
    for (let i = 0; i < props.checkBoxFinalArray.length; i++) {
      ACTION_TOGGLE =
        props.checkBoxFinalArray[i].imageType === "checked" ? true : false;
      break;
    }
    checkBoxPressAll(props.checkBoxFinalArray, props, ACTION_TOGGLE);
  } else {
    props.data.map((val, index) => {
      checkBoxArray.push({ imageType: "unchecked", data: val });
    });
  }
  checkBoxPressAll(checkBoxArray, props, ACTION_TOGGLE);
};
export const CheckBoxCard = (props) => {
  let counter = 0;
  checkBoxArray = [];
  return props.data.map((data, i) => {
    checkBoxArray.push({ imageType: "unchecked", data: data });
    counter++;
    checkIconFlagArray = checkBoxArray;
    return (
      <View style={styles.container} key={i}>
        <View>
          <TouchableOpacity
            style={{
              opacity:
                props.checkBoxFinalArray.length === 0
                  ? 0.4
                  : props.checkBoxFinalArray.length != 0 &&
                    props.checkBoxFinalArray[i].imageType === "unchecked"
                  ? 1
                  : 0.4,
            }}
            onPress={() => checkBoxPress(i, checkBoxArray, props)}
          >
            <Image
              source={
                props.checkBoxFinalArray.length === 0
                  ? UNCHECKED_ICON
                  : props.checkBoxFinalArray.length != 0 &&
                    props.checkBoxFinalArray[i].imageType === "unchecked"
                  ? UNCHECKED_ICON
                  : CHECKED_ICON
              }
              style={styles.checkUncheckedImage}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.cardHolder}>
          <Card title={"Record" + " " + counter}>
            {props.renderCardItem(data)}
          </Card>
        </View>
      </View>
    );
  });
};

const checkBoxPress = (i, checkBoxArray, props) => {
  checkIconFlagArray =
    props.checkBoxFinalArray && props.checkBoxFinalArray.length != 0
      ? props.checkBoxFinalArray
      : checkBoxArray;
  checkIconFlagArray.map((val, index) => {
    if (i === index) {
      if (val.imageType === "checked") {
        checkIconFlagArray[i].imageType = checkIconFlagArray[
          i
        ].imageType.replace("checked", "unchecked");
      } else {
        checkIconFlagArray[i].imageType = checkIconFlagArray[
          i
        ].imageType.replace("unchecked", "checked");
      }
    }
  });
  props.handleCheckBoxPress(i, checkIconFlagArray);
};

const checkBoxPressAll = (checkBoxArray, props, action) => {
  console.log("Checkbox array : ", checkBoxArray, action);
  let checkBoxArrayUpdated = [];
  if (action) {
    checkBoxArray.map((value, index) => {
      console.log("Value is :", value);
      checkBoxArrayUpdated.push({ imageType: "unchecked", data: value.data });
      props.handleCheckBoxPress(index, checkBoxArrayUpdated);
    });
  } else {
    checkBoxArray.map((value, index) => {
      console.log("Value is :", value);
      checkBoxArrayUpdated.push({ imageType: "checked", data: value.data });
      props.handleCheckBoxPress(index, checkBoxArrayUpdated);
    });
  }
};

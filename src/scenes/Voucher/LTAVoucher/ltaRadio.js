import { styles } from "./styles";
import React, { Component } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal, FlatList, Image } from "react-native";
import RadioForm from "react-native-simple-radio-button";

export const LTARadioForms = props => {
    let disabledRadio = false
    let appliedStyle = (props.labelHorizontal === true) ? styles.radioButtonHolder : null
    let centerStyle=  styles.radioButtonHolderWithoutTitle;
    let initialVal = parseInt(props.selectedVal);
  
    return (
      <View style = {centerStyle}>
        <View style={(props.docStatus== undefined || props.docStatus== 0 || props.docStatus== 1 || props.docStatus== 5 || props.docStatus== 7 || props.docStatus == 12 || props.docStatus == 14) ? styles.radioGroupContainer : styles.radioGroupDisabledContainer}>
          <RadioForm
            style={{ marginHorizontal: 15}}
            ref = {props.forwardedRef}
            radio_props={props.options}
            disabled={(props.docStatus== undefined || props.docStatus== 0 || props.docStatus== 1 || props.docStatus== 5 || props.docStatus== 7 || props.docStatus == 12 || props.docStatus == 14) ? false:  true}
            initial={initialVal}
            formHorizontal={true}
            labelHorizontal={props.labelHorizontal}
            buttonSize={10}
            buttonOuterSize={20}
            labelStyle={{ paddingHorizontal: 8, fontSize: 12}}
            onPress={value => {
              props.onValueSelection(value);
            }}
          />
        </View> 
        </View> 
    );
  }
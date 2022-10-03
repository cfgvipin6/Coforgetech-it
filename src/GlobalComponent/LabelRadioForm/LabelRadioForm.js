import React, { Component } from 'react';
import { styles } from "./styles";
import RadioForm from "react-native-simple-radio-button";
import { View, Text } from 'react-native';
export const RadioForms = props => {
    let disabledRadio = props.disable
    let appliedStyle = (props.labelHorizontal === true) ? styles.radioButtonHolder : null
    let initialVal = parseInt(props.selectedVal);
    console.log("Default selected val of radio button is " ,initialVal)
    return (
      <View style = {appliedStyle}>
      <Text style={styles.boldText}>{props.title}</Text>
        <View style={(disabledRadio) ? styles.radioGroupDisabledContainer : styles.radioGroupContainer}>
          <RadioForm
            ref = {props.forwardedRef}
            style={styles.radioFormStyle}
            radio_props={props.options}
            disabled={disabledRadio}
            initial={initialVal}
            formHorizontal={!props.labelHorizontal}
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

  export const RadioFormHorizontal = props => {
    let disabledRadio = props.disable
    let initialVal = parseInt(props.selectedVal);
    return (
      <View style = {styles.radioButtonHolder}>
      <Text style={styles.boldText}>{props.title}</Text>
        <View style={(disabledRadio) ? styles.radioGroupDisabledContainer : styles.radioGroupContainer}>
          <RadioForm
            ref = {props.forwardedRef}
            style={styles.horizontalRadioFromStyle}
            radio_props={props.options}
            disabled={disabledRadio}
            initial={initialVal}
            formHorizontal={true}
            labelHorizontal={true}
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
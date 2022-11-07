import React, { Component } from "react";
import { View, TextInput, Text } from "react-native";
import { moderateScale } from "../../components/fontScaling.js";
import { styles } from "./styles";
let appConfig = require("../../../appconfig");

export const LabelEditText = (props) => {
  return (
    <View style={styles.rowHolder}>
      <Text style={styles.heading}>{props.heading}</Text>
      <View style={styles.description}>
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          autoCompleteType={false}
          keyboardType={
            props.myKeyboardType !== undefined
              ? props.myKeyboardType
              : "default"
          }
          editable={props.isEditable !== undefined ? props.isEditable : true}
          value={props.myValue.toString()}
          placeholder={props.placeHolder}
          placeholderTextColor="rgb(204, 205, 207)"
          maxLength={props.myMaxLength}
          numberOfLines={
            props.myNumberOfLines != undefined ? props.myNumberOfLines : 1
          }
          multiline={props.isMultiline}
          ref={props.scrollRef !== undefined ? props.scrollRef : null}
          style={[
            styles.textInputStyle,
            {
              marginTop:
                props.isSmallFont &&
                props.isSmallFont != undefined &&
                props.isSmallFont != null
                  ? moderateScale(3)
                  : moderateScale(5),
              backgroundColor:
                !props.isEditable && props.isEditable != null
                  ? appConfig.FIELD_BORDER_COLOR
                  : appConfig.WHITE_COLOR,
            },
          ]}
          onFocus={
            props.onFocusView !== undefined
              ? () => {
                  props.onFocusView();
                }
              : null
          }
          onChangeText={(text) => props.onTextChanged(text)}
        />
      </View>
    </View>
  );
};

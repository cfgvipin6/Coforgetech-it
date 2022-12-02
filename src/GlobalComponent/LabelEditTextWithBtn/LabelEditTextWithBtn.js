import React, { Component } from 'react';
import { View, TextInput, Text, Image } from 'react-native';
import { moderateScale } from '../../components/fontScaling.js';
import { Icon } from 'react-native-elements';
import { styles } from './styles';
let appConfig = require('../../../appconfig');

export const LabelEditTextWithBtn = (props) => {
  return (
    <View style={styles.rowHolder}>
      <Text style={styles.heading}>{props.heading}</Text>
      <View
        style={[
          styles.description,
          {
            backgroundColor:
              !props.isEditable && props.isEditable != null
                ? appConfig.FIELD_BORDER_COLOR
                : appConfig.WHITE_COLOR,
          },
        ]}
      >
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          autoCompleteType="off"
          keyboardType={
            props.myKeyboardType !== undefined
              ? props.myKeyboardType
              : 'default'
          }
          editable={props.isEditable !== undefined ? props.isEditable : true}
          value={props.myValue}
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
              paddingTop:
                props.isSmallFont &&
                props.isSmallFont != undefined &&
                props.isSmallFont != null
                  ? moderateScale(3)
                  : moderateScale(5),
            },
          ]}
          onFocus={
            props.onFocusView !== undefined ? () => props.onFocusView() : null
          }
          onChangeText={(text) => props.onTextChanged(text)}
        />
        {props.isEditable !== undefined ? (
          props.isEditable ? (
            <Icon
              disabled={
                props.isEditable !== undefined ? !props.isEditable : false
              }
              onPress={
                props.onFocusView !== undefined
                  ? () => props.onFocusView()
                  : null
              }
              style={{ flex: 0.1 }}
              name="search"
              size={20}
              color="#1C62AD"
            />
          ) : null
        ) : null}
      </View>
    </View>
  );
};

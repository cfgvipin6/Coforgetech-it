import React, { Component } from "react";
import { View, TextInput, Text } from "react-native";
import { styles } from "./styles";
import { Props } from "react-native-image-pan-zoom/built/image-zoom/image-zoom.type";

export const Remarks = (props) => {
  return (
    <View style={styles.rowHolder}>
      <Text style={styles.heading}>Remarks*</Text>
      <View style={styles.remarksParent}>
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          autoCompleteType={false}
          maxLength={500}
          multiline={true}
          onChangeText={(text) => props.onchangeText(text)}
          //   value={this.state.remarks}
          placeholder="Remarks"
          style={styles.textInputStyle}
          ref={props.scrollRef !== undefined ? props.scrollRef : null}
        />
      </View>
    </View>
  );
};

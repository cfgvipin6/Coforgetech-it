import React from "react";
import { Text, View } from "react-native";
import { globalFontStyle } from "../../components/globalFontStyle";
import { styles } from "./styles";

export const AttendanceInfo = ({ label = "", value = "" }) => {
  return (
    <View style={styles.cardView}>
      <Text style={globalFontStyle.cardLeftText}>{`${label} :`} </Text>
      <Text style={globalFontStyle.cardRightText}>{value}</Text>
    </View>
  );
};

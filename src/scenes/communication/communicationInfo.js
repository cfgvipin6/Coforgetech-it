import React from "react";
import { Text, View } from "react-native";
import { globalFontStyle } from "../../components/globalFontStyle";
import { styles } from "./styles";

export const CommunicationInfo = ({ label = "", value = "" }) => {
  return (
    <View style={styles.displayItemsView}>
      <Text style={globalFontStyle.cardLeftText}>{label}</Text>
      <Text style={globalFontStyle.cardRightText}>{value}</Text>
    </View>
  );
};

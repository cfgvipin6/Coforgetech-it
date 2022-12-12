import React from "react";
import { Text, View } from "react-native";
import { globalFontStyle } from "../../components/globalFontStyle";
import { styles } from "./styles";

export const GratuityInfo = ({ label = "", value = "" }) => {
  return (
    <View style={styles.displayItemsView}>
      <Text style={globalFontStyle.cardLeftText}>{label} </Text>
      <Text style={styles.rightSideVal}>{value}</Text>
    </View>
  );
};

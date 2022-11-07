import React from "react";
import { Text, View } from "react-native";
import { globalFontStyle } from "../../components/globalFontStyle";
import styles from "./styles.js";

export const TravelInfo = ({ label = "", value = "" }) => {
  return (
    <View style={styles.rowFashion}>
      <Text style={[globalFontStyle.imageBackgroundLayout, styles.textTwo]}>
        {label}
      </Text>
      <Text style={[globalFontStyle.imageBackgroundLayout, styles.textTwo]}>
        {value}
      </Text>
    </View>
  );
};

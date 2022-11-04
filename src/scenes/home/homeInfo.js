import React from "react";
import { Text, View } from "react-native";
import { globalFontStyle } from "../../components/globalFontStyle";
import styles from "./style.js";

export const HomeInfo = ({ label = "", value = "" }) => {
  return (
    <View style={{ flexDirection: "row" }}>
      <Text
        style={[
          globalFontStyle.imageBackgroundLayout,
          styles.displayItemsTextOne,
        ]}
      >
        {label}
      </Text>
      <Text
        style={[
          globalFontStyle.imageBackgroundLayout,
          styles.displayItemsTextTwo,
        ]}
      >
        {value}
      </Text>
    </View>
  );
};

import React from "react";
import { Text, View } from "react-native";
import { globalFontStyle } from "../../components/globalFontStyle";
import styles from "./style.js";

export const RenderUserItem = ({ label = "", value = "" }) => {
  return (
    <View style={{ flexDirection: "row" }}>
      <Text
        style={[
          globalFontStyle.imageBackgroundLayout,
          styles.displayItemTextTwo,
        ]}
      >
        {label}
      </Text>
      <Text
        style={[
          globalFontStyle.imageBackgroundLayout,
          styles.displayItemTextTwo,
        ]}
      >
        {value}
      </Text>
    </View>
  );
};

import React from "react";
import { View } from "react-native";
let appConfig = require("../../appconfig");

const OrangeBar = () => {
  return (
    <View
      style={{
        height: 1,
        backgroundColor: appConfig.APP_ORANGE,
        alignSelf: "center",
        width: "95%",
      }}
    />
  );
};

export default OrangeBar;

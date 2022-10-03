import React from "react";
import { View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { moderateScale } from "../fontScaling";

const BoxContainer = (props) => {
  return (
    <View
      // start={{x: 0, y: 1}} end={{x: 1, y: 0}}
      // colors={['#e0eaf7','#f1f2f1']}
      style={{
        paddingHorizontal: moderateScale(6),
        paddingVertical: "1%",
        borderWidth: 0.5,
        borderColor: "#C0C0C0",
        zIndex: 10,
        borderRadius: 5,
        shadowColor: "#000",
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 5,
        overflow: "hidden",
        ...props.style,
      }}
    >
      {props?.children}
    </View>
  );
};

export default BoxContainer;

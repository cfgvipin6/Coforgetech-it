import React, { Component } from "react";
import { View, TextInput, Text } from "react-native";
import CustomButton from "../../components/customButton";
export const ApproveRejectButtons = (props) => {
  return (
    <View style={{ flexDirection: "row" }}>
      <View style={{ width: "50%" }}>
        <CustomButton
          label={"APPROVE"}
          positive={true}
          performAction={() => props.buttonAction(props.item, "APPROVE")}
        />
      </View>
      <View style={{ width: "50%" }}>
        <CustomButton
          label={"REJECT"}
          positive={false}
          performAction={() => props.buttonAction(props.item, "REJECT")}
        />
      </View>
    </View>
  );
};

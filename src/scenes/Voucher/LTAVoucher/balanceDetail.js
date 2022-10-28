import React, { useEffect, useState } from "react";
import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { moderateScale } from "../../../components/fontScaling.js";
import { LabelTextDashValue } from "../../../GlobalComponent/LabelText/LabelText";
let appConfig = require("../../../../appconfig");
let constants = require("./constants");
export const BalanceView = (props) => {
  let heading = "";
  let description = "";

  console.log("Cat ID : ", props.catID);
  console.log("Reimburse Amount: ", props.reimburseAmount);
  switch (props.catID) {
    case "7":
      heading = "Executive Health Check-Up Claimable limit : ";
      description = "";
      break;
    case "6":
      heading = "Mobile Balance - Kitty : ";
      description = constants.MOBILE_INSTRUCTIONS;
      break;
    case "5":
      heading = "Petrol Balance : ";
      description = constants.PETROL_INSTRUCTIONS;
      break;
    case "4":
      heading = "Driver Balance : ";
      description = constants.DRIVER_INSTRUCTIONS;
      break;
  }
  return (
    <ImageBackground style={styles.cardBackground} resizeMode="cover">
      <LabelTextDashValue heading={heading} description={props.balanceAmount} />
      {props.reimburseAmount !== undefined ? (
        <LabelTextDashValue
          heading={"Reimbursement : "}
          description={props.reimburseAmount}
        />
      ) : null}
      <Text style={styles.instructions}>{description}</Text>
    </ImageBackground>
  );
};
const styles = StyleSheet.create({
  cardBackground: {
    borderWidth: 2,
    flex: 0,
    borderColor: appConfig.FIELD_BORDER_COLOR,
    borderRadius: 5,
    shadowOffset: { width: 10, height: 10 },
    shadowColor: "black",
    padding: 5,
    margin: 5,
  },
  instructions: {
    padding: moderateScale(7),
    color: "blue",
  },
});

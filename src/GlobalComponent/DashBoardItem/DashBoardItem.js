import React, { Component } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import { styles } from "./styles";
import { globalFontStyle } from "../../components/globalFontStyle";
import { Icon } from "react-native-elements";
export const DashBoardItem = (props) => {
  return (
    <View>
      <FlatList
        data={props.data}
        keyExtractor={(item, index) => item + index}
        renderItem={({ item, index }) => sectionItem(props, item, index)}
      />
    </View>
  );
};

const sectionItem = (props, item, index) => {
  return (
    <TouchableOpacity onPress={() => props.dashBoardItemClick(item, index)}>
      <View style={[styles.item, { opacity: item.Count == 0 ? 0.6 : 1 }]}>
        <Text style={globalFontStyle.dashboardTitleSize}>{item}</Text>
        <Icon name="chevron-right" size={35} />
      </View>
    </TouchableOpacity>
  );
};

import PropTypes from "prop-types";
import React, { Component } from "react";
import { SafeAreaView } from "react-navigation";
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  Dimensions,
  Image,
  Modal,
  TouchableOpacity,
  Alert,
} from "react-native";
const SW = Dimensions.get("window").width;
const SH = Dimensions.get("window").height;
import { LayoutAnimation } from "react-native";
import NestedListView, { NestedRow } from "react-native-nested-listview";

export class SideMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      data: menuData,
      updatedHeight: 0,
      expand: false,
      active_index: -1,
    };
  }

  closeModal = () => {
    this.setState({ modalVisible: false });
  };

  nodeItemClicked = (node) => {
    console.log("Node clicked is : ", node);
    if (node.items == undefined) {
      this.setState({ data: [] }, () => {
        this.setState({ data: menuData }, () => {
          this.props.navigation.toggleDrawer();
          this.props.navigation.replace("Schemes", { items: "gaganesh" });
        });
      });
    }
  };

  renderListNode = (node, level) => {
    return (
      <NestedRow level={level} style={{ alignItems: "flex-start" }}>
        <View style={{ width: "100%", paddingVertical: 10 }}>
          <View style={{ flexDirection: "row" }}>
            <Text>
              {node.opened && node.opened == true && node.items !== undefined
                ? "-"
                : node.items !== undefined
                ? "+"
                : ""}
            </Text>
            <Text
              style={{
                fontWeight: node.items !== undefined ? "bold" : "normal",
                fontSize: 15,
              }}
            >
              {node.title}
            </Text>
          </View>
          <View style={{ width: "100%", height: 1, backgroundColor: "grey" }} />
        </View>
      </NestedRow>
    );
  };
  getItems = () => {
    return (
      <NestedListView
        data={this.state.data}
        getChildrenName={(node) => "items"}
        onNodePressed={(node) => this.nodeItemClicked(node)}
        renderNode={(node, level) => this.renderListNode(node, level)}
      />
    );
  };

  render() {
    return (
      <SafeAreaView style={{ flex: 1, padding: 10 }}>
        <ScrollView keyboardShouldPersistTaps="handled">
          {this.getItems()}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

SideMenu.propTypes = {
  navigation: PropTypes.object,
};

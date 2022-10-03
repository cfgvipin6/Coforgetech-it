/* 
 Author: Mohit Garg
*/

import React, { Component } from "react"
import { View, ActivityIndicator, Text } from "react-native"
import Modal from "react-native-modal"
import { styles } from "./styles"
import { ACTIVITY_INDICATOR_COLOR } from "../../../appconfig"

export default class ActivityIndicatorView extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    let visibility = this.props.loader === undefined ? false : this.props.loader
    if(visibility && visibility===true){
      return(
        <Modal
        transparent={true}
        animationType={'none'}
        visible={visibility}
         style={styles.containerView}>
          <ActivityIndicator size="large" color={ACTIVITY_INDICATOR_COLOR} />
        </Modal>
      )
    }
    else {
      return null
    }
  }
}

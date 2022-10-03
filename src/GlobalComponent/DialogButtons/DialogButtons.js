import React, { Component } from "react"
import { View, TextInput, Text,Modal, TouchableOpacity } from "react-native"
import { styles } from "./styles"
import { Props } from "react-native-image-pan-zoom/built/image-zoom/image-zoom.type"
import Dialog, { DialogTitle, DialogContent } from "react-native-popup-dialog"
import { Icon } from "react-native-elements"

export const DialogButtons = (props) => {
	return (
		<View >
			<Modal  animationType="fade" transparent={true} onRequestClose={()=>{props.onDialogClose()}} visible={props.visible}>
			<View style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'}}>
    <View style={{
		    borderWidth:0.5,
			borderColor:'black',
			borderRadius:4,
		    backgroundColor:"white",
            width: "70%"}}>
	  <Text style={{marginTop:5, alignSelf:"center",fontSize:18,fontWeight:'bold'}}>{props.title}</Text>
	  <View style = {{marginVertical:10,height:0.5,marginHorizontal:5,backgroundColor:'black'}}></View>
      {props.children}
	  <TouchableOpacity  onPress={()=>props.onDialogClose()}> 
	  <Icon name="close" size={35} color="black"  />
	  </TouchableOpacity>
	 
    </View>
  </View>
			</Modal>
		</View>
	)
}

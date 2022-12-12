import React from 'react';
import { Dimensions, TouchableOpacity, StyleSheet, View, FlatList, Text, Modal } from 'react-native';
let appConfig = require('../../../appconfig');
const ModalPicker = props => {
     console.log('Props of modal picker : ',props);
    const getListItems = (element,index)=>{
     return (
         <TouchableOpacity onPress={()=>onItemClick(element,index)}>
            <Text style={styles.text}>{element}</Text>
         </TouchableOpacity>

     );
    };


   const renderSeparator = ()=>{
       return (
           <View style={styles.line} />
       );
   };
   const onItemClick = (element,index)=>{
     props.onSelection(index,element);
     props.changeModalVisibility(false);
   };
    return (
        <Modal
        animationType="slide"
        transparent={true}
        >
         <View style={{ width:300,height:props.data.length > 10 ? 300 : props.data.length * 40,alignSelf:'center',marginTop:Dimensions.get('window').height / 3,borderColor:appConfig.APP_ORANGE,borderWidth:1,backgroundColor:'#fff',borderRadius:5}}>
         <FlatList
           contentContainerStyle={{paddingBottom: 10 }}
           data={props.data}
           renderItem={({item, index})=>getListItems(item,index)}
           ItemSeparatorComponent={renderSeparator}
         />
         </View>
        </Modal>
    );
};


export default ModalPicker;

const styles = StyleSheet.create({
    container:{
     alignItems:'center',
     justifyContent:'center',
    },
    text:{
        fontSize:13,
        paddingLeft:10,
        paddingVertical:10,
    },
    line:{
        backgroundColor:appConfig.APP_ORANGE,
        height:1,
    },
});



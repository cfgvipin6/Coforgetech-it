import React from 'react';
import { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Text } from 'react-native';
import { TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import images from '../../images';
import ModalPicker from './ModalPicker';
let appConfig = require('../../../appconfig');
const IEngageDropDown = (props) => {
  console.log('Default value : ', props.defaultValue);
    const [selectTitle, setTitle] = useState(props.defaultValue && props.defaultValue !== '' ? props.defaultValue : 'Select');
    const [isModalVisible, setModalVisible] = useState(false);

    const changeModalVisibility = (visibility)=>{
       setModalVisible(visibility);
    };
    const itemSelection = (index,element)=>{
        setTitle(element);
        props.dropDownCallBack(index,element);
    };
    return (
      <View  style={{width:props.width}}>
      <LinearGradient
      start={{x: 0, y: 0}} end={{x: 1, y: 0}}
   colors={['#D3E5FC','#F9F6EE']}
  >
        <TouchableOpacity   onPress={()=>changeModalVisibility(true)}>
          <View style={styles.dropContainer}>
            <Text numberOfLines={1} style={[styles.text]}>{selectTitle}</Text>
            <Image style={styles.dropIcon} source={images.arrowDownBlack}/>
          </View>
        </TouchableOpacity>
        </LinearGradient>
        {isModalVisible &&
          <ModalPicker
        changeModalVisibility={changeModalVisibility}
        onSelection={itemSelection}
        data={props.data}
        width={props.width}
       />
       }
       </View>
    );
};

const styles = StyleSheet.create({
    text:{
      marginVertical:3,
      fontSize:14,
      width:'92%',
      paddingVertical:2,

    },
    dropIcon:{
      width:20,
      height:30,
    },
    dropContainer:{
        flexDirection:'row',
        alignItems:'center',
        borderRadius:4,
        borderWidth:1,
        borderColor:appConfig.APP_ORANGE,
        paddingHorizontal:10,
    },
    touchableOpacity:{
    backgroundColor: '#fff',
    },
});
export default IEngageDropDown;

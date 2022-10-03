/* eslint-disable react-hooks/exhaustive-deps */
import React, { Component, useEffect } from 'react';
import { View, Text, Picker, TouchableOpacity } from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import { Icon } from 'react-native-elements';
import { styles } from './styles';
import { render } from 'enzyme';
import LinearGradient from 'react-native-linear-gradient';
export const Dropdown = (props)=>{
    return (
      <TouchableOpacity style={[(props.isSmallFont && props.isSmallFont != undefined && props.isSmallFont != null) ? styles.rowHolderSmall : styles.rowHolder]}>
        <Text style={[styles.pickerText,{flex: props?.leftFlex ? props?.leftFlex : 1}]}>{props.title}</Text>
        {props.dropDownWidth ?
          <View style={[styles.pickerBox,{width:props.dropDownWidth}]}>
        <LinearGradient
           start={{x: 0, y: 0}} end={{x: 1, y: 0}}
        colors={['#D3E5FC','#F9F6EE']}
           style={styles.dropIcon}>
            <ModalDropdown
              disabled = {props?.disabled}
              ref = {props?.forwardedRef}
              options={props?.dropDownData}
              onDropdownWillShow={props?.onDropdownWillShow}
              onDropdownWillHide={props?.onDropdownWillHide}
              defaultValue={props.myDefaultValue != undefined ? props.myDefaultValue : 'Select'}
              style={styles.picker}
              textStyle={styles.pickerTextStyle}
              dropdownStyle={[styles.dropdownStyle,{width: props?.leftFlex ?  '' + (1 - props?.leftFlex) * 100 + '%' : '70%'}]}
              dropdownTextStyle={styles.dropdownTextStyle}
              showsVerticalScrollIndicator={false}
              renderSeparator={()=><View style={{height:1,backgroundColor:'#f68a23'}} />}
              onSelect={(index, value) => props.dropDownCallBack(index, value)} />
            <Icon name="arrow-drop-down" size={30} color={'#000'} />
          </LinearGradient>
        </View> :
        <View style={[styles.pickerBox,{flex:1}]}>
        <LinearGradient
           start={{x: 0, y: 0}} end={{x: 1, y: 0}}
        colors={['#D3E5FC','#F9F6EE']}
           style={styles.dropIcon}>
            <ModalDropdown
              disabled = {props?.disabled}
              ref = {props?.forwardedRef}
              options={props?.dropDownData}
              defaultValue={props.myDefaultValue != undefined ? props.myDefaultValue : 'Select'}
              style={styles.picker}
              textStyle={styles.pickerTextStyle}
              dropdownStyle={[styles.dropdownStyle,{width: props?.leftFlex ?  '' + (1 - props?.leftFlex) * 100 + '%' : '70%'}]}
              dropdownTextStyle={styles.dropdownTextStyle}
              showsVerticalScrollIndicator={false}
              renderSeparator={()=><View style={{height:1,backgroundColor:'#f68a23'}} />}
              onSelect={(index, value) => props.dropDownCallBack(index, value)} />
            <Icon name="arrow-drop-down" size={30} color={'#000'} />
          </LinearGradient>
        </View>
        }

      </TouchableOpacity>
    );
  };

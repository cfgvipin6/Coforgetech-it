import React, { Component } from 'react';
import { View, TextInput, Text, TouchableOpacity } from 'react-native';
import { styles } from './styles';
import { globalFontStyle } from '../../components/globalFontStyle';

export const LabelTextDashValue = (props)=>{
    return (
        <View style={styles.rowHolder}>
        <Text style={styles.heading}>{props.heading}</Text>
        {props.hyperLink !== undefined ?
          <View style={{flex:1,alignSelf:'flex-start'}}>
          <TouchableOpacity onPress={(item) => props.onHyperLinkClick(props.item)}>
              <Text style={{color:'blue',textDecorationLine:'underline'}}>
                {props.description}
              </Text>
          </TouchableOpacity>
          </View>
         :  <Text style={styles.description}>{(props.description !== null && props.description !== undefined && props.description !== '') ? props.description : '-'}</Text> }
        </View>
    );
};

export const LabelTextNoValue = (props)=>{
  if (props.description !== null && props.description !== undefined && props.description !== '') {
    return (
        <View style={styles.rowHolder}>
        <Text style={styles.heading}>{props.heading}</Text>
        {props.hyperLink !== undefined ?
          <View style={{flex:1,alignSelf:'flex-start'}}>
          <TouchableOpacity onPress={(item) => props.onHyperLinkClick(props.item)}>
              <Text style={{color:'blue',textDecorationLine:'underline'}}>
                {props.description}
              </Text>
          </TouchableOpacity>
          </View>
         : <Text style={styles.description}>{props.description}</Text> }
        </View>
    );
  } else {return null;}
};

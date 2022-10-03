import React, { Component } from 'react';
import { View, TextInput, Text, FlatList,ImageBackground } from 'react-native';
import { styles } from './styles';
import { globalFontStyle } from '../../components/globalFontStyle';
export const ApproveRejectCards = (props) => {
    if (props.data && props.data.length > 0){
        return (
            <View style={globalFontStyle.listContentViewGlobal}>
               <FlatList
                  contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
                  data={props.data}
                  showsVerticalScrollIndicator={false}
                  renderItem={(item, index) => props.renderItem(item, index)}
                  keyExtractor={(item, index) => 'items_' + index.toString()}
                  ItemSeparatorComponent={() => <View style={globalFontStyle.listContentSeparatorGlobal} />}
                />
            </View>
        );
    }
    else {
        return null;
    }

};

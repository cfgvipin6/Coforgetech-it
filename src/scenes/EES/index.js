/*
Author: Mohit Garg(70024)
*/

import React, { Component } from 'react';
import { View, Text, TouchableOpacity, BackHandler, Image, ScrollView, ImageBackground } from 'react-native';
import { connect } from 'react-redux';
import SubHeader from '../../GlobalComponent/SubHeader';
import HTML from 'react-native-render-html';
import { globalFontStyle } from '../../components/globalFontStyle';
import { styles } from './styles';
import CustomButton from '../../components/customButton';
import images from '../../images';
let globalConstants = require('../../GlobalConstants');
let constants = require('./constants');
export class EESScreen extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  handleBackButtonClick = () => {
    this.handleBack();
    return true;
  };

  handleBack = () => {
    this.props.navigation.pop();
  };

  HTMLTextView = text => {
    return (
      <View style={styles.bulletPara}>
        <Image style={styles.bulletImage} source={constants.BULLET_IMAGE}/>
        <HTML containerStyle={styles.bulletText} html={text}/>
      </View>
    );
  }

  paragraphBulletTextView = text => {
    return (
      <View style={styles.bulletPara}>
        <Image style={styles.bulletImage} source={constants.BULLET_IMAGE}/>
        <Text style={styles.bulletText}>{text}</Text>
      </View>
    );
  }

  paragraphTextView = text => {
    return (
      <Text style={styles.paraSeparate}>{text}</Text>
    );
  }

  render() {
    return (
      <ImageBackground
      style={{flex:1}}
      source={images.loginBackground}
    >
      <View style={styles.container}>
        <SubHeader
          pageTitle={globalConstants.EES_TITLE}
          backVisible={true}
          logoutVisible={true}
          handleBackPress={() => this.handleBack()}
          navigation={this.props.navigation}
        />
        {/* <Text style={styles.eesTitle}>{constants.EES_HEADING}</Text> */}
        <ScrollView 
        	keyboardShouldPersistTaps='handled'
        showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom:50}}>
        <View style={styles.scrollStyle}>
          <Text style={styles.dearNiitianText}>{constants.DEAR_NIITIAN_TEXT}</Text>
          <Text style={[styles.paraSeparate, globalFontStyle.dashboardTitleSize, {fontWeight: 'bold'}]}>{constants.WELCOME_TO_ESS_TEXT}</Text>
          {this.paragraphTextView(constants.PARA_ONE_TEXT)}
          {this.paragraphTextView(constants.PARA_TWO_TEXT)}
          {this.paragraphTextView(constants.PARA_TWO_SPLIT_TEXT)}
          {this.paragraphTextView(constants.PARA_THREE_TEXT)}
          {this.HTMLTextView(constants.PARA_FOUR_TEXT)}
          {this.paragraphBulletTextView(constants.PARA_FIVE_TEXT)}
          {this.paragraphBulletTextView(constants.PARA_SIX_TEXT)}
          {this.paragraphBulletTextView(constants.PARA_SEVEN_TEXT)}
          {this.paragraphTextView(constants.PARA_EIGHT_TEXT)}
          {this.paragraphTextView(constants.PARA_NINE_TEXT)}
        </View>
        </ScrollView>
        <View style={styles.startButtonView}>
					<CustomButton
						label={constants.START_TEXT}
						positive={true}
						performAction={() => this.props.navigation.navigate('EesQuestion')}
					/>
				</View>
      </View>
      </ImageBackground>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(EESScreen);

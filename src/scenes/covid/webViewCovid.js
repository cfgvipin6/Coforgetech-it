import React, { Component } from 'react';
import { StyleSheet, Text, View, BackHandler, TouchableOpacity } from 'react-native';
import { Icon } from "react-native-elements";
import { WebView } from 'react-native-webview';
import { globalFontStyle } from '../../components/globalFontStyle'
import ActivityIndicatorView from "../../GlobalComponent/myActivityIndicator"
import SubHeader from "../../GlobalComponent/SubHeader"
let appConfig = require("../../../appconfig");

const runFirst = `
let selector = document.querySelector("div.footer-social")
let selector1 = document.querySelector("div.mat-tab-body-wrapper")
selector.style.display = "none"
selector1.style.display = "none"
   
      true; // note: this is required, or you'll sometimes get silent failures
    `;



export default class covidWebScreen extends Component {

  constructor(props) {
    super(props)
    this.state = {
      myCanGoBack: false,
      myCanGoForward: false,
      mySetCurrentURL: '',
      myTitle: ''
    }
    this.webviewRef = React.createRef()
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick)
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick)
  }

  handleBackButtonClick = () => {
    this.handleBack()
    return true
  }

  handleBack = () => {
    this.props.navigation.pop();
  };

  backButtonHandler = () => {
    if (this.webviewRef.current) this.webviewRef.current.goBack()
  }
  
  frontButtonHandler = () => {
    if (this.webviewRef.current) this.webviewRef.current.goForward()
  }

  render() {
    return (
      <View style={globalFontStyle.container}>
				<View style={globalFontStyle.subHeaderViewGlobal}>
					<SubHeader
						pageTitle={"Coforge CoWIN"}
						backVisible={true}
						logoutVisible={true}
						handleBackPress={() => this.handleBack()}
						navigation={this.props.navigation}
					/>
				</View>
        <View style={{alignItems:'center',
        padding:6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: appConfig.LOGIN_FIELDS_BACKGROUND_COLOR}}>
          {this.state.myCanGoBack ? 
          <TouchableOpacity onPress={this.backButtonHandler}>
          <Icon name="arrow-back" size={24} /> 
          </TouchableOpacity> : null}
          <Text style={{fontSize:18}}>{this.state.myTitle.includes("http") ? "" : this.state.myTitle}</Text>
          {this.state.myCanGoForward ? 
            <TouchableOpacity onPress={this.frontButtonHandler}>
            <Icon name="arrow-forward" size={24} />
            </TouchableOpacity> : null}
        </View>
        <WebView 
          ref={this.webviewRef}
          source={{ uri: 'https://www.cowin.gov.in/home' }}
          startInLoadingState={true}
          injectedJavaScript={runFirst}
          onNavigationStateChange={(navState) => {
            console.log("web view navState",navState)
            this.setState({
              myCanGoBack: navState.canGoBack,
              myCanGoForward: navState.canGoForward,
              mySetCurrentURL: navState.url,
              myTitle: navState.title
            })
          }}
        />
        </View>
    );
  }
}
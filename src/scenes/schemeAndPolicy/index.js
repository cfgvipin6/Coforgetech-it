import React, { Component, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, BackHandler, Alert, ScrollView, FlatList, ImageBackground } from 'react-native';
import { globalFontStyle } from '../../components/globalFontStyle';
import { styles } from './styles';
import { List } from 'react-native-paper';
import SubHeader from '../../GlobalComponent/SubHeader';
import ActivityIndicatorView from '../../GlobalComponent/myActivityIndicator';
import { writeLog } from '../../utilities/logger';
import { Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import NestedListView, { NestedRow } from 'react-native-nested-listview';
import properties from '../../resource/properties';
import { fetchGETMethod } from '../../utilities/fetchService';
import images from '../../images';
let globalConstants = require('../../GlobalConstants');
let constants = require('./constants');
let menuData;
let dataCollection = [];
let nodeToInsert = '';
class SchemeAndPolicyScreen extends Component {

  constructor(props) {
		super(props);
		this.state = {
      data: [],
      loading:false,
    };
  }
  handleBackButtonClick=()=> {
    console.log('Hardware back pressed');
    this.props.navigation.goBack(null);
    return true;
  }

  async componentDidMount(){
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    this.setState({loading:true});
    let url = properties.policySchemes.concat('?id=' + this.props.loginData.PolicyID);
    console.log('Policy & Screen url is : ', url);
    let response = await fetchGETMethod(url);
    console.log('Response is  : ', response);
    menuData = response;
    this.setState({data:response,loading:false});
  }
  handleBack = () => {
    this.props.navigation.pop();
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }
  sectionItem(item) {
    return (
      <TouchableOpacity onPress={() => this.sectionItemClick(item)}>
        <View style={{}}>
          <Text style={globalFontStyle.dashboardTitleSize}>
            {item.Title}
          </Text>
          <Icon name="chevron-plus" size={35} />
        </View>
      </TouchableOpacity>
    );
  }
  nodeItemClicked = (node) => {
		if (node.items == undefined) {
      this.setState({loading:true});
      this.setState({data:[]},()=>{
        this.setState({data:menuData},()=>{
          setTimeout(()=>{
            this.setState({loading:false});
            this.props.navigation.navigate('SchemeDetails', { items: node,parent:dataCollection});
            dataCollection = [];
          },0);
        });
      });
    } else {
      console.log('Node pushed is : ', node);
      if ((!dataCollection.includes(node.title))){
        if (node.hasChild){
          nodeToInsert = '';
          dataCollection = [];
          nodeToInsert = node.title;
        }
        if (node.hasChild == undefined && node.items !== undefined){
          dataCollection = [];
          dataCollection.push(nodeToInsert);
        }
        dataCollection.push(node.title);
      }

    }
    let status  = node.opened && node.opened == true && node.items !== undefined ? '-' : node.items !== undefined ? '+' : '';
    console.log('Node status is : ', status);
    console.log('Node Collections is : ', dataCollection);
	}

	renderListNode = (node, level) => {
		return (
			<NestedRow level={level} style={{ alignItems: 'flex-start' }}>
				<View style={{ width: '100%', paddingVertical: 10 }}>
					<View style={{ flexDirection: 'row' }}>
						<Text>{node.opened && node.opened == true && node.items !== undefined ? '-' : node.items !== undefined ? '+' : ''}</Text>
						<Text style={{ fontWeight: node.items !== undefined ? 'bold' : 'normal',color: '#000cb8',alignItems:'center'}}>{node.title}</Text>
					</View>
					<View style={{ width: '100%', height: 0.5, marginTop:10,marginRight:15, backgroundColor: 'grey' }} />
				</View>
			</NestedRow>
		);
	}
  getItems = () => {
		return <NestedListView data={this.state.data} getChildrenName={(node) => 'items'} onNodePressed={(node) => this.nodeItemClicked(node)} renderNode={(node, level) => this.renderListNode(node, level)} />;
	}
  render() {
    return (
      <ImageBackground
      style={{flex:1}}
      source={images.loginBackground}
    >
      <View style={styles.container}>
        <SubHeader
          pageTitle={globalConstants.SCHEME_AND_POLICY_TITLE}
          backVisible={true}
          logoutVisible={true}
          // drawerVisible={true}
          handleBackPress={() => this.handleBack()}
          navigation={this.props.navigation}
        />
        <ActivityIndicatorView loader={this.state.loading} />
        <ScrollView
        	keyboardShouldPersistTaps='handled'
        >{this.getItems()}</ScrollView>
      </View>
      </ImageBackground>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loginData: state && state.loginReducer && state.loginReducer.loginData,
  };
};


const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SchemeAndPolicyScreen);

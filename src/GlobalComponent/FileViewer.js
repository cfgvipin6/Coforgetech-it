import React, { Component } from 'react'
import { View, Text,BackHandler } from 'react-native'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import FileViewer from 'react-native-file-viewer';
import ActivityIndicatorView from './myActivityIndicator';
import SubHeader from './SubHeader';
let globalConstants = require("../GlobalConstants")
export class FileViewer extends Component {
    constructor(props){
        super(props)
        this.state={
            loading:false
            fileName: this.props.navigation.state.param.fileName;
        }
        
    }
    handleBackButtonClick = () => {
		this.onBack()
		return true
	}
    onBack = () => {
		this.props.navigation.pop()
	}
    componentDidMount(){
        BackHandler.addEventListener("hardwareBackPress", this.handleBackButtonClick)
        <SubHeader pageTitle={globalConstants.FILE_VIEWER} backVisible={true} logoutVisible={true} handleBackPress={() => this.onBack()} navigation={this.props.navigation} />
    }

    componentWillMount(){
        BackHandler.removeEventListener("hardwareBackPress", this.handleBackButtonClick)
    }
    render() {
        return (
            <View style={{flex:1,justifyContent:"center",alignItems:center}}>
                {/* <ActivityIndicatorView loader={this.state.loading}/> */}
            </View>
        )
    }
}

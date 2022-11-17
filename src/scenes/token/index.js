import React, { Component } from 'react';

import {
    View,
    Text,
    ImageBackground,
    FlatList,
    ActivityIndicator, UIManager, Platform,  /* Added */
} from 'react-native';

import style from './style.js';
import { moderateScale } from '../../components/fontScaling.js';
import {fetchPOSTMethod } from '../../utilities/fetchService';
import properties from '../../resource/properties';

import { ScrollView } from 'react-native-gesture-handler';
import UserMessage from '../../components/userMessage';

import { writeLog } from '../../utilities/logger';

let constant = require('./constants');
let appConfig = require('../../../appconfig');




export default class TokenScreen extends Component {
    constructor(props) {
        super(props);
        if (Platform.OS === 'android')   /* Added */ {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
        this.state = {

            VoucherList: [],
            showErrorModal: false,

            textLayoutHeight: 0,            /* Added */
        };
    }

    componentDidMount() {
        writeLog('Landed on ' + 'TokenScreen');
       this.getVoucherList();
    }

    async getVoucherList() {

        this.setState({ isIndicatorVisible: true });
        let getEmployeeId = empCode;
        let getAuthenticationKey = authenticationKey;
        let form = new FormData();
        form.append('ECSerp',getEmployeeId);
        form.append('AuthKey',getAuthenticationKey);

        let url = properties.pendingVoucherPostURL;
        let response = await fetchPOSTMethod(url,form);
        // console.log("response from Voucher request" + response[0]);
        if (response[0] != undefined) {
            this.setState({
                VoucherList: response,
                isIndicatorVisible: false,
            });

        }
        else {
            this.setState({
                showErrorModal: true,
                isIndicatorVisible: false,
            });

        }
    }

    showDialogBox() {
        if (this.state.showErrorModal) {
            let errorMessage = constant.SLOW_RESPONSE;
            let Message = (props) => <View><Text style={{ marginHorizontal: '4.3%', fontSize: moderateScale(14), color: appConfig.GUN_METAL_COLOR, letterSpacing: moderateScale(0.7), textAlign: 'center' }}>{errorMessage}</Text></View>;
            return (
                <UserMessage heading={'sorry'} message={<Message />} okAction={() => { this.setState({ showErrorModal: false }); this.backNavigate(); }} />
            );
        }
    }

    backNavigate() {
        writeLog('Clicked on ' + 'loginWithApp' + ' of ' + 'TokenScreen');
        this.props.navigation.pop();
    }

    renderVoucherRequest(item) {
        return (
            <View >
                <ImageBackground style={style.cardBackground} resizeMode="cover">
                    <View style={{ flex: 0 }}>
                        <View style={{ flex: 0, flexDirection: 'row' }}>
                            <View style={{ flexDirection: 'column', width: '50%'  }}>
                                <Text style={{ fontSize: moderateScale(15), marginHorizontal: moderateScale(12), fontWeight: 'bold' }}>{'Document#'} </Text>
                                <Text style={{ fontSize: moderateScale(15), marginHorizontal: moderateScale(12), fontWeight: 'bold' }}>{'Employee-Name'} </Text>
                                <Text style={{ fontSize: moderateScale(15), marginHorizontal: moderateScale(12), fontWeight: 'bold' }}>{'Project-Desc'} </Text>
                            </View>
                            <View style={{ flexDirection: 'column', width: '50%' }}>
                                <Text style={{ fontSize: moderateScale(15), marginHorizontal: moderateScale(12), fontWeight: 'bold' }}>{item.DocumentNo} </Text>
                                <Text style={{ fontSize: moderateScale(15), marginHorizontal: moderateScale(12), fontWeight: 'bold' }}>{item.EmpName}</Text>
                                <Text style={{ fontSize: moderateScale(15), marginHorizontal: moderateScale(12), fontWeight: 'bold' }}>{item.ProjectDesc}</Text>
                            </View>
                        </View>
                    </View>
                </ImageBackground>
                <View style={{ height: moderateScale(16) }} />
            </View>
        );
    }


    render() {
        let data = this.state.VoucherList;
        return (
            <View style={style.container}>
                <View style={{ paddingVertical: moderateScale(16) }}>
                    {/* <Text style={style.userNameText}> Hello, {this.state.loggedInDetails.SmFirstname} {this.state.loggedInDetails.SmLastName}</Text> */}
                    <ScrollView 
                    	keyboardShouldPersistTaps='handled'
                    style={{ flex: 0 }} showsVerticalScrollIndicator={true}>
                        <View style={style.listOuterView}>
                            <FlatList
                                contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
                                data={data}
                                showsVerticalScrollIndicator={false}
                                renderItem={({ item }) => this.renderVoucherRequest(item)}
                                // keyExtractor={(item, index) => "pendingRequest_" + index.toString()}
                                ItemSeparatorComponent={() => <View style={{ backgroundColor: 'white' }}><Text /></View>}
                            />
                        </View>
                        {this.showDialogBox()}
                        {this.state.isIndicatorVisible && <ActivityIndicator size="large" color="#0000ff" />}
                    </ScrollView>
                    {/* {this.renderApprovalRejectDialogBox()} */}
                </View>
            </View>
        );
    }

    getHeight(height) {
        this.setState({ textLayoutHeight: height });
    }
}


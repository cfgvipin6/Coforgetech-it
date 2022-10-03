import React, { Component, useRef, useEffect } from 'react';
import {
    View,
    Text,
    BackHandler,
    TextInput,
    TouchableOpacity,
    Image,
    ImageBackground,
    Dimensions,
    RefreshControl,
    ScrollView,
    LayoutAnimation,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SubHeader from '../../../GlobalComponent/SubHeader';
import { styles } from './styles';
import RadioForm from 'react-native-simple-radio-button';
import { globalFontStyle } from '../../../components/globalFontStyle';
import { RadioForms } from '../../../GlobalComponent/LabelRadioForm/LabelRadioForm';
import { Dropdown } from '../../../GlobalComponent/DropDown/DropDown';
import { FileBrowser } from '../../../GlobalComponent/FileBrowser/FileBrowser';
import { LabelTextDashValue } from '../../../GlobalComponent/LabelText/LabelText';
import { LabelEditText } from '../../../GlobalComponent/LabelEditText/LabelEditText';
import CustomButton from '../../../components/customButton';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import ActivityIndicatorView from '../../../GlobalComponent/myActivityIndicator';
import { Card, SearchBar } from 'react-native-elements';
import {
    CheckBoxCard,
    SelectAllController,
} from '../../../GlobalComponent/CheckBoxCard/CheckBoxCard';
import { ApproveRejectCards } from '../../../GlobalComponent/ApproveRejectList/ApproveRejectList';
import { DetailHistoryPanel } from '../../../GlobalComponent/DetailHistoryPanel/DetailHistoryPanel';
import { getMyRequestsData, resetMyRequests } from './myRequestAction';
import { writeLog } from '../../../utilities/logger';
import UserMessage from '../../../components/userMessage';
import images from '../../../images';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';
let globalConstants = require('../../../GlobalConstants');
let constants = require('./constants');
const { height } = Dimensions.get('window');
class MyRequestScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isRefreshing: false,
            localMyRequestSearchData: [],
            myRequestSearchData:[],
            query: '',
            actionPopUP:false,
            actionMessage:'',
            active_index: -1,
            updatedHeight: 0,
            expand: false,
        };
        isPullToRefreshActive = false;
        this._panel = React.createRef();
    }
    static getDerivedStateFromProps = (nextProps, state) => {
        if (nextProps.myRequestData.length > 0 && !state.query.length > 0) {
            return {
                myRequestSearchData: nextProps.myRequestData,
                localMyRequestSearchData: nextProps.myRequestData,
            };
          } else {
            return null;
          }
    }
    componentDidUpdate() {
        if (this.props.myRequestError && this.props.myRequestError.length > 0 && this.state.actionMessage === ''){
            setTimeout(()=>{
              this.setState({actionPopUP:true,actionMessage:this.props.myRequestError});
            },1000);
        }
    }
    expand_collapse_Function = (i) => {
        console.log('Expand collapse clicked ', i, this.state.active_index);
        LayoutAnimation.configureNext({
            duration: 300,
            create: {
              type: LayoutAnimation.Types.easeInEaseOut,
              property: LayoutAnimation.Properties.opacity,
            },
            update: { type: LayoutAnimation.Types.easeInEaseOut },
          });
        if (i == this.state.active_index) {
            this.setState({
                active_index: -1,
                updatedHeight: 0,
                expand: false,
            });
        } else {
            this.setState({
                active_index: i,
                updatedHeight: 150,
                expand: true,
            });
        }
    }
    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
        this.props.getMyRequests(
            this.props.loginData.SmCode,
            this.props.loginData.Authkey,
            isPullToRefreshActive
        );
    }
    onRefresh = () => {
        console.log('On Refresh is called');
        this.setState({ isRefreshing: true });
        isPullToRefreshActive = true;
        this.wait(2000).then(() => this.setState({ isRefreshing: false }));
    }
    wait(timeout) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(
                    this.props.getMyRequests(
                        this.props.loginData.SmCode,
                        this.props.loginData.Authkey,
                        isPullToRefreshActive
                    )
                );
            }, timeout);
        });
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error: error,
            info: errorInfo,
        });
    }
    componentWillUnmount() {
        this.props.resetMyRequestData();
        console.log('Component will unmount called');
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
        this.setState({localMyRequestSearchData:[],myRequestSearchData:[],actionMessage:'',actionPopUP:false});
    }

    handleBackButtonClick = () => {
        this.handleBack();
        return true;
    }

    handleBack = () => {
        this.props.navigation.pop();

    }

    openNewPanel = (item, panel) => {
        if (this._panel.current !== null){
            this._panel.current.show(height / 1.3);
        }
    }

    proceedRequest=(item)=>{
        console.log('sending data',item);
        this.props.navigation.navigate('CreateRequestISD',{dataToUpdate: item});
    }
    processSurvey=(item)=>{
        console.log('Survery item',item);
        this.props.navigation.navigate('SurveyITDesk',{dataToUpdate: item});
    }
    renderItems = (item, index) => {
        console.log('IT DESK ITEM : ', item);
        console.log('Modifieddata: ', item.ModifiedOn);
         const momentDate= moment( item.ModifiedOn)
         const currentdate = moment();
         const from = momentDate;
          const to   = currentdate;
   
 const result =  Math.abs(
       moment(from, 'YYYY-MM-DD')
         .startOf('day')
         .diff(moment(to, 'YYYY-MM-DD').startOf('day'), 'days')
     ) + 1
   const checkDays = result<=10
     
        return (
            <View
            // start={{ x: 0, y: 1 }}
			// end={{ x: 0, y: 0 }}
			// colors={['#fff','#D3E5FC']}
            style={styles.cardBackground} resizeMode="cover">
                <LabelTextDashValue item = {item} hyperLink = {true} onHyperLinkClick = {(item)=>this.proceedRequest(item)} heading="Service Number" description={item.ServiceNumber.trim()} />
                <LabelTextDashValue heading="Category" description={item.RequestCategoryName} />
                <LabelTextDashValue heading="Subcategory" description={item.RequestSubCategoryName} />


                     {this.state.active_index === index ?
                     <View>
                     <LabelTextDashValue heading="Created On" description={item.CreatedOn} />
                    <LabelTextDashValue heading="Status" description={item.RequestStatusName} />
                    <LabelTextDashValue heading="Stage" description={item.Stage} />
                    <LabelTextDashValue heading="Pending Since" description={item.ModifiedOn} />
                    <LabelTextDashValue heading="Hold Reason" description={item.HoldReason} />
                    <LabelTextDashValue heading="Pending with" description={item.RequestPendingWith} />
                    <LabelTextDashValue heading="Description" description={item.RequestDescription} />
                     </View> : null
                     }
                     <View
            style={styles.bottomButtonContainer}
          >
          <View>
          {this.state.active_index === index ? (
              <TouchableOpacity
                onPress={() => this.expand_collapse_Function(index)}
              >
                <Image source={images.lessButton} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => this.expand_collapse_Function(index)}
              >
                <Image source={images.moreButton} />
              </TouchableOpacity>
            )}
          </View>
           </View>
           {item?.RequestStatus == "5" && checkDays  && <LabelTextDashValue item = {item} hyperLink = {true} onHyperLinkClick = {(item)=>this.processSurvey(item)} heading="" description={'Complete Suvery'} />}
            </View>
        );
    }

    updateSearch = (searchText) => {
        this.setState(
            {
                query: searchText,
            },
            () => {
                const filteredData = this.state.localMyRequestSearchData.filter((element) => {
                    let str1 = element.ServiceNumber;
                    let str2 = element.RequesterName;
                    let str3 = element.RequestCategoryName;
                    let searchedText = str1.concat(str2).concat(str3);
                    let elementSearched = searchedText.toString().toLowerCase();
                    let queryLowerCase = this.state.query.toString().toLowerCase();
                    return elementSearched.indexOf(queryLowerCase) > -1;
                });
                this.setState({
                    myRequestSearchData: filteredData,
                },()=>{
                    console.log('Update search called',filteredData);
                });
            }
        );
    }
    onOkClick = () => {
        writeLog('Clicked on ' + 'onOkClick' + ' of ' + 'PendingRequest screen');
        this.props.navigation.pop();
    }
    showPopUp= () => {
        writeLog('Dialog is open with exception ' + this.props.itError + ' on ' + 'MyRequest screen');
        return (
            <UserMessage
                modalVisible={true}
                heading="Error"
                message={this.props.myRequestError}
                okAction={() => {
                    this.onOkClick();
                }}
            />
        );
    }
    render() {
        const { query } = this.state;
        if (this.state.error) {
            return (
                <View style={styles.container}>
                    <Text>{this.state.error}</Text>
                    <Text>{this.state.info}</Text>
                </View>
            );
        }
        return (
            <ImageBackground
      style={{flex:1}}
      source={images.loginBackground}
    >
            <View style={styles.container}>
                <View style={globalFontStyle.subHeaderViewGlobal}>
                    <SubHeader
                        pageTitle={globalConstants.MY_REQUEST_IT_DESK}
                        backVisible={true}
                        logoutVisible={true}
                        handleBackPress={() => this.handleBack()}
                        navigation={this.props.navigation}
                    />
                </View>
                <View style={globalFontStyle.searchViewGlobal} >
                    <SearchBar
                        lightTheme
                        placeholder={'Search by document number'}
                        onChangeText={this.updateSearch}
                        value={query}
                        raised={true}
                        containerStyle={globalFontStyle.searchGlobal}
                        autoCapitalize="none"
            autoCompleteType="off"
            autoCorrect={false}
                    />
                    </View>
                    <View style={globalFontStyle.contentViewGlobal}>
                    <ApproveRejectCards
                        data={this.state.myRequestSearchData}
                        renderItem={({ item, index }) => this.renderItems(item, index)}
                        refreshing={this.state.isRefreshing}
                    />
                    </View>
                   <ActivityIndicatorView loader={this.props.myRequestLoading}/>
                   {this.state.actionPopUP === true ? this.showPopUp() : null}
            </View>
            </ImageBackground>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        loginData: state && state.loginReducer && state.loginReducer.loginData,
        myRequestData: state && state.itDeskMyRequestReducer && state.itDeskMyRequestReducer.myRequestData,
        myRequestLoading: state && state.itDeskMyRequestReducer && state.itDeskMyRequestReducer.myRequestLoading,
        myRequestError: state && state.itDeskMyRequestReducer && state.itDeskMyRequestReducer.myRequestError,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getMyRequests: (loginId, authKey, isPullToRefreshActive) =>
        dispatch(getMyRequestsData(loginId, authKey, isPullToRefreshActive)),
        resetMyRequestData:()=>dispatch(resetMyRequests()),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MyRequestScreen);

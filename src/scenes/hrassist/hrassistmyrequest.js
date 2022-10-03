import React, { Component } from 'react';
import {
    View,
    Text,
    BackHandler,
    TouchableOpacity,
    Image,
    ImageBackground,
    Dimensions,
    LayoutAnimation,
} from 'react-native';
import { connect } from 'react-redux';
import SubHeader from './../../GlobalComponent/SubHeader';
import { styles } from './styles';
import { globalFontStyle } from './../../components/globalFontStyle';
import { Dropdown } from './../../GlobalComponent/DropDown/DropDown';
import { FileBrowser } from './../../GlobalComponent/FileBrowser/FileBrowser';
import { LabelTextDashValue } from './../../GlobalComponent/LabelText/LabelText';
import { LabelEditText } from './../../GlobalComponent/LabelEditText/LabelEditText';
import CustomButton from './../../components/customButton';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import ActivityIndicatorView from './../../GlobalComponent/myActivityIndicator';
import { Card, SearchBar } from 'react-native-elements';
import {
    CheckBoxCard,
    SelectAllController,
} from './../../GlobalComponent/CheckBoxCard/CheckBoxCard';
import { ApproveRejectCards } from './../../GlobalComponent/ApproveRejectList/ApproveRejectList';
import { DetailHistoryPanel } from './../../GlobalComponent/DetailHistoryPanel/DetailHistoryPanel';
// import { getMyRequestsData, resetMyRequests } from './myRequestAction';
import { writeLog } from './../../utilities/logger';
import UserMessage from './../../components/userMessage';
import images from './../../images';
import LinearGradient from 'react-native-linear-gradient';
import { getHrRequestsList } from './utils';
let globalConstants = require('./../../GlobalConstants');
const { height } = Dimensions.get('window');
class HrassistMyrequest extends Component {
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
            loading:false,
        };
        isPullToRefreshActive = false;
        this._panel = React.createRef();
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
    successCallBack=(data)=>{
      console.log('List data in MyList Hr Assist : ', data);
      this.setState({
        myRequestSearchData: data,
        localMyRequestSearchData: data,
        loading:false,
      });
    }
    errorCallBack=(error)=>{
      console.log('Error in MyList Hr Assist : ', error);
      this.setState({loading:false});
    }
    componentDidMount() {
        this.setState({loading:true});
        getHrRequestsList(this.successCallBack,this.errorCallBack);
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
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
        this.props.navigation.navigate('HRAssistCreate',{dataToUpdate: item, isComingFromMyRequest:true});
    }

    renderItems = (item, index) => {
        console.log('HR DESK ITEM : ', item);
        return (
            <View
            // start={{ x: 0, y: 1 }}
			// end={{ x: 0, y: 0 }}
			// colors={['#fff','#D3E5FC']}
            style={styles.cardBackground} resizeMode="cover">
                <LabelTextDashValue item = {item} hyperLink = {true} onHyperLinkClick = {(item)=>this.proceedRequest(item)} heading="Query Number" description={item.QueryNumber.trim()} />
                <LabelTextDashValue heading="Category" description={item.Category} />
                <LabelTextDashValue heading="Subcategory" description={item.Subcategory} />
                <LabelTextDashValue heading="Subject Line" description={item.SubjectLine} />
                     {this.state.active_index === index ?
                     <View>
                     <LabelTextDashValue heading="Team Name" description={item.TeamName} />
                     <LabelTextDashValue heading="Status" description={item.Status} />
                     <LabelTextDashValue heading="Stage" description={item.Stage} />
                     <LabelTextDashValue heading="Pending with" description={item.Pendingwith} />
                     <LabelTextDashValue heading="Created On" description={item.CreatedOn} />
                     </View> : null
                     }
                     <View
            style={styles.bottomButtonContainer}
          >
          <ActivityIndicatorView loader={this.state.loading}/>
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
                    let str1 = element.QueryNumber;
                    let str2 = element.Category;
                    let str3 = element.Pendingwith;
                    let str4 = element.CreatedOn;
                    let str5 = element.Subcategory;
                    let str6 = element.TeamName;
                    let searchedText = str1.concat(str2).concat(str3).concat(str4).concat(str5).concat(str6);
                    let elementSearched = searchedText.toString().toLowerCase();
                    let queryLowerCase = this.state.query.toString().toLowerCase();
                    return elementSearched.indexOf(queryLowerCase) > -1;
                });
                this.setState({
                    myRequestSearchData: filteredData,
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
                        pageTitle={globalConstants.MY_REQUEST_HR_ASSIST}
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
        // getMyRequests: (loginId, authKey, isPullToRefreshActive) =>
        // dispatch(getMyRequestsData(loginId, authKey, isPullToRefreshActive)),
        // resetMyRequestData:()=>dispatch(resetMyRequests()),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(HrassistMyrequest);

import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  ImageBackground,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { connect } from 'react-redux';
import { styles } from './styles';
import { globalFontStyle } from '../../components/globalFontStyle';
import { Card } from 'react-native-elements';
import ModalDropdown from 'react-native-modal-dropdown';
import { Icon} from 'react-native-elements';
import HTML from 'react-native-render-html';
import SwipeablePanel from 'rn-swipeable-panel';
import SlidingUpPanel from 'rn-sliding-up-panel';
import UserMessage from '../../components/userMessage';
import SubHeader from '../../GlobalComponent/SubHeader';
import ActivityIndicatorView from '../../GlobalComponent/myActivityIndicator';
import CustomButton from '../../components/customButton';
import { cdsFetchLineItemData, resetCdsDetailsScreen, cdsFetchActionListData, cdsFetchDetailData } from './cdsAction';
import helper from '../../utilities/helper';
import { writeLog } from '../../utilities/logger';
import images from '../../images';
let globalConstants = require('../../GlobalConstants');
let constants = require('./constants');
const {height} = Dimensions.get('window');

export class CDSDetails extends Component {

  constructor(props) {
    super(props);
    previousScreenData = this.props.navigation.state.params;
    (empData = previousScreenData.docDetails),
    (this.state = {
      localCdsLineItemData: [],
      localCdsDetailData: [],
      localCdsActionListData: [],
      subLineItemData: [],
      checkBoxFinalArray: [],
      lineItemStringArray: [],
      swipeablePanelActive: false,
      myDropdownText: 'SELECT ACTION',
      errorPopUp:false,
      isError:'',
    });
    checkIconFlagArray = [];

  }
  componentDidUpdate(){
    if (this.props.cdsLineItemError && this.props.cdsLineItemError.length > 0 && this.state.isError === ''){
      setTimeout(()=>{
        this.setState({errorPopUp:true,isError:this.props.cdsLineItemError});
      },1000);
    }
  }
  componentDidMount() {
    writeLog('Landed on ' + 'CDSDetails');
    this.props.fetchCdsLineItemData(empData.CDSCode);  //async service call need to handled
    this.props.fetchCdsActionListData(empData.CDSCode);
    this.props.fetchCdsDetailData(empData.CDSCode);
  }

  componentWillUnmount() {
    this.props.resetCdsDetails();
  }

  static getDerivedStateFromProps(nextProps, state) {
    if (
      (nextProps.cdsLineItemData &&
      nextProps.cdsLineItemData.length > 0 &&
      nextProps.cdsLineItemError === '') &&
      (nextProps.cdsDetailData && nextProps.cdsDetailData.length > 0 && nextProps.cdsDetailError === '') &&
      (nextProps.cdsActionListData && nextProps.cdsActionListData.length > 0 && nextProps.cdsActionListError === '')
    ) {
      return {
        localCdsLineItemData: nextProps.cdsLineItemData,
        localCdsActionListData: nextProps.cdsActionListData,
        localCdsDetailData: nextProps.cdsDetailData,
      };
    }
    else {
      return null;
    }
  }

  handleBack = () => {
    this.props.resetCdsDetails();
    this.props.navigation.pop();
  };

  showCdsRowGrid = (itemName, itemValue) => {
    if (itemValue != '' && itemValue != null && itemValue != undefined) {
      return (
        <View style={styles.rowStyle}>
          <Text style={[globalFontStyle.imageBackgroundLayout, styles.textOne]}>
            {itemName}
          </Text>
          <Text style={(itemName === constants.UTILIZATION_TEXT && itemValue === 'Non-Budget') ?
          [globalFontStyle.imageBackgroundLayout, styles.textTwoRed] :
          [globalFontStyle.imageBackgroundLayout, styles.textTwo]}>
            {itemValue}
          </Text>
        </View>
      );
    } else {
      return null;
    }
  };

  renderDocumentDetails() {
    let docDetails = this.state.localCdsDetailData[0];
    // console.log("6666666", this.state.localCdsDetailData)
    if (this.state.localCdsDetailData && this.state.localCdsDetailData.length > 0) {
    return (
      <ImageBackground style={styles.cardBackground} resizeMode="cover">
        <View style={styles.cardLayout}>
          {this.showCdsRowGrid(
            globalConstants.DOCUMENT_NUMBER_TEXT,
            docDetails.CDSCode
          )}
          {this.showCdsRowGrid(
            globalConstants.EMPLOYEE_TEXT,
            docDetails.EmpCode.concat(' : ').concat(docDetails.EmpName.trim())
          )}
          {/* {this.showCdsRowGrid(
            constants.CDS_STATUS_DESC_TEXT,
            empData.CDSStatusDesc.trim()
          )} */}
          {this.showCdsRowGrid(
            globalConstants.COST_CENTER_TEXT,
            docDetails.CostCenterCode.trim().concat(' : ').concat(docDetails.CostCenterName.trim())
          )}
          {this.showCdsRowGrid(
            globalConstants.PROJECT_TEXT,
            docDetails.ProjectCode.trim().concat(' : ').concat(docDetails.ProjectName.trim())
          )}
          {this.showCdsRowGrid(
            globalConstants.COMPANY_CODE_TEXT,
            docDetails.CompCode
          )}
          {this.showCdsRowGrid(
            constants.UTILIZATION_TEXT,
            docDetails.UtilizationDesc
          )}
          {this.showCdsRowGrid(
            constants.TOTAL_ANNUAL_BUDGET,
            docDetails.TotalAvailableBudgetONOFF
          )}
          {this.showCdsRowGrid(
            constants.RECOVERABLE_TEXT,
            docDetails.RecoveryDesc
          )}
          {docDetails.RecoveryDesc === 'Yes' ? this.showCdsRowGrid(
            constants.RECOVERY_DESC_TEXT,
            docDetails.RecoveryModeDesc
          ) : null}
          {docDetails.RecoveryDesc === 'Yes' ? this.showCdsRowGrid(
            constants.CLIENT_CODE_TEXT,
            docDetails.ClientCode
          ) : null}
          {this.showCdsRowGrid(constants.TOTAL_AMOUNT_TEXT, docDetails.CDSFinalAmount + '(' + docDetails.DefaultCurrency + ')')}
        </View>
      </ImageBackground>
    );
  }
  else {return null;}
  }

  //   renderRemarksView() {
  //     return (
  //         <View style={styles.remarksParent}>
  //           <TextInput
  //             multiline={true}
  //             maxLength={200}
  //             onChangeText={text => this.setState({ remarks: text })}
  //             value={this.state.remarks}
  //             placeholder="Remarks(for Submit)"
  //             style={{
  //               width: "100%",
  //               paddingLeft: 10,
  //               paddingTop: 10,
  //               paddingBottom: 10
  //             }}
  //           />
  //         </View>
  //       );
  //   }

  onOkClick = () => {
    // this.props.resetCdsDetails();
    writeLog('Clicked on ' + 'onOkClick' + ' of ' + 'CDSDetails');
    this.setState({errorPopUp:false,isError:''},()=>{
      helper.onOkAfterError(this);
    });
  };

  showError = () => {
    // console.log("In side show error of cds details screen.");
    writeLog('Dialog is open with exception ' + this.props.cdsLineItemError + ' on ' + 'CDSDetails');
    return (
      <UserMessage
        modalVisible={true}
        heading="Error"
        message={this.props.cdsLineItemError}
        okAction={() => {
            this.onOkClick();
        }}
      />
    );
  }

  renderHTMLRowGrid = (itemName, itemValue) => {
    if (itemValue != '' && itemValue != null && itemValue != undefined) {
      return (
        <View style={styles.cardView}>
          <Text style={globalFontStyle.cardLeftText}>{itemName}</Text>
          <HTML containerStyle={globalFontStyle.cardRightText} html={itemValue}/>
        </View>
      );
    } else {return null;}
  }

  renderLineItemRowGrid = (itemName, itemValue) => {
    if (itemValue != '' && itemValue != null && itemValue != undefined && itemValue != ' : ') {
      return (
        <View style={styles.cardView}>
          <Text style={globalFontStyle.cardLeftText}>{itemName}</Text>
          <Text style={globalFontStyle.cardRightText}>{itemValue}</Text>
        </View>
      );
    } else {return null;}
  }

  renderSubLineItems = () => {

  }

  renderCardItem = data => {
    // console.log("card data:::",data)
    let localCurrencyAmount = '';
    localCurrencyAmount = data.ConvertAmountFrom;
    return (
      <View>
      {this.renderLineItemRowGrid(constants.CATEGORY_TEXT, data.Category)}
      {this.renderLineItemRowGrid(constants.PARTICULARS_TEXT, data.Particulars.trim())}
      {this.renderLineItemRowGrid(constants.QUANTITY_TEXT, data.Quantity)}
      {(data.ConvertCurrencyFrom.trim() === data.ConvertCurrencyTo.trim()) ? null : this.renderLineItemRowGrid(constants.AMOUNT_IN_LOCAL_CURRENCY + '(' + data.ConvertCurrencyFrom.trim() + ')', localCurrencyAmount)}
      {this.renderLineItemRowGrid(constants.AMOUNT_IN_TEXT + ' ' + data.ConvertCurrencyTo.trim(), data.ConvertAmountTo)}
      {this.renderLineItemRowGrid(constants.PLACE_OF_DELIVERY_DESC_TEXT, data.PlaceOfDeliveryDesc)}
      {this.renderLineItemRowGrid(constants.SPECIFICATION_TEXT, data.Specification)}
      {this.renderLineItemRowGrid(constants.JUSTIFICATION_TEXT, data.Justification)}
      {(data.Category === 'IT System' && data.Particulars.trim() === 'Laptop' && data.SubItemDetails && data.SubItemDetails.length != 0) ?
      <View style={styles.cardView}>
        <TouchableOpacity onPress={() => this.openNewPanel(data)}
        // this.openPanel(data)}
        >
          <Text style={styles.viewDetailsText}>{constants.VIEW_DETAILS_TEXT}</Text>
        </TouchableOpacity>
      </View> : null}
      </View>
    );
  };

  checkBoxPress = (i, checkBoxArray) => {
    let myItemStringArr = [];
    checkIconFlagArray = (this.state.checkBoxFinalArray && this.state.checkBoxFinalArray.length != 0) ?
    this.state.checkBoxFinalArray : checkBoxArray;
    checkIconFlagArray.map((val,index) => {
      if (i === index) {
        if (val.imageType === 'checked') {
          // console.log(i, "checked ---> unchecked")
          checkIconFlagArray[i].imageType = checkIconFlagArray[i].imageType.replace('checked','unchecked');
        } else {
          // console.log(i, "unchecked ---> checked")
          checkIconFlagArray[i].imageType = checkIconFlagArray[i].imageType.replace('unchecked','checked');
        }
      }
      // console.log("checkIconFlagArray",checkIconFlagArray)
    });
    this.setState({ checkBoxFinalArray: checkIconFlagArray},() => {
    // console.log("final Array::",this.state.checkBoxFinalArray)
    this.state.checkBoxFinalArray.map(item => {
      if (item.imageType === 'checked') {
        // console.log("555555")
        myItemStringArr.push(item.Sno);
        // console.log("myItemStringArr",[...new Set(myItemStringArr)])

      }
    });
    this.setState({
      lineItemStringArray: myItemStringArr,
    },() =>{// console.log("lineItemStringArray",this.state.lineItemStringArray)
  });
  });
  }


  renderCardData = () => {
    let counter = 0;
    let statusValueRadioArray = [];
    refsArray = [];
    checkBoxArray = [];
    return this.props.cdsLineItemData.map((data, i) => {    //might be restriction to reset data
      //(data.IsItemApproved === "Y") ? 'checked' :
      if (data.IsItemApproved === 'Y') {
      checkBoxArray.push({'imageType': 'checked', Sno: data.ItemSno});
      counter++;
      checkIconFlagArray = checkBoxArray;
      // console.log("checkBoxArray", checkBoxArray)
      // console.log('mohit checkIconFlagArray',checkIconFlagArray)
      // console.log("index value",i)
      let dropDownRef = React.createRef();
      refsArray.push(dropDownRef);
      return (
        <View  key ={i} style={{flexDirection: 'row', paddingBottom:4, opacity:(this.state.checkBoxFinalArray.length != 0 && this.state.checkBoxFinalArray[i].imageType === 'unchecked') ? 0.4 : 1}}>
        <View>
          <TouchableOpacity
          style ={{marginTop:16}}
          onPress={()=>this.checkBoxPress(i,checkBoxArray)}>
            <Image source={(this.state.checkBoxFinalArray.length != 0 && this.state.checkBoxFinalArray[i].imageType === 'unchecked') ? globalConstants.UNCHECKED_ICON : globalConstants.CHECKED_ICON}
            style={globalFontStyle.checkUncheckedGlobal} />
          </TouchableOpacity>
        </View>
        <View style={{paddingRight:20}}>
        <Card title={'Record' + ' ' + counter}>
          {this.renderCardItem(data)}
        </Card>
        </View>
        </View>
      );
      } else {return null;}
    });
  };

  cdsRequestAction=(action, empData)=>{

      // this.props.navigation.navigate("SupervisorSelection", {
      //   voucher: voucherData,
      //   action: action,
      //   isComingFromVoucher: true,
      //   loggedInDetails: this.state.loggedInDetails
      // });
  }

  onSelection = (index, value) => {
    console.log('on selection : ',value);
    let isLineItemChecked = false;
    let myItemStringArr = [];     //default check handle
    let myItemFinalStringArr = [];
    if (this.state.checkBoxFinalArray.length === 0) {  //default check handle
      checkIconFlagArray.map(item => {
        if (item.imageType === 'checked') {
          // console.log("555555")
          myItemStringArr.push(item.Sno);
          // console.log("myItemStringArr",[...new Set(myItemStringArr)])

        }
      });
      isLineItemChecked = true;
      myItemFinalStringArr = myItemStringArr;
    } else {
      this.state.checkBoxFinalArray.map(item => {
        if (item.imageType === 'checked') {
          isLineItemChecked = true;
        }
      });
      myItemFinalStringArr = this.state.lineItemStringArray;
    }
    // console.log("action+++++++++isLineItemChecked", isLineItemChecked)
    let actionData = this.props.cdsActionListData.map(data => data);
    let userAction = '';
    let userRole = '';
    actionData.map(item => {
      if (item.Display === value) {
        userAction = item.Value;
        userRole = item.LabelText;
      }
    });
    // console.log("userAction",userAction)
    this.setState(
      {
        myDropdownText: value,
      },
      () => {
        if (isLineItemChecked) {
          this.props.navigation.navigate('CdsApproveReject', {
            docDetails: empData,
            fullDocDetails: this.state.localCdsDetailData,
            action: value,
            userActionValue: userAction,
            itemsStringArray: myItemFinalStringArr,
            approverRole: userRole,
          });
        } else {
          setTimeout(()=>{
            alert('Please CHECK at least one Record to perform action!!');
          },1000);
        }
      }
    );
  };

  renderBottomView = () =>{
    if (this.props.cdsActionListData && this.props.cdsActionListData.length > 0) {
    let selectors = this.props.cdsActionListData.map(val =>val.Display);
    return (
    <View style={styles.buttonSelectActionContainer}>
          {/* <View style={styles.dropDownContainer}>
        <Text>{constants.SUBMIT_TO}</Text> */}
        {/* <View style={styles.pickerBox}> */}
          <View style={styles.dropIcon}>
            <ModalDropdown
              ref={this.submitRef}
              options={selectors}
              defaultValue={this.state.myDropdownText}
              scrollEnabled={false}
              style={styles.pickerObject}
              textStyle={styles.pickerTextStyle}
              dropdownStyle={styles.dropdownStyle}
              dropdownTextStyle={styles.dropdownTextStyle}
              onSelect={(index, value) => this.onSelection(index, value)}
             />
          </View>
        </View>
    );
    } else
    {return null;}
  }

  renderPanelData = record => {
    // console.log("record :::::",record)
    return (
      <View>
      {this.renderLineItemRowGrid(globalConstants.EMPLOYEE_TEXT, record.EmpCode.concat(' : ').concat(record.EmpName.trim()))}
      {this.renderLineItemRowGrid(constants.ITEM_PRICE_TEXT, record.ItemPrice + '(' + record.DefaultCurrency.trim() + ')')}
      {this.renderHTMLRowGrid(constants.SYSTEM_SUGGESTED_CONF_TEXT, record.RoleTypeSysDesc.trim())}
      {this.renderHTMLRowGrid(constants.REQUIRED_CONF_TEXT, record.RoleTypeDesc.trim())}
      </View>
    );
  }

  renderSubLineItemView = (subLineItem) => {
    return subLineItem.map((record, index)=>{
      let myIndex = index + 1;
      return (
        <View style={styles.cardInnerView}>
            <Text style={globalFontStyle.cardLeftText}>{'Sub Line Item Record ' + myIndex}</Text>
            {this.renderPanelData(record)}
          </View>
      );
     });
  }

  openNewPanel = (data) => {
    writeLog('Clicked on ' + 'openNewPanel' + ' of ' + 'CDSDetails');
    this._panel.show(height / 1.3);
    this.setState({ subLineItemData: data.SubItemDetails });
  }

  renderSubLineItemViewPanel = () => {
    return (
      <SlidingUpPanel ref={c => (this._panel = c)}
          draggableRange={{top: height / 1.3, bottom: 0}}
          // showBackdrop={false}
          height={height}
          // allowMomentum={true}
          onMomentumDragStart={height => {height;}} //height of panel here : height/1.3
          onMomentumDragEnd={0}
        >
          {dragHandler => (
            <View style={styles.panelNewContainer}>
              <View style={styles.dragHandler} {...dragHandler}>
              <TouchableOpacity style={{marginTop:10}} onPress={() => this._panel.hide()}>
                <Image
                  source={images.crossButton}
                />
              </TouchableOpacity>
              </View>
              <ScrollView
              	keyboardShouldPersistTaps="handled"
                style={{flex:1, marginBottom: (height - height / 1.3)}}>
                <View>
                  {this.renderSubLineItemView(this.state.subLineItemData)}
                </View>
              </ScrollView>
            </View>
          )}
      </SlidingUpPanel>
    );
  }

  openPanel = (data) => {
    writeLog('Clicked on ' + 'openPanel' + ' of ' + 'CDSDetails');
    // console.log("panel data", data)
    this.setState({ swipeablePanelActive: true, subLineItemData: data.SubItemDetails });
  };

  closePanel = () => {
    writeLog('Clicked on ' + 'closePanel' + ' of ' + 'CDSDetails');
    this.setState({ swipeablePanelActive: false });
  }

  render() {
    return (
      <ImageBackground
      style={{flex:1}}
      source={images.loginBackground}
    >
      <View style={styles.container}>
        <SubHeader
          pageTitle={globalConstants.CDS_DETAILS_TITLE}
          backVisible={true}
          logoutVisible={true}
          handleBackPress={() => this.handleBack()}
          navigation={this.props.navigation}
        />
        {this.renderDocumentDetails()}
        <ScrollView style={styles.scrollViewStyle}
        	keyboardShouldPersistTaps="handled">
          {this.renderCardData()}
        </ScrollView>
        {this.renderBottomView()}
        {this.renderSubLineItemViewPanel()}
        {this.state.errorPopUp === true ? this.showError() : null}
      </View>
      </ImageBackground>
    );
  }
}

const mapStateToProps = state => {
  return {
    cdsLoading: state.cdsReducer.cdsLoader,
    cdsLineItemData: state.cdsReducer.cdsLineItemData,
    cdsLineItemError: state.cdsReducer.cdsLineItemError,
    cdsDetailData: state.cdsReducer.cdsDetailData,
    cdsDetailError: state.cdsReducer.cdsDetailError,
    cdsActionListData: state.cdsReducer.cdsActionListData,
    cdsActionListError: state.cdsReducer.cdsActionListError,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    resetCdsDetails: () => dispatch(resetCdsDetailsScreen),
    fetchCdsLineItemData: (cdsCode) =>
      dispatch(cdsFetchLineItemData(cdsCode)),
    fetchCdsActionListData: (cdsCode) =>
      dispatch(cdsFetchActionListData(cdsCode)),
    fetchCdsDetailData: (cdsCode) =>
      dispatch(cdsFetchDetailData(cdsCode)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CDSDetails);

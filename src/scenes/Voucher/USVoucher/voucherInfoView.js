import React, { useState, useEffect } from 'react'
import { Text, View, ImageBackground } from 'react-native'
import { styles } from '../createVoucher/styles'
import { sectionTitle, showEmpDataRowGrid } from '../createVoucher/cvUtility'
let constants = require('../createVoucher/constants');
let globalConstants = require("../../../GlobalConstants")

export const VoucherInfoView = (props) => {
    // const [docNumber, setDocNumber] = useState(props.myEmpData)
    console.log('Voucher info props : ', props);
    let docNumber = props.docNumber;
    let categoryId, transferTypeLbl = "", relocationFromToLbl = "", categoryValue, subCategoryValue, childNameValue, childDobValue, claimForValue, investmentPlanValue, weddingDateValue,
        wefDateValue, tillDateValue, claimableBalValue, projectValue, costCenterValue, myEmpData = props.myEmpData[0];
    let usAdditionalData = props.usAdditionalData   
    categoryId = props.myCategoryId 
    categoryValue = props.myCategoryDisplayText
    projectValue = props.myProjectValue
    costCenterValue = props.myCostCenterValue
    let contractId = usAdditionalData.contractIdValue
    let relocationFromTo = usAdditionalData.relocationFromToValue
    let purpose = usAdditionalData.purposeValue
    let accompaniedBy = usAdditionalData.accompaniedByValue
    let transferType = props.myEmpData[0] && props.myEmpData[0].TravelTypeText ? props.myEmpData[0].TravelTypeText :   usAdditionalData.transferTypeValue
    let billableToClient = usAdditionalData.billableToClientValue
    let clientId = props.requestStatus!==true ? myEmpData.ClientNameText : usAdditionalData.clientIdDisplayText; 
    if(categoryId == 11) {
        transferTypeLbl = constants.TRAVEL_TYPE_TEXT
        relocationFromToLbl = constants.TRIP_NAME_TEXT
    } else if (categoryId == 12) {
        transferTypeLbl = constants.TRANSFER_TYPE_TEXT
        relocationFromToLbl = constants.RELOCATION_FROM_TO_TEXT
    } else if (categoryId == 13) {
        relocationFromToLbl = constants.NAME_TEXT
    }
    useEffect(() => {
    })
    return(
        <View style={styles.userInfoView}>
        <ImageBackground style={styles.cardBackground} resizeMode="cover">
          {sectionTitle(constants.VOUCHER_INFO_TEXT)}
          <View style={styles.cardStyle}>
          {showEmpDataRowGrid(globalConstants.DOCUMENT_NUMBER_TEXT, docNumber)}
          {showEmpDataRowGrid(constants.CATEGORY_TEXT, categoryValue)}
          {showEmpDataRowGrid(globalConstants.PROJECT_TEXT, projectValue)}
          {showEmpDataRowGrid(globalConstants.COST_CENTER_TEXT, costCenterValue)}
          {showEmpDataRowGrid(transferTypeLbl, transferType)}
          {showEmpDataRowGrid(relocationFromToLbl, relocationFromTo)}
          {showEmpDataRowGrid(constants.BILLABLE_TO_CLIENT_TEXT, billableToClient)}
          {showEmpDataRowGrid(constants.CONTRACT_ID_TEXT, contractId)}
          {showEmpDataRowGrid(constants.CLIENT_ID_TEXT, clientId)}
          {showEmpDataRowGrid(constants.PURPOSE_TEXT, purpose)}
          {showEmpDataRowGrid(constants.ACCOMPANIED_BY_TEXT, accompaniedBy)}
          </View> 
          </ImageBackground>
      </View>
    )
}
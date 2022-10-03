import React, { useState, useEffect } from 'react'
import { Text, View } from 'react-native'
import { LabelEditText } from "../../../GlobalComponent/LabelEditText/LabelEditText"
import { Dropdown } from "../../../GlobalComponent/DropDown/DropDown"
let constants = require('../createVoucher/constants');

export const AdditionalUSFields = (props) => {
  relocationTypeRef = React.createRef()
  billableToClientRef = React.createRef()
  clientIdRef = React.createRef()
  const [contractId, setContractId] = useState("")
  const [relocationFromTo, setRelocationFromTo] = useState("")
  const [purpose, setPurpose] = useState("")
  const [accompaniedBy, setAccompaniedBy] = useState("")
  const [relocationType, setRelocationType] = useState("")
  const [billableToClient, setBillableToClient] = useState("")
  const [clientId, setClientId] = useState("")
  const [errorMsg, setErrorMsg] = useState("")

  const onRelocationTypeSelection = (i, val) => {
		console.log("relocation type value", val)
		setRelocationType(val)
  }
  
  const onBillableToClientSelection = (i, val) => {
		console.log("billable to client value", val)
		setBillableToClient(val)
  }
  
  const onClientIdSelection = (i, val) => {
		console.log("client id value", val)
		setClientId(val)
  }
  
  useEffect(() => {
    if(props.isUSRelocationVoucherSelected && (contractId === "" || relocationFromTo === "" || purpose === "" || accompaniedBy === "" || relocationType === ""
      || billableToClient === "" || clientId === "")) {
        setErrorMsg("*Above fields are mandatory.")
      } else {
        setErrorMsg("")
      }
  })

  if(props.isUSRelocationVoucherSelected) {
    if(contractId === "" || relocationFromTo === "" || purpose === "" || accompaniedBy === "" || relocationType === ""
      || billableToClient === "" || clientId === "") {
      props.isAllAdditionalFieldsNotFilled(true)
    } else {
      props.isAllAdditionalFieldsNotFilled(false)
    }
  }

  return (
    <View>
      <LabelEditText
        heading={constants.CONTRACT_ID_TEXT}
        isEditable={true}
        onTextChanged={text => setContractId(text)}
        myValue={contractId}
        isSmallFont={true}
      />
      <LabelEditText
        heading={constants.RELOCATION_FROM_TO_TEXT}
        isEditable={true}
        onTextChanged={text => setRelocationFromTo(text)}
        myValue={relocationFromTo}
        isSmallFont={true}
      />
      <LabelEditText
        heading={constants.PURPOSE_TEXT}
        isEditable={true}
        onTextChanged={text => setPurpose(text)}
        myValue={purpose}
        isSmallFont={true}
      />
      <LabelEditText
        heading={constants.ACCOMPANIED_BY_TEXT}
        isEditable={true}
        onTextChanged={text => setAccompaniedBy(text)}
        myValue={accompaniedBy}
        isSmallFont={true}
      />
      <Dropdown title={constants.TRANSFER_TYPE_TEXT}
        disabled={false}
        forwardedRef={this.relocationTypeRef}
        dropDownData={["abc", "bcd"]}
        dropDownCallBack={(index, value) => onRelocationTypeSelection(index, value)} 
      />
      <Dropdown title={constants.BILLABLE_TO_CLIENT_TEXT}
        disabled={false}
        forwardedRef={this.billableToClientRef}
        dropDownData={["Yes", "No"]}
        dropDownCallBack={(index, value) => onBillableToClientSelection(index, value)} 
      />
      <Dropdown title={constants.CLIENT_ID_TEXT}
        disabled={false}
        forwardedRef={this.clientIdRef}
        dropDownData={["abc", "bcd"]}
        dropDownCallBack={(index, value) => onClientIdSelection(index, value)} 
      />
      {errorMsg === "" ? null 
        : <Text style={{color: "red"}}>{errorMsg}</Text>
      }
    </View>
  )
}
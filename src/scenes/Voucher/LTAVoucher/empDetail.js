import React, { useEffect, useState } from "react"
import { ImageBackground, StyleSheet, Text, View, TouchableOpacity } from "react-native"
import { moderateScale } from "../../../components/fontScaling.js"
import { LabelTextDashValue } from "../../../GlobalComponent/LabelText/LabelText"
import { sectionTitle } from "../createVoucher/cvUtility.js"
import Autocomplete from "react-native-autocomplete-input"
import { fetchBalance} from "./utils.js"
import { CostCenterProjectSelection } from "../createGenericVoucher/costCenterProjectSelect.js"
let appConfig = require("../../../../appconfig")
let projVal,docDate;
export const EmpDetail = (props) => {
	let emp = props.emp[0]
		projVal = emp.PROJ_CODE !== "" ? emp.PROJ_CODE + "~" + emp.PROJ_TXT : ""
		const [autoSearchProjectDataArray, setProjectDataArray] = useState([])
		const [autoCompleteProjectHideResult, setHideResult] = useState(false)
		const [costCenterVal, setCostCenter] = useState(emp.CC_CODE + "~" + emp.CC_TXT)
		const [projectSearchValue, setProjectSearchVal] = useState(projVal)
		docDate = emp.DocDate === undefined ? "" : emp.DocDate.replace(/-/g, " ")
		console.log("Project Val :",projVal);
		console.log("EMP VAL :",emp);
	const renderAutoCompleteProjectResult = (item, i) => {
		console.log("Item found ", item)
		return (
			<View>
				<TouchableOpacity
					onPress={() => {
						setHideResult(true)
						setProjectSearchVal(item.Key)
						setCostCenter(item.CCCode + "~" + item.CCText)
						props.setProjectData(item)
					}}>
					<Text>{item.Key}</Text>
				</TouchableOpacity>
				<View style={{ height: 1, backgroundColor: "white" }} />
			</View>
		)
	}
	const onProjectItem=(projectItem)=>{
		if(projectItem!==undefined){
			props.setProjectData(projectItem)
		}
	 }
	 const onCostCenterItem=(costCenterItem)=>{
		 if(costCenterItem!==undefined){
			props.setCostCenterData(costCenterItem)
		 }
	 }
	
	useEffect(() => {
		setProjectSearchVal(projVal)
	}, [projVal])
	return (
		<View style={styles.container}>
			{sectionTitle("Employee Personal Details")}
			<ImageBackground style={styles.cardBackground} resizeMode="cover">
			     {props.docNubmer!='' ? <LabelTextDashValue heading="Document No#" description={props.docNubmer} /> : null}
				<LabelTextDashValue heading="Employee" description={emp.EMPNO + " : " + emp.NAME.trim()} />
				<LabelTextDashValue heading="Personnel Area" description={emp.PA.trim() + " : " + emp.PATXT.trim()} />
				<LabelTextDashValue heading="Company Code" description={emp.CO_CODE.trim() + " : " + emp.CO_TXT.trim()} />
				<LabelTextDashValue heading="Currency" description={emp.CURRENCY} />
				<LabelTextDashValue heading="Document Date" description={docDate} />
				<LabelTextDashValue heading="Plan / Grade" description={emp.PLAN1} />
				<LabelTextDashValue heading="Personnel Sub Area" description={emp.PSA.trim() + " : " + emp.PSATXT.trim()} />
				<LabelTextDashValue heading="Organisation Unit" description={emp.OUTXT.trim()} />
				{props.emp && props.emp.length >0 && <CostCenterProjectSelection
				  myEmpData={props.emp}
				  projectVal={(projItem)=>onProjectItem(projItem)}
				  costCenterVal={(costCenterItem)=>onCostCenterItem(costCenterItem)}
				  requestStatus={props.requestStatus}
				  />}
			</ImageBackground>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		margin: 5,
	},
	cardBackground: {
		borderWidth: 2,
		flex: 0,
		borderColor: appConfig.FIELD_BORDER_COLOR,
		borderRadius: 5,
		shadowOffset: { width: 10, height: 10 },
		shadowColor: "black",
		padding: 5,
	},
	autocompleteStyle: {
		flex: 1,
		marginTop: moderateScale(2),
	},
	autocompleteInputStyle: {
		borderColor: "grey",
		borderWidth: 1,
	},
	autocompleteListStyle: {
		position: "relative",
		backgroundColor: appConfig.CARD_BACKGROUND_COLOR,
	},
	rowContainer:{
		flexDirection:"row",
		justifyContent:"space-between",
		alignItems:'center',
	},
	heading:{
		fontWeight:"bold",
		flex:1,
		fontSize:12,
	},
	description:{
		fontSize:12,
		marginLeft:moderateScale(3),
		paddingVertical:moderateScale(10),
	},
	descContainer:{
		flex:1,
		backgroundColor:appConfig.FIELD_BORDER_COLOR,
		borderWidth:1,
		borderColor:"grey",
	}
})

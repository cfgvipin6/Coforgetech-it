import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { LabelEditText } from '../../../../GlobalComponent/LabelEditText/LabelEditText';
import { MultiAttachmentLTA } from '../../../../GlobalComponent/MultiAttachments/MultiAttachmentLTA';
import { sectionTitle, sectionSubTitle } from '../../createVoucher/cvUtility';
import { convertNumberToWords } from '../utils';
let appConfig = require('../../../../../appconfig');
let message = 'Total No. of person can not be less than or greater than No. of Minor and Major combined';
let costData = {};

export const getCostData = ()=>{
	return costData;
};
const CostCalculation = (props) => {
	console.log('CostCalculation Props ', props);
	let lineItemData = props.costData;
	let disable = (props.docStatus == undefined || props.docStatus == 0 || props.docStatus == 1 || props.docStatus == 5 || props.docStatus == 7 || props.docStatus == 12 || props.docStatus == 14) ? false : true;
	console.log('Cost Data :', lineItemData?.LstUploadFiles);
	const [filesData, setFiles] = useState(lineItemData && lineItemData?.LstUploadFiles.length > 0 ? lineItemData?.LstUploadFiles : []);
	const [majorPersons, setMajorPersons] = useState(lineItemData !== undefined ? '' + lineItemData.TotalMajorPersons : 1);
	const [majorCost, setMajorCost] = useState(lineItemData !== undefined ? '' + lineItemData.ActualTotalMajorAmt : 0);
	const [actualMajorCost, setActualMajorCost] = useState(lineItemData !== undefined ? '' + lineItemData.ActualTotalMajorAmt : 0);
	const [minorPersons, setMinorPersons] = useState(lineItemData !== undefined ? '' + lineItemData.TotalMinorPersons : 0);
	const [minorCost, setMinorCost] = useState(lineItemData !== undefined ? '' + lineItemData.ActualTotalMinorAmt : 0);
	const [actualMinorCost, setActualMinorCost] = useState(lineItemData !== undefined ? '' + lineItemData.ActualTotalMinorAmt : 0);
	const [totalCost, setTotalCost] = useState(lineItemData !== undefined ? '' + lineItemData.ApprovedAmt : 0);

	useEffect(()=>{
		console.log('File Data : ', filesData);
	});

	useEffect(() => {
		console.log('Dependents calculation : ', props.dependents.filter((item) => item.IsChecked).length + 1);
		setTimeout(() => {
			let person = parseFloat(majorPersons);
			let cost = parseFloat(majorCost);
			let value = person * cost;
			setActualMajorCost(!isNaN(value) ? parseFloat(value).toFixed(2) : 0);

			let minorPerson = parseFloat(minorPersons);
			let mCost = parseFloat(minorCost);
			let minorValue = minorPerson * mCost;
			setActualMinorCost(!isNaN(minorValue) ? parseFloat(minorValue).toFixed(2) : 0);
		}, 300);
		if (!props.withoutBill && !disable) {
			setTotalCost((parseFloat(actualMajorCost) + parseFloat(actualMinorCost)).toFixed(2));
		}
		costData.majorPersons = majorPersons;
		costData.majorCost = majorCost;
		costData.actualMajorCost = actualMajorCost;
		costData.minorPersons = minorPersons;
		costData.minorCost = minorCost;
		costData.actualMinorCost = actualMinorCost;
		costData.totalCost = totalCost;
	}, [props.dependents, props.withoutBill, disable, majorPersons, majorCost, actualMajorCost, minorPersons, minorCost, actualMinorCost, totalCost]);


	const updateFiles = (data)=>{
		let lineItemData = props.costData;
        lineItemData.LstUploadFiles = data;
        props.updateDataForFiles(lineItemData);
        console.log('File Data after Delete is  : ', lineItemData);
	};
	const updateFiles2 = (data)=>{
        props.updateFileSystem(data);
	};
	return (
		<View style={{ borderWidth: 2, flex: 0, borderColor: appConfig.FIELD_BORDER_COLOR, borderRadius: 5, shadowOffset: { width: 10, height: 10 }, shadowColor: 'black', padding: 5 }}>
			{sectionTitle('Cost Calculation')}
			{!props.withoutBill ? sectionSubTitle('Major') : null}
			{!props.withoutBill ? (
				<LabelEditText
				    isEditable = {!disable}
					heading="Number of Persons"
					placeHolder="Number of Persons"
					myKeyboardType="numeric"
					onTextChanged={(text) => {
						let total = parseInt(text) + parseInt(minorPersons);
						if (total > props.dependents.filter((item) => item.IsChecked).length + 1) {
							return alert(message);
						}
						setMajorPersons(text);
					}}
					myValue={'' + majorPersons}
					isSmallFont={true}
				/>
			) : null}
			{!props.withoutBill ? (
				<LabelEditText
				    isEditable = {!disable}
					heading="Cost Per Ticket"
					placeHolder="Cost Per Ticket"
					myKeyboardType="numeric"
					onTextChanged={(text) => {
						setMajorCost(text);
					}}
					myValue={majorCost}
					isSmallFont={true}
				/>
			) : null}
			{!props.withoutBill ? <LabelEditText heading="Total Actual Cost" placeHolder="Total Actual Cost" isEditable={false} myValue={'' + actualMajorCost} isSmallFont={true} /> : null}
			{!props.withoutBill ? sectionSubTitle('Minor') : null}
			{!props.withoutBill ? (
				<LabelEditText
				    isEditable = {!disable}
					heading="Number of Persons"
					placeHolder="Number of Persons"
					myKeyboardType="numeric"
					onTextChanged={(text) => {
						let total = parseInt(text) + parseInt(majorPersons);
						if (total > props.dependents.filter((item) => item.IsChecked).length + 1) {
							return alert(message);
						}
						setMinorPersons(text);
					}}
					myValue={minorPersons}
					isSmallFont={true}
				/>
			) : null}
			{!props.withoutBill ? (
				<LabelEditText
				    isEditable = {!disable}
					heading="Cost Per Ticket"
					placeHolder="Cost Per Ticket"
					myKeyboardType="numeric"
					onTextChanged={(text) => {
						setMinorCost(text);
					}}
					myValue={minorCost}
					isSmallFont={true}
				/>
			) : null}

			{!props.withoutBill ? <LabelEditText isEditable = {!disable} heading="Total Actual Cost" placeHolder="Total Actual Cost" isEditable={false} myValue={'' + actualMinorCost} isSmallFont={true} /> : null}
			{sectionSubTitle('Total')}
			{!props.withoutBill ? <LabelEditText isEditable = {!disable} heading="Total Number of Persons" placeHolder="Total Number of Persons" isEditable={false} myValue={'' + (props.dependents.filter((item) => item.IsChecked).length + 1)} isSmallFont={true} /> : null}

			<LabelEditText
			    isEditable = {!disable}
				heading="Total actual cost"
				placeHolder="Total actual cost"
				myKeyboardType="numeric"
				isEditable={!disable}
				onTextChanged={(text) => {
					setTotalCost(text);
				}}
				myValue={'' + totalCost}
				isSmallFont={true}
			/>
			<LabelEditText heading="Amount in words" isEditable={false} myValue={convertNumberToWords(totalCost)} isSmallFont={true} isMultiline={true} />

				<MultiAttachmentLTA
				heading="Attachments"
				docNumber={lineItemData?.DocNo}
				files={filesData}
				lineItemArrayCallBack={updateFiles}
				addFilesCallBack={updateFiles2}
				lineItems={[]}
				itemIndex={0}
				disable={props.isComingFromMyVoucher}
				isFreezed = {false}
				/>

		</View>
	);
};

export default CostCalculation;

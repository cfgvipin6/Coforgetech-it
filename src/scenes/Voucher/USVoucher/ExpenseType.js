/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import { sectionTitle } from '../createVoucher/cvUtility.js';
import { LabelEditText } from '../../../GlobalComponent/LabelEditText/LabelEditText.js';
import { DatePicker } from '../../../GlobalComponent/DatePicker/DatePicker.js';
import CustomButton from '../../../components/customButton.js';
import { Checkbox } from 'react-native-paper';
let appConfig = require('../../../../appconfig');
import moment from 'moment';
import _ from 'lodash';
import { Dropdown } from '../../../GlobalComponent/DropDown/DropDown.js';
import { showToast } from '../../../GlobalComponent/Toast.js';

export const ExpenseTypes = (props) => {
	let emp = props.emp[0];
	expenseTypeRef = React.createRef();
	console.log('Props in expense Type : ', props);
	console.log('Employee data : ', emp);
	let expenseData = {};
	const [expense, setExpense] = useState({});
	const resetExpense = () => {
		if (this.expenseTypeRef.current !== null && this.expenseTypeRef.current !== undefined) {
			this.expenseTypeRef.current.select(-1);
		}
    };

    const updateExpense = (data) => {
		if (this.expenseTypeRef.current !== null && this.expenseTypeRef.current !== undefined) {
            let expenseObj =   props.expenseTypes.find((el)=>el.ID == data.TypeofExpense);
			if (!_.isEmpty(expenseData)){
				setExpense(expenseObj);
			}
			console.log('Expense types : ',props.expenseTypes);
			let index = props.expenseTypes.findIndex((element) => element.ID == data.TypeofExpense);
			console.log('Expense types index : ',index);
			this.expenseTypeRef.current.select(index);
		}
	};

	const onExpenseTypeSelection = (index, value) => {
		console.log('Expense type selection called : ', value);
		let expenseObj = props.expenseTypes.find((el) => el.DisplayText == value);
		setExpense(expenseObj);
		props.getExpenseData(expenseObj);
	};
	useEffect(() => {
		console.log('Use Effect GAGAN : ', expense);
        if (_.isEmpty(expense)){
            props.expenseTypeCallBack(updateExpense,resetExpense);
        }
		props.getExpenseData(expense);
	}, [expense]);
	return (
		<View style={styles.container}>
			<ImageBackground style={styles.cardBackground} resizeMode="cover">
				<Dropdown title="Expense Type" disabled={props.editCase} forwardedRef={this.expenseTypeRef} dropDownData={props.expenseTypes.map((value) => value.DisplayText)} dropDownCallBack={(index, value) => onExpenseTypeSelection(index, value)} />
			</ImageBackground>
		</View>
	);
};

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
		shadowColor: 'black',
		padding: 5,
	},
});

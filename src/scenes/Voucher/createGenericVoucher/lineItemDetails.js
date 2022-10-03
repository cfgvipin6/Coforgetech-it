import React, { useState, useEffect } from 'react';
import { ImageBackground, StyleSheet, Text, View, TouchableOpacity, Alert, FlatList } from 'react-native';
import { moderateScale } from '../../../components/fontScaling.js';
import { LabelTextDashValue } from '../../../GlobalComponent/LabelText/LabelText';
import { sectionTitle, calculateFinancialYear, sectionTitleWithActionBtn } from '../createVoucher/cvUtility.js';
import { LabelEditText } from '../../../GlobalComponent/LabelEditText/LabelEditText.js';
import { DatePicker } from '../../../GlobalComponent/DatePicker/DatePicker.js';
import CustomButton from '../../../components/customButton.js';
let appConfig = require('../../../../appconfig');
import moment from 'moment';
import { Dropdown } from '../../../GlobalComponent/DropDown/DropDown.js';
import { MultiAttachmentView } from '../../../GlobalComponent/MultiAttachments/MultiAttachmentView.js';
import { Icon } from 'react-native-elements';
import UserMessage from '../../../components/userMessage.js';
import { deleteFile } from './utils.js';
import { MultiAttachmentGenericView } from '../../../GlobalComponent/MultiAttachments/MultiAttachmentGenericView.js';
export const LineItemDetails = (props) => {
	console.log('Line Items props here...', props);
	const [showDialog, setDialog] = useState(false);
	let catID = props.catID;
	let billNumberHeading;
	let billDateHeading;
	let phoneNumberHeading;
	let purposeHeading;
	let particularsHeading;
	let amountHeading;
	let attachmentHeading;
	switch (catID) {
		case '6':
			billNumberHeading = 'Bill Number';
			billDateHeading = 'Bill Date';
			phoneNumberHeading = 'Phone No.';
			purposeHeading = 'Purpose';
			particularsHeading = 'Particulars';
			amountHeading = 'Amount';
			attachmentHeading = 'Attachments';
			break;
		case '5':
			billNumberHeading = 'Cash Memo No.';
			billDateHeading = 'Bill Date';
			phoneNumberHeading = 'Phone No.';
			purposeHeading = 'Purpose';
			particularsHeading = 'Particulars';
			amountHeading = 'Amount';
			attachmentHeading = 'Expense Proofs';
			break;
		case '4':
			billNumberHeading = 'Cash Memo No.';
			billDateHeading = 'Bill Date';
			phoneNumberHeading = 'Phone No.';
			purposeHeading = 'Purpose';
			particularsHeading = 'Particulars';
			amountHeading = 'Amount';
			attachmentHeading = 'Expense Proofs';
			break;
		case '7':
				billNumberHeading = 'Cash Memo No.';
				billDateHeading = 'Bill Date';
				phoneNumberHeading = 'Phone No.';
				particularsHeading = 'Doctor/Chemist';
				amountHeading = 'Amount';
				break;
	}

	const deleteAction = (index) => {
		Alert.alert('Delete Document!', 'Are you sure you want to delete this Document?', [
			{
				text: 'Yes',
				onPress: () => {
					props.lineItemDelete(index);
				},
			},
			{ text: 'No', onPress: () => {} },
		]);
	};
   const renderListItem = (item, index)=>{
	   let indexToShow = index + 1;
	   console.log('Rendered list item : ', item);
		return (
		<View>
			<View style={styles.headingContainer}>
                <Text style={styles.headingText}>{'Record ' + indexToShow}</Text>
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity
                        disabled={props.disableProp || props.isFreezed}
                        onPress={() => {
                            props.lineItemEdit(index);
                        }}>
                        <Icon name="edit" size={20} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        disabled={props.disableProp || props.isFreezed}
                        onPress={() => {
                            deleteAction(index);
                        }}>
                        <Icon name="delete" size={20} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
            <ImageBackground style={styles.cardBackground} resizeMode="cover">
                <LabelTextDashValue heading={billNumberHeading} description={item.MemoNo} />
                <LabelTextDashValue heading={billDateHeading} description={item.SMemoDate} />
                {catID == '6' ? <LabelTextDashValue heading={phoneNumberHeading} description={item.TelNo} /> : null}
                {catID == '6' ? <LabelTextDashValue heading={purposeHeading} description={item.PurposeText} /> : null}
                <LabelTextDashValue heading={particularsHeading} description={item.Particulars} />
                <LabelTextDashValue heading={amountHeading} description={item.Amount} />
                {props?.isFileRequired == 'YES' ? <MultiAttachmentView catID={catID} isFreezed = {props.isFreezed} heading={attachmentHeading} docNumber={item.DocNo} rowId={item.RowId} files={item.LstUploadFiles} lineItemArrayCallBack={props.lineItemArrayCallBack} lineItems={props.lineItems}  itemIndex={index} disable={props.disableProp} /> : null}
            </ImageBackground>
			</View>);
	};
	return (
		<View style={styles.container}>
			<FlatList data={props.lineItems} renderItem={({ item, index }) => renderListItem(item,index)} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		margin: 5,
	},
	headingContainer: { backgroundColor: appConfig.DARK_BLUISH_COLOR, flexDirection: 'row', justifyContent: 'space-between', flex: 0 },
	headingText: { color: appConfig.WHITE_COLOR },
	cardBackground: {
		borderWidth: 2,
		flex: 0,
		borderColor: appConfig.FIELD_BORDER_COLOR,
		borderRadius: 5,
		shadowOffset: { width: 10, height: 10 },
		shadowColor: 'black',
		padding: 5,
	},
	autocompleteStyle: {
		flex: 1,
		marginTop: moderateScale(2),
	},
	autocompleteInputStyle: {
		borderColor: 'grey',
		borderWidth: 1,
	},
	autocompleteListStyle: {
		position: 'relative',
		backgroundColor: appConfig.CARD_BACKGROUND_COLOR,
	},
	addItemButtonView: {
		width: '25%',
		flex: 0,
		alignSelf: 'flex-end',
		marginTop: moderateScale(6),
	},
});

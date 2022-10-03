import React, { Component } from 'react';
import { styles } from './styles';
import { Icon } from 'react-native-elements';
import { TouchableOpacity, Text, View, StyleSheet,FlatList} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import DocumentPicker from 'react-native-document-picker';
import { RNCamera } from 'react-native-camera';
let fileActionCallBack;
export const filePicker = async (fileCallBack,fileLoaderCallBack) => {
	try {
		const res = await DocumentPicker.pick({
			type: [DocumentPicker.types.images,DocumentPicker.types.pdf,DocumentPicker.types.plainText,DocumentPicker.types.zip],
			//There can me more options as well
			// DocumentPicker.types.allFiles
			// DocumentPicker.types.images
			// DocumentPicker.types.plainText
			// DocumentPicker.types.audio
			// DocumentPicker.types.pdf
		});
		//   console.log("res : " + JSON.stringify(res))
		console.log('URI : ' + res.uri);
		console.log('Type : ' + res.type);
		console.log('File Name : ' + res.name);
		console.log('File Size : ' + res.size);
		fileLoaderCallBack(true);
		let data = RNFetchBlob.fs.readStream(res.uri, 'base64', 4095).then((ifStream) => {
			ifStream.open();
			ifStream.onData((chunk) => {
				data += chunk;
			});
			ifStream.onError((error) => {
				console.log('Oops error is :', error);
				fileLoaderCallBack(false);
			});
			ifStream.onEnd(() => {
				let dataToSave = data.replace('[object Object]', '');
				fileCallBack(dataToSave, res.name);
				fileLoaderCallBack(false);
			});
		});
	} catch (err) {
		fileLoaderCallBack(false);
		console.log('Error in file picking is :', err);
		if (DocumentPicker.isCancel(err)) {
			console.log('user aborted file picking');
		} else {
			throw err;
		}
	}
};

const renderAttachments = (item,index,disabled)=>{
	console.log('File attachment item : ',item,index,disabled,fileActionCallBack);
	return (
		<TouchableOpacity style={styles.fileActionStyle}
					disabled={disabled}
					onPress={() => {
						if (fileActionCallBack !== undefined)
						{fileActionCallBack(item);}
					}}>
					<Text style={styles.hyperlinkText}>{item.FileName}</Text>
		</TouchableOpacity>
	);
};

export const FileBrowser = (props) => {

	let disabled = (props.disable !== undefined) ? props.disable : false;
	let styleHolder = props.files && props.files.length > 0 ? styles.columnHolder : styles.columnHolder;
	fileActionCallBack = props.onFileActionCallBack;
	return (
		<View style={styleHolder}>
			<Text style={styles.attachText}>{props.heading}</Text>
			{props.onFileActionCallBack !== undefined && props.files && props.files.length > 0 ? (
				<View style = {{flex:1,height:70}}>
				<FlatList data={props.files} showsVerticalScrollIndicator={false} renderItem={({ item, index,disabled}) => renderAttachments(item, index,disabled)} keyExtractor={(item, index) => 'history_' + index.toString()} />
				</View>
			) : (
				<View style={styles.browseFileIconView}>
					<TouchableOpacity
						disabled={props.disable !== undefined ? props.disable : false}
						style={styles.attachIcon}
						onPress={() => {
							filePicker(props.fileCallBack,props.fileLoaderCallBack);
						}}>
						<Icon name="attachment" size={35} color={'blue'} />
					</TouchableOpacity>
					<TouchableOpacity
						disabled={props.disable !== undefined ? props.disable : false}
						style={styles.attachIcon}
						onPress={() => {
							if (props.parentProps !== undefined)
							{props.parentProps.navigation.navigate('Camera');}
						}}>
						{
							props.parentProps !== undefined ? <Icon name="camera" size={35} color={'blue'} /> : null
					    }
					</TouchableOpacity>
				</View>
			)}
		</View>
	);
};


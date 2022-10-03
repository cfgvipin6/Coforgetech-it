import React from 'react';
import {
    View,
    StyleSheet, 
    Text,
    TouchableOpacity,
    Image,
    Platform,
} from 'react-native';
import Modal from 'react-native-modal';

import { moderateScale } from './fontScaling';

var appConfig = require('../../appconfig');
var isModalFlag = false;

class DialogBox extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isModalVisible: false,
        }
    }
    renderParagraphs() {
        // console.log(typeof this.props.messageText)
        return (
            <View style={{ alignContent: "center", marginTop: moderateScale(19), }}>
                {typeof this.props.messageText == "string" ? <Text style={[styles.para]}>{this.props.messageText}</Text> : this.props.messageText}
            </View>
        )
    }

    renderHeader() {
        return (
            <View style={{}}>
                <Text style={styles.messageHeader}>{this.props.headerText}</Text>
            </View>
        )
    }

    render() {
        isModalFlag = this.props.isVisible
        return (
            <Modal isVisible={isModalFlag} onBackButtonPress={() => this.setState({ isModalFlag: false })}>
                <View style={styles.container}>
                    <View style={styles.messageTopView}>
                        <View style={styles.messageView}>
                            {this.renderHeader()}
                            {this.renderParagraphs()}
                        </View>
                    </View>
                    <View style={{ width: "100%", marginTop: moderateScale(32) }}>
                        <Image source={require('../assets/divHorizontal.png')} style={styles.horizontal} />
                        <View style={styles.buttonContainer}>
                            <View style={styles.modalButton}>
                                <TouchableOpacity onPress={() => { this.props.handleCancel() }} style={{ justifyContent: "center" }}>
                                    <Text style={styles.textStyle} accessibilityLabel={this.props.cancelButtonText} testID={this.props.cancelButtonText}>{this.props.cancelButtonText}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.verticalLine}></View>
                            <View style={[styles.modalButton, { borderRightWidth: 0 }]}>
                                <TouchableOpacity onPress={() => { this.props.handleConfirm() }} style={{ flexWrap: "wrap" }}>
                                    <Text style={styles.actionText} accessibilityLabel={this.props.confirmButtonText} testID={this.props.confirmButtonText}>{this.props.confirmButtonText}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }

    handleErrorDialog(message) {
        this.props.handleClick()
    }

}
const styles = StyleSheet.create({
    container: {
        flex: 0,
        alignItems: "center",
        justifyContent: "space-between",
        width: moderateScale(343),
        backgroundColor: 'white',
        borderRadius: Platform.OS == "ios" ? moderateScale(4) : moderateScale(10),
        borderWidth: moderateScale(1),
        alignSelf: "center"
    },
    subContainer: {
        backgroundColor: 'white',
        borderRadius: moderateScale(4),
        borderWidth: moderateScale(1),
    },
    modalButton: {
        width: "50%",
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: appConfig.BLUE_TEXT_COLOR
    },
    horizontal: {
        width: "100%",
        tintColor: appConfig.BLUE_TEXT_COLOR
    },
    actionText: {
        fontSize: moderateScale(16),
        color: appConfig.BLUE_TEXT_COLOR,
        padding: moderateScale(10),
        textAlign: "center",
        flexWrap: "wrap",
        paddingRight: moderateScale(20)
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        height: moderateScale(50),
        alignItems: "center",
        alignSelf: "center",
    },
    messageTopView: {
        paddingTop: moderateScale(5),
        paddingLeft: moderateScale(16),
        paddingRight: moderateScale(16),
        flexDirection: "column",
        justifyContent: "center"
    },
    messageView: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    messageHeader: {
        fontSize: moderateScale(16),
        color: appConfig.GUN_METAL_COLOR,
        marginTop: moderateScale(16),
        letterSpacing: moderateScale(0.8),
        textAlign: "center"
    },
    para: {
        fontSize: moderateScale(14),
        color: appConfig.GUN_METAL_COLOR,
        letterSpacing: moderateScale(0.7),
        textAlign: "center"
    },
    textStyle: {
        fontSize: moderateScale(14),
        color: appConfig.BLUE_TEXT_COLOR,
        textAlign: "center"
    },
    verticalLine: {
        height: "100%",
        backgroundColor: appConfig.BLUE_BORDER_COLOR,
        width: moderateScale(1)
    }
});

export default DialogBox;
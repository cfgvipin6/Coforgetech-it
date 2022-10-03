import React, { Component } from 'react';
import {
    View,
    Image,
    TouchableOpacity,
    Modal,
    Text,
} from 'react-native';
import { Icon } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import OrangeBar from '../../components/orangeBar';
import images from '../../images';
import {removePassword, removeUserName } from '../../scenes/auth/AuthUtility';
import { AppStyle } from '../../scenes/commonStyle';
import { styles } from './styles';
export default class HeaderView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            heading : 'Logout',
            message: 'Are you sure to logout ?',
        };
    }
    handleLogout() {
        this.setState({
            modalVisible: true,
        });
      }
    handleLogoutConfirm() {
        this.setState({
            modalVisible: false,
        },()=>{
          removeUserName();
          removePassword();
          this.props.props.navigation.replace('Login');
        });
      }
    doBack() {
        this.props.handleBackPress();
      }
    showModal=()=>{
        return (   <Modal
                visible={this.state.modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => {
                    this.setState({ modalVisible: false });
                }}>
                <View style={styles.modalOuterView}>
                    <View color={'#D3E5FC'} style={styles.optionsOuterView}>
                        <View style={styles.messageView}>
                        <View style={styles.rowHolder2}>
                        <View style={styles.innerLogoutView}>
                        <TouchableOpacity onPress={() =>  this.setState({ modalVisible: false })} style={styles.closeButton}>
                        {/* <Image source={images.crossButton}/> */}
                        </TouchableOpacity>
                        </View>
                        </View>

                        <Image source={images.logoutLogo}/>
                        <Text style={styles.modalFirstHeading}>{this.state.message}</Text>
                        </View>
                        {/* <View style={styles.horizontalLine} /> */}
                        <View style={[styles.optionsView]}>
                           <View style={styles.rowHolder2}>
                           <TouchableOpacity onPress={() =>  this.handleLogoutConfirm()} style={styles.modalOptionTouchable} underlayColor={'transparent'}>
                                <Image source= {images.logoutYesBtn} />
                                {/* <Text accessibilityLabel={'Yes'} style={styles.modalOptions}>{'Yes'}</Text> */}
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() =>  this.setState({ modalVisible: false })} style={styles.modalOptionTouchable2} underlayColor={'transparent'}>
                            <Image source= {images.logoutNoBtn} />
                                {/* <Text accessibilityLabel={'Cancel'} style={styles.modalOptions}>{'Cancel'}</Text> */}
                            </TouchableOpacity>
                           </View>
                        </View>
                    </View>
                </View>
        </Modal> );
      }

    render() {
        return (
            <View style={styles.containerView}>
                <View style={styles.rowHolder}>
                {this.props.backVisible ? (
            <TouchableOpacity style={styles.backbutton} onPress={() => this.doBack()}>
            <Icon name="navigate-before" color= {AppStyle.color.iengageTheme} size={40}/>
            </TouchableOpacity>
          ) : null}
                <Image style={[styles.titleLogo,{marginLeft:this.props.backVisible ? '18%' : '30%'}]} source={images.headerLogo} />
                { !this.props.isLoginScreen &&
                    <TouchableOpacity
              style={styles.logoutBox}
              onPress={() => this.handleLogout()}
            >
              {/* <Image source={images.logoutIcon}/> */}
              <Icon
                name="power-settings-new"
                color= "#f68a23" size={37} />
            </TouchableOpacity>
                }
                </View>
               <OrangeBar/>
               {this.showModal()}
            </View>
        );
    }
}

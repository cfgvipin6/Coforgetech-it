import React, { Component } from 'react';
import { View, ImageBackground, BackHandler } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SubHeader from '../../GlobalComponent/SubHeader';
import { styles } from './styles';
import { fetchPOSTMethod } from '../../utilities/fetchService';
import RNFetchBlob from 'rn-fetch-blob';
import Pdf from 'react-native-pdf';
import ActivityIndicatorView from '../../GlobalComponent/myActivityIndicator';
import { writeLog } from '../../utilities/logger';
import images from '../../images';
import properties from '../../resource/properties';
let globalConstants = require('../../GlobalConstants');
let pdfLocation;
class IdCardScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPdf: false,
    };
  }

  async fetchData() {
    let formData = new FormData();
    formData.append('ECSERP', this.props.empCode);
    formData.append('AUTHKEY', this.props.accessToken);
    formData.append('APPKEY', 'mobile');
    let url = properties.idCard;
    let ecrpResponse = await fetchPOSTMethod(url, formData);
    console.log('Id card response : ', ecrpResponse);
    this.writePdfFile(ecrpResponse.File);
  }
  writePdfFile = byteString => {
    const DocumentDir = RNFetchBlob.fs.dirs.DocumentDir;
    pdfLocation = DocumentDir + '/' + 'IdCard.pdf';
    RNFetchBlob.fs
      .writeFile(pdfLocation, byteString, 'base64')
      .then(() => {
        this.setState({ isPdf: true });
      })
      .catch(error => {
        this.setState({ isPdf: false });
      });
  }
  componentDidMount() {
    writeLog('Landed on ' + 'IdCard screen');
    BackHandler.addEventListener('hardwareBackPress', this.handleBack);
    console.log('Login reducer : ', this.props);
    this.fetchData();
  }
  static propTypes = {
    prop: PropTypes,
  }
  handleBack = () => {
    writeLog('Clicked on ' + 'handleBack' + ' of ' + 'IdCard Screen');
    this.props.navigation.pop();
    RNFetchBlob.fs.df();
  }
  render() {
    let pdfUri = { uri: pdfLocation, cache: true };
    return (
      <ImageBackground
      style={{flex:1}}
      source={images.loginBackground}
    >
      <View style={styles.container}>
        <SubHeader
          pageTitle={globalConstants.ID_CARD_TITLE}
          backVisible={true}
          logoutVisible={true}
          handleBackPress={() => this.handleBack()}
          navigation={this.props.navigation}
        />

        {this.state.isPdf === true ? (
          <Pdf
            source={pdfUri}
            scale={1.8}
            style={{ flex: 1 }}
            onError={error => {
              // console.log(error)
            }} />
        ) : null}
        <ActivityIndicatorView loader={!this.state.isPdf} />
      </View>
      </ImageBackground>
    );
  }
}

const mapStateToProps = state => {
  return {
    empCode: state.loginReducer.loginData !== undefined ? state.loginReducer.loginData.SmCode : '',
    accessToken: state.loginReducer.loginData !== undefined ? state.loginReducer.loginData.Authkey : '',
  };
};

export default connect(mapStateToProps, null)(IdCardScreen);

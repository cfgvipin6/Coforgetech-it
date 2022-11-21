import React, { Component } from 'react';
import { View, Text, ImageBackground } from 'react-native';
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
let globalConstants = require('../../GlobalConstants');
let pdfLocation;
export class ECRPLetter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPdf: false,
      letterNumber: this.props.navigation.state.params.employeeDetails,
    };
  }
  arrangeData = dta => {
    // console.log("Base 64 data found is :", dta)
  }

  async fetchData() {
    let formData = new FormData();
    formData.append('ECSerp', this.props.empCode);
    formData.append('AuthKey', this.props.accessToken);
    formData.append('LetterSNo', this.state.letterNumber.LetterSNo);
    let url = 'https://iniitiandev2.niit-tech.com/iNIITian/CRP/CRPMobile/ViewSMLetter';
    let ecrpResponse = await fetchPOSTMethod(url, formData);
    // console.log("pdf data response from server is : ", ecrpResponse)
    this.writePdfFile(ecrpResponse[0].base64String);
  }
  writePdfFile = byteString => {
    const DocumentDir = RNFetchBlob.fs.dirs.DocumentDir;
    pdfLocation = DocumentDir + '/' + 'report.pdf';
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
    writeLog('Landed on ' + 'ECRPLetter');
    this.fetchData();
  }
  static propTypes = {
    prop: PropTypes,
  }
  handleBack = () => {
    writeLog('Clicked on ' + 'handleBack' + ' of ' + 'ECRPLetter');
    this.props.navigation.pop();
  }
  render() {
    let pdfUri = { uri: pdfLocation, cache: true };
    // console.log("DATA,", this.state.letterNumber)
    return (
      <ImageBackground
      style={{flex:1}}
      source={images.loginBackground}
    >
      <View style={styles.container}>
        <SubHeader
          pageTitle={globalConstants.ECRP_LETTER_TITLE}
          backVisible={true}
          logoutVisible={true}
          handleBackPress={() => this.handleBack()}
          navigation={this.props.navigation}
        />

        {this.state.isPdf === true ? (
          <Pdf
            source={pdfUri}
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

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ECRPLetter);

import React, { Component } from "react";
import { BackHandler } from "react-native";
import { Dimensions } from "react-native";
import { Text, View } from "react-native";
import Pdf from "react-native-pdf";
import RNFetchBlob from "rn-fetch-blob";
import ActivityIndicatorView from "../../GlobalComponent/myActivityIndicator";
import SubHeader from "../../GlobalComponent/SubHeader";
import properties from "../../resource/properties";
let globalConstants = require("../../GlobalConstants");
class schemePDFView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  handleBack = () => {
    this.props.navigation.pop();
  };
  handleBackButtonClick = () => {
    console.log("Hardware back pressed");
    this.props.navigation.goBack(null);
    return true;
  };
  componentDidMount() {
    BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
  }
  componentWillUnmount() {
    BackHandler.removeEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
  }
  render() {
    let data = this.props.navigation.state.params.data;
    console.log("Final Data is  : ", data);
    let fileId = data && data.item.fileId;
    let url = properties.policyPDF.concat("?id=" + fileId);
    console.log("URL is : ", url);
    const source = { uri: url, cache: false };
    return (
      <View style={{ flex: 1 }}>
        <SubHeader
          pageTitle={globalConstants.SCHEME_AND_POLICY_TITLE}
          backVisible={true}
          logoutVisible={true}
          handleBackPress={() => this.handleBack()}
          navigation={this.props.navigation}
        />
        <Pdf
          source={source}
          onLoadComplete={(numberOfPages, filePath) => {
            console.log(`number of pages: ${numberOfPages}`);
          }}
          onPageChanged={(page, numberOfPages) => {
            console.log(`current page: ${page}`);
          }}
          onError={(error) => {
            console.log("Error of pdf ", error);
          }}
          onPressLink={(uri) => {
            console.log(`Link presse: ${uri}`);
          }}
          style={{
            flex: 1,
            width: Dimensions.get("window").width,
            height: Dimensions.get("window").height,
          }}
        />
      </View>
    );
  }
}

export default schemePDFView;

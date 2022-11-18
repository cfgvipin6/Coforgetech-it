import React from 'react';
import { View,Image} from 'react-native';
import { setHeight, setWidth } from '../components/fontScaling';
class SplashScreen extends React.Component {
  performTimeConsumingTask = async() => {
    return new Promise((resolve) =>
      setTimeout(
        () => { resolve('result'); },
        3200
      )
    );
  }

  async componentDidMount() {

    const data = await this.performTimeConsumingTask();

    if (data !== null) {
      this.props.navigation.navigate('Login');
    }
  }

  render() {
    return (
      <View style={styles.viewStyles}>
        <Image source={require('../assets/iniitian.png')} style={{}} />
      </View>
    );
  }
}

const styles = {
  viewStyles: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: "#EC8722"
    backgroundColor: '#e0e0e0',
  },
  textStyles: {
    color: 'white',
    fontSize: 40,
    fontWeight: 'bold',
  },
  imageBackground:{
    height:setHeight(100),
    width: setWidth(100),
    alignItems: 'center',
    justifyContent: 'center',
  },
};

export default SplashScreen;

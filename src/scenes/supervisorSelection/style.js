import {Dimensions} from 'react-native';
import {moderateScale} from '../../components/fontScaling';
var appConfig = require('../../../appconfig');

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default {
    container:{
        flex:1,
        backgroundColor:appConfig.WHITE_COLOR,
    },
    cardBackground: {
         borderRadius: 5,
         shadowOffset:{  width: 10,  height: 10  },
         shadowColor: 'black',
    },
    parentView:{
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        padding: 10,
      },
      displayItemTextOne: {
          width: '50%',
      },
      displayItemTextTwo: {
        width: '50%',
        color:'#06141F',
    },
};

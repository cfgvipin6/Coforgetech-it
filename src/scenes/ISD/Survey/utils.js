export const optionIndexToValue = (index) => {
    let selectedValue;
    switch (index) {
      case 0:
        selectedValue = 5;
        break;
      case 1:
        selectedValue = 4;
        break;
      case 2:
        selectedValue = 3;
        break;
      case 3:
        selectedValue = 2;
        break;
      case 4:
        selectedValue = 1;
        break;
      default:
        selectedValue = 0;
        break;
    }
    return selectedValue;
  };

  export const optionValueToIndex = (currentIndex) => {
    let selectedIndex;
    switch (currentIndex) {
      case 5:
        selectedIndex = 0;
        break;
      case 4:
        selectedIndex = 1;
        break;
      case 3:
        selectedIndex = 2;
        break;
      case 2:
        selectedIndex = 3;
        break;
      case 1:
        selectedIndex = 4;
        break;
      default:
        selectedIndex = '';
        break;
    }
    return selectedIndex;
  };

  export const getIcon = (item)=>{
    let imageUri = '';
    console.log('Image uri item : ', item);
    switch (parseInt(item.Value)) {
      case 5:
        imageUri = require('./../../../assets/agreeimage.png');
        break;
      case 4:
        imageUri = require('./../../../assets/agreeimage.png');
        break;
      case 3:
        imageUri = require('./../../../assets/agreeimage.png');
        break;
      case 2:
        imageUri = require('./../../../assets/neutralface.png');
        break;
      case 1:
        imageUri = require('./../../../assets/disagree.png');
        break;
      default:
        imageUri = '';
        break;
    }
    console.log('Image uri : ', imageUri);
    return imageUri;
  };

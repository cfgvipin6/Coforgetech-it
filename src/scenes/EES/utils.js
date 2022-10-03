export const optionIndexToValue = (index) => {
    let selectedValue;
    switch(index) {
      case 0:
        selectedValue = 5
        break
      case 1:
        selectedValue = 4
        break
      case 2:
        selectedValue = 3
        break
      case 3:
        selectedValue = 2
        break
      case 4:
        selectedValue = 1
        break
      default:
        selectedValue = 0
        break
    }
    return selectedValue
  }

  export const optionValueToIndex = (currentIndex) => {
    let selectedIndex;
    switch(currentIndex) {
      case 5:
        selectedIndex = 0
        break
      case 4:
        selectedIndex = 1
        break
      case 3:
        selectedIndex = 2
        break
      case 2:
        selectedIndex = 3
        break
      case 1:
        selectedIndex = 4
        break
      default:
        selectedIndex = ""
        break
    }
    return selectedIndex
  }
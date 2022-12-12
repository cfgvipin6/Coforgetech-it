import AsyncStorage from '@react-native-community/async-storage';

export const storeData = async (key, value) => {
  try {
    if (!key || !value) {
      return;
    }
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.log(error);
  }
};

// getting data
export const getData = async (key) => {
  try {
    if (!key) {
      return;
    }
    let data = await AsyncStorage.getItem(key);
    return JSON.parse(data);
  } catch (error) {
    console.log('error get async data === ', error);
  }
};

export const removeData = async (key) => {
  try {
    if (!key) {
      return;
    }
    return await AsyncStorage.removeItem(key);
  } catch (error) {
    console.log(error);
  }
};

export const clearData = async () => {
  try {
    return await AsyncStorage.clear();
  } catch (error) {
    console.log(error);
  }
};

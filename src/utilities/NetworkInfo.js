import NetInfo from '@react-native-community/netinfo';

export const netInfo = async () => {
  let data = await NetInfo.fetch();
  let connected = data.isConnected;
  // console.log('connected >>>>> '+connected);
  return connected;
};

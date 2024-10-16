import {Dimensions} from 'react-native';

export const appInfo = {
  size: {
    WIDTH: Dimensions.get('window').width,
    HEIGHT: Dimensions.get('window').height,
  },
  BASE_URL: 'http://192.168.1.9:3004',
  sizeIcon: 22,
  sizeText: Dimensions.get('window').width * 0.04,
  sizeTitle: Dimensions.get('window').width * 0.05,
  sizeIconBold:27
};

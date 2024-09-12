import {StatusBar, StyleSheet} from 'react-native';
import { appColors } from '../Theme/Colors/appColors';
const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:appColors.white
  },
  buttonStyles: {},
  row:{
    flexDirection:'row'
  }
});
export {globalStyles};

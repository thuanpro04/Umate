import {StatusBar, StyleSheet} from 'react-native';
import {appColors} from '../Theme/Colors/appColors';
const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.white,
    paddingTop: StatusBar.currentHeight,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    gap: 10,
    alignItems: 'center',
    
  },
});
export {globalStyles};

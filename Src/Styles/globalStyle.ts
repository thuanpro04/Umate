import {Platform, StatusBar, StyleSheet} from 'react-native';
import {appColors} from '../Theme/Colors/appColors';
const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.white,
    paddingVertical: Platform.OS === 'android' ? StatusBar.currentHeight : 48,

  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    gap: 10,
    alignItems: 'center',
    
  },
  avatar: {
    width: 52,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    marginBottom: 12,
  },
  userImg: {
    width: 65,
    height: 65,
    borderRadius: 100,
    backgroundColor: appColors.grey2,
  },
  

  // Other user's message (căn trái)
 
  // Thời gian tin nhắn
  timeText: {
    marginLeft: 11.5,
    fontSize: 11.5,
    alignSelf: 'flex-end', // Đặt thời gian ở dưới cùng
  }
 
});
export {globalStyles};

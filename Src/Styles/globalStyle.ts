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
    width: 60,
    height: 60,
    borderRadius: 100,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  overlay: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  timeText: {
    fontSize: 11.5,
    alignSelf: 'flex-end', // Đặt thời gian ở dưới cùng
  },
  searchStyles: {
    justifyContent: 'flex-start',
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: appColors.grey2,
    width: '100%',
    borderRadius: 12,
    alignItems: 'center',
    paddingVertical: 14,
  },
  button: {
    backgroundColor: appColors.white,
    borderWidth: 0.5,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  label: {
    fontWeight: '600',
    color: appColors.blueBack,
  },
  inputRow: {
    borderBottomWidth: 0.2,
    borderColor: appColors.blue3,
  },
  imgStyles: {
    width: 160,
    height: 160,
    borderRadius: 100,
  },
  iconImage: {height: 25, width: 25, resizeMode: 'cover'},
  main: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    paddingHorizontal: 8,
  },
});
export {globalStyles};

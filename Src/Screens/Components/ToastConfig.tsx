import {Image, StyleSheet, Text, View} from 'react-native';
import {appColors} from '../../Theme/Colors/appColors';
import Liuliu from '../../assets/svgs/Liuliu.svg'
import RowComponent from './RowComponent';
import TextComponent from './TextComponent';
const ToastConfig = {
  error: ({text1, text2, ...rest}: any) => (
    <RowComponent styles={styles.toastContainer}>
      <Liuliu height={23} width={23}/>
      <View style={styles.textContainer}>
        <TextComponent styles={styles.text1} label={text1}/> 
        <TextComponent styles={styles.text2} label={text2}/>
      </View>
    </RowComponent>
  ),
};

export default ToastConfig;
const styles = StyleSheet.create({
  toastContainer: {
    padding: 10,
    backgroundColor: appColors.red, // Màu nền thông báo lỗi
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal:16
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  text1: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.white,
  },
  text2: {
    fontSize: 14,
    color: appColors.white,
  },
});

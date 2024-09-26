import {ActivityIndicator, Modal, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {TextComponent} from '../Components';
import {appColors} from '../../Theme/Colors/appColors';

interface Props {
  visible: boolean;
}

const LoadingModal = ({visible}: Props) => {
  return (
    <Modal
      visible={visible}
      transparent
      statusBarTranslucent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <ActivityIndicator color={appColors.white} size={28} />
          <TextComponent
            label="Loading..."
            color={appColors.grey2}
            size={22}
            styles={styles.text}
          />
        </View>
      </View>
    </Modal>
  );
};

export default LoadingModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center', // Căn giữa theo chiều dọc
    alignItems: 'center', // Căn giữa theo chiều ngang
  },
  container: {
    alignItems: 'center',
    padding: 20, // Thêm padding để tạo khoảng cách giữa các phần tử
    borderRadius: 10, // Tạo góc bo cho modal
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Thay đổi màu nền cho modal
  },
  text: {
    fontWeight: '500',
    fontStyle: 'italic',
    marginTop: 10, // Thêm khoảng cách giữa ActivityIndicator và TextComponent
  },
});

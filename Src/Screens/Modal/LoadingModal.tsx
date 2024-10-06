import {ActivityIndicator, Modal, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {TextComponent} from '../Components';
import {appColors} from '../../Theme/Colors/appColors';
import { Ballons } from '../../assets/svgs/indexSvg';
interface Props {
  visible: boolean;
}

const LoadingModal = ({visible}: Props) => {
  return (
    <Modal visible={visible} transparent statusBarTranslucent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Ballons height={40} width={40}/>
          <ActivityIndicator color={appColors.white} size={28} />
          
        </View>
      </View>
    </Modal>
  );
};

export default LoadingModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'center', // Căn giữa theo chiều dọc
    alignItems: 'center', // Căn giữa theo chiều ngang
    zIndex: 1, // Đặt zIndex thấp hơn so với Snackbar hoặc Toast
  },
  container: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 10,
  },
  text: {
    fontWeight: '500',
    fontStyle: 'italic',
    marginTop: 10,
  },
});

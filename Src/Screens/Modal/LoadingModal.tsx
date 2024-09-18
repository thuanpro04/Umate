import {ActivityIndicator, Modal, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {TextComponent} from '../Components';
import { appColors } from '../../Theme/Colors/appColors';
interface Props {
  visible: boolean;
}
const LoadingModal = (props: Props) => {
  const {visible} = props;
  return (
    <Modal
      visible={props.visible}
      style={{zIndex: 4}}
      transparent
      statusBarTranslucent>
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.4)',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <ActivityIndicator color={appColors.white } size={28} />
        <TextComponent label="Loading..." color={appColors.grey2} size={22} styles={{fontWeight:'500',fontStyle:'italic'}}/>
      </View>
    </Modal>
  );
};

export default LoadingModal;

const styles = StyleSheet.create({});

import React, {useState} from 'react';
import {Modal, StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {appColors} from '../../Theme/Colors/appColors';
import {
  ButtonComponent,
  RowComponent,
  SpaceComponent,
  TextComponent,
} from '../Components';
interface Props {
  title: string;
  descriptions?: string;
  onPressYes: () => void;
  onPressNo: () => void;
  visible: boolean;
  styles?: StyleProp<ViewStyle>;
}
const ActionModal = (props: Props) => {
  const {title, onPressYes, onPressNo, visible, descriptions, styles} = props;

  return (
    <Modal visible={visible} transparent>
      <View style={localStyles.overlay}>
        <View style={localStyles.container}>
          <View style={[localStyles.titleStyles, styles]}>
            <TextComponent label={title} title />
            <SpaceComponent height={5} />
            {descriptions && <TextComponent label={descriptions} />}
          </View>

          <RowComponent styles={localStyles.btnStyles}>
            <ButtonComponent
              label="cancel"
              onPress={onPressNo}
              styles={{
                backgroundColor: appColors.background,
                borderWidth: 1,
                borderColor: appColors.grey,
              }}
              labelColor={appColors.blueBack}
            />
            <ButtonComponent
              label="Comfirm"
              styles={{backgroundColor: '#007ABF99'}}
              onPress={onPressYes}
            />
          </RowComponent>
        </View>
      </View>
    </Modal>
  );
};

export default ActionModal;

const localStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'center', // Căn giữa theo chiều dọc
    alignItems: 'center', // Căn giữa theo chiều ngang
    zIndex: 1,
  },
  container: {
    backgroundColor: '#fffffff0',
    height: 160,
    width: 300,
    borderRadius: 12,
    paddingBottom: 6,
    paddingHorizontal: 12,
  },
  titleStyles: {
    paddingVertical: 6,
    borderBottomColor: appColors.grey,
    borderBottomWidth: 0.5,
  },
  btnStyles: {
    justifyContent: 'flex-end',
    flex: 1,
    alignItems: 'flex-end',
    gap: 20,
  },
});

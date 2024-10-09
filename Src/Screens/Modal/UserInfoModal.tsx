import React, {
  forwardRef,
  useImperativeHandle,
  useEffect,
  useState,
  useRef,
} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {Portal} from 'react-native-portalize';
import {
  ButtonComponent,
  RowComponent,
  SpaceComponent,
  TextComponent,
} from '../Components';
import {Messenger, ProfileDelete} from 'iconsax-react-native';
import {appInfo} from '../../Theme/appInfo';
import {appColors} from '../../Theme/Colors/appColors';
import {Loss} from '../../assets/svgs/indexSvg';
import AntDesign from 'react-native-vector-icons/AntDesign';
interface Props {
  img: string;
  name: string;
  visible?: boolean;
  onClose: () => void;
  handleNavigation: () => void;
  handleUnFriend: () => void;
}

const UserInfoModal = (props: Props) => {
  const {img, name, onClose, visible, handleNavigation, handleUnFriend} = props;
  const modalRef = useRef<Modalize>(null);
  useEffect(() => {
    if (visible) {
      modalRef.current?.open(); // Open the modal if visible
    } else {
      modalRef.current?.close(); // Close the modal if not visible
    }
  }, [visible]);

  const getFirstName = (fullName: string) => fullName.split(' ')[0];

  return (
    <Portal>
      <Modalize
        ref={modalRef}
        handlePosition="inside"
        modalHeight={330}
        onClose={onClose}
        modalStyle={styles.modalStyle}>
        <RowComponent styles={styles.content}>
          <Image source={{uri: img}} style={styles.image} />
          <TextComponent label={name} title />
        </RowComponent>
        <SpaceComponent height={18} />
        <RowComponent styles={styles.content} onPress={handleNavigation}>
          <Messenger size={appInfo.sizeIconBold} color={appColors.blue} />
          <TextComponent label={`Message with ${getFirstName(name)}`} title />
        </RowComponent>
        <SpaceComponent height={18} />
        <RowComponent styles={styles.content}>
          <AntDesign
            name="tool"
            size={appInfo.sizeIconBold}
            color={appColors.blue}
          />
          <TextComponent label={`Block ${getFirstName(name)}`} title />
        </RowComponent>
        <SpaceComponent height={18} />
        <RowComponent styles={styles.content}>
          <ProfileDelete size={appInfo.sizeIconBold} color={appColors.blue} />
          <ButtonComponent type="action" onPress={handleUnFriend}>
            <TextComponent label={`Unfriend ${getFirstName(name)}`} title />
            <TextComponent
              label={`Remove ${getFirstName(name)} as a friend.`}
            />
          </ButtonComponent>
        </RowComponent>
      </Modalize>
    </Portal>
  );
};

export default UserInfoModal;

const styles = StyleSheet.create({
  image: {
    width: 65,
    height: 65,
    borderRadius: 50,
  },
  modalStyle: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 15,
  },
  content: {
    justifyContent: 'flex-start',
  },
});

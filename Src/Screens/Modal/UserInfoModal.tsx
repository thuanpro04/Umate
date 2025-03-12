import { Messenger, ProfileDelete } from 'iconsax-react-native';
import React, {
  useEffect,
  useRef
} from 'react';
import { useTranslation } from 'react-i18next';
import {
  Image,
  StatusBar,
  StyleSheet
} from 'react-native';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useSelector } from 'react-redux';
import { themeSelector } from '../../redux/reducers/themeSlice';
import { appInfo } from '../../Theme/appInfo';
import { appColors } from '../../Theme/Colors/appColors';
import {
  ButtonComponent,
  RowComponent,
  SpaceComponent,
  TextComponent,
} from '../Components';
import FastImage from 'react-native-fast-image';
interface Props {
  img: string;
  name: string;
  visible?: boolean;
  onClose: () => void;
  handleNavigation: () => void;
  handleUnFriend: () => void;
  handleBlockUser: (userId: string) => void;
  isBlock: Boolean;
}

const UserInfoModal = (props: Props) => {
  const {
    img,
    name,
    onClose,
    visible,
    handleNavigation,
    handleUnFriend,
    handleBlockUser,
    isBlock,
  } = props;
  const modalRef = useRef<Modalize>(null);
  const theme: 'light' | 'dark' = useSelector(themeSelector);
  const colors = appColors[theme ?? 'light'];
  const {t} = useTranslation();

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
        adjustToContentHeight
        onClose={onClose}
        modalStyle={[styles.modalStyle, {backgroundColor: colors.background}]}>
        <RowComponent styles={styles.content}>
          {img && <FastImage source={{uri: img,priority:FastImage.priority.high, cache:FastImage.cacheControl.immutable}} style={styles.image} />}

          <TextComponent label={name} title />
        </RowComponent>
        <SpaceComponent height={18} />
        <RowComponent styles={styles.content} onPress={handleNavigation}>
          <Messenger size={appInfo.sizeIconBold} color={colors.icon} />
          <TextComponent
            label={`${t('chat_with')} ${getFirstName(name)}`}
            title
          />
        </RowComponent>
        <SpaceComponent height={18} />
        <RowComponent styles={styles.content} onPress={handleBlockUser}>
          <AntDesign
            name="tool"
            size={appInfo.sizeIconBold}
            color={colors.icon}
          />
          {!isBlock ? (
            <TextComponent
              label={`${t('block')} ${getFirstName(name)}`}
              title
            />
          ) : (
            <TextComponent
              label={`${t('unblock')} ${getFirstName(name)}`}
              title
            />
          )}
        </RowComponent>
        <SpaceComponent height={18} />
        <RowComponent styles={styles.content}>
          <ProfileDelete size={appInfo.sizeIconBold} color={colors.icon} />
          <ButtonComponent type="action" onPress={handleUnFriend}>
            <TextComponent label={`${t('unfriend')} ${getFirstName(name)}`} title />
            <TextComponent
              label={`${t('remove_friend')}`}
            />
          </ButtonComponent>
        </RowComponent>
        <SpaceComponent height={20} />
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
    paddingVertical: StatusBar.currentHeight,
    paddingHorizontal: 12,
  },
  content: {
    justifyContent: 'flex-start',
  },
});

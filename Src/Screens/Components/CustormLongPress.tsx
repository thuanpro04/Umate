import AsyncStorage from '@react-native-async-storage/async-storage';
import {Camera, Edit, MessageRemove} from 'iconsax-react-native';
import {Blocks, Edit2Icon, Pencil} from 'lucide-react-native';
import React, {ReactNode, useCallback, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {LongPressGestureHandler, State} from 'react-native-gesture-handler';
import {Modalize} from 'react-native-modalize';
import {Portal} from 'react-native-portalize';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector} from 'react-redux';
import {authSelector} from '../../redux/reducers/authReducer';
import {friendSelector, setBlock} from '../../redux/reducers/friendSlice';
import {themeSelector} from '../../redux/reducers/themeSlice';
import {appInfo} from '../../Theme/appInfo';
import {appColors} from '../../Theme/Colors/appColors';
import ActionModal from '../Modal/ActionModal';
import LoadingModal from '../Modal/LoadingModal';
import {notificationServices} from '../Services/notificationServices';
import {userServices} from '../Services/userService';
import RowComponent from './RowComponent';
import SpaceComponent from './SpaceComponent';
import TextComponent from './TextComponent';
import ButtonImagePicker from '../Messages/Component/ButtonImagePicker';
import {globalStyles} from '../../Styles/globalStyle';
import {ImageOrVideo} from 'react-native-image-crop-picker';
import UpdateInfoModal from '../Modal/UpdateInfoModal';
import {Notification} from '../Untils/Notification';
import {groupServices} from '../Services/groupServices';
import {imageService} from '../Services/imageService';
interface Props {
  children: ReactNode;
  user: any;
  handleGhimConversation: () => void;
  handleDeleteConversation: () => void;
  onGroupNameUpdated: () => void; // Callback khi tên nhóm được cập nhật
}

const CustormLongPress = (props: Props) => {
  const {
    children,
    user,
    handleGhimConversation,
    handleDeleteConversation,
    onGroupNameUpdated,
  } = props;
  const modalRef = useRef<Modalize>(null);
  const [isEditGroupName, setEditGroupName] = useState(false);

  const theme: 'light' | 'dark' = useSelector(themeSelector);
  const colors = appColors[theme ?? 'light'];
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {t} = useTranslation();
  const auth = useSelector(authSelector);
  const dispatch = useDispatch();
  const friendData = useSelector(friendSelector);
  const isGroup = user.type === 'group';
  const menu = [
    {
      key: 'ghim',
      icon: (
        <AntDesign
          name="pushpino"
          size={appInfo.sizeIconBold}
          color={colors.icon}
        />
      ),
      name: t('ghim'),
      onPress: useCallback(() => {
        // Đóng modal trước khi thực hiện hành động
        handleGhimConversation();
        onClose();
        // Thực hiện logic ghim
        console.log('Ghim tin nhắn');
      }, []),
    },

    {
      key: 'notification',
      icon:
        user && user.notification && user.notification.includes(auth.userId) ? (
          <Ionicons
            name="notifications-off-outline"
            size={appInfo.sizeIconBold}
            color={colors.icon}
          />
        ) : (
          <Ionicons
            name="notifications-outline"
            size={appInfo.sizeIconBold}
            color={colors.icon}
          />
        ),
      name: t('notification'),
      onPress: useCallback(() => {
        // Đóng modal trước khi thực hiện hành động
        handleActionNotification();
        onClose();
        // Thực hiện logic xóa
      }, []),
    },
    {
      key: 'block',
      icon: <Blocks size={appInfo.sizeIconBold} color={colors.icon} />,
      name:
        friendData.block && friendData.block.includes(user.userId)
          ? t('unblock')
          : t('block'),
      onPress: useCallback(() => {
        actionShowModalBlock();
        onClose();
      }, []),
    },
    {
      key: 'delete',
      icon: <MessageRemove size={appInfo.sizeIconBold} color={colors.icon} />,
      name: t('delete'),
      onPress: useCallback(() => {
        onClose();
        handleDeleteConversation();
        console.log('Xóa cuộc trò chuyện');
      }, []),
    },
  ];

  const actionShowModalBlock = () => {
    setShowBlockModal(true);
  };
  const handleBlock = async () => {
    setIsLoading(true);
    const res = await userServices.updateBlockUser(auth.userId, user.userId);
    if (res) {
      console.log('Block successfully !!!', res.data);
      const [userData] = await Promise.all([AsyncStorage.getItem('userData')]);
      const parsedData = userData ? JSON.parse(userData) : {};
      parsedData.friend.block = res.data;
      await Promise.all([
        AsyncStorage.setItem('userData', JSON.stringify(parsedData)),
        dispatch(setBlock(res.data)),
      ]);
      console.log('Sau khi cập nhật:', friendData.block);
    }
    setIsLoading(false);
    setShowBlockModal(false);
    console.log('auth', friendData.block);
  };
  function onClose() {
    modalRef.current?.close();
  }
  const handleActionNotification = async () => {
    setIsLoading(true);
    const res = await notificationServices.actionNotificationUser(
      auth.userId,
      user.type === 'personal' ? user.conversationId : user.groupId,
      user.type,
    );
    if (res && res.data) {
      console.log('handle notification successfully !!', res.data);
    }
    setIsLoading(false);
  };

  const onOpenModal = useCallback(() => {
    modalRef.current?.open();
  }, []);

  const onLongPress = useCallback(
    ({nativeEvent}: any) => {
      if (nativeEvent.state === State.ACTIVE) {
        onOpenModal();
      }
    },
    [onOpenModal],
  );
  const onPressEditGroupName = async () => {
    setEditGroupName(true);
    onClose();
  };
  const handleEditGroupName = async (value: string) => {
    if (value.length < 6 || value === user.groupName) {
      Notification.showToast(
        'info',
        'Đặt tên nhóm cho đẹp vào',
        'Tên nhóm tào lao 😡',
      );
      return;
    }
    setIsLoading(true);

    const res = await groupServices.handleEditGroupName(user.groupId, value);
    if (res && res.data) {
      console.log('Edit name success', res.data);
      onGroupNameUpdated(); // Gọi callback để thông báo cập nhật
    }
    setIsLoading(false);
  };
  const handleUpLoadAvatarGroup = async (urlImg: string) => {
    if (!urlImg || !user.groupId) {
      return;
    }
    setIsLoading(true);
    const res = await groupServices.uploadAvatarGroup(user.groupId, urlImg);
    if (res && res.data) {
      console.log('Upload avatar success !!!', res.data);
      onGroupNameUpdated(); // Gọi callback để thông báo cập nhật
    }
    setIsLoading(false);
  };
  const handleSelected = async (val: ImageOrVideo) => {
    setIsLoading(true);
    const filePath = val.path;
    const fileName = filePath.split('/').pop();
    const path = `avatars/${fileName}`;
    const url = await imageService.uploadImageToFirebase(filePath, path);
    handleUpLoadAvatarGroup(url?.toString() ?? '');
  };
  return (
    <View style={{flex: 1}}>
      <LongPressGestureHandler
        onHandlerStateChange={onLongPress}
        minDurationMs={600}>
        <View>{children}</View>
      </LongPressGestureHandler>

      <Portal>
        <Modalize
          ref={modalRef}
          handlePosition="outside"
          closeOnOverlayTap={true}
          disableScrollIfPossible={true}
          adjustToContentHeight={true}
          modalStyle={[
            styles.modalContainer,
            {backgroundColor: colors.background},
          ]}>
          <View style={styles.menuContainer}>
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <FastImage
                source={{
                  uri: user.avatar,
                  priority: FastImage.priority.high,
                  cache: FastImage.cacheControl.immutable,
                }}
                style={styles.img}
              />
              {isGroup && (
                <View style={[globalStyles.overlay, styles.img]}>
                  <ButtonImagePicker
                    multiple={false}
                    icon={
                      <Camera size={appInfo.sizeIconBold} color={colors.icon} />
                    }
                    onSelect={x => {
                      if (x.type === 'url') {
                        handleUpLoadAvatarGroup(x.value.toString().trim());
                      } else {
                        handleSelected(x.value as ImageOrVideo);
                      }
                      onClose();
                    }}
                  />
                </View>
              )}
              <SpaceComponent height={10} />
              <RowComponent>
                <TextComponent label={user.name ?? user.groupName} title />
                {isGroup && (
                  <Pencil
                    size={16}
                    color={colors.icon}
                    onPress={onPressEditGroupName}
                  />
                )}
              </RowComponent>
            </View>
            <SpaceComponent height={10} />
            {menu.map(item =>
              item.key === 'block' && isGroup ? (
                <React.Fragment key={item.key}></React.Fragment>
              ) : (
                <TouchableOpacity
                  key={item.key}
                  activeOpacity={0.7}
                  onPress={item.onPress}
                  style={styles.menuItem}>
                  <RowComponent
                    styles={{justifyContent: 'flex-start', paddingVertical: 8}}>
                    {item.icon}
                    <TextComponent
                      label={item.name}
                      styles={{fontStyle: 'italic', fontWeight: '600'}}
                    />
                  </RowComponent>
                  <SpaceComponent height={10} />
                </TouchableOpacity>
              ),
            )}
          </View>
        </Modalize>
      </Portal>
      <ActionModal
        visible={showBlockModal}
        onPressNo={() => setShowBlockModal(false)}
        onPressYes={async () => await handleBlock()}
        descriptions={
          friendData?.block?.includes(user.userId)
            ? t('unblock_friend')
            : t('block_friend')
        }
        title={
          friendData?.block?.includes(user.userId)
            ? t('confirm_unblock') + user.name
            : t('confirm_block') + user.name
        }
      />
      <UpdateInfoModal
        isVisible={isEditGroupName}
        nickName={t('group_name')}
        nameField={user.groupName}
        onCloseModal={() => setEditGroupName(false)}
        onChangeProfile={(key, value) => handleEditGroupName(value)}
      />
      <LoadingModal visible={isLoading} />
    </View>
  );
};

export default CustormLongPress;

const styles = StyleSheet.create({
  modalContainer: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    padding: 16,
  },
  menuContainer: {
    paddingVertical: 8,
  },
  menuItem: {
    width: '100%',
  },
  img: {height: 100, width: 100, borderRadius: 12},
});

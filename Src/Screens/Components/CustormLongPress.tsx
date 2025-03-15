import React, {ReactNode, useRef, useCallback, useState} from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {LongPressGestureHandler, State} from 'react-native-gesture-handler';
import {Modalize} from 'react-native-modalize';
import {Portal} from 'react-native-portalize';
import TextComponent from './TextComponent';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {appInfo} from '../../Theme/appInfo';
import {useDispatch, useSelector} from 'react-redux';
import {themeSelector} from '../../redux/reducers/themeSlice';
import {appColors} from '../../Theme/Colors/appColors';
import {useTranslation} from 'react-i18next';
import {MessageRemove, Notification, Notification1} from 'iconsax-react-native';
import RowComponent from './RowComponent';
import SpaceComponent from './SpaceComponent';
import FastImage from 'react-native-fast-image';
import {globalStyles} from '../../Styles/globalStyle';
import {Blocks} from 'lucide-react-native';
import {messageServices} from '../Services/messageServices';
import {userServices} from '../Services/userService';
import {authSelector} from '../../redux/reducers/authReducer';
import {friendSelector, setBlock} from '../../redux/reducers/friendSlice';
import {UserInfo} from '../Untils/UserInfo';
import ActionModal from '../Modal/ActionModal';
import {notificationServices} from '../Services/notificationServices';
import LoadingModal from '../Modal/LoadingModal';
import Ionicons from 'react-native-vector-icons/Ionicons';
interface Props {
  children: ReactNode;
  user: any;
  handleGhimConversation:() => void
}

const CustormLongPress = (props: Props) => {
  const {children, user,handleGhimConversation} = props;
  const modalRef = useRef<Modalize>(null);
  const theme: 'light' | 'dark' = useSelector(themeSelector);
  const colors = appColors[theme ?? 'light'];
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {t} = useTranslation();
  const auth = useSelector(authSelector);
  const dispatch = useDispatch();
  const friendData = useSelector(friendSelector);

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
        modalRef.current?.close();
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
        modalRef.current?.close();
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
        modalRef.current?.close();
      }, []),
    },
    {
      key: 'delete',
      icon: <MessageRemove size={appInfo.sizeIconBold} color={colors.icon} />,
      name: t('delete'),
      onPress: useCallback(() => {
        modalRef.current?.close();
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
      dispatch(setBlock(res.data));
      console.log('Sau khi cập nhật:', friendData.block);
    }
    setIsLoading(false);
    setShowBlockModal(false);
    console.log('auth', friendData.block);
  };

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
  const handleDeleteConversation = async () => {
    setIsLoading(true);

    const res = await messageServices.deleteConversation({
      [user.type]: [user.userId],
    });
    if (res) {
      console.log('Delete conversation successfully !!!');
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
                style={{height: 100, width: 100, borderRadius: 12}}
              />
              <SpaceComponent height={10} />
              <TextComponent
                label={user.type === 'personal' ? user.name : user.groupName}
                title
              />
            </View>
            <SpaceComponent height={10} />
            {menu.map(item =>
              item.key === 'block' && user.type === 'group' ? (
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
          friendData.block && friendData.block.includes(user.userId)
            ? t('unblock_friend')
            : t('block_friend')
        }
        title={
          friendData.block && friendData.block.includes(user.userId)
            ? t('confirm_unblock') + user.name
            : t('confirm_block') + user.name
        }
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
});

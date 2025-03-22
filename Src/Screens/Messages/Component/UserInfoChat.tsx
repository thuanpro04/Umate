import AsyncStorage, {
  useAsyncStorage,
} from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import {ArrowLeft, CallCalling, Video} from 'iconsax-react-native';
import React, {useCallback, useState} from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
import {authSelector} from '../../../redux/reducers/authReducer';
import {themeSelector} from '../../../redux/reducers/themeSlice';
import {globalStyles} from '../../../Styles/globalStyle';
import {appInfo} from '../../../Theme/appInfo';
import {appColors} from '../../../Theme/Colors/appColors';
import {
  CarfeatureComponent,
  HeaderComponent,
  RowComponent,
  SpaceComponent,
  TextComponent,
} from '../../Components';
import UpdateInfoModal from '../../Modal/UpdateInfoModal';
import {notificationServices} from '../../Services/notificationServices';
import {UserInfo} from '../../Untils/UserInfo';
// import {ZegoSendCallInvitationButton} from '@zegocloud/zego-uikit-prebuilt-call-rn';
import {MenuChat} from '../../../data/MenuItems';
import {friendSelector, setBlock} from '../../../redux/reducers/friendSlice';
import {profileSelector} from '../../../redux/reducers/profileSlice';
import ActionModal from '../../Modal/ActionModal';
import {userServices} from '../../Services/userService';
import CustomCallButtonComponent from './CustomCallButtonComponent';
import {groupServices} from '../../Services/groupServices';
import {useTranslation} from 'react-i18next';
import FastImage from 'react-native-fast-image';
import QrCodeModal from '../../Modal/QrCodeModal';
import {socketSelector} from '../../../redux/reducers/socketSlice';
import {Notification} from '../../Untils/Notification';
import SocketService from '../../Services/SocketService';
const UserInfoChat = ({navigation}: any) => {
  const [showItems, setShowItems] = useState<any[]>([]);
  const [converInfo, setConverInfo] = useState<any>('');
  const [isVisibleQR, setIsVisibleQR] = useState(false);
  const [isShowBlockModal, setShowBlockModal] = useState(false);
  const {getItem} = useAsyncStorage('ConversationInfo');
  const auth = useSelector(authSelector);
  const friendData = useSelector(friendSelector);
  const theme: 'light' | 'dark' = useSelector(themeSelector);
  const isPersonal = converInfo.type === 'personal';
  const colors: any = appColors[converInfo.theme ?? theme];
  const socket = SocketService.getSocket();
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const idConver = converInfo.groupId ?? converInfo.userId;

  const name = converInfo.nickNames?.[idConver] ?? converInfo.name;
  const onChangeShowItems = (key: any) => {
    setShowItems(prev => ({...prev, [key]: !showItems[key]}));
  };

  const getConversationInfo = useCallback(async () => {
    setConverInfo(await UserInfo.getConversationInfo(getItem));
  }, []);
  const handleActionNotification = async () => {
    const res = await notificationServices.actionNotificationUser(
      auth.userId,
      isPersonal ? converInfo.conversationId : idConver,
      converInfo.type,
    );
    if (res?.data) {
      console.log('Action notification successfully !!', res.data);

      // Lấy danh sách notification, nếu chưa có thì dùng mảng rỗng
      const notifications = converInfo.notification ?? [];

      let updatedNotifications;
      if (notifications.includes(res.data)) {
        // Nếu đã tồn tại -> Xóa đi
        updatedNotifications = notifications.filter(
          (item: any) => item !== res.data,
        );
      } else {
        // Nếu chưa có -> Thêm vào
        updatedNotifications = [...notifications, res.data];
      }

      // Cập nhật vào AsyncStorage
      await AsyncStorage.setItem(
        'ConversationInfo',
        JSON.stringify({
          ...converInfo,
          notification: updatedNotifications,
        }),
      );

      // Cập nhật state
      setConverInfo({
        ...converInfo,
        notification: updatedNotifications,
      });
    }
  };
  const handleBlockUser = async () => {
    setShowBlockModal(true);
  };
  const actionBlockUser = async (userId: string, userFriendId: string) => {
    try {
      setShowBlockModal(false);
      const res = await userServices.updateBlockUser(userId, userFriendId);
      if (!res) return;

      console.log('Block successfully !!!', res.data);
      // Lấy dữ liệu và cập nhật song song
      const parsedData = await UserInfo.getUserData();

      parsedData.friend.block = res.data;

      // Lưu AsyncStorage và cập nhật Redux song song
      await Promise.all([
        AsyncStorage.setItem('userData', JSON.stringify(parsedData)),
        dispatch(setBlock(res.data)),
      ]);

      console.log('Sau khi cập nhật:', friendData.block);
    } catch (error) {
      console.error('Lỗi khi block user:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getConversationInfo();
    }, []),
  );

  const onPressItems = (key: string) => {
    // xử lí group
    console.log(key);

    switch (key) {
      case 'topic':
        navigation.navigate('ThemeChatScreen', {
          converInfo,
        });
        break;
      case 'nickname':
        navigation.navigate('CustormNickNameScreen', {
          converInfo,
        });
        break;
      case 'images':
        navigation.navigate('YourImagesScreen', {
          id: isPersonal ? converInfo.conversationId : idConver,
          type: converInfo.type,
          theme: converInfo.theme ?? theme,
        });
        break;
      case 'link':
        navigation.navigate('YourLinkScreen', {
          id: isPersonal ? converInfo.conversationId : idConver,
          type: converInfo.type,
          theme: converInfo.theme ?? theme,
        });
        break;
      case 'block':
        handleBlockUser();
        break;
      case 'report':
        navigation.navigate('ReportScreen', {
          name: isPersonal ? converInfo.name : converInfo.groupName,
          userId: isPersonal ? idConver : idConver,
        });
        break;
      case 'outgroup':
        handleOutGroup();
        break;
      case 'qrcode':
        setIsVisibleQR(true);

        break;
      default:
        break;
    }
  };
  const showNotification_QrCode = (time: string, data: any) => {
    Alert.alert(
      t('confirm'), // Tiêu đề
      t('warning_qr') + time + ' ' + t('minutes'), // Nội dung
      [
        {
          text: t('cancel'), // Nút No
          style: 'cancel', // Kiểu nút
          onPress: () => setIsVisibleQR(false),
        },
        {
          text: t('agree'), // Nút Yes
          onPress: () => HandleSendQRForGroup(time, data),
        },
      ],
    );
  };

  const HandleSendQRForGroup = async (time: string, data: any) => {
    try {
      const messageData = {
        senderId: auth.userId,
        content: time.trim(),
        imagesUrl: [],
        groupId: idConver,
        QRCode: {qrdata: data, attended: []},
        recipients: converInfo.invitedUsers,
      };
      
      socket?.emit('send_qrcode', messageData);
      setIsVisibleQR(false);
      Notification.showToast('success', t('notification'), t('create_qr'));
    } catch (error) {}
  };

  const renderObjectCategory = (item: any[]) => {
    const condition =
      !isPersonal &&
      (converInfo.leader.userId === auth.userId ||
        converInfo.deputyLeader.userId === auth.userId);

    return (
      <View style={styles.showItemStyle}>
        {item.map((element, index) =>
          element.id === 'qrcode' ? (
            condition && (
              <CarfeatureComponent
                key={index}
                label={
                  element.id === 5 && !!friendData.block?.includes(idConver)
                    ? t(`unblock`)
                    : t(`${element.label}`)
                }
                labelColor={colors.text}
                icon={element.icon}
                onPress={() => onPressItems(element.id)}
              />
            )
          ) : (
            <CarfeatureComponent
              key={index}
              label={
                element.id === 5 && !!friendData.block?.includes(idConver)
                  ? t(`unblock`)
                  : t(`${element.label}`)
              }
              labelColor={colors.text}
              icon={element.icon}
              onPress={() => onPressItems(element.id)}
            />
          ),
        )}
      </View>
    );
  };

  const renderCategory = () => {
    const data = isPersonal
      ? MenuChat(colors).CategoryPersonal
      : MenuChat(colors).CategoryGroup;
    return data.map((item, index) => (
      <View
        key={index}
        style={{
          backgroundColor: colors.card,
          borderTopLeftRadius: index === 0 ? 12 : 0,
          borderTopRightRadius: index === 0 ? 12 : 0,
          borderBottomLeftRadius: index === data.length - 1 ? 12 : 0,
          borderBottomRightRadius: index === data.length - 1 ? 12 : 0,
        }}>
        <CarfeatureComponent
          label={t(`${item.title}`)}
          icon={item.icon}
          labelColor={colors.text}
          styles={{
            backgroundColor: showItems[item.key]
              ? colors.border
              : 'transparent',
            borderRadius: 12,
          }}
          onPress={() => onChangeShowItems(item.key)}
          isArrow
        />
        {showItems[item.key] && renderObjectCategory(item.Object)}
      </View>
    ));
  };

  const handleChoiceItems = (key: string) => {
    switch (key) {
      case 'personal':
        navigation.navigate('PersonalScreen', {
          userId: isPersonal ? idConver : '',
        });
        break;
      case 'notification':
        handleActionNotification();
        break;
      case 'member':
        navigation.navigate('MemberGroup');
        break;
    }
  };
  const handleOutGroup = async () => {
    const res = await groupServices.handleOutGroup(auth.userId, idConver);
    if (res && res.data) {
      console.log('Member: ', res.data);
      await AsyncStorage.setItem(
        'ConversationInfo',
        JSON.stringify({
          ...converInfo,
          invitedUsers: res.data,
        }),
      );
      console.log('Out group successfully !!');
      navigation.navigate(t('message'));
    }
  };

  return (
    <SafeAreaView
      style={[globalStyles.main, {backgroundColor: colors.background}]}>
      <HeaderComponent
        iconLeft={<ArrowLeft size={appInfo.sizeIconBold} color={colors.icon} />}
        onPress1={() => navigation.goBack()}
      />
      {converInfo && (
        <ScrollView style={{flex: 1}}>
          <View style={styles.container}>
            {converInfo.avatar ? (
              <FastImage
                source={{
                  uri: isPersonal ? converInfo.avatar : converInfo.avatar,
                  priority: FastImage.priority.high,
                  cache: FastImage.cacheControl.immutable,
                }}
                style={styles.avatar}
              />
            ) : (
              <Image
                source={{
                  uri: 'https://cdn-icons-png.flaticon.com/128/1999/1999625.png',
                }}
                style={globalStyles.avatar}
              />
            )}
            <TextComponent
              label={isPersonal ? name : converInfo.groupName}
              color={colors.text}
              title
              size={28}
            />
            <SpaceComponent height={20} />
            <RowComponent styles={{gap: 20, marginHorizontal: 12}}>
              <>
                <CustomCallButtonComponent
                  txtStyles={{color: colors.text}}
                  converInfo={converInfo}
                  isDisible={
                    (converInfo.block &&
                      isPersonal &&
                      converInfo.block.includes(auth.userId)) ||
                    (friendData.block &&
                      isPersonal &&
                      friendData.block.includes(idConver))
                  }
                  type={isPersonal ? 'personal_voice' : 'group_voice'}
                  targetName={isPersonal ? name : converInfo.groupName}
                  targetId={
                    isPersonal
                      ? idConver
                      : converInfo.invitedUsers &&
                        converInfo.invitedUsers.filter(
                          (id: any) => id !== auth.userId,
                        )
                  }
                  styles={styles.menu}
                  text="call"
                  icon={<CallCalling color="blue" size={22} />}
                />
                <CustomCallButtonComponent
                  txtStyles={{color: colors.text}}
                  converInfo={converInfo}
                  isDisible={
                    (converInfo.block &&
                      converInfo.block.includes(auth.userId)) ||
                    (friendData.block && friendData.block.includes(idConver))
                  }
                  type={isPersonal ? 'personal_video' : 'group_video'}
                  targetName={isPersonal ? name : converInfo.groupName}
                  targetId={
                    isPersonal
                      ? idConver
                      : converInfo.invitedUsers &&
                        converInfo.invitedUsers.filter(
                          (id: any) => id !== auth.userId,
                        )
                  }
                  styles={styles.menu}
                  text="video"
                  icon={<Video color="blue" size={22} />}
                />
              </>
              {MenuChat(colors).ChoiceItems.map((item, index) => (
                <TouchableOpacity
                  onPress={() =>
                    handleChoiceItems(!isPersonal ? 'member' : item.key)
                  }
                  style={styles.menu}
                  key={index}
                  activeOpacity={0.4}>
                  {item.key === 'notification' ? (
                    converInfo.notification?.includes(auth.userId) ? (
                      <Ionicons
                        name="notifications-outline"
                        size={appInfo.sizeIconBold}
                        color={appColors.cobalt}
                      />
                    ) : (
                      <Ionicons
                        name="notifications-off-outline"
                        size={appInfo.sizeIconBold}
                        color={appColors.cobalt}
                      />
                    )
                  ) : !isPersonal ? (
                    <MaterialCommunityIcons
                      name="account-group"
                      size={appInfo.sizeIconBold}
                      color={appColors.cobalt}
                    />
                  ) : (
                    item.icon
                  )}
                  <TextComponent
                    color={colors.text}
                    label={!isPersonal ? t('member') : t(`${item?.name}`)}
                    size={12}
                    styles={{fontStyle: 'italic'}}
                  />
                </TouchableOpacity>
              ))}
            </RowComponent>
          </View>
          <SpaceComponent height={100} />
          <View style={{flex: 1}}>
            <TextComponent
              label={t('feature')}
              title
              color={colors.text}
              styles={{marginLeft: 12}}
            />
            <SpaceComponent height={12} />
            {renderCategory()}
          </View>
        </ScrollView>
      )}
      <ActionModal
        visible={isShowBlockModal}
        onPressNo={() => setShowBlockModal(false)}
        onPressYes={async () => await actionBlockUser(auth.userId, idConver)}
        descriptions={`${
          friendData.block && friendData.block.includes(idConver)
            ? t('confirm_unblock') + converInfo.name
            : t('confirm_block') + converInfo.name
        }`}
        title={`${
          friendData.block && friendData.block.includes(idConver)
            ? t('unblock_friend') + converInfo.name
            : t('block_friend') + converInfo.name
        }`}
      />
      <QrCodeModal
        type={converInfo.type}
        groupId={isPersonal && idConver}
        visible={isVisibleQR}
        onClose={() => setIsVisibleQR(false)}
        onPress={showNotification_QrCode}
      />
    </SafeAreaView>
  );
};

export default UserInfoChat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menu: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderTopLeftRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderBottomRightRadius: 12,
    borderColor: appColors.blue2,
  },
  showItemStyle: {
    paddingHorizontal: 18,
  },
  avatar: {
    height: 85,
    width: 85,
    borderRadius: 8,
  },
});

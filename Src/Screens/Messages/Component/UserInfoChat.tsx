import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import {
  ArrowLeft,
  CallCalling,
  Video
} from 'iconsax-react-native';
import React, { useCallback, useState } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import { authSelector } from '../../../redux/reducers/authReducer';
import { themeSelector } from '../../../redux/reducers/themeSlice';
import { globalStyles } from '../../../Styles/globalStyle';
import { appInfo } from '../../../Theme/appInfo';
import { appColors } from '../../../Theme/Colors/appColors';
import {
  CarfeatureComponent,
  HeaderComponent,
  RowComponent,
  SpaceComponent,
  TextComponent,
} from '../../Components';
import UpdateInfoModal from '../../Modal/UpdateInfoModal';
import { notificationServices } from '../../Services/notificationServices';
import { UserInfo } from '../../Untils/UserInfo';
// import {ZegoSendCallInvitationButton} from '@zegocloud/zego-uikit-prebuilt-call-rn';
import { MenuChat } from '../../../data/MenuItems';
import { friendSelector, setBlock } from '../../../redux/reducers/friendSlice';
import { profileSelector } from '../../../redux/reducers/profileSlice';
import ActionModal from '../../Modal/ActionModal';
import { userServices } from '../../Services/userService';
import CustomCallButtonComponent from './CustomCallButtonComponent';
const UserInfoChat = ({navigation}: any) => {
  const [visible, setVisible] = useState(false);
  const [showItems, setShowItems] = useState<any[]>([]);
  const [converInfo, setConverInfo] = useState<any>('');
  const [isShowBlockModal, setShowBlockModal] = useState(false);

  const {getItem} = useAsyncStorage('ConversationInfo');
  const auth = useSelector(authSelector);
  const profile = useSelector(profileSelector);
  const friendData = useSelector(friendSelector);
  const [statusNotification, setStatusNotification] = useState(false);
  const theme: 'light' | 'dark' = useSelector(themeSelector);
  const colors = appColors[theme ?? 'light'];
  const dispatch = useDispatch();
  const onChangeShowItems = (key: any) => {
    setShowItems(prev => ({...prev, [key]: !showItems[key]}));
  };

  const getConversationInfo = useCallback(async () => {
    setConverInfo(await UserInfo.getConversationInfo(getItem));
    setStatusNotification(
      converInfo && converInfo.notification.includes(auth.userId),
    );
    // console.log("converInfo",converInfo);
  }, []);
  const handleActionNotification = async () => {
    try {
      const res = await notificationServices.actionNotificationUser(
        auth.userId,
        converInfo.type === 'personal'
          ? converInfo.conversationId
          : converInfo.groupId,
        converInfo.type,
      );
    } catch (error) {
      console.log('Action notification fail error: ', error);
    }
  };
  const handleBlockUser = async () => {
    setShowBlockModal(true);
  };
  const actionBlockUser = async (userId: string, userFriendId: string) => {
    try {
      const res = await userServices.updateBlockUser(userId, userFriendId);
      if (res) {
        console.log('Block successfully !!!', res.data);
        dispatch(setBlock(res.data));
        console.log('Sau khi cập nhật:', friendData.block);
      }
      setShowBlockModal(false);
    } catch (error) {
      console.log('handle block user fail: ', error);
      setShowBlockModal(false);
    }
  };
  useFocusEffect(
    useCallback(() => {
      getConversationInfo();
      // requestMicrophonePermission();
    }, []),
  );

  // const requestMicrophonePermission = async () => {
  //   try {
  //     const granted = await PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
  //     );
  //     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //       console.log('✅ Đã cấp quyền microphone');
  //     } else {
  //       console.log('🚫 Quyền microphone bị từ chối');
  //     }
  //   } catch (error) {
  //     console.error('⚠️ Lỗi khi yêu cầu quyền microphone:', error);
  //   }
  // };
  const onPressItems = (key: number) => {
    console.log(key);

    switch (key) {
      case 1:
        console.log('Thay đổi chủ đề !!');
        break;
      case 2:
        setVisible(true);
        break;
      case 3:
        navigation.navigate('YourImagesScreen',{conversationId:converInfo.conversationId})
        break;
      case 4:
        navigation.navigate('YourLinkScreen',{conversationId:converInfo.conversationId})

        break;
      case 5:
        handleBlockUser();
        break;
      case 6:
        navigation.navigate('ReportScreen', {
          name: converInfo.name,
          userId: converInfo.userId,
        });

        break;
      default:
        break;
    }
  };

  const renderObjectCategory = (item: any[]) => {
    return (
      <View style={styles.showItemStyle}>
        {item.map((element, index) => (
          <CarfeatureComponent
            key={index}
            label={
              element.id === 5 &&
              friendData.block &&
              friendData.block.includes(converInfo.userId)
                ? `Un${element.label}`
                : element.label
            }
            icon={element.icon}
            onPress={() => onPressItems(element.id)}
          />
        ))}
      </View>
    );
  };

  const renderCategory = () => {
    const data = MenuChat(colors).Categorys;
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
          label={item.title}
          icon={item.icon}
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
          userId: converInfo.type === 'personal' ? converInfo.userId : '',
        });
        break;
      case 'notification':
        setStatusNotification(!statusNotification);
        handleActionNotification();
        break;
      case 'member':
        navigation.navigate('MemberGroup');
        break;
    }
  };

  return (
    <SafeAreaView
      style={[globalStyles.main, {backgroundColor: colors.background}]}>
      <HeaderComponent
        iconLeft={<ArrowLeft size={appInfo.sizeIconBold} color={colors.icon} />}
        onPress1={() => navigation.goBack()}
      />
      <ScrollView style={{flex: 1}}>
        <View style={styles.container}>
          {converInfo ? (
            <Image
              source={{
                uri:
                  converInfo.type === 'personal'
                    ? converInfo.avatar
                    : converInfo.avatar,
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
            label={
              converInfo.type === 'personal'
                ? UserInfo.getName(converInfo.name)
                : converInfo.groupName
            }
            title
            size={28}
          />
          <SpaceComponent height={20} />
          <RowComponent styles={{gap: 20, marginHorizontal: 12}}>
            {converInfo && (
              <>
                <CustomCallButtonComponent
                  isDisible={
                    (converInfo.block &&
                      converInfo.block.includes(auth.userId)) ||
                    (friendData.block &&
                      friendData.block.includes(converInfo.userId))
                  }
                  type={
                    converInfo.type === 'personal'
                      ? 'personal_voice'
                      : 'group_voice'
                  }
                  avatar={converInfo.avatar}
                  targetName={
                    converInfo.type === 'personal'
                      ? UserInfo.getName(converInfo.name)
                      : UserInfo.getName(converInfo.groupName)
                  }
                  userId={auth.userId}
                  targetId={
                    converInfo.type === 'personal'
                      ? converInfo.userId
                      : converInfo.invitedUsers &&
                        converInfo.invitedUsers.filter(
                          (id: any) => id !== auth.userId,
                        )
                  }
                  userName={UserInfo.getName(profile.name)}
                  styles={styles.menu}
                  text="call"
                  icon={<CallCalling color="blue" size={22} />}
                />
                <CustomCallButtonComponent
                  isDisible={
                    (converInfo.block &&
                      converInfo.block.includes(auth.userId)) ||
                    (friendData.block &&
                      friendData.block.includes(converInfo.userId))
                  }
                  type={
                    converInfo.type === 'personal'
                      ? 'personal_video'
                      : 'group_video'
                  }
                  avatar={converInfo.avatar}
                  targetName={
                    converInfo.type === 'personal'
                      ? UserInfo.getName(converInfo.name)
                      : UserInfo.getName(converInfo.groupName)
                  }
                  userId={auth.userId}
                  targetId={
                    converInfo.type === 'personal'
                      ? converInfo.userId
                      : converInfo.invitedUsers &&
                        converInfo.invitedUsers.filter(
                          (id: any) => id !== auth.userId,
                        )
                  }
                  userName={UserInfo.getName(profile.name)}
                  styles={styles.menu}
                  text="video"
                  icon={<Video color="blue" size={22} />}
                />
              </>
            )}
            {MenuChat(colors).ChoiceItems.map((item, index) => (
              <TouchableOpacity
                onPress={() =>
                  handleChoiceItems(
                    converInfo.type === 'group' && item.key === 'personal'
                      ? 'member'
                      : item.key,
                  )
                }
                style={styles.menu}
                key={index}
                activeOpacity={0.4}>
                {item.key === 'notification' ? (
                  statusNotification ? (
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
                ) : converInfo.type === 'group' && item.key === 'personal' ? (
                  <MaterialCommunityIcons
                    name="account-group"
                    size={appInfo.sizeIconBold}
                    color={appColors.cobalt}
                  />
                ) : (
                  item.icon
                )}
                <TextComponent
                  label={
                    converInfo.type === 'group' && item.key === 'personal'
                      ? 'Thành viên'
                      : item?.name
                  }
                  size={12}
                  styles={{fontStyle: 'italic'}}
                />
              </TouchableOpacity>
            ))}
          </RowComponent>
        </View>
        <SpaceComponent height={100} />
        <View style={{flex: 1}}>
          <TextComponent label="Chức năng" title />
          <SpaceComponent height={12} />
          {renderCategory()}
        </View>
      </ScrollView>

      <UpdateInfoModal
        isVisible={visible}
        nameField="UserName"
        onCloseModal={() => setVisible(false)}
        onChangeProfile={(key, value) => {}}
      />
      <ActionModal
        visible={isShowBlockModal}
        onPressNo={() => setShowBlockModal(false)}
        onPressYes={async () =>
          await actionBlockUser(auth.userId, converInfo.userId)
        }
        descriptions={`Do you really want to ${
          friendData.block && friendData.block.includes(converInfo.userId)
            ? ' un'
            : ''
        }block this friend?`}
        title={`Bạn có thực sự muốn${
          friendData.block && friendData.block.includes(converInfo.userId)
            ? ' bỏ'
            : ''
        } chặn ${UserInfo.getName(converInfo.name)} không`}
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

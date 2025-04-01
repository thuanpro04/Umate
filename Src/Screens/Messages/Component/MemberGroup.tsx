import AsyncStorage, {
  useAsyncStorage,
} from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { ArrowLeft2, SearchFavorite1 } from 'iconsax-react-native';
import { MoreVerticalIcon } from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, KeyboardAvoidingView, StyleSheet, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from 'react-redux';
import { MenuChat } from '../../../data/MenuItems';
import { authSelector } from '../../../redux/reducers/authReducer';
import { friendSelector } from '../../../redux/reducers/friendSlice';
import { socketSelector } from '../../../redux/reducers/socketSlice';
import { themeSelector } from '../../../redux/reducers/themeSlice';
import { globalStyles } from '../../../Styles/globalStyle';
import { appInfo } from '../../../Theme/appInfo';
import { appColors } from '../../../Theme/Colors/appColors';
import { HeaderComponent, SpaceComponent, TextComponent } from '../../Components';
import CarUserComponent from '../../Friends/Components/CarUserComponent';
import AddFriendModal from '../../Modal/AddFriendModal';
import LoadingModal from '../../Modal/LoadingModal';
import { friendServices } from '../../Services/friendService.';
import { groupServices } from '../../Services/groupServices';
import { notificationServices } from '../../Services/notificationServices';
import { userServices } from '../../Services/userService';
import { UserInfo } from '../../Untils/UserInfo';
const MemberGroup = ({navigation}: any) => {
  const auth = useSelector(authSelector);
  const friendData = useSelector(friendSelector);
  const [userInfo, setUserInfo] = useState<any[]>([]);
  const [addedFriends, setAddedFriends] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [converInfo, setConverInfo] = useState<any>('');
  const {getItem} = useAsyncStorage('ConversationInfo');
  const socket = useSelector(socketSelector).socket;
  const theme: 'light' | 'dark' = useSelector(themeSelector);
  const colors = appColors[theme ?? 'light'];
  const getConversationInfo = useCallback(async () => {
    setConverInfo(await UserInfo.getConversationInfo(getItem));
  }, []);
  useFocusEffect(
    useCallback(() => {
      getConversationInfo();
    }, []),
  );

  const fetchUserInfos = async () => {
    const res = await userServices.getListUserInfo(converInfo.invitedUsers);
    if (res && res.data) {
      setUserInfo(res.data);
    }
  };

  const handleAddFriend = async (friendUserId: string) => {
    setIsLoading(true);
    const res = await friendServices.handleFriendActionAdd_Cancel(
      friendUserId,
      'add',
      auth.userId,
    );
    if (res && res.data) {
      setAddedFriends(prev => [...prev, friendUserId]);
    }
    setIsLoading(false);
  };
  const shouldShowAddFriendIcon = (userId: string) => {
    return (
      !friendData.friends?.includes(userId) &&
      auth.userId !== userId &&
      !addedFriends?.includes(userId)
    );
  };
  const onPressCarUser = (item: any) => {
    navigation.navigate('PersonalScreen', {
      userId: item.userId,
    });
  };
  const onNavigationPersonal = (userId: string) => {
    navigation.navigate('PersonalScreen', {
      userId,
    });
  };
  const renderUserInfo = useCallback(
    ({item, index}: any) => {
      return (
        <CarUserComponent
          navigation={navigation}
          menuData={MenuChat(colors).attributeMember}
          userId={item.userId}
          authori={
            item.userId === converInfo.leader.userId
              ? 'Trưởng nhóm'
              : item.userId === converInfo.deputyLeader.userId
              ? 'Phó nhóm'
              : 'Thành viên'
          }
          deputyLeaderId={converInfo.deputyLeader.userId}
          leaderId={converInfo.leader.userId}
          url={item.avatar}
          addFriend={
            !item.friendRequests.includes(auth.userId) &&
            shouldShowAddFriendIcon(item.userId)
          }
          icon={
            item.userId !== auth.userId && (
              <MoreVerticalIcon size={22} color={colors.icon} />
            )
          }
          userName={item.name}
          onPress={() => onPressCarUser(item)}
          onPressAdd={() => handleAddFriend(item.userId)}
          onPressOutGroup={() => handleOutGroup(item.userId)}
          onPressPosition={() =>
            handlePosition(
              item.userId,
              auth.userId === converInfo.leader.userId
                ? 'leader'
                : auth.userId === converInfo.deputyLeader.userId
                ? 'deputyLeader'
                : undefined,
            )
          }
          onNavigationPersonal={() => onNavigationPersonal(item.userId)}
        />
      );
    },
    [userInfo, converInfo, setConverInfo],
  );

  const handlePosition = async (userId: string, position?: string) => {
    if (!userId) {
      console.log('UserId or onPressOutGroup no existing!!');
      return;
    }
    const res = await groupServices.handlePosition(
      userId,
      converInfo.groupId,
      position,
    );
    if (res && res.data) {
      const data =
        position === 'leader'
          ? {
              ...converInfo,
              leader: res.data,
            }
          : {
              ...converInfo,
              deputyLeader: res.data,
            };
      console.log('Position successfully !!', res.data);
      await AsyncStorage.setItem('ConversationInfo', JSON.stringify(data));
      setConverInfo(data);
    }
  };
  const handleOutGroup = async (userId: string) => {
    try {
      if (!userId) {
        console.log('UserId or onPressOutGroup no existing!!');
        return;
      }
      const res = await groupServices.handleOutGroup(
        userId,
        converInfo.groupId,
      );
      if (res && res.data) {
        console.log('Member: ', res.data);
        const user = userInfo.filter(item => item.userId !== userId);
        setUserInfo(user);
        await AsyncStorage.setItem(
          'ConversationInfo',
          JSON.stringify({
            ...converInfo,
            invitedUsers: res.data,
          }),
        );
        console.log('Out group successfully !!');
        socket.emit('leave_group', userId);
      }
    } catch (error) {
      console.log('out group error: ', error);
    }
  };
  const handleInviteToGroup = async (selectUser: string[]) => {
    setIsLoading(true);
    const res = await notificationServices.inviteToGroup(
      converInfo.groupId,
      selectUser,
      auth.userId,
      converInfo.groupName,
    );
    if (res && res.data) {
      console.log('Invited successfully: ', res.data);
    }
    setIsLoading(false);
  };
  const renderAddFriendModal = useCallback(() => {
    return (
      <AddFriendModal
        userId={auth.userId}
        visible={isVisible}
        onPressInviteToGroup={handleInviteToGroup}
        existingUser={converInfo.invitedUsers}
        onClose={() => setIsVisible(false)}
      />
    );
  }, [converInfo, isVisible]);
  useEffect(() => {
    if (converInfo) {
      fetchUserInfos();
    }
  }, [converInfo]);

  return (
    <KeyboardAvoidingView
      style={[globalStyles.container, {backgroundColor: colors.background}]}>
      <HeaderComponent
        iconStyle
        iconLeft={
          <ArrowLeft2 size={appInfo.sizeIconBold} color={colors.icon} />
        }
        iconQR={
          <MaterialIcons
            name="add-reaction"
            size={appInfo.sizeIconBold}
            color={colors.icon}
          />
        }
        onPressQR={() => setIsVisible(true)}
        iconRight={
          <SearchFavorite1 size={appInfo.sizeIconBold} color={colors.icon} />
        }
        onPress2={() => navigation.navigate('SearchFriends', {users: userInfo})}
      />
      <View style={{marginHorizontal: 16}}>
        <TextComponent label="Thành viên" title />
        <SpaceComponent height={18} />
        <FlatList
          data={userInfo}
          keyExtractor={item => item.userId.toString()}
          renderItem={renderUserInfo}
        />
      </View>
      {renderAddFriendModal()}
      <LoadingModal visible={isLoading} />
    </KeyboardAvoidingView>
  );
};

export default MemberGroup;

const styles = StyleSheet.create({});

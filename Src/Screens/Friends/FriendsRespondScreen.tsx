import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { appColors } from '../../Theme/Colors/appColors';
import { addAuth, authSelector } from '../../redux/reducers/authReducer';
import { friendSelector } from '../../redux/reducers/friendSlice';
import { themeSelector } from '../../redux/reducers/themeSlice';
import { CarUserComponent, SpaceComponent } from '../Components';
import ActionModal from '../Modal/ActionModal';
import LoadingModal from '../Modal/LoadingModal';
import UserInfoModal from '../Modal/UserInfoModal';
import { friendServices } from '../Services/friendService.';
import { messageServices } from '../Services/messageServices';
import { userServices } from '../Services/userService';
import { UserInfo } from '../Untils/UserInfo';

const initialUser = {
  avatar: '',
  email: '',
  friendRequests: [],
  friends: [],
  name: '',
  userId: '',
};

const FriendsRespondScreen = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState(initialUser);
  const [isShowUnfriendModal, setShowUnfriendModal] = useState(false);
  const [isShowBlockdModal, setShowBlockModal] = useState(false);
  const memoUsers = useMemo(() => users, [users]);
  const auth = useSelector(authSelector);
  const friendData = useSelector(friendSelector);
  const theme: 'light' | 'dark' = useSelector(themeSelector);
  const colors = appColors[theme ?? 'light'];
  const dispatch = useDispatch();
  const [useBlock, setUseBlock] = useState<any[]>([]);
  const navigation: any = useNavigation();
  const [isModal, setIsModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // Reload dữ liệu mỗi khi trang được focus
  useFocusEffect(
    useCallback(() => {
      fetchUserFriends();
    }, []),
  );
  // console.log(users);

  const fetchUserFriends = async () => {
    try {
      const res = await userServices.getEquestFriendUsers(auth.userId, '');
      if (res) {
        setUsers(res.data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleRemoveFriend = async (userId: string) => {
    try {
      console.log('userId', userId);

      const res = await friendServices.handleRemoveFriends(userId, auth.userId);
      //xử lí thêm xóa trong friend và update người friend người bị xóa
      setIsModal(false);
      fetchUserFriends();
    } catch (error) {
      console.log('handleRemoveFriends error', error);
      setIsModal(false);
    }
  };

  const handleCloseModal = () => {
    setIsModal(false);
  };

  const handleOpenModal = (user: any) => {
    setIsModal(true);
    setSelectedUser(user);
  };
  const onNavigationaProfile = (userId: any) => {
    navigation.navigate('PersonalScreen', {userId});
  };
  const onNavigationMessage = async (item: any) => {
    try {
      const res = await messageServices.checkConversation(
        auth.userId,
        item.userId,
      );
      res && console.log('res.data', res.data);

      if (res && res.data) {
        let conversationId = res.data;
        await AsyncStorage.setItem(
          'ConversationInfo',
          JSON.stringify({...item, conversationId}),
        );
      } else {
        await AsyncStorage.setItem('ConversationInfo', JSON.stringify(item));
      }
      setIsModal(false);
      navigation.navigate('Chat');
    } catch (error) {
      console.error('Respond save user error ', error);
    }
  };
  const handleBlockUser = async (userId: string) => {
    setShowBlockModal(true);
    setIsModal(false);
  };
  const actionBlockUser = async (userId: string, userFriendId: string) => {
    try {
      setIsLoading(true);
      const res = await userServices.updateBlockUser(userId, userFriendId);
      if (res) {
        console.log('Block successfully !!!', res.data);
        dispatch(addAuth({...friendData, block: res.data}));
        console.log('Sau khi cập nhật:', friendData.block);
      }
      setIsLoading(false);
      setShowBlockModal(false);
      console.log('auth', friendData.block);
    } catch (error) {
      console.log('handle block user fail: ', error);
      setIsLoading(false);
      setShowBlockModal(false);
    }
  };
  const renderItems = ({item, index}: any) => {
    return (
      <React.Fragment key={index}>
        <SpaceComponent height={14} />
        <CarUserComponent
          majoring={item.majoring ?? 'Chuyên ngành'}
          key={item.userId}
          img={item.avatar}
          name={UserInfo.getName(item.name)}
          isFind
          iconM
          styles={{borderWidth: 0}}
          onPressPersonal={() => onNavigationaProfile(item.userId)}
          onPressEllipsis={() => handleOpenModal(item)}
        />

        <ActionModal
          visible={isShowUnfriendModal}
          onPressNo={() => {
            closeModalAction();
          }}
          onPressYes={async () => await handleRemoveFriend(selectedUser.userId)}
          descriptions="Do you really want to remove this friend?"
          title={`Hủy kết bạn với ${UserInfo.getName(item.name)}`}
        />
      </React.Fragment>
    );
  };
  const actionUnFriend = async () => {
    openModalAction();
    handleCloseModal();
  };
  function closeModalAction() {
    setShowUnfriendModal(false);
  }
  function openModalAction() {
    setShowUnfriendModal(true);
  }
  // console.log(auth.block);

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: colors.background}]}>
      <FlatList
        data={memoUsers}
        renderItem={renderItems}
        scrollEventThrottle={16}
        style={{marginHorizontal: 6}}
        keyExtractor={(item: any) => item.userId}
      />

      <UserInfoModal
        isBlock={
          friendData &&
          friendData.block &&
          friendData.block.includes(selectedUser.userId)
        }
        visible={isModal}
        img={selectedUser.avatar}
        name={UserInfo.getName(selectedUser.name)}
        onClose={handleCloseModal}
        handleNavigation={async () => {
          await onNavigationMessage({...selectedUser, type: 'personal'});
        }}
        handleUnFriend={() => actionUnFriend()}
        handleBlockUser={async () => await handleBlockUser(selectedUser.userId)}
      />
      <LoadingModal visible={isLoading} />
      <ActionModal
        visible={isShowBlockdModal}
        onPressNo={() => setShowBlockModal(false)}
        onPressYes={async () =>
          await actionBlockUser(auth.userId, selectedUser.userId)
        }
        descriptions={`Do you really want to ${
          friendData.block && friendData.block.includes(selectedUser.userId)
            ? ' un'
            : ''
        }block this friend?`}
        title={`Bạn có thực sự muốn${
          friendData.block && friendData.block.includes(selectedUser.userId)
            ? ' bỏ'
            : ''
        } chặn ${UserInfo.getName(selectedUser.name)} không`}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
});

export default FriendsRespondScreen;

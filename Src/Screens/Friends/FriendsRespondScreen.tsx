import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, {useCallback, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {appColors} from '../../Theme/Colors/appColors';
import {authSelector} from '../../redux/reducers/authReducer';
import {
  addOneFriend,
  friendSelector,
  removeFriend,
  setBlock,
} from '../../redux/reducers/friendSlice';
import {themeSelector} from '../../redux/reducers/themeSlice';
import {CarUserComponent, SpaceComponent} from '../Components';
import ActionModal from '../Modal/ActionModal';
import LoadingModal from '../Modal/LoadingModal';
import UserInfoModal from '../Modal/UserInfoModal';
import {friendServices} from '../Services/friendService.';
import {messageServices} from '../Services/messageServices';
import {userServices} from '../Services/userService';
import {UserInfo} from '../Untils/UserInfo';

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
  const {t} = useTranslation();
  const navigation: any = useNavigation();
  const [isModal, setIsModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limitPage, setLimitPage] = useState(1);

  useFocusEffect(
    useCallback(() => {
      fetchUserFriends();
    }, []),
  );
  const handleRemoveFriend = async (userId: string) => {
    setShowUnfriendModal(false);
    const res = await friendServices.handleRemoveFriends(userId, auth.userId);
    if (res && res.data) {
      console.log('Delete friend successfully !!', res.data);
      setUsers(prev => prev.filter(item => item.userId !== res.data));
      const parseData = await UserInfo.getUserData();
      parseData.friend.friends = parseData.friend.friends.filter(
        (id: any) => id !== res.data,
      );
      await Promise.all([
        dispatch(removeFriend(res.data)),
        AsyncStorage.setItem('userData', JSON.stringify(parseData)),
      ]);
    }
    console.log('friendData.friend: ', friendData.friends);
  };

  const fetchUserFriends = useCallback(async () => {
    if (page > limitPage) {
      return;
    }

    const res = await userServices.getEquestFriendUsers(auth.userId, '', page);
    if (res && res.data && res.data.users) {
      setUsers(res.data.users);
      if (friendData.friends?.length !== res.data.users?.length) {
        const ids = res.data.users.map((user: any) => user.userId);
        const parseData = await UserInfo.getUserData();
        parseData.friend.friends = ids;
        await Promise.all([
          dispatch(addOneFriend(ids)),
          AsyncStorage.setItem('userData', JSON.stringify(parseData)),
        ]);
      }
      setLimitPage(res.data.totalPage);
      setPage(prevPage => prevPage + 1);
    }
  }, []);

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
    const res = await messageServices.checkConversation(
      auth.userId,
      item.userId,
    );
    res && console.log('res.data', res.data);

    if (res && res.data) {
      let conversationId = res.data;
      console.log(conversationId);
      
      await AsyncStorage.setItem(
        'ConversationInfo',
        JSON.stringify({...item, conversationId, type: 'personal'}),
      );
    } else {
      await AsyncStorage.setItem(
        'ConversationInfo',
        JSON.stringify({...item, type: 'personal'}),
      );
    }
    setIsModal(false);
    navigation.navigate('Chat');
  };
  const handleBlockUser = () => {
    setShowBlockModal(true);
    setIsModal(false);
  };
  const actionBlockUser = async (userId: string, userFriendId: string) => {
    setIsLoading(true);
    const res = await userServices.updateBlockUser(userId, userFriendId);
    if (res && res.data) {
      console.log('Block successfully !!!', res.data);
      const parsedData = await UserInfo.getUserData();
      parsedData.friend.block = res.data;
      await Promise.all([
        dispatch(setBlock(res.data)),
        AsyncStorage.setItem('userData', JSON.stringify(parsedData)),
      ]);
      console.log('Sau khi cập nhật:', friendData.block);
    }
    setIsLoading(false);
    setShowBlockModal(false);
  };
  const renderItems = useCallback(
    ({item, index}: any) => {
      return (
        <React.Fragment key={index}>
          <SpaceComponent height={18} />
          <CarUserComponent
            onPressImg={() =>
              navigation.navigate('PersonalScreen', {userId: item.userId})
            }
            majoring={item.majoring ?? t('majoring')}
            key={item.userId}
            img={item.avatar}
            name={item.name}
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
            onPressYes={async () =>
              await handleRemoveFriend(selectedUser.userId)
            }
            descriptions={t('remove_friend_confirmation')}
            title={`${t('unfriend')} ${selectedUser.name}`}
          />
        </React.Fragment>
      );
    },
    [users, isShowBlockdModal, isModal, isShowUnfriendModal],
  );
  const actionUnFriend = async () => {
    handleCloseModal();
    setTimeout(() => {
      openModalAction();
    }, 500);
  };
  function closeModalAction() {
    setShowUnfriendModal(false);
  }
  function openModalAction() {
    setShowUnfriendModal(true);
  }

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: colors.background}]}>
      <FlatList
        data={memoUsers}
        renderItem={renderItems}
        scrollEventThrottle={16}
        ListFooterComponent={() =>
          page < limitPage ? <ActivityIndicator size={22} /> : null
        }
        onEndReached={page <= limitPage ? fetchUserFriends : () => {}}
        style={{marginHorizontal: 6, flex: 1}}
        keyExtractor={(item: any) => item.userId}
      />
      <UserInfoModal
        isBlock={friendData.block?.includes(selectedUser.userId)}
        visible={isModal}
        img={selectedUser.avatar}
        name={selectedUser.name}
        onClose={handleCloseModal}
        handleNavigation={() => {
          onNavigationMessage({...selectedUser, type: 'personal'});
        }}
        handleUnFriend={() => actionUnFriend()}
        handleBlockUser={() => handleBlockUser()}
      />
      <LoadingModal visible={isLoading} />
      <ActionModal
        visible={isShowBlockdModal}
        onPressNo={() => setShowBlockModal(false)}
        onPressYes={async () =>
          await actionBlockUser(auth.userId, selectedUser.userId)
        }
        descriptions={
          friendData.block && friendData.block.includes(selectedUser.userId)
            ? t('unblock_friend')
            : t('block_friend')
        }
        title={
          friendData.block && friendData.block.includes(selectedUser.userId)
            ? t('confirm_unblock') + selectedUser.name
            : t('confirm_block') + selectedUser.name
        }
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

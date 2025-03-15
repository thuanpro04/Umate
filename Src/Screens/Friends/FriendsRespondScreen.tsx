import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, {useCallback, useMemo, useState} from 'react';
import {FlatList, SafeAreaView, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {appColors} from '../../Theme/Colors/appColors';
import {addAuth, authSelector} from '../../redux/reducers/authReducer';
import {
  addFriend,
  friendSelector,
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
import {useTranslation} from 'react-i18next';

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
    const res = await userServices.getEquestFriendUsers(auth.userId, '');
    if (res) {
      setUsers(res.data);
    }
    
  };

  const handleRemoveFriend = async (userId: string) => {
    console.log('userId', userId);

    const res = await friendServices.handleRemoveFriends(userId, auth.userId);
    //xử lí thêm xóa trong friend và update người friend người bị xóa
    if (res && res.data) {
      setIsModal(false);
      fetchUserFriends();
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
    if (res) {
      console.log('Block successfully !!!', res.data);
      dispatch(setBlock(res.data));
      console.log('Sau khi cập nhật:', friendData.block);
    }
    setIsLoading(false);
    setShowBlockModal(false);
    console.log('auth', friendData.block);
    
  };
  const renderItems = ({item, index}: any) => {
    return (
      <React.Fragment key={index}>
        <SpaceComponent height={14} />
        <CarUserComponent
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
          onPressYes={async () => await handleRemoveFriend(selectedUser.userId)}
          descriptions={t('remove_friend_confirmation')}
          title={`${t('unfriend')} ${item.name}`}
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
        name={selectedUser.name}
        onClose={handleCloseModal}
        handleNavigation={async () => {
          await onNavigationMessage({...selectedUser, type: 'personal'});
        }}
        handleUnFriend={() => actionUnFriend()}
        handleBlockUser={async () => await handleBlockUser()}
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

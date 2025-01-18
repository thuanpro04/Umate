import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, {useCallback, useMemo, useState} from 'react';
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {useSelector} from 'react-redux';
import {appColors} from '../../Theme/Colors/appColors';
import {authSelector} from '../../redux/reducers/authReducer';
import {CarUserComponent} from '../Components';
import UserInfoModal from '../Modal/UserInfoModal';
import {friendServices} from '../Services/friendService.';
import {userServices} from '../Services/userService';
import {UserInfo} from '../Untils/UserInfo';
import ActionModal from '../Modal/ActionModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {messageServices} from '../Services/messageServices';
import {Item} from 'react-native-paper/lib/typescript/components/List/List';

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
  const memoUsers = useMemo(() => users, [users]);
  const auth = useSelector(authSelector);
  const [isShowActionModal, setShowActionModal] = useState(false);
  const navigation = useNavigation();
  const [isModal, setIsModal] = useState(false);
  // Reload dữ liệu mỗi khi trang được focus
  useFocusEffect(
    useCallback(() => {
      fetchUserFriends();
    }, []),
  );

  const fetchUserFriends = async () => {
    try {
      const res = await userServices.getEquestFriendUsers(auth.userId, '');
      if (res) {
        setUsers(res);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleRemoveFriend = async (userId: string) => {
    try {
      const res = await friendServices.handleRemoveFriends(userId, auth.userId);
      //xử lí thêm xóa trong friend và update người friend người bị xóa
      setIsModal(false);
      fetchUserFriends();
    } catch (error) {
      console.log('handleRemoveFriends error', error);
    }
  };

  const handleCloseModal = () => {
    setIsModal(false);
    setSelectedUser(initialUser);
  };

  const handleOpenModal = (user: any) => {
    setIsModal(true);
    setSelectedUser(user);
  };
  const onNavigation = async (item: any) => {
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
      navigation.navigate('Chat');
    } catch (error) {
      console.error('Respond save user error ', error);
    }
  };
  const renderItems = ({item, index}: any) => {
    return (
      <React.Fragment key={index}>
        <CarUserComponent
          key={item.userId}
          img={item.avatar}
          name={UserInfo.getName(item.name)}
          isFind
          iconM
          styles={{borderWidth: 0}}
          onPressMessages={async () =>
            await onNavigation({...item, type: 'personal'})
          }
          onPressEllipsis={() => handleOpenModal(item)}
        />

        <ActionModal
          visible={isShowActionModal}
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
    setShowActionModal(false);
  }
  function openModalAction() {
    setShowActionModal(true);
    console.log(isShowActionModal);
  }
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={memoUsers}
        renderItem={renderItems}
        scrollEventThrottle={16}
        keyExtractor={(item: any) => item.userId}
      />

      <UserInfoModal
        visible={isModal}
        img={selectedUser.avatar}
        name={UserInfo.getName(selectedUser.name)}
        onClose={handleCloseModal}
        handleNavigation={() => navigation.navigation('Message')}
        handleUnFriend={() => actionUnFriend()}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: appColors.background,
    flex: 1,
    paddingHorizontal: 10,
  },
});

export default FriendsRespondScreen;

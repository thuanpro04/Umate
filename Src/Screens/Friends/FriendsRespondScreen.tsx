import {useFocusEffect} from '@react-navigation/native';
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

const initialUser = {
  avatar: '',
  email: '',
  friendRequests: [],
  friends: [],
  name: '',
  userID: '',
};

const FriendsRespondScreen = ({navigation}: any) => {
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState(initialUser);
  const memoUsers = useMemo(() => users, [users]);
  const auth = useSelector(authSelector);
  const [isModal, setIsModal] = useState(false);
  // Reload dữ liệu mỗi khi trang được focus
  useFocusEffect(
    useCallback(() => {
      fetchUserFriends();
    }, []),
  );

  const fetchUserFriends = async () => {
    const url = `/get-all?currentUserID=${auth.userID}`;
    try {
      const res = await userServices.getEquestFriendUsers(auth.userID, '');
      if (res) {
        setUsers(res);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleRemoveFriend = async (userID: string) => {
    try {
      const res = await friendServices.handleRemoveFriends(userID, auth.userID);
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
  const renderItems = ({item, index}: any) => {
    return (
      <CarUserComponent
        key={item.userID}
        img={item.avatar}
        name={UserInfo.getName(item.name)}
        isFind
        iconM
        styles={{borderWidth: 0}}
        onPressMessages={() =>
          navigation.navigate('Chat', {
            currentUserID: auth.userID,
            userID: item.userID,
            userName: item.name,
            avatar: item.avatar,
          })
        }
        onPressEllipsis={() => handleOpenModal(item)}
      />
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={memoUsers}
        renderItem={renderItems}
        scrollEventThrottle={16}
      />

      <UserInfoModal
        visible={isModal}
        img={selectedUser.avatar}
        name={UserInfo.getName(selectedUser.name)}
        onClose={handleCloseModal}
        handleNavigation={() => navigation.navigation('Message')}
        handleUnFriend={async () =>
          await handleRemoveFriend(selectedUser.userID)
        }
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

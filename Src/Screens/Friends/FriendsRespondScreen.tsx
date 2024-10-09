import {View, ScrollView, StyleSheet} from 'react-native';
import React, {useCallback, useRef, useState} from 'react';
import {CarUserComponent} from '../Components';
import {appColors} from '../../Theme/Colors/appColors';
import {authSelector} from '../../redux/reducers/authReducer';
import {useSelector} from 'react-redux';
import {UserInfo} from '../Untils/UserInfo';
import {useFocusEffect} from '@react-navigation/native';
import UserInfoModal from '../Modal/UserInfoModal';
import {Modalize} from 'react-native-modalize';
import {Users} from '../Services/friendService.';
import {userServices} from '../Services/userService';

const initialUser = {
  avatar: '',
  email: '',
  friendRequests: [],
  friends: [],
  name: '',
  userID: '',
};

const FriendsRespondScreen = ({navigate}: any) => {
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState(initialUser);
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
      const res = await Users.getUsers(url);
      if (res) {
        setUsers(res);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleRemoveFriend = async (userID: string) => {
    try {
      const res = await userServices.handleRemoveFriends(userID, auth.userID);
      //xử lí thêm xóa trong friend và update người friend người bị xóa
      console.log(res);

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

  console.log(isModal);

  return (
    <View style={styles.container}>
      <ScrollView scrollEventThrottle={16}>
        {users.map(item => (
          <CarUserComponent
            key={item.userID}
            img={item.avatar}
            name={UserInfo.getName(item.name)}
            isFind
            styles={{borderWidth: 0}}
            onPressEllipsis={() => handleOpenModal(item)}
          />
        ))}
      </ScrollView>
      
      <UserInfoModal
        visible={isModal}
        img={selectedUser.avatar}
        name={UserInfo.getName(selectedUser.name)}
        onClose={handleCloseModal}
        handleNavigation={() => navigate.navigate('Message')}
        handleUnFriend={async () =>
          await handleRemoveFriend(selectedUser.userID)
        }
      />
    </View>
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

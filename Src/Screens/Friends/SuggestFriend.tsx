import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useState} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import usersAPI from '../../apis/usersApi';
import {authSelector} from '../../redux/reducers/authReducer';
import {appColors} from '../../Theme/Colors/appColors';
import {
  CarUserComponent,
  ContainerComponent,
  TextComponent,
} from '../Components';
import {friendServices} from '../Services/friendService.';
import {userServices} from '../Services/userService';

const SuggestFriend = React.memo(() => {
  const [showTabBar, setshowTabBar] = useState(false);
  const [users, setUsers] = useState<any[]>();
  const [message, setMessage] = useState('');
  const [buttonVisibility, setButtonVisibility] = useState<{
    [key: string]: boolean;
  }>({});
  const [listRemove, setlistRemove] = useState<String[]>([]);

  const auth = useSelector(authSelector);
  useFocusEffect(
    useCallback(() => {
      getUsers();
    }, []),
  );

  const handleScroll: any = (event: any) => {
    const currenOffset = event.nativeEvent.contentOffset.y;
    currenOffset > 50 ? setshowTabBar(false) : setshowTabBar(true);
  };
  console.log(users);

  const handlePressYes = (userID: string) => {
    setButtonVisibility(prevState => ({
      ...prevState,
      [userID]: true, // Show button for this specific user
    }));
  };

  const handlePressCancel = (userID: string) => {
    setButtonVisibility(prevState => ({
      ...prevState,
      [userID]: false, // Hide button for this specific user
    }));
  };
  // Chưa xử lí

  const getUsers = async () => {
    const url = `/get-all?currentUserID=${auth.userID}&filter=suggestfriend`;
    try {
      //console.log('res.data', res.data);
      const allUsers = await userServices.getUsers(url);
      if (allUsers) {
        setUsers(allUsers);
        allUsers.forEach((item: any) => {
          if (item.friendRequests.includes(auth.userID)) {
            handlePressYes(item.userID);
          }
        });
      } else {
        setMessage('No users found');
      }
    } catch (error) {
      console.log('Get users api:', error);
    }
  };

  const handleFriendAction = async (
    friendUserID: string,
    action: 'add' | 'cancel',
  ) => {
    const enpoint = action === 'add' ? '/add-friend' : '/cancel-friend';
    const currentUserID = auth.userID;
    const data = {friendUserID, currentUserID};

    try {
      const res = await usersAPI.handleUsers(enpoint, data, 'post');
      console.log(res);
    } catch (error) {
      console.log('handleFriendAction', error);
    }
  };
  const handlePressRemove = async (usersID: string) => {
    try {
      const res = await friendServices.handlePressRemoveSuggested(
        usersID,
        auth.userID,
      );
      console.log(res);
      getUsers();
    } catch (error) {
      console.log('handlePressRemove error', error);
    }
  };

  const handleAddFriends = async (friendUserID: string) => {
    handleFriendAction(friendUserID, 'add');
  };

  const handleCancelFriend = async (friendUserID: string) => {
    handleFriendAction(friendUserID, 'cancel');
  };

  return !message && users ? (
    <ScrollView
      style={styles.container}
      onScroll={handleScroll}
      scrollEventThrottle={16}>
      {users &&
        users.map((item, index): any => (
          <CarUserComponent
            key={item.userID}
            img={item.avatar}
            name={item.name}
            sayYes="Add Friend"
            sayNo="Remove"
            isShowBtn={buttonVisibility[item.userID]}
            onPressYes={async () => {
              handlePressYes(item.userID);
              await handleAddFriends(item.userID);
            }}
            onPressCancel={() => {
              handlePressCancel(item.userID);
              handleCancelFriend(item.userID);
            }}
            onPressNo={() => handlePressRemove(item.userID)}
          />
        ))}
    </ScrollView>
  ) : (
    <ContainerComponent
      styles={[
        styles.container,
        {justifyContent: 'center', alignItems: 'center'},
      ]}>
      <TextComponent label={message} />
    </ContainerComponent>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: appColors.background,
    flex: 1,
    paddingHorizontal: 10,
  },
});

export default SuggestFriend;

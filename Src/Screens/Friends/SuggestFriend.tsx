import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useMemo, useState} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import {authSelector} from '../../redux/reducers/authReducer';
import {appColors} from '../../Theme/Colors/appColors';
import {CarUserComponent, TextComponent} from '../Components';

import {debounce} from 'lodash';
import {FlatList} from 'react-native';
import {friendServices} from '../Services/friendService.';
import {userServices} from '../Services/userService';
import {themeSelector} from '../../redux/reducers/themeSlice';

const SuggestFriend = React.memo(() => {
  const [showTabBar, setshowTabBar] = useState(false);
  const [users, setUsers] = useState<any[]>();
  const [message, setMessage] = useState('');
  const [buttonVisibility, setButtonVisibility] = useState<{
    [key: string]: boolean;
  }>({});
  const memoUsers = useMemo(() => users, [users]);
  const auth = useSelector(authSelector);
  const theme: 'light' | 'dark' = useSelector(themeSelector);
  const colors = appColors[theme ?? 'light'];
  useFocusEffect(
    useCallback(() => {
      getUsers();
    }, []),
  );

  const handleScroll: any = (event: any) => {
    const currenOffset = event.nativeEvent.contentOffset.y;
    currenOffset > 50 ? setshowTabBar(false) : setshowTabBar(true);
  };

  const handlePressYes = (userId: string) => {
    setButtonVisibility(prevState => ({
      ...prevState,
      [userId]: true, // Show button for this specific user
    }));
  };

  const handlePressCancel = (userId: string) => {
    setButtonVisibility(prevState => ({
      ...prevState,
      [userId]: false, // Hide button for this specific user
    }));
  };
  // Chưa xử lí

  const getUsers = async () => {
    const res = await userServices.getEquestFriendUsers(
      auth.userId,
      'suggestfriend',
    );
    const allUsers = res && res.data;
    if (allUsers) {
      setUsers(allUsers);
      allUsers.forEach((item: any) => {
        if (item.friendRequests.includes(auth.userId)) {
          handlePressYes(item.userId);
        }
      });
    } else {
      setMessage('No users found');
    }
    
  };

  const handleFriendAction = async (
    friendUserId: string,
    action: 'add' | 'cancel',
  ) => {
    const res = await friendServices.handleFriendActionAdd_Cancel(
      friendUserId,
      action,
      auth.userId,
    );
    if (res && res.data) {
      console.log(res?.data);
    }
  };

  const handlePressRemove = debounce(async (userId: string) => {
    const res = await friendServices.handlePressRemoveSuggested(
      userId,
      auth.userId,
    );
    if (res && res.data) {
      getUsers();
    }
  }, 1000);
  const debounceAddFriend = debounce(async (friendUserId: string) => {
    handleFriendAction(friendUserId, 'add');
  }, 1000);

  const handleCancelFriend = debounce(async (friendUserId: string) => {
    handleFriendAction(friendUserId, 'cancel');
  }, 1000);

  const renderItems = ({item, index}: any) => {
    return (
      <CarUserComponent
        iconAddCancel={false}
        key={item.userId}
        img={item.avatar}
        name={item.name}
        sayYes="Add Friend"
        sayNo="Remove"
        isShowBtn={buttonVisibility[item.userId]}
        onPressYes={async () => {
          handlePressYes(item.userId);
          await debounceAddFriend(item.userId);
        }}
        onPressCancel={() => {
          handlePressCancel(item.userId);
          handleCancelFriend(item.userId);
        }}
        onPressNo={() => handlePressRemove(item.userId)}
      />
    );
  };
  return !message && users ? (
    <SafeAreaView
      style={[styles.container, {backgroundColor: colors.background}]}>
      <FlatList
        data={memoUsers}
        keyExtractor={(item: any) => item.userId}
        renderItem={renderItems}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />
    </SafeAreaView>
  ) : (
    <SafeAreaView
      style={[
        styles.container,
        {justifyContent: 'center', alignItems: 'center'},
      ]}>
      <TextComponent label={message} />
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
});

export default SuggestFriend;

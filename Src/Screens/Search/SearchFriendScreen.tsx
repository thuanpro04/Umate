import {
  FlatList,
  KeyboardAvoidingView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {InputComponent, SpaceComponent} from '../Components';
import {SearchFavorite} from 'iconsax-react-native';
import {appInfo} from '../../Theme/appInfo';
import {appColors} from '../../Theme/Colors/appColors';
import {globalStyles} from '../../Styles/globalStyle';
import {UserInfo} from '../Untils/UserInfo';
import {useAsyncStorage} from '@react-native-async-storage/async-storage';
import {userServices} from '../Services/userService';
import CarUserComponent from '../Friends/Components/CarUserComponent';
import {useRoute} from '@react-navigation/native';
import {debounce} from 'lodash';
import {useSelector} from 'react-redux';
import {authSelector} from '../../redux/reducers/authReducer';
import {friendServices} from '../Services/friendService.';
import {friendSelector} from '../../redux/reducers/friendSlice';
import {themeSelector} from '../../redux/reducers/themeSlice';

const SearchFriendScreen = ({navigation}: any) => {
  const [text, setText] = useState('');
  const [converInfo, setConverInfo] = useState<any>('');
  const {getItem} = useAsyncStorage('ConversationInfo');
  const {users} = useRoute().params as {users: any[]};
  const [userInfo, setUserInfo] = useState<any[]>(users);
  const auth = useSelector(authSelector);
  const [addedFriends, setAddedFriends] = useState<string[]>([]);
  const theme: 'light' | 'dark' = useSelector(themeSelector);
  const colors = appColors[theme ?? 'light'];
  const friendData = useSelector(friendSelector);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const info = await UserInfo.getConversationInfo(getItem);
        setConverInfo(info); // Cập nhật thông tin hội thoại
      } catch (error) {
        console.error('Error fetching conversation info:', error);
      }
    };
    fetchData();
  }, []);
  // useEffect(() => {
  //   if (converInfo) {
  //     fetUserInfos();
  //   }
  //   //  scrollViewToEnd()
  // }, [converInfo]);
  // const fetUserInfos = async () => {
  //   try {
  //     const listUserId = converInfo.invitedUsers.map(
  //       (item: any) => item.userId,
  //     );
  //     const res = await userServices.getListUserInfo(listUserId);
  //     if (res && res.data) {
  //       setUserInfo(res.data);
  //     }
  //   } catch (error) {
  //     console.error('fetch use info in search friend fail: ', error);
  //   }
  // };
  const searchByNameInGroup = (value: string) => {
    if (users) {
      const result = users.filter(
        item => item.name.toLowerCase().includes(value.toLowerCase().trim()), // ✅
      );
      setUserInfo(result);
      // console.log(result, 12344);
    }
  };
  const handleAddFriend = async (friendUserId: string) => {
    try {
      const res = await friendServices.handleFriendActionAdd_Cancel(
        friendUserId,
        'add',
        auth.userId,
      );
      setAddedFriends(prev => [...prev, friendUserId]);
    } catch (error) {
      console.log('handleFriendAction', error);
    }
  };
  const debounceSearchFriends = debounce(searchByNameInGroup, 300);
  useEffect(() => {
    debounceSearchFriends(text);
    return () => {
      debounceSearchFriends.cancel();
    };
  }, [text]);
  const shouldShowAddFriendIcon = (userId: string) => {
    return (
      !friendData.friends.includes(userId) &&
      auth.userId !== userId &&
      !addedFriends.includes(userId)
    );
  };
  const onPressCarUser = (userId: any) => {
    navigation.navigate('PersonalScreen', {
      userId,
    });
  };

  const renderItemUsers = ({item, index}: any) => {
    return item.userId !== auth.userId ? (
      <CarUserComponent
        key={index}
        authori={item.majoring ?? 'chuyên ngành ?'}
        addFriend={
          !item.friendRequests.includes(auth.userId) &&
          shouldShowAddFriendIcon(item.userId)
        }
        onPress={() => onPressCarUser(item.userId)}
        onPressAdd={() => handleAddFriend(item.userId)}
        url={item.avatar}
        userName={UserInfo.getName(item.name)}
      />
    ) : (
      <></>
    );
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, {backgroundColor: colors.background}]}>
      <SpaceComponent height={12} />
      <InputComponent
        value={text}
        onChange={setText}
        allowClear
        placehold="search friend...."
        affix={
          <SearchFavorite size={appInfo.sizeIcon} color={appColors.blue} />
        }
        styles={{borderRadius: 20, paddingVertical: 4}}
      />
      <SpaceComponent height={22}/>
      {userInfo && (
        <FlatList
          data={userInfo}
          keyExtractor={item => item.userId}
          renderItem={renderItemUsers}
        />
      )}
    </KeyboardAvoidingView>
  );
};

export default SearchFriendScreen;

const styles = StyleSheet.create({
  container: {
    marginTop: StatusBar.currentHeight,
    alignItems: 'center',
    flex: 1,
    paddingHorizontal:12
  },
});

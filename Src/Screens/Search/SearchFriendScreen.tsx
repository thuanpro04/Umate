import {
  FlatList,
  KeyboardAvoidingView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {InputComponent, RowComponent, SpaceComponent} from '../Components';
import {ArrowLeft2, SearchFavorite} from 'iconsax-react-native';
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
import {useTranslation} from 'react-i18next';

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
  const {t} = useTranslation();

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
    const res = await friendServices.handleFriendActionAdd_Cancel(
      friendUserId,
      'add',
      auth.userId,
    );
    if (res && res.data) {
      setAddedFriends(prev => [...prev, friendUserId]);
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
        userId={item.userId}
        key={index}
        authori={item.majoring ?? t('majoring')}
        addFriend={
          !item.friendRequests.includes(auth.userId) &&
          shouldShowAddFriendIcon(item.userId)
        }
        onPress={() => onPressCarUser(item.userId)}
        onPressAdd={() => handleAddFriend(item.userId)}
        url={item.avatar}
        userName={item.name}
      />
    ) : (
      <></>
    );
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, {backgroundColor: colors.background}]}>
      <SpaceComponent height={12} />

      <RowComponent>
        <ArrowLeft2
          size={appInfo.sizeIconBold}
          color={colors.icon}
          onPress={() => navigation.goBack()}
        />
        <InputComponent
          value={text}
          onChange={setText}
          allowClear
          placehold={t('search_friend')}
          affix={
            <SearchFavorite size={appInfo.sizeIcon} color={appColors.blue} />
          }
          styles={{borderRadius: 20, paddingVertical: 4, flex: 1}}
        />
      </RowComponent>
      <SpaceComponent height={22} />
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
    paddingHorizontal: 12,
  },
});

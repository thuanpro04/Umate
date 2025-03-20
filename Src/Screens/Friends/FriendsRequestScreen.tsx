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
import {authSelector} from '../../redux/reducers/authReducer';
import {friendSelector, setFriend} from '../../redux/reducers/friendSlice';
import {themeSelector} from '../../redux/reducers/themeSlice';
import {appColors} from '../../Theme/Colors/appColors';
import {CarUserComponent} from '../Components';
import {friendServices} from '../Services/friendService.';
import {userServices} from '../Services/userService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {UserInfo} from '../Untils/UserInfo';

const FriendsRequestScreen = () => {
  const [users, setUsers] = useState<any[]>();
  const memoUser = useMemo(() => users, [users]);
  const auth = useSelector(authSelector);
  const theme: 'light' | 'dark' = useSelector(themeSelector);
  const colors = appColors[theme ?? 'light'];
  const [page, setPage] = useState(1);
  const [limitPage, setLimitPage] = useState(1);
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const friendData = useSelector(friendSelector);
  const {t} = useTranslation();
  const getUsers = async () => {
    const res = await userServices.getEquestFriendUsers(
      auth.userId,
      'requests',
      page,
    );
    if (res && res.data) {
      setUsers(res.data.users);
      setLimitPage(res.data.totalPage);
      setPage(prevPage => prevPage + 1);
    }
  };

  const handleAgreeFriend = async (friendUserId: string) => {
    const res = await friendServices.handleAgreeFriendShip(
      auth.userId,
      friendUserId,
    );
    if (res && res.data) {
      console.log('Agree friend successfully !!!', res.data);
      // const [userData] = await Promise.all([AsyncStorage.getItem('userData')]);
      const user = users?.filter(item => item !== res.data);
      setUsers(user);
      const parseData = await UserInfo.getUserData();
      parseData.friend.friends.push(res.data);
      await Promise.all([
        dispatch(setFriend(res.data)),
        AsyncStorage.setItem('userData', JSON.stringify(parseData)),
      ]);

      console.log('Sau khi cập nhật:', friendData.friends);
    }
  };

  const handleRemoveFriend = async (userId: string) => {
    const res = await friendServices.handlePressRemoveRequest(
      userId,
      auth.userId,
    );
    if (res && res.data) {
      console.log('Bạn đã từ chối: ', res.data);
      const user = users?.filter(item => item !== res.data);
      setUsers(user);
    }
  };
  useFocusEffect(
    useCallback(() => {
      getUsers();
    }, []),
  );
  const renderItems = useCallback(
    ({item, index}: any) => {
      return (
        <CarUserComponent
          onPressImg={() =>
            navigation.navigate('PersonalScreen', {userId: item.userId})
          }
          img={item.avatar}
          name={item.name}
          sayYes={t('agree')}
          sayNo={t('refuse')}
          key={index}
          onPressYes={() => handleAgreeFriend(item.userId)}
          onPressNo={() => handleRemoveFriend(item.userId)}
        />
      );
    },
    [users],
  );
  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: colors.background}]}>
      {memoUser && (
        <FlatList
          data={memoUser}
          keyExtractor={(item: any) => item.userId}
          renderItem={renderItems}
          style={styles.container}
          scrollEventThrottle={16}
          ListFooterComponent={() =>
            page <= limitPage ? <ActivityIndicator size={22} /> : <></>
          }
          onEndReached={page <= limitPage ? getUsers : () => {}}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
});

export default FriendsRequestScreen;

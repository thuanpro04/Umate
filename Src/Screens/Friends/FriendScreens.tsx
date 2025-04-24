import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import {ArrowLeft} from 'iconsax-react-native';
import {MoreVerticalIcon} from 'lucide-react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {MenuChat} from '../../data/MenuItems';
import {authSelector} from '../../redux/reducers/authReducer';
import {
  friendSelector,
  removeFriend,
  setBlock,
} from '../../redux/reducers/friendSlice';
import {themeSelector} from '../../redux/reducers/themeSlice';
import {globalStyles} from '../../Styles/globalStyle';
import {appInfo} from '../../Theme/appInfo';
import {appColors} from '../../Theme/Colors/appColors';
import {HeaderComponent} from '../Components';
import ActionModal from '../Modal/ActionModal';
import LoadingModal from '../Modal/LoadingModal';
import {friendServices} from '../Services/friendService.';
import {userServices} from '../Services/userService';
import {UserInfo} from '../Untils/UserInfo';
import CarUserComponent from './Components/CarUserComponent';

const FriendScreens = ({navigation}: any) => {
  const [data, setData] = useState<any[]>([]);
  const [isShowUnfriendModal, setShowUnfriendModal] = useState(false);
  const [isShowBlockModal, setShowBlockModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limitPage, setLimitPage] = useState(1);
  const [selectUser, setSelectUser] = useState<any>('');
  const theme: 'light' | 'dark' = useSelector(themeSelector);
  const colors = appColors[theme ?? 'light'];
  const auth = useSelector(authSelector);
  const friendData = useSelector(friendSelector);
  const {t} = useTranslation();

  const dispatch = useDispatch();
  const handleGetAllUserInfo = async () => {
    if (page > limitPage) {
      return;
    }
    const res = await userServices.getEquestFriendUsers(auth.userId, '', page);
    if (res && res.data) {
      setData(res.data.users);
      setLimitPage(res.data.totalPage);
      setPage(prevPage => prevPage + 1);
    }
  };

  useFocusEffect(
    useCallback(() => {
      handleGetAllUserInfo();
    }, []),
  );
  function closeModalAction() {
    setShowUnfriendModal(false);
  }
  const handleRemoveFriend = async (userId: string) => {
    setIsLoading(true);
    setShowUnfriendModal(false);
    const res = await friendServices.handleRemoveFriends(userId, auth.userId);
    // xử lí hàm trả về data là user khỏi phải request lại
    if (res && res.data) {
      setData(prev => prev.filter(item => item.userId !== res.data));
      const parseData = await UserInfo.getUserData();
      parseData.friend.friends = parseData.friend.friends.filter(
        (id: any) => id !== res.data,
      );
      await Promise.all([
        dispatch(removeFriend(res.data)),
        AsyncStorage.setItem('userData', JSON.stringify(parseData)),
      ]);
      console.log('friendData.friend: ', friendData.friends);
    }
    setIsLoading(false);
  };

  const handleBlockUser = async (user: any) => {
    setShowBlockModal(true);
    setSelectUser(user);
  };
  const actionBlockUser = async (userId: string, userFriendId: string) => {
    setIsLoading(true);
    setShowBlockModal(false);
    const res = await userServices.updateBlockUser(userId, userFriendId);
    if (res && res.data) {
      console.log('Block successfully !!!', res.data);
      // Lấy dữ liệu và cập nhật song song
      const parsedData = await UserInfo.getUserData();
      parsedData.friend.block = res.data;
      await Promise.all([
        AsyncStorage.setItem('userData', JSON.stringify(parsedData)),
        dispatch(setBlock(res.data)),
      ]);
      console.log('Sau khi cập nhật:', friendData.block);
    }
    setIsLoading(false);
  };
  const getIsBlock = (userId: string) => {
    return friendData.block?.includes(userId);
  };
  useEffect(() => {
    console.log('Redux state block đã cập nhật:', friendData.block);
  }, [friendData.block]);
  const renderItem = useCallback(
    ({item, index}: any) => {
      return (
        <React.Fragment key={item.userId}>
          <CarUserComponent
            onPress={() =>
              navigation.navigate('PersonalScreen', {userId: item.userId})
            }
            menuData={MenuChat(colors).attributeUser}
            onPressUnFriend={() => {
              setShowUnfriendModal(true);
              setSelectUser(item);
            }}
            userId={item.userId}
            icon={<MoreVerticalIcon size={22} color={colors.icon} />}
            authori={item.majoring ?? t('majoring')}
            userName={item.name}
            url={item.avatar}
            onPressMore={() => console.log('Hello')}
            navigation={navigation}
            onPressBlock={() => handleBlockUser(item)}
            isBlock={getIsBlock(item.userId)}
          />
          <ActionModal
            visible={isShowUnfriendModal}
            onPressNo={() => {
              closeModalAction();
            }}
            onPressYes={() => handleRemoveFriend(selectUser.userId)}
            descriptions={t('remove_friend_confirmation')}
            title={`${t('unfriend ')}${selectUser.name}`}
          />
          <ActionModal
            visible={isShowBlockModal}
            onPressNo={() => setShowBlockModal(false)}
            onPressYes={() => actionBlockUser(auth.userId, selectUser.userId)}
            descriptions={
              getIsBlock(selectUser.userId)
                ? t('unblock_friend')
                : t('block_friend')
            }
            title={
              getIsBlock(selectUser.userId)
                ? t('confirm_unblock') + selectUser.name
                : t('confirm_block') + selectUser.name
            }
          />
        </React.Fragment>
      );
    },
    [setData, isShowBlockModal, isShowUnfriendModal],
  );
  return (
    <SafeAreaView
      style={[globalStyles.container, {backgroundColor: colors.background}]}>
      <HeaderComponent
        title={t('manage_friends')}
        iconLeft={<ArrowLeft size={appInfo.sizeIconBold} color={colors.icon} />}
      />
      <FlatList
        data={data}
        style={{flex: 1, marginHorizontal: 18}}
        keyExtractor={item => item.userId}
        renderItem={renderItem}
        extraData={data}
        ListFooterComponent={() =>
          page < limitPage ? <ActivityIndicator size={22} /> : null
        }
        onEndReached={page <= limitPage ? handleGetAllUserInfo : () => {}}
      />
      <LoadingModal visible={isLoading} />
    </SafeAreaView>
  );
};

export default FriendScreens;

const styles = StyleSheet.create({
  container: {},
});

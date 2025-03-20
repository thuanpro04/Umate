import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {ArrowLeft} from 'iconsax-react-native';
import {MoreVerticalIcon} from 'lucide-react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {FlatList, SafeAreaView, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  addFriend,
  friendSelector,
  setBlock,
} from '../../redux/reducers/friendSlice';
import {themeSelector} from '../../redux/reducers/themeSlice';
import {globalStyles} from '../../Styles/globalStyle';
import {appInfo} from '../../Theme/appInfo';
import {appColors} from '../../Theme/Colors/appColors';
import {HeaderComponent} from '../Components';
import {userServices} from '../Services/userService';
import CarUserComponent from './Components/CarUserComponent';
import ActionModal from '../Modal/ActionModal';
import {UserInfo} from '../Untils/UserInfo';
import {friendServices} from '../Services/friendService.';
import {authSelector} from '../../redux/reducers/authReducer';
import {MenuChat} from '../../data/MenuItems';
import {useTranslation} from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingModal from '../Modal/LoadingModal';

const FriendScreens = ({navigation}: any) => {
  const [data, setData] = useState<any[]>([]);
  const [isShowUnfriendModal, setShowUnfriendModal] = useState(false);
  const [isShowBlockModal, setShowBlockModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const theme: 'light' | 'dark' = useSelector(themeSelector);
  const colors = appColors[theme ?? 'light'];
  const user = useSelector(friendSelector);
  const auth = useSelector(authSelector);
  const friendData = useSelector(friendSelector);
  const {t} = useTranslation();

  const dispatch = useDispatch();
  const handleGetAllUserInfo = async () => {
    if (user.friends.length === 0) {
      return;
    }
    const res = await userServices.getListUserInfo(user.friends);
    if (res && res.data) {
      setData(res.data);
    }
  };

  useFocusEffect(
    useCallback(() => {
      handleGetAllUserInfo();
    }, [data]),
  );
  function closeModalAction() {
    setShowUnfriendModal(false);
  }
  const handleRemoveFriend = async (userId: string) => {
    setIsLoading(true);
    const res = await friendServices.handleRemoveFriends(userId, auth.userId);
    // xử lí hàm trả về data là user khỏi phải request lại
    if (res && res.data) {
      const user = data.filter(item => item.userId !== res.data);
      setData(user);
    }
    setIsLoading(false);
  };
  const handleBlockUser = async () => {
    setShowBlockModal(true);
  };
  const actionBlockUser = async (userId: string, userFriendId: string) => {
    setIsLoading(true);

    const res = await userServices.updateBlockUser(userId, userFriendId);
    if (res) {
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
    setShowBlockModal(false);
    setIsLoading(false)

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
            }}
            userId={item.userId}
            icon={<MoreVerticalIcon size={22} color={colors.icon} />}
            authori={item.majoring ?? t('majoring')}
            userName={item.name}
            url={item.avatar}
            onPressMore={() => {}}
            navigation={navigation}
            onPressBlock={handleBlockUser}
            isBlock={friendData.block && friendData.block.includes(item.userId)}
          />
          <ActionModal
            visible={isShowUnfriendModal}
            onPressNo={() => {
              closeModalAction();
            }}
            onPressYes={async () => await handleRemoveFriend(item.userId)}
            descriptions={t('remove_friend_confirmation')}
            title={`${t('unfriend ')}${item.name}`}
          />
          <ActionModal
            visible={isShowBlockModal}
            onPressNo={() => setShowBlockModal(false)}
            onPressYes={async () =>
              await actionBlockUser(auth.userId, item.userId)
            }
            descriptions={
              friendData.block && friendData.block.includes(item.userId)
                ? t('unblock_friend')
                : t('block_friend')
            }
            title={
              friendData.block && friendData.block.includes(item.userId)
                ? t('confirm_unblock') + item.name
                : t('confirm_block') + item.name
            }
          />
        </React.Fragment>
      );
    },
    [
      setData,
      setShowUnfriendModal,
      isShowUnfriendModal,
      isShowBlockModal,
      setShowBlockModal,
    ],
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
      />
      <LoadingModal visible={isLoading} />
    </SafeAreaView>
  );
};

export default FriendScreens;

const styles = StyleSheet.create({
  container: {},
});

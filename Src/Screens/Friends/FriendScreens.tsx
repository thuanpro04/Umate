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

const FriendScreens = ({navigation}: any) => {
  const [data, setData] = useState<any[]>([]);
  const [isShowUnfriendModal, setShowUnfriendModal] = useState(false);
  const [isShowBlockModal, setShowBlockModal] = useState(false);
  const theme: 'light' | 'dark' = useSelector(themeSelector);
  const colors = appColors[theme ?? 'light'];
  const user = useSelector(friendSelector);
  const auth = useSelector(authSelector);
  const friendData = useSelector(friendSelector);

  const dispatch = useDispatch();
  const handleGetAllUserInfo = async () => {
    try {
      const res = await userServices.getListUserInfo(user.friends);
      if (res && res.data) {
        setData(res.data);
      }
    } catch (error) {
      console.log('Friend get all user fail: ', error);
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
    try {
      const res = await friendServices.handleRemoveFriends(userId, auth.userId);
      // xử lí hàm trả về data là user khỏi phải request lại
      if (res) {
        handleGetAllUserInfo();
      }
    } catch (error) {
      console.log('handleRemoveFriends error', error);
    }
  };
  const handleBlockUser = async () => {
    setShowBlockModal(true);
  };
  const actionBlockUser = async (userId: string, userFriendId: string) => {
    try {
      const res = await userServices.updateBlockUser(userId, userFriendId);
      if (res) {
        console.log('Block successfully !!!', res.data);
        dispatch(setBlock(res.data));
        console.log('Sau khi cập nhật:', friendData.block);
      }
      setShowBlockModal(false);
    } catch (error) {
      console.log('handle block user fail: ', error);
      setShowBlockModal(false);
    }
  };

  useEffect(() => {
    console.log('Redux state block đã cập nhật:', friendData.block);
  }, [friendData.block]);
  const renderItem = useCallback(
    ({item, index}: any) => {
      return (
        <React.Fragment key={item.userId}>
          <CarUserComponent
            onPressUnFriend={() => {
              setShowUnfriendModal(true);
            }}
            userId={item.userId}
            icon={<MoreVerticalIcon size={22} color={colors.icon} />}
            authori={item.majoring ?? 'chuyên ngành'}
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
            descriptions="Do you really want to remove this friend?"
            title={`Hủy kết bạn với ${UserInfo.getName(item.name)}`}
          />
          <ActionModal
            visible={isShowBlockModal}
            onPressNo={() => setShowBlockModal(false)}
            onPressYes={async () =>
              await actionBlockUser(auth.userId, item.userId)
            }
            descriptions={`Do you really want to ${
              friendData.block && friendData.block.includes(item.userId)
                ? ' un'
                : ''
            }block this friend?`}
            title={`Bạn có thực sự muốn${
              friendData.block && friendData.block.includes(item.userId)
                ? ' bỏ'
                : ''
            } chặn ${UserInfo.getName(item.name)} không`}
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
        title="Quản lí bạn bè"
        iconLeft={<ArrowLeft size={appInfo.sizeIconBold} color={colors.icon} />}
      />
      <FlatList
        data={data}
        style={{flex: 1, marginHorizontal: 12}}
        keyExtractor={item => item.userId}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
};

export default FriendScreens;

const styles = StyleSheet.create({
  container: {},
});

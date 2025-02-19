import {
  FlatList,
  KeyboardAvoidingView,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {
  HeaderComponent,
  RowComponent,
  SpaceComponent,
  TextComponent,
} from '../../Components';
import {globalStyles} from '../../../Styles/globalStyle';
import {
  ArrowLeft,
  ArrowLeft2,
  SearchFavorite1,
  UserAdd,
} from 'iconsax-react-native';
import {appInfo} from '../../../Theme/appInfo';
import {appColors} from '../../../Theme/Colors/appColors';
import {useFocusEffect, useRoute} from '@react-navigation/native';
import {userServices} from '../../Services/userService';
import {UserInfo} from '../../Untils/UserInfo';
import CarUserComponent from '../../Friends/Components/CarUserComponent';
import {useDispatch, useSelector} from 'react-redux';
import {addAuth, authSelector} from '../../../redux/reducers/authReducer';
import {friendServices} from '../../Services/friendService.';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AddFriendModal from '../../Modal/AddFriendModal';
import DropdownPicker from '../../Components/DropdownPicker';
import {notificationServices} from '../../Services/notificationServices';
import {useAsyncStorage} from '@react-native-async-storage/async-storage';
const MemberGroup = ({navigation}: any) => {
  const auth = useSelector(authSelector);
  const [userInfo, setUserInfo] = useState<any[]>([]);
  const [addedFriends, setAddedFriends] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [converInfo, setConverInfo] = useState<any>('');
  const {getItem} = useAsyncStorage('ConversationInfo');
  const dispatch = useDispatch();
  const getConversationInfo = useCallback(async () => {
    setConverInfo(await UserInfo.getConversationInfo(getItem));
  }, []);
  useFocusEffect(
    useCallback(() => {
      getConversationInfo();
    }, []),
  );

  const fetchUserInfos = async () => {
    try {
      const res = await userServices.getListUserInfo(converInfo.invitedUsers);
      if (res && res.data) {
        setUserInfo(res.data);
      }
    } catch (error) {
      console.error('fetch use info fail: ', error);
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
  const shouldShowAddFriendIcon = (userId: string) => {
    return (
      !auth.friends.includes(userId) &&
      auth.userId !== userId &&
      !addedFriends.includes(userId)
    );
  };
  const onPressCarUser = (item: any) => {
    navigation.navigate('PersonalScreen', {
      userId: item.userId,
    });
  };

  const renderUserInfo = ({item, index}: any) => {

    return (
      <CarUserComponent
        authori={
          item.userId === converInfo.leader.userId
            ? 'Trưởng nhóm'
            : item.userId === converInfo.deputyLeader.userId
            ? 'Phó nhóm'
            : 'Thành viên'
        }
        url={item.avatar}
        addFriend={
          !item.friendRequests.includes(auth.userId) &&
          shouldShowAddFriendIcon(item.userId)
        }
        userName={UserInfo.getName(item.name)}
        onPress={() => onPressCarUser(item)}
        onPressAdd={() => handleAddFriend(item.userId)}
      />
    );
  };

  const handleInviteToGroup = async (selectUser: string[]) => {
    try {
      const res = await notificationServices.inviteToGroup(
        selectUser,
        auth.userId,
        converInfo.groupName,
      );
      if (res && res.data) {
        console.log(res.data);
      }
    } catch (error) {
      console.log('Invite to group error: ', error);
    }
  };

  useEffect(() => {
    if (converInfo) {
      fetchUserInfos();
    }
  }, [converInfo]);

  return (
    <KeyboardAvoidingView style={[globalStyles.container]}>
      <HeaderComponent
        iconStyle
        iconLeft={
          <ArrowLeft2 size={appInfo.sizeIconBold} color={appColors.blueBack} />
        }
        iconQR={
          <MaterialIcons
            name="add-reaction"
            size={appInfo.sizeIconBold}
            color={appColors.blue3}
          />
        }
        onPressQR={() => setIsVisible(true)}
        iconRight={
          <SearchFavorite1
            size={appInfo.sizeIconBold}
            color={appColors.blueBack}
          />
        }
        onPress2={() => navigation.navigate('SearchFriends', {users: userInfo})}
      />
      <View style={{marginHorizontal: 12}}>
        <TextComponent label="Thành viên" color="black" title />
        <SpaceComponent height={18} />
        <FlatList
          data={userInfo}
          keyExtractor={item => item.userId.toString()}
          renderItem={renderUserInfo}
        />
      </View>

      <AddFriendModal
        userId={auth.userId}
        visible={isVisible}
        onPressInviteToGroup={handleInviteToGroup}
        existingUser={converInfo.invitedUsers}
        onClose={() => setIsVisible(false)}
      />
    </KeyboardAvoidingView>
  );
};

export default MemberGroup;

const styles = StyleSheet.create({});

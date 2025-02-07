import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useCallback, useState} from 'react';
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
import {useSelector} from 'react-redux';
import {authSelector} from '../../../redux/reducers/authReducer';
import {friendServices} from '../../Services/friendService.';

const MemberGroup = ({navigation}: any) => {
  const {invitedUsers, leader, deputyLeader} = useRoute().params as {
    invitedUsers: any[];
    leader: any;
    deputyLeader: any;
  };
  const auth = useSelector(authSelector);
  const [userInfo, setUserInfo] = useState<any[]>([]);
  const [addedFriends, setAddedFriends] = useState<string[]>([]);

  const fetchUserInfos = async () => {
    try {
      const listUser = invitedUsers.map(item => item.userId);
      // console.log('listUser', listUser);
      const res = await userServices.getListUserInfo(listUser);
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
    console.log(item.userId);

    navigation.navigate('PersonalScreen', {
      userId:  item.userId 
    });
  };
  const renderUserInfo = ({item, index}: any) => {
    return (
      <CarUserComponent
        authori={
          item.userId === leader.userId
            ? 'Trưởng nhóm'
            : item.userId === deputyLeader.userId
            ? 'Phó nhóm'
            : 'Thành viên'
        }
        url={item.avatar}
        addFriend={shouldShowAddFriendIcon(item.userId)}
        userName={UserInfo.getName(item.name)}
        onPress={() => onPressCarUser(item)}
        onPressAdd={() => handleAddFriend(item.userId)}
      />
    );
  };
  useFocusEffect(
    useCallback(() => {
      fetchUserInfos();
    }, []),
  );
  // console.log(userInfo[0]);

  return (
    <SafeAreaView style={[globalStyles.container]}>
      <HeaderComponent
        iconStyle
        iconLeft={
          <ArrowLeft size={appInfo.sizeIconBold} color={appColors.blueBack} />
        }
        iconQR={
          <UserAdd size={appInfo.sizeIconBold} color={appColors.blueBack} />
        }
        iconRight={
          <SearchFavorite1
            size={appInfo.sizeIconBold}
            color={appColors.blueBack}
          />
        }
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
    </SafeAreaView>
  );
};

export default MemberGroup;

const styles = StyleSheet.create({});

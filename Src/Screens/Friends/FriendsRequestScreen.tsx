import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useMemo, useState} from 'react';
import {FlatList, SafeAreaView, ScrollView, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import usersAPI from '../../apis/usersApi';
import {authSelector} from '../../redux/reducers/authReducer';
import {appColors} from '../../Theme/Colors/appColors';
import {CarUserComponent} from '../Components';
import {userServices} from '../Services/userService';
import {UserInfo} from '../Untils/UserInfo';
import friendsAPI from '../../apis/friendsApi';
import {friendServices} from '../Services/friendService.';

const FriendsRequestScreen = () => {
  const [showTabBar, setshowTabBar] = useState(false);
  const [users, setUsers] = useState<any[]>();
  const memoUser = useMemo(() => users, [users]);
  const auth = useSelector(authSelector);
  const handleScroll = (event: any) => {
    const currenOffset = event.nativeEvent.contentOffset.y;
    currenOffset > 50 ? setshowTabBar(false) : setshowTabBar(true);
  };

  const getUsers = async () => {
    try {
      const res = await userServices.getEquestFriendUsers(
        auth.userId,
        'requests',
      );
      if (res && res.data) {
        setUsers(res.data);
      }
    } catch (error) {
      console.log('Get users api:', error);
    }
  };

  const handleAgreeFriend = async (friendUserId: string) => {
    try {
      const res = await friendServices.handleAgreeFriendShip(
        auth.userId,
        friendUserId,
      );
      if (res) {
        console.log('Agree friend successfully !!!');
      }
      getUsers();
    } catch (error) {
      console.log('FriendsRequestScreen', error);
    }
  };
  const handleRemoveFriend = async (userId: string) => {
    try {
      const res = await friendServices.handlePressRemoveRequest(
        userId,
        auth.userId,
      );
      getUsers();
    } catch (error) {
      console.log('Request remove friend fail: ', error);
    }
  };
  useFocusEffect(
    useCallback(() => {
      getUsers();
    }, []),
  );
  const renderItems = ({item, index}: any) => {
    return (
      <CarUserComponent
        img={item.avatar}
        name={UserInfo.getName(item.name)}
        sayYes="Agree"
        sayNo="Remove"
        key={index}
        onPressYes={() => handleAgreeFriend(item.userId)}
        onPressNo={() => handleRemoveFriend(item.userId)}
      />
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={memoUser}
        keyExtractor={(item: any) => item.userId}
        renderItem={renderItems}
        style={styles.container}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: appColors.background,
    flex: 1,
    paddingHorizontal: 10,
  },
});

export default FriendsRequestScreen;

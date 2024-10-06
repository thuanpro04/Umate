import React, {useCallback, useEffect, useState} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import usersAPI from '../../apis/usersApi';
import {appColors} from '../../Theme/Colors/appColors';
import {CarUserComponent} from '../Components';
import {useSelector} from 'react-redux';
import {authSelector} from '../../redux/reducers/authReducer';
import {UserInfo} from '../Untils/UserInfo';
import {Users} from '../Services/friendService.';
import {useFocusEffect} from '@react-navigation/native';

const FriendsRequestScreen = () => {
  const [showTabBar, setshowTabBar] = useState(false);
  const [users, setUsers] = useState<any[]>();
  const auth = useSelector(authSelector);
  const handleScroll = (event: any) => {
    const currenOffset = event.nativeEvent.contentOffset.y;
    currenOffset > 50 ? setshowTabBar(false) : setshowTabBar(true);
  };

  const getUsers = async () => {
    const url = `/get-all?currentUserID=${auth.userID}&filter=requests`;
    try {
      const res = await Users.getUsers(url);
      if (res) {
        setUsers(res);
      }
    } catch (error) {
      console.log('Get users api:', error);
    }
  };

  const handleAgreeFriend = async (friendID: string) => {
    const url = `/agree-friend`;
    const currentUserID = auth.userID;
    const data = {friendID, currentUserID};
    try {
      const res = await usersAPI.handleUsers(url, data, 'post');
      getUsers();
    } catch (error) {
      console.log('FriendsRequestScreen', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getUsers();
    }, []),
  );

  return (
    <ScrollView
      style={styles.container}
      onScroll={handleScroll}
      scrollEventThrottle={16}>
      {users &&
        users.map((item, index): any => (
          <CarUserComponent
            img={item.avatar}
            name={UserInfo.getName(item.name)}
            sayYes="Agree"
            sayNo="Remove"
            key={index}
            onPressYes={() => handleAgreeFriend(item.userID)}
          />
        ))}
    </ScrollView>
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

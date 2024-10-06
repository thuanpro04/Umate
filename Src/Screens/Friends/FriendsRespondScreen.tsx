import {View, Text, ScrollView, StyleSheet} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {CarUserComponent} from '../Components';
import {appColors} from '../../Theme/Colors/appColors';
import usersAPI from '../../apis/usersApi';
import {authSelector} from '../../redux/reducers/authReducer';
import {useSelector} from 'react-redux';
import {UserInfo} from '../Untils/UserInfo';
import {Users} from '../Services/friendService.';
import {useFocusEffect} from '@react-navigation/native';
import UserInfoModal from '../Modal/UserInfoModal';

const FriendsRespondScreen = () => {
  const [users, setUsers] = useState<any[]>();
  const auth = useSelector(authSelector);
  const [isShowModalUserInfo, setShowModalUserInfo] = useState(false);
  // Sử dụng useFocusEffect để reload mỗi khi trang được focus
  useFocusEffect(
    useCallback(() => {
      handleYourFriends();
    }, []),
  );
  console.log('auth', auth);

  const handleYourFriends = async () => {
    const url = `/get-all?currentUserID=${auth.userID}`;
    try {
      const res = await Users.getUsers(url);
      if (res) {
        console.log('FriendsRespondScreen', res);
        setUsers(res);
      }
    } catch (error) {
      console.log('FriendsRespondScreen', error);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      onScroll={() => {}}
      scrollEventThrottle={16}>
      {users &&
        users.map((item, index): any => (
          <>
            <CarUserComponent
              img={item.avatar}
              name={UserInfo.getName(item.name)}
              key={index}
              isFind
              styles={{borderWidth: 0}}
              onPressEllipsis={() => setShowModalUserInfo(!isShowModalUserInfo)}
            />
            <UserInfoModal
              img={item.avater}
              name={UserInfo.getName(item.name)}
              isVisible={isShowModalUserInfo}
              onClose={()=>setShowModalUserInfo(false)}
            />
          </>
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

export default FriendsRespondScreen;

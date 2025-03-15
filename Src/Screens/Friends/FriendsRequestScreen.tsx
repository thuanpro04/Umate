import {useFocusEffect, useNavigation} from '@react-navigation/native';
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
import {themeSelector} from '../../redux/reducers/themeSlice';
import {useTranslation} from 'react-i18next';

const FriendsRequestScreen = () => {
  const [users, setUsers] = useState<any[]>();
  const memoUser = useMemo(() => users, [users]);
  const auth = useSelector(authSelector);
  const theme: 'light' | 'dark' = useSelector(themeSelector);
  const colors = appColors[theme ?? 'light'];
  const navigation = useNavigation<any>();
  const {t} = useTranslation();
  const getUsers = async () => {
    const res = await userServices.getEquestFriendUsers(
      auth.userId,
      'requests',
    );
    if (res && res.data) {
      setUsers(res.data);
    }
   
  };

  const handleAgreeFriend = async (friendUserId: string) => {
    const res = await friendServices.handleAgreeFriendShip(
      auth.userId,
      friendUserId,
    );
    if (res && res.data) {
      console.log('Agree friend successfully !!!');
      getUsers();
    }
   
  };
  const handleRemoveFriend = async (userId: string) => {
    const res = await friendServices.handlePressRemoveRequest(
      userId,
      auth.userId,
    );
    if (res && res.data) {
      getUsers();
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
  };
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

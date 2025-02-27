import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {globalStyles} from '../../Styles/globalStyle';
import {HeaderComponent} from '../Components';
import {ArrowLeft, More} from 'iconsax-react-native';
import {appInfo} from '../../Theme/appInfo';
import {useSelector} from 'react-redux';
import {themeSelector} from '../../redux/reducers/themeSlice';
import {appColors} from '../../Theme/Colors/appColors';
import CarUserComponent from './Components/CarUserComponent';
import {authSelector} from '../../redux/reducers/authReducer';
import {friendSelector} from '../../redux/reducers/friendSlice';
import {userServices} from '../Services/userService';
import {useFocusEffect} from '@react-navigation/native';
import {MoreVerticalIcon} from 'lucide-react-native';

const FriendScreens = () => {
  const [data, setData] = useState<any[]>([]);
  const theme: 'light' | 'dark' = useSelector(themeSelector);
  const colors = appColors[theme];
  const user = useSelector(friendSelector);
  const menuRef = useRef<any>(null);
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

  const renderItem = ({item, index}: any) => {
    return (
      <CarUserComponent
        icon={<MoreVerticalIcon size={22} color={colors.icon} />}
        authori={item.majoring ?? 'chuyên ngành'}
       
        userName={item.name}
        url={item.avatar}
        onPressMore={() => {}}
      />
    );
  };
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

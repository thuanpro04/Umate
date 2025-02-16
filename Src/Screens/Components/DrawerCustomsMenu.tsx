import {
  View,
  Text,
  Image,
  StyleSheet,
  Platform,
  StatusBar,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {globalStyles} from '../../Styles/globalStyle';
import {TouchableOpacity} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {authSelector, removeAuth} from '../../redux/reducers/authReducer';
import TextComponent from './TextComponent';
import {appColors} from '../../Theme/Colors/appColors';
import {MenuItems} from '../../data/MenuItems';
import RowComponent from './RowComponent';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingModal from '../Modal/LoadingModal';
import {UserInfo} from '../Untils/UserInfo';
import {userServices} from '../Services/userService';
import {HandleNotification} from '../Untils/HandleNotification';

const DrawerCustomsMenu = ({navigation}: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const disPathch = useDispatch();
  const user = useSelector(authSelector);
  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '255214993798-jot48ccnfct32m4n9b1ud0pjgf17ag7p.apps.googleusercontent.com',
    });
  }, []);

  const handleSignOutWithGoogle = async () => {
    try {
      const fcmToken = await AsyncStorage.getItem('fcmtoken');
      if (fcmToken) {
        if (user.fcmTokens && user.fcmTokens.length > 0) {
          // console.log(items);
          let items = [user.fcmTokens]; // Copy mảng gốc
          const index = items.findIndex(e => e === fcmToken);

          if (index !== -1) {
            items.splice(index, 1);
          }

          // await HandleNotification.update(items, user.userId);
        }
      }

      await GoogleSignin.signOut();
      disPathch(removeAuth());
      await AsyncStorage.removeItem('auth');
      const res = await userServices.updateUserStatus(user.userId, false);
      setIsLoading(false);
    } catch (error) {
      console.log('Sign out', error);
      setIsLoading(false);
    }
  };
  const handleShowItemMenu = async (key: string) => {
    switch (key) {
      case 'profile':
        navigation.closeDrawer();
        navigation.navigate('PersonalScreen', {userId: user.userId});
        break;

      case 'friends':
        navigation.closeDrawer();
        navigation.navigate('FriendScreens');
        break;
      case 'settings':
        navigation.closeDrawer();
        navigation.navigate('Setting', {
          screen: 'settings',
        });
        break;
      case 'contactUs':
        navigation.closeDrawer();
        navigation.navigate('ContactUs', {
          screen: 'contactUs',
        });
        break;

      case 'signOut':
        setIsLoading(true);
        await handleSignOutWithGoogle();
        break;
    }
    setIsLoading(false);
  };
  return (
    <View style={localStyle.container}>
      <StatusBar backgroundColor={appColors.background} />
      <TouchableOpacity
        onPress={() => {
          navigation.closeDrawer();
          navigation.navigate('Profile', {
            screen: 'profile',
          });
        }}>
        {user.avatar ? (
          <Image source={{uri: user.avatar}} style={globalStyles.avatar} />
        ) : (
          <Image
            source={require('../../assets/images/User-Icon.jpg')}
            style={globalStyles.avatar}
          />
        )}
        <TextComponent label={UserInfo.getName(user.name)} title size={28} />
      </TouchableOpacity>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={MenuItems}
        style={{flex: 1, marginVertical: 20}}
        keyExtractor={item => item.key}
        renderItem={({item, index}) => (
          <RowComponent
            styles={[localStyle.listItem]}
            key={index}
            onPress={() => handleShowItemMenu(item.key)}>
            {item.icon}
            <TextComponent
              label={item.title}
              styles={localStyle.listItemText}
            />
          </RowComponent>
        )}
      />
      <LoadingModal visible={isLoading} />
    </View>
  );
};

export default DrawerCustomsMenu;
const localStyle = StyleSheet.create({
  container: {
    padding: 18,
    paddingVertical: Platform.OS === 'android' ? StatusBar.currentHeight : 48,
    flex: 1,
    backgroundColor: appColors.background,
  },
  listItem: {
    paddingVertical: 12,
    justifyContent: 'flex-start',
  },
  listItemText: {
    paddingLeft: 12,
  },
});

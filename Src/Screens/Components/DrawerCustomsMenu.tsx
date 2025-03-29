import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FlatList,
  Platform,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { useDispatch, useSelector } from 'react-redux';
import { globalStyles } from '../../Styles/globalStyle';
import { appColors } from '../../Theme/Colors/appColors';
import { MenuItems } from '../../data/MenuItems';
import { authSelector, removeAuth } from '../../redux/reducers/authReducer';
import { removeEvent } from '../../redux/reducers/eventSlice';
import { resetFriend } from '../../redux/reducers/friendSlice';
import {
  profileSelector,
  removeProfile,
} from '../../redux/reducers/profileSlice';
import { themeSelector } from '../../redux/reducers/themeSlice';
import LoadingModal from '../Modal/LoadingModal';
import SocketService from '../Services/SocketService';
import RowComponent from './RowComponent';
import SpaceComponent from './SpaceComponent';
import TextComponent from './TextComponent';
const DrawerCustomsMenu = ({navigation}: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const disPathch = useDispatch();
  const {t} = useTranslation();
  const user = useSelector(profileSelector);
  const auth = useSelector(authSelector);
  const theme: 'light' | 'dark' = useSelector(themeSelector);
  const colors = appColors[theme ?? 'light'];
  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '255214993798-jot48ccnfct32m4n9b1ud0pjgf17ag7p.apps.googleusercontent.com',
    });
  }, []);

  const handleSignOutWithGoogle = async () => {
    try {
      await GoogleSignin.signOut();
      disPathch(removeAuth());
      disPathch(removeEvent());
      disPathch(resetFriend());
      disPathch(removeProfile());
      await AsyncStorage.removeItem('auth');
      await AsyncStorage.removeItem("ConversationInfo")
      // await onLogoutCallService();
      SocketService.disconnect();
      setIsLoading(false);
    } catch (error) {
      console.log('Sign out', error);
      setIsLoading(false);
    }
  };

  const handleShowItemMenu = async (key: string) => {
    switch (key) {
      case 'personal':
        navigation.closeDrawer();
        navigation.navigate('PersonalScreen', {userId: auth.userId});
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
    <View style={[localStyle.container, {backgroundColor: colors.background}]}>
      <StatusBar backgroundColor={appColors.background} />
      <SpaceComponent height={12} />
      <TouchableOpacity>
        {user && user.avatar ? (
          <FastImage
            source={{
              uri: user.avatar,
              priority: FastImage.priority.high,
              cache: FastImage.cacheControl.immutable,
            }}
            style={[globalStyles.userImg, {width: 100, height: 100}]}
          />
        ) : (
          <FastImage
            source={require('../../assets/images/User-Icon.jpg')}
            style={globalStyles.avatar}
          />
        )}
        <SpaceComponent height={12} />
        <TextComponent label={user.name} title size={28} />
      </TouchableOpacity>
      <SpaceComponent height={22} />
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
              label={t(`${item.title}`)}
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
  },
  listItem: {
    paddingBottom: 26,
    justifyContent: 'flex-start',
  },
  listItemText: {
    paddingLeft: 12,
  },
});

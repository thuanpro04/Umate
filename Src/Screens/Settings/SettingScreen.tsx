import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  StyleSheet,
  Alert,
  StatusBar,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {
  Sun,
  Moon,
  User,
  Lock,
  LogOut,
  Globe,
  HelpCircle,
  Trash,
} from 'lucide-react-native';
import AsyncStorage, {
  useAsyncStorage,
} from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';

import {
  setTheme,
  themeSelector,
  toggleTheme,
} from '../../redux/reducers/themeSlice';
import {appColors} from '../../Theme/Colors/appColors';
import {userServices} from '../Services/userService';
import {
  addAuth,
  authSelector,
  removeAuth,
} from '../../redux/reducers/authReducer';
import LoadingModal from '../Modal/LoadingModal';
import {ArrowLeft} from 'iconsax-react-native';
import {appInfo} from '../../Theme/appInfo';
import {SpaceComponent} from '../Components';
import {HandleNotification} from '../Untils/HandleNotification';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {eventSelector, removeEvent} from '../../redux/reducers/eventSlice';
import {friendSelector, removeFriend} from '../../redux/reducers/friendSlice';
import {
  profileSelector,
  removeProfile,
} from '../../redux/reducers/profileSlice';
import {useTranslation} from 'react-i18next';
import {
  languageSelecter,
  setLanguage,
} from '../../redux/reducers/languageSlice';
import i18next from 'i18next';
import {UserInfo} from '../Untils/UserInfo';

const SettingScreen = () => {
  const navigation: any = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const auth = useSelector(authSelector);
  const dispatch = useDispatch();
  const theme: 'light' | 'dark' = useSelector(themeSelector);
  const colors = appColors[theme];
  const profile = useSelector(profileSelector);
  const friend = useSelector(friendSelector);
  const event = useSelector(eventSelector);
  const {t} = useTranslation();
  let parsedData;
  const [isDarkMode, setIsDarkMode] = useState(
    theme === 'light' ? false : true,
  );
  const language: 'vi' | 'en' = useSelector(languageSelecter);
  const [isLanguage, setIsLanguage] = useState(
    language === 'vi' ? false : true,
  );

  const handleThemeToggle = async () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    const res = await userServices.updateThemeforUser(
      auth.userId,
      theme === 'dark' ? 'light' : 'dark',
    );
    if (res && res.data) {
      parsedData = await UserInfo.getUserData();
      parsedData.auth.theme = newTheme;
      await Promise.all([
        dispatch(setTheme(newTheme)),
        AsyncStorage.setItem('userData', JSON.stringify(parsedData)),
      ]);
      console.log('update successfully ', res.data);
    }
    setIsDarkMode(!isDarkMode);
  };
  const handleChangeLanguage = async () => {
    const newLanguage = language === 'vi' ? 'en' : 'vi';
    try {
      const res = await userServices.updateLanguage(
        auth.userId,
        language === 'vi' ? 'en' : 'vi',
      );
      if (res && res.data) {
        parsedData = await UserInfo.getUserData();
        parsedData.auth.language = newLanguage;
        await Promise.all([
          dispatch(setLanguage(newLanguage)),
          AsyncStorage.setItem('userData', JSON.stringify(parsedData)),
        ]);

        i18next.changeLanguage(newLanguage);
        console.log('update language successfully: ', res.data);
      }
      setIsLanguage(!isLanguage);
    } catch (error) {
      console.log('Update language fail: ', error);
    }
  };
  const confirmDeleteAccount = () => {
    Alert.alert(t('confirm'), t('delete_account_confirmation'), [
      {text: t('cancel'), style: 'cancel'},
      {
        text: t('agree'),
        style: 'destructive',
        onPress: () => handleRemoveForUser(),
      },
    ]);
  };

  const handleRemoveForUser = async () => {
    const res = await userServices.handleRemoveUser(auth.userId);
    if (res) {
      console.log('Remove successfully !!');
    }
    await handleLogout();
  };

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      const fcmToken = await AsyncStorage.getItem('fcmtoken');
      if (fcmToken) {
        if (auth.fcmTokens && auth.fcmTokens.length > 0) {
          let items = [auth.fcmToken];
          const index = items.findIndex(e => e === fcmToken);
          if (index !== -1) {
            items.splice(index, 1);
          }
          await HandleNotification.update(items, auth.userId);
        }
      }
      await GoogleSignin.signOut();
      dispatch(removeAuth());
      dispatch(removeEvent());
      dispatch(removeFriend());
      dispatch(removeProfile());
      await AsyncStorage.removeItem('auth');
      const res = await userServices.updateUserStatus(auth.userId, false);
      setIsLoading(false);
    } catch (error) {
      console.log('setting log out error: ', error);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    i18next.changeLanguage(language);
  }, [language]);
  const SettingItem = ({icon: Icon, label, onPress, rightComponent}: any) => (
    <TouchableOpacity
      style={[styles.settingItem, {backgroundColor: colors.card}]}
      onPress={onPress}>
      <View style={styles.itemLeft}>
        <Icon size={24} color={colors.icon} />
        <Text style={[styles.itemLabel, {color: colors.text}]}>{label}</Text>
      </View>
      {rightComponent}
    </TouchableOpacity>
  );
  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <ArrowLeft
        color={colors.icon}
        size={appInfo.sizeIconBold}
        onPress={() => navigation.goBack()}
      />
      <SpaceComponent height={16} />
      <Text style={[styles.header, {color: colors.text}]}>{t('setting')}</Text>

      <SettingItem
        icon={User}
        label={t('personal_information')}
        onPress={() => navigation.navigate('EditProfile')}
      />
      <SettingItem
        icon={isDarkMode ? Moon : Sun}
        label={t('dark_mode')}
        rightComponent={
          <Switch value={isDarkMode} onValueChange={handleThemeToggle} />
        }
      />

      <SettingItem
        icon={Lock}
        label={t('security')}
        onPress={() => navigation.navigate('SecurityScreen')}
      />

      <SettingItem
        icon={Globe}
        label={t('language')}
        rightComponent={
          <Switch value={isLanguage} onValueChange={handleChangeLanguage} />
        }
      />

      <SettingItem
        icon={HelpCircle}
        label={t('help_support')}
        onPress={() => navigation.navigate('SupportScreen')}
      />

      <SettingItem
        icon={Trash}
        label={t('delete_account')}
        onPress={confirmDeleteAccount}
      />

      <SettingItem icon={LogOut} label={t('logout')} onPress={handleLogout} />
      <LoadingModal visible={isLoading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginTop: StatusBar.currentHeight,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
    elevation: 3,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemLabel: {
    marginLeft: 12,
    fontSize: 16,
  },
});

export default SettingScreen;

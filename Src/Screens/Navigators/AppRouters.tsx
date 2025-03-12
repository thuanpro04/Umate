import {View, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useAsyncStorage} from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import {addAuth, authSelector} from '../../redux/reducers/authReducer';
import MainNavigator from './MainNavigator';
import AuthNavigator from './AuthNavigator';
import WelcomtoApp from '../WelcomtoApp';
import Toast from 'react-native-toast-message';
import {ToastConfig} from '../Components';
import {setTheme, themeSelector} from '../../redux/reducers/themeSlice';
import {addProfile} from '../../redux/reducers/profileSlice';
import {addFriend} from '../../redux/reducers/friendSlice';
import {addEvent} from '../../redux/reducers/eventSlice';
import SocketManager from '../../redux/SocketManager';
import {
  languageSelecter,
  setLanguage,
} from '../../redux/reducers/languageSlice';
import i18next from 'i18next';

const AppRouters = () => {
  const {getItem, setItem} = useAsyncStorage('userData');
  const auth = useSelector(authSelector);
  const dispatch = useDispatch();
  const [isShowSplash, setIsShowSplash] = useState(true);
  const theme: 'light' | 'dark' = useSelector(themeSelector);
  const language: 'vi' | 'en' = useSelector(languageSelecter);
  useEffect(() => {
    handleCheckLogin();
    const timeout = setTimeout(() => {
      setIsShowSplash(false);
    }, 1500);
    return () => clearTimeout(timeout);
  }, []);

  const handleCheckLogin = async () => {
    const userData = await getItem();
    if (userData) {
      const parsedData = JSON.parse(userData);
      dispatch(addAuth(parsedData.auth));
      dispatch(addProfile(parsedData.profile));
      dispatch(addFriend(parsedData.friend));
      dispatch(addEvent(parsedData.event));
      dispatch(setTheme(theme));
      dispatch(setLanguage(parsedData.auth.language));
    }
  };

  useEffect(() => {
    i18next.changeLanguage(language);
    
    
  }, [language]);
  return (
    <>
      {isShowSplash ? (
        <WelcomtoApp />
      ) : auth.accesstoken ? (
        <>
          <SocketManager />
          <MainNavigator />
        </>
      ) : (
        <AuthNavigator />
      )}
      <Toast config={ToastConfig(theme)} />
    </>
  );
};

export default AppRouters;

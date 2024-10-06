import {View, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useAsyncStorage} from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import {addAuth, authSelector} from '../../redux/reducers/authReducer';
import MainNavigator from './MainNavigator';
import AuthNavigator from './AuthNavigator';
import WelcomtoApp from '../WelcomtoApp';

const AppRouters = () => {
  const {getItem, setItem} = useAsyncStorage('auth');
  const auth = useSelector(authSelector);
  const dispatch = useDispatch();
  const [isShowSplash, setIsShowSplash] = useState(true);

  useEffect(() => {
    handleCheckLogin();
    const timeout = setTimeout(() => {
      setIsShowSplash(false);
    }, 1500);
    return () => clearTimeout(timeout);
  }, []);
  
  const handleCheckLogin = async () => {
    const res = await getItem();
    console.log('res app routers', res);
    res && dispatch(addAuth(JSON.parse(res)));
  };
  return (
    <>
      {isShowSplash ? (
        <WelcomtoApp />
      ) : auth.accesstoken ? (
        <MainNavigator />
      ) : (
        <AuthNavigator />
      )}
    </>
  );
};

export default AppRouters;
